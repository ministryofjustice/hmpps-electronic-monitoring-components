import '../src/components/map/scripts/em-map'
import '../src/components/map/styles/em-map.scss'
import type { Preview } from '@storybook/web-components-vite'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    options: {
      panelPosition: 'right',
      storySort: {
        order: ['Overview', 'Components', ['Map', ['Introduction', 'Setup', 'Layers', 'Overlays']]],
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
}

export default preview
