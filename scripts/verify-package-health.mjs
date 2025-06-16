// scripts/verify-package-health.mjs
import { JSDOM } from 'jsdom';
import { existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Setup DOM environment
const setupTestEnvironment = () => {
  const dom = new JSDOM(
    `<!DOCTYPE html><html><head></head><body></body></html>`,
    {
      url: 'http://localhost',
      pretendToBeVisual: true,
      resources: 'usable',
    }
  );

  // Set up all necessary DOM APIs
  global.document = dom.window.document;
  global.window = dom.window;
  global.HTMLElement = dom.window.HTMLElement;
  global.getComputedStyle = dom.window.getComputedStyle;
  global.requestAnimationFrame =
    dom.window.requestAnimationFrame || ((cb) => setTimeout(cb, 0));
  global.CustomEvent = dom.window.CustomEvent;
  global.Event = dom.window.Event;

  // Mock localStorage for Node.js environment
  if (!global.window.localStorage) {
    const localStorageMock = {
      _data: {},
      getItem(key) {
        return this._data[key] || null;
      },
      setItem(key, value) {
        this._data[key] = value;
      },
      removeItem(key) {
        delete this._data[key];
      },
      clear() {
        this._data = {};
      },
    };
    global.window.localStorage = localStorageMock;
  }

  return dom;
};

// Check if file exists and log status
const checkFile = (filePath, description) => {
  const exists = existsSync(filePath);
  console.log(
    `${exists ? '✅' : '❌'} ${description}: ${exists ? 'Found' : 'Missing'}`
  );
  return exists;
};

// Get CSS variables from document
const getCSSVariableValue = (varName) => {
  try {
    const value = getComputedStyle(document.documentElement).getPropertyValue(
      varName
    );
    return value ? value.trim() : null;
  } catch {
    return null;
  }
};

// Check if injected styles exist
const getInjectedStyles = () => {
  try {
    return Array.from(document.head.querySelectorAll('style[data-svarog]'))
      .map((style) => ({
        id: style.getAttribute('data-svarog'),
        priority: style.getAttribute('data-priority'),
        priorityValue: parseInt(
          style.getAttribute('data-priority-value') || '0'
        ),
        hasContent: Boolean(style.textContent?.trim()),
      }))
      .sort((a, b) => a.priorityValue - b.priorityValue);
  } catch {
    return [];
  }
};

// Verify base variables are accessible
const verifyBaseVariables = () => {
  const criticalVars = [
    '--space-1',
    '--space-4',
    '--color-white',
    '--color-black',
    '--font-size-base',
    '--transition-fast',
    '--shadow-md',
  ];

  const results = criticalVars.map((varName) => {
    const value = getCSSVariableValue(varName);
    return {
      variable: varName,
      value,
      available: Boolean(value && value !== 'initial' && value !== ''),
    };
  });

  const availableCount = results.filter((r) => r.available).length;

  return {
    total: criticalVars.length,
    available: availableCount,
    percentage: Math.round((availableCount / criticalVars.length) * 100),
    details: results,
  };
};

// Main verification function
const verifyPackageHealth = async () => {
  console.log('🔍 Verifying Svarog UI Package Health...\n');

  const results = {
    files: { passed: 0, total: 0 },
    imports: { passed: 0, total: 0 },
    styles: { passed: 0, total: 0 },
    components: { passed: 0, total: 0 },
    overall: 'unknown',
  };

  // 1. File Structure Check
  console.log('📁 Checking file structure...');
  const criticalFiles = [
    { path: 'packages/svarog-ui-core/src/index.js', desc: 'Core index' },
    {
      path: 'packages/svarog-ui-core/src/styles/baseStyles.js',
      desc: 'Base styles',
    },
    {
      path: 'packages/svarog-ui-core/src/styles/baseVariables.js',
      desc: 'Base variables',
    },
    {
      path: 'packages/svarog-ui-core/src/utils/styleInjection.js',
      desc: 'Style injection',
    },
    {
      path: 'packages/svarog-ui-core/src/utils/themeManager.js',
      desc: 'Theme manager',
    },
    { path: 'packages/svarog-ui-core/package.json', desc: 'Core package.json' },
  ];

  criticalFiles.forEach(({ path, desc }) => {
    const fullPath = resolve(__dirname, '..', path);
    results.files.total++;
    if (checkFile(fullPath, desc)) {
      results.files.passed++;
    }
  });

  // 2. Setup test environment
  console.log('\n🧪 Setting up test environment...');
  const dom = setupTestEnvironment();

  try {
    // 3. Import Tests
    console.log('\n📦 Testing imports...');

    // Test style injection utility
    results.imports.total++;
    try {
      const { injectStyles, css } = await import(
        '../packages/svarog-ui-core/src/utils/styleInjection.js'
      );
      console.log('✅ Style injection utilities imported');
      results.imports.passed++;

      // Test style injection
      results.styles.total++;
      injectStyles(
        'test-style',
        css`
          .test {
            color: red;
          }
        `,
        { priority: 'component' }
      );
      const testStyle = document.head.querySelector(
        '[data-svarog="test-style"]'
      );
      if (testStyle) {
        console.log('✅ Style injection working');
        results.styles.passed++;
      } else {
        console.log('❌ Style injection failed');
      }
    } catch (error) {
      console.log('❌ Style injection import failed:', error.message);
    }

    // Test base styles auto-injection
    results.imports.total++;
    results.styles.total++;
    try {
      await import('../packages/svarog-ui-core/src/styles/baseStyles.js');
      console.log('✅ Base styles imported');
      results.imports.passed++;

      const baseStyle = document.head.querySelector(
        '[data-svarog="svarog-base"]'
      );
      if (baseStyle && baseStyle.textContent.includes('box-sizing')) {
        console.log('✅ Base styles auto-injected');
        results.styles.passed++;
      } else {
        console.log('❌ Base styles not auto-injected');
      }
    } catch (error) {
      console.log('❌ Base styles import failed:', error.message);
    }

    // Test base variables auto-injection
    results.imports.total++;
    results.styles.total++;
    try {
      await import('../packages/svarog-ui-core/src/styles/baseVariables.js');
      console.log('✅ Base variables imported');
      results.imports.passed++;

      const baseVarsStyle = document.head.querySelector(
        '[data-svarog="svarog-base-variables"]'
      );
      if (baseVarsStyle && baseVarsStyle.textContent.includes('--space-1')) {
        console.log('✅ Base variables auto-injected');
        results.styles.passed++;
      } else {
        console.log('❌ Base variables not auto-injected');
      }
    } catch (error) {
      console.log('❌ Base variables import failed:', error.message);
    }

    // Test core package import
    results.imports.total++;
    try {
      const core = await import('../packages/svarog-ui-core/src/index.js');
      console.log('✅ Core package imported');
      results.imports.passed++;

      // Check critical exports
      const criticalExports = [
        'injectStyles',
        'css',
        'Button',
        'createElement',
      ];
      const missingExports = criticalExports.filter((exp) => !core[exp]);

      if (missingExports.length === 0) {
        console.log('✅ All critical exports available');
      } else {
        console.log('⚠️  Missing exports:', missingExports.join(', '));
      }
    } catch (error) {
      console.log('❌ Core package import failed:', error.message);
    }

    // 4. Component Test
    console.log('\n🧩 Testing component creation...');
    results.components.total++;
    try {
      const { Button } = await import(
        '../packages/svarog-ui-core/src/index.js'
      );

      const button = Button({ text: 'Test Button', variant: 'primary' });
      const element = button.getElement();

      if (
        element &&
        element.tagName === 'BUTTON' &&
        element.textContent === 'Test Button'
      ) {
        console.log('✅ Button component working');
        results.components.passed++;

        // Add to DOM and check for style injection
        document.body.appendChild(element);

        // Wait for potential async style injection
        await new Promise((resolve) => setTimeout(resolve, 10));

        const buttonStyle = document.head.querySelector(
          '[data-svarog="button"]'
        );
        if (buttonStyle) {
          console.log('✅ Component styles auto-injected');
        } else {
          console.log('⚠️  Component styles not injected (may be expected)');
        }
      } else {
        console.log('❌ Button component not working correctly');
      }
    } catch (error) {
      console.log('❌ Component test failed:', error.message);
    }

    // 5. CSS Variables Check
    console.log('\n🎨 Checking CSS variables availability...');
    await new Promise((resolve) => setTimeout(resolve, 20)); // Wait for styles to apply

    const variableResults = verifyBaseVariables();
    console.log(
      `CSS Variables: ${variableResults.available}/${variableResults.total} (${variableResults.percentage}%)`
    );

    if (variableResults.percentage >= 80) {
      console.log('✅ CSS variables available');
      results.styles.passed++;
    } else {
      console.log('❌ CSS variables not properly available');
      console.log('Missing/Invalid variables:');
      variableResults.details
        .filter((v) => !v.available)
        .forEach((v) =>
          console.log(`  - ${v.variable}: ${v.value || 'not found'}`)
        );
    }
    results.styles.total++;

    // 6. Style Injection Order
    console.log('\n📊 Checking style injection order...');
    const injectedStyles = getInjectedStyles();
    console.log(`Injected styles: ${injectedStyles.length}`);

    if (injectedStyles.length > 0) {
      console.log('Style injection order:');
      injectedStyles.forEach((style) => {
        console.log(
          `  ${style.priority} (${style.priorityValue}): ${style.id}`
        );
      });

      // Verify order is correct
      let orderCorrect = true;
      for (let i = 1; i < injectedStyles.length; i++) {
        if (
          injectedStyles[i].priorityValue < injectedStyles[i - 1].priorityValue
        ) {
          orderCorrect = false;
          break;
        }
      }

      if (orderCorrect) {
        console.log('✅ Style injection order correct');
      } else {
        console.log('❌ Style injection order incorrect');
      }
    }
  } catch (error) {
    console.error('❌ Verification failed:', error);
  } finally {
    dom.window.close();
  }

  // 7. Overall Health Assessment
  console.log('\n📋 Health Summary:');
  console.log(`Files: ${results.files.passed}/${results.files.total}`);
  console.log(`Imports: ${results.imports.passed}/${results.imports.total}`);
  console.log(`Styles: ${results.styles.passed}/${results.styles.total}`);
  console.log(
    `Components: ${results.components.passed}/${results.components.total}`
  );

  const totalPassed = Object.values(results).reduce(
    (sum, category) =>
      typeof category === 'object' && category.passed
        ? sum + category.passed
        : sum,
    0
  );
  const totalChecks = Object.values(results).reduce(
    (sum, category) =>
      typeof category === 'object' && category.total
        ? sum + category.total
        : sum,
    0
  );

  const healthPercentage =
    totalChecks > 0 ? Math.round((totalPassed / totalChecks) * 100) : 0;

  if (healthPercentage >= 90) {
    results.overall = 'healthy';
    console.log(`\n🎉 Package is HEALTHY (${healthPercentage}%)`);
  } else if (healthPercentage >= 70) {
    results.overall = 'warning';
    console.log(`\n⚠️  Package has WARNINGS (${healthPercentage}%)`);
  } else {
    results.overall = 'unhealthy';
    console.log(`\n❌ Package is UNHEALTHY (${healthPercentage}%)`);
  }

  return results;
};

// Run verification if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  verifyPackageHealth()
    .then((results) => {
      process.exit(results.overall === 'healthy' ? 0 : 1);
    })
    .catch((error) => {
      console.error('Verification failed:', error);
      process.exit(1);
    });
}

export { verifyPackageHealth };
