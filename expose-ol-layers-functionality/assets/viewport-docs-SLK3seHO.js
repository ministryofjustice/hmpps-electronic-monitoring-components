import{u as o,j as n,M as t,T as l,S as r,C as d,a as c}from"./blocks-AKBULf8K.js";import{Example as s}from"./viewport-example.stories-Cm11qmXt.js";import"./preload-helper-PPVm8Dsz.js";import"./iframe-QZtUuydv.js";import"./setupMapDemo-CJnIVxV-.js";function i(a){const e={blockquote:"blockquote",code:"code",h2:"h2",h3:"h3",hr:"hr",li:"li",p:"p",pre:"pre",ul:"ul",...o(),...a.components};return n.jsxs(n.Fragment,{children:[n.jsx(t,{title:"Components/Map/Viewport/Docs"}),`
`,n.jsx(l,{children:"Map viewport"}),`
`,n.jsx(r,{children:"Controlling map position, zoom, and fitting to data"}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h2,{id:"live-example",children:"Live example"}),`
`,n.jsx(d,{of:s,className:"map-docs-canvas"}),`
`,n.jsx(e.h2,{id:"try-the-options",children:"Try the options"}),`
`,n.jsx(c,{of:s}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h2,{id:"public-api-for-controlling-the-viewport",children:"Public API for controlling the viewport"}),`
`,n.jsxs(e.p,{children:["The ",n.jsx(e.code,{children:"<em-map>"})," component exposes methods for controlling the map view (position, zoom, and fitting to data)."]}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h2,{id:"common-usage",children:"Common usage"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-ts",children:`map.fitToLayer('locations-green')
map.fitToLayers(['locations-red', 'locations-green'])
map.fitToAllLayers()

map.fitToPoints(positions)
map.fitToPositions()

map.focusOn({ center: { latitude: 51.5, longitude: -0.12 }, zoom })
map.zoomTo({ zoom: 12 })
`})}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h2,{id:"fitting-the-map-to-data",children:"Fitting the map to data"}),`
`,n.jsx(e.h3,{id:"dataset-based",children:"Dataset-based"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-ts",children:`map.fitToPositions()
map.fitToPoints(positions)
`})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:["Uses original data passed into ",n.jsx(e.code,{children:"<em-map>"})]}),`
`,n.jsx(e.li,{children:"Ignores layers and transformations"}),`
`]}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h3,{id:"layer-based",children:"Layer-based"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-ts",children:`map.fitToLayer('locations-green')
map.fitToLayers(['locations-red', 'locations-green'])
map.fitToAllLayers()
`})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Uses rendered layer data"}),`
`,n.jsx(e.li,{children:"Includes derived or transformed points"}),`
`]}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h3,{id:"fit-to-all-layers",children:"Fit to all layers"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-ts",children:`map.fitToAllLayers()
`})}),`
`,n.jsx(e.p,{children:"Fits the map to all layers currently added to the map."}),`
`,n.jsxs(e.blockquote,{children:[`
`,n.jsx(e.p,{children:"Use this when you want to show all data currently visible on the map."}),`
`]}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h2,{id:"animation",children:"Animation"}),`
`,n.jsx(e.p,{children:"Viewport methods animate by default."}),`
`,n.jsx(e.h3,{id:"default-animation",children:"Default animation"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-ts",children:`map.fitToLayer('locations-green')
`})}),`
`,n.jsx(e.p,{children:"Uses default animation (~500ms)"}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h3,{id:"fast-animation",children:"Fast animation"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-ts",children:`map.fitToLayer('locations-green', {
  durationMs: 200,
})
`})}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h3,{id:"slow-animation",children:"Slow animation"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-ts",children:`map.fitToLayer('locations-green', {
  durationMs: 1200,
})
`})}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h3,{id:"no-animation",children:"No animation"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-ts",children:`map.fitToLayer('locations-green', {
  animate: false,
})
`})}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h2,{id:"focus-and-zoom",children:"Focus and zoom"}),`
`,n.jsx(e.h3,{id:"focus-on-a-location",children:"Focus on a location"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-ts",children:`map.focusOn({
  center: { latitude: 51.5, longitude: -0.12 },
  zoom: 14,
})
`})}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h3,{id:"set-zoom-level",children:"Set zoom level"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-ts",children:`map.zoomTo({ zoom: 10 })
`})}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h2,{id:"advanced-usage",children:"Advanced usage"}),`
`,n.jsx(e.h3,{id:"full-control",children:"Full control"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-ts",children:`map.fitTo({
  targets: [
    { type: 'layer', layerId: 'locations-green' },
    { type: 'points', points }
  ],
  padding: 80,
  maxZoom: 16,
})
`})}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h2,{id:"notes",children:"Notes"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"If no data is available, the map will not move."}),`
`,n.jsx(e.li,{children:"Single-point fits apply a default zoom level."}),`
`,n.jsx(e.li,{children:"Padding adds spacing around the fitted area."}),`
`,n.jsx(e.li,{children:"Animation is enabled by default."}),`
`,n.jsxs(e.li,{children:["Use ",n.jsx(e.code,{children:"animate: false"})," to disable transitions."]}),`
`]})]})}function u(a={}){const{wrapper:e}={...o(),...a.components};return e?n.jsx(e,{...a,children:n.jsx(i,{...a})}):i(a)}export{u as default};
