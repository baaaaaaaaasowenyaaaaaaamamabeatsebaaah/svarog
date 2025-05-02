#!/usr/bin/env node
/**
 * Group variables by component
 * @param {Set<string>} variables - Set of variables
 * @param {Map<string, Set<string>>} componentVariables - Map of components to their variables
 * @returns {Map<string, Array<string>>} Variables grouped by component
 *

/**
 * Advanced CSS Variables Analysis Script
 * 
 * This script:
 * 1. Extracts all CSS variables from component CSS files
 * 2. Checks if they exist in all theme files
 * 3. Identifies inheritance patterns between variables
 * 4. Suggests values for missing variables based on the default theme
 * 5. Updates theme files with missing variables and suggested values
 * 
 * Usage: node scripts/analyze-css-variables.js [--dry-run] [--auto-suggest]
 * 
 * Options:
 *   --dry-run      Show what would be updated without making changes
 *   --auto-suggest Automatically suggest values based on inheritance patterns
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
const DEFAULT_THEME_PATH = path.resolve(themesDir, 'default-theme.css');

// Command line arguments
const isDryRun = process.argv.includes('--dry-run');
const autoSuggest = process.argv.includes('--auto-suggest');

/**
 * Extract CSS variables used in a file
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
 * Extract CSS variable definitions and values from a theme file
 * @param {string} filePath - Path to the theme CSS file
 * @returns {Promise<Map<string, string>>} Map of variable names to their values
 */
async function extractCssDefinitionsWithValues(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');

    // Find all --variable-name: value; declarations
    const defRegex = /--([a-zA-Z0-9_-]+)\s*:\s*(.*?)\s*;/g;
    const definitions = new Map();
    let match;

    while ((match = defRegex.exec(content)) !== null) {
      definitions.set(match[1], match[2]);
    }

    return definitions;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return new Map();
  }
}

/**
 * Find inheritance patterns in CSS variables
 * @param {Map<string, string>} variableMap - Map of variable names to values
 * @returns {Map<string, Set<string>>} Map of variables to the variables they inherit from
 */
function findInheritancePatterns(variableMap) {
  const inheritance = new Map();
  const varRefRegex = /var\(--([a-zA-Z0-9_-]+)(?:,\s*(.*?))?\)/g;

  for (const [variable, value] of variableMap.entries()) {
    const dependencies = new Set();
    let match;

    // Reset regex state
    varRefRegex.lastIndex = 0;

    while ((match = varRefRegex.exec(value)) !== null) {
      dependencies.add(match[1]);
    }

    if (dependencies.size > 0) {
      inheritance.set(variable, dependencies);
    }
  }

  return inheritance;
}

/**
 * Suggest value for a variable based on inheritance patterns and default theme
 * @param {string} variable - The variable name
 * @param {Map<string, string>} defaultThemeValues - Variable values in default theme
 * @param {Map<string, Set<string>>} inheritancePatterns - Inheritance patterns
 * @returns {string|null} Suggested value or null if cannot suggest
 */
function suggestValue(variable, defaultThemeValues, inheritancePatterns) {
  // Check if variable exists in default theme
  if (defaultThemeValues.has(variable)) {
    const defaultValue = defaultThemeValues.get(variable);

    // Check if this variable inherits from other variables
    if (inheritancePatterns.has(variable)) {
      // Return the inheritance chain as is, assuming those variables exist in other themes
      return defaultValue;
    }

    // If it's a simple value, return it
    if (!defaultValue.includes('var(--')) {
      return defaultValue;
    }

    // Otherwise return the default value with a comment about checking variable references
    return defaultValue;
  }

  return null;
}

/**
 * Update a theme file to include missing variables
 * @param {string} themePath - Path to the theme file
 * @param {Map<string, string>} variablesToAdd - Map of variables to add with their values
 * @returns {Promise<boolean>} Success status
 */
async function updateThemeFile(themePath, variablesToAdd) {
  try {
    if (variablesToAdd.size === 0) {
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
    const newVariables = Array.from(variablesToAdd.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([variable, value]) => {
        return `\n  /* TODO: Verify this value for '${variable}' in ${themeName} theme */\n  --${variable}: ${value};`;
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
function groupVariablesByComponent(variables, componentVariables) {
  const result = new Map();

  for (const variable of variables) {
    // Find which component(s) use this variable
    const componentsUsingVariable = [];

    for (const [component, vars] of componentVariables.entries()) {
      if (vars.has(variable)) {
        componentsUsingVariable.push(component);
      }
    }

    // If no specific component uses this variable, mark as "common"
    const componentList =
      componentsUsingVariable.length > 0
        ? componentsUsingVariable.join(', ')
        : 'common';

    if (!result.has(componentList)) {
      result.set(componentList, []);
    }

    result.get(componentList).push(variable);
  }

  return result;
}

/**
 * Main function
 */
async function main() {
  console.log('Analyzing CSS variables across components and themes...');

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
        // No CSS file found
      }
    }

    // Get default theme values for suggestion
    const defaultThemeValues =
      await extractCssDefinitionsWithValues(DEFAULT_THEME_PATH);

    // Find inheritance patterns in default theme
    const inheritancePatterns = findInheritancePatterns(defaultThemeValues);

    console.log(
      `Found ${allVariables.size} unique component-specific CSS variables across ${componentVariables.size} components`
    );
    console.log(
      `Default theme has ${defaultThemeValues.size} variable definitions`
    );
    console.log(
      `Identified ${inheritancePatterns.size} variables with inheritance patterns`
    );
    console.log(
      `(Base variables like colors, spacing, etc. are being ignored)`
    );

    // Now check all theme files
    const themeFiles = await fs.readdir(themesDir);
    const themeResults = [];

    for (const themeFile of themeFiles) {
      if (!themeFile.endsWith('-theme.css')) continue;

      const themePath = path.join(themesDir, themeFile);
      const themeName = themeFile.replace('-theme.css', '');

      // Skip detailed analysis for default theme since we're using it as reference
      if (themeName === 'default') {
        themeResults.push({
          themeName,
          themePath,
          missingVariables: new Map(),
        });
        continue;
      }

      // Extract existing variable definitions with values
      const themeDefinitions = await extractCssDefinitionsWithValues(themePath);

      // Find variables missing from this theme
      const missingVariables = new Map();

      for (const variable of allVariables) {
        if (!themeDefinitions.has(variable)) {
          // Auto-suggest value if enabled
          let suggestedValue = 'inherit';

          if (autoSuggest) {
            const suggestion = suggestValue(
              variable,
              defaultThemeValues,
              inheritancePatterns
            );
            if (suggestion) {
              suggestedValue = suggestion;
            }
          }

          missingVariables.set(variable, suggestedValue);
        }
      }

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
          `⚠️  ${themeName} theme is missing ${missingVariables.size} variables:`
        );

        // Group missing variables by component
        const missingByComponent = groupVariablesByComponent(
          missingVariables.keys(),
          componentVariables
        );

        // Display missing variables grouped by component
        for (const [components, vars] of missingByComponent.entries()) {
          console.log(`  From ${components}:`);
          for (const variable of vars) {
            const value = missingVariables.get(variable);
            console.log(`    --${variable}: ${value};`);
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
      console.log('Use the --auto-suggest flag to get value suggestions');
    } else {
      console.log('\n✅ Themes updated with missing variables');
      console.log(
        '⚠️  Remember to verify the suggested values in the updated theme files!'
      );
    }

    // Show inheritance analysis
    console.log('\n===== Variable Inheritance Patterns =====');
    if (inheritancePatterns.size === 0) {
      console.log('No inheritance patterns detected');
    } else {
      for (const [variable, dependencies] of inheritancePatterns.entries()) {
        console.log(
          `--${variable} depends on: ${Array.from(dependencies)
            .map((d) => `--${d}`)
            .join(', ')}`
        );
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
