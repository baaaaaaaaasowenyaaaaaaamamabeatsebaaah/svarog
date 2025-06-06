// src/components/ProductCard/ProductCard.stories.js
import ProductCard from './ProductCard.js';

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

// Create a wrapper for better showcasing
const createWrapper = (child) => {
  const wrapper = document.createElement('div');
  wrapper.style.width = '300px';
  wrapper.style.margin = '1rem';
  wrapper.appendChild(child);
  return wrapper;
};

export default {
  title: 'Components/ProductCard',
  component: ProductCard,
};

export const DefaultProductCard = () => {
  const card = ProductCard({
    imageUrl: getPhoneImage('iPhone 11 Pro'),
    title: 'iPhone 11 Pro',
    productData: {
      Storage: '64GB',
      Color: 'Space Gray',
      Condition: 'Very Good',
      'Battery Health': '95%',
    },
    price: '399.99',
    onClick: () => alert('Product reserved!'),
  });

  return createWrapper(card.getElement());
};

export const WithCustomCurrency = () => {
  const card = ProductCard({
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
    onClick: () => alert('Product purchased!'),
  });

  return createWrapper(card.getElement());
};

export const WithLoadingPrice = () => {
  const card = ProductCard({
    imageUrl: getPhoneImage('Google Pixel 6'),
    title: 'Google Pixel 6',
    productData: {
      Storage: '128GB',
      Color: 'Stormy Black',
      Condition: 'Good',
      'Battery Health': '89%',
    },
    price: 'Calculating...',
    loading: true,
    buttonText: 'Reserve',
    onClick: () => alert('Cannot reserve while price is loading!'),
  });

  return createWrapper(card.getElement());
};

export const WithHighlightedPrice = () => {
  const card = ProductCard({
    imageUrl: getPhoneImage('iPhone 12 Mini'),
    title: 'iPhone 12 Mini - SALE',
    productData: {
      Storage: '128GB',
      Color: 'Product RED',
      Condition: 'Like New',
      'Battery Health': '99%',
      Special: 'Limited Time Offer',
    },
    price: '449.99',
    priceHighlighted: true,
    buttonText: 'Buy Now',
    onClick: () => alert('Sale item purchased!'),
  });

  return createWrapper(card.getElement());
};

export const DynamicPriceLoading = () => {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '20px';

  const card = ProductCard({
    imageUrl: getPhoneImage('iPhone 13'),
    title: 'iPhone 13',
    productData: {
      Storage: '256GB',
      Color: 'Midnight',
      Condition: 'Excellent',
      'Battery Health': '99%',
    },
    price: 'Loading price...',
    loading: true,
    onClick: () => alert('Product reserved!'),
  });

  const wrapper = createWrapper(card.getElement());
  container.appendChild(wrapper);

  // Add control buttons
  const controls = document.createElement('div');
  controls.style.display = 'flex';
  controls.style.gap = '10px';
  controls.style.paddingLeft = '1rem';

  const loadPriceButton = document.createElement('button');
  loadPriceButton.textContent = 'Load Price';
  loadPriceButton.onclick = () => {
    card.setPriceLoading(true);
    setTimeout(() => {
      card.setPriceLoading(false);
      card.setPrice('599.99', false);
    }, 1500);
  };

  const showSalePriceButton = document.createElement('button');
  showSalePriceButton.textContent = 'Show Sale Price';
  showSalePriceButton.onclick = () => {
    card.setPriceLoading(true);
    setTimeout(() => {
      card.setPriceLoading(false);
      card.setPrice('499.99', true); // Highlighted sale price
    }, 1000);
  };

  controls.appendChild(loadPriceButton);
  controls.appendChild(showSalePriceButton);
  container.appendChild(controls);

  return container;
};

export const WithMultipleSpecs = () => {
  const card = ProductCard({
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
    onClick: () => alert('Product reserved!'),
  });

  return createWrapper(card.getElement());
};

// Show backward compatibility with onReserve
export const WithLegacyOnReserve = () => {
  const card = ProductCard({
    imageUrl: getPhoneImage('iPhone 13'),
    title: 'iPhone 13 - Legacy Props',
    productData: {
      Storage: '256GB',
      Color: 'Midnight',
      Condition: 'Excellent',
      'Battery Health': '99%',
    },
    price: '599.99',
    onReserve: () => alert('Using deprecated onReserve prop!'),
  });

  return createWrapper(card.getElement());
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
      priceHighlighted: true,
    },
    {
      model: 'Samsung Galaxy S21',
      storage: '256GB',
      color: 'Phantom Gray',
      condition: 'Very Good',
      batteryHealth: '92%',
      price: '499.99',
      loading: true,
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
    const card = ProductCard({
      imageUrl: getPhoneImage(product.model),
      title: product.model,
      productData: {
        Storage: product.storage,
        Color: product.color,
        Condition: product.condition,
        'Battery Health': product.batteryHealth,
      },
      price: product.loading ? 'Loading...' : product.price,
      loading: product.loading || false,
      priceHighlighted: product.priceHighlighted || false,
      onClick: () => alert(`${product.model} reserved!`),
    });

    const cardContainer = document.createElement('div');
    cardContainer.appendChild(card.getElement());
    container.appendChild(cardContainer);
  });

  return container;
};
