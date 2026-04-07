import{u as d,j as e,M as t,T as l,S as c,C as o,a}from"./blocks-CK53JADW.js";import{Example as s}from"./layers-example.stories-B8IH-tRc.js";import"./preload-helper-PPVm8Dsz.js";import"./iframe-DDYEthTP.js";import"./setupMapDemo-Cn9gHzMx.js";function r(i){const n={br:"br",code:"code",h2:"h2",h3:"h3",hr:"hr",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...d(),...i.components};return e.jsxs(e.Fragment,{children:[e.jsx(t,{title:"Components/Map/Layers/Docs"}),`
`,e.jsx(l,{children:"Map layers"}),`
`,e.jsx(c,{children:"Visualising positions, tracks, circles, and text"}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"live-example",children:"Live example"}),`
`,e.jsx(o,{of:s,className:"map-docs-canvas"}),`
`,e.jsx(n.h2,{id:"try-the-options",children:"Try the options"}),`
`,e.jsx(a,{of:s}),`
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
`,e.jsx(n.h2,{id:"marker-types-locationslayer",children:"Marker types (LocationsLayer)"}),`
`,e.jsx(n.h3,{id:"marker-resolution-behaviour",children:"Marker resolution behaviour"}),`
`,e.jsx(n.p,{children:"Markers can be defined at two levels:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Layer-level -> applies to all positions"}),`
`,e.jsx(n.li,{children:"Position-level -> overrides per position"}),`
`]}),`
`,e.jsx(n.p,{children:"The map resolves markers using:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`resolvedMarker = position.marker ?? layer.marker
`})}),`
`,e.jsx(n.h3,{id:"layer-level-markers-uniform-styling",children:"Layer-level markers (uniform styling)"}),`
`,e.jsx(n.p,{children:"Use this when all points should look the same (e.g. crime locations):"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`emMap.addLayer(new LocationsLayer({
  positions,
  marker: {
    type: 'pin',
    pin: { color: '#d4351c' },
  },
}))
`})}),`
`,e.jsx(n.h3,{id:"position-level-markers-mixed-styling",children:"Position-level markers (mixed styling)"}),`
`,e.jsx(n.p,{children:"Use this when each point may differ:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`const positionsWithMarkers = positions.map((p, i) => ({
  ...p,
  marker: i % 2 === 0
    ? { type: 'pin', pin: { color: '#d4351c' } }
    : { type: 'image', image: { src: '/map-icons/person.png' } },
}))

emMap.addLayer(new LocationsLayer({
  positions: positionsWithMarkers,
}))
`})}),`
`,e.jsx(n.p,{children:"Each position controls its own marker."}),`
`,e.jsx(n.h3,{id:"combined-layer-default--overrides",children:"Combined (layer default + overrides)"}),`
`,e.jsx(n.p,{children:"You can combine both — this is the most flexible pattern:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`const positionsWithOverrides = positions.map((p, i) => ({
  ...p,
  marker: i === 0
    ? {
        type: 'image',
        image: { src: '/map-icons/house.png' },
      }
    : undefined,
}))

emMap.addLayer(new LocationsLayer({
  positions: positionsWithOverrides,
  marker: {
    type: 'pin',
    pin: { color: '#1d70b8' },
  },
}))
`})}),`
`,e.jsx(n.p,{children:"Result:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"First point -> image marker"}),`
`,e.jsx(n.li,{children:"All others -> blue pins"}),`
`]}),`
`,e.jsx(n.h3,{id:"default-circle",children:"Default (circle)"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`emMap.addLayer(new LocationsLayer({
  positions,
}))
`})}),`
`,e.jsx(n.h3,{id:"pin-markers",children:"Pin markers"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`emMap.addLayer(new LocationsLayer({
  positions,
  marker: {
    type: 'pin',
    pin: { color: '#d4351c' },
  },
}))
`})}),`
`,e.jsx(n.h3,{id:"pin-with-icon-png-or-svg",children:"Pin with icon (PNG or SVG)"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`emMap.addLayer(new LocationsLayer({
  positions,
  marker: {
    type: 'pin',
    pin: {
      color: '#1d70b8',
      iconSrc: '/map-icons/house.png',
      iconScale: 0.9,
    },
  },
}))
`})}),`
`,e.jsx(n.h3,{id:"image-markers",children:"Image markers"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`emMap.addLayer(new LocationsLayer({
  positions,
  marker: {
    type: 'image',
    image: {
      src: '/map-icons/house.png',
      scale: 0.4,
    },
  },
}))
`})}),`
`,e.jsx(n.h3,{id:"built-in-svg-icons",children:"Built-in SVG icons"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`emMap.addLayer(new LocationsLayer({
  positions,
  marker: {
    type: 'image',
    image: {
      name: 'person',
    },
  },
}))
`})}),`
`,e.jsx(n.p,{children:"Available icons:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"house"}),`
`,e.jsx(n.li,{children:"person"}),`
`]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"text-positioning-behaviour",children:"Text positioning behaviour"}),`
`,e.jsx(n.p,{children:"Text automatically adjusts based on marker type"}),`
`,e.jsxs(n.p,{children:["Text positioning is based on the marker type (",e.jsx(n.code,{children:"point"}),", ",e.jsx(n.code,{children:"pin"}),", or ",e.jsx(n.code,{children:"image"}),").",e.jsx(n.br,{}),`
`,"To enable this behaviour, ensure your positions include a ",e.jsx(n.code,{children:"marker"})," property."]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`const positionsWithMarkers = positions.map(position => ({
  ...position,
  marker: {
    type: 'pin',
    pin: { color: '#d4351c' },
  },
}))

emMap.addLayer(new LocationsLayer({
  positions: positionsWithMarkers,
}))

emMap.addLayer(new TextLayer({
  positions: positionsWithMarkers,
  textProperty: 'crimeType',
}))

\`\`\`ts
emMap.addLayer(new TextLayer({
  positions,
  textProperty: 'crimeType',
}))
`})}),`
`,e.jsx(n.h3,{id:"override-text-positioning",children:"Override text positioning"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`emMap.addLayer(new TextLayer({
  positions,
  textProperty: 'crimeType',
  style: {
    offset: { x: 0, y: 30 },
    textAlign: 'center',
  },
}))
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
`,e.jsx(n.h2,{id:"trackslayer--entryexit-extensions",children:"TracksLayer – Entry/Exit extensions"}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"TracksLayer"})," can render ",e.jsx(n.strong,{children:"entry and exit lines"})," to show direction of travel ",e.jsx(n.strong,{children:"into and out of an area"})," (e.g. a proximity zone)."]}),`
`,e.jsx(n.p,{children:"These lines are derived from:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["the ",e.jsx(n.strong,{children:"first and last positions"})]}),`
`,e.jsxs(n.li,{children:["an optional ",e.jsx(n.strong,{children:"direction property"})]}),`
`,e.jsxs(n.li,{children:["or fallback to ",e.jsx(n.strong,{children:"track geometry"})]}),`
`]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"basic-usage",children:"Basic usage"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`emMap.addLayer(new TracksLayer({
  positions,
  visible: true,

  entryExit: {
    enabled: true,
  },
}))
`})}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"direction-aware-behaviour",children:"Direction-aware behaviour"}),`
`,e.jsx(n.p,{children:"If your data includes a direction (bearing), you can use it.cCan specify degrees or radians:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`emMap.addLayer(new TracksLayer({
  positions,

  entryExit: {
    enabled: true,
    direction: {
      property: 'direction',
      units: 'degrees',
    },
  },
}))
`})}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"behaviour-rules",children:"Behaviour rules"}),`
`,e.jsxs(n.h3,{id:"when-directionproperty-is-provided",children:["When ",e.jsx(n.code,{children:"direction.property"})," is provided"]}),`
`,e.jsxs(n.p,{children:["Entry - Uses ",e.jsx(n.strong,{children:"first point direction"}),`, reversed
Exit - Uses `,e.jsx(n.strong,{children:"last point direction"}),", as-is"]}),`
`,e.jsx(n.hr,{}),`
`,e.jsxs(n.h3,{id:"when-directionproperty-is-not-provided",children:["When ",e.jsx(n.code,{children:"direction.property"})," is NOT provided"]}),`
`,e.jsxs(n.p,{children:["Entry - Uses ",e.jsx(n.strong,{children:"first segment (line between points) direction"}),`, reversed
Exit - Uses `,e.jsx(n.strong,{children:"last segment (line between points) direction"}),", as-is"]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"extension-distance",children:"Extension distance"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`entryExit: {
  enabled: true,
  extensionDistanceMeters: 75,
}
`})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["Default: ",e.jsx(n.strong,{children:"50 metres"})]}),`
`]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"circle-aware-extensions",children:"Circle-aware extensions"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`entryExit: {
  enabled: true,
  extensionDistanceMeters: 100,
  centre: [-2.243, 53.4805],
  radiusMeters: 100,
}
`})}),`
`,e.jsx(n.h3,{id:"behaviour",children:"Behaviour"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["Extends line to ",e.jsx(n.strong,{children:"circle boundary"})]}),`
`,e.jsxs(n.li,{children:["Then continues ",e.jsx(n.strong,{children:"beyond boundary"})]}),`
`]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"notes",children:"Notes"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["Entry/exit are ",e.jsx(n.strong,{children:"additional features"})]}),`
`,e.jsx(n.li,{children:"Do not mutate original track geometry"}),`
`,e.jsx(n.li,{children:"Requires at least 2 points"}),`
`]}),`
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
`,e.jsxs("table",{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Option"}),e.jsx("th",{children:"Type"}),e.jsx("th",{children:"Default"}),e.jsx("th",{children:"Description"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"positions"})}),e.jsx("td",{children:e.jsx("code",{children:"Position[]"})}),e.jsx("td",{children:"—"}),e.jsx("td",{children:"Required point inputs."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"id"})}),e.jsx("td",{children:e.jsx("code",{children:"string"})}),e.jsx("td",{children:e.jsx("code",{children:"locations"})}),e.jsx("td",{children:"Unique id."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"title"})}),e.jsx("td",{children:e.jsx("code",{children:"string"})}),e.jsx("td",{children:"—"}),e.jsx("td",{children:"Human-readable name."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"visible"})}),e.jsx("td",{children:e.jsx("code",{children:"boolean"})}),e.jsx("td",{children:e.jsx("code",{children:"true"})}),e.jsx("td",{children:"Initial visibility."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"zIndex"})}),e.jsx("td",{children:e.jsx("code",{children:"number"})}),e.jsx("td",{children:"—"}),e.jsx("td",{children:"Draw order."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"style"})}),e.jsxs("td",{children:[e.jsx("code",{children:"{"}),e.jsxs("code",{children:[e.jsxs(n.p,{children:[`radius: number;
fill: string | CanvasPattern | CanvasGradient;
stroke: `,"{",`
color?: string;
width?: number;
lineDash?: number[];
lineCap?: CanvasLineCap;
lineJoin?: CanvasLineJoin;
lineDashOffset?: number;
miterLimit?: number;`]}),"}"]}),e.jsx("code",{children:"}"})]}),e.jsx("td",{children:"—"}),e.jsx("td",{children:"Circle styling."})]})]})]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h3,{id:"trackslayeroptions",children:e.jsx("code",{children:"TracksLayer(options)"})}),`
`,e.jsxs("table",{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Option"}),e.jsx("th",{children:"Type"}),e.jsx("th",{children:"Default"}),e.jsx("th",{children:"Description"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"positions"})}),e.jsx("td",{children:e.jsx("code",{children:"Position[]"})}),e.jsx("td",{children:"—"}),e.jsx("td",{children:"Required line inputs."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"id"})}),e.jsx("td",{children:e.jsx("code",{children:"string"})}),e.jsx("td",{children:e.jsx("code",{children:"tracks"})}),e.jsx("td",{children:"Unique id."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"title"})}),e.jsx("td",{children:e.jsx("code",{children:"string"})}),e.jsx("td",{children:"—"}),e.jsx("td",{children:"Human-readable name."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"visible"})}),e.jsx("td",{children:e.jsx("code",{children:"boolean"})}),e.jsx("td",{children:e.jsx("code",{children:"false"})}),e.jsx("td",{children:"Initial visibility."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"zIndex"})}),e.jsx("td",{children:e.jsx("code",{children:"number"})}),e.jsx("td",{children:"—"}),e.jsx("td",{children:"Draw order."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"avoidPositions"})}),e.jsx("td",{children:e.jsx("code",{children:"Position[]"})}),e.jsx("td",{children:e.jsx("code",{children:"positions"})}),e.jsx("td",{children:e.jsxs(n.p,{children:[`Optional. Positions to avoid when rendering directional arrows
(e.g. to prevent arrow overlap with markers or other map features).
Defaults to the main `,e.jsx("code",{children:"positions"})," array."]})})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"style"})}),e.jsxs("td",{children:[e.jsx("code",{children:"{"}),e.jsxs("code",{children:[e.jsxs(n.p,{children:["stroke: ","{",`
color: string`]}),"}"]}),e.jsx("code",{children:"}"})]}),e.jsx("td",{children:"—"}),e.jsx("td",{children:"Line + arrow style (colour only exposed)."})]})]})]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h3,{id:"circleslayeroptions",children:e.jsx("code",{children:"CirclesLayer(options)"})}),`
`,e.jsxs("table",{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Option"}),e.jsx("th",{children:"Type"}),e.jsx("th",{children:"Default"}),e.jsx("th",{children:"Description"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"positions"})}),e.jsx("td",{children:e.jsx("code",{children:"Position[]"})}),e.jsx("td",{children:"—"}),e.jsx("td",{children:"Required point inputs."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"id"})}),e.jsx("td",{children:e.jsx("code",{children:"string"})}),e.jsx("td",{children:e.jsx("code",{children:"circles"})}),e.jsx("td",{children:"Unique id."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"title"})}),e.jsx("td",{children:e.jsx("code",{children:"string"})}),e.jsx("td",{children:"—"}),e.jsx("td",{children:"Human-readable name."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"visible"})}),e.jsx("td",{children:e.jsx("code",{children:"boolean"})}),e.jsx("td",{children:e.jsx("code",{children:"false"})}),e.jsx("td",{children:"Initial visibility."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"zIndex"})}),e.jsx("td",{children:e.jsx("code",{children:"number"})}),e.jsx("td",{children:"—"}),e.jsx("td",{children:"Draw order."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"style"})}),e.jsxs("td",{children:[e.jsx("code",{children:"{"}),e.jsx("code",{children:e.jsxs(n.p,{children:[`fill?: string | CanvasPattern | CanvasGradient | null;
stroke?: `,"{",`
color?: string;
width?: number;
lineDash?: number[];
lineCap?: CanvasLineCap;
lineJoin?: CanvasLineJoin;
lineDashOffset?: number;
miterLimit?: number;
`,"}"," | null"]})}),e.jsx("code",{children:"}"})]}),e.jsx("td",{children:"—"}),e.jsx("td",{children:"Fill & stroke styling."})]})]})]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h3,{id:"textlayeroptions",children:e.jsx("code",{children:"TextLayer(options)"})}),`
`,e.jsxs("table",{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Option"}),e.jsx("th",{children:"Type"}),e.jsx("th",{children:"Default"}),e.jsx("th",{children:"Description"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"positions"})}),e.jsx("td",{children:e.jsx("code",{children:"Position[]"})}),e.jsx("td",{children:"—"}),e.jsx("td",{children:"Required point inputs."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"id"})}),e.jsx("td",{children:e.jsx("code",{children:"string"})}),e.jsx("td",{children:e.jsx("code",{children:"numbering"})}),e.jsx("td",{children:"Unique id."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"title"})}),e.jsx("td",{children:e.jsx("code",{children:"string"})}),e.jsx("td",{children:"—"}),e.jsx("td",{children:"Human-readable name."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"visible"})}),e.jsx("td",{children:e.jsx("code",{children:"boolean"})}),e.jsx("td",{children:e.jsx("code",{children:"false"})}),e.jsx("td",{children:"Initial visibility."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"zIndex"})}),e.jsx("td",{children:e.jsx("code",{children:"number"})}),e.jsx("td",{children:"—"}),e.jsx("td",{children:"Draw order."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"textProperty"})}),e.jsx("td",{children:e.jsx("code",{children:"string"})}),e.jsx("td",{children:e.jsx("code",{children:"label"})}),e.jsx("td",{children:"Feature property to display."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"style"})}),e.jsxs("td",{children:[e.jsx("code",{children:"{"}),e.jsxs("code",{children:[e.jsxs(n.p,{children:[`font?: string;
fill?: string | CanvasPattern | CanvasGradient;
stroke?: `,"{",`
color?: string;
width?: number;
`,"}",`;
offset?: `,"{",`
x?: number;
y?: number;
`,"}",`;
textAlign?: CanvasTextAlign;
textBaseline?: CanvasTextBaseline;
rotation?: number;
scale?: number | [number, number];
rotateWithView?: boolean;
maxAngle?: number;
overflow?: boolean;
padding?: number[];
placement?: 'point' | 'line';
keepUpright?: boolean;
justify?: 'left' | 'center' | 'right';
backgroundFill?: string | CanvasPattern | CanvasGradient;
backgroundStroke?: `,"{",`
color?: string;
width?: number;
lineDash?: number[];`]}),"}"]}),e.jsx("code",{children:"}"})]}),e.jsx("td",{children:"—"}),e.jsx("td",{children:"Text styling & offset."})]})]})]})]})}function m(i={}){const{wrapper:n}={...d(),...i.components};return n?e.jsx(n,{...i,children:e.jsx(r,{...i})}):r(i)}export{m as default};
