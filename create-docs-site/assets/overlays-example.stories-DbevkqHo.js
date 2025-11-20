import{p as r,s as n}from"./setupMapDemo-EbFZvqxn.js";import"./iframe-D-d6ZWOE.js";import"./preload-helper-PPVm8Dsz.js";const c={title:"Components/Map/Overlays",parameters:{layout:"fullscreen"},argTypes:{renderer:{control:"select",options:["openlayers","maplibre"]},enable3D:{control:"boolean",if:{arg:"renderer",eq:"maplibre"}},usesInternalOverlays:{control:"boolean",description:"Enable click-to-open overlays (injects demo templates automatically)"}},render:a=>{const e=document.createElement("div");return e.className="map-container",n({container:e,positions:a.positions,renderer:a.renderer,enable3D:a.enable3D,usesInternalOverlays:a.usesInternalOverlays}),e}},s={args:{renderer:"openlayers",enable3D:!1,positions:r,usesInternalOverlays:!0},parameters:{docs:{source:{language:"njk",transform:(a,e)=>{const p=e.args,l=p.renderer==="maplibre"?`
  enable3DBuildings: ${p.enable3D},`:"";return`{% from "components/em-map/macro.njk" import emMap %}

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
  renderer: '${p.renderer}',${l}
  usesInternalOverlays: true
}) }}`}}}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    renderer: 'openlayers',
    enable3D: false,
    positions,
    usesInternalOverlays: true
  },
  parameters: {
    docs: {
      source: {
        language: 'njk',
        transform: (_src: string, context: StoryContext) => {
          const args = context.args as Record<string, any>;
          const enable3D = args.renderer === 'maplibre' ? \`\\n  enable3DBuildings: \${args.enable3D},\` : '';
          return \`{% from "components/em-map/macro.njk" import emMap %}

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
  renderer: '\${args.renderer}',\${enable3D}
  usesInternalOverlays: true
}) }}\`;
        }
      }
    }
  }
}`,...s.parameters?.docs?.source}}};const m=["Example"];export{s as Example,m as __namedExportsOrder,c as default};
