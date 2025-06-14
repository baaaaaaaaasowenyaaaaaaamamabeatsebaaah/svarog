// src/components/PriceDisplay/PriceDisplay.stories.js
import PriceDisplay from './PriceDisplay.js';

export default {
  title: 'Components/PriceDisplay',
  component: PriceDisplay,
  parameters: {
    docs: {
      description: {
        component:
          'A component for displaying price information with various states.',
      },
    },
  },
  argTypes: {
    loading: {
      control: 'boolean',
      description: 'Whether the price is loading',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
      },
    },
    isLoading: {
      control: 'boolean',
      description: 'DEPRECATED: Use loading instead',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
      },
    },
  },
};

export const Default = () => {
  return PriceDisplay({
    value: '€29.99',
  });
};

export const WithLabel = () => {
  return PriceDisplay({
    label: 'Price:',
    value: '€29.99',
  });
};

export const Loading = () => {
  return PriceDisplay({
    value: 'Loading price...',
    loading: true,
  });
};

export const Highlighted = () => {
  return PriceDisplay({
    value: '€29.99',
    isHighlighted: true,
  });
};

export const WithCustomLabel = () => {
  return PriceDisplay({
    label: 'Total Amount:',
    value: '€129.99',
    isHighlighted: true,
  });
};

export const DynamicUpdate = () => {
  // Create container for demonstration
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '20px';

  // Initial price display with placeholder
  const priceDisplay = PriceDisplay({
    value: 'Select options to see price',
    isPlaceholder: true,
  });

  container.appendChild(priceDisplay.getElement());

  // Create controls
  const controls = document.createElement('div');
  controls.style.display = 'flex';
  controls.style.gap = '10px';

  // Load price button
  const loadButton = document.createElement('button');
  loadButton.textContent = 'Load Price';
  loadButton.onclick = () => {
    // Set loading state
    priceDisplay
      .setValue('Loading price...')
      .setLoading(true)
      .setPlaceholder(false);

    // Simulate API call
    setTimeout(() => {
      priceDisplay.setValue('€49.99', true, false).setLoading(false);
    }, 1500);
  };

  // Reset button
  const resetButton = document.createElement('button');
  resetButton.textContent = 'Reset';
  resetButton.onclick = () => {
    priceDisplay
      .setValue('Select options to see price', false, true)
      .setLoading(false);
  };

  controls.appendChild(loadButton);
  controls.appendChild(resetButton);
  container.appendChild(controls);

  return container;
};

export const DifferentPrices = () => {
  // Create container for multiple price displays
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '15px';
  container.style.width = '300px';

  // Add heading
  const heading = document.createElement('h3');
  heading.textContent = 'Product Pricing Options';
  heading.style.marginBottom = '10px';
  container.appendChild(heading);

  // Create different price displays
  const regularPrice = PriceDisplay({
    label: 'Regular Price:',
    value: '€99.99',
  });

  const salePrice = PriceDisplay({
    label: 'Sale Price:',
    value: '€79.99',
    isHighlighted: true,
  });

  const memberPrice = PriceDisplay({
    label: 'Member Price:',
    value: '€69.99',
    isHighlighted: true,
  });

  const shippingPrice = PriceDisplay({
    label: 'Shipping:',
    value: '€4.99',
  });

  // Add price displays to container
  container.appendChild(regularPrice.getElement());
  container.appendChild(salePrice.getElement());
  container.appendChild(memberPrice.getElement());
  container.appendChild(shippingPrice.getElement());

  return container;
};

export const ErrorState = () => {
  return PriceDisplay({
    value: 'Error loading price',
    isError: true,
  });
};

export const ComparisonGrid = () => {
  // Create container for grid
  const container = document.createElement('div');
  container.style.display = 'grid';
  container.style.gridTemplateColumns = 'repeat(3, 1fr)';
  container.style.gap = '20px';
  container.style.padding = '20px';

  // Create price displays without labels
  const prices = [
    { value: '€29.99', isHighlighted: false },
    { value: '€49.99', isHighlighted: true },
    { value: '€79.99', isHighlighted: false },
  ];

  prices.forEach((priceConfig) => {
    const priceCard = document.createElement('div');
    priceCard.style.textAlign = 'center';
    priceCard.style.padding = '10px';
    priceCard.style.border = '1px solid #ddd';

    const priceDisplay = PriceDisplay(priceConfig);
    priceCard.appendChild(priceDisplay.getElement());

    container.appendChild(priceCard);
  });

  return container;
};
