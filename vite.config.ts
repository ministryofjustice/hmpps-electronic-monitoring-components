/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import eslint from 'vite-plugin-eslint2'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import fs from 'node:fs/promises'
import path from 'node:path'
import fg from 'fast-glob'
import { fileURLToPath } from 'node:url'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url))

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [
    tsconfigPaths(),
    eslint(),
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/govuk-frontend/dist/govuk/assets/fonts/*',
          dest: 'assets/fonts',
        },
      ],
    }),
    copyNunjucks(),
  ],
  build: {
    outDir: 'dist',
    target: 'es2020',
    cssCodeSplit: true,
    assetsDir: 'assets',
    lib: {
      entry: {
        index: 'src/index.ts',
        'components/map': 'src/components/map/scripts/index.ts',
        'components/map/layers': 'src/components/map/scripts/core/layers/index.ts',
        'components/map/ordnance-survey-auth': 'src/components/map/server/ordnance-survey-auth/index.ts',
      },
      name: 'HmppsElectronicMonitoringComponents',
      formats: ['es', 'cjs'],
      fileName: (format, entryName) =>
        entryName === 'index' ? `index.${format}.js` : `${entryName}/index.${format}.js`,
    },
    rollupOptions: {
      external: id =>
        id === 'ol' ||
        /^ol\//.test(id) ||
        id === 'govuk-frontend' ||
        /^govuk-frontend\//.test(id) ||
        [
          'fs',
          'path',
          'os',
          'dotenv',
          'express',
          'http',
          'https',
          'url',
          'stream',
          'crypto',
          'zlib',
          'util',
          'events',
        ].includes(id),
      output: {
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
  server: {
    open: true,
  },
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(dirname, '.storybook'),
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [
              {
                browser: 'chromium',
              },
            ],
          },
          setupFiles: ['.storybook/vitest.setup.ts'],
        },
      },
    ],
  },
})

// Needed to copy nunjucks templates to dist only once per build
// as viteStaticCopy generates duplicates when building a library
function copyNunjucks() {
  let done = false
  return {
    name: 'copy-nunjucks',
    apply(_config: import('vite').UserConfig, env: import('vite').ConfigEnv) {
      return env.command === 'build'
    },
    async closeBundle() {
      if (done) return
      done = true
      const files = await fg('src/nunjucks/*/**/*.{njk,nunjucks}')
      await Promise.all(
        files.map(async file => {
          const rel = file.replace(/^src[\\/]/, '')
          const out = path.resolve('dist', rel)
          await fs.mkdir(path.dirname(out), {
            recursive: true,
          })
          await fs.copyFile(file, out)
        }),
      )
    },
  }
}
