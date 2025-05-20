// src/components/Logo/index.js
import { createComponent } from '../../utils/componentFactory.js';
import createLogo from './Logo.js';

// Create component with factory function
const Logo = createComponent('Logo', createLogo);

export default Logo;
export { Logo };
