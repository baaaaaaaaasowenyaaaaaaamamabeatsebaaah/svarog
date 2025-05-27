// Development placeholder for default theme
// The actual theme is in the dist directory

const defaultTheme = {
  name: 'default',
  apply() {
    console.warn(
      'Using development placeholder for default theme. Run build-theme script to generate the actual theme.'
    );
  },
  remove() {
    // Development placeholder
  },
  getStyles() {
    return '';
  },
};

export default defaultTheme;
export { defaultTheme };
