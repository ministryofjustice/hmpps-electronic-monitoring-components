import{p as s,s as t}from"./setupMapDemo-BomtweBa.js";import"./iframe-1vGq8O7p.js";const p={title:"Components/Map/Setup",parameters:{layout:"fullscreen"},argTypes:{renderer:{control:"select",options:["openlayers","maplibre"]},enable3D:{control:"boolean",if:{arg:"renderer",eq:"maplibre"},description:"Only available for MapLibre renderer"},positions:{control:"object",description:"Array of positions (empty array simulates no data)"},usesInternalOverlays:{control:"boolean",description:"Enable click-to-open overlays (injects demo templates automatically)"},"controls.zoomSlider":{control:"boolean"},"controls.rotate":{control:"select",options:["true","auto-hide","false"]},"controls.olRotationMode":{control:"select",options:["default","right-drag"],description:'Rotation gesture mode. "default" = Alt+Shift + left-drag (OpenLayers). "right-drag" = right-drag or Ctrl + left-drag.'},"controls.olRotateTooltip":{control:"boolean",description:"Show rotate gesture tooltip when rotation control is visible"},"controls.scale":{control:"select",options:["bar","line","false"]},"controls.locationDisplay":{control:"select",options:["dms","latlon","false"]},"controls.grabCursor":{control:"boolean"}},render:o=>{const a=document.createElement("div");return a.classList.add("map-container"),t({container:a,positions:o.positions,renderer:o.renderer,enable3D:o.enable3D,usesInternalOverlays:o.usesInternalOverlays,controls:{zoomSlider:o["controls.zoomSlider"],rotate:o["controls.rotate"],olRotationMode:o["controls.olRotationMode"],olRotateTooltip:o["controls.olRotateTooltip"],scale:o["controls.scale"],locationDisplay:o["controls.locationDisplay"],grabCursor:o["controls.grabCursor"]},showPositions:!0,showTracks:!1,showText:!1,showCircles:!1}),a}},i={args:{renderer:"openlayers",enable3D:!0,positions:s,usesInternalOverlays:!0,"controls.zoomSlider":!1,"controls.rotate":"false","controls.olRotationMode":"default","controls.olRotateTooltip":!0,"controls.scale":"false","controls.locationDisplay":"false","controls.grabCursor":!0},parameters:{docs:{source:{language:"njk",transform:(o,a)=>{const e=a.args,l=e.renderer==="maplibre"?`
  enable3DBuildings: ${e.enable3D},`:"";return`{% from "em-map/macro.njk" import emMap %}

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
  renderer: '${e.renderer}',${l}
  usesInternalOverlays: ${e.usesInternalOverlays},
  controls: {
    scaleControl: '${e["controls.scale"]}',
    locationDisplay: '${e["controls.locationDisplay"]}',
    rotateControl: '${e["controls.rotate"]}',
    olRotationMode: '${e["controls.olRotationMode"]}',
    olRotateTooltip: ${e["controls.olRotateTooltip"]},
    zoomSlider: ${e["controls.zoomSlider"]},
    grabCursor: ${e["controls.grabCursor"]}
  }
}) }}`}}}}},c=["Example"];export{i as Example,c as __namedExportsOrder,p as default};
