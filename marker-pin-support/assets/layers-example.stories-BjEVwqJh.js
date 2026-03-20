import{p as s,s as n}from"./setupMapDemo-DYEP7GMj.js";import"./iframe-CnN9xUAI.js";import"./preload-helper-PPVm8Dsz.js";const l={title:"Components/Map/Layers",parameters:{layout:"fullscreen"},argTypes:{enable3D:{control:"boolean",if:{arg:"renderer",eq:"maplibre"},description:"Only available for MapLibre renderer"},positions:{control:"object",description:"Array of positions (empty array simulates no data)"},showLocations:{control:"boolean",description:"Show Locations layer"},showTracks:{control:"boolean",description:"Show Tracks layer"},showCircles:{control:"boolean",description:"Show Circles layer"},showText:{control:"boolean",description:"Show Text layer"},markerMode:{control:"select",options:["default","pin","pin-with-icon","image","mixed"],description:"Marker rendering mode for LocationsLayer"}},render:o=>{const r=document.createElement("div");return r.classList.add("map-container"),n({container:r,positions:o.positions,enable3D:o.enable3D,markerMode:o.markerMode,controls:{zoomSlider:!0,rotate:"auto-hide",scale:"bar"},showPositions:o.showLocations,showTracks:o.showTracks,showCircles:o.showCircles,showText:o.showText}),r}},e={args:{enable3D:!1,positions:s,showLocations:!0,showTracks:!1,showCircles:!1,showText:!1,markerMode:"default"},parameters:{docs:{source:{language:"njk",transform:o=>`{% from "em-map/macro.njk" import emMap %}

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
}) }}`}}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    enable3D: false,
    positions,
    showLocations: true,
    showTracks: false,
    showCircles: false,
    showText: false,
    markerMode: 'default'
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
}`,...e.parameters?.docs?.source}}};const c=["Example"];export{e as Example,c as __namedExportsOrder,l as default};
