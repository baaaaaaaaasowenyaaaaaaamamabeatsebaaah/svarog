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
    const productCard = new ProductCard(defaultProps);
    const element = productCard.getElement();

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.classList.contains('product-card')).toBe(true);
  });

  it('should render the product image', () => {
    const productCard = new ProductCard(defaultProps);
    const element = productCard.getElement();
    const imageElement = element.querySelector('img');

    expect(imageElement).not.toBeNull();
    expect(imageElement.src).toContain(defaultProps.imageUrl);
  });

  it('should render the product title', () => {
    const productCard = new ProductCard(defaultProps);
    const element = productCard.getElement();

    expect(element.textContent).toContain(defaultProps.title);
  });

  it('should render all product specifications', () => {
    const productCard = new ProductCard(defaultProps);
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

  it('should render the price with correct currency', () => {
    const productCard = new ProductCard({
      ...defaultProps,
      currency: '$',
    });
    const element = productCard.getElement();
    const priceElement = element.querySelector('.product-card__price');

    expect(priceElement).not.toBeNull();
    expect(priceElement.textContent).toBe('$299.99');
  });

  it('should render the reserve button with custom text', () => {
    const buttonText = 'Buy Now';
    const productCard = new ProductCard({
      ...defaultProps,
      buttonText,
    });
    const element = productCard.getElement();
    const button = element.querySelector('button');

    expect(button).not.toBeNull();
    expect(button.textContent).toBe(buttonText);
  });

  it('should call onReserve callback when button is clicked', () => {
    const onReserve = vi.fn();
    const productCard = new ProductCard({
      ...defaultProps,
      onReserve,
    });
    const element = productCard.getElement();
    const button = element.querySelector('button');

    button.click();
    expect(onReserve).toHaveBeenCalledTimes(1);
  });

  it('should apply additional class names', () => {
    const className = 'custom-class';
    const productCard = new ProductCard({
      ...defaultProps,
      className,
    });
    const element = productCard.getElement();

    expect(element.classList.contains(className)).toBe(true);
  });

  it('should throw an error when required props are missing', () => {
    expect(() => {
      new ProductCard({
        title: 'Test Phone',
        productData: { Storage: '64GB' },
        price: '299.99',
      });
    }).toThrow('ProductCard: imageUrl is required');

    expect(() => {
      new ProductCard({
        imageUrl: 'https://example.com/phone.jpg',
        productData: { Storage: '64GB' },
        price: '299.99',
      });
    }).toThrow('ProductCard: title is required');

    expect(() => {
      new ProductCard({
        imageUrl: 'https://example.com/phone.jpg',
        title: 'Test Phone',
        price: '299.99',
      });
    }).toThrow('ProductCard: productData is required');

    expect(() => {
      new ProductCard({
        imageUrl: 'https://example.com/phone.jpg',
        title: 'Test Phone',
        productData: { Storage: '64GB' },
      });
    }).toThrow('ProductCard: price is required');
  });
});
