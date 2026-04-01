import{p as s,s as i}from"./setupMapDemo-D4Uq74eX.js";import"./iframe-D4aO8JpS.js";import"./preload-helper-PPVm8Dsz.js";const d={title:"Components/Map/Layers",parameters:{layout:"fullscreen"},argTypes:{enable3D:{control:"boolean",if:{arg:"renderer",eq:"maplibre"},description:"Only available for MapLibre renderer"},positions:{control:"object",description:"Array of positions (empty array simulates no data)"},markerMode:{control:"select",options:["default","pin","pin-with-icon","image","mixed"],description:"Marker rendering mode for LocationsLayer"},showLocations:{control:"boolean",description:"Show Locations layer"},showCircles:{control:"boolean",description:"Show Circles layer"},showText:{control:"boolean",description:"Show Text layer"},showTracks:{control:"boolean",description:"Show Tracks layer"},useDirectionProperty:{control:"boolean",if:{arg:"entryExitEnabled",eq:!0}},entryExitEnabled:{control:"boolean",if:{arg:"showTracks",eq:!0}},entryExitDistance:{control:{type:"number",min:0,max:200,step:5},if:{arg:"entryExitEnabled",eq:!0}}},render:e=>{const r=document.createElement("div");r.classList.add("map-container");const n=i({container:r,positions:e.positions,enable3D:e.enable3D,markerMode:e.markerMode,controls:{zoomSlider:!0,rotate:"auto-hide",scale:"bar"},showPositions:e.showLocations,showCircles:e.showCircles,showText:e.showText,showTracks:e.showTracks,entryExit:{enabled:e.entryExitEnabled,extensionDistanceMeters:e.entryExitDistance,direction:e.useDirectionProperty?{property:"direction",units:"radians"}:void 0}});return n.addEventListener("map:ready",()=>{const t=n,a=t.olMapInstance;a&&a.once("rendercomplete",()=>{t.fitToAllLayers({padding:40})})}),r}},o={args:{enable3D:!1,positions:s,showLocations:!0,showTracks:!1,showCircles:!1,showText:!1,markerMode:"default",entryExitEnabled:!1,entryExitDistance:50,useDirectionProperty:!0},parameters:{docs:{source:{language:"njk",transform:e=>`{% from "em-map/macro.njk" import emMap %}

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
}) }}`}}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
    useDirectionProperty: true
  },
  parameters: {
    docs: {
      source: {
        language: 'njk',
        transform: (_src: string) => {
          return \`{% from "em-map/macro.njk" import emMap %}

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
}) }}\`;
        }
      }
    }
  }
}`,...o.parameters?.docs?.source}}};const m=["Example"];export{o as Example,m as __namedExportsOrder,d as default};
