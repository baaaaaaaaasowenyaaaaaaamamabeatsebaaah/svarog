// src/components/Image/index.js
import { createComponent } from '../../utils/componentFactory.js';
import createImage from './Image.js';

// Create component with factory function
const Image = createComponent('Image', createImage);

export default Image;
export { Image };
