import type Map from 'ol/Map'

const ROTATE_MESSAGE_RIGHT_DRAG = 'Right-drag or Ctrl + drag to rotate'
const ROTATE_MESSAGE_ALT_SHIFT = 'Alt + Shift + drag to rotate'
const ROTATE_MESSAGE_RESET = 'Click to reset.'

export function attachRotateTooltip(
  map: Map,
  controls: {
    rotateTooltip?: boolean
    rotate?: boolean | { autoHide?: boolean }
    olRotationMode?: 'default' | 'right-drag'
  },
) {
  if (controls.rotateTooltip === false) return

  const rotateEl = map.getViewport().querySelector('.ol-rotate') as HTMLElement | null
  if (!rotateEl) return

  // Remove default browser tooltip
  const resetButton = rotateEl.querySelector('.ol-rotate-reset') as HTMLElement | null
  if (resetButton) resetButton.removeAttribute('title')

  const tooltip = document.createElement('div')
  tooltip.className = 'em-rotate-tooltip'
  rotateEl.appendChild(tooltip)

  const view = map.getView()

  const rotationInstructions =
    controls.olRotationMode === 'right-drag' ? ROTATE_MESSAGE_RIGHT_DRAG : ROTATE_MESSAGE_ALT_SHIFT

  const updateTooltipContent = () => {
    const isNorth = Math.abs(view.getRotation()) < 0.0001
    tooltip.textContent = isNorth ? rotationInstructions : ROTATE_MESSAGE_RESET
  }

  const updateVisibility = (hovering: boolean) => {
    const rotation = view.getRotation()
    const autoHidden = typeof controls.rotate === 'object' && controls.rotate.autoHide === true && rotation !== 0

    const shouldShow = hovering && !autoHidden
    tooltip.classList.toggle('is-visible', shouldShow)

    if (shouldShow) updateTooltipContent()
  }

  // Hover listeners
  rotateEl.addEventListener('mouseenter', () => updateVisibility(true))
  rotateEl.addEventListener('mouseleave', () => updateVisibility(false))

  // Hide during drag
  map.on('pointerdrag', () => updateVisibility(false))

  // Update text when rotation snaps
  view.on('change:rotation', () => {
    updateTooltipContent()
    updateVisibility(false)
  })
}
