#!/usr/bin/env node

/**
 * Update Component Stories Script
 *
 * This script scans for story files in the components directory and automatically
 * updates the getComponents.js file to include any missing components and stories.
 *
 * Usage: node scripts/update-stories.js [--dry-run]
 *
 * Options:
 *   --dry-run  Show what would be updated without making changes
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// File paths
const componentsDir = path.resolve(__dirname, '../src/components');
const getComponentsFile = path.resolve(
  __dirname,
  '../src/utils/getComponents.js'
);

// Constants
const STORY_FILE_SUFFIX = '.stories.js';

// Check for dry run flag
const isDryRun = process.argv.includes('--dry-run');

/**
 * Extract exports from a story file
 * @param {string} filePath - Path to the story file
 * @returns {Promise<Array<string>>} Array of export names
 */
async function extractStoryExports(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');

    // Find all named exports
    const exportRegex = /export\s+const\s+(\w+)\s*=/g;
    const exports = [];
    let match;

    while ((match = exportRegex.exec(content)) !== null) {
      exports.push(match[1]);
    }

    return exports;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return [];
  }
}

/**
 * Find all story files in the components directory
 * @returns {Promise<Map<string, Array<string>>>} Map of component names to arrays of story exports
 */
async function findStoryFiles() {
  const componentStories = new Map();

  try {
    // Get all component directories
    const componentDirs = await fs.readdir(componentsDir);

    for (const componentName of componentDirs) {
      const componentDir = path.join(componentsDir, componentName);

      // Check if it's a directory
      const stats = await fs.stat(componentDir);
      if (!stats.isDirectory()) {
        continue;
      }

      // Check for story file
      const storyFile = path.join(
        componentDir,
        `${componentName}${STORY_FILE_SUFFIX}`
      );
      try {
        await fs.access(storyFile);

        // Extract exports from the story file
        const storyExports = await extractStoryExports(storyFile);
        if (storyExports.length > 0) {
          componentStories.set(componentName, storyExports);
        }
      } catch (_error) {
        // Story file doesn't exist or can't be accessed
        console.log(`No story file found for ${componentName}`);
      }
    }

    return componentStories;
  } catch (error) {
    console.error('Error finding story files:', error.message);
    return new Map();
  }
}

/**
 * Parse the getComponents.js file to find registered components and stories
 * @returns {Promise<{content: string, components: Map<string, string[]>}>} Object with file content and registered components
 */
async function parseGetComponentsFile() {
  try {
    const content = await fs.readFile(getComponentsFile, 'utf-8');

    // Find all registered components and their stories
    const registeredComponents = new Map();

    // Match component entries in the components array
    const componentRegex =
      /{[\s\n]*name:\s*['"]([^'"]+)['"][\s\S]*?stories:\s*\[([\s\S]*?)\][\s\S]*?},/g;
    let componentMatch;

    while ((componentMatch = componentRegex.exec(content)) !== null) {
      const componentName = componentMatch[1];
      const storiesSection = componentMatch[2];

      // Extract story names
      const storyRegex = /name:\s*['"]([^'"]+)['"]/g;
      const registeredStories = [];
      let storyMatch;

      while ((storyMatch = storyRegex.exec(storiesSection)) !== null) {
        registeredStories.push(storyMatch[1]);
      }

      registeredComponents.set(componentName, registeredStories);
    }

    return { content, components: registeredComponents };
  } catch (error) {
    console.error('Error parsing getComponents.js file:', error.message);
    return { content: '', components: new Map() };
  }
}

/**
 * Generate code for a component entry
 * @param {string} componentName - Name of the component
 * @param {Array<string>} storyExports - Array of story export names
 * @returns {string} Generated code
 */
function generateComponentCode(componentName, storyExports) {
  const storyEntries = storyExports
    .map((storyName) => {
      return `
      {
        name: '${storyName}',
        module: () =>
          import('../components/${componentName}/${componentName}.stories.js').then(
            (m) => m.${storyName}
          ),
      }`;
    })
    .join(',');

  return `
  {
    name: '${componentName}',
    stories: [${storyEntries}
    ],
  },`;
}

/**
 * Generate code for missing story entries
 * @param {string} componentName - Name of the component
 * @param {Array<string>} missingStories - Array of missing story export names
 * @returns {string} Generated code
 */
function generateStoryEntries(componentName, missingStories) {
  return missingStories
    .map((storyName) => {
      return `
      {
        name: '${storyName}',
        module: () =>
          import('../components/${componentName}/${componentName}.stories.js').then(
            (m) => m.${storyName}
          ),
      }`;
    })
    .join(',');
}

/**
 * Update the getComponents.js file with missing components and stories
 * @param {string} content - Original file content
 * @param {Array<{name: string, stories: Array<string>}>} missingComponents - Array of missing components
 * @param {Array<{name: string, missingStories: Array<string>}>} componentsWithMissingStories - Array of components with missing stories
 * @returns {string} Updated file content
 */
function updateGetComponentsFile(
  content,
  missingComponents,
  componentsWithMissingStories
) {
  let updatedContent = content;

  // Add missing components
  if (missingComponents.length > 0) {
    // Find the end of the components array
    const componentsArrayEnd = updatedContent.lastIndexOf('];');

    if (componentsArrayEnd !== -1) {
      // Generate code for all missing components
      const newComponentsCode = missingComponents
        .map(({ name, stories }) => generateComponentCode(name, stories))
        .join('\n');

      // Insert new components before the end of the array
      updatedContent =
        updatedContent.substring(0, componentsArrayEnd) +
        newComponentsCode +
        updatedContent.substring(componentsArrayEnd);
    }
  }

  // Add missing stories to existing components
  if (componentsWithMissingStories.length > 0) {
    for (const { name, missingStories } of componentsWithMissingStories) {
      // Find the component's stories array
      const regex = new RegExp(
        `name:\\s*['"]${name}['"][\\s\\S]*?stories:\\s*\\[([\\s\\S]*?)\\]`,
        'g'
      );
      const match = regex.exec(updatedContent);

      if (match) {
        const storiesArrayContent = match[1];
        const storiesArrayEnd = match.index + match[0].lastIndexOf(']');

        // Generate code for missing stories
        const newStoriesCode = generateStoryEntries(name, missingStories);

        // Insert new stories before the end of the array
        updatedContent =
          updatedContent.substring(0, storiesArrayEnd) +
          (storiesArrayContent.trim() ? ',' : '') +
          newStoriesCode +
          updatedContent.substring(storiesArrayEnd);
      }
    }
  }

  return updatedContent;
}

/**
 * Main function
 */
async function main() {
  console.log('Scanning component stories...');

  // Find all story files and their exports
  const allComponentStories = await findStoryFiles();

  // Parse the getComponents.js file
  const { content, components: registeredComponents } =
    await parseGetComponentsFile();

  if (!content) {
    console.error('Could not read or parse getComponents.js file. Aborting.');
    process.exit(1);
  }

  // Identify missing components and stories
  const missingComponents = [];
  const componentsWithMissingStories = [];

  for (const [componentName, storyExports] of allComponentStories.entries()) {
    if (!registeredComponents.has(componentName)) {
      // Component is not registered at all
      missingComponents.push({
        name: componentName,
        stories: storyExports,
      });
    } else {
      // Check for missing stories
      const registeredStories = registeredComponents.get(componentName);
      const missingStories = storyExports.filter(
        (storyName) => !registeredStories.includes(storyName)
      );

      if (missingStories.length > 0) {
        componentsWithMissingStories.push({
          name: componentName,
          missingStories,
        });
      }
    }
  }

  // Display results
  if (
    missingComponents.length === 0 &&
    componentsWithMissingStories.length === 0
  ) {
    console.log('✅ All components and stories are properly registered!');
    return;
  }

  console.log('\n===== Missing Components =====');
  if (missingComponents.length === 0) {
    console.log('None');
  } else {
    missingComponents.forEach(({ name, stories }) => {
      console.log(`- ${name} (${stories.length} stories)`);
    });
  }

  console.log('\n===== Missing Stories =====');
  if (componentsWithMissingStories.length === 0) {
    console.log('None');
  } else {
    componentsWithMissingStories.forEach(({ name, missingStories }) => {
      console.log(`- ${name}: ${missingStories.join(', ')}`);
    });
  }

  // Update the file
  if (isDryRun) {
    console.log('\n📝 Dry run - no changes made');
  } else {
    try {
      const updatedContent = updateGetComponentsFile(
        content,
        missingComponents,
        componentsWithMissingStories
      );

      await fs.writeFile(getComponentsFile, updatedContent, 'utf-8');

      console.log(
        `\n✅ Updated getComponents.js with ${missingComponents.length} missing components and ${componentsWithMissingStories.length} components with missing stories`
      );
    } catch (error) {
      console.error('Error updating getComponents.js file:', error.message);
      process.exit(1);
    }
  }
}

// Run the main function
main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
