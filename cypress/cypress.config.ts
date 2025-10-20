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
          resolve: {
            alias: {
              '@': resolve(__dirname, '../src'),
            },
          },
        },
      } as any),
    },
    specPattern: 'cypress/component/**/*.cy.{js,ts}',
    indexHtmlFile: 'cypress/support/component-index.html',
  },
})
