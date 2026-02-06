import{p as l,s as r}from"./setupMapDemo-BomtweBa.js";import"./iframe-1vGq8O7p.js";const t={title:"Components/Map/Overlays",parameters:{layout:"fullscreen"},argTypes:{renderer:{control:"select",options:["openlayers","maplibre"]},enable3D:{control:"boolean",if:{arg:"renderer",eq:"maplibre"}},usesInternalOverlays:{control:"boolean",description:"Enable click-to-open overlays (injects demo templates automatically)"}},render:a=>{const e=document.createElement("div");return e.className="map-container",r({container:e,positions:a.positions,renderer:a.renderer,enable3D:a.enable3D,usesInternalOverlays:a.usesInternalOverlays}),e}},i={args:{renderer:"openlayers",enable3D:!1,positions:l,usesInternalOverlays:!0},parameters:{docs:{source:{language:"njk",transform:(a,e)=>{const s=e.args,p=s.renderer==="maplibre"?`
  enable3DBuildings: ${s.enable3D},`:"";return`{% from "components/em-map/macro.njk" import emMap %}

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
  renderer: '${s.renderer}',${p}
  usesInternalOverlays: true
}) }}`}}}}},c=["Example"];export{i as Example,c as __namedExportsOrder,t as default};
