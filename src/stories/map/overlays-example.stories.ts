import type { Meta, StoryObj, StoryContext } from '@storybook/web-components-vite'
import { setupMapDemo } from '../../sandbox/setupMapDemo'
import positions from '../../components/map/fixtures/positions.json'

const meta = {
  title: 'Components/Map/Overlays',
  parameters: { layout: 'fullscreen' },
  argTypes: {
    renderer: { control: 'select', options: ['openlayers', 'maplibre'] },
    enable3D: { control: 'boolean', if: { arg: 'renderer', eq: 'maplibre' } },
    usesInternalOverlays: {
      control: 'boolean',
      description: 'Enable click-to-open overlays (injects demo templates automatically)',
    },
  },
  render: args => {
    const el = document.createElement('div')
    el.className = 'map-container'
    setupMapDemo({
      container: el,
      positions: args.positions,
      renderer: args.renderer,
      enable3D: args.enable3D,
      usesInternalOverlays: args.usesInternalOverlays,
    })
    return el
  },
} satisfies Meta

export default meta
type Story = StoryObj

export const Example: Story = {
  args: {
    renderer: 'openlayers',
    enable3D: false,
    positions,
    usesInternalOverlays: true,
  },
  parameters: {
    docs: {
      source: {
        language: 'njk',
        transform: (_src: string, context: StoryContext) => {
          const args = context.args as Record<string, any>
          const enable3D = args.renderer === 'maplibre' ? `\n  enable3DBuildings: ${args.enable3D},` : ''

          return `{% from "components/em-map/macro.njk" import emMap %}

{# In your page markup (not in the macro): #}
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

{# Macro usage: #}
{{ emMap({
  alerts: alerts,
  cspNonce: cspNonce,
  positions: positions,
  renderer: '${args.renderer}',${enable3D}
  usesInternalOverlays: true
}) }}`
        },
      },
    },
  },
}
