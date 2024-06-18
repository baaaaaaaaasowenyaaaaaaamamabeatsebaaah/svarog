const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');
const jestPlugin = require('eslint-plugin-jest');
const prettierPlugin = require('eslint-plugin-prettier');
const prettierConfig = require('eslint-config-prettier');

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

module.exports = [
  {
    files: ['src/**/*.js'],
    ignores: ['node_modules/**', 'dist/**'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        alert: 'readonly',
        console: 'readonly',
        jest: 'readonly',
        test: 'readonly',
        expect: 'readonly',
      },
    },
    plugins: {
      jest: jestPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
      'no-console': 'warn',
      'no-alert': 'warn',
      'no-unused-vars': 'warn',
      'no-undef': 'error',
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/prefer-to-have-length': 'warn',
      'jest/valid-expect': 'error',
      'no-unused-expressions': 'off',
    },
  },
  ...compat.config(js.configs.recommended),
  ...compat.config(prettierConfig),
];
