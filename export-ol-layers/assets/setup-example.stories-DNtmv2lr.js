import{p as t,s as n}from"./setupMapDemo-D4Uq74eX.js";import"./iframe-D4aO8JpS.js";import"./preload-helper-PPVm8Dsz.js";const d={title:"Components/Map/Setup",parameters:{layout:"fullscreen"},argTypes:{renderer:{control:"select",options:["openlayers","maplibre"]},enable3D:{control:"boolean",if:{arg:"renderer",eq:"maplibre"},description:"Only available for MapLibre renderer"},positions:{control:"object",description:"Array of positions (empty array simulates no data)"},usesInternalOverlays:{control:"boolean",description:"Enable click-to-open overlays (injects demo templates automatically)"},"controls.zoomSlider":{control:"boolean"},"controls.rotate":{control:"select",options:["true","auto-hide","false"]},"controls.olRotationMode":{control:"select",options:["default","right-drag"],description:'Rotation gesture mode. "default" = Alt+Shift + left-drag (OpenLayers). "right-drag" = right-drag or Ctrl + left-drag.'},"controls.olRotateTooltip":{control:"boolean",description:"Show rotate gesture tooltip when rotation control is visible"},"controls.scale":{control:"select",options:["bar","line","false"]},"controls.locationDisplay":{control:"select",options:["dms","latlon","false"]},"controls.grabCursor":{control:"boolean"}},render:o=>{const e=document.createElement("div");e.classList.add("map-container");const a=n({container:e,positions:o.positions,renderer:o.renderer,enable3D:o.enable3D,usesInternalOverlays:o.usesInternalOverlays,controls:{zoomSlider:o["controls.zoomSlider"],rotate:o["controls.rotate"],olRotationMode:o["controls.olRotationMode"],olRotateTooltip:o["controls.olRotateTooltip"],scale:o["controls.scale"],locationDisplay:o["controls.locationDisplay"],grabCursor:o["controls.grabCursor"]},showPositions:!0,showTracks:!1,showText:!1,showCircles:!1});return a.addEventListener("map:ready",()=>{const s=a,r=s.olMapInstance;r&&r.once("rendercomplete",()=>{s.fitToAllLayers({padding:40})})}),e}},l={args:{renderer:"openlayers",enable3D:!0,positions:t,usesInternalOverlays:!0,"controls.zoomSlider":!1,"controls.rotate":"false","controls.olRotationMode":"default","controls.olRotateTooltip":!0,"controls.scale":"false","controls.locationDisplay":"false","controls.grabCursor":!0},parameters:{docs:{source:{language:"njk",transform:(o,e)=>{const a=e.args,s=a.renderer==="maplibre"?`
  enable3DBuildings: ${a.enable3D},`:"";return`{% from "em-map/macro.njk" import emMap %}

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
  renderer: '${a.renderer}',${s}
  usesInternalOverlays: ${a.usesInternalOverlays},
  controls: {
    scaleControl: '${a["controls.scale"]}',
    locationDisplay: '${a["controls.locationDisplay"]}',
    rotateControl: '${a["controls.rotate"]}',
    olRotationMode: '${a["controls.olRotationMode"]}',
    olRotateTooltip: ${a["controls.olRotateTooltip"]},
    zoomSlider: ${a["controls.zoomSlider"]},
    grabCursor: ${a["controls.grabCursor"]}
  }
}) }}`}}}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    renderer: 'openlayers',
    enable3D: true,
    positions,
    usesInternalOverlays: true,
    'controls.zoomSlider': false,
    'controls.rotate': 'false',
    'controls.olRotationMode': 'default',
    'controls.olRotateTooltip': true,
    'controls.scale': 'false',
    'controls.locationDisplay': 'false',
    'controls.grabCursor': true
  },
  parameters: {
    docs: {
      source: {
        language: 'njk',
        transform: (_src: string, context: StoryContext) => {
          const args = context.args as Record<string, any>;
          const enable3D = args.renderer === 'maplibre' ? \`\\n  enable3DBuildings: \${args.enable3D},\` : '';
          return \`{% from "em-map/macro.njk" import emMap %}

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
  renderer: '\${args.renderer}',\${enable3D}
  usesInternalOverlays: \${args.usesInternalOverlays},
  controls: {
    scaleControl: '\${args['controls.scale']}',
    locationDisplay: '\${args['controls.locationDisplay']}',
    rotateControl: '\${args['controls.rotate']}',
    olRotationMode: '\${args['controls.olRotationMode']}',
    olRotateTooltip: \${args['controls.olRotateTooltip']},
    zoomSlider: \${args['controls.zoomSlider']},
    grabCursor: \${args['controls.grabCursor']}
  }
}) }}\`;
        }
      }
    }
  }
}`,...l.parameters?.docs?.source}}};const m=["Example"];export{l as Example,m as __namedExportsOrder,d as default};
