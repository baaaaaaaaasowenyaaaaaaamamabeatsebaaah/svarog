#!/usr/bin/env node

/**
 * Component Generator Script
 *
 * This script creates new component files with standardized structure.
 * Usage: npm run create-component ComponentName
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Templates for component files
const templates = {
  component: (name) => `// src/components/${name}/${name}.js
import './${name}.css';
import { Component } from '../../utils/componentFactory.js';

/**
 * ${name} component 
 * @extends Component
 */
export default class ${name} extends Component {
  /**
   * Creates a new ${name} instance
   * 
   * @param {Object} props - ${name} properties
   * @param {string} [props.className=''] - Additional CSS class names
   */
  constructor({
    className = '',
    // Add your props here
  }) {
    super();
    
    this.props = {
      className,
      // Store your props here
    };
    
    this.element = this.createElement${name}();
  }
  
  /**
   * Creates the ${name.toLowerCase()} element
   * @private
   * @returns {HTMLElement} The ${name.toLowerCase()} element
   */
  createElement${name}() {
    // Build class names
    const classNames = this.createClassNames(
      '${name.toLowerCase()}',
      this.props.className
    );
    
    // Create the main element
    const element = this.createElement('div', { 
      className: classNames,
      // Add content and other properties here
    });
    
    return element;
  }
  
  /**
   * Gets the ${name.toLowerCase()} element
   * @returns {HTMLElement} The ${name.toLowerCase()} element
   */
  getElement() {
    return this.element;
  }
}
`,

  css: (name) => `/**
 * ${name} component styles
 */

.${name.toLowerCase()} {
  /* Base styling */
  display: flex;
  box-sizing: border-box;
}

/* Add additional styles here */
`,

  story: (name) => `// src/components/${name}/${name}.stories.js
import ${name} from './${name}.js';

export default {
  title: 'Components/${name}',
  component: ${name},
};

export const Default = () => {
  return new ${name}({
    // Add props here
  });
};

// Add more story variants here
`,

  test: (name) => `// src/components/${name}/${name}.test.js
import { describe, it, expect, vi } from 'vitest';
import ${name} from './${name}.js';

describe('${name} component', () => {
  it('should create a ${name.toLowerCase()} element', () => {
    const ${name.toLowerCase()} = new ${name}({});
    
    const element = ${name.toLowerCase()}.getElement();
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.className).toBe('${name.toLowerCase()}');
  });
  
  // Add more tests here
});
`,
};

// Create component files
async function createComponent(componentName) {
  if (!componentName || typeof componentName !== 'string') {
    console.error('Please provide a component name');
    return false;
  }

  // Format component name - ensure first letter is uppercase
  const name = componentName.charAt(0).toUpperCase() + componentName.slice(1);

  // Create component directory
  const componentDir = path.resolve(__dirname, '../src/components', name);

  try {
    // Check if component already exists
    try {
      await fs.access(componentDir);

      // Ask for confirmation to overwrite
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      const answer = await new Promise((resolve) => {
        rl.question(
          `Component ${name} already exists. Overwrite? (y/N) `,
          resolve
        );
      });

      rl.close();

      if (answer.toLowerCase() !== 'y') {
        console.log('Operation cancelled');
        return false;
      }
    } catch (e) {
      // Directory doesn't exist, which is fine
    }

    // Create directory
    await fs.mkdir(componentDir, { recursive: true });

    // Create component files
    const files = [
      { name: `${name}.js`, content: templates.component(name) },
      { name: `${name}.css`, content: templates.css(name) },
      { name: `${name}.stories.js`, content: templates.story(name) },
      { name: `${name}.test.js`, content: templates.test(name) },
    ];

    for (const file of files) {
      await fs.writeFile(path.join(componentDir, file.name), file.content);
    }

    // Update the getComponents.js file to include the new component
    await updateComponentsRegistry(name);

    console.log(`✅ Component ${name} created successfully!`);
    console.log(`Files created in src/components/${name}/`);
    return true;
  } catch (error) {
    console.error(`Error creating component: ${error.message}`);
    return false;
  }
}

// Update the components registry
async function updateComponentsRegistry(componentName) {
  const registryPath = path.resolve(__dirname, '../src/utils/getComponents.js');

  try {
    // Read the current registry file
    let content = await fs.readFile(registryPath, 'utf-8');

    // Check if component is already registered
    if (content.includes(`name: '${componentName}'`)) {
      console.log(
        `Component ${componentName} is already registered in getComponents.js`
      );
      return;
    }

    // Find the components array
    const componentsArrayStart = content.indexOf('const components = [');

    if (componentsArrayStart === -1) {
      console.warn('Could not find components array in getComponents.js');
      return;
    }

    // Find the closing bracket of the components array
    const componentsArrayEnd = content.indexOf('];', componentsArrayStart);

    if (componentsArrayEnd === -1) {
      console.warn(
        'Could not find end of components array in getComponents.js'
      );
      return;
    }

    // Create the new component entry
    const newComponentEntry = `
  {
    name: '${componentName}',
    stories: [
      {
        name: 'Default',
        module: () =>
          import('../components/${componentName}/${componentName}.stories.js').then(
            (m) => m.Default
          ),
      },
    ],
  },`;

    // Insert the new component entry before the closing bracket
    const updatedContent =
      content.slice(0, componentsArrayEnd) +
      newComponentEntry +
      content.slice(componentsArrayEnd);

    // Write the updated content back to the file
    await fs.writeFile(registryPath, updatedContent, 'utf-8');

    console.log(`Updated getComponents.js with ${componentName}`);
  } catch (error) {
    console.warn(`Could not update getComponents.js: ${error.message}`);
  }
}

// Update the main index.js file to include the new component
async function updateMainIndex(componentName) {
  const indexPath = path.resolve(__dirname, '../src/index.js');

  try {
    // Read the current index file
    let content = await fs.readFile(indexPath, 'utf-8');

    // Check if component is already exported
    if (content.includes(`import ${componentName} from`)) {
      console.log(`Component ${componentName} is already exported in index.js`);
      return;
    }

    // Add the import statement
    const importStatement = `import ${componentName} from './components/${componentName}/${componentName}.js';`;

    // Find the last import statement
    const lastImportIndex = content.lastIndexOf('import');
    const lastImportEndIndex = content.indexOf(';', lastImportIndex) + 1;

    // Insert the new import after the last import
    let updatedContent =
      content.slice(0, lastImportEndIndex) +
      '\n' +
      importStatement +
      content.slice(lastImportEndIndex);

    // Add to the Svarog object
    updatedContent = updatedContent.replace(
      'const Svarog = {',
      `const Svarog = {\n  ${componentName},`
    );

    // Add to the named exports
    updatedContent = updatedContent.replace(
      'export { ',
      `export { \n  ${componentName},\n  `
    );

    // Write the updated content back to the file
    await fs.writeFile(indexPath, updatedContent, 'utf-8');

    console.log(`Updated index.js with ${componentName}`);
  } catch (error) {
    console.warn(`Could not update index.js: ${error.message}`);
  }
}

// Run the script
const componentName = process.argv[2];

if (!componentName) {
  console.error(
    'Please provide a component name: npm run create-component ComponentName'
  );
  process.exit(1);
}

// Create component
createComponent(componentName)
  .then((success) => {
    if (success) {
      // Update main index.js
      return updateMainIndex(componentName);
    }
  })
  .catch((error) => {
    console.error('Error:', error.message);
    process.exit(1);
  });
