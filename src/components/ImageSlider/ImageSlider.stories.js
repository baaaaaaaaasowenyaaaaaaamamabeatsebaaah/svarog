// src/components/ImageSlider/ImageSlider.stories.js
import ImageSlider from './ImageSlider.js';

export default {
  title: 'Components/ImageSlider',
  component: ImageSlider,
};

// Sample images
const productImages = [
  {
    imageUrl: 'https://picsum.photos/1200/800?random=1',
    thumbnailUrl: 'https://picsum.photos/100/100?random=1',
    alt: 'Product front view',
  },
  {
    imageUrl: 'https://picsum.photos/1200/800?random=2',
    thumbnailUrl: 'https://picsum.photos/100/100?random=2',
    alt: 'Product front view',
  },
  {
    imageUrl: 'https://picsum.photos/1200/800?random=3',
    thumbnailUrl: 'https://picsum.photos/100/100?random=3',
    alt: 'Product front view',
  },
  {
    imageUrl: 'https://picsum.photos/1200/800?random=4',
    thumbnailUrl: 'https://picsum.photos/100/100?random=4',
    alt: 'Product front view',
  },
];

export const Default = () => {
  const slider = ImageSlider({
    images: productImages,
  });

  return slider.getElement();
};

export const WithThumbnails = () => {
  const slider = ImageSlider({
    images: productImages,
    showThumbnails: true,
  });

  return slider.getElement();
};

export const ProductDetail = () => {
  const container = document.createElement('div');
  container.style.maxWidth = '800px';
  container.style.margin = '0 auto';
  container.innerHTML = `
    <h2 style="margin-bottom: 20px;">Product Gallery</h2>
  `;

  const slider = ImageSlider({
    images: productImages,
    showThumbnails: true,
    showDots: false,
  });

  container.appendChild(slider.getElement());
  return container;
};

export const MinimalArrows = () => {
  const slider = ImageSlider({
    images: productImages,
    showDots: false,
  });

  return slider.getElement();
};

export const DotsOnly = () => {
  const slider = ImageSlider({
    images: productImages,
    showArrows: false,
  });

  return slider.getElement();
};

export const NoLoop = () => {
  const slider = ImageSlider({
    images: productImages,
    loop: false,
  });

  return slider.getElement();
};

export const SingleImage = () => {
  const slider = ImageSlider({
    images: [productImages[0]],
  });

  return slider.getElement();
};

export const WithCustomStyling = () => {
  const container = document.createElement('div');

  // Add custom styles
  const style = document.createElement('style');
  style.textContent = `
    .custom-slider {
      --image-slider-height: 500px;
      --image-slider-arrow-bg: rgba(255, 255, 255, 0.9);
      --image-slider-arrow-color: #333;
      --image-slider-dot-active-bg: #ff6b6b;
      --image-slider-radius: 16px;
    }
  `;
  container.appendChild(style);

  const slider = ImageSlider({
    images: productImages,
    className: 'custom-slider',
  });

  container.appendChild(slider.getElement());
  return container;
};

export const WithChangeCallback = () => {
  const container = document.createElement('div');

  const info = document.createElement('div');
  info.style.textAlign = 'center';
  info.style.marginBottom = '20px';
  info.innerHTML = '<p>Current image: <strong>1 of 4</strong></p>';

  const slider = ImageSlider({
    images: productImages,
    onChange: (current, previous) => {
      info.innerHTML = `<p>Current image: <strong>${current + 1} of ${productImages.length}</strong> (was ${previous + 1})</p>`;
    },
  });

  container.appendChild(info);
  container.appendChild(slider.getElement());
  return container;
};

export const MobileOptimized = () => {
  const container = document.createElement('div');
  container.style.maxWidth = '375px';
  container.style.margin = '0 auto';
  container.style.border = '1px solid #ddd';
  container.style.borderRadius = '20px';
  container.style.padding = '10px';
  container.style.background = '#f5f5f5';
  container.innerHTML = `
    <p style="text-align: center; margin-bottom: 10px;">Mobile View (375px)</p>
  `;

  const slider = ImageSlider({
    images: productImages,
    showThumbnails: true,
  });

  container.appendChild(slider.getElement());
  return container;
};

export const Gallery = () => {
  const container = document.createElement('div');

  const style = document.createElement('style');
  style.textContent = `
    .gallery-slider {
      --image-slider-height: 600px;
      --image-slider-bg: #000;
      --image-slider-arrow-bg: rgba(255, 255, 255, 0.2);
      --image-slider-dot-bg: rgba(255, 255, 255, 0.3);
      --image-slider-dot-active-bg: white;
    }
  `;
  container.appendChild(style);

  const slider = ImageSlider({
    images: productImages.map((img, _index) => ({
      ...img,
      imageUrl: `https://picsum.photos/1200/800`,
    })),
    className: 'gallery-slider',
    showThumbnails: false,
  });

  container.appendChild(slider.getElement());
  return container;
};
