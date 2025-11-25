import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { setupMapDemo } from './setupMapDemo'
import positions from '../../components/map/fixtures/positions.json'

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
    showLocations: { control: 'boolean', description: 'Show Locations layer' },
    showTracks: { control: 'boolean', description: 'Show Tracks layer' },
    showCircles: { control: 'boolean', description: 'Show Circles layer' },
    showText: { control: 'boolean', description: 'Show Text layer' },
  },
  render: args => {
    const container = document.createElement('div')
    container.classList.add('map-container')
    setupMapDemo({
      container,
      positions: args.positions,
      enable3D: args.enable3D,
      controls: {
        zoomSlider: true,
        rotate: 'auto-hide',
        scale: 'bar',
      },
      showPositions: args.showLocations,
      showTracks: args.showTracks,
      showCircles: args.showCircles,
      showText: args.showText,
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
