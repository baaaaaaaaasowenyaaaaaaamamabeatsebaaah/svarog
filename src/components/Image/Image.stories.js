// src/components/Image/Image.stories.js
import Image from './Image.js';

export default {
  title: 'Components/Image',
  component: Image,
};

export const Default = () => {
  const image = Image({
    // Add default props here
  });
  
  return image.getElement();
};

// Add more story examples below
