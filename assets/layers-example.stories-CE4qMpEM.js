import{p as s,s as r}from"./setupMapDemo-AWZk6Eqk.js";import"./iframe-DQSLA7ZZ.js";const n={title:"Components/Map/Layers",parameters:{layout:"fullscreen"},argTypes:{enable3D:{control:"boolean",if:{arg:"renderer",eq:"maplibre"},description:"Only available for MapLibre renderer"},positions:{control:"object",description:"Array of positions (empty array simulates no data)"},showLocations:{control:"boolean",description:"Show Locations layer"},showTracks:{control:"boolean",description:"Show Tracks layer"},showCircles:{control:"boolean",description:"Show Circles layer"},showText:{control:"boolean",description:"Show Text layer"}},render:o=>{const e=document.createElement("div");return e.classList.add("map-container"),r({container:e,positions:o.positions,enable3D:o.enable3D,controls:{zoomSlider:!0,rotate:"auto-hide",scale:"bar"},showPositions:o.showLocations,showTracks:o.showTracks,showCircles:o.showCircles,showText:o.showText}),e}},l={args:{enable3D:!1,positions:s,showLocations:!0,showTracks:!1,showCircles:!1,showText:!1},parameters:{docs:{source:{language:"njk",transform:o=>`{% from "em-map/macro.njk" import emMap %}

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
}) }}`}}}},i=["Example"];export{l as Example,i as __namedExportsOrder,n as default};
