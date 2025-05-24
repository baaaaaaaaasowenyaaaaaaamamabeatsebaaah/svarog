// eslint.config.js
import js from '@eslint/js';
import eslintPluginPrettier from 'eslint-plugin-prettier';

export default [
  // Apply JavaScript recommended rules
  js.configs.recommended,

  // Global configuration for all files
  {
    ignores: ['node_modules/**', 'dist/**', 'coverage/**', '**/*.json'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        localStorage: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        HTMLElement: 'readonly',
        HTMLButtonElement: 'readonly',
        HTMLDivElement: 'readonly',
        Node: 'readonly',
        NodeList: 'readonly',
        RadioNodeList: 'readonly',
        FormData: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        CustomEvent: 'readonly',
        Event: 'readonly',
        MouseEvent: 'readonly',
        IntersectionObserver: 'readonly',
        performance: 'readonly',
        alert: 'readonly',
        fetch: 'readonly',
        Option: 'readonly', // Added Option for Typography.js

        // Node globals
        process: 'readonly',
        global: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',

        // Testing globals
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        vi: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        jest: 'readonly',
      },
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },

    // Base rules for all files
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }], // Downgrade no-console to warn
      'no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^(describe|it|test|expect|vi)$',
          argsIgnorePattern: '^_', // Changed to match any variable starting with underscore
          caughtErrorsIgnorePattern: '^_', // Added to handle catch(e) cases
          destructuredArrayIgnorePattern: '^_', // Added for destructuring patterns
        },
      ],
      'no-undef': 'error',
    },
  },

  // Configure prettier integration
  {
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },

  // Specific configuration for logger.js
  {
    files: ['**/utils/logger.js'],
    rules: {
      'no-console': 'off', // Disable no-console for logger.js
    },
  },

  // Browser-specific configuration
  {
    files: ['src/**/*.js'],
    languageOptions: {
      globals: {
        window: 'readonly',
        document: 'readonly',
      },
    },
  },

  // Node-specific configuration
  {
    files: ['scripts/**/*.js', '*.js', '.*.js'],
    languageOptions: {
      globals: {
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
      },
    },
  },

  // Test file configuration
  {
    files: ['**/*.test.js', '**/*.spec.js'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        vi: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        jest: 'readonly',
      },
    },
  },
];
