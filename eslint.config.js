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
    files: ['src/**/*.js', '.storybook/**/*.js', 'scripts/*.js'],
    ignores: ['node_modules/**', 'dist/**'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        alert: 'readonly',
        console: 'readonly',
        HTMLElement: 'readonly',
        __dirname: 'readonly',
        require: 'readonly',
        process: 'readonly',
        setTimeout: 'readonly',
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
  {
    files: ['src/**/*.test.js'],
    languageOptions: {
      globals: {
        jest: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        describe: 'readonly',
        beforeEach: 'readonly',
        HTMLElement: 'readonly',
        it: 'readonly',
      },
    },
    rules: {
      'no-undef': 'off',
    },
  },
  {
    files: [
      '__mocks__/**',
      'eslint.config.js',
      'jest.config.js',
      'plopfile.js',
      'webpack.config.js',
      '.storybook/webpack.config.js',
    ],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'script',
      globals: {
        module: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',
        process: 'readonly',
        exports: 'readonly',
        console: 'readonly',
      },
    },
  },
  ...compat.config(js.configs.recommended),
  ...compat.config(prettierConfig),
  {
    ignores: ['dist/**'],
  },
];
