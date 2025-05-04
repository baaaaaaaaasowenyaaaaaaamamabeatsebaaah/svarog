#!/usr/bin/env node

/**
 * Check Stories Script
 *
 * This script checks if all story files in the components directory are properly
 * included in the getComponents.js file. If any stories are missing, it generates
 * the code needed to add them.
 *
 * Usage: node scripts/check-stories.js
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

/**
 * Extract exports from a story file
 * @param {string} filePath - Path to the story file
 * @returns {Promise<string[]>} Array of export names
 */
async function extractStoryExports(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');

    // Find all named exports
    const exportRegex = /export\s+const\s+(\w+)\s*=/g;
    const matches = [];
    let match;

    while ((match = exportRegex.exec(content)) !== null) {
      matches.push(match[1]);
    }

    return matches;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return [];
  }
}

/**
 * Find all story files in the components directory
 * @returns {Promise<Map<string, string[]>>} Map of component names to arrays of story export names
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
      if (!stats.isDirectory()) continue;

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
      } catch (error) {
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
 * @returns {Promise<Object>} Object with registered components and stories
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

    return registeredComponents;
  } catch (error) {
    console.error('Error parsing getComponents.js file:', error.message);
    return new Map();
  }
}

/**
 * Generate code for missing component entries
 * @param {string} componentName - Name of the component
 * @param {string[]} storyExports - Array of story export names
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
 * @param {string[]} missingStories - Array of missing story export names
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
 * Main function
 */
async function main() {
  console.log('Checking component stories...');

  // Find all story files and their exports
  const allComponentStories = await findStoryFiles();

  // Parse the getComponents.js file
  const registeredComponents = await parseGetComponentsFile();

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
        (story) => !registeredStories.includes(story)
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
      console.log(`\nComponent: ${name}`);
      console.log('Stories: ' + stories.join(', '));
      console.log('\nCode to add:');
      console.log(generateComponentCode(name, stories));
    });
  }

  console.log('\n===== Missing Stories =====');
  if (componentsWithMissingStories.length === 0) {
    console.log('None');
  } else {
    componentsWithMissingStories.forEach(({ name, missingStories }) => {
      console.log(`\nComponent: ${name}`);
      console.log('Missing stories: ' + missingStories.join(', '));
      console.log('\nEntries to add:');
      console.log(generateStoryEntries(name, missingStories));
    });

    console.log(
      '\nAdd these entries to their respective component objects in getComponents.js'
    );
  }
}

// Run the main function
main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
