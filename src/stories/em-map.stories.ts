import type { Meta, StoryObj, StoryContext } from '@storybook/web-components-vite'
import { setupMapDemo } from '../sandbox/setupMapDemo'
import positions from '../components/map/fixtures/positions.json'

const meta = {
  title: 'Components/Map',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      source: {
        language: 'njk',
      },
    },
  },
  argTypes: {
    renderer: { control: 'select', options: ['openlayers', 'maplibre'] },
    enable3D: {
      control: 'boolean',
      if: { arg: 'renderer', eq: 'maplibre' },
      description: 'Only available for MapLibre renderer',
    },
    positions: {
      control: 'object',
      description: 'Array of position features (empty array to simulate missing data)',
    },
    showPositions: {
      control: 'boolean',
      if: { arg: 'positions', truthy: true },
    },
    showTracks: {
      control: 'boolean',
      if: { arg: 'positions', truthy: true },
    },
    showNumbers: {
      control: 'boolean',
      if: { arg: 'positions', truthy: true },
    },
    showCircles: {
      control: 'boolean',
      if: { arg: 'positions', truthy: true },
    },
    'controls.zoomSlider': { control: 'boolean' },
    'controls.rotate': { control: 'select', options: ['true', 'auto-hide', 'false'] },
    'controls.scale': { control: 'select', options: ['bar', 'line', 'false'] },
    'controls.locationDisplay': { control: 'select', options: ['dms', 'latlon', 'false'] },
    'controls.grabCursor': { control: 'boolean' },
  },
  render: args => {
    const container = document.createElement('div')
    container.style.height = '100vh'
    setupMapDemo({
      container,
      positions: args.positions,
      showPositions: args.showPositions,
      showTracks: args.showTracks,
      showNumbers: args.showNumbers,
      showCircles: args.showCircles,
      renderer: args.renderer,
      enable3D: args.enable3D,
      controls: {
        zoomSlider: args['controls.zoomSlider'],
        rotate: args['controls.rotate'],
        scale: args['controls.scale'],
        locationDisplay: args['controls.locationDisplay'],
        grabCursor: args['controls.grabCursor'],
      },
    })
    return container
  },
} satisfies Meta

export default meta

type Story = StoryObj

export const Default: Story = {
  args: {
    renderer: 'openlayers',
    enable3D: true,
    positions,
    showPositions: true,
    showTracks: false,
    showNumbers: false,
    showCircles: false,
    'controls.zoomSlider': 'false',
    'controls.rotate': 'false',
    'controls.scale': 'false',
    'controls.locationDisplay': 'false',
    'controls.grabCursor': 'true',
  },
  parameters: {
    docs: {
      source: {
        language: 'njk',
        transform: (_src: string, context: StoryContext) => {
          const args = context.args as Record<string, any>

          const enable3D = args.renderer === 'maplibre' ? `\n  enable3DBuildings: ${args.enable3D},` : ''

          return `{% from "components/em-map/macro.njk" import emMap %}

{{ emMap({
  alerts: alerts,
  cspNonce: cspNonce,
  positions: positions,
  renderer: '${args.renderer}',${enable3D}
  usesInternalOverlays: true,
  controls: {
    scaleControl: '${args['controls.scale']}',
    locationDisplay: '${args['controls.locationDisplay']}',
    rotateControl: '${args['controls.rotate']}',
    zoomSlider: ${args['controls.zoomSlider']},
    grabCursor: ${args['controls.grabCursor']}
  }
}) }}`
        },
      },
    },
  },
}
