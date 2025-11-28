import { attachRotateTooltip } from './rotate-tooltip'

describe('attachRotateTooltip', () => {
  let mapMock: any
  let viewMock: any
  let viewport: HTMLElement
  let rotateEl: HTMLElement
  let resetBtn: HTMLElement

  beforeEach(() => {
    viewport = document.createElement('div')

    rotateEl = document.createElement('div')
    rotateEl.className = 'ol-rotate'

    resetBtn = document.createElement('button')
    resetBtn.className = 'ol-rotate-reset'
    resetBtn.setAttribute('title', 'Reset north')
    rotateEl.appendChild(resetBtn)

    viewport.appendChild(rotateEl)
    document.body.appendChild(viewport)

    viewMock = {
      getRotation: jest.fn(() => 0),
      on: jest.fn((event, handler) => handler),
    }

    mapMock = {
      getViewport: () => viewport,
      getView: () => viewMock,
      on: jest.fn((event, handler) => handler),
    }
  })

  afterEach(() => {
    document.body.innerHTML = ''
    jest.clearAllMocks()
  })

  const trigger = (target: HTMLElement, type: string) => {
    const evt = new Event(type, { bubbles: true })
    target.dispatchEvent(evt)
  }

  it('does nothing if rotateTooltip=false', () => {
    attachRotateTooltip(mapMock, { rotateTooltip: false })
    expect(viewport.querySelector('.em-rotate-tooltip')).toBeNull()
  })

  it('creates tooltip inside .ol-rotate', () => {
    attachRotateTooltip(mapMock, { rotateTooltip: true })
    const tooltip = rotateEl.querySelector('.em-rotate-tooltip')
    expect(tooltip).not.toBeNull()
  })

  it('removes the native title attribute on the reset button', () => {
    attachRotateTooltip(mapMock, { rotateTooltip: true })
    expect(resetBtn.hasAttribute('title')).toBe(false)
  })

  it('shows tooltip on hover when facing north', () => {
    attachRotateTooltip(mapMock, { rotateTooltip: true })

    const tooltip = rotateEl.querySelector('.em-rotate-tooltip') as HTMLElement
    viewMock.getRotation.mockReturnValue(0)

    trigger(rotateEl, 'mouseenter')
    expect(tooltip.classList.contains('is-visible')).toBe(true)

    trigger(rotateEl, 'mouseleave')
    expect(tooltip.classList.contains('is-visible')).toBe(false)
  })

  it('shows rotation instructions when rotation=0', () => {
    attachRotateTooltip(mapMock, { rotateTooltip: true })

    const tooltip = rotateEl.querySelector('.em-rotate-tooltip') as HTMLElement
    viewMock.getRotation.mockReturnValue(0)

    trigger(rotateEl, 'mouseenter')
    expect(tooltip.textContent).toContain('Alt + Shift + drag to rotate')
  })

  it('shows "Click to reset" when rotated', () => {
    attachRotateTooltip(mapMock, { rotateTooltip: true })

    const tooltip = rotateEl.querySelector('.em-rotate-tooltip') as HTMLElement
    viewMock.getRotation.mockReturnValue(1)

    trigger(rotateEl, 'mouseenter')
    expect(tooltip.textContent).toBe('Click to reset.')
  })

  it('hides tooltip during map pointerdrag', () => {
    attachRotateTooltip(mapMock, { rotateTooltip: true })

    const tooltip = rotateEl.querySelector('.em-rotate-tooltip') as HTMLElement
    viewMock.getRotation.mockReturnValue(0)

    trigger(rotateEl, 'mouseenter')
    expect(tooltip.classList.contains('is-visible')).toBe(true)

    const pointerDragHandler = mapMock.on.mock.calls.find(
      ([eventName, handler]: [string, (...args: unknown[]) => void]) => eventName === 'pointerdrag',
    )![1]
    pointerDragHandler()

    expect(tooltip.classList.contains('is-visible')).toBe(false)
  })

  it('updates tooltip text on rotation change', () => {
    attachRotateTooltip(mapMock, { rotateTooltip: true })

    const tooltip = rotateEl.querySelector('.em-rotate-tooltip') as HTMLElement

    const changeRotationHandler = viewMock.on.mock.calls.find(
      ([eventName, handler]: [string, (...args: unknown[]) => void]) => eventName === 'change:rotation',
    )![1]

    // First rotation = north
    viewMock.getRotation.mockReturnValue(0)
    changeRotationHandler()
    trigger(rotateEl, 'mouseenter')
    expect(tooltip.textContent).toContain('Alt + Shift + drag to rotate')

    // Now rotated
    viewMock.getRotation.mockReturnValue(1)
    changeRotationHandler()
    trigger(rotateEl, 'mouseenter')
    expect(tooltip.textContent).toBe('Click to reset.')
  })

  it('auto-hide: tooltip does not show if rotate.autoHide=true and rotation!=0', () => {
    attachRotateTooltip(mapMock, {
      rotateTooltip: true,
      rotate: { autoHide: true },
    })

    const tooltip = rotateEl.querySelector('.em-rotate-tooltip') as HTMLElement

    // rotation ≠ north
    viewMock.getRotation.mockReturnValue(0.5)

    trigger(rotateEl, 'mouseenter')
    expect(tooltip.classList.contains('is-visible')).toBe(false)
  })

  it('uses right-drag instructions when olRotationMode="right-drag"', () => {
    attachRotateTooltip(mapMock, {
      rotateTooltip: true,
      olRotationMode: 'right-drag',
    })

    const tooltip = rotateEl.querySelector('.em-rotate-tooltip') as HTMLElement

    viewMock.getRotation.mockReturnValue(0)
    trigger(rotateEl, 'mouseenter')

    expect(tooltip.textContent).toContain('Right-drag or Ctrl + drag to rotate')
  })
})
