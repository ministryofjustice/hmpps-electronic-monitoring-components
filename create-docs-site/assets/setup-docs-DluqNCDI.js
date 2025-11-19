import{j as e,M as o,T as t,S as a,C as l,a as d}from"./WithTooltip-SK46ZJ2J-B773puZq.js";import{useMDXComponents as c}from"./index-CVWPvq-m.js";import{Example as r}from"./setup-example.stories-DjiPvm4g.js";import"./preload-helper-PPVm8Dsz.js";import"./iframe-D2oS3iJe.js";import"./setupMapDemo-CNnel0xj.js";function i(s){const n={a:"a",blockquote:"blockquote",br:"br",code:"code",h1:"h1",h2:"h2",h3:"h3",hr:"hr",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...c(),...s.components};return e.jsxs(e.Fragment,{children:[e.jsx(o,{title:"Components/Map/Setup/Docs"}),`
`,e.jsx(t,{children:"Map setup"}),`
`,e.jsx(a,{children:"Interactive map component using OpenLayers or MapLibre"}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"live-example",children:"Live example"}),`
`,e.jsx(l,{of:r,className:"map-docs-canvas"}),`
`,e.jsx(n.h2,{id:"try-the-options",children:"Try the options"}),`
`,e.jsx(d,{of:r}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"browser-support",children:"Browser Support"}),`
`,e.jsxs("table",{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Browser"}),e.jsx("th",{children:"Support"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{children:"Chrome (evergreen)"}),e.jsx("td",{children:"✅"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"Firefox (evergreen)"}),e.jsx("td",{children:"✅"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"Safari 15+"}),e.jsx("td",{children:"✅"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"Edge (Chromium)"}),e.jsx("td",{children:"✅"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"IE11"}),e.jsx("td",{children:"❌"})]})]})]}),`
`,e.jsx(n.p,{children:"This component targets modern browsers only."}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["IE11 is ",e.jsx(n.strong,{children:"not supported"})," (no native Web Components)."]}),`
`,e.jsxs(n.li,{children:["Polyfilling for IE11 is ",e.jsx(n.strong,{children:"not recommended"})," (performance/compat issues)."]}),`
`,e.jsx(n.li,{children:"If legacy support is required, render a fallback view from your server-side templates."}),`
`]}),`
`,e.jsx(n.hr,{}),`
`,e.jsxs(n.h1,{id:"getting-started-with-em-map",children:["Getting Started with ",e.jsx(n.code,{children:"<em-map>"})]}),`
`,e.jsxs(n.p,{children:[e.jsx(n.code,{children:"<em-map>"}),` is an embeddable map component.
It uses Ordnance Survey `,e.jsx(n.strong,{children:"vector tiles"})," by default via a small server middleware and provides an API for adding layers from your app code."]}),`
`,e.jsx(n.h2,{id:"1-install",children:"1) Install"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-bash",children:`npm i @ministryofjustice/hmpps-electronic-monitoring-components
`})}),`
`,e.jsx(n.p,{children:"Register the custom element once in your client entry file (e.g. if your UI is using the HMPPS Typescript Template, this would be here assets/js/index.js):"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`import '@ministryofjustice/hmpps-electronic-monitoring-components/map'
`})}),`
`,e.jsx(n.p,{children:"Optionally import types if you’ll interact with the map in TypeScript:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`import type { EmMap } from '@ministryofjustice/hmpps-electronic-monitoring-components/map'
`})}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"2-ordnance-survey-vector-tiles-middleware",children:"2) Ordnance Survey Vector Tiles middleware"}),`
`,e.jsxs(n.p,{children:["This package exports an Express middleware that securely proxies Ordnance Survey Vector Tiles (OAuth2 + caching).",e.jsx(n.br,{}),`
`,"Mount it in your server app, e.g.:"]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`// server/app.ts
import express from 'express'
import { CacheClient, emOrdnanceSurveyAuth } from '@ministryofjustice/hmpps-electronic-monitoring-components/map/ordnance-survey-auth'

const app = express()

app.use(
  emOrdnanceSurveyAuth({
    apiKey: process.env.OS_API_KEY!, // from Ordance Survey
    apiSecret: process.env.OS_API_SECRET!, // from Ordnance Survey
    // Optional: Redis cache + expiry override
    // redisClient, // connected redis client
    // cacheExpiry: 3600, // seconds; default is 7 days in production, 0 in dev
  }),
)
`})}),`
`,e.jsx(n.p,{children:"Notes:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Default cache: 7 days in production, none in development."}),`
`,e.jsx(n.li,{children:"Add a Redis client for server-side caching."}),`
`,e.jsx(n.li,{children:"Middleware sets ETag and Cache-Control headers for browser caching."}),`
`]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"3-nunjucks-setup",children:"3) Nunjucks setup"}),`
`,e.jsx(n.p,{children:"Configure Nunjucks to load the component templates:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`nunjucks.configure([
  '<your-app-views>',
  'node_modules/@ministryofjustice/hmpps-electronic-monitoring-components/dist/nunjucks/'
])
`})}),`
`,e.jsx(n.p,{children:"Render the element with its macro:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-njk",children:`{% from "em-map/macro.njk" import emMap %}
{{ emMap({
  alerts: alerts,
  cspNonce: cspNonce
}) }}
`})}),`
`,e.jsx(n.p,{children:"Click the Show code button on the map example above for a full Nunjucks implementation."}),`
`,e.jsxs(n.p,{children:["Ensure the host container has a ",e.jsx(n.strong,{children:"non-zero height"}),", otherwise OpenLayers will log:"]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsx(n.p,{children:"“No map visible because the map container's width or height are 0.”"}),`
`]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-scss",children:`.map-container { height: 450px; }
`})}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"4-csp-configuration",children:"4) CSP configuration"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", (_req, res) => "'nonce-' + res.locals.cspNonce"],
        styleSrc: ["'self'", 'cdn.jsdelivr.net', "'unsafe-inline'"],
        fontSrc: ["'self'", 'cdn.jsdelivr.net'],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
      },
    },
  }),
)
`})}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Why these rules:"})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"cdn.jsdelivr.net"}),": loads OpenLayers font assets."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"'unsafe-inline'"}),": required for small inline styles OpenLayers applies dynamically."]}),`
`,e.jsxs(n.li,{children:["Keeps ",e.jsx(n.code,{children:"script-src"})," strict (nonce-based)."]}),`
`]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"5-using-the-map-component-in-your-frontend",children:"5) Using the Map Component in your Frontend"}),`
`,e.jsxs(n.p,{children:["Once ",e.jsx(n.code,{children:"<em-map>"})," is rendered, your frontend code can interact with it directly.",e.jsx(n.br,{}),`
`,"You can listen for lifecycle events, add or remove layers, and even call the full OpenLayers or MapLibre APIs."]}),`
`,e.jsxs(n.h3,{id:"map-lifecycle-mapready",children:["Map Lifecycle (",e.jsx(n.code,{children:"map:ready"}),")"]}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"<em-map>"})," component dispatches a ",e.jsx(n.code,{children:"map:ready"})," event when its internal map has finished initialising."]}),`
`,e.jsx(n.p,{children:"Use this to safely access the map instance and any parsed position data:"}),`
`,e.jsx(n.h3,{id:"using-javascript",children:"Using JavaScript"}),`
`,e.jsx(n.p,{children:"The HMPPS Typescript Template library lets a frontend app use JavaScript in the browser by default."}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-js",children:`// assets/js/map-init.js

// Wait until the map is ready
const emMap = document.querySelector('em-map')

emMap.addEventListener('map:ready', () => {
  const map = emMap.olMapInstance // OpenLayers map instance
  const positions = emMap.positions // Array of parsed positions
})
`})}),`
`,e.jsx(n.p,{children:"If you have configured TypeScript for the client side"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`import { EmMap } from '@ministryofjustice/hmpps-electronic-monitoring-components/map'

const emMap = document.querySelector('em-map') as EmMap

await new Promise<void>(resolve => {
  emMap.addEventListener('map:ready', () => resolve(), { once: true })
})

const map = emMap.olMapInstance
const positions = emMap.positions
`})}),`
`,e.jsx(n.h3,{id:"accessing-the-map-library-api",children:"Accessing the Map Library API"}),`
`,e.jsx(n.p,{children:"Once initialised, you can use the underlying map object for full control."}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"OpenLayers:"})," access it via ",e.jsx(n.code,{children:"emMap.olMapInstance"}),e.jsx(n.br,{}),`
`,"→ ",e.jsx("a",{href:"https://openlayers.org/en/latest/apidoc/",target:"_blank",rel:"noopener noreferrer",children:"OpenLayers Map API docs"})]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"MapLibre:"})," access it via ",e.jsx(n.code,{children:"emMap.maplibreMapInstance"}),e.jsx(n.br,{}),`
`,"→ ",e.jsx("a",{href:"https://maplibre.org/maplibre-gl-js/docs/API/",target:"_blank",rel:"noopener noreferrer",children:"MapLibre GL JS Map API docs"})]}),`
`]}),`
`,e.jsx(n.p,{children:"From there, you can:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Add or remove layers using standard OpenLayers or MapLibre methods"}),`
`,e.jsx(n.li,{children:"Control the map view, zoom, and rotation"}),`
`,e.jsxs(n.li,{children:["Register custom event listeners (",e.jsx(n.code,{children:"map.on('click', …)"}),")"]}),`
`,e.jsxs(n.li,{children:["Integrate your own vector or raster sources beyond those built into ",e.jsx(n.code,{children:"<em-map>"})]}),`
`]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h3,{id:"layers",children:"Layers"}),`
`,e.jsx(n.p,{children:"Layers represent sets of features rendered on top of the base map — for example, locations, tracks, numbering, or circles showing GPS confidence."}),`
`,e.jsx(n.p,{children:"This library provides ready-made composable layer classes:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:e.jsx(n.code,{children:"LocationsLayer"})}),`
`,e.jsx(n.li,{children:e.jsx(n.code,{children:"TracksLayer"})}),`
`,e.jsx(n.li,{children:e.jsx(n.code,{children:"NumberingLayer"})}),`
`,e.jsx(n.li,{children:e.jsx(n.code,{children:"CirclesLayer"})}),`
`]}),`
`,e.jsxs(n.p,{children:["Each can be created and added via the ",e.jsx(n.code,{children:"emMap.addLayer()"})," helper or through your own OpenLayers code."]}),`
`,e.jsxs(n.p,{children:["See the ",e.jsx(n.a,{href:"?path=/docs/components-map-layers-docs--docs",children:e.jsx(n.strong,{children:"Layers Story"})})," for usage and configuration options."]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h3,{id:"overlays",children:"Overlays"}),`
`,e.jsx(n.p,{children:"Overlays let you display contextual information when clicking on features — such as device details or recorded data points."}),`
`,e.jsx(n.p,{children:"To enable this behaviour:"}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsxs(n.li,{children:["Add the ",e.jsx(n.code,{children:"uses-internal-overlays"})," attribute to ",e.jsx(n.code,{children:"<em-map>"}),"."]}),`
`,e.jsxs(n.li,{children:["Provide ",e.jsx(n.code,{children:"<template>"})," elements defining the overlay title/body markup."]}),`
`,e.jsxs(n.li,{children:["Include ",e.jsx(n.code,{children:"overlayTitleTemplateId"})," and ",e.jsx(n.code,{children:"overlayBodyTemplateId"})," properties in your feature data."]}),`
`]}),`
`,e.jsxs(n.p,{children:["See the ",e.jsx(n.a,{href:"?path=/docs/components-map-overlays-docs--docs",children:e.jsx(n.strong,{children:"Overlays Story"})})," for examples of the templates and click interaction."]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"troubleshooting",children:"Troubleshooting"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"“No map visible because the map container's width or height are 0.”"}),e.jsx(n.br,{}),`
`,"Ensure the host container has an explicit height (e.g. ",e.jsx(n.code,{children:"450px"}),")."]}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"CSP errors"}),e.jsx(n.br,{}),`
`,"Ensure you pass a ",e.jsx(n.code,{children:"cspNonce"})," and include ",e.jsx(n.code,{children:"'nonce-<value>'"})," in ",e.jsx(n.code,{children:"style-src"}),"."]}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Vector tiles not loading"}),e.jsx(n.br,{}),`
`,"Confirm the server middleware is mounted and OS credentials are set. The UI talks to the local proxy automatically."]}),`
`]}),`
`]})]})}function y(s={}){const{wrapper:n}={...c(),...s.components};return n?e.jsx(n,{...s,children:e.jsx(i,{...s})}):i(s)}export{y as default};
