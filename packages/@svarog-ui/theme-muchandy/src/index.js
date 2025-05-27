// Development placeholder for muchandy theme
// The actual theme is in the dist directory

const muchandyTheme = {
  name: 'muchandy',
  apply() {
    console.warn('Using development placeholder for muchandy theme. Run build-theme script to generate the actual theme.');
  },
  remove() {
    // Development placeholder
  },
  getStyles() {
    return '';
  }
};

export default muchandyTheme;
export { muchandyTheme };
