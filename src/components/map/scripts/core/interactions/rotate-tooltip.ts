import type Map from 'ol/Map'

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

  // Remove native browser hover tooltip so not fighting with custom tooltip
  const resetButton = rotateEl.querySelector('.ol-rotate-reset') as HTMLElement | null
  if (resetButton) resetButton.removeAttribute('title')

  const tooltip = document.createElement('div')
  tooltip.className = 'em-rotate-tooltip'

  tooltip.textContent =
    controls.olRotationMode === 'right-drag'
      ? 'Right-drag or Ctrl + drag to rotate. Click to reset.'
      : 'Alt + Shift + drag to rotate. Click to reset.'

  rotateEl.appendChild(tooltip)

  const view = map.getView()

  const updateVisibility = (hovering: boolean) => {
    const autoHidden = typeof controls.rotate === 'object' && controls.rotate.autoHide === true

    const shouldShow = hovering && !autoHidden

    tooltip.classList.toggle('is-visible', shouldShow)
  }

  rotateEl.addEventListener('mouseenter', () => updateVisibility(true))
  rotateEl.addEventListener('mouseleave', () => updateVisibility(false))

  map.on('pointerdrag', () => updateVisibility(false))
  view.on('change:rotation', () => updateVisibility(false))
}
