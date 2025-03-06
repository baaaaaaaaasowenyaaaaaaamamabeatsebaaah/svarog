// scripts/validateThemes.js

import fs from 'fs/promises';
import path from 'path';
import css from 'css';
import { fileURLToPath } from 'url';
import { themeManager } from '../src/utils/theme.js';
import { ThemeValidator } from '../src/utils/themeValidator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mock window and document
globalThis.window = {
  CustomEvent: class CustomEvent {
    constructor(event, params) {
      this.event = event;
      this.detail = params.detail;
    }
  },
  dispatchEvent: () => {},
};

globalThis.document = {
  documentElement: {},
  body: {
    classList: {
      add: () => {},
      remove: () => {},
    },
  },
  addEventListener: () => {},
};

/**
 * Ensures that a directory exists, creating it if necessary
 * @param {string} dirPath - Path to the directory
 * @returns {Promise<void>}
 */
async function ensureDirectoryExists(dirPath) {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

/**
 * Extracts CSS variables from parsed CSS
 * @param {css.Stylesheet} parsedCSS - Parsed CSS object
 * @param {string} themeName - Name of the theme
 * @returns {Map<string, string>} Map of CSS variables and their values
 */
function extractCSSVariables(parsedCSS, themeName) {
  const variables = new Map();

  if (!parsedCSS?.stylesheet?.rules) {
    return variables;
  }

  parsedCSS.stylesheet.rules.forEach((rule) => {
    if (
      rule.type === 'rule' &&
      rule.selectors?.includes(`.${themeName}-theme`)
    ) {
      rule.declarations?.forEach((declaration) => {
        if (
          declaration.type === 'declaration' &&
          declaration.property?.startsWith('--')
        ) {
          variables.set(declaration.property, declaration.value);
        }
      });
    }
  });

  return variables;
}

/**
 * Processes a theme file and returns its parsed CSS variables
 * @param {string} themeName - Name of the theme
 * @returns {Promise<Map<string, string>>} Map of CSS variables
 */
async function processThemeFile(themeName) {
  const themePath = path.resolve(
    __dirname,
    `../src/styles/themes/${themeName}-theme.css`
  );

  try {
    const cssContent = await fs.readFile(themePath, 'utf8');
    const parsedCSS = css.parse(cssContent);
    return extractCSSVariables(parsedCSS, themeName);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`Theme file not found: ${themePath}`);
      console.error('Creating theme directory and template file...');

      await ensureDirectoryExists(path.dirname(themePath));

      const templateContent = `.${themeName}-theme {\n  /* Theme variables will go here */\n}\n`;
      await fs.writeFile(themePath, templateContent);

      return new Map();
    }

    console.error(`Error processing theme file ${themePath}:`, error.message);
    return new Map();
  }
}

// Modify the ThemeValidator to use our CSS parser
const originalValidateTheme = ThemeValidator.prototype.validateTheme;
ThemeValidator.prototype.validateTheme = async function (themeName) {
  const variables = await processThemeFile(themeName);

  // Override getComputedStyle for this validation
  globalThis.window.getComputedStyle = () => ({
    getPropertyValue: (cssVar) => variables.get(cssVar) || '',
  });

  return originalValidateTheme.call(this, themeName);
};

/**
 * Main theme validation function
 * @returns {Promise<void>}
 */
async function validateThemes() {
  console.log('Starting theme validation...');

  // Ensure theme directory exists
  const themesDir = path.resolve(__dirname, '../src/styles/themes');
  await ensureDirectoryExists(themesDir);

  const validator = new ThemeValidator(themeManager);

  try {
    const results = await validator.validateAllThemes();
    console.log(results.summary);

    if (results.validThemes !== results.totalThemes) {
      process.exit(1);
    }
  } catch (error) {
    console.error('Theme validation failed:', error.message);
    process.exit(1);
  }
}

// Run validation with proper error handling
validateThemes().catch((error) => {
  console.error('Unexpected error during theme validation:', error.message);
  process.exit(1);
});
