// quick-test.mjs - Minimal health check without dependencies
import { JSDOM } from 'jsdom';

const quickHealthCheck = async () => {
  console.log('🔍 Quick Svarog UI Health Check...\n');

  // Setup minimal DOM
  const dom = new JSDOM(
    `<!DOCTYPE html><html><head></head><body></body></html>`
  );
  global.document = dom.window.document;
  global.window = dom.window;
  global.HTMLElement = dom.window.HTMLElement;

  let score = 0;
  const tests = [];

  try {
    // Test 1: Can import core?
    try {
      const core = await import('./packages/svarog-ui-core/src/index.js');
      tests.push({ name: 'Core Import', passed: true, score: 20 });
      score += 20;

      // Test 2: Are base variables injected?
      const baseVars = document.head.querySelector(
        '[data-svarog="svarog-base-variables"]'
      );
      tests.push({ name: 'Base Variables', passed: !!baseVars, score: 25 });
      if (baseVars) score += 25;

      // Test 3: Are base styles injected?
      const baseStyles = document.head.querySelector(
        '[data-svarog="svarog-base"]'
      );
      tests.push({ name: 'Base Styles', passed: !!baseStyles, score: 25 });
      if (baseStyles) score += 25;

      // Test 4: Can create component?
      try {
        const button = core.Button({ text: 'Test' });
        const element = button.getElement();
        const isButton = element?.tagName === 'BUTTON';
        tests.push({ name: 'Component Creation', passed: isButton, score: 15 });
        if (isButton) score += 15;
      } catch (e) {
        tests.push({
          name: 'Component Creation',
          passed: false,
          score: 0,
          error: e.message,
        });
      }

      // Test 5: Are CSS variables accessible?
      try {
        const spaceVar = getComputedStyle(document.documentElement)
          .getPropertyValue('--space-4')
          .trim();
        const hasVars = spaceVar === '16px';
        tests.push({ name: 'CSS Variables', passed: hasVars, score: 15 });
        if (hasVars) score += 15;
      } catch (e) {
        tests.push({
          name: 'CSS Variables',
          passed: false,
          score: 0,
          error: e.message,
        });
      }
    } catch (e) {
      tests.push({
        name: 'Core Import',
        passed: false,
        score: 0,
        error: e.message,
      });
    }
  } catch (e) {
    console.error('❌ Critical failure:', e.message);
  } finally {
    dom.window.close();
  }

  // Results
  tests.forEach((test) => {
    const status = test.passed ? '✅' : '❌';
    const error = test.error ? ` (${test.error})` : '';
    console.log(`${status} ${test.name}${error}`);
  });

  console.log(`\n📊 Health Score: ${score}/100`);

  if (score >= 90) {
    console.log('🎉 HEALTHY - Package working correctly!');
  } else if (score >= 70) {
    console.log('⚠️ WARNING - Some issues detected');
  } else {
    console.log('❌ UNHEALTHY - Major issues, needs fixing');
  }

  return { score, tests, healthy: score >= 90 };
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  quickHealthCheck().then((result) => {
    process.exit(result.healthy ? 0 : 1);
  });
}

export { quickHealthCheck };

// USAGE:
// node quick-test.mjs
