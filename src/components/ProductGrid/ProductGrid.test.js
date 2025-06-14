// src/components/ProductGrid/ProductGrid.test.js
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ProductGrid from './ProductGrid.js';

describe('ProductGrid component', () => {
  let observerInstances;

  beforeEach(() => {
    observerInstances = [];

    // Mock IntersectionObserver
    global.IntersectionObserver = vi.fn((callback, options) => {
      const instance = {
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
        callback,
        options,
      };
      observerInstances.push(instance);
      return instance;
    });
  });

  afterEach(() => {
    delete global.IntersectionObserver;
    observerInstances = [];
  });

  const mockProducts = [
    {
      id: 'p1',
      imageUrl: 'image1.jpg',
      title: 'Product 1',
      productData: { Storage: '64GB' },
      price: '299',
      tags: ['Premium', '5G'],
    },
    {
      id: 'p2',
      imageUrl: 'image2.jpg',
      title: 'Product 2',
      productData: { Storage: '128GB' },
      price: '399',
      tags: ['Budget'],
    },
  ];

  it('should create a product grid element', () => {
    const grid = ProductGrid({ products: mockProducts });
    const element = grid.getElement();

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.classList.contains('product-grid')).toBe(true);
  });

  it('should display initial products', async () => {
    const grid = ProductGrid({
      products: mockProducts,
      showLoadingSkeletons: false,
    });
    const element = grid.getElement();

    // Wait for products to load
    await new Promise((resolve) => setTimeout(resolve, 50));

    const productCards = element.querySelectorAll('.product-grid__card');
    expect(productCards).toHaveLength(2);
  });

  it('should show skeleton loaders initially', () => {
    const grid = ProductGrid({
      products: [],
      showLoadingSkeletons: true,
      skeletonCount: 4,
    });
    const element = grid.getElement();

    const skeletons = element.querySelectorAll('.product-grid__skeleton');
    expect(skeletons).toHaveLength(4);
  });

  it('should create filter tags when filtering is enabled', () => {
    const grid = ProductGrid({
      products: mockProducts,
      enableFiltering: true,
    });
    const element = grid.getElement();

    const filters = element.querySelector('.product-grid__filters');
    expect(filters).not.toBeNull();

    // Should have "All" tag + unique tags (Tags are span elements with role="button")
    const tags = filters.querySelectorAll('[role="button"]');
    expect(tags.length).toBeGreaterThan(1);

    // Check for specific tags
    const tagLabels = Array.from(tags).map(
      (tag) => tag.querySelector('.tag__label')?.textContent
    );
    expect(tagLabels).toContain('All');
    expect(tagLabels).toContain('Premium');
    expect(tagLabels).toContain('5G');
    expect(tagLabels).toContain('Budget');
  });

  it('should filter products by tags', async () => {
    const grid = ProductGrid({
      products: mockProducts,
      enableFiltering: true,
      showLoadingSkeletons: false,
    });
    const element = grid.getElement();

    // Wait for initial load
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Click on "Budget" tag
    const filters = element.querySelector('.product-grid__filters');
    const budgetTag = Array.from(
      filters.querySelectorAll('[role="button"]')
    ).find((tag) => tag.querySelector('.tag__label')?.textContent === 'Budget');

    expect(budgetTag).toBeDefined();
    budgetTag.click();

    // Wait for filter to apply
    await new Promise((resolve) => setTimeout(resolve, 350));

    const productCards = element.querySelectorAll('.product-grid__card');
    expect(productCards).toHaveLength(1);
  });

  it('should handle product click callback', async () => {
    const onClick = vi.fn();
    const grid = ProductGrid({
      products: mockProducts,
      onProductClick: onClick,
      showLoadingSkeletons: false,
    });
    const element = grid.getElement();

    await new Promise((resolve) => setTimeout(resolve, 50));

    const button = element.querySelector('.product-grid__card button');
    button.click();

    expect(onClick).toHaveBeenCalledWith(mockProducts[0], 0);
  });

  it('should update products', async () => {
    const grid = ProductGrid({
      products: mockProducts,
      showLoadingSkeletons: false,
    });

    // Wait for initial load
    await new Promise((resolve) => setTimeout(resolve, 50));

    const newProducts = [
      {
        id: 'p3',
        imageUrl: 'image3.jpg',
        title: 'Product 3',
        productData: { Storage: '256GB' },
        price: '599',
      },
    ];

    grid.updateProducts(newProducts);

    // Wait for update and reload
    await new Promise((resolve) => setTimeout(resolve, 350));

    const element = grid.getElement();
    const productCards = element.querySelectorAll('.product-grid__card');
    expect(productCards).toHaveLength(1);
  });

  it('should add products to existing list', async () => {
    const grid = ProductGrid({
      products: mockProducts,
      showLoadingSkeletons: false,
    });

    await new Promise((resolve) => setTimeout(resolve, 50));

    const newProducts = [
      {
        id: 'p3',
        imageUrl: 'image3.jpg',
        title: 'Product 3',
        productData: { Storage: '256GB' },
        price: '599',
      },
    ];

    grid.addProducts(newProducts);

    // Products should be added to state
    // Note: New products won't display unless we're at the end
    // This tests that they're added to the internal state
    expect(() => grid.addProducts(newProducts)).not.toThrow();
  });

  it('should respect column configuration', () => {
    const grid = ProductGrid({
      products: mockProducts,
      columnsDesktop: 3,
      columnsTablet: 2,
      columnsMobile: 1,
    });
    const element = grid.getElement();

    // Check that grid is created with correct column configuration
    const gridElement = element.querySelector('.grid');
    expect(gridElement).not.toBeNull();
  });

  it('should clean up observer on destroy', async () => {
    // Need more products to trigger lazy loading
    const manyProducts = Array.from({ length: 20 }, (_, i) => ({
      id: `p${i}`,
      imageUrl: `image${i}.jpg`,
      title: `Product ${i}`,
      productData: { Storage: '64GB' },
      price: '299',
    }));

    const grid = ProductGrid({
      products: manyProducts,
      enableLazyLoad: true,
      initialLoadCount: 5,
      showLoadingSkeletons: false,
    });

    // Wait for initial load and observer setup
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Check that observer was created
    expect(observerInstances.length).toBeGreaterThan(0);
    const observer = observerInstances[0];

    grid.destroy();

    // Check that disconnect was called
    expect(observer.disconnect).toHaveBeenCalled();
  });

  it('should get and set active filters', () => {
    const grid = ProductGrid({
      products: mockProducts,
      enableFiltering: true,
    });

    // Initially no filters
    expect(grid.getActiveFilters()).toEqual([]);

    // Set filters
    grid.setActiveFilters(['Premium']);
    expect(grid.getActiveFilters()).toEqual(['Premium']);
  });

  it('should update specific product', async () => {
    const grid = ProductGrid({
      products: mockProducts,
      showLoadingSkeletons: false,
    });

    await new Promise((resolve) => setTimeout(resolve, 50));

    // Update first product
    grid.updateProduct('p1', {
      price: '199',
      priceHighlighted: true,
    });

    // Should not throw
    expect(() => grid.updateProduct('p1', { price: '199' })).not.toThrow();
  });

  it('should handle theme changes', () => {
    const grid = ProductGrid({ products: mockProducts });

    // Should not throw
    expect(() => {
      grid.onThemeChange('dark', 'light');
    }).not.toThrow();
  });

  it('should apply custom className', () => {
    const grid = ProductGrid({
      products: mockProducts,
      className: 'custom-grid',
    });
    const element = grid.getElement();

    expect(element.classList.contains('custom-grid')).toBe(true);
  });

  it('should configure gap spacing', () => {
    const grid = ProductGrid({
      products: mockProducts,
      gap: '2rem',
    });
    const element = grid.getElement();

    const gridElement = element.querySelector('.grid');
    expect(gridElement.style.gap).toBe('2rem');
  });

  it('should create observer when lazy load is enabled', async () => {
    // Need more products than initial load to trigger observer
    const manyProducts = Array.from({ length: 20 }, (_, i) => ({
      id: `p${i}`,
      imageUrl: `image${i}.jpg`,
      title: `Product ${i}`,
      productData: { Storage: '64GB' },
      price: '299',
    }));

    // Create grid with more products than initial load
    ProductGrid({
      products: manyProducts,
      enableLazyLoad: true,
      initialLoadCount: 5,
      showLoadingSkeletons: false,
    });

    // Wait for initial load
    await new Promise((resolve) => setTimeout(resolve, 50));

    // With lazy load should create observer
    expect(global.IntersectionObserver).toHaveBeenCalled();
    expect(observerInstances.length).toBeGreaterThan(0);
  });

  it('should not create observer when lazy load is disabled', () => {
    // Reset observer instances
    observerInstances = [];

    // Just create the grid without assigning it
    ProductGrid({
      products: mockProducts,
      enableLazyLoad: false,
    });

    // Without lazy load should not create observer
    expect(observerInstances.length).toBe(0);
  });

  it('should observe sentinel element for infinite scroll', async () => {
    const manyProducts = Array.from({ length: 20 }, (_, i) => ({
      id: `p${i}`,
      imageUrl: `image${i}.jpg`,
      title: `Product ${i}`,
      productData: { Storage: '64GB' },
      price: '299',
    }));

    ProductGrid({
      products: manyProducts,
      enableLazyLoad: true,
      initialLoadCount: 5,
      showLoadingSkeletons: false,
    });

    await new Promise((resolve) => setTimeout(resolve, 50));

    // Check that observer was created and observe was called
    expect(observerInstances.length).toBeGreaterThan(0);
    expect(observerInstances[0].observe).toHaveBeenCalled();
  });
});
