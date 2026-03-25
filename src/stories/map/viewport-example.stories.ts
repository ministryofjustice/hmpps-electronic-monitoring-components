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

    // Info panel to explain what each action does
    const info = document.createElement('div')
    info.className = 'map-demo-info'

    switch (args.action) {
      case 'fitToPositions':
        info.textContent = 'Fits all original positions passed to the map - not added markers or layers'
        break
      case 'fitToPoints':
        info.textContent = 'Fits to a small subset of points'
        break
      case 'fitToLayer':
        info.textContent = 'Fits map to specific (Green) layer'
        break
      case 'fitToLayers':
        info.textContent = 'Fits to BOTH red + green layers'
        break
      case 'fitToAllLayers':
        info.textContent = 'Fits to ALL visible layers data combined'
        break
      case 'focusOn':
        info.textContent = 'Centres map based on specified coordinates, with specified zoom level'
        break
      default:
        info.textContent = 'Select an action'
    }

    // Run the selected viewport action once the map is ready
    mapEl.addEventListener('map:ready', () => {
      const map = mapEl as EmMap

      setTimeout(() => {
        switch (args.action) {
          case 'fitToPositions':
            map.fitToPositions({ padding: 40 })
            break

          case 'fitToPoints':
            map.fitToPoints(map.positions.slice(0, 3), {
              padding: 40,
            })
            break

          case 'fitToLayer':
            map.fitToLayer('locations-secondary', { padding: 40 })
            break

          case 'fitToLayers':
            map.fitToLayers(['locations', 'locations-secondary'], {
              padding: 80,
            })
            break

          case 'fitToAllLayers':
            map.fitToAllLayers({ padding: 80 })
            break

          case 'focusOn':
            map.focusOn({
              center: { latitude: 53.48, longitude: -2.24 },
              zoom: 12,
            })
            break

          case 'none':
          default:
            break
        }
      }, 100)
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
    action: 'fitToLayer',
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
})

emMap.zoomTo({ zoom: 5 })`
        },
      },
    },
  },
}
