import type Map from 'ol/Map'
import DragPan from 'ol/interaction/DragPan'

// Ctrl + left drag and Right-click drag (mouse or trackpad “secondary”) to rotate the map
export function attachDragRotate(map: Map): void {
  const viewport = map.getViewport()

  let rotating = false
  let lastAngle = 0
  let anchorX = 0
  let anchorY = 0

  // Find DragPan so we can disable pan during rotation
  const interactions = map.getInteractions().getArray()
  const dragPan = interactions.find(interaction => {
    return interaction instanceof DragPan
  }) as DragPan | undefined

  const setPanEnabled = (enabled: boolean): void => {
    if (dragPan) dragPan.setActive(enabled)
  }

  // Based on ol/interaction/DragRotate
  const computeAngle = (event: PointerEvent): number => {
    const rect = viewport.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    return Math.atan2(y - anchorY, x - anchorX)
  }

  const onPointerDown = (event: PointerEvent): void => {
    const isLeft = event.buttons === 1
    const isRight = event.buttons === 2

    const ctrlLeft = event.ctrlKey && isLeft
    const rightDrag = !event.ctrlKey && isRight

    if (!ctrlLeft && !rightDrag) return

    const view = map.getView()
    const size = map.getSize()
    if (!size) return

    const [cx, cy] = map.getPixelFromCoordinate(view.getCenter()!)!
    anchorX = cx
    anchorY = cy

    lastAngle = computeAngle(event)
    rotating = true
    setPanEnabled(false)

    event.preventDefault()
    event.stopPropagation()
  }

  const onPointerMove = (e: PointerEvent): void => {
    if (!rotating) return

    const angle = computeAngle(e)
    const delta = angle - lastAngle
    lastAngle = angle

    const view = map.getView()
    view.setRotation(view.getRotation() + delta)

    e.preventDefault()
    e.stopPropagation()
  }

  const onPointerUp = (): void => {
    if (!rotating) return
    rotating = false
    setPanEnabled(true)
  }

  viewport.addEventListener('pointerdown', onPointerDown, { passive: false })
  window.addEventListener('pointermove', onPointerMove, { passive: false })
  window.addEventListener('pointerup', onPointerUp)

  viewport.addEventListener('contextmenu', e => e.preventDefault())
}
