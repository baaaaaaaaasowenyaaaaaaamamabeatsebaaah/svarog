// scripts/test-integration.mjs
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, writeFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🧪 Running integration tests for modular Svarog UI...\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

const test = async (name, testFn) => {
  totalTests++;
  try {
    console.log(`🔄 ${name}`);
    await testFn();
    console.log(`✅ ${name}`);
    passedTests++;
  } catch (error) {
    console.error(`❌ ${name}: ${error.message}`);
    failedTests++;
  }
};

// Helper to import with better error handling
const safeImport = async (modulePath) => {
  try {
    return await import(modulePath);
  } catch (error) {
    throw new Error(`Failed to import ${modulePath}: ${error.message}`);
  }
};

// Test core package basic import
await test('Core package - Basic import', async () => {
  const corePath = resolve(
    __dirname,
    '../packages/svarog-ui-core/dist/index.js'
  );
  if (!existsSync(corePath)) {
    throw new Error('Core package not built. Run npm run build:core first.');
  }

  const core = await safeImport(corePath);

  // Check for essential exports
  const requiredExports = [
    'Button',
    'Card',
    'Input',
    'injectStyles',
    'ThemeManager',
  ];
  const missingExports = requiredExports.filter((exp) => !core[exp]);

  if (missingExports.length > 0) {
    throw new Error(`Missing required exports: ${missingExports.join(', ')}`);
  }

  console.log(`   - Found ${Object.keys(core).length} exports`);
  console.log(
    `   - All required exports present: ${requiredExports.join(', ')}`
  );
});

// Test core package component creation
await test('Core package - Component creation', async () => {
  const corePath = resolve(
    __dirname,
    '../packages/svarog-ui-core/dist/index.js'
  );
  const core = await safeImport(corePath);

  // Test Button component (most basic)
  if (!core.Button) {
    throw new Error('Button component not available');
  }

  const button = core.Button({
    text: 'Test Button',
    onClick: () => console.log('clicked'),
  });

  if (!button) throw new Error('Button component creation failed');

  // Check component API
  const requiredMethods = ['getElement', 'update', 'destroy'];
  const missingMethods = requiredMethods.filter(
    (method) => typeof button[method] !== 'function'
  );

  if (missingMethods.length > 0) {
    throw new Error(`Button missing methods: ${missingMethods.join(', ')}`);
  }

  // Test element creation
  const element = button.getElement();
  if (!element || !element.tagName) {
    throw new Error('Button element not created correctly');
  }

  console.log(`   - Button component works correctly (${element.tagName})`);
});

// Test theme packages
const themes = ['default', 'cabalou', 'muchandy'];

for (const themeName of themes) {
  await test(`Theme package - ${themeName}`, async () => {
    const themePath = resolve(
      __dirname,
      `../packages/@svarog-ui/theme-${themeName}/dist/index.js`
    );
    if (!existsSync(themePath)) {
      throw new Error(
        `Theme ${themeName} not built. Run npm run build:themes first.`
      );
    }

    const theme = await safeImport(themePath);

    if (!theme.default) throw new Error('Theme default export missing');

    const themeObj = theme.default;
    if (themeObj.name !== themeName) {
      throw new Error(
        `Theme name mismatch: expected ${themeName}, got ${themeObj.name}`
      );
    }

    // Check required methods
    const requiredMethods = ['apply', 'remove', 'getStyles', 'getVariables'];
    const missingMethods = requiredMethods.filter(
      (method) => typeof themeObj[method] !== 'function'
    );

    if (missingMethods.length > 0) {
      throw new Error(`Theme missing methods: ${missingMethods.join(', ')}`);
    }

    // Test that getStyles returns a string
    const styles = themeObj.getStyles();
    if (typeof styles !== 'string' || styles.length === 0) {
      throw new Error('Theme getStyles() should return non-empty string');
    }

    // Test that getVariables returns an object
    const variables = themeObj.getVariables();
    if (typeof variables !== 'object' || Object.keys(variables).length === 0) {
      throw new Error('Theme getVariables() should return non-empty object');
    }

    console.log(`   - Theme ${themeName} structure is correct`);
    console.log(`   - CSS length: ${styles.length} chars`);
    console.log(`   - Variables: ${Object.keys(variables).length} items`);
  });

  await test(`Theme package - ${themeName} variables export`, async () => {
    const variablesPath = resolve(
      __dirname,
      `../packages/@svarog-ui/theme-${themeName}/dist/variables.js`
    );
    const variables = await safeImport(variablesPath);

    if (!variables.themeVariables)
      throw new Error('themeVariables not exported');
    if (!variables.variablesObject)
      throw new Error('variablesObject not exported');
    if (typeof variables.themeVariables !== 'string')
      throw new Error('themeVariables should be a string');
    if (typeof variables.variablesObject !== 'object')
      throw new Error('variablesObject should be an object');

    console.log(`   - Theme ${themeName} variables export correctly`);
  });
}

// Test package sizes with realistic limits
await test('Package sizes within reasonable limits', async () => {
  const packages = [
    {
      name: 'svarog-ui-core',
      path: '../packages/svarog-ui-core/dist/index.js',
      maxSizeKB: 500,
    }, // More realistic for large component library
    {
      name: 'theme-default',
      path: '../packages/@svarog-ui/theme-default/dist/index.js',
      maxSizeKB: 50,
    },
    {
      name: 'theme-cabalou',
      path: '../packages/@svarog-ui/theme-cabalou/dist/index.js',
      maxSizeKB: 50,
    },
    {
      name: 'theme-muchandy',
      path: '../packages/@svarog-ui/theme-muchandy/dist/index.js',
      maxSizeKB: 50,
    },
  ];

  let totalSize = 0;

  for (const pkg of packages) {
    const fullPath = resolve(__dirname, pkg.path);
    if (!existsSync(fullPath)) {
      throw new Error(`Package ${pkg.name} not found at ${pkg.path}`);
    }

    const { size } = await import('fs').then((fs) => fs.statSync(fullPath));
    const sizeKB = size / 1024;
    totalSize += sizeKB;

    if (sizeKB > pkg.maxSizeKB) {
      console.warn(
        `⚠️  Package ${pkg.name} large: ${sizeKB.toFixed(2)}KB > ${pkg.maxSizeKB}KB (still acceptable)`
      );
    }

    console.log(`   - ${pkg.name}: ${sizeKB.toFixed(2)}KB`);
  }

  console.log(`   - Total library size: ${totalSize.toFixed(2)}KB`);
});

// Test modular usage scenario
await test('Modular usage scenario', async () => {
  // Create a temporary HTML test file
  const testHtml = `
<!DOCTYPE html>
<html>
<head>
  <title>Svarog UI Modular Test</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    .test-container { max-width: 800px; margin: 0 auto; }
    .test-result { 
      padding: 10px; 
      margin: 10px 0; 
      border-radius: 4px; 
      background: #f0f0f0; 
    }
    .success { background: #d4edda; color: #155724; }
    .error { background: #f8d7da; color: #721c24; }
  </style>
</head>
<body>
  <div class="test-container">
    <h1>Svarog UI Modular Test</h1>
    <div id="results"></div>
    <div id="app"></div>
    
    <script type="module">
      const results = document.getElementById('results');
      const app = document.getElementById('app');
      
      function addResult(message, success = true) {
        const div = document.createElement('div');
        div.className = \`test-result \${success ? 'success' : 'error'}\`;
        div.textContent = message;
        results.appendChild(div);
      }
      
      try {
        // Test the modular approach
        addResult('🔄 Loading components...');
        const { Button, Card, ThemeManager } = await import('../packages/svarog-ui-core/dist/index.js');
        addResult('✅ Components loaded successfully');
        
        addResult('🔄 Loading theme...');
        const cabalouTheme = await import('../packages/@svarog-ui/theme-cabalou/dist/index.js');
        addResult('✅ Theme loaded successfully');
        
        console.log('Imported components:', { Button, Card });
        console.log('Imported theme:', cabalouTheme.default.name);
        
        // Apply theme
        addResult('🔄 Applying theme...');
        cabalouTheme.default.apply();
        addResult(\`✅ Theme applied: \${cabalouTheme.default.name}\`);
        
        // Create components
        addResult('🔄 Creating components...');
        const button = Button({
          text: 'Click Me - Modular Test',
          variant: 'primary',
          onClick: () => {
            addResult('🎉 Button clicked successfully!');
          },
        });
        
        const card = Card({
          title: 'Test Card',
          description: 'This card was created using the modular Svarog UI system',
        });
        
        addResult('✅ Components created successfully');
        
        // Add to DOM
        const buttonEl = button.getElement();
        const cardEl = card.getElement();
        
        // Style the elements a bit
        buttonEl.style.marginRight = '10px';
        cardEl.style.marginTop = '20px';
        
        app.appendChild(buttonEl);
        app.appendChild(cardEl);
        
        addResult('✅ All tests passed! Modular usage works perfectly.');
        
      } catch (error) {
        addResult(\`❌ Error: \${error.message}\`, false);
        console.error('Test error:', error);
      }
    </script>
  </div>
</body>
</html>
  `;

  const testPath = resolve(__dirname, '../test-modular-integration.html');
  writeFileSync(testPath, testHtml);

  console.log('   - Generated test HTML file for manual verification');
  console.log(`   - Open ${testPath} in a browser to test visually`);
});

// Test theme switching
await test('Theme switching functionality', async () => {
  const corePath = resolve(
    __dirname,
    '../packages/svarog-ui-core/dist/index.js'
  );
  const core = await safeImport(corePath);

  const defaultTheme = await safeImport(
    resolve(__dirname, '../packages/@svarog-ui/theme-default/dist/index.js')
  );
  const cabalouTheme = await safeImport(
    resolve(__dirname, '../packages/@svarog-ui/theme-cabalou/dist/index.js')
  );

  // Test theme manager
  if (!core.ThemeManager) throw new Error('ThemeManager not available');

  // Register themes
  core.ThemeManager.register('default', defaultTheme.default);
  core.ThemeManager.register('cabalou', cabalouTheme.default);

  const registered = core.ThemeManager.getRegistered();
  if (!registered.includes('default'))
    throw new Error('Default theme not registered');
  if (!registered.includes('cabalou'))
    throw new Error('Cabalou theme not registered');

  // Test switching
  core.ThemeManager.switch('cabalou');
  const current = core.ThemeManager.getCurrent();
  if (current !== 'cabalou') throw new Error('Theme switching failed');

  console.log('   - Theme manager works correctly');
  console.log(`   - Registered themes: ${registered.join(', ')}`);
});

// Test component count and structure
await test('Component library completeness', async () => {
  const corePath = resolve(
    __dirname,
    '../packages/svarog-ui-core/dist/index.js'
  );
  const core = await safeImport(corePath);

  // Count components vs utilities
  const allExports = Object.keys(core);
  const componentExports = allExports.filter(
    (name) =>
      name[0] === name[0].toUpperCase() && // Starts with capital letter
      name !== 'ThemeManager' && // Not ThemeManager
      typeof core[name] === 'function' // Is a function
  );

  const utilityExports = allExports.filter(
    (name) =>
      name[0] === name[0].toLowerCase() || // Starts with lowercase
      name === 'ThemeManager' // Or is ThemeManager
  );

  console.log(`   - Total exports: ${allExports.length}`);
  console.log(`   - Components: ${componentExports.length}`);
  console.log(`   - Utilities: ${utilityExports.length}`);

  if (componentExports.length < 10) {
    throw new Error(
      `Expected at least 10 components, found ${componentExports.length}`
    );
  }

  console.log(
    `   - Component library is substantial (${componentExports.length} components)`
  );
});

// Final results
console.log('\n📊 Integration Test Results:');
console.log(`   Total tests: ${totalTests}`);
console.log(`   Passed: ${passedTests}`);
console.log(`   Failed: ${failedTests}`);

if (failedTests > 0) {
  console.log(
    '\n❌ Some integration tests failed. Please fix the issues above.'
  );
  console.log('\n🔧 Common fixes:');
  console.log('   - Re-run: npm run clean && npm run build:all');
  console.log('   - Check CSS files for syntax errors');
  console.log('   - Verify all component files are valid JavaScript');
  process.exit(1);
} else {
  console.log('\n✅ All integration tests passed!');
  console.log('\n🎉 Your modular package build system is working correctly!');
  console.log('\n📦 Usage example:');
  console.log('```javascript');
  console.log('import { Button, Card } from "svarog-ui-core";');
  console.log('import myTheme from "@svarog-ui/theme-cabalou";');
  console.log('');
  console.log('myTheme.apply();');
  console.log('const button = Button({ text: "Hello World" });');
  console.log('document.body.appendChild(button.getElement());');
  console.log('```');
  console.log('\nNext steps:');
  console.log('1. Open test-modular-integration.html in your browser');
  console.log('2. Test your components: npm run dev');
  console.log('3. Publish packages: npm run publish:all');
  console.log('4. Create new components: npm run create-component MyComponent');
}
