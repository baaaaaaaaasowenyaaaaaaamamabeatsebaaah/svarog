// src/components/MuchandyHero/index.js
import MuchandyHero from './MuchandyHero.js';
import createMuchandyHeroContainer from './MuchandyHeroContainer.js';

// Export the container factory
export const MuchandyHeroContainer = createMuchandyHeroContainer;

// Export the hero component
export { MuchandyHero };

// Default export is the hero component
export default MuchandyHero;
