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
          publicDir: resolve(__dirname, '../public'),
          optimizeDeps: {
            exclude: ['ol'],
          },
          root: resolve(__dirname, '..'),
          resolve: {
            alias: {
              '@': resolve(__dirname, '../src'),
              '@map': resolve(__dirname, '../src/components/map'),
            },
          },
          server: {
            fs: {
              allow: ['..'], // allow access outside root
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
