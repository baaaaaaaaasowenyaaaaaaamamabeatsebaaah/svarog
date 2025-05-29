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

/**
 * Create a component from template files
 * @param {string} componentName - Component name (PascalCase)
 */
async function createComponent(componentName) {
  if (!componentName || typeof componentName !== 'string') {
    console.error('Please provide a component name');
    return false;
  }

  // Format component name - ensure first letter is uppercase
  const ComponentName =
    componentName.charAt(0).toUpperCase() + componentName.slice(1);
  const componentNameLower =
    ComponentName.charAt(0).toLowerCase() + ComponentName.slice(1);

  // Create component directory
  const componentDir = path.resolve(
    __dirname,
    '../src/components',
    ComponentName
  );

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
          `Component ${ComponentName} already exists. Overwrite? (y/N) `,
          resolve
        );
      });

      rl.close();

      if (answer.toLowerCase() !== 'y') {
        console.log('Operation cancelled');
        return false;
      }
    } catch (_e) {
      // Directory doesn't exist, which is fine
    }

    // Create directory
    await fs.mkdir(componentDir, { recursive: true });

    // Create index.js file
    await fs.writeFile(
      path.join(componentDir, 'index.js'),
      `// src/components/${ComponentName}/index.js
import ${ComponentName} from './${ComponentName}.js';

export default ${ComponentName};
export { ${ComponentName} };
`
    );

    // Create main component file
    const jsContent = `// src/components/${ComponentName}/${ComponentName}.js
import './${ComponentName}.css';
import {
  createComponent,
  createElement,
} from '../../utils/componentFactory.js';

/**
 * Creates a ${ComponentName} component
 * @param {Object} props - ${ComponentName} properties
 * @returns {Object} ${ComponentName} component
 */
const create${ComponentName} = (props) => {
  // Destructure props with defaults
  const {
    className = '',
    id,
    // Add component-specific props here
  } = props;

  // Component state
  const state = {
    className,
    id,
    // Add component-specific state here
  };

  /**
   * Build the ${componentNameLower} element
   * @returns {HTMLElement} ${ComponentName} element
   */
  const build${ComponentName}Element = () => {
    // Build class names
    const classNames = [
      '${componentNameLower}',
      state.className ? state.className : '',
    ].filter(Boolean);

    // Create element attributes
    const attributes = {
      id: state.id || null,
    };

    // Create element
    const element = createElement('div', {
      attributes,
      classes: classNames,
    });

    return element;
  };

  // Create initial element
  let element = build${ComponentName}Element();

  // Public API
  return {
    /**
     * Get the ${componentNameLower} element
     * @returns {HTMLElement} ${ComponentName} element
     */
    getElement() {
      return element;
    },

    /**
     * Update ${componentNameLower} properties
     * @param {Object} newProps - New properties
     * @returns {Object} ${ComponentName} component (for chaining)
     */
    update(newProps) {
      // Update state
      Object.assign(state, newProps);

      // Rebuild element
      const oldElement = element;
      element = build${ComponentName}Element();

      // Replace in DOM if inserted
      if (oldElement.parentNode) {
        oldElement.parentNode.replaceChild(element, oldElement);
      }

      return this;
    },

    /**
     * Clean up resources
     */
    destroy() {
      // Remove event listeners
      if (element._listeners) {
        Object.entries(element._listeners).forEach(([event, handler]) => {
          element.removeEventListener(event, handler);
        });
        element._listeners = {};
      }

      element = null;
    },
  };
};

// Define required props for validation
create${ComponentName}.requiredProps = [];

// Export as a factory function
export default createComponent('${ComponentName}', create${ComponentName});
`;

    // Create CSS file
    const cssContent = `/**
 * ${ComponentName} component styles
 */

.${componentNameLower} {
  /* Base styles */
  display: block;

  /* Use theme variables when appropriate */
  color: var(--color-text);
  background-color: var(--color-bg);

  /* Add more styling as needed */
}

/* Component states and variants can be added here */
`;

    // Create Stories file
    const storiesContent = `// src/components/${ComponentName}/${ComponentName}.stories.js
import ${ComponentName} from './${ComponentName}.js';

export default {
  title: 'Components/${ComponentName}',
  component: ${ComponentName},
};

export const Default = () => {
  const ${componentNameLower} = ${ComponentName}({
    // Add default props here
  });

  return ${componentNameLower}.getElement();
};

// Add more story examples below
`;

    // Create Test file
    const testContent = `// src/components/${ComponentName}/${ComponentName}.test.js
import { describe, it, expect, vi } from 'vitest';
import ${ComponentName} from './${ComponentName}.js';

describe('${ComponentName} component', () => {
  it('should render correctly with basic props', () => {
    const ${componentNameLower} = ${ComponentName}({
      className: 'custom-class',
    });

    const element = ${componentNameLower}.getElement();

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.className).toContain('${componentNameLower}');
    expect(element.className).toContain('custom-class');
  });

  it('should update props correctly', () => {
    const ${componentNameLower} = ${ComponentName}({});

    ${componentNameLower}.update({
      className: 'updated-class',
    });

    // Get the element AFTER the update
    const updatedElement = ${componentNameLower}.getElement();

    expect(updatedElement.className).toContain('updated-class');
  });

  it('should clean up event listeners when destroyed', () => {
    const ${componentNameLower} = ${ComponentName}({});
    const element = ${componentNameLower}.getElement();

    // Add a test event listener
    const mockHandler = vi.fn();
    element.addEventListener('click', mockHandler);
    element._listeners = { click: mockHandler };

    // Mock removeEventListener to verify it's called
    const originalRemoveEventListener = element.removeEventListener;
    element.removeEventListener = vi.fn();

    ${componentNameLower}.destroy();

    expect(element.removeEventListener).toHaveBeenCalled();

    // Restore original method
    element.removeEventListener = originalRemoveEventListener;
  });
});
`;

    // Create README file
    const readmeContent = `# ${ComponentName} Component

The ${ComponentName} component provides...

## Usage

\`\`\`javascript
import { ${ComponentName} } from '@svarog-ui/core';

// Create a ${componentNameLower}
const ${componentNameLower} = ${ComponentName}({
  // Add props here
});

// Add to DOM
document.body.appendChild(${componentNameLower}.getElement());
\`\`\`

## Props

| Prop      | Type     | Default    | Description                   |
| --------- | -------- | ---------- | ----------------------------- |
| className | string   | ''         | Additional CSS classes        |
| id        | string   | null       | HTML ID attribute             |
<!-- Add more props here -->

## Methods

### getElement()

Returns the ${componentNameLower} DOM element.

\`\`\`javascript
const element = ${componentNameLower}.getElement();
\`\`\`

### update(props)

Updates multiple ${componentNameLower} properties at once.

\`\`\`javascript
${componentNameLower}.update({
  className: 'new-class',
  // Add more props to update
});
\`\`\`

### destroy()

Cleans up resources. Call when removing the ${componentNameLower}.

\`\`\`javascript
${componentNameLower}.destroy();
\`\`\`

## CSS Customization

${ComponentName} styles can be customized using CSS variables:

\`\`\`css
:root {
  /* Add CSS variables here */
}
\`\`\`
`;

    // Write files
    const files = [
      { name: `${ComponentName}.js`, content: jsContent },
      { name: `${ComponentName}.css`, content: cssContent },
      { name: `${ComponentName}.stories.js`, content: storiesContent },
      { name: `${ComponentName}.test.js`, content: testContent },
      { name: 'README.md', content: readmeContent },
    ];

    for (const file of files) {
      await fs.writeFile(path.join(componentDir, file.name), file.content);
    }

    // Update the components registry
    await updateComponentsRegistry(ComponentName);

    // Update the main index.js
    await updateMainIndex(ComponentName);

    console.log(`✅ Component ${ComponentName} created successfully!`);
    console.log(`Files created in src/components/${ComponentName}/`);
    return true;
  } catch (error) {
    console.error(`Error creating component: ${error.message}`);
    return false;
  }
}

/**
 * Update the components registry in getComponents.js
 * @param {string} componentName - Component name
 */
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

/**
 * Update the main index.js file to include the new component
 * @param {string} componentName - Component name
 */
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
    let updatedContent = `${content.slice(0, lastImportEndIndex)}\n${
      importStatement
    }${content.slice(lastImportEndIndex)}`;

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
      console.log(`Component ${componentName} created successfully!`);
    }
  })
  .catch((error) => {
    console.error('Error:', error.message);
    process.exit(1);
  });
