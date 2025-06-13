// src/components/ProductCard/ProductCard.test.js
import { describe, it, expect, vi } from 'vitest';
import ProductCard from './ProductCard.js';

describe('ProductCard component', () => {
  const defaultProps = {
    imageUrl: 'https://example.com/phone.jpg',
    title: 'Test Phone',
    productData: {
      Storage: '64GB',
      Color: 'Black',
    },
    price: '299.99',
  };

  it('should create a product card element', () => {
    const productCard = ProductCard(defaultProps);
    const element = productCard.getElement();

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.classList.contains('product-card')).toBe(true);
  });

  it('should render the product image using Image component', () => {
    const productCard = ProductCard(defaultProps);
    const element = productCard.getElement();
    const imageContainer = element.querySelector('.product-card__image');

    expect(imageContainer).not.toBeNull();
    expect(imageContainer.classList.contains('image-container')).toBe(true);

    const imageElement = imageContainer.querySelector('.image-element');
    expect(imageElement).not.toBeNull();
    expect(imageElement.src).toContain(defaultProps.imageUrl);
    expect(imageElement.alt).toBe(defaultProps.title);
  });

  it('should pass fallback image URL to Image component', () => {
    const fallbackUrl = 'https://example.com/fallback.jpg';
    const productCard = ProductCard({
      ...defaultProps,
      fallbackImageUrl: fallbackUrl,
    });
    const element = productCard.getElement();
    const imageElement = element.querySelector('.image-element');

    // Simulate image load error to test fallback
    imageElement.onerror();

    expect(imageElement.src).toContain(fallbackUrl);
  });

  it('should render the product title', () => {
    const productCard = ProductCard(defaultProps);
    const element = productCard.getElement();

    expect(element.textContent).toContain(defaultProps.title);
  });

  it('should render all product specifications', () => {
    const productCard = ProductCard(defaultProps);
    const element = productCard.getElement();
    const specItems = element.querySelectorAll('.product-card__spec-item');

    expect(specItems.length).toBe(Object.keys(defaultProps.productData).length);

    // Check if specs are rendered correctly
    Object.entries(defaultProps.productData).forEach(([key, value]) => {
      const specText = element.textContent;
      expect(specText).toContain(key);
      expect(specText).toContain(value);
    });
  });

  it('should render the price using PriceDisplay component', () => {
    const productCard = ProductCard({
      ...defaultProps,
      currency: '$',
    });
    const element = productCard.getElement();
    const priceDisplay = element.querySelector('.product-card__price-display');

    expect(priceDisplay).not.toBeNull();
    expect(priceDisplay.classList.contains('price-display')).toBe(true);

    const priceValue = priceDisplay.querySelector('.price-display__value');
    expect(priceValue.textContent).toBe('$299.99');
  });

  it('should render price info when provided', () => {
    const priceInfo = 'inkl. MwSt.';
    const productCard = ProductCard({
      ...defaultProps,
      priceInfo,
    });
    const element = productCard.getElement();
    const priceInfoElement = element.querySelector('.product-card__price-info');

    expect(priceInfoElement).not.toBeNull();
    expect(priceInfoElement.textContent).toBe(priceInfo);
  });

  it('should not render price info when not provided', () => {
    const productCard = ProductCard(defaultProps);
    const element = productCard.getElement();
    const priceInfoElement = element.querySelector('.product-card__price-info');

    expect(priceInfoElement).toBeNull();
  });

  it('should update price info with setPriceInfo method', () => {
    const productCard = ProductCard({
      ...defaultProps,
      priceInfo: 'inkl. MwSt.',
    });
    const element = productCard.getElement();

    // Initial check
    let priceInfoElement = element.querySelector('.product-card__price-info');
    expect(priceInfoElement.textContent).toBe('inkl. MwSt.');

    // Update price info
    productCard.setPriceInfo('+ kostenloser Versand');

    // Check updated text
    priceInfoElement = element.querySelector('.product-card__price-info');
    expect(priceInfoElement.textContent).toBe('+ kostenloser Versand');
  });

  it('should remove price info when setPriceInfo is called with empty string', () => {
    const productCard = ProductCard({
      ...defaultProps,
      priceInfo: 'inkl. MwSt.',
    });
    const element = productCard.getElement();

    // Initial check
    let priceInfoElement = element.querySelector('.product-card__price-info');
    expect(priceInfoElement).not.toBeNull();

    // Remove price info
    productCard.setPriceInfo('');

    // Check it's removed
    priceInfoElement = element.querySelector('.product-card__price-info');
    expect(priceInfoElement).toBeNull();
  });

  it('should render price with loading state', () => {
    const productCard = ProductCard({
      ...defaultProps,
      loading: true,
    });
    const element = productCard.getElement();
    const priceDisplay = element.querySelector('.product-card__price-display');

    expect(priceDisplay.classList.contains('price-display--loading')).toBe(
      true
    );

    const loadingIndicator = priceDisplay.querySelector(
      '.price-display__loading-indicator'
    );
    expect(loadingIndicator).not.toBeNull();
  });

  it('should render price with highlighted state', () => {
    const productCard = ProductCard({
      ...defaultProps,
      priceHighlighted: true,
    });
    const element = productCard.getElement();
    const priceDisplay = element.querySelector('.product-card__price-display');

    expect(priceDisplay.classList.contains('price-display--highlighted')).toBe(
      true
    );
  });

  it('should disable button when loading', () => {
    const productCard = ProductCard({
      ...defaultProps,
      loading: true,
    });
    const element = productCard.getElement();
    const button = element.querySelector('button');

    expect(button.disabled).toBe(true);
  });

  it('should update price loading state with setPriceLoading', () => {
    const productCard = ProductCard(defaultProps);
    const element = productCard.getElement();
    const priceDisplay = element.querySelector('.product-card__price-display');

    // Initially not loading
    expect(priceDisplay.classList.contains('price-display--loading')).toBe(
      false
    );

    // Set loading
    productCard.setPriceLoading(true);
    expect(priceDisplay.classList.contains('price-display--loading')).toBe(
      true
    );

    // Unset loading
    productCard.setPriceLoading(false);
    expect(priceDisplay.classList.contains('price-display--loading')).toBe(
      false
    );
  });

  it('should update price value with setPrice', () => {
    const productCard = ProductCard({
      ...defaultProps,
      currency: '$',
    });
    const element = productCard.getElement();

    // Update price
    productCard.setPrice('399.99', true);

    const priceValue = element.querySelector('.price-display__value');
    expect(priceValue.textContent).toBe('$399.99');

    const priceDisplay = element.querySelector('.product-card__price-display');
    expect(priceDisplay.classList.contains('price-display--highlighted')).toBe(
      true
    );
  });

  it('should render the reserve button with custom text', () => {
    const buttonText = 'Buy Now';
    const productCard = ProductCard({
      ...defaultProps,
      buttonText,
    });
    const element = productCard.getElement();
    const button = element.querySelector('button');

    expect(button).not.toBeNull();
    expect(button.textContent).toBe(buttonText);
  });

  it('should call onClick callback when button is clicked', () => {
    const onClick = vi.fn();
    const productCard = ProductCard({
      ...defaultProps,
      onClick,
    });
    const element = productCard.getElement();
    const button = element.querySelector('button');

    button.click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should support legacy onReserve prop and migrate it to onClick', () => {
    const onReserve = vi.fn();
    // Mock console.warn to check for deprecation warning
    const consoleWarnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => {});

    const productCard = ProductCard({
      ...defaultProps,
      onReserve,
    });
    const element = productCard.getElement();
    const button = element.querySelector('button');

    button.click();
    expect(onReserve).toHaveBeenCalledTimes(1);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      '[ProductCard] onReserve is deprecated, use onClick instead'
    );

    consoleWarnSpy.mockRestore();
  });

  it('should apply additional class names', () => {
    const className = 'custom-class';
    const productCard = ProductCard({
      ...defaultProps,
      className,
    });
    const element = productCard.getElement();

    expect(element.classList.contains(className)).toBe(true);
  });

  it('should throw an error when required props are missing', () => {
    expect(() => {
      ProductCard({
        title: 'Test Phone',
        productData: { Storage: '64GB' },
        price: '299.99',
      });
    }).toThrow('ProductCard: imageUrl is required');

    expect(() => {
      ProductCard({
        imageUrl: 'https://example.com/phone.jpg',
        productData: { Storage: '64GB' },
        price: '299.99',
      });
    }).toThrow('ProductCard: title is required');

    expect(() => {
      ProductCard({
        imageUrl: 'https://example.com/phone.jpg',
        title: 'Test Phone',
        price: '299.99',
      });
    }).toThrow('ProductCard: productData is required');

    expect(() => {
      ProductCard({
        imageUrl: 'https://example.com/phone.jpg',
        title: 'Test Phone',
        productData: { Storage: '64GB' },
      });
    }).toThrow('ProductCard: price is required');
  });

  it('should update the component with new props including priceInfo', () => {
    const productCard = ProductCard(defaultProps);

    // Initial state check
    const element = productCard.getElement();
    expect(element.textContent).toContain('Test Phone');

    // Mock parent to test replacing the element
    const parent = document.createElement('div');
    parent.appendChild(element);

    // Update with new props
    const updatedProps = {
      title: 'Updated Phone',
      price: '399.99',
      priceInfo: 'inkl. Steuer',
    };

    const updatedCard = productCard.update(updatedProps);
    const updatedElement = updatedCard.getElement();

    // Check the updated component
    expect(updatedElement.textContent).toContain('Updated Phone');
    expect(updatedElement.textContent).toContain('399.99');
    expect(updatedElement.textContent).toContain('inkl. Steuer');
  });

  it('should clean up resources when destroyed', () => {
    const productCard = ProductCard(defaultProps);
    const cardDestroySpy = vi.spyOn(productCard, 'destroy');

    productCard.destroy();

    expect(cardDestroySpy).toHaveBeenCalledTimes(1);
  });
});
