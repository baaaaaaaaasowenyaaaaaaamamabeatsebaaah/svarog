// src/components/ProductCard/ProductCard.stories.js
import ProductCard from './ProductCard.js';
import { Component } from '../../utils/componentFactory.js';

// Direct import of images - webpack 5 handles this with Asset Modules
import placeholderImage1 from '../../../.storybook/assets/iphone-placeholder/placeholder-iphone-1.png';
import placeholderImage2 from '../../../.storybook/assets/iphone-placeholder/placeholder-iphone-2.png';
import placeholderImage3 from '../../../.storybook/assets/iphone-placeholder/placeholder-iphone-3.png';

// Helper function to get proper phone images
const getPhoneImage = (model) => {
  // Map specific models to specific images for consistency
  const modelImageMap = {
    'iPhone 11 Pro': placeholderImage1,
    'iPhone 12 Mini': placeholderImage2,
    'iPhone 13': placeholderImage3,
    'Samsung Galaxy S20': placeholderImage1,
    'Samsung Galaxy S21': placeholderImage2,
    'Google Pixel 6': placeholderImage3,
    'Google Pixel 7': placeholderImage1,
  };

  // Return the mapped image or the first placeholder as default
  return modelImageMap[model] || placeholderImage1;
};

// Create a wrapper component for better showcasing
class StoryWrapper extends Component {
  constructor({ children }) {
    super();
    this.element = this.createElement('div', {
      style: 'width: 300px; margin: 1rem;',
      children: children,
    });
  }

  getElement() {
    return this.element;
  }
}

export default {
  title: 'Components/ProductCard',
  component: ProductCard,
};

export const DefaultProductCard = () => {
  const card = new ProductCard({
    imageUrl: getPhoneImage('iPhone 11 Pro'),
    title: 'iPhone 11 Pro',
    productData: {
      Storage: '64GB',
      Color: 'Space Gray',
      Condition: 'Very Good',
      'Battery Health': '95%',
    },
    price: '399.99',
    onReserve: () => alert('Product reserved!'),
  });

  const wrapper = new StoryWrapper({
    children: card.getElement(),
  });

  return wrapper.getElement();
};

export const WithCustomCurrency = () => {
  const card = new ProductCard({
    imageUrl: getPhoneImage('Samsung Galaxy S20'),
    title: 'Samsung Galaxy S20',
    productData: {
      Storage: '128GB',
      Color: 'Cloud Blue',
      Condition: 'Excellent',
      'Battery Health': '97%',
    },
    price: '459.99',
    currency: '$',
    buttonText: 'Buy Now',
    onReserve: () => alert('Product purchased!'),
  });

  const wrapper = new StoryWrapper({
    children: card.getElement(),
  });

  return wrapper.getElement();
};

export const MuchandyThemed = () => {
  const card = new ProductCard({
    imageUrl: getPhoneImage('Google Pixel 6'),
    title: 'Google Pixel 6',
    productData: {
      Storage: '128GB',
      Color: 'Stormy Black',
      Condition: 'Good',
      'Battery Health': '89%',
      Warranty: '6 months',
    },
    price: '349.99',
    className: 'muchandy-theme',
    buttonText: 'Reserve Now',
    onReserve: () => alert('Muchandy product reserved!'),
  });

  const wrapper = new StoryWrapper({
    children: card.getElement(),
  });

  return wrapper.getElement();
};

export const WithMultipleSpecs = () => {
  const card = new ProductCard({
    imageUrl: getPhoneImage('iPhone 12 Mini'),
    title: 'iPhone 12 Mini',
    productData: {
      Storage: '128GB',
      Color: 'Product RED',
      Condition: 'Like New',
      'Battery Health': '99%',
      Warranty: '12 months',
      Accessories: 'Charger included',
      Special: 'Limited Edition',
    },
    price: '499.99',
    onReserve: () => alert('Product reserved!'),
  });

  const wrapper = new StoryWrapper({
    children: card.getElement(),
  });

  return wrapper.getElement();
};

// Simple product grid without Grid component dependency
export const ProductGrid = () => {
  // Create a container for the grid
  const container = document.createElement('div');
  container.className = 'product-grid';

  // Define product data
  const products = [
    {
      model: 'iPhone 13',
      storage: '128GB',
      color: 'Midnight',
      condition: 'Excellent',
      batteryHealth: '98%',
      price: '599.99',
    },
    {
      model: 'Samsung Galaxy S21',
      storage: '256GB',
      color: 'Phantom Gray',
      condition: 'Very Good',
      batteryHealth: '92%',
      price: '499.99',
    },
    {
      model: 'Google Pixel 7',
      storage: '128GB',
      color: 'Snow',
      condition: 'Good',
      batteryHealth: '90%',
      price: '449.99',
    },
  ];

  // Add products to the grid
  products.forEach((product) => {
    const card = new ProductCard({
      imageUrl: getPhoneImage(product.model),
      title: product.model,
      productData: {
        Storage: product.storage,
        Color: product.color,
        Condition: product.condition,
        'Battery Health': product.batteryHealth,
      },
      price: product.price,
      onReserve: () => alert(`${product.model} reserved!`),
    });

    const cardContainer = document.createElement('div');
    cardContainer.appendChild(card.getElement());
    container.appendChild(cardContainer);
  });

  return container;
};
