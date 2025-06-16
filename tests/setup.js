// tests/setup.js
import { beforeEach, afterEach } from 'vitest';
import { JSDOM } from 'jsdom';

// Mock console methods to reduce noise in tests
const originalConsole = {
  warn: console.warn,
  error: console.error,
  log: console.log,
};

beforeEach(() => {
  // Setup clean DOM environment for each test
  const dom = new JSDOM(
    `<!DOCTYPE html><html><head></head><body></body></html>`,
    {
      url: 'http://localhost',
      pretendToBeVisual: true,
      resources: 'usable',
    }
  );

  // Set up global DOM APIs
  global.document = dom.window.document;
  global.window = dom.window;
  global.HTMLElement = dom.window.HTMLElement;
  global.getComputedStyle = dom.window.getComputedStyle;
  global.requestAnimationFrame =
    dom.window.requestAnimationFrame || ((cb) => setTimeout(cb, 0));
  global.cancelAnimationFrame = dom.window.cancelAnimationFrame || clearTimeout;

  // Set up other DOM APIs that might be needed
  global.Element = dom.window.Element;
  global.Node = dom.window.Node;
  global.DocumentFragment = dom.window.DocumentFragment;

  // Custom event support
  global.CustomEvent = dom.window.CustomEvent;
  global.Event = dom.window.Event;

  // Performance API for benchmarks
  if (!global.performance) {
    global.performance = {
      now: () => Date.now(),
    };
  }

  // Mock console methods to reduce test noise
  console.warn = vi.fn();
  console.error = vi.fn();
});

afterEach(() => {
  // Restore console methods
  console.warn = originalConsole.warn;
  console.error = originalConsole.error;
  console.log = originalConsole.log;

  // Clean up DOM
  if (global.document) {
    global.document.head.innerHTML = '';
    global.document.body.innerHTML = '';
  }

  // Clear any timers
  vi.clearAllTimers();
});

// Utility to silence console in specific tests
export const silenceConsole = () => {
  const restore = () => {
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
    console.log = originalConsole.log;
  };

  console.warn = vi.fn();
  console.error = vi.fn();
  console.log = vi.fn();

  return restore;
};

// Utility to wait for DOM updates
export const waitForDOM = (ms = 0) =>
  new Promise((resolve) => setTimeout(resolve, ms));
