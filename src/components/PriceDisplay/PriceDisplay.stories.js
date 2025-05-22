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
};

export const Default = () => {
  return PriceDisplay({
    label: 'Price:',
    value: '€29.99',
  });
};

export const Loading = () => {
  return PriceDisplay({
    label: 'Price:',
    value: 'Loading price...',
    isLoading: true,
  });
};

export const Highlighted = () => {
  return PriceDisplay({
    label: 'Price:',
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
    label: 'Price:',
    value: 'Select options to see price',
    isPlaceholder: true, // Mark as placeholder to apply the same styling as loading
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

// Let's add a new story to show the error state
export const ErrorState = () => {
  return PriceDisplay({
    label: 'Price:',
    value: 'Error loading price',
    isError: true,
  });
};
