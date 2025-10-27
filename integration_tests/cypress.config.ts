import { defineConfig } from 'cypress'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  component: {
    devServer: {
      ...({
        framework: 'none',
        bundler: 'vite',
        viteConfig: {
          build: { target: 'esnext' },
          optimizeDeps: {
            include: [
              'ol/Map',
              'ol/View',
              'ol/layer/Vector',
              'ol/source/Vector',
              'ol/style',
              'ol/style/Circle',
              'ol/geom',
            ],
          },
          resolve: {
            alias: {
              '@': resolve(__dirname, '../src'),
            },
          },
        },
      } as any),
    },
    supportFile: 'cypress/support/component.ts',
    specPattern: 'cypress/component/**/*.cy.{js,ts}',
    indexHtmlFile: 'cypress/support/component-index.html',
    fixturesFolder: 'src/fixtures',
  },
})
