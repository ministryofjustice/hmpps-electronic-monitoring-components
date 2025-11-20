import{p as r,s as n}from"./setupMapDemo-DcYOjUp1.js";import"./iframe-BdvAszW2.js";import"./preload-helper-DPn3E4lc.js";const i={title:"Components/Map/Layers",parameters:{layout:"fullscreen"},argTypes:{enable3D:{control:"boolean",if:{arg:"renderer",eq:"maplibre"},description:"Only available for MapLibre renderer"},positions:{control:"object",description:"Array of positions (empty array simulates no data)"},showLocations:{control:"boolean",description:"Show Locations layer"},showTracks:{control:"boolean",description:"Show Tracks layer"},showCircles:{control:"boolean",description:"Show Circles layer"},showNumbers:{control:"boolean",description:"Show Numbering layer"}},render:o=>{const s=document.createElement("div");return s.classList.add("map-container"),n({container:s,positions:o.positions,enable3D:o.enable3D,controls:{zoomSlider:!0,rotate:"auto-hide",scale:"bar"},showPositions:o.showLocations,showTracks:o.showTracks,showCircles:o.showCircles,showNumbers:o.showNumbers}),s}},e={args:{enable3D:!1,positions:r,showLocations:!0,showTracks:!1,showCircles:!1,showNumbers:!1},parameters:{docs:{source:{language:"njk",transform:o=>`{% from "em-map/macro.njk" import emMap %}

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
    showNumbers: false
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
}`,...e.parameters?.docs?.source}}};const c=["Example"];export{e as Example,c as __namedExportsOrder,i as default};
