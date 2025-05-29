import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier';

export default [
  // Base JavaScript recommended rules
  js.configs.recommended,

  // Global configuration
  {
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        // Browser
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        HTMLElement: 'readonly',
        HTMLButtonElement: 'readonly',
        HTMLDivElement: 'readonly',
        HTMLInputElement: 'readonly',
        HTMLFormElement: 'readonly',
        HTMLSelectElement: 'readonly',
        HTMLTextAreaElement: 'readonly',
        Node: 'readonly',
        NodeList: 'readonly',
        RadioNodeList: 'readonly',
        FormData: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        CustomEvent: 'readonly',
        Event: 'readonly',
        MouseEvent: 'readonly',
        KeyboardEvent: 'readonly',
        IntersectionObserver: 'readonly',
        ResizeObserver: 'readonly',
        MutationObserver: 'readonly',
        performance: 'readonly',
        alert: 'readonly',
        confirm: 'readonly',
        fetch: 'readonly',
        Option: 'readonly',

        // Node.js
        process: 'readonly',
        global: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        Buffer: 'readonly',

        // Vitest/Testing
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        vi: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        suite: 'readonly',
      },
    },

    plugins: {
      prettier,
    },

    rules: {
      // Prettier integration
      'prettier/prettier': [
        'error',
        {
          printWidth: 80,
          tabWidth: 2,
          useTabs: false,
          semi: true,
          singleQuote: true,
          trailingComma: 'es5',
          bracketSpacing: true,
          arrowParens: 'always',
          endOfLine: 'lf',
        },
      ],

      // Logic rules (not formatting)
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
      'no-undef': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-template': 'warn',
      'object-shorthand': 'error',
      'no-duplicate-imports': 'error',

      // Disable formatting rules (handled by Prettier)
      'no-extra-parens': 'off',
      quotes: 'off',
      semi: 'off',
      indent: 'off',
      'comma-dangle': 'off',
      'object-curly-spacing': 'off',
      'array-bracket-spacing': 'off',
      'space-before-function-paren': 'off',
      'arrow-spacing': 'off',
      'comma-spacing': 'off',
      'key-spacing': 'off',
      'brace-style': 'off',
      'max-len': 'off',
    },
  },

  // Source files specific rules
  {
    files: ['src/**/*.js'],
    rules: {
      'no-invalid-this': 'off', // Allow this in component methods
      'prefer-arrow-callback': 'error',
    },
  },

  // Utility files - more permissive
  {
    files: ['src/utils/**/*.js', 'scripts/**/*.js'],
    rules: {
      'no-console': 'off',
      'no-invalid-this': 'off',
    },
  },

  // Test files
  {
    files: ['**/*.test.js', '**/*.spec.js', '**/tests/**/*.js'],
    rules: {
      'no-console': 'off',
      'no-unused-expressions': 'off',
      'max-lines-per-function': 'off',
    },
  },

  // Configuration files
  {
    files: [
      '*.config.js',
      '*.config.mjs',
      '.*.js',
      'webpack.config.js',
      'vite.config.js',
      'rollup.config.js',
    ],
    languageOptions: {
      globals: {
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
      },
    },
    rules: {
      'no-console': 'off',
    },
  },

  // Ignore patterns
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'packages/*/dist/**',
      'packages/@svarog-ui/*/dist/**',
      'coverage/**',
      '.storybook/storybook-static/**',
      '**/*.min.js',
      '**/*.bundle.js',
    ],
  },
];
