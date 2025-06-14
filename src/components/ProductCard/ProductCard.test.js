// src/components/ProductCard/ProductCard.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock all external dependencies - these are hoisted to the top
vi.mock('../../utils/styleInjection.js', () => ({
  createStyleInjector: vi.fn(() => vi.fn()),
  css: vi.fn((strings) => strings.join('')),
}));

vi.mock('../../utils/componentFactory.js', () => ({
  createElement: vi.fn(() => ({
    appendChild: vi.fn(),
    insertBefore: vi.fn(),
    querySelector: vi.fn(),
    remove: vi.fn(),
  })),
  validateProps: vi.fn((props, required, componentName) => {
    required.forEach((prop) => {
      if (!(prop in props)) {
        throw new Error(`${componentName}: ${prop} is required`);
      }
    });
  }),
  createComponent: vi.fn((name, factory) => factory),
}));

vi.mock('../../utils/composition.js', () => ({
  withThemeAwareness: vi.fn((component) => component),
}));

// Mock component dependencies
vi.mock('../Card/Card.js', () => ({
  default: vi.fn(() => ({
    getElement: () => ({
      querySelector: vi.fn((selector) => {
        if (selector === '.product-card__actions') {
          return {
            querySelector: vi.fn(() => null), // Default: no price info element
            insertBefore: vi.fn(),
          };
        }
        return null;
      }),
      insertBefore: vi.fn(),
      classList: { contains: vi.fn() },
      textContent: 'Test Card',
    }),
    destroy: vi.fn(),
  })),
}));

vi.mock('../Button/Button.js', () => ({
  default: vi.fn(() => ({
    getElement: () => ({
      disabled: false,
      textContent: 'Reserve',
      click: vi.fn(),
    }),
  })),
}));

vi.mock('../Typography/Typography.js', () => ({
  default: vi.fn(() => ({
    getElement: () => ({
      textContent: '',
      remove: vi.fn(),
      classList: { contains: vi.fn() },
    }),
  })),
}));

vi.mock('../Image/Image.js', () => ({
  default: vi.fn(() => ({
    getElement: () => ({
      src: '',
      alt: '',
      onerror: null,
      classList: { contains: vi.fn() },
    }),
  })),
}));

vi.mock('../PriceDisplay/PriceDisplay.js', () => ({
  default: vi.fn(() => ({
    getElement: () => ({
      classList: { contains: vi.fn(() => false) },
      querySelector: vi.fn(() => ({ textContent: '' })),
    }),
    setLoading: vi.fn(),
    setValue: vi.fn(),
    destroy: vi.fn(), // Add destroy method
  })),
}));

// Import the component and mocked dependencies after mocks are set up
import ProductCard from './ProductCard.js';
import Card from '../Card/Card.js';
import Button from '../Button/Button.js';
import Typography from '../Typography/Typography.js';
import Image from '../Image/Image.js';
import PriceDisplay from '../PriceDisplay/PriceDisplay.js';

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

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset specific mocks
    Card.mockClear();
    Button.mockClear();
    Typography.mockClear();
    Image.mockClear();
    PriceDisplay.mockClear();
  });

  it('should create a product card element', () => {
    const productCard = ProductCard(defaultProps);
    const element = productCard.getElement();

    expect(element).toBeDefined();
    expect(typeof productCard.getElement).toBe('function');
    expect(typeof productCard.update).toBe('function');
    expect(typeof productCard.destroy).toBe('function');
    expect(typeof productCard.getState).toBe('function');
  });

  it('should render with Image component', () => {
    const productCard = ProductCard(defaultProps);
    productCard.getElement();

    expect(Image).toHaveBeenCalledWith({
      imageUrl: defaultProps.imageUrl,
      alt: defaultProps.title,
      fallbackImageUrl: undefined,
      className: 'product-card__image',
      responsive: true,
    });
  });

  it('should render with fallback image URL', () => {
    const fallbackUrl = 'https://example.com/fallback.jpg';
    const productCard = ProductCard({
      ...defaultProps,
      fallbackImageUrl: fallbackUrl,
    });
    productCard.getElement();

    expect(Image).toHaveBeenCalledWith(
      expect.objectContaining({
        fallbackImageUrl: fallbackUrl,
      })
    );
  });

  it('should render title in Card component', () => {
    const productCard = ProductCard(defaultProps);
    productCard.getElement();

    expect(Card).toHaveBeenCalledWith(
      expect.objectContaining({
        title: defaultProps.title,
      })
    );
  });

  it('should create Typography components for specifications', () => {
    const productCard = ProductCard(defaultProps);
    productCard.getElement();

    // Should create Typography for each spec key and value (2 per spec)
    const expectedCalls = Object.entries(defaultProps.productData).length * 2;
    expect(Typography).toHaveBeenCalledTimes(expectedCalls);
  });

  it('should render price with PriceDisplay component', () => {
    const productCard = ProductCard({
      ...defaultProps,
      currency: '$',
    });
    productCard.getElement();

    expect(PriceDisplay).toHaveBeenCalledWith({
      label: '',
      value: '$299.99',
      loading: false,
      isHighlighted: false,
      className: 'product-card__price-display',
    });
  });

  it('should render price info when provided', () => {
    const priceInfo = 'inkl. MwSt.';
    const productCard = ProductCard({
      ...defaultProps,
      priceInfo,
    });
    productCard.getElement();

    expect(Typography).toHaveBeenCalledWith(
      expect.objectContaining({
        children: priceInfo,
        className: 'product-card__price-info',
        variant: 'caption',
      })
    );
  });

  it('should not render price info when not provided', () => {
    const productCard = ProductCard(defaultProps);
    productCard.getElement();

    const priceInfoCalls = Typography.mock.calls.filter(
      (call) => call[0]?.className === 'product-card__price-info'
    );
    expect(priceInfoCalls).toHaveLength(0);
  });

  it('should update price info efficiently', () => {
    const productCard = ProductCard({
      ...defaultProps,
      priceInfo: 'inkl. MwSt.',
    });

    // Mock the DOM structure for setPriceInfo
    const mockPriceInfoElement = {
      textContent: 'inkl. MwSt.',
    };
    const mockActionsContainer = {
      querySelector: vi.fn(() => mockPriceInfoElement),
      insertBefore: vi.fn(),
    };

    const element = productCard.getElement();
    element.querySelector = vi.fn((selector) => {
      if (selector === '.product-card__actions') return mockActionsContainer;
      if (selector === '.product-card__price-info') return mockPriceInfoElement;
      return null;
    });

    // Test updating price info
    productCard.setPriceInfo('+ kostenloser Versand');
    expect(mockPriceInfoElement.textContent).toBe('+ kostenloser Versand');
  });

  it('should remove price info when empty string provided', () => {
    const productCard = ProductCard({
      ...defaultProps,
      priceInfo: 'inkl. MwSt.',
    });

    const mockPriceInfoElement = {
      remove: vi.fn(),
    };
    const mockActionsContainer = {
      querySelector: vi.fn(() => mockPriceInfoElement),
    };

    const element = productCard.getElement();
    element.querySelector = vi.fn((selector) => {
      if (selector === '.product-card__actions') return mockActionsContainer;
      return mockPriceInfoElement;
    });

    productCard.setPriceInfo('');
    expect(mockPriceInfoElement.remove).toHaveBeenCalled();
  });

  it('should handle loading state', () => {
    const productCard = ProductCard({
      ...defaultProps,
      loading: true,
    });
    productCard.getElement();

    expect(PriceDisplay).toHaveBeenCalledWith(
      expect.objectContaining({ loading: true })
    );
    expect(Button).toHaveBeenCalledWith(
      expect.objectContaining({ disabled: true })
    );
  });

  it('should handle highlighted price', () => {
    const productCard = ProductCard({
      ...defaultProps,
      priceHighlighted: true,
    });
    productCard.getElement();

    expect(PriceDisplay).toHaveBeenCalledWith(
      expect.objectContaining({ isHighlighted: true })
    );
  });

  it('should update price loading state', () => {
    const productCard = ProductCard(defaultProps);
    productCard.getElement();

    // We can't directly test internal component access, but we can test
    // that the method exists and doesn't throw errors
    expect(() => {
      productCard.setPriceLoading(true);
      productCard.setPriceLoading(false);
    }).not.toThrow();

    // Verify state is updated
    const state = productCard.getState();
    expect(state.loading).toBe(false); // Last call was false
  });

  it('should update price value', () => {
    const productCard = ProductCard({
      ...defaultProps,
      currency: '$',
    });
    productCard.getElement();

    // Test that the method exists and doesn't throw
    expect(() => {
      productCard.setPrice('399.99', true);
    }).not.toThrow();

    // Verify state is updated
    const state = productCard.getState();
    expect(state.price).toBe('399.99');
    expect(state.priceHighlighted).toBe(true);
  });

  it('should render button with custom text', () => {
    const buttonText = 'Buy Now';
    const productCard = ProductCard({
      ...defaultProps,
      buttonText,
    });
    productCard.getElement();

    expect(Button).toHaveBeenCalledWith(
      expect.objectContaining({ text: buttonText })
    );
  });

  it('should pass onClick to button', () => {
    const onClick = vi.fn();
    const productCard = ProductCard({
      ...defaultProps,
      onClick,
    });
    productCard.getElement();

    expect(Button).toHaveBeenCalledWith(expect.objectContaining({ onClick }));
  });

  it('should migrate legacy onReserve prop', () => {
    const onReserve = vi.fn();
    const consoleWarnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => {});

    const productCard = ProductCard({
      ...defaultProps,
      onReserve,
    });
    productCard.getElement();

    expect(Button).toHaveBeenCalledWith(
      expect.objectContaining({ onClick: onReserve })
    );
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      '[ProductCard] onReserve is deprecated, use onClick instead'
    );

    consoleWarnSpy.mockRestore();
  });

  it('should apply custom class names', () => {
    const className = 'custom-class';
    const productCard = ProductCard({
      ...defaultProps,
      className,
    });
    productCard.getElement();

    expect(Card).toHaveBeenCalledWith(
      expect.objectContaining({
        className: expect.stringContaining(className),
      })
    );
  });

  it('should validate required props', () => {
    expect(() =>
      ProductCard({
        title: 'Test',
        productData: {},
        price: '100',
      })
    ).toThrow('ProductCard: imageUrl is required');

    expect(() =>
      ProductCard({
        imageUrl: 'test.jpg',
        productData: {},
        price: '100',
      })
    ).toThrow('ProductCard: title is required');

    expect(() =>
      ProductCard({
        imageUrl: 'test.jpg',
        title: 'Test',
        price: '100',
      })
    ).toThrow('ProductCard: productData is required');

    expect(() =>
      ProductCard({
        imageUrl: 'test.jpg',
        title: 'Test',
        productData: {},
      })
    ).toThrow('ProductCard: price is required');
  });

  it('should update component state', () => {
    const productCard = ProductCard(defaultProps);
    const element = productCard.getElement();

    // Mock the DOM structure for update method
    element.querySelector = vi.fn((selector) => {
      if (selector === '.product-card__actions') {
        return {
          querySelector: vi.fn(() => null),
          insertBefore: vi.fn(),
        };
      }
      return null;
    });

    const result = productCard.update({
      title: 'Updated Phone',
      price: '399.99',
      priceInfo: 'inkl. Steuer',
    });

    expect(result).toBe(productCard); // Returns self for chaining

    const state = productCard.getState();
    expect(state.title).toBe('Updated Phone');
    expect(state.price).toBe('399.99');
    expect(state.priceInfo).toBe('inkl. Steuer');
  });

  it('should cleanup on destroy', () => {
    const productCard = ProductCard(defaultProps);
    productCard.getElement();

    // Test that destroy method exists and doesn't throw
    expect(() => {
      productCard.destroy();
    }).not.toThrow();

    // Verify that Card and PriceDisplay destroy methods were called
    // Since we created new instances, check that destroy was called on the mock functions
    const cardInstances = Card.mock.results;
    const priceDisplayInstances = PriceDisplay.mock.results;

    if (cardInstances.length > 0) {
      expect(
        cardInstances[cardInstances.length - 1].value.destroy
      ).toHaveBeenCalled();
    }
    if (priceDisplayInstances.length > 0) {
      expect(
        priceDisplayInstances[priceDisplayInstances.length - 1].value.destroy
      ).toHaveBeenCalled();
    }
  });

  it('should expose state through getState', () => {
    const productCard = ProductCard(defaultProps);
    const state = productCard.getState();

    expect(state).toMatchObject({
      imageUrl: defaultProps.imageUrl,
      title: defaultProps.title,
      productData: defaultProps.productData,
      price: defaultProps.price,
    });
  });

  it('should maintain state after operations', () => {
    const productCard = ProductCard({
      ...defaultProps,
      currency: '$',
    });
    const element = productCard.getElement();

    // Mock the DOM structure for setPriceInfo
    element.querySelector = vi.fn((selector) => {
      if (selector === '.product-card__actions') {
        return {
          querySelector: vi.fn(() => null),
          insertBefore: vi.fn(),
        };
      }
      return null;
    });

    // Perform various operations
    productCard.setPriceLoading(true);
    productCard.setPrice('599.99', true);
    productCard.setPriceInfo('Special Offer');

    const state = productCard.getState();
    expect(state.loading).toBe(true);
    expect(state.price).toBe('599.99');
    expect(state.priceHighlighted).toBe(true);
    expect(state.priceInfo).toBe('Special Offer');
  });

  it('should handle default currency', () => {
    const productCard = ProductCard(defaultProps);
    productCard.getElement();

    expect(PriceDisplay).toHaveBeenCalledWith(
      expect.objectContaining({
        value: '€299.99', // Default currency is €
      })
    );
  });

  it('should handle default button text', () => {
    const productCard = ProductCard(defaultProps);
    productCard.getElement();

    expect(Button).toHaveBeenCalledWith(
      expect.objectContaining({
        text: 'Reserve', // Default button text
      })
    );
  });

  it('should handle default onClick', () => {
    const productCard = ProductCard(defaultProps);
    productCard.getElement();

    expect(Button).toHaveBeenCalledWith(
      expect.objectContaining({
        onClick: expect.any(Function), // Default empty function
      })
    );
  });
});
