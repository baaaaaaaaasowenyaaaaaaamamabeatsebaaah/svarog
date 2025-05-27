// Development placeholder for cabalou theme
// The actual theme is in the dist directory

const cabalouTheme = {
  name: 'cabalou',
  apply() {
    console.warn('Using development placeholder for cabalou theme. Run build-theme script to generate the actual theme.');
  },
  remove() {
    // Development placeholder
  },
  getStyles() {
    return '';
  }
};

export default cabalouTheme;
export { cabalouTheme };
