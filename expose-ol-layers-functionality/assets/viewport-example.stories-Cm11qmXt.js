import{s as p,p as m}from"./setupMapDemo-CJnIVxV-.js";import"./iframe-QZtUuydv.js";import"./preload-helper-PPVm8Dsz.js";const T={title:"Components/Map/Viewport",parameters:{layout:"fullscreen"},argTypes:{action:{control:"select",options:["none","fitToPositions","fitToPoints","fitToLayer","fitToLayers","fitToAllLayers","focusOn"]},animation:{control:"select",options:["off","fast","slow"]}},render:a=>{const i=document.createElement("div"),r=document.createElement("div");r.classList.add("map-container");const c=p({container:r,positions:m,showPositions:!0,showTracks:!1,showCircles:!1,showText:!1,includeViewportDemoLayers:!0});function l(t){switch(t){case"off":return{animate:!1};case"fast":return{durationMs:200};case"slow":return{durationMs:1500};default:return{}}}const e={off:"No animation",fast:"Fast animation",slow:"Slow animation"}[a.animation],o=document.createElement("div");switch(o.className="map-demo-info",a.action){case"fitToPositions":o.textContent=`Fits dataset only (base positions) — ${e}`;break;case"fitToPoints":o.textContent=`Fits to a small subset of points — ${e}`;break;case"fitToLayer":o.textContent=`Fits map to specific (green) layer — ${e}`;break;case"fitToLayers":o.textContent=`Fits to BOTH red + green layers — ${e}`;break;case"fitToAllLayers":o.textContent=`Fits to ALL visible layers combined — ${e}`;break;case"focusOn":o.textContent=`Centres map on coordinates — ${e}`;break;default:o.textContent="Select an action"}return c.addEventListener("map:ready",()=>{const t=c,n=l(a.animation);switch(a.action){case"fitToPositions":t.fitToPositions({padding:40,...n});break;case"fitToPoints":t.fitToPoints(t.positions.slice(0,3),{padding:40,...n});break;case"fitToLayer":t.fitToLayer("locations-secondary",{padding:40,...n});break;case"fitToLayers":t.fitToLayers(["locations","locations-secondary"],{padding:80,...n});break;case"fitToAllLayers":t.fitToAllLayers({padding:80,...n});break;case"focusOn":t.focusOn({center:{latitude:53.48,longitude:-2.24},zoom:12,...n});break}}),i.appendChild(o),i.appendChild(r),i}},s={args:{action:"none",animation:"fast"},parameters:{docs:{source:{language:"njk",transform:a=>`{% from "em-map/macro.njk" import emMap %}

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
}) }}

// Viewport API examples
emMap.fitToLayer('locations')
emMap.fitToLayers(['locations', 'tracks'])
emMap.fitToAllLayers({ padding: 40 })
emMap.fitToPoints(positions.slice(0, 3))
emMap.fitToPositions()

emMap.focusOn({
  center: { latitude: 51.5, longitude: -0.12 },
  zoom: 14
})`}}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    action: 'none',
    animation: 'fast'
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
}) }}

// Viewport API examples
emMap.fitToLayer('locations')
emMap.fitToLayers(['locations', 'tracks'])
emMap.fitToAllLayers({ padding: 40 })
emMap.fitToPoints(positions.slice(0, 3))
emMap.fitToPositions()

emMap.focusOn({
  center: { latitude: 51.5, longitude: -0.12 },
  zoom: 14
})\`;
        }
      }
    }
  }
}`,...s.parameters?.docs?.source}}};const y=["Example"];export{s as Example,y as __namedExportsOrder,T as default};
