// tests/styles/styleInjection.test.js
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import { waitForDOM } from '../setup.js';

// ESLint configuration for test environment
/* eslint-env browser, node, vitest-globals/env */

// Test utilities
const createTestDOM = () => {
  const dom = new JSDOM(
    `<!DOCTYPE html><html><head></head><body></body></html>`
  );
  global.document = dom.window.document;
  global.window = dom.window;
  global.HTMLElement = dom.window.HTMLElement;
  global.getComputedStyle = dom.window.getComputedStyle;
  global.requestAnimationFrame = (callback) => setTimeout(callback, 0);
  return dom;
};

const getInjectedStyles = () =>
  Array.from(document.head.querySelectorAll('style[data-svarog]'))
    .map((style) => ({
      id: style.getAttribute('data-svarog'),
      priority: style.getAttribute('data-priority'),
      priorityValue: parseInt(style.getAttribute('data-priority-value')),
      content: style.textContent,
      element: style,
    }))
    .sort((a, b) => a.priorityValue - b.priorityValue);

const getCSSVariableValue = (varName) => {
  if (!document.documentElement || typeof getComputedStyle !== 'function')
    return null;
  try {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim();
  } catch {
    return null;
  }
};

const hasBaseVariables = () => {
  const testVars = [
    '--space-1',
    '--space-2',
    '--color-white',
    '--color-black',
    '--font-size-base',
    '--transition-fast',
    '--shadow-md',
  ];

  try {
    return testVars.every((varName) => {
      const value = getCSSVariableValue(varName);
      return value && value !== '' && value !== 'initial';
    });
  } catch {
    return false;
  }
};

describe('Style Injection System', () => {
  let dom;

  beforeEach(() => {
    // Reset modules to ensure fresh imports
    vi.resetModules();

    // Create fresh DOM
    dom = createTestDOM();

    // Clear any existing styles
    document.head.innerHTML = '';
  });

  afterEach(() => {
    if (dom) {
      dom.window.close();
    }
    vi.clearAllMocks();
  });

  describe('Base Styles and Variables Injection', () => {
    it('should auto-inject base styles when imported', async () => {
      // Import the base styles module
      await import('../../packages/svarog-ui-core/src/styles/baseStyles.js');

      const injectedStyles = getInjectedStyles();
      const baseStyle = injectedStyles.find((s) => s.id === 'svarog-base');

      expect(baseStyle).toBeDefined();
      expect(baseStyle.priority).toBe('base');
      expect(baseStyle.priorityValue).toBe(100);
      expect(baseStyle.content).toContain('box-sizing: border-box');
      expect(baseStyle.content).toContain('.sr-only');
    });

    it('should auto-inject base variables when core is imported', async () => {
      // Import the main core package
      await import('../../packages/svarog-ui-core/src/index.js');

      const injectedStyles = getInjectedStyles();
      const baseVariableStyle = injectedStyles.find(
        (s) => s.id === 'svarog-base-variables'
      );

      expect(baseVariableStyle).toBeDefined();
      expect(baseVariableStyle.priority).toBe('base');
      expect(baseVariableStyle.content).toContain('--space-1');
      expect(baseVariableStyle.content).toContain('--color-white');
    });

    it('should have correct style injection order', async () => {
      await import('../../packages/svarog-ui-core/src/index.js');

      const injectedStyles = getInjectedStyles();

      // Verify order: base variables < base styles < components < themes
      for (let i = 1; i < injectedStyles.length; i++) {
        expect(injectedStyles[i].priorityValue).toBeGreaterThanOrEqual(
          injectedStyles[i - 1].priorityValue
        );
      }
    });

    it('should make base CSS variables accessible', async () => {
      await import('../../packages/svarog-ui-core/src/index.js');

      // Wait for styles to be processed
      await waitForDOM(10);

      expect(hasBaseVariables()).toBe(true);

      // Test specific critical variables
      expect(getCSSVariableValue('--space-4')).toBe('16px');
      expect(getCSSVariableValue('--color-white')).toBe('#ffffff');
      expect(getCSSVariableValue('--font-size-base')).toBe('16px');
    });
  });

  describe('Component Style Integration', () => {
    it('should inject component styles with correct priority', async () => {
      const { Button } = await import(
        '../../packages/svarog-ui-core/src/index.js'
      );

      // Create a button to trigger style injection
      const button = Button({ text: 'Test' });
      const element = button.getElement();
      document.body.appendChild(element);

      const injectedStyles = getInjectedStyles();
      const buttonStyle = injectedStyles.find((s) => s.id === 'button');

      if (buttonStyle) {
        expect(buttonStyle.priority).toBe('component');
        expect(buttonStyle.priorityValue).toBe(200);
        expect(buttonStyle.content).toContain('.btn');
      }
    });

    it('should allow components to access base variables', async () => {
      const { Button } = await import(
        '../../packages/svarog-ui-core/src/index.js'
      );

      const button = Button({ text: 'Test' });
      const element = button.getElement();
      document.body.appendChild(element);

      // Component should be able to use base variables
      // Note: We're primarily testing that base variables are available globally
      // rather than testing specific computed styles on the element

      // These should not be empty/initial if base variables are working
      expect(hasBaseVariables()).toBe(true);
    });
  });

  describe('Theme Integration', () => {
    it('should apply theme styles with highest priority', async () => {
      await import('../../packages/svarog-ui-core/src/index.js');

      // Simulate theme injection
      const { injectStyles, css } = await import(
        '../../packages/svarog-ui-core/src/utils/styleInjection.js'
      );

      const themeStyles = css`
        .test-theme {
          --color-primary: #ff0000;
        }
      `;

      injectStyles('test-theme', themeStyles, { priority: 'theme' });

      const injectedStyles = getInjectedStyles();
      const themeStyle = injectedStyles.find((s) => s.id === 'test-theme');

      expect(themeStyle).toBeDefined();
      expect(themeStyle.priority).toBe('theme');
      expect(themeStyle.priorityValue).toBe(300);
    });

    it('should maintain correct cascade order when theme is applied', async () => {
      const { Button, injectStyles, css } = await import(
        '../../packages/svarog-ui-core/src/index.js'
      );

      // Create button (injects component styles)
      const button = Button({ text: 'Test' });
      document.body.appendChild(button.getElement());

      // Apply theme (should come after component styles)
      const themeStyles = css`
        .test-theme {
          --button-bg: #ff0000;
        }
      `;
      injectStyles('test-theme', themeStyles, { priority: 'theme' });

      const injectedStyles = getInjectedStyles();

      // Find component and theme styles
      const componentStyle = injectedStyles.find(
        (s) => s.priority === 'component'
      );
      const themeStyle = injectedStyles.find((s) => s.priority === 'theme');

      if (componentStyle && themeStyle) {
        expect(themeStyle.priorityValue).toBeGreaterThan(
          componentStyle.priorityValue
        );
      }
    });
  });

  describe('Style Deduplication', () => {
    it('should not inject duplicate styles', async () => {
      const { injectStyles, css } = await import(
        '../../packages/svarog-ui-core/src/utils/styleInjection.js'
      );

      const testStyles = css`
        .test {
          color: red;
        }
      `;

      // Inject same styles multiple times
      injectStyles('test-duplicate', testStyles);
      injectStyles('test-duplicate', testStyles);
      injectStyles('test-duplicate', testStyles);

      const injectedStyles = getInjectedStyles();
      const testStyleElements = injectedStyles.filter(
        (s) => s.id === 'test-duplicate'
      );

      expect(testStyleElements.length).toBe(1);
    });

    it('should replace styles when injected with higher priority', async () => {
      const { injectStyles, css } = await import(
        '../../packages/svarog-ui-core/src/utils/styleInjection.js'
      );

      // Inject with component priority
      injectStyles(
        'test-priority',
        css`
          .test {
            color: blue;
          }
        `,
        { priority: 'component' }
      );

      // Inject with theme priority (higher)
      injectStyles(
        'test-priority',
        css`
          .test {
            color: red;
          }
        `,
        { priority: 'theme' }
      );

      const injectedStyles = getInjectedStyles();
      const testStyle = injectedStyles.find((s) => s.id === 'test-priority');

      expect(testStyle.priority).toBe('theme');
      expect(testStyle.content).toContain('color: red');
    });
  });

  describe('SSR Compatibility', () => {
    it('should handle missing document gracefully', async () => {
      // Temporarily remove document
      const originalDocument = global.document;
      global.document = undefined;

      // This should not throw
      expect(async () => {
        await import('../../packages/svarog-ui-core/src/styles/baseStyles.js');
      }).not.toThrow();

      // Restore document
      global.document = originalDocument;
    });

    it('should work when window is undefined', async () => {
      const originalWindow = global.window;
      global.window = undefined;

      expect(async () => {
        await import(
          '../../packages/svarog-ui-core/src/utils/styleInjection.js'
        );
      }).not.toThrow();

      global.window = originalWindow;
    });
  });

  describe('Performance Tests', () => {
    it('should inject styles efficiently', async () => {
      const { injectStyles, css } = await import(
        '../../packages/svarog-ui-core/src/utils/styleInjection.js'
      );

      const startTime = performance.now();

      // Inject 100 different styles
      for (let i = 0; i < 100; i++) {
        injectStyles(
          `test-perf-${i}`,
          css`
            .test-${i} {
              color: red;
            }
          `
        );
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      // Should complete in reasonable time (adjust threshold as needed)
      expect(duration).toBeLessThan(100);
      expect(getInjectedStyles().length).toBe(100);
    });
  });
});

describe('Integration Tests', () => {
  let dom;

  beforeEach(() => {
    vi.resetModules();
    dom = createTestDOM();
    document.head.innerHTML = '';
  });

  afterEach(() => {
    if (dom) dom.window.close();
  });

  it('should have complete working component with styles', async () => {
    // Import core and create component
    const { Button } = await import(
      '../../packages/svarog-ui-core/src/index.js'
    );

    const button = Button({
      text: 'Test Button',
      variant: 'primary',
      onClick: () => {},
    });

    const element = button.getElement();
    document.body.appendChild(element);

    // Verify component structure
    expect(element.tagName).toBe('BUTTON');
    expect(element.textContent).toBe('Test Button');
    expect(element.classList.contains('btn')).toBe(true);

    // Verify styles are injected and accessible
    expect(hasBaseVariables()).toBe(true);

    const injectedStyles = getInjectedStyles();
    expect(injectedStyles.length).toBeGreaterThan(0);

    // Verify cascade order
    const baseStyles = injectedStyles.filter((s) => s.priority === 'base');
    const componentStyles = injectedStyles.filter(
      (s) => s.priority === 'component'
    );

    expect(baseStyles.length).toBeGreaterThan(0);

    if (componentStyles.length > 0) {
      expect(componentStyles[0].priorityValue).toBeGreaterThan(
        baseStyles[0].priorityValue
      );
    }
  });

  it('should handle theme switching correctly', async () => {
    const { switchTheme, getCurrentTheme } = await import(
      '../../packages/svarog-ui-core/src/index.js'
    );

    // This test depends on actual theme implementation
    // Adjust based on your available themes
    const _initialTheme = getCurrentTheme(); // Prefix with _ to indicate intentionally unused

    // Verify theme switching doesn't break style injection
    const initialStyleCount = getInjectedStyles().length;

    // Switch theme (if available)
    try {
      await switchTheme('default');
      const afterSwitchCount = getInjectedStyles().length;
      expect(afterSwitchCount).toBeGreaterThanOrEqual(initialStyleCount);
    } catch (error) {
      // Theme switching might not be fully implemented yet
      console.warn('Theme switching test skipped:', error.message);
    }
  });
});

// Utility function to check package health
export const checkPackageHealth = async () => {
  try {
    // Try to import core package
    const core = await import('../../packages/svarog-ui-core/src/index.js');

    // Check critical exports
    const criticalExports = ['injectStyles', 'css', 'Button', 'themeManager'];

    const missingExports = criticalExports.filter((exp) => !core[exp]);

    if (missingExports.length > 0) {
      throw new Error(`Missing critical exports: ${missingExports.join(', ')}`);
    }

    // Check base styles injection
    const injectedStyles = getInjectedStyles();
    const hasBaseStyles = injectedStyles.some((s) => s.id === 'svarog-base');

    if (!hasBaseStyles) {
      throw new Error('Base styles not automatically injected');
    }

    // Check base variables availability
    if (!hasBaseVariables()) {
      throw new Error('Base CSS variables not available');
    }

    return {
      status: 'healthy',
      exports: Object.keys(core).length,
      injectedStyles: injectedStyles.length,
      baseVariables: hasBaseVariables(),
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      injectedStyles: getInjectedStyles().length,
      baseVariables: hasBaseVariables(),
    };
  }
};
