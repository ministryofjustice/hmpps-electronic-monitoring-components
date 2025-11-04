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
              '@map': resolve(__dirname, '../src/components/map'),
            },
          },
        },
      } as any),
    },
    supportFile: 'integration_tests/support/component.ts',
    specPattern: 'integration_tests/component/**/*.cy.{js,ts}',
    indexHtmlFile: 'integration_tests/support/component-index.html',
  },
})
