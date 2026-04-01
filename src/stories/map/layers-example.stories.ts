import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { setupMapDemo } from './setupMapDemo'
import positions from '../../components/map/fixtures/positions.json'
import type { EmMap } from '../../components/map/scripts/em-map'

const meta = {
  title: 'Components/Map/Layers',
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    enable3D: {
      control: 'boolean',
      if: { arg: 'renderer', eq: 'maplibre' },
      description: 'Only available for MapLibre renderer',
    },
    positions: {
      control: 'object',
      description: 'Array of positions (empty array simulates no data)',
    },
    markerMode: {
      control: 'select',
      options: ['default', 'pin', 'pin-with-icon', 'image', 'mixed'],
      description: 'Marker rendering mode for LocationsLayer',
    },
    showLocations: { control: 'boolean', description: 'Show Locations layer' },
    showCircles: { control: 'boolean', description: 'Show Circles layer' },
    showText: { control: 'boolean', description: 'Show Text layer' },
    showTracks: { control: 'boolean', description: 'Show Tracks layer' },
    useDirectionProperty: {
      control: 'boolean',
      if: { arg: 'entryExitEnabled', eq: true },
    },
    entryExitEnabled: {
      control: 'boolean',
      if: { arg: 'showTracks', eq: true },
    },
    entryExitDistance: {
      control: { type: 'number', min: 0, max: 200, step: 5 },
      if: { arg: 'entryExitEnabled', eq: true },
    },
  },
  render: args => {
    const container = document.createElement('div')
    container.classList.add('map-container')

    const mapEl = setupMapDemo({
      container,
      positions: args.positions,
      enable3D: args.enable3D,
      markerMode: args.markerMode,
      controls: {
        zoomSlider: true,
        rotate: 'auto-hide',
        scale: 'bar',
      },
      showPositions: args.showLocations,
      showCircles: args.showCircles,
      showText: args.showText,
      showTracks: args.showTracks,
      entryExit: {
        enabled: args.entryExitEnabled,
        extensionDistanceMeters: args.entryExitDistance,
        direction: args.useDirectionProperty
          ? {
              property: 'direction',
              units: 'radians',
            }
          : undefined,
      },
    })

    mapEl.addEventListener('map:ready', () => {
      const emMap = mapEl as EmMap
      const olMap = emMap.olMapInstance
      if (!olMap) return

      // Wait for OL render
      olMap.once('rendercomplete', () => {
        emMap.fitToAllLayers({
          padding: 40,
        })
      })
    })

    return container
  },
} satisfies Meta

export default meta
type Story = StoryObj

export const Example: Story = {
  args: {
    enable3D: false,
    positions,
    showLocations: true,
    showTracks: false,
    showCircles: false,
    showText: false,
    markerMode: 'default',
    entryExitEnabled: false,
    entryExitDistance: 50,
    useDirectionProperty: true,
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
}) }}`
        },
      },
    },
  },
}
