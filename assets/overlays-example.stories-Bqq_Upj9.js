import{p as n,s as o}from"./setupMapDemo-BQJ67gqK.js";import"./iframe-CfAUW8rk.js";import"./preload-helper-PPVm8Dsz.js";const m={title:"Components/Map/Overlays",parameters:{layout:"fullscreen"},argTypes:{renderer:{control:"select",options:["openlayers","maplibre"]},enable3D:{control:"boolean",if:{arg:"renderer",eq:"maplibre"}},usesInternalOverlays:{control:"boolean",description:"Enable click-to-open overlays (injects demo templates automatically)"}},render:e=>{const s=document.createElement("div");s.className="map-container";const a=o({container:s,positions:e.positions,renderer:e.renderer,enable3D:e.enable3D,usesInternalOverlays:e.usesInternalOverlays});return a.addEventListener("map:ready",()=>{const p=a,r=p.olMapInstance;r&&r.once("rendercomplete",()=>{p.fitToAllLayers({padding:40})})}),s}},l={args:{renderer:"openlayers",enable3D:!1,positions:n,usesInternalOverlays:!0},parameters:{docs:{source:{language:"njk",transform:(e,s)=>{const a=s.args,p=a.renderer==="maplibre"?`
  enable3DBuildings: ${a.enable3D},`:"";return`{% from "components/em-map/macro.njk" import emMap %}

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
  renderer: '${a.renderer}',${p}
  usesInternalOverlays: true
}) }}`}}}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
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
}`,...l.parameters?.docs?.source}}};const d=["Example"];export{l as Example,d as __namedExportsOrder,m as default};
