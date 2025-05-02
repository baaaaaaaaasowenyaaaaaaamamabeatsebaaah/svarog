#!/usr/bin/env node

/**
 * Extract CSS Variables Script
 *
 * This script extracts all CSS variables from component CSS files and checks if they
 * exist in all theme files. If a variable is missing in a theme, it adds it with a
 * placeholder value and a comment.
 *
 * Usage: node scripts/extract-css-variables.js [--dry-run]
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
const themesDir = path.resolve(__dirname, '../src/styles/themes');
const baseStylesDir = path.resolve(__dirname, '../src/styles/base');

// Check for dry run flag
const isDryRun = process.argv.includes('--dry-run');

/**
 * Extract CSS variables from a file
 * @param {string} filePath - Path to the CSS file
 * @returns {Promise<Set<string>>} Set of CSS variable names
 */
async function extractCssVariables(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');

    // Find all var(--variable-name) occurrences
    const varRegex = /var\(--([a-zA-Z0-9_-]+)/g;
    const variables = new Set();
    let match;

    while ((match = varRegex.exec(content)) !== null) {
      variables.add(match[1]);
    }

    return variables;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return new Set();
  }
}

/**
 * Extract CSS variable definitions from a theme file
 * @param {string} filePath - Path to the theme CSS file
 * @returns {Promise<Set<string>>} Set of defined CSS variable names
 */
async function extractCssDefinitions(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');

    // Find all --variable-name: declarations
    const defRegex = /--([a-zA-Z0-9_-]+)\s*:/g;
    const definitions = new Set();
    let match;

    while ((match = defRegex.exec(content)) !== null) {
      definitions.add(match[1]);
    }

    return definitions;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return new Set();
  }
}

/**
 * Update a theme file to include missing variables
 * @param {string} themePath - Path to the theme file
 * @param {Set<string>} missingVariables - Set of variables to add
 * @returns {Promise<boolean>} Success status
 */
async function updateThemeFile(themePath, missingVariables) {
  try {
    if (missingVariables.size === 0) {
      return true;
    }

    const content = await fs.readFile(themePath, 'utf-8');

    // Find the closing brace of the theme selector
    const closingBraceIndex = content.lastIndexOf('}');

    if (closingBraceIndex === -1) {
      console.error(`Could not find closing brace in ${themePath}`);
      return false;
    }

    // Generate new variable declarations
    const themeName = path.basename(themePath, '.css').replace('-theme', '');
    const newVariables = Array.from(missingVariables)
      .sort()
      .map((variable) => {
        return `\n  /* TODO: Define value for '${variable}' in ${themeName} theme */\n  --${variable}: inherit;`;
      })
      .join('');

    // Insert new variables before the closing brace
    const updatedContent =
      content.substring(0, closingBraceIndex) +
      newVariables +
      content.substring(closingBraceIndex);

    if (!isDryRun) {
      await fs.writeFile(themePath, updatedContent, 'utf-8');
    }

    return true;
  } catch (error) {
    console.error(`Error updating theme file ${themePath}:`, error.message);
    return false;
  }
}

/**
 * Extract all base CSS variables to ignore them in component analysis
 * @returns {Promise<Set<string>>} Set of base CSS variables
 */
async function extractBaseVariables() {
  try {
    const baseVariables = new Set();

    // Read all files in base styles directory
    const files = await fs.readdir(baseStylesDir);

    for (const file of files) {
      if (!file.endsWith('.css')) continue;

      const filePath = path.join(baseStylesDir, file);
      const content = await fs.readFile(filePath, 'utf-8');

      // Find all CSS variable definitions in base styles
      const defRegex = /--([a-zA-Z0-9_-]+)\s*:/g;
      let match;

      while ((match = defRegex.exec(content)) !== null) {
        baseVariables.add(match[1]);
      }
    }

    return baseVariables;
  } catch (error) {
    console.error('Error extracting base variables:', error.message);
    return new Set();
  }
}

/**
 * Main function
 */
async function main() {
  console.log('Extracting CSS variables from component files...');

  try {
    // First, extract base variables to ignore
    console.log('Loading base CSS variables to exclude...');
    const baseVariables = await extractBaseVariables();
    console.log(
      `Found ${baseVariables.size} base CSS variables that will be ignored`
    );

    // Get all component directories
    const componentDirs = await fs.readdir(componentsDir);

    // Storage for all variables found
    const allVariables = new Set();
    const componentVariables = new Map();

    // Process each component directory
    for (const componentName of componentDirs) {
      const componentDir = path.join(componentsDir, componentName);

      // Skip if not a directory
      const stats = await fs.stat(componentDir);
      if (!stats.isDirectory()) continue;

      // Look for CSS file
      const cssFile = path.join(componentDir, `${componentName}.css`);

      try {
        await fs.access(cssFile);

        // Extract variables
        const variables = await extractCssVariables(cssFile);

        // Filter out base variables
        const componentSpecificVariables = new Set(
          [...variables].filter((variable) => !baseVariables.has(variable))
        );

        if (componentSpecificVariables.size > 0) {
          componentVariables.set(componentName, componentSpecificVariables);
          componentSpecificVariables.forEach((variable) =>
            allVariables.add(variable)
          );
        }
      } catch (error) {
        console.log(`No CSS file found for ${componentName}`);
      }
    }

    console.log(
      `Found ${allVariables.size} unique component-specific CSS variables across ${componentVariables.size} components`
    );
    console.log(
      `(Base variables like colors, spacing, etc. are being ignored)`
    );

    // Now check theme files
    const themeFiles = await fs.readdir(themesDir);
    const themeResults = [];

    for (const themeFile of themeFiles) {
      if (!themeFile.endsWith('-theme.css')) continue;

      const themePath = path.join(themesDir, themeFile);
      const themeName = themeFile.replace('-theme.css', '');

      // Extract existing variable definitions
      const themeDefinitions = await extractCssDefinitions(themePath);

      // Find variables missing from this theme
      const missingVariables = new Set(
        Array.from(allVariables).filter(
          (variable) => !themeDefinitions.has(variable)
        )
      );

      themeResults.push({
        themeName,
        themePath,
        missingVariables,
      });
    }

    // Display results and update files
    let hasUpdates = false;

    console.log('\n===== Theme Variable Status =====');
    for (const { themeName, themePath, missingVariables } of themeResults) {
      if (missingVariables.size === 0) {
        console.log(`✅ ${themeName} theme has all required variables`);
      } else {
        hasUpdates = true;
        console.log(
          `⚠️ ${themeName} theme is missing ${missingVariables.size} variables:`
        );

        // Group missing variables by component
        const missingByComponent = new Map();

        for (const variable of missingVariables) {
          // Find which component(s) use this variable
          const componentsUsingVariable = [];

          for (const [component, vars] of componentVariables.entries()) {
            if (vars.has(variable)) {
              componentsUsingVariable.push(component);
            }
          }

          const componentList = componentsUsingVariable.join(', ');

          if (!missingByComponent.has(componentList)) {
            missingByComponent.set(componentList, []);
          }

          missingByComponent.get(componentList).push(variable);
        }

        // Display missing variables grouped by component
        for (const [components, vars] of missingByComponent.entries()) {
          console.log(`  From ${components}:`);
          for (const variable of vars) {
            console.log(`    --${variable}`);
          }
        }

        // Update theme file if not dry run
        if (isDryRun) {
          console.log(
            `  Would add ${missingVariables.size} variables to ${themeName}-theme.css`
          );
        } else {
          const updated = await updateThemeFile(themePath, missingVariables);
          if (updated) {
            console.log(
              `  ✅ Added ${missingVariables.size} variables to ${themeName}-theme.css`
            );
          } else {
            console.log(`  ❌ Failed to update ${themeName}-theme.css`);
          }
        }
      }
    }

    // Final message
    if (!hasUpdates) {
      console.log('\n✅ All themes have all required variables');
    } else if (isDryRun) {
      console.log('\n📝 Dry run - no changes made');
    } else {
      console.log('\n✅ Themes updated with missing variables');
      console.log(
        '⚠️ Remember to set appropriate values for the added variables!'
      );
    }

    // Output detailed component variable usage
    console.log('\n===== Component Variable Usage =====');
    for (const [component, variables] of componentVariables.entries()) {
      console.log(`${component} (${variables.size} variables):`);
      for (const variable of variables) {
        console.log(`  --${variable}`);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Run the main function
main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
