import type { Meta, StoryObj, StoryContext } from '@storybook/web-components-vite'
import { setupMapDemo } from './setupMapDemo'
import positions from '../../components/map/fixtures/positions.json'

const meta = {
  title: 'Components/Map/Setup',
  parameters: {
    layout: 'fullscreen',
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
      description: 'Array of positions (empty array simulates no data)',
    },
    usesInternalOverlays: {
      control: 'boolean',
      description: 'Enable click-to-open overlays (injects demo templates automatically)',
    },
    'controls.zoomSlider': { control: 'boolean' },
    'controls.rotate': { control: 'select', options: ['true', 'auto-hide', 'false'] },
    'controls.scale': { control: 'select', options: ['bar', 'line', 'false'] },
    'controls.locationDisplay': { control: 'select', options: ['dms', 'latlon', 'false'] },
    'controls.grabCursor': { control: 'boolean' },
  },
  render: args => {
    const container = document.createElement('div')
    container.classList.add('map-container')

    setupMapDemo({
      container,
      positions: args.positions,
      renderer: args.renderer,
      enable3D: args.enable3D,
      usesInternalOverlays: args.usesInternalOverlays,
      controls: {
        zoomSlider: args['controls.zoomSlider'],
        rotate: args['controls.rotate'],
        scale: args['controls.scale'],
        locationDisplay: args['controls.locationDisplay'],
        grabCursor: args['controls.grabCursor'],
      },
      showPositions: true,
      showTracks: false,
      showText: false,
      showCircles: false,
    })

    return container
  },
} satisfies Meta

export default meta
type Story = StoryObj

export const Example: Story = {
  args: {
    renderer: 'openlayers',
    enable3D: true,
    positions,
    usesInternalOverlays: true,
    'controls.zoomSlider': false,
    'controls.rotate': 'false',
    'controls.scale': 'false',
    'controls.locationDisplay': 'false',
    'controls.grabCursor': true,
  },
  parameters: {
    docs: {
      source: {
        language: 'njk',
        transform: (_src: string, context: StoryContext) => {
          const args = context.args as Record<string, any>
          const enable3D = args.renderer === 'maplibre' ? `\n  enable3DBuildings: ${args.enable3D},` : ''

          return `{% from "em-map/macro.njk" import emMap %}

{# Overlay templates defined elsewhere on the page (required when usesInternalOverlays=true) #}
<template id="overlay-title-test-location">
  <div><strong>Name (NOMIS ID): {{personName}} ({{personNomisId}})</strong></div>
</template>

<template id="overlay-body-test-location">
  <div class="app-map__overlay-row"><span class="app-map__overlay-label">Speed </span><span class="app-map__overlay-value">{{displaySpeed}}</span></div>
  <div class="app-map__overlay-row"><span class="app-map__overlay-label">Direction </span><span class="app-map__overlay-value">{{displayDirection}}</span></div>
  <div class="app-map__overlay-row"><span class="app-map__overlay-label">Geolocation Mechanism </span><span class="app-map__overlay-value">{{displayGeolocationMechanism}}</span></div>
  <div class="app-map__overlay-row"><span class="app-map__overlay-label">Recorded </span><span class="app-map__overlay-value">{{displayTimestamp}}</span></div>
  <div class="app-map__overlay-row"><span class="app-map__overlay-label">Confidence </span><span class="app-map__overlay-value">{{displayConfidence}}</span></div>
  <div class="app-map__overlay-row"><span class="app-map__overlay-label">Latitude </span><span class="app-map__overlay-value">{{displayLatitude}}</span></div>
  <div class="app-map__overlay-row"><span class="app-map__overlay-label">Longitude </span><span class="app-map__overlay-value">{{displayLongitude}}</span></div>
</template>

{{ emMap({
  alerts: alerts,
  cspNonce: cspNonce,
  positions: positions,
  renderer: '${args.renderer}',${enable3D}
  usesInternalOverlays: ${args.usesInternalOverlays},
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
