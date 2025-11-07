// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import hmppsConfig from '@ministryofjustice/eslint-config-hmpps'

export default [...hmppsConfig(), {
  ignores: [
    'dist/**',
    'node_modules/**',
    'coverage/**',
    'nunjucks/**',
    'src/**/*.raw.css',
    'src/sandbox/**',
    'eslint.config.{js,cjs,mjs}',
    'babel.config.{js,cjs,mjs}',
  ],
}, {
  files: ['src/**/*.{ts,tsx,js,jsx}'],
  rules: {
    // Allow single named exports so don't need to change from default export if another export is added
    'import/prefer-default-export': 'off',
    // Allow console.warn and console.error to feedback to developers using the component but not console.log
    'no-console':
    process.env.NODE_ENV === 'production'
      ? ['error', { allow: ['warn', 'error'] }]
      : 'off',
    // Ignore unresolved errors for Vite raw imports like '?raw'
    'import/no-unresolved': [
      'error',
      {
        ignore: ['\\?raw$'],
      },
    ],
  },
}, // Looser rules for Storybook, config files, dev scripts, and tests
{
  files: [
    'vite.config.{ts,js,mjs,cjs}',
    '*.config.{ts,js,mjs,cjs}',
    'src/sandbox/index.ts',
    'src/jest.setup.ts',
    'src/**/*.test.{ts,js}',
    'integration_tests/**/*.ts',
    'integration_tests/**/*.js',
  ],
  rules: {
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'no-console': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-expressions': 'off',
    'func-names': 'off',
    'max-classes-per-file': 'off',
    'no-underscore-dangle': 'off',
    'no-new': 'off',
    'global-require': 'off',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
  },
},
{
  files: [
    "src/stories/**/*",
    ".storybook/**/*",
  ],
  rules: {
    "import/no-extraneous-dependencies": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "no-console": "off",
  },
}, ...storybook.configs["flat/recommended"]];
