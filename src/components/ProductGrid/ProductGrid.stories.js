// src/components/ProductGrid/ProductGrid.stories.js
import ProductGrid from './ProductGrid.js';

// Mock product data generator
const generateMockProducts = (count, startIndex = 0) => {
  const brands = ['iPhone', 'Samsung Galaxy', 'Google Pixel', 'OnePlus'];
  const conditions = ['Excellent', 'Very Good', 'Good', 'Fair'];
  const colors = ['Black', 'White', 'Blue', 'Red', 'Green', 'Gold'];
  const storages = ['64GB', '128GB', '256GB', '512GB'];
  const tags = ['Premium', 'Budget', 'Flagship', '5G', 'Refurbished', 'New'];

  return Array.from({ length: count }, (_, i) => {
    const index = startIndex + i;
    const brand = brands[index % brands.length];
    const model = `${brand} ${index + 1}`;
    const condition = conditions[index % conditions.length];
    const color = colors[index % colors.length];
    const storage = storages[index % storages.length];
    const price = (300 + ((index * 50) % 700)).toFixed(2);

    // Assign 1-3 random tags
    const productTags = [];
    const tagCount = 1 + (index % 3);
    for (let j = 0; j < tagCount; j++) {
      const tag = tags[(index + j) % tags.length];
      if (!productTags.includes(tag)) {
        productTags.push(tag);
      }
    }

    return {
      id: `product-${index}`,
      imageUrl: `https://picsum.photos/300/200`,
      title: model,
      productData: {
        Storage: storage,
        Color: color,
        Condition: condition,
        'Battery Health': `${85 + (index % 15)}%`,
      },
      price,
      currency: '€',
      priceInfo: index % 3 === 0 ? 'inkl. MwSt.' : null,
      priceHighlighted: index % 5 === 0,
      tags: productTags,
    };
  });
};

export default {
  title: 'Components/ProductGrid',
  component: ProductGrid,
};

// Basic grid with 12 products
export const Default = () => {
  const products = generateMockProducts(12);

  const grid = ProductGrid({
    products,
    onProductClick: (product, index) => {
      alert(`Clicked: ${product.title} (index: ${index})`);
    },
  });

  return grid.getElement();
};

// Grid with skeleton loading demonstration
export const WithSkeletonLoading = () => {
  const container = document.createElement('div');

  // Initially empty grid showing skeletons
  const grid = ProductGrid({
    products: [],
    showLoadingSkeletons: true,
    skeletonCount: 8,
  });

  container.appendChild(grid.getElement());

  // Simulate loading products after 2 seconds
  setTimeout(() => {
    const products = generateMockProducts(20);
    grid.updateProducts(products);
  }, 2000);

  // Add info text
  const info = document.createElement('p');
  info.textContent = 'Products will load in 2 seconds...';
  info.style.textAlign = 'center';
  info.style.color = '#666';
  info.style.marginBottom = '1rem';
  container.insertBefore(info, container.firstChild);

  return container;
};

// Large grid with lazy loading
export const WithLazyLoading = () => {
  const container = document.createElement('div');

  // Add info
  const info = document.createElement('div');
  info.style.padding = '1rem';
  info.style.background = '#e3f2fd';
  info.style.borderRadius = '8px';
  info.style.marginBottom = '1rem';
  info.innerHTML = `
    <h3 style="margin: 0 0 0.5rem 0;">Lazy Loading Demo</h3>
    <p style="margin: 0;">Scroll down to load more products. Initial: 8, then 8 more each time.</p>
  `;
  container.appendChild(info);

  const products = generateMockProducts(100);

  const grid = ProductGrid({
    products,
    initialLoadCount: 8,
    loadMoreCount: 8,
    enableLazyLoad: true,
    onProductClick: (product) => {
      console.log('Clicked:', product);
    },
  });

  container.appendChild(grid.getElement());
  return container;
};

// Grid with tag filtering
export const WithTagFiltering = () => {
  const container = document.createElement('div');

  const products = generateMockProducts(50);

  const grid = ProductGrid({
    products,
    enableFiltering: true,
    initialLoadCount: 12,
    onProductClick: (product) => {
      alert(`${product.title}\nTags: ${product.tags.join(', ')}`);
    },
  });

  container.appendChild(grid.getElement());
  return container;
};

// Custom column configuration
export const CustomColumns = () => {
  const container = document.createElement('div');

  // Add controls
  const controls = document.createElement('div');
  controls.style.marginBottom = '1rem';
  controls.innerHTML = '<h3>Different Column Configurations</h3>';
  container.appendChild(controls);

  // 3-column grid
  const title1 = document.createElement('h4');
  title1.textContent = '3 Columns on Desktop';
  container.appendChild(title1);

  const grid3 = ProductGrid({
    products: generateMockProducts(9),
    columnsDesktop: 3,
    columnsTablet: 2,
    columnsMobile: 1,
    enableFiltering: false,
    enableLazyLoad: false,
  });
  container.appendChild(grid3.getElement());

  // 5-column grid
  const title2 = document.createElement('h4');
  title2.textContent = '5 Columns on Desktop';
  title2.style.marginTop = '2rem';
  container.appendChild(title2);

  const grid5 = ProductGrid({
    products: generateMockProducts(10, 10),
    columnsDesktop: 5,
    columnsTablet: 3,
    columnsMobile: 2,
    enableFiltering: false,
    enableLazyLoad: false,
    gap: '1rem',
  });
  container.appendChild(grid5.getElement());

  return container;
};

// Dynamic product updates
export const DynamicUpdates = () => {
  const container = document.createElement('div');

  // Controls
  const controls = document.createElement('div');
  controls.style.display = 'flex';
  controls.style.gap = '1rem';
  controls.style.marginBottom = '1rem';

  const addButton = document.createElement('button');
  addButton.textContent = 'Add 5 Products';
  addButton.style.padding = '0.5rem 1rem';

  const updateButton = document.createElement('button');
  updateButton.textContent = 'Update First Product Price';
  updateButton.style.padding = '0.5rem 1rem';

  const replaceButton = document.createElement('button');
  replaceButton.textContent = 'Replace All Products';
  replaceButton.style.padding = '0.5rem 1rem';

  controls.appendChild(addButton);
  controls.appendChild(updateButton);
  controls.appendChild(replaceButton);
  container.appendChild(controls);

  // Initial products
  let productCount = 8;
  const grid = ProductGrid({
    products: generateMockProducts(productCount),
    initialLoadCount: 20,
    enableLazyLoad: false,
  });

  // Button handlers
  addButton.onclick = () => {
    const newProducts = generateMockProducts(5, productCount);
    productCount += 5;
    grid.addProducts(newProducts);
  };

  updateButton.onclick = () => {
    grid.updateProduct('product-0', {
      price: (Math.random() * 1000).toFixed(2),
      priceHighlighted: true,
      priceInfo: 'SALE!',
    });
  };

  replaceButton.onclick = () => {
    productCount = 12;
    grid.updateProducts(generateMockProducts(productCount));
  };

  container.appendChild(grid.getElement());
  return container;
};

// Programmatic filter control
export const ProgrammaticFilters = () => {
  const container = document.createElement('div');

  // Info
  const info = document.createElement('div');
  info.style.marginBottom = '1rem';
  info.innerHTML = '<p>Use buttons below to programmatically set filters:</p>';
  container.appendChild(info);

  // Filter buttons
  const filterControls = document.createElement('div');
  filterControls.style.display = 'flex';
  filterControls.style.gap = '0.5rem';
  filterControls.style.marginBottom = '1rem';

  const premiumButton = document.createElement('button');
  premiumButton.textContent = 'Show Premium Only';
  premiumButton.style.padding = '0.5rem 1rem';

  const budgetButton = document.createElement('button');
  budgetButton.textContent = 'Show Budget Only';
  budgetButton.style.padding = '0.5rem 1rem';

  const allButton = document.createElement('button');
  allButton.textContent = 'Show All';
  allButton.style.padding = '0.5rem 1rem';

  filterControls.appendChild(premiumButton);
  filterControls.appendChild(budgetButton);
  filterControls.appendChild(allButton);
  container.appendChild(filterControls);

  // Create grid
  const products = generateMockProducts(30);
  const grid = ProductGrid({
    products,
    enableFiltering: true,
  });

  // Button handlers
  premiumButton.onclick = () => {
    grid.setActiveFilters(['Premium', 'Flagship']);
  };

  budgetButton.onclick = () => {
    grid.setActiveFilters(['Budget']);
  };

  allButton.onclick = () => {
    grid.setActiveFilters([]);
  };

  container.appendChild(grid.getElement());
  return container;
};

// No products state
export const EmptyState = () => {
  const grid = ProductGrid({
    products: [],
    showLoadingSkeletons: false,
  });

  const container = grid.getElement();

  // Add empty state message
  const emptyMessage = document.createElement('div');
  emptyMessage.style.textAlign = 'center';
  emptyMessage.style.padding = '3rem';
  emptyMessage.style.color = '#666';
  emptyMessage.innerHTML = `
    <h3>No products found</h3>
    <p>Try adjusting your filters or check back later.</p>
  `;

  container.querySelector('.product-grid__grid').appendChild(emptyMessage);

  return container;
};
