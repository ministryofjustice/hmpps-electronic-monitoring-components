import DragPan from 'ol/interaction/DragPan'
import { attachDragRotate } from './drag-rotate'

jest.mock('ol/interaction/DragPan', () => {
  return class MockDragPan {
    public setActive = jest.fn()
  }
})

// PointerEvent polyfill for Jest/jsdom
class FakePointerEvent extends Event {
  public clientX: number

  public clientY: number

  public buttons: number

  public ctrlKey: boolean

  constructor(type: string, props: PointerEventInit = {}) {
    super(type, props)

    this.clientX = props.clientX ?? 0
    this.clientY = props.clientY ?? 0
    this.buttons = props.buttons ?? 0
    this.ctrlKey = props.ctrlKey ?? false
  }
}

// @ts-expect-error jsdom does not implement PointerEvent.
global.PointerEvent = FakePointerEvent

describe('attachDragRotate', () => {
  let mapMock: {
    getViewport: () => HTMLElement
    getInteractions: () => { getArray: () => unknown[] }
    getView: () => any
    getPixelFromCoordinate: jest.Mock
    getSize: jest.Mock
  }

  let viewMock: {
    getCenter: jest.Mock
    getRotation: jest.Mock
    setRotation: jest.Mock
  }

  let interactions: any[]
  let viewport: HTMLElement

  beforeEach(() => {
    viewport = document.createElement('div')

    viewport.getBoundingClientRect = () => ({
      x: 0,
      y: 0,
      left: 0,
      top: 0,
      width: 300,
      height: 300,
      right: 300,
      bottom: 300,
      toJSON: () => {},
    })

    viewMock = {
      getCenter: jest.fn(() => [100, 200]),
      getRotation: jest.fn(() => 0),
      setRotation: jest.fn(),
    }

    interactions = [new DragPan()]

    mapMock = {
      getViewport: () => viewport,
      getInteractions: () => ({ getArray: () => interactions }),
      getView: () => viewMock,
      getPixelFromCoordinate: jest.fn(() => [150, 150]),
      getSize: jest.fn(() => [300, 300]),
    }

    jest.clearAllMocks()
    attachDragRotate(mapMock as any)
  })

  // Event helpers

  const fire = (target: HTMLElement | Window, type: string, props: PointerEventInit = {}) => {
    const evt = new FakePointerEvent(type, {
      bubbles: true,
      cancelable: true,
      ...props,
    })
    target.dispatchEvent(evt)
    return evt
  }

  const pointerDown = (props: PointerEventInit = {}) => fire(viewport, 'pointerdown', props)

  const pointerMove = (props: PointerEventInit = {}) => fire(window, 'pointermove', props)

  const pointerUp = (props: PointerEventInit = {}) => fire(window, 'pointerup', props)

  // Tests

  describe('rotation gesture logic', () => {
    it('does not rotate on normal left drag', () => {
      pointerDown({ buttons: 1, ctrlKey: false })
      pointerMove({ buttons: 1, clientX: 200, clientY: 200 })

      expect(viewMock.setRotation).not.toHaveBeenCalled()
    })

    it('rotates on Ctrl + left drag', () => {
      pointerDown({ buttons: 1, ctrlKey: true, clientX: 150, clientY: 150 })
      pointerMove({ buttons: 1, ctrlKey: true, clientX: 180, clientY: 150 })

      expect(viewMock.setRotation).toHaveBeenCalled()
    })

    it('rotates on right-click drag', () => {
      pointerDown({ buttons: 2, clientX: 150, clientY: 150 })
      pointerMove({ buttons: 2, clientX: 120, clientY: 180 })

      expect(viewMock.setRotation).toHaveBeenCalled()
    })
  })

  describe('drag-pan enabling/disabling', () => {
    it('disables DragPan on rotation start', () => {
      const dragPan = interactions[0]

      pointerDown({ buttons: 1, ctrlKey: true, clientX: 150, clientY: 150 })

      expect(dragPan.setActive).toHaveBeenCalledWith(false)
    })

    it('re-enables DragPan on pointerup', () => {
      const dragPan = interactions[0]

      pointerDown({ buttons: 1, ctrlKey: true, clientX: 150, clientY: 150 })
      pointerUp()

      expect(dragPan.setActive).toHaveBeenCalledWith(true)
    })
  })

  it('ignores rotation if map.getSize() returns null', () => {
    mapMock.getSize.mockReturnValue(null)

    pointerDown({ buttons: 1, ctrlKey: true, clientX: 150, clientY: 150 })

    expect(viewMock.setRotation).not.toHaveBeenCalled()
  })
})
