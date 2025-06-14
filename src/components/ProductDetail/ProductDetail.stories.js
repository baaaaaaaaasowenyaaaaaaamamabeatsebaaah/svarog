// src/components/ProductDetail/ProductDetail.stories.js
import ProductDetail from './ProductDetail.js';

export default {
  title: 'Components/ProductDetail',
  component: ProductDetail,
};

// Sample product data
const sampleImages = [
  {
    imageUrl: 'https://picsum.photos/800/600?random=1',
    thumbnailUrl: 'https://picsum.photos/120/120?random=1',
    alt: 'Product front view',
  },
  {
    imageUrl: 'https://picsum.photos/800/600?random=2',
    thumbnailUrl: 'https://picsum.photos/120/120?random=2',
    alt: 'Product side view',
  },
  {
    imageUrl: 'https://picsum.photos/800/600?random=3',
    thumbnailUrl: 'https://picsum.photos/120/120?random=3',
    alt: 'Product back view',
  },
  {
    imageUrl: 'https://picsum.photos/800/600?random=4',
    thumbnailUrl: 'https://picsum.photos/120/120?random=4',
    alt: 'Product detail view',
  },
];

const sampleSpecifications = {
  Storage: '256GB',
  Color: 'Space Gray',
  Display: '6.1-inch OLED',
  Battery: '3095 mAh',
  Camera: '12MP Triple',
  Weight: '174g',
  'Water Resistance': 'IP68',
  'Wireless Charging': 'Yes',
};

export const Default = () => {
  return ProductDetail({
    title: 'iPhone 13 Pro',
    content:
      'Experience the most advanced iPhone yet with the Pro camera system, Super Retina XDR display with ProMotion, and A15 Bionic chip.',
    images: sampleImages,
    price: '999.99',
    category: 'Smartphones',
    tags: ['Featured', 'New'],
    specifications: sampleSpecifications,
    onClick: () => alert('Added to cart!'),
  });
};

export const WithPriceInfo = () => {
  return ProductDetail({
    title: 'Samsung Galaxy S22 Ultra',
    content:
      'The most powerful Galaxy smartphone with built-in S Pen, advanced camera system, and all-day battery life.',
    images: sampleImages,
    price: '1199.99',
    currency: '$',
    priceInfo: 'Incl. taxes & free shipping',
    priceHighlighted: true,
    category: 'Smartphones',
    tags: ['Premium', 'S Pen'],
    specifications: {
      Storage: '512GB',
      RAM: '12GB',
      Display: '6.8-inch Dynamic AMOLED',
      'S Pen': 'Built-in',
      Camera: '108MP Quad',
    },
    onClick: () => alert('Added to cart!'),
  });
};

export const WithAdditionalButtons = () => {
  return ProductDetail({
    title: 'MacBook Pro 14-inch',
    content:
      'Supercharged by M2 Pro or M2 Max chip. Up to 18 hours of battery life. Liquid Retina XDR display.',
    images: sampleImages,
    price: '1999.99',
    currency: '$',
    priceInfo: 'Starting price - customize your configuration',
    category: 'Laptops',
    tags: [
      { label: 'Professional', variant: 'primary' },
      { label: 'M2 Chip', variant: 'info' },
      { label: 'Bestseller', variant: 'success' },
    ],
    specifications: {
      Chip: 'Apple M2 Pro',
      Memory: '16GB unified memory',
      Storage: '512GB SSD',
      Display: '14.2-inch Liquid Retina XDR',
      Battery: 'Up to 18 hours',
      Weight: '3.5 pounds',
    },
    buttonText: 'Configure & Buy',
    additionalButtons: [
      {
        text: 'Add to Wishlist',
        variant: 'secondary',
        onClick: () => alert('Added to wishlist!'),
      },
      {
        text: 'Compare Models',
        variant: 'outline',
        onClick: () => alert('Opening comparison...'),
      },
      {
        text: 'Request Quote',
        variant: 'tertiary',
        onClick: () => alert('Requesting quote...'),
      },
    ],
    onClick: () => alert('Configuring MacBook Pro...'),
  });
};

export const LoadingState = () => {
  return ProductDetail({
    title: 'Google Pixel 7 Pro',
    content:
      'The most helpful phone ever with Google AI, amazing camera features, and all-day battery.',
    images: sampleImages,
    price: 'Calculating...',
    loading: true,
    category: 'Smartphones',
    tags: ['Google AI', 'Camera Pro'],
    specifications: sampleSpecifications,
    priceInfo: 'Price calculation in progress',
    onClick: () => alert('Cannot add while loading'),
  });
};

export const NoImages = () => {
  return ProductDetail({
    title: 'Wireless Headphones',
    content:
      'Premium wireless headphones with active noise cancellation and 30-hour battery life.',
    images: [],
    price: '299.99',
    category: 'Audio',
    tags: ['Wireless', 'Noise Cancelling'],
    specifications: {
      Type: 'Over-ear',
      Connectivity: 'Bluetooth 5.0',
      'Battery Life': '30 hours',
      'Noise Cancellation': 'Active',
      Weight: '250g',
    },
    onClick: () => alert('Added to cart!'),
  });
};

export const SingleImage = () => {
  return ProductDetail({
    title: 'Smart Watch Series 8',
    content:
      'Advanced health monitoring, fitness tracking, and smart features in a sleek design.',
    images: [sampleImages[0]],
    price: '399.99',
    category: 'Wearables',
    tags: ['Health', 'Fitness', 'Smart'],
    specifications: {
      Display: '45mm Always-On Retina',
      'Health Sensors': 'ECG, Blood Oxygen, Temperature',
      'Water Resistance': '50 meters',
      Battery: 'Up to 18 hours',
      GPS: 'Built-in',
    },
    onClick: () => alert('Added to cart!'),
  });
};

export const MinimalConfiguration = () => {
  return ProductDetail({
    title: 'Essential Product',
    price: '99.99',
    onClick: () => alert('Added to cart!'),
  });
};

export const CustomCurrency = () => {
  return ProductDetail({
    title: 'European Product',
    content: 'This product is priced in Euros with European specifications.',
    images: sampleImages.slice(0, 2),
    price: '849.99',
    currency: '€',
    priceInfo: 'inkl. 19% MwSt. + kostenloser Versand',
    category: 'Electronics',
    tags: ['EU Warranty', 'Free Shipping'],
    specifications: {
      Region: 'Europe',
      Warranty: '2 years',
      Voltage: '230V',
      'Plug Type': 'Type C',
    },
    buttonText: 'In den Warenkorb',
    onClick: () => alert('Zum Warenkorb hinzugefügt!'),
  });
};

export const InteractiveDemo = () => {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '20px';

  // Create product detail
  const productDetail = ProductDetail({
    title: 'Interactive Product Demo',
    content: 'This product demonstrates dynamic updates and interactions.',
    images: sampleImages,
    price: '599.99',
    category: 'Demo',
    tags: ['Interactive', 'Demo'],
    specifications: sampleSpecifications,
    priceInfo: 'Base price',
    buttonText: 'Add to Cart',
    additionalButtons: [
      {
        text: 'Add to Wishlist',
        variant: 'secondary',
        onClick: () => alert('Added to wishlist!'),
      },
    ],
    onClick: () => alert('Added to cart!'),
    onImageChange: (current, previous) => {
      console.log(`Image changed from ${previous} to ${current}`);
    },
  });

  container.appendChild(productDetail.getElement());

  // Create controls
  const controls = document.createElement('div');
  controls.style.cssText = `
    display: flex;
    gap: 10px;
    padding: 20px;
    background: #f5f5f5;
    border-radius: 8px;
    flex-wrap: wrap;
  `;

  const createButton = (text, onClick) => {
    const button = document.createElement('button');
    button.textContent = text;
    button.style.cssText = `
      padding: 8px 16px;
      border: 1px solid #ddd;
      background: white;
      border-radius: 4px;
      cursor: pointer;
    `;
    button.onclick = onClick;
    return button;
  };

  // Control buttons
  controls.appendChild(
    createButton('Set Loading', () => {
      productDetail.setLoading(true);
      setTimeout(() => productDetail.setLoading(false), 2000);
    })
  );

  controls.appendChild(
    createButton('Update Price', () => {
      const newPrice = (Math.random() * 1000 + 100).toFixed(2);
      productDetail.setPrice(newPrice, true, 'Special offer!');
    })
  );

  controls.appendChild(
    createButton('Go to Image 2', () => {
      productDetail.goToImage(1);
    })
  );

  controls.appendChild(
    createButton('Update Content', () => {
      productDetail.setContent(
        'Updated product description with new features and benefits.'
      );
    })
  );

  controls.appendChild(
    createButton('Show Current State', () => {
      const state = productDetail.getState();
      console.log('Current state:', state);
      alert(
        `Current price: ${state.currency}${state.price}\nImage: ${productDetail.getCurrentImageIndex() + 1}`
      );
    })
  );

  container.appendChild(controls);
  return container;
};

export const MobilePreview = () => {
  const container = document.createElement('div');
  container.style.cssText = `
    max-width: 375px;
    margin: 0 auto;
    border: 2px solid #ddd;
    border-radius: 20px;
    padding: 10px;
    background: #f5f5f5;
    position: relative;
  `;

  // Add phone header
  const header = document.createElement('div');
  header.style.cssText = `
    text-align: center;
    margin-bottom: 10px;
    padding: 5px;
    background: white;
    border-radius: 10px;
    font-weight: bold;
  `;
  header.textContent = 'Mobile Preview (375px)';
  container.appendChild(header);

  // Add responsive indicator
  const indicator = document.createElement('div');
  indicator.style.cssText = `
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-bottom: 15px;
  `;

  const tags = ['Mobile', 'Responsive', 'Mobile-First'];
  tags.forEach((tag, index) => {
    const tagEl = document.createElement('span');
    tagEl.style.cssText = `
      background: ${index === 0 ? '#ef4444' : '#6b7280'};
      color: white;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 500;
    `;
    tagEl.textContent = tag;
    indicator.appendChild(tagEl);
  });
  container.appendChild(indicator);

  // Create the product detail with improved mobile flow
  const productDetail = ProductDetail({
    title: 'Mobile Product View',
    content:
      'This is how the product detail looks on mobile devices. Notice the improved UX flow: Image → Info → Price/Actions → Specifications.',
    images: sampleImages.slice(0, 3),
    price: '449.99',
    category: 'Mobile',
    tags: ['Responsive', 'Mobile-First'],
    specifications: {
      'Screen Size': '6.1 inches',
      OS: 'iOS 16',
      Storage: '128GB',
      Camera: '12MP',
    },
    priceInfo: 'Mobile optimized pricing',
    buttonText: 'Add to Cart',
    additionalButtons: [
      {
        text: 'Add to Wishlist',
        variant: 'secondary',
        onClick: () => alert('Mobile wishlist!'),
      },
    ],
    onClick: () => alert('Mobile purchase!'),
  });

  container.appendChild(productDetail.getElement());

  // Add mobile UX note
  const note = document.createElement('div');
  note.style.cssText = `
    margin-top: 15px;
    padding: 10px;
    background: #e0f2fe;
    border-radius: 8px;
    font-size: 12px;
    border: 1px solid #0284c7;
  `;
  note.innerHTML = `
    <strong>✨ Improved Mobile UX:</strong><br>
    • Image gallery at top<br>
    • Title and description next<br>
    • <strong>Price & actions in easy reach</strong><br>
    • Specifications at bottom<br>
    • No scrolling needed to buy!
  `;
  container.appendChild(note);

  return container;
};

export const LuxuryProduct = () => {
  return ProductDetail({
    title: 'Swiss Luxury Watch',
    content: `Handcrafted Swiss timepiece featuring automatic movement, sapphire crystal,
              and water resistance to 100 meters. Each watch is individually numbered
              and comes with a certificate of authenticity.`,
    images: sampleImages,
    price: '12999.99',
    currency: '$',
    priceInfo: 'Limited edition - Only 500 pieces worldwide',
    priceHighlighted: true,
    category: 'Luxury Watches',
    tags: [
      { label: 'Swiss Made', variant: 'primary' },
      { label: 'Limited Edition', variant: 'warning' },
      { label: 'Handcrafted', variant: 'success' },
    ],
    specifications: {
      Movement: 'Swiss Automatic',
      'Case Material': '18k Rose Gold',
      Crystal: 'Sapphire with Anti-reflective coating',
      'Water Resistance': '100 meters',
      'Case Diameter': '42mm',
      Strap: 'Genuine Alligator Leather',
      Warranty: 'International 2-year warranty',
      'Limited Edition': 'No. 1 of 500',
    },
    buttonText: 'Reserve Now',
    additionalButtons: [
      {
        text: 'Schedule Viewing',
        variant: 'secondary',
        onClick: () => alert('Scheduling private viewing...'),
      },
      {
        text: 'Request Certificate',
        variant: 'outline',
        onClick: () => alert('Requesting authenticity certificate...'),
      },
    ],
    onClick: () => alert('Luxury item reserved!'),
  });
};

export const ImprovedUXFlow = () => {
  const container = document.createElement('div');
  container.style.cssText = `
    display: flex;
    flex-direction: column;
    gap: 30px;
    max-width: 1200px;
    margin: 0 auto;
  `;

  // Title
  const title = document.createElement('h2');
  title.textContent = '✨ Improved UX Flow Demonstration';
  title.style.cssText = 'text-align: center; margin-bottom: 20px;';
  container.appendChild(title);

  // Description
  const description = document.createElement('div');
  description.style.cssText = `
    background: #f0f9ff;
    border: 2px solid #0284c7;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 20px;
  `;
  description.innerHTML = `
    <h3 style="margin-top: 0; color: #0c4a6e;">🎯 Better User Experience</h3>
    <p><strong>New Flow:</strong> Image Gallery → Product Info → <span style="background: #22c55e; color: white; padding: 2px 6px; border-radius: 4px;">Price & Actions</span> → Specifications</p>
    <p><strong>Why it's better:</strong></p>
    <ul>
      <li>✅ Price and buy button are immediately visible after reading description</li>
      <li>✅ No scrolling needed to make purchase decision</li>
      <li>✅ Specifications are optional details at the bottom</li>
      <li>✅ Better mobile experience - action buttons in thumb reach</li>
      <li>✅ More natural shopping flow</li>
    </ul>
  `;
  container.appendChild(description);

  // Side-by-side comparison
  const comparisonGrid = document.createElement('div');
  comparisonGrid.style.cssText = `
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    align-items: start;
  `;

  // Mobile layout (optimized)
  const mobileSection = document.createElement('div');
  mobileSection.style.cssText = `
    border: 2px solid #22c55e;
    border-radius: 12px;
    padding: 15px;
    background: #f0fdf4;
  `;

  const mobileTitle = document.createElement('h3');
  mobileTitle.textContent = '📱 Mobile Optimized';
  mobileTitle.style.cssText = 'color: #15803d; margin-top: 0;';
  mobileSection.appendChild(mobileTitle);

  const mobileContainer = document.createElement('div');
  mobileContainer.style.cssText = `
    max-width: 300px;
    margin: 0 auto;
    border: 1px solid #d1d5db;
    border-radius: 12px;
    padding: 8px;
    background: white;
  `;

  const mobileProduct = ProductDetail({
    title: 'Mobile Optimized Product',
    content:
      'Perfect mobile shopping experience with price and actions right after description.',
    images: sampleImages.slice(0, 2),
    price: '299.99',
    priceHighlighted: true,
    category: 'Mobile',
    tags: ['Optimized'],
    specifications: {
      Display: '6.1 inches',
      Storage: '128GB',
    },
    priceInfo: 'Perfect placement!',
    buttonText: 'Quick Buy',
    onClick: () => alert('Easy mobile purchase!'),
  });

  mobileContainer.appendChild(mobileProduct.getElement());
  mobileSection.appendChild(mobileContainer);

  // Desktop layout
  const desktopSection = document.createElement('div');
  desktopSection.style.cssText = `
    border: 2px solid #3b82f6;
    border-radius: 12px;
    padding: 15px;
    background: #eff6ff;
  `;

  const desktopTitle = document.createElement('h3');
  desktopTitle.textContent = '💻 Desktop Experience';
  desktopTitle.style.cssText = 'color: #1d4ed8; margin-top: 0;';
  desktopSection.appendChild(desktopTitle);

  const desktopProduct = ProductDetail({
    title: 'Desktop Product Experience',
    content:
      'Great side-by-side layout with sticky purchase section on larger screens.',
    images: sampleImages,
    price: '599.99',
    priceHighlighted: true,
    category: 'Desktop',
    tags: ['Professional', 'Feature-Rich'],
    specifications: {
      Processor: 'M2 Pro',
      Memory: '16GB',
      Storage: '512GB',
      Display: '14.2-inch',
    },
    priceInfo: 'Professional pricing',
    buttonText: 'Add to Cart',
    additionalButtons: [
      {
        text: 'Compare',
        variant: 'secondary',
        onClick: () => alert('Compare products'),
      },
    ],
    onClick: () => alert('Desktop purchase!'),
  });

  desktopSection.appendChild(desktopProduct.getElement());

  comparisonGrid.appendChild(mobileSection);
  comparisonGrid.appendChild(desktopSection);
  container.appendChild(comparisonGrid);

  // Benefits section
  const benefits = document.createElement('div');
  benefits.style.cssText = `
    background: #fefce8;
    border: 2px solid #ca8a04;
    border-radius: 12px;
    padding: 20px;
    margin-top: 20px;
  `;
  benefits.innerHTML = `
    <h3 style="margin-top: 0; color: #92400e;">🚀 Key Improvements</h3>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
      <div>
        <h4 style="color: #92400e;">Mobile UX</h4>
        <ul>
          <li>Price visible without scrolling</li>
          <li>Buy button in thumb reach</li>
          <li>Faster purchase decisions</li>
          <li>Better conversion rates</li>
        </ul>
      </div>
      <div>
        <h4 style="color: #92400e;">Desktop UX</h4>
        <ul>
          <li>Sticky purchase section</li>
          <li>Side-by-side layout</li>
          <li>More detailed specifications</li>
          <li>Professional appearance</li>
        </ul>
      </div>
    </div>
  `;
  container.appendChild(benefits);

  return container;
};
