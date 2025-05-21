// src/components/Image/Image.stories.js
import Image from './index.js';

export default {
  title: 'Components/Image',
  component: Image,
};

export const Default = () => {
  const image = Image({
    src: 'https://picsum.photos/300/200',
    alt: 'Random sample image',
  });

  return image.getElement();
};

export const WithFallback = () => {
  const image = Image({
    src: 'https://picsum.photos/broken-url', // This will intentionally fail
    fallbackSrc: 'https://picsum.photos/300/200?grayscale', // Fallback to grayscale image
    alt: 'Image with fallback',
  });

  return image.getElement();
};

export const Responsive = () => {
  const container = document.createElement('div');
  container.style.width = '100%';
  container.style.maxWidth = '600px';
  container.style.padding = '20px';
  container.style.border = '1px dashed #ccc';

  const image = Image({
    src: 'https://picsum.photos/600/400',
    responsive: true,
    alt: 'Responsive image',
  });

  container.appendChild(image.getElement());
  return container;
};

export const WithCustomSizes = () => {
  const container = document.createElement('div');
  container.style.width = '300px';
  container.style.height = '200px';
  container.style.padding = '20px';
  container.style.border = '1px dashed #ccc';

  const image = Image({
    src: 'https://picsum.photos/400/300',
    alt: 'Custom size image',
    className: 'custom-size',
  });

  container.appendChild(image.getElement());
  return container;
};

export const WithClickHandler = () => {
  const image = Image({
    src: 'https://picsum.photos/300/200?blur=2',
    alt: 'Clickable image',
    onClick: () => alert('Image clicked!'),
  });

  return image.getElement();
};
