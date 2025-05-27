// Theme package for default
// This file is used during development. The dist files are auto-generated.

import { injectStyles, css } from 'svarog-ui-core/utils/styleInjection';

const defaultTheme = {
  name: 'default',
  
  apply() {
    console.log('Apply default theme - development version');
    // In development, you can import the actual CSS or define styles here
  },
  
  remove() {
    console.log('Remove default theme - development version');
  },
  
  getStyles() {
    return '';
  }
};

export default defaultTheme;
export { defaultTheme };
