import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { setupMapDemo } from './setupMapDemo'
import positions from '../../components/map/fixtures/positions.json'
import type { EmMap } from '../../components/map/scripts/em-map'

const meta: Meta = {
  title: 'Components/Map/Viewport',
  parameters: {
    layout: 'fullscreen',
  },

  argTypes: {
    action: {
      control: 'select',
      options: ['none', 'fitToPositions', 'fitToPoints', 'fitToLayer', 'fitToLayers', 'fitToAllLayers', 'focusOn'],
    },

    animation: {
      control: 'select',
      options: ['off', 'fast', 'slow'],
    },
  },

  render: args => {
    const wrapper = document.createElement('div')

    const container = document.createElement('div')
    container.classList.add('map-container')

    const mapEl = setupMapDemo({
      container,
      positions,
      showPositions: true,
      showTracks: false,
      showCircles: false,
      showText: false,
    })

    // Animation helper
    function getAnimationOptions(mode: string) {
      switch (mode) {
        case 'off':
          return { animate: false }
        case 'fast':
          return { durationMs: 200 }
        case 'slow':
          return { durationMs: 1500 }
        default:
          return {}
      }
    }

    const animationLabel = {
      off: 'No animation',
      fast: 'Fast animation',
      slow: 'Slow animation',
    }[args.animation as 'off' | 'fast' | 'slow']

    // Info panel
    const info = document.createElement('div')
    info.className = 'map-demo-info'

    switch (args.action) {
      case 'fitToPositions':
        info.textContent = `Fits dataset only (base positions) — ${animationLabel}`
        break

      case 'fitToPoints':
        info.textContent = `Fits to a small subset of points — ${animationLabel}`
        break

      case 'fitToLayer':
        info.textContent = `Fits map to specific (green) layer — ${animationLabel}`
        break

      case 'fitToLayers':
        info.textContent = `Fits to BOTH red + green layers — ${animationLabel}`
        break

      case 'fitToAllLayers':
        info.textContent = `Fits to ALL visible layers combined — ${animationLabel}`
        break

      case 'focusOn':
        info.textContent = `Centres map on coordinates — ${animationLabel}`
        break

      default:
        info.textContent = 'Select an action'
    }

    // Run action
    mapEl.addEventListener('map:ready', () => {
      const map = mapEl as EmMap
      const animationOpts = getAnimationOptions(args.animation)

      switch (args.action) {
        case 'fitToPositions':
          map.fitToPositions({
            padding: 40,
            ...animationOpts,
          })
          break

        case 'fitToPoints':
          map.fitToPoints(map.positions.slice(0, 3), {
            padding: 40,
            ...animationOpts,
          })
          break

        case 'fitToLayer':
          map.fitToLayer('locations-secondary', {
            padding: 40,
            ...animationOpts,
          })
          break

        case 'fitToLayers':
          map.fitToLayers(['locations', 'locations-secondary'], {
            padding: 80,
            ...animationOpts,
          })
          break

        case 'fitToAllLayers':
          map.fitToAllLayers({
            padding: 80,
            ...animationOpts,
          })
          break

        case 'focusOn':
          map.focusOn({
            center: { latitude: 53.48, longitude: -2.24 },
            zoom: 12,
            ...animationOpts,
          })
          break

        case 'none':
        default:
          break
      }
    })

    wrapper.appendChild(info)
    wrapper.appendChild(container)

    return wrapper
  },
}

export default meta

type Story = StoryObj

export const Example: Story = {
  args: {
    action: 'none',
    animation: 'fast',
  },

  parameters: {
    docs: {
      source: {
        language: 'njk',
        transform: (_src: string) => {
          return `{% from "em-map/macro.njk" import emMap %}

{{ emMap({
  alerts: alerts,
  cspNonce: cspNonce,
  positions: positions,
  controls: {
    scaleControl: 'bar',
    locationDisplay: 'latlon',
    rotateControl: 'auto-hide',
    zoomSlider: true
  }
}) }}

// Viewport API examples
emMap.fitToLayer('locations')
emMap.fitToLayers(['locations', 'tracks'])
emMap.fitToAllLayers({ padding: 40 })
emMap.fitToPoints(positions.slice(0, 3))
emMap.fitToPositions()

emMap.focusOn({
  center: { latitude: 51.5, longitude: -0.12 },
  zoom: 14
})`
        },
      },
    },
  },
}
