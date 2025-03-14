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
    } catch (e) {
      // Directory doesn't exist, which is fine
    }

    // Create directory
    await fs.mkdir(componentDir, { recursive: true });

    // Read template files
    const templatesDir = path.resolve(__dirname, 'templates');

    const jsTemplate = await fs.readFile(
      path.join(templatesDir, 'ComponentJS.template'),
      'utf-8'
    );
    const cssTemplate = await fs.readFile(
      path.join(templatesDir, 'ComponentCSS.template'),
      'utf-8'
    );
    const storiesTemplate = await fs.readFile(
      path.join(templatesDir, 'ComponentStories.template'),
      'utf-8'
    );
    const testTemplate = await fs.readFile(
      path.join(templatesDir, 'ComponentTest.template'),
      'utf-8'
    );

    // Replace placeholders in templates
    const replacePlaceholders = (template) => {
      return template
        .replace(/\{\{ComponentName\}\}/g, ComponentName)
        .replace(/\{\{componentName\}\}/g, componentNameLower);
    };

    // Create component files
    const files = [
      { name: `${ComponentName}.js`, content: replacePlaceholders(jsTemplate) },
      {
        name: `${ComponentName}.css`,
        content: replacePlaceholders(cssTemplate),
      },
      {
        name: `${ComponentName}.stories.js`,
        content: replacePlaceholders(storiesTemplate),
      },
      {
        name: `${ComponentName}.test.js`,
        content: replacePlaceholders(testTemplate),
      },
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
      console.log(`Component ${componentName} created successfully!`);
    }
  })
  .catch((error) => {
    console.error('Error:', error.message);
    process.exit(1);
  });
