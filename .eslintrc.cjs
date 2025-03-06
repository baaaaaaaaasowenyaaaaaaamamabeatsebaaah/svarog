/* eslint-env node */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  rules: {
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prettier/prettier': 'error',
  },
  globals: {
    process: 'readonly',
    describe: 'readonly',
    it: 'readonly',
    expect: 'readonly',
    vi: 'readonly',
  },
  ignorePatterns: ['node_modules/', 'dist/', 'coverage/'],
};
