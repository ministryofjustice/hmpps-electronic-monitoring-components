import { addons } from 'storybook/manager-api'
import { create } from 'storybook/theming'

addons.setConfig({
  theme: create({
    base: 'dark',

    // Typography
    fontBase: '"Open Sans", sans-serif',
    fontCode: 'monospace',
    brandTitle: 'EM Components',
    // brandUrl: 'https://example.com',
    brandImage: '/crest-dark.svg',
    brandTarget: '_self',
  }),
})
