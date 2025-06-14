// src/components/ProductDetail/ProductDetail.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock all external dependencies
vi.mock('../../utils/styleInjection.js', () => ({
  createStyleInjector: vi.fn(() => vi.fn()),
  css: vi.fn((strings) => strings.join('')),
}));

vi.mock('../../utils/componentFactory.js', () => ({
  createElement: vi.fn((tag, options = {}) => {
    const element = {
      tagName: tag.toUpperCase(),
      className: '',
      appendChild: vi.fn(),
      querySelector: vi.fn(),
      querySelectorAll: vi.fn(() => []),
      setAttribute: vi.fn(),
      getAttribute: vi.fn(),
      classList: {
        add: vi.fn(),
        remove: vi.fn(),
        toggle: vi.fn(),
        contains: vi.fn(() => false),
      },
      style: {},
      textContent: options.text || '',
      innerHTML: '',
      parentNode: null,
      ...options.events,
    };

    if (options.classes) {
      element.className = Array.isArray(options.classes)
        ? options.classes.filter(Boolean).join(' ')
        : options.classes;
    }

    if (options.children) {
      options.children.forEach((child) => element.appendChild(child));
    }

    if (options.attributes) {
      Object.entries(options.attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });
    }

    return element;
  }),
  validateProps: vi.fn((props, required, componentName) => {
    required.forEach((prop) => {
      if (!(prop in props)) {
        throw new Error(`${componentName}: ${prop} is required`);
      }
    });
  }),
  createComponent: vi.fn((name, factory) => factory),
}));

vi.mock('../../utils/baseComponent.js', () => ({
  createBaseComponent: vi.fn((renderFn) => (initialState) => ({
    getElement: () => renderFn(initialState),
    update: vi.fn(function (newProps) {
      Object.assign(initialState, newProps);
      return this;
    }),
    destroy: vi.fn(),
    getState: () => ({ ...initialState }),
  })),
}));

vi.mock('../../utils/composition.js', () => ({
  withThemeAwareness: vi.fn((component) => component),
}));

// Mock component dependencies
const mockImageSlider = {
  getElement: () => ({ className: 'image-slider' }),
  destroy: vi.fn(),
  goToSlide: vi.fn(),
  getCurrentIndex: vi.fn(() => 0),
};

const mockTypography = {
  getElement: () => ({ className: 'typography' }),
  destroy: vi.fn(),
};

const mockPriceDisplay = {
  getElement: () => ({ className: 'price-display' }),
  destroy: vi.fn(),
  setValue: vi.fn(),
  setLoading: vi.fn(),
};

const mockButton = {
  getElement: () => ({ className: 'button' }),
  destroy: vi.fn(),
  update: vi.fn(),
};

const mockTag = {
  getElement: () => ({ className: 'tag' }),
  destroy: vi.fn(),
};

vi.mock('../ImageSlider/index.js', () => ({
  default: vi.fn(() => mockImageSlider),
}));

vi.mock('../Typography/index.js', () => ({
  default: vi.fn(() => mockTypography),
}));

vi.mock('../PriceDisplay/index.js', () => ({
  default: vi.fn(() => mockPriceDisplay),
}));

vi.mock('../Button/index.js', () => ({
  default: vi.fn(() => mockButton),
}));

vi.mock('../Tag/index.js', () => ({
  default: vi.fn(() => mockTag),
}));

import ProductDetail from './ProductDetail.js';
import ImageSlider from '../ImageSlider/index.js';
import Typography from '../Typography/index.js';
import PriceDisplay from '../PriceDisplay/index.js';
import Button from '../Button/index.js';
import Tag from '../Tag/index.js';

describe('ProductDetail component', () => {
  const defaultProps = {
    title: 'Test Product',
    price: '299.99',
    images: [
      { imageUrl: 'https://example.com/image1.jpg', alt: 'Product view 1' },
      { imageUrl: 'https://example.com/image2.jpg', alt: 'Product view 2' },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a product detail element', () => {
    const productDetail = ProductDetail(defaultProps);
    const element = productDetail.getElement();

    expect(element).toBeDefined();
    expect(typeof productDetail.getElement).toBe('function');
    expect(typeof productDetail.update).toBe('function');
    expect(typeof productDetail.destroy).toBe('function');
  });

  it('should validate required props', () => {
    expect(() => ProductDetail({})).toThrow('ProductDetail: title is required');

    expect(() => ProductDetail({ title: 'Test' })).toThrow(
      'ProductDetail: price is required'
    );

    // Should not throw with all required props
    expect(() => ProductDetail(defaultProps)).not.toThrow();
  });

  it('should render with ImageSlider component', () => {
    const productDetail = ProductDetail(defaultProps);
    productDetail.getElement();

    expect(ImageSlider).toHaveBeenCalledWith({
      images: defaultProps.images,
      showThumbnails: true,
      showDots: false,
      showArrows: true,
      onChange: undefined,
      className: 'product-detail__image-slider',
    });
  });

  it('should render without images (empty gallery)', () => {
    const productDetail = ProductDetail({
      ...defaultProps,
      images: [],
    });
    productDetail.getElement();

    expect(ImageSlider).not.toHaveBeenCalled();
  });

  it('should render title with Typography component', () => {
    const productDetail = ProductDetail(defaultProps);
    productDetail.getElement();

    expect(Typography).toHaveBeenCalledWith({
      children: defaultProps.title,
      as: 'h1',
      className: 'product-detail__title',
    });
  });

  it('should render content when provided', () => {
    const content = 'This is a detailed product description.';
    const productDetail = ProductDetail({
      ...defaultProps,
      content,
    });
    productDetail.getElement();

    expect(Typography).toHaveBeenCalledWith({
      children: content,
      as: 'div',
      className: 'product-detail__content',
    });
  });

  it('should migrate legacy description prop to content', () => {
    const description = 'Legacy description content.';
    const productDetail = ProductDetail({
      ...defaultProps,
      description,
    });
    productDetail.getElement();

    expect(Typography).toHaveBeenCalledWith({
      children: description,
      as: 'div',
      className: 'product-detail__content',
    });
  });

  it('should render category as a tag', () => {
    const category = 'Electronics';
    const productDetail = ProductDetail({
      ...defaultProps,
      category,
    });
    productDetail.getElement();

    expect(Tag).toHaveBeenCalledWith({
      label: category,
      variant: 'secondary',
      size: 'sm',
      className: 'product-detail__category',
    });
  });

  it('should render tags', () => {
    const tags = ['Featured', 'New Arrival', 'Best Seller'];
    const productDetail = ProductDetail({
      ...defaultProps,
      tags,
    });
    productDetail.getElement();

    tags.forEach((tag) => {
      expect(Tag).toHaveBeenCalledWith({
        label: tag,
        variant: 'default',
        size: 'sm',
        onClick: null,
      });
    });
  });

  it('should render tags with custom configuration', () => {
    const tags = [
      { label: 'Featured', variant: 'primary', onClick: vi.fn() },
      { label: 'Sale', variant: 'danger' },
    ];
    const productDetail = ProductDetail({
      ...defaultProps,
      tags,
    });
    productDetail.getElement();

    expect(Tag).toHaveBeenCalledWith({
      label: 'Featured',
      variant: 'primary',
      size: 'sm',
      onClick: tags[0].onClick,
    });

    expect(Tag).toHaveBeenCalledWith({
      label: 'Sale',
      variant: 'danger',
      size: 'sm',
      onClick: null,
    });
  });

  it('should render specifications', () => {
    const specifications = {
      Storage: '256GB',
      Color: 'Space Gray',
      Battery: '3000mAh',
    };
    const productDetail = ProductDetail({
      ...defaultProps,
      specifications,
    });
    productDetail.getElement();

    expect(Typography).toHaveBeenCalledWith({
      children: 'Specifications',
      as: 'h3',
      className: 'product-detail__specs-title',
    });
  });

  it('should render price with PriceDisplay component', () => {
    const productDetail = ProductDetail({
      ...defaultProps,
      currency: '$',
      priceHighlighted: true,
    });
    productDetail.getElement();

    expect(PriceDisplay).toHaveBeenCalledWith({
      value: '$299.99',
      loading: false,
      isHighlighted: true,
      className: 'product-detail__price',
    });
  });

  it('should render price info when provided', () => {
    const priceInfo = 'inkl. MwSt.';
    const productDetail = ProductDetail({
      ...defaultProps,
      priceInfo,
    });
    productDetail.getElement();

    expect(Typography).toHaveBeenCalledWith({
      children: priceInfo,
      as: 'p',
      className: 'product-detail__price-info',
    });
  });

  it('should render primary action button', () => {
    const onClick = vi.fn();
    const buttonText = 'Buy Now';
    const productDetail = ProductDetail({
      ...defaultProps,
      buttonText,
      onClick,
    });
    productDetail.getElement();

    expect(Button).toHaveBeenCalledWith({
      text: buttonText,
      variant: 'primary',
      size: 'lg',
      onClick,
      disabled: false,
      loading: false,
      className: 'product-detail__primary-button',
    });
  });

  it('should render additional buttons', () => {
    const additionalButtons = [
      { text: 'Add to Wishlist', variant: 'secondary', onClick: vi.fn() },
      { text: 'Compare', onClick: vi.fn() },
    ];
    const productDetail = ProductDetail({
      ...defaultProps,
      additionalButtons,
    });
    productDetail.getElement();

    expect(Button).toHaveBeenCalledWith({
      text: 'Add to Wishlist',
      variant: 'secondary',
      size: 'lg',
      onClick: additionalButtons[0].onClick,
      disabled: false,
      className: 'product-detail__additional-button ',
    });

    expect(Button).toHaveBeenCalledWith({
      text: 'Compare',
      variant: 'secondary',
      size: 'lg',
      onClick: additionalButtons[1].onClick,
      disabled: false,
      className: 'product-detail__additional-button ',
    });
  });

  it('should handle loading state', () => {
    const productDetail = ProductDetail({
      ...defaultProps,
      loading: true,
    });
    productDetail.getElement();

    expect(PriceDisplay).toHaveBeenCalledWith(
      expect.objectContaining({ loading: true })
    );

    expect(Button).toHaveBeenCalledWith(
      expect.objectContaining({
        disabled: true,
        loading: true,
      })
    );
  });

  it('should handle disabled state', () => {
    const productDetail = ProductDetail({
      ...defaultProps,
      disabled: true,
    });
    productDetail.getElement();

    expect(Button).toHaveBeenCalledWith(
      expect.objectContaining({ disabled: true })
    );
  });

  it('should migrate legacy onAddToCart prop', () => {
    const onAddToCart = vi.fn();
    const consoleWarnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => {});

    const productDetail = ProductDetail({
      ...defaultProps,
      onAddToCart,
    });
    productDetail.getElement();

    expect(Button).toHaveBeenCalledWith(
      expect.objectContaining({ onClick: onAddToCart })
    );
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      '[ProductDetail] onAddToCart is deprecated, use onClick instead'
    );

    consoleWarnSpy.mockRestore();
  });

  it('should update price with setPrice method', () => {
    const productDetail = ProductDetail(defaultProps);
    productDetail.getElement();

    productDetail.setPrice('399.99', true, 'Special offer');

    expect(mockPriceDisplay.setValue).toHaveBeenCalledWith('€399.99', true);

    const state = productDetail.getState();
    expect(state.price).toBe('399.99');
    expect(state.priceHighlighted).toBe(true);
    expect(state.priceInfo).toBe('Special offer');
  });

  it('should update loading state with setLoading method', () => {
    const productDetail = ProductDetail(defaultProps);
    productDetail.getElement();

    productDetail.setLoading(true);

    expect(mockPriceDisplay.setLoading).toHaveBeenCalledWith(true);
    expect(mockButton.update).toHaveBeenCalledWith({ loading: true });

    const state = productDetail.getState();
    expect(state.loading).toBe(true);
  });

  it('should navigate images with goToImage method', () => {
    const productDetail = ProductDetail(defaultProps);
    productDetail.getElement();

    productDetail.goToImage(1);

    expect(mockImageSlider.goToSlide).toHaveBeenCalledWith(1);
  });

  it('should get current image index', () => {
    const productDetail = ProductDetail(defaultProps);
    productDetail.getElement();

    const currentIndex = productDetail.getCurrentImageIndex();

    expect(mockImageSlider.getCurrentIndex).toHaveBeenCalled();
    expect(currentIndex).toBe(0);
  });

  it('should update content with setContent method', () => {
    const productDetail = ProductDetail(defaultProps);

    const updateSpy = vi.spyOn(productDetail, 'update');

    productDetail.setContent('New content');

    expect(updateSpy).toHaveBeenCalledWith({ content: 'New content' });
  });

  it('should expose state through getState', () => {
    const productDetail = ProductDetail(defaultProps);
    const state = productDetail.getState();

    expect(state).toMatchObject({
      title: defaultProps.title,
      price: defaultProps.price,
      images: defaultProps.images,
    });
  });

  it('should apply custom class names', () => {
    const className = 'custom-product-detail';
    const productDetail = ProductDetail({
      ...defaultProps,
      className,
    });
    const element = productDetail.getElement();

    expect(element.className).toContain(className);
  });

  it('should handle image change callback', () => {
    const onImageChange = vi.fn();
    const productDetail = ProductDetail({
      ...defaultProps,
      onImageChange,
    });
    productDetail.getElement();

    expect(ImageSlider).toHaveBeenCalledWith(
      expect.objectContaining({ onChange: onImageChange })
    );
  });

  it('should clean up on destroy', () => {
    const productDetail = ProductDetail(defaultProps);
    productDetail.getElement();

    productDetail.destroy();

    expect(mockImageSlider.destroy).toHaveBeenCalled();
    expect(mockPriceDisplay.destroy).toHaveBeenCalled();
  });

  it('should handle update with migrated props', () => {
    const productDetail = ProductDetail(defaultProps);

    const result = productDetail.update({
      onAddToCart: vi.fn(),
      description: 'Updated description',
    });

    expect(result).toBe(productDetail); // Returns self for chaining
  });

  it('should handle default currency', () => {
    const productDetail = ProductDetail(defaultProps);
    productDetail.getElement();

    expect(PriceDisplay).toHaveBeenCalledWith(
      expect.objectContaining({ value: '€299.99' })
    );
  });

  it('should handle default button text', () => {
    const productDetail = ProductDetail(defaultProps);
    productDetail.getElement();

    expect(Button).toHaveBeenCalledWith(
      expect.objectContaining({ text: 'Add to Cart' })
    );
  });

  it('should handle single image (no thumbnails)', () => {
    const productDetail = ProductDetail({
      ...defaultProps,
      images: [
        { imageUrl: 'https://example.com/single.jpg', alt: 'Single image' },
      ],
    });
    productDetail.getElement();

    expect(ImageSlider).toHaveBeenCalledWith(
      expect.objectContaining({
        showThumbnails: false,
        showArrows: false,
      })
    );
  });
});
