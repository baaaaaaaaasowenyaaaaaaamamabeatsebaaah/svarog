// vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.js'],
    include: [
      'src/**/*.test.js',
      'tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
    ],
    coverage: {
      reporter: ['text', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '.storybook/',
        'coverage/',
        '**/*.css',
        '**/*.stories.js',
      ],
    },
  },
});
