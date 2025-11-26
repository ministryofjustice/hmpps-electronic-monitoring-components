import{j as e,M as l,T as t,S as c,C as o,a as h}from"./WithTooltip-SK46ZJ2J-BVyWuKgI.js";import{useMDXComponents as d}from"./index-D_nPwwnz.js";import{Example as i}from"./layers-example.stories-DoeqPFBO.js";import"./preload-helper-PPVm8Dsz.js";import"./iframe-D6Vla_ml.js";import"./setupMapDemo-Dq6UKO8L.js";function r(s){const n={code:"code",h2:"h2",h3:"h3",hr:"hr",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...d(),...s.components};return e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"Components/Map/Layers/Docs"}),`
`,e.jsx(t,{children:"Map layers"}),`
`,e.jsx(c,{children:"Visualising positions, tracks, circles, and text"}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"live-example",children:"Live example"}),`
`,e.jsx(o,{of:i,className:"map-docs-canvas"}),`
`,e.jsx(n.h2,{id:"try-the-options",children:"Try the options"}),`
`,e.jsx(h,{of:i}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"public-api-for-managing-layers",children:"Public API for managing layers"}),`
`,e.jsxs(n.p,{children:["Layers are added/removed through the public methods on the ",e.jsx(n.code,{children:"<em-map>"})," element."]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`// Create a layer (any of LocationsLayer, TracksLayer, CirclesLayer, TextLayer)
// "id" defaults to "locations" if not provided
const layer = new LocationsLayer({
  id: 'locations',
  title: 'Locations',
  positions,
})

// 1) Add: mounts into the map and returns the native OL layer instance (if available)
const olLayer = emMap.addLayer(layer) // -> VectorLayer<...> in OL

// 2) Get: retrieve the wrapper instance by its id
const sameLayer = emMap.getLayer('locations')

// 3) Remove: remove by id *or* by the layer's "title" property
emMap.removeLayer('locations')  // by id
emMap.removeLayer('Locations')  // by title
`})}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Notes"})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["If a layer with the same ",e.jsx(n.code,{children:"id"})," already exists, ",e.jsx(n.code,{children:"addLayer()"})," removes it first, then adds the new one."]}),`
`,e.jsxs(n.li,{children:["The return value of ",e.jsx(n.code,{children:"addLayer()"})," is the ",e.jsx(n.strong,{children:"native"})," OpenLayers layer (when applicable), which is useful if you want to call OpenLayers APIs directly."]}),`
`]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"available-layers",children:"Available layers"}),`
`,e.jsxs("table",{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Layer"}),e.jsx("th",{children:"Description"}),e.jsx("th",{children:"Geometry"}),e.jsx("th",{children:"Default id"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"LocationsLayer"})}),e.jsxs("td",{children:["Renders ",e.jsx("strong",{children:"Point"})," positions as circles."]}),e.jsx("td",{children:"Point"}),e.jsx("td",{children:e.jsx("code",{children:"locations"})})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"TracksLayer"})}),e.jsxs("td",{children:["Composite for ",e.jsx("strong",{children:"LineString"})," tracks with directional arrows."]}),e.jsx("td",{children:"LineString"}),e.jsx("td",{children:e.jsx("code",{children:"tracks"})})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"CirclesLayer"})}),e.jsx("td",{children:"Renders circles from point positions (e.g. confidence radius)."}),e.jsx("td",{children:"Point → Circle"}),e.jsx("td",{children:e.jsx("code",{children:"circles"})})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"TextLayer"})}),e.jsxs("td",{children:["Paints labels (e.g. ",e.jsx("code",{children:"label"}),") next to points."]}),e.jsx("td",{children:"Point"}),e.jsx("td",{children:e.jsx("code",{children:"text"})})]})]})]}),`
`,e.jsx("p",{children:e.jsx("em",{children:"MapLibre support is planned; these layers currently attach to OpenLayers."})}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"quick-start-full-example",children:"Quick start (full example)"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`import type { EmMap } from '@ministryofjustice/hmpps-electronic-monitoring-components/map'
import {
  LocationsLayer,
  TracksLayer,
  CirclesLayer,
  TextLayer,
} from '@ministryofjustice/hmpps-electronic-monitoring-components/map/layers'
import { isEmpty } from 'ol/extent'

const emMap = document.querySelector('em-map') as EmMap

await new Promise<void>(resolve => {
  emMap.addEventListener('map:ready', () => resolve(), { once: true })
})

const ol = emMap.olMapInstance
const positions = emMap.positions
if (!ol || !positions?.length) return

const locations = emMap.addLayer(new LocationsLayer({ positions, title: 'Locations' }))
emMap.addLayer(new TracksLayer({ positions, visible: false, title: 'Tracks' }))
emMap.addLayer(new CirclesLayer({ positions, visible: false, title: 'Confidence circles' }))
emMap.addLayer(new TextLayer({ positions, visible: false, title: 'Text' }))

// Fit to locations
const src = locations?.getSource()
if (src) {
  const extent = src.getExtent()
  if (!isEmpty(extent)) {
    ol.getView().fit(extent, { maxZoom: 16, padding: [30, 30, 30, 30], size: ol.getSize() })
  }
}
`})}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"shared-options-all-layers",children:"Shared options (all layers)"}),`
`,e.jsx(n.p,{children:"Each layer type supports a common base set:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx("code",{children:"id?: string"})," — unique id (defaults to layer type: ",e.jsx("code",{children:"locations"})," / ",e.jsx("code",{children:"tracks"})," / ",e.jsx("code",{children:"circles"})," / ",e.jsx("code",{children:"text"}),")"]}),`
`,e.jsxs(n.li,{children:[e.jsx("code",{children:"title?: string"})," — human-friendly name (stored in OL layer properties)"]}),`
`,e.jsxs(n.li,{children:[e.jsx("code",{children:"visible?: boolean"})," — initial visibility (defaults vary by layer)"]}),`
`,e.jsxs(n.li,{children:[e.jsx("code",{children:"zIndex?: number"})," — draw order (higher renders above lower)"]}),`
`,e.jsxs(n.li,{children:[e.jsx("code",{children:"positions: Position[]"})," — required input data"]}),`
`]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"style-overrides--quick-examples",children:"Style overrides — quick examples"}),`
`,e.jsx(n.h3,{id:"locationslayer",children:"LocationsLayer"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`emMap.addLayer(new LocationsLayer({
  positions,
  visible: false,
  zIndex: 30,
  style: {
    radius: 10,
    fill: '#28a197',
    stroke: { color: '#003078', width: 3 },
  },
}))
`})}),`
`,e.jsx(n.h3,{id:"trackslayer",children:"TracksLayer"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`emMap.addLayer(new TracksLayer({
  positions,
  visible: true,
  zIndex: 25,
  style: { stroke: { color: '#6f72af' } },
}))
`})}),`
`,e.jsx(n.h3,{id:"circleslayer",children:"CirclesLayer"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`emMap.addLayer(new CirclesLayer({
  positions,
  visible: true,
  zIndex: 20,
  style: {
    fill: 'rgba(255, 191, 71, 0.15)',
    stroke: { color: '#ffbf47', width: 4 },
  },
}))
`})}),`
`,e.jsx(n.h3,{id:"textlayer",children:"TextLayer"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`emMap.addLayer(new TextLayer({
  positions,
  textProperty: 'myLabel',
  visible: true,
  zIndex: 40,
  style: {
    font: '600 12px system-ui, sans-serif',
    fill: '#1d70b8',
    stroke: { color: '#0b0c0c', width: 2 },
    offset: { x: 8, y: 0 },
  },
}))
`})}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"layer-reference",children:"Layer reference"}),`
`,e.jsx(n.h3,{id:"locationslayeroptions",children:e.jsx("code",{children:"LocationsLayer(options)"})}),`
`,e.jsxs("table",{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Option"}),e.jsx("th",{children:"Type"}),e.jsx("th",{children:"Default"}),e.jsx("th",{children:"Description"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"positions"})}),e.jsx("td",{children:e.jsx("code",{children:"Position[]"})}),e.jsx("td",{children:"—"}),e.jsx("td",{children:"Required point inputs."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"id"})}),e.jsx("td",{children:e.jsx("code",{children:"string"})}),e.jsx("td",{children:e.jsx("code",{children:"locations"})}),e.jsx("td",{children:"Unique id."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"title"})}),e.jsx("td",{children:e.jsx("code",{children:"string"})}),e.jsx("td",{children:"—"}),e.jsx("td",{children:"Human-readable name."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"visible"})}),e.jsx("td",{children:e.jsx("code",{children:"boolean"})}),e.jsx("td",{children:e.jsx("code",{children:"true"})}),e.jsx("td",{children:"Initial visibility."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"zIndex"})}),e.jsx("td",{children:e.jsx("code",{children:"number"})}),e.jsx("td",{children:"—"}),e.jsx("td",{children:"Draw order."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"style"})}),e.jsxs("td",{children:[e.jsx("code",{children:"{"})," ",e.jsxs("code",{children:["radius: number; fill: string; stroke: ","{"," color: string; width: number ","}"," ","}"]})]}),e.jsx("td",{children:"—"}),e.jsx("td",{children:"Circle styling."})]})]})]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h3,{id:"trackslayeroptions",children:e.jsx("code",{children:"TracksLayer(options)"})}),`
`,e.jsxs("table",{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Option"}),e.jsx("th",{children:"Type"}),e.jsx("th",{children:"Default"}),e.jsx("th",{children:"Description"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"positions"})}),e.jsx("td",{children:e.jsx("code",{children:"Position[]"})}),e.jsx("td",{children:"—"}),e.jsx("td",{children:"Required line inputs."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"id"})}),e.jsx("td",{children:e.jsx("code",{children:"string"})}),e.jsx("td",{children:e.jsx("code",{children:"tracks"})}),e.jsx("td",{children:"Unique id."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"title"})}),e.jsx("td",{children:e.jsx("code",{children:"string"})}),e.jsx("td",{children:"—"}),e.jsx("td",{children:"Human-readable name."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"visible"})}),e.jsx("td",{children:e.jsx("code",{children:"boolean"})}),e.jsx("td",{children:e.jsx("code",{children:"false"})}),e.jsx("td",{children:"Initial visibility."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"zIndex"})}),e.jsx("td",{children:e.jsx("code",{children:"number"})}),e.jsx("td",{children:"—"}),e.jsx("td",{children:"Draw order."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"style"})}),e.jsxs("td",{children:[e.jsx("code",{children:"{"})," ",e.jsxs("code",{children:["stroke: ","{"," color: string ","}"," ","}"]})]}),e.jsx("td",{children:"—"}),e.jsx("td",{children:"Line + arrow style (colour only exposed)."})]})]})]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h3,{id:"circleslayeroptions",children:e.jsx("code",{children:"CirclesLayer(options)"})}),`
`,e.jsxs("table",{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Option"}),e.jsx("th",{children:"Type"}),e.jsx("th",{children:"Default"}),e.jsx("th",{children:"Description"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"positions"})}),e.jsx("td",{children:e.jsx("code",{children:"Position[]"})}),e.jsx("td",{children:"—"}),e.jsx("td",{children:"Required point inputs."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"id"})}),e.jsx("td",{children:e.jsx("code",{children:"string"})}),e.jsx("td",{children:e.jsx("code",{children:"circles"})}),e.jsx("td",{children:"Unique id."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"title"})}),e.jsx("td",{children:e.jsx("code",{children:"string"})}),e.jsx("td",{children:"—"}),e.jsx("td",{children:"Human-readable name."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"visible"})}),e.jsx("td",{children:e.jsx("code",{children:"boolean"})}),e.jsx("td",{children:e.jsx("code",{children:"false"})}),e.jsx("td",{children:"Initial visibility."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"zIndex"})}),e.jsx("td",{children:e.jsx("code",{children:"number"})}),e.jsx("td",{children:"—"}),e.jsx("td",{children:"Draw order."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"style"})}),e.jsxs("td",{children:[e.jsx("code",{children:"{"})," ",e.jsxs("code",{children:["fill: string; stroke: ","{"," color: string; width: number ","}"," ","}"]})]}),e.jsx("td",{children:"—"}),e.jsx("td",{children:"Fill & stroke styling."})]})]})]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h3,{id:"textlayeroptions",children:e.jsx("code",{children:"TextLayer(options)"})}),`
`,e.jsxs("table",{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Option"}),e.jsx("th",{children:"Type"}),e.jsx("th",{children:"Default"}),e.jsx("th",{children:"Description"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"positions"})}),e.jsx("td",{children:e.jsx("code",{children:"Position[]"})}),e.jsx("td",{children:"—"}),e.jsx("td",{children:"Required point inputs."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"id"})}),e.jsx("td",{children:e.jsx("code",{children:"string"})}),e.jsx("td",{children:e.jsx("code",{children:"text"})}),e.jsx("td",{children:"Unique id."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"title"})}),e.jsx("td",{children:e.jsx("code",{children:"string"})}),e.jsx("td",{children:"—"}),e.jsx("td",{children:"Human-readable name."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"visible"})}),e.jsx("td",{children:e.jsx("code",{children:"boolean"})}),e.jsx("td",{children:e.jsx("code",{children:"false"})}),e.jsx("td",{children:"Initial visibility."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"zIndex"})}),e.jsx("td",{children:e.jsx("code",{children:"number"})}),e.jsx("td",{children:"—"}),e.jsx("td",{children:"Draw order."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"textProperty"})}),e.jsx("td",{children:e.jsx("code",{children:"string"})}),e.jsx("td",{children:e.jsx("code",{children:"label"})}),e.jsx("td",{children:"Feature property to display."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"style"})}),e.jsxs("td",{children:[e.jsx("code",{children:"{"})," ",e.jsxs("code",{children:["font: string; fill: string; stroke: ","{"," color: string; width: number ","}","; offset: ","{"," x: number; y: number ","}"," ","}"]})]}),e.jsx("td",{children:"—"}),e.jsx("td",{children:"Text styling & offset."})]})]})]})]})}function u(s={}){const{wrapper:n}={...d(),...s.components};return n?e.jsx(n,{...s,children:e.jsx(r,{...s})}):r(s)}export{u as default};
