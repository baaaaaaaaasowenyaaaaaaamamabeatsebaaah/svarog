/**
 * This script reads the 'styles' directory, filters for CSS theme files,
 * and extracts the theme names. It then outputs these names as a JSON array.
 */

const fs = require('fs');
const path = require('path');

// Define the path to the styles directory
const themesDir = path.resolve(__dirname, '../styles');

// Read the contents of the styles directory
fs.readdir(themesDir, (err, files) => {
  if (err) {
    console.error('Error reading the themes directory:', err);
    process.exit(1);
  }

  // Filter for files ending with '-theme.css' and extract theme names
  const themeNames = files
    .filter((file) => file.endsWith('-theme.css'))
    .map((file) => file.replace('-theme.css', ''));

  // Output the theme names as a JSON string
  console.log(JSON.stringify(themeNames));
});
