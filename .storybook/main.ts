import type { StorybookConfig } from '@storybook/web-components-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@chromatic-com/storybook', '@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-vitest'],
  framework: {
    name: '@storybook/web-components-vite',
    options: {
      builder: {
        viteConfigPath: 'vite.config.ts',
      },
    },
  },
  staticDirs: ['public'],
  viteFinal: async viteConfig => {
    return {
      ...viteConfig,
      define: {
        ...(viteConfig.define || {}),
        'import.meta.env.STORYBOOK_OS_MAPS_API_KEY_PUBLIC_DOCS': JSON.stringify(
          process.env.STORYBOOK_OS_MAPS_API_KEY_PUBLIC_DOCS || '',
        ),
      },
    }
  },
}
export default config
