import{j as e,M as i,T as r,S as o,C as c,a as d}from"./WithTooltip-SK46ZJ2J-CjUV--RY.js";import{useMDXComponents as t}from"./index-QgoqvXXx.js";import{Example as s}from"./overlays-example.stories-lbrWNAge.js";import"./preload-helper-PPVm8Dsz.js";import"./iframe-DxYi-8t0.js";import"./setupMapDemo-6PyoO085.js";function l(a){const n={a:"a",br:"br",code:"code",h2:"h2",h3:"h3",hr:"hr",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...t(),...a.components};return e.jsxs(e.Fragment,{children:[e.jsx(i,{title:"Components/Map/Overlays/Docs"}),`
`,e.jsx(r,{children:"Map overlays"}),`
`,e.jsx(o,{children:"Displaying popups and labels on features"}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"live-example",children:"Live example"}),`
`,e.jsx(c,{of:s,className:"map-docs-canvas"}),`
`,e.jsx(n.h2,{id:"try-the-options",children:"Try the options"}),`
`,e.jsx(d,{of:s}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"overlay-templating-click-to-open-popups",children:"Overlay Templating (click-to-open popups)"}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"<em-map>"})," component supports interactive overlays (popups) that display feature data when clicked.",e.jsx(n.br,{}),`
`,"This behaviour is enabled by adding the attribute:"]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-html",children:`<em-map uses-internal-overlays></em-map>
`})}),`
`,e.jsx(n.p,{children:"When active, any feature with valid overlay template IDs in its data will show a popup containing its details."}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h3,{id:"1-example-nunjucks-integration",children:"1) Example Nunjucks integration"}),`
`,e.jsxs(n.p,{children:["In a typical application page, you can include the overlay templates directly beneath the ",e.jsx(n.code,{children:"<em-map>"})," macro call:"]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-njk",children:`{% block content %}
  {{
    appMap({
      apiKey: apiKey,
      cspNonce: cspNonce,
      positions: positions,
      alerts: alerts,
      usesInternalOverlays: true,
    })
  }}

  {% raw %}
  <template id="overlay-title-mdss-location">
    <div><strong>Name (NOMIS ID): {{ subjectName }}</strong></div>
    <div><strong>Device ID: {{ subjectNomisId }}</strong></div>
  </template>

  <template id="overlay-body-mdss-location">
    <div class="app-map__overlay-row">
      <span class="app-map__overlay-label">Latitude:</span>
      <span class="app-map__overlay-value">{{ latitude }}</span>
    </div>
    <div class="app-map__overlay-row">
      <span class="app-map__overlay-label">Longitude:</span>
      <span class="app-map__overlay-value">{{ longitude }}</span>
    </div>
  </template>
  {% endraw %}
{% endblock %}
`})}),`
`,e.jsxs(n.p,{children:["This approach keeps overlays defined in the same file as the map macro,",e.jsx(n.br,{}),`
`,"while still allowing client-side rendering logic to populate the templates at runtime."]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h3,{id:"2-linking-templates-to-features",children:"2) Linking templates to features"}),`
`,e.jsxs(n.p,{children:["Each feature must include two properties:",e.jsx(n.br,{}),`
`,e.jsx(n.code,{children:"overlayTitleTemplateId"})," and ",e.jsx(n.code,{children:"overlayBodyTemplateId"}),", referencing the IDs of the templates to use."]}),`
`,e.jsx(n.p,{children:"Example feature data:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-json",children:`{
  "latitude": 53.4808,
  "longitude": -2.2426,
  "overlayTitleTemplateId": "overlay-title-mdss-location",
  "overlayBodyTemplateId": "overlay-body-mdss-location",
  "subjectName": "Jane Doe",
  "subjectNomisId": "12345"
}
`})}),`
`,e.jsx(n.p,{children:"When clicked, the component automatically fills these template placeholders with matching property values."}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h3,{id:"3-client-side-behaviour",children:"3) Client-side behaviour"}),`
`,e.jsxs(n.p,{children:["Once ",e.jsx(n.code,{children:"<em-map>"})," is initialised and ",e.jsx(n.code,{children:"uses-internal-overlays"})," is enabled:"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Clicking a feature with valid template IDs will open the overlay."}),`
`,e.jsxs(n.li,{children:["The overlay automatically fills each ",e.jsx(n.code,{children:"{{ token }}"})," with values from the feature."]}),`
`,e.jsx(n.li,{children:'An "x" close button hides the overlay.'}),`
`]}),`
`,e.jsx(n.p,{children:"You can also close the overlay programmatically:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-js",children:`const emMap = document.querySelector('em-map')
emMap.closeOverlay()
`})}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h3,{id:"related-stories",children:"Related Stories"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"?path=/docs/components-map-layers-docs--docs",children:e.jsx(n.strong,{children:"Layers Story"})})," — how to add data layers that can trigger overlays"]}),`
`]}),`
`,e.jsx(n.hr,{}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Note:"})," You can define multiple overlay templates to handle different feature types",e.jsx(n.br,{}),`
`,"(e.g. ",e.jsx(n.code,{children:"overlay-body-offender-location"}),", ",e.jsx(n.code,{children:"overlay-body-device-alert"}),") and reference them per-feature."]})]})}function y(a={}){const{wrapper:n}={...t(),...a.components};return n?e.jsx(n,{...a,children:e.jsx(l,{...a})}):l(a)}export{y as default};
