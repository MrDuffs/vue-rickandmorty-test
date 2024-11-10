import pluginVue from 'eslint-plugin-vue';
import vueTsEslintConfig from '@vue/eslint-config-typescript';
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';

/** @type {import('eslint').Linter.Config} */
export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },
  {
    files: ['**/*.{js,vue}'],
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
      semi: ['warn', 'always'],
      'comma-dangle': [
        'warn',
        {
          arrays: 'always-multiline',
          objects: 'always-multiline',
          imports: 'always-multiline',
          exports: 'always-multiline',
          functions: 'never',
        },
      ],
      'vue/multi-word-component-names': 0,
      'vue/max-attributes-per-line': 0,
      'vue/html-self-closing': 0,
      'vue/no-multiple-template-root': 0,
      'vue/no-deprecated-dollar-scopedslots-api': 0,
      'vue/no-deprecated-dollar-listeners-api': 0,
    },
  },
  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
  },

  ...pluginVue.configs['flat/essential'],
  ...vueTsEslintConfig(),
  skipFormatting,
];
