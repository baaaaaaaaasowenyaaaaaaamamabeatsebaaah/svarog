// dist-entry.js
// This file is used as entry point for the UMD build
import Svarog from './src/index.js';

if (typeof window !== 'undefined') {
  window.SvarogUI = Svarog;
}

export default Svarog;
