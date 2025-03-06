import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true, // <- das sorgt dafür, dass describe/it/expect verfügbar sind
    environment: 'jsdom', // wenn du DOM-Tests machst
  },
});
