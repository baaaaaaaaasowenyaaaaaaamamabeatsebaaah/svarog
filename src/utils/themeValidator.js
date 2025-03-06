/**
 * Required theme variables by component
 */
const REQUIRED_VARIABLES = {
  // Button Component Variables
  button: [
    '--button-bg',
    '--button-color',
    '--button-border',
    '--button-radius',
    '--button-hover-bg',
    '--button-active-bg',
    '--button-disabled-bg',
    '--button-padding',
    '--button-font-size',
    '--button-font-family',
    '--button-font-weight',
    '--button-transition',
  ],

  // Link Component Variables
  link: [
    '--link-color',
    '--link-hover-color',
    '--link-active-color',
    '--link-margin-left',
    '--link-margin-right',
    '--link-font-family',
    '--link-transition',
  ],

  // Navigation Component Variables
  navigation: [
    '--nav-bg',
    '--nav-border-bottom',
    '--nav-link-color',
    '--nav-link-hover-color',
    '--nav-link-active-color',
    '--nav-dropdown-bg',
    '--nav-padding',
    '--nav-margin-right',
    '--nav-burger-font-size',
    '--nav-burger-margin-bottom',
    '--nav-padding-mobile',
    '--nav-link-font-size',
  ],

  // Section Component Variables
  section: [
    '--section-bg',
    '--section-color',
    '--section-padding',
    '--section-gap',
    '--section-content-max-width',
    '--section-padding-tablet',
    '--section-gap-tablet',
    '--section-padding-mobile',
  ],

  // Typography Component Variables
  typography: [
    '--typography-color',
    '--typography-muted-color',
    '--typography-margin-bottom',
    '--typography-h1-size',
    '--typography-h2-size',
    '--typography-h3-size',
    '--typography-h4-size',
    '--typography-h5-size',
    '--typography-h6-size',
    '--typography-body-size',
    '--typography-small-size',
  ],

  // Logo Component Variables
  logo: ['--logo-width', '--logo-height'],
};

/**
 * Theme validator class to check theme completeness and validity
 */
export class ThemeValidator {
  constructor(themeManager) {
    this.themeManager = themeManager;
  }

  /**
   * Validate a specific theme
   * @param {string} themeName - Name of the theme to validate
   * @returns {Object} Validation results
   */
  validateTheme(themeName) {
    // Switch to the theme we want to validate
    this.themeManager.switchTheme(themeName);

    const results = {
      themeName,
      missingVariables: [],
      invalidValues: [],
      componentsChecked: Object.keys(REQUIRED_VARIABLES).length,
      totalVariablesChecked: 0,
      valid: true,
    };

    // Check each component's required variables
    Object.entries(REQUIRED_VARIABLES).forEach(([component, variables]) => {
      variables.forEach((variable) => {
        results.totalVariablesChecked++;
        const value = this.themeManager.getThemeValue(variable);

        if (!value) {
          results.missingVariables.push({
            component,
            variable,
          });
          results.valid = false;
        } else if (
          value === 'none' ||
          value === 'initial' ||
          value === 'inherit'
        ) {
          // These values might be intentional, but we'll flag them for review
          results.invalidValues.push({
            component,
            variable,
            value,
          });
        }
      });
    });

    return results;
  }

  /**
   * Validate all available themes
   * @returns {Object} Validation results for all themes
   */
  async validateAllThemes() {
    const themes = this.themeManager.getThemeNames();
    const results = {
      themes: {},
      totalThemes: themes.length,
      validThemes: 0,
      summary: '',
    };

    for (const theme of themes) {
      const themeResults = await this.validateTheme(theme);
      results.themes[theme] = themeResults;
      if (themeResults.valid) {
        results.validThemes++;
      }
    }

    results.summary = this.createSummary(results);
    return results;
  }

  /**
   * Create a readable summary of validation results
   * @param {Object} results - Validation results
   * @returns {string} Summary text
   */
  createSummary(results) {
    const { totalThemes, validThemes, themes } = results;
    let summary = `Theme Validation Summary:\n`;
    summary += `${validThemes} of ${totalThemes} themes are valid\n\n`;

    Object.entries(themes).forEach(([themeName, themeResults]) => {
      summary += `Theme: ${themeName}\n`;
      summary += `Status: ${themeResults.valid ? 'Valid ✓' : 'Invalid ⚠'}\n`;
      summary += `Variables Checked: ${themeResults.totalVariablesChecked}\n`;

      if (themeResults.missingVariables.length > 0) {
        summary += `Missing Variables:\n`;
        themeResults.missingVariables.forEach(({ component, variable }) => {
          summary += `  - ${component}: ${variable}\n`;
        });
      }

      if (themeResults.invalidValues.length > 0) {
        summary += `Suspicious Values (Review Recommended):\n`;
        themeResults.invalidValues.forEach(({ component, variable, value }) => {
          summary += `  - ${component}: ${variable} = ${value}\n`;
        });
      }

      summary += '\n';
    });

    return summary;
  }

  /**
   * Check if a specific component's theme variables are complete
   * @param {string} componentName - Name of the component to check
   * @param {string} themeName - Optional theme name, defaults to current theme
   * @returns {Object} Component validation results
   */
  validateComponent(componentName, themeName = null) {
    if (!REQUIRED_VARIABLES[componentName]) {
      throw new Error(`Unknown component: ${componentName}`);
    }

    if (themeName) {
      this.themeManager.switchTheme(themeName);
    }

    const results = {
      component: componentName,
      theme: themeName || this.themeManager.getCurrentTheme(),
      missingVariables: [],
      invalidValues: [],
      valid: true,
    };

    REQUIRED_VARIABLES[componentName].forEach((variable) => {
      const value = this.themeManager.getThemeValue(variable);

      if (!value) {
        results.missingVariables.push(variable);
        results.valid = false;
      } else if (
        value === 'none' ||
        value === 'initial' ||
        value === 'inherit'
      ) {
        results.invalidValues.push({
          variable,
          value,
        });
      }
    });

    return results;
  }
}
