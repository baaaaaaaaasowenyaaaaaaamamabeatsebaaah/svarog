// eslint.config.js - COMPLETE with manual rule disabling
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
        Option: 'readonly',

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
        requireConfigFile: false,
        allowImportExportEverywhere: false,
        strictMode: true,
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },

    // BASE RULES - NO FORMATTING CONFLICTS
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^(describe|it|test|expect|vi)$',
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
      'no-undef': 'error',

      // SYNTAX ERROR DETECTION ONLY
      'no-unreachable': 'error',
      'no-unexpected-multiline': 'error',
      'no-irregular-whitespace': 'error',
      'no-control-regex': 'error',
      'no-invalid-regexp': 'error',
      'no-obj-calls': 'error',
      'no-regex-spaces': 'error',
      'no-sparse-arrays': 'error',
      'use-isnan': 'error',
      'valid-typeof': 'error',

      // TEMPLATE LITERAL RULES
      'no-template-curly-in-string': 'error',

      // LOGIC RULES (not formatting)
      'no-useless-concat': 'error',
      'prefer-template': 'warn',

      // SEMICOLON ERRORS (not spacing)
      semi: ['error', 'always'],
      'no-extra-semi': 'error',

      // GENERAL SYNTAX STRICTNESS
      'no-dupe-args': 'error',
      'no-dupe-keys': 'error',
      'no-duplicate-case': 'error',
      'no-empty': 'error',
      'no-ex-assign': 'error',
      'no-extra-boolean-cast': 'error',
      'no-func-assign': 'error',
      'no-inner-declarations': 'error',

      // IMPORTS/EXPORTS SYNTAX
      'no-duplicate-imports': 'error',

      // ==========================================
      // DISABLE ALL PRETTIER CONFLICTING RULES
      // ==========================================
      'no-extra-parens': 'off', // ← YOUR MAIN ISSUE
      'no-invalid-this': 'off', // ← UTILITY FILES ISSUE
      'brace-style': 'off', // ← FORMATTING
      'func-call-spacing': 'off', // ← FORMATTING
      'space-before-function-paren': 'off', // ← FORMATTING
      'object-curly-spacing': 'off', // ← FORMATTING
      'array-bracket-spacing': 'off', // ← FORMATTING
      'semi-spacing': 'off', // ← FORMATTING
      'arrow-spacing': 'off', // ← FORMATTING
      'arrow-parens': 'off', // ← FORMATTING
      indent: 'off', // ← FORMATTING
      quotes: 'off', // ← Let Prettier handle
      'comma-spacing': 'off', // ← FORMATTING
      'key-spacing': 'off', // ← FORMATTING
      'space-infix-ops': 'off', // ← FORMATTING
      'space-unary-ops': 'off', // ← FORMATTING
      'no-trailing-spaces': 'off', // ← FORMATTING
      'eol-last': 'off', // ← FORMATTING
      'comma-dangle': 'off', // ← FORMATTING
      'max-len': 'off', // ← FORMATTING
    },
  },

  // Configure prettier integration
  {
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      'prettier/prettier': [
        'error',
        {
          // MATCH YOUR .prettierrc EXACTLY
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
    },
  },

  // Source files - focus on logic only
  {
    files: ['src/**/*.js'],
    languageOptions: {
      globals: {
        window: 'readonly',
        document: 'readonly',
      },
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2022,
        strictMode: true,
      },
    },
    rules: {
      // LOGIC RULES ONLY (no formatting)
      'no-var': 'error',
      'prefer-const': 'error',
      'no-implicit-globals': 'error',
      strict: ['error', 'never'],
      'prefer-template': 'error',
      'object-shorthand': 'error',
      'quote-props': ['error', 'as-needed'],

      // ENSURE FORMATTING RULES ARE OFF
      'no-extra-parens': 'off',
      'no-invalid-this': 'off',
    },
  },

  // Utility files - even more permissive
  {
    files: ['**/utils/**/*.js'],
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'prefer-rest-params': 'off',
      'no-param-reassign': 'off',
      'no-invalid-this': 'off',
      'no-extra-parens': 'off',
    },
  },

  // Specific configuration for logger.js
  {
    files: ['**/utils/logger.js'],
    rules: {
      'no-console': 'off',
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
    rules: {
      'no-unused-expressions': 'off',
      'max-lines-per-function': 'off',
      'no-extra-parens': 'off',
    },
  },

  // PROBLEMATIC FILES - DISABLE ALL FORMATTING RULES
  {
    files: [
      'src/components/Accordion/**/*.js',
      'src/components/Map/**/*.js', // ← YOUR CURRENT ISSUE
      'src/components/MuchandyHero/**/*.js',
      'src/components/Tabs/**/*.js',
      'src/utils/performance.js',
    ],
    rules: {
      // ONLY SYNTAX ERRORS - NO FORMATTING
      'no-template-curly-in-string': 'error',
      'no-unexpected-multiline': 'error',
      'no-irregular-whitespace': 'error',

      // DISABLE ALL FORMATTING RULES
      'no-extra-parens': 'off', // ← MAIN FIX
      'no-invalid-this': 'off',
      'brace-style': 'off',
      curly: 'off',
      semi: 'off',
      quotes: 'off',
      'no-trailing-spaces': 'off',
      'eol-last': 'off',
      indent: 'off',
      'object-curly-spacing': 'off',
      'array-bracket-spacing': 'off',
      'space-before-function-paren': 'off',
      'func-call-spacing': 'off',
      'arrow-spacing': 'off',
      'arrow-parens': 'off',
      'comma-spacing': 'off',
      'key-spacing': 'off',
    },
  },
];
