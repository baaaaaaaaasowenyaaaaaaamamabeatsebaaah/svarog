// src/components/ConditionSelector/ConditionSelector.stories.js
import ConditionSelector from './ConditionSelector.js';

export default {
  title: 'Components/ConditionSelector',
  component: ConditionSelector,
  parameters: {
    docs: {
      description: {
        component:
          'A component for selecting device conditions with visual indicators.',
      },
    },
  },
};

// Sample condition data with default icons
const sampleConditions = [
  {
    id: 1,
    name: 'New',
    description:
      'Device is brand new, still in original packaging or barely used with no visible signs of wear.',
  },
  {
    id: 2,
    name: 'Good',
    description:
      'Device is in good condition with minor signs of wear. Fully functional without any issues.',
  },
  {
    id: 3,
    name: 'Fair',
    description:
      'Device shows visible signs of use but remains fully functional. May have minor scratches or dents.',
  },
  {
    id: 4,
    name: 'Poor',
    description:
      'Device has significant wear and tear. May have cracks or serious cosmetic damage but still functions.',
  },
];

// Sample conditions with custom icons
const conditionsWithCustomIcons = [
  {
    id: 1,
    name: 'New',
    description: 'Brand new condition',
    icon: '🌟', // Custom emoji
  },
  {
    id: 2,
    name: 'Good',
    description: 'Good condition',
    icon: '✅', // Custom emoji
  },
  {
    id: 3,
    name: 'Fair',
    description: 'Fair condition',
    svgIcon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`, // SVG icon
  },
  {
    id: 4,
    name: 'Poor',
    description: 'Poor condition',
    imageUrl: 'https://picsum.photos/28/28?random=1', // Image icon
  },
];

// Basic story with default options
export const Default = () => {
  return ConditionSelector({
    conditions: sampleConditions,
    onChange: (conditionId) => console.log('Selected condition:', conditionId),
  });
};

// Story with a preselected condition
export const WithSelectedCondition = () => {
  return ConditionSelector({
    conditions: sampleConditions,
    selectedId: '2', // Good condition selected
    onChange: (conditionId) => console.log('Selected condition:', conditionId),
  });
};

// Story with custom icons
export const WithCustomIcons = () => {
  return ConditionSelector({
    conditions: conditionsWithCustomIcons,
    onChange: (conditionId) => console.log('Selected condition:', conditionId),
  });
};

// Story without icons
export const WithoutIcons = () => {
  return ConditionSelector({
    conditions: sampleConditions,
    showIcons: false,
    onChange: (conditionId) => console.log('Selected condition:', conditionId),
  });
};

// Story with loading state
export const LoadingState = () => {
  return ConditionSelector({
    conditions: sampleConditions,
    loading: true,
    onChange: (conditionId) => console.log('Selected condition:', conditionId),
  });
};

// Story showing icon toggle functionality
export const ToggleIcons = () => {
  const container = document.createElement('div');
  container.style.maxWidth = '600px';

  // Add toggle button
  const toggleButton = document.createElement('button');
  toggleButton.textContent = 'Toggle Icons';
  toggleButton.style.marginBottom = '16px';
  toggleButton.style.padding = '8px 16px';
  toggleButton.style.border = '1px solid #ccc';
  toggleButton.style.borderRadius = '4px';
  toggleButton.style.cursor = 'pointer';

  // Create condition selector
  const conditionSelector = ConditionSelector({
    conditions: conditionsWithCustomIcons,
    onChange: (conditionId) => console.log('Selected condition:', conditionId),
  });

  let iconsVisible = true;
  toggleButton.onclick = () => {
    iconsVisible = !iconsVisible;
    conditionSelector.setShowIcons(iconsVisible);
    toggleButton.textContent = iconsVisible ? 'Hide Icons' : 'Show Icons';
  };

  container.appendChild(toggleButton);
  container.appendChild(conditionSelector.getElement());

  return container;
};

// Story with mixed icon types
export const MixedIconTypes = () => {
  const mixedConditions = [
    {
      id: 1,
      name: 'Premium',
      description: 'Premium quality',
      icon: '💎', // Emoji icon
    },
    {
      id: 2,
      name: 'Standard',
      description: 'Standard quality',
      // No icon specified - will use default based on name
    },
    {
      id: 3,
      name: 'Custom SVG',
      description: 'With custom SVG icon',
      svgIcon:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
    },
    {
      id: 4,
      name: 'With Image',
      description: 'Custom image icon',
      imageUrl: 'https://picsum.photos/28/28?random=2',
    },
  ];

  return ConditionSelector({
    conditions: mixedConditions,
    onChange: (conditionId) => console.log('Selected condition:', conditionId),
  });
};

// Story showing all states
export const AllStates = () => {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '32px';

  // Regular state with icons
  const regularContainer = document.createElement('div');
  const regularTitle = document.createElement('h3');
  regularTitle.textContent = 'With Icons';
  regularContainer.appendChild(regularTitle);

  const regularSelector = ConditionSelector({
    conditions: sampleConditions,
    onChange: (id) => console.log('Selected:', id),
  });
  regularContainer.appendChild(regularSelector.getElement());

  // Without icons
  const noIconsContainer = document.createElement('div');
  const noIconsTitle = document.createElement('h3');
  noIconsTitle.textContent = 'Without Icons';
  noIconsContainer.appendChild(noIconsTitle);

  const noIconsSelector = ConditionSelector({
    conditions: sampleConditions,
    showIcons: false,
    onChange: (id) => console.log('Selected:', id),
  });
  noIconsContainer.appendChild(noIconsSelector.getElement());

  // Custom icons
  const customContainer = document.createElement('div');
  const customTitle = document.createElement('h3');
  customTitle.textContent = 'Custom Icons';
  customContainer.appendChild(customTitle);

  const customSelector = ConditionSelector({
    conditions: conditionsWithCustomIcons,
    selectedId: '2',
    onChange: (id) => console.log('Selected:', id),
  });
  customContainer.appendChild(customSelector.getElement());

  // Add all containers
  container.appendChild(regularContainer);
  container.appendChild(noIconsContainer);
  container.appendChild(customContainer);

  return container;
};

export const Interactive = () => {
  // Create container for demonstration
  const container = document.createElement('div');
  container.style.maxWidth = '600px';

  // Add title
  const title = document.createElement('h3');
  title.textContent = 'Device Condition Selection';
  title.style.marginBottom = '16px';
  container.appendChild(title);

  // Add description
  const description = document.createElement('p');
  description.textContent =
    'Select a condition to see the selection state update.';
  description.style.marginBottom = '24px';
  container.appendChild(description);

  // Create output display for selection feedback
  const output = document.createElement('div');
  output.style.marginTop = '24px';
  output.style.padding = '12px';
  output.style.backgroundColor = '#f8f9fa';
  output.style.border = '1px solid #dee2e6';
  output.innerHTML = '<strong>Selected Condition:</strong> None';

  // Create condition selector
  const conditionSelector = ConditionSelector({
    conditions: sampleConditions,
    onChange: (conditionId) => {
      const selectedCondition = sampleConditions.find(
        (c) => c.id.toString() === conditionId.toString()
      );
      output.innerHTML = `
        <strong>Selected Condition:</strong> ${selectedCondition.name}<br>
        <strong>Description:</strong> ${selectedCondition.description}<br>
        <strong>ID:</strong> ${selectedCondition.id}
      `;
    },
  });

  container.appendChild(conditionSelector.getElement());
  container.appendChild(output);

  return container;
};

// Story with custom styling (RESTORED)
export const CustomStyling = () => {
  const container = document.createElement('div');
  container.style.maxWidth = '600px';

  // Add custom styles
  const style = document.createElement('style');
  style.textContent = `
    .custom-condition-selector .condition-option__label {
      border: 1px solid #e2e8f0;
      transition: all 0.3s ease;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }

    .custom-condition-selector .condition-option__label:hover {
      border-color: #3182ce;
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    .custom-condition-selector .condition-option--selected .condition-option__label {
      border-color: #3182ce;
      background-color: #ebf8ff;
    }

    .custom-condition-selector .condition-option__title {
      font-size: 18px;
      margin-bottom: 8px;
    }

    .custom-condition-selector .condition-option__description {
      line-height: 1.5;
    }
  `;
  container.appendChild(style);

  // Create condition selector with custom class
  const conditionSelector = ConditionSelector({
    conditions: sampleConditions,
    className: 'custom-condition-selector',
    onChange: (id) => console.log('Selected:', id),
  });

  container.appendChild(conditionSelector.getElement());

  return container;
};
