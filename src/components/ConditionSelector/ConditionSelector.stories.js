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

// Sample condition data
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

// Basic story with default options
export const Default = () => {
  return new ConditionSelector({
    conditions: sampleConditions,
    onSelect: (conditionId) => console.log('Selected condition:', conditionId),
  });
};

// Story with a preselected condition
export const WithSelectedCondition = () => {
  return new ConditionSelector({
    conditions: sampleConditions,
    selectedId: '2', // Good condition selected
    onSelect: (conditionId) => console.log('Selected condition:', conditionId),
  });
};

// Story with loading state
export const LoadingState = () => {
  return new ConditionSelector({
    conditions: sampleConditions,
    isLoading: true,
    onSelect: (conditionId) => console.log('Selected condition:', conditionId),
  });
};

// Story with interactive selection
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
  const conditionSelector = new ConditionSelector({
    conditions: sampleConditions,
    onSelect: (conditionId) => {
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

// Display all the different conditions with different states
export const AllStates = () => {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '32px';

  // Regular state
  const regularContainer = document.createElement('div');
  const regularTitle = document.createElement('h3');
  regularTitle.textContent = 'Regular State';
  regularContainer.appendChild(regularTitle);

  const regularSelector = new ConditionSelector({
    conditions: sampleConditions,
    onSelect: (id) => console.log('Selected:', id),
  });
  regularContainer.appendChild(regularSelector.getElement());

  // Selected state
  const selectedContainer = document.createElement('div');
  const selectedTitle = document.createElement('h3');
  selectedTitle.textContent = 'With Selection';
  selectedContainer.appendChild(selectedTitle);

  const selectedSelector = new ConditionSelector({
    conditions: sampleConditions,
    selectedId: '3', // Fair condition
    onSelect: (id) => console.log('Selected:', id),
  });
  selectedContainer.appendChild(selectedSelector.getElement());

  // Loading state
  const loadingContainer = document.createElement('div');
  const loadingTitle = document.createElement('h3');
  loadingTitle.textContent = 'Loading State';
  loadingContainer.appendChild(loadingTitle);

  const loadingSelector = new ConditionSelector({
    conditions: sampleConditions,
    isLoading: true,
    onSelect: (id) => console.log('Selected:', id),
  });
  loadingContainer.appendChild(loadingSelector.getElement());

  // Empty state
  const emptyContainer = document.createElement('div');
  const emptyTitle = document.createElement('h3');
  emptyTitle.textContent = 'Empty State';
  emptyContainer.appendChild(emptyTitle);

  const emptySelector = new ConditionSelector({
    conditions: [],
    onSelect: (id) => console.log('Selected:', id),
  });
  emptyContainer.appendChild(emptySelector.getElement());

  // Add all containers
  container.appendChild(regularContainer);
  container.appendChild(selectedContainer);
  container.appendChild(loadingContainer);
  container.appendChild(emptyContainer);

  return container;
};

// Story with custom styling
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
  const conditionSelector = new ConditionSelector({
    conditions: sampleConditions,
    className: 'custom-condition-selector',
    onSelect: (id) => console.log('Selected:', id),
  });

  container.appendChild(conditionSelector.getElement());

  return container;
};
