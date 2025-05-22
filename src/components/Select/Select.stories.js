// src/components/Select/Select.stories.js
import Select from './Select.js';

export default {
  title: 'Components/Select',
  component: Select,
};

// Common options for examples
const countryOptions = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'mx', label: 'Mexico' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'fr', label: 'France' },
  { value: 'de', label: 'Germany' },
  { value: 'jp', label: 'Japan' },
  { value: 'cn', label: 'China' },
  { value: 'in', label: 'India' },
  { value: 'br', label: 'Brazil' },
];

// Mock API functions for examples
const mockAPIDelay = (data, delay = 1500) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

const fetchCountries = () => mockAPIDelay(countryOptions);
const fetchCities = (countryCode) => {
  const cities = {
    us: [
      { value: 'nyc', label: 'New York' },
      { value: 'la', label: 'Los Angeles' },
      { value: 'chi', label: 'Chicago' },
    ],
    ca: [
      { value: 'tor', label: 'Toronto' },
      { value: 'van', label: 'Vancouver' },
      { value: 'mon', label: 'Montreal' },
    ],
    de: [
      { value: 'ber', label: 'Berlin' },
      { value: 'mun', label: 'Munich' },
      { value: 'ham', label: 'Hamburg' },
    ],
  };
  return mockAPIDelay(cities[countryCode] || []);
};

// Default select without validation styling
export const Default = () => {
  const container = document.createElement('div');

  const description = document.createElement('p');
  description.textContent = 'Default select with no validation state';
  description.style.marginBottom = '8px';
  container.appendChild(description);

  const select = Select({
    options: countryOptions,
    placeholder: 'Select a country',
    onChange: (event, value) => console.log('Selected value:', value),
    showValidation: false,
  });

  container.appendChild(select.getElement());
  return container;
};

// Pre-selected value select
export const WithValue = () => {
  const container = document.createElement('div');

  const description = document.createElement('p');
  description.textContent =
    'Select with pre-selected value (no validation styling)';
  description.style.marginBottom = '8px';
  container.appendChild(description);

  const select = Select({
    options: countryOptions,
    value: 'fr',
    onChange: (event, value) => console.log('Selected value:', value),
    showValidation: false,
  });

  container.appendChild(select.getElement());
  return container;
};

// Loading state
export const LoadingState = () => {
  const container = document.createElement('div');

  const description = document.createElement('p');
  description.textContent = 'Select in loading state';
  description.style.marginBottom = '8px';
  container.appendChild(description);

  const select = Select({
    options: [],
    loading: true,
    loadingText: 'Loading countries...',
    placeholder: 'Select a country',
    showValidation: false,
  });

  container.appendChild(select.getElement());
  return container;
};

// Empty state (no options, not loading)
export const EmptyState = () => {
  const container = document.createElement('div');

  const description = document.createElement('p');
  description.textContent = 'Select with no options available';
  description.style.marginBottom = '8px';
  container.appendChild(description);

  const select = Select({
    options: [],
    emptyText: 'No countries available',
    placeholder: 'Select a country',
    showValidation: false,
  });

  container.appendChild(select.getElement());
  return container;
};

// Auto-loading select
export const AutoLoading = () => {
  const container = document.createElement('div');

  const description = document.createElement('p');
  description.textContent =
    'Select that automatically loads options on creation';
  description.style.marginBottom = '8px';
  container.appendChild(description);

  const select = Select({
    placeholder: 'Select a country',
    loadingText: 'Loading countries...',
    emptyText: 'Failed to load countries',
    onLoadOptions: fetchCountries,
    onChange: (event, value) => console.log('Selected value:', value),
    showValidation: false,
  });

  container.appendChild(select.getElement());
  return container;
};

// Manual loading with button
export const ManualLoading = () => {
  const container = document.createElement('div');

  const description = document.createElement('p');
  description.textContent = 'Select with manual loading control';
  description.style.marginBottom = '8px';
  container.appendChild(description);

  const select = Select({
    options: [],
    placeholder: 'Click "Load Options" to populate',
    loadingText: 'Loading countries...',
    emptyText: 'No options loaded yet',
    showValidation: false,
  });

  const loadButton = document.createElement('button');
  loadButton.textContent = 'Load Options';
  loadButton.style.marginTop = '10px';
  loadButton.style.marginRight = '10px';
  loadButton.addEventListener('click', async () => {
    try {
      await select.loadOptions(fetchCountries);
      console.log('Options loaded successfully');
    } catch (error) {
      console.error('Failed to load options:', error);
    }
  });

  const clearButton = document.createElement('button');
  clearButton.textContent = 'Clear Options';
  clearButton.style.marginTop = '10px';
  clearButton.addEventListener('click', () => {
    select.updateOptions([]);
  });

  container.appendChild(select.getElement());
  container.appendChild(loadButton);
  container.appendChild(clearButton);
  return container;
};

// Dependent selects (country -> cities)
export const DependentSelects = () => {
  const container = document.createElement('div');

  const description = document.createElement('p');
  description.textContent = 'Country and city selects with dependency';
  description.style.marginBottom = '8px';
  container.appendChild(description);

  // Country select
  const countryLabel = document.createElement('label');
  countryLabel.textContent = 'Country:';
  countryLabel.style.display = 'block';
  countryLabel.style.marginBottom = '5px';
  countryLabel.style.fontWeight = 'bold';

  const countrySelect = Select({
    placeholder: 'Select a country',
    loadingText: 'Loading countries...',
    onLoadOptions: fetchCountries,
    onChange: async (event, countryCode) => {
      if (countryCode) {
        try {
          await citySelect.loadOptions(() => fetchCities(countryCode));
          citySelect.update({ disabled: false });
        } catch (error) {
          console.error('Failed to load cities:', error);
          citySelect.updateOptions([]);
        }
      } else {
        citySelect.updateOptions([]);
        citySelect.update({ disabled: true });
      }
    },
    showValidation: false,
  });

  // City select
  const cityLabel = document.createElement('label');
  cityLabel.textContent = 'City:';
  cityLabel.style.display = 'block';
  cityLabel.style.marginBottom = '5px';
  cityLabel.style.marginTop = '15px';
  cityLabel.style.fontWeight = 'bold';

  const citySelect = Select({
    options: [],
    placeholder: 'Select a city',
    emptyText: 'Please select a country first',
    loadingText: 'Loading cities...',
    disabled: true,
    onChange: (event, value) => console.log('Selected city:', value),
    showValidation: false,
  });

  container.appendChild(countryLabel);
  container.appendChild(countrySelect.getElement());
  container.appendChild(cityLabel);
  container.appendChild(citySelect.getElement());
  return container;
};

// Error handling
export const WithErrorHandling = () => {
  const container = document.createElement('div');

  const description = document.createElement('p');
  description.textContent = 'Select with error handling (will fail to load)';
  description.style.marginBottom = '8px';
  container.appendChild(description);

  const statusDiv = document.createElement('div');
  statusDiv.style.marginTop = '10px';
  statusDiv.style.padding = '10px';
  statusDiv.style.backgroundColor = '#f5f5f5';
  statusDiv.style.borderRadius = '4px';
  statusDiv.textContent = 'Status: Ready to load';

  const select = Select({
    options: [],
    placeholder: 'Click button to trigger error',
    loadingText: 'Attempting to load...',
    emptyText: 'Failed to load options',
    showValidation: false,
  });

  const errorButton = document.createElement('button');
  errorButton.textContent = 'Trigger Load Error';
  errorButton.style.marginTop = '10px';
  errorButton.addEventListener('click', async () => {
    try {
      statusDiv.textContent = 'Status: Loading...';
      await select.loadOptions(async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        throw new Error('Network error - failed to fetch');
      });
    } catch (error) {
      statusDiv.textContent = `Status: Error - ${error.message}`;
      statusDiv.style.color = 'red';
    }
  });

  container.appendChild(select.getElement());
  container.appendChild(errorButton);
  container.appendChild(statusDiv);
  return container;
};

// Multiple selection with loading
export const MultipleWithLoading = () => {
  const container = document.createElement('div');

  const description = document.createElement('p');
  description.textContent = 'Multiple selection that loads options';
  description.style.marginBottom = '8px';
  container.appendChild(description);

  const select = Select({
    multiple: true,
    placeholder: 'Select multiple countries',
    loadingText: 'Loading countries...',
    onLoadOptions: fetchCountries,
    onChange: (event, values) => console.log('Selected values:', values),
    showValidation: false,
  });

  container.appendChild(select.getElement());
  return container;
};

// Original stories (updated to work with new API)

// Valid state select
export const ValidState = () => {
  const container = document.createElement('div');

  const description = document.createElement('p');
  description.textContent = 'Valid state select (green border)';
  description.style.marginBottom = '8px';
  container.appendChild(description);

  const select = Select({
    options: countryOptions,
    value: 'us',
    required: true,
    validationMessage: 'Valid selection',
    showValidation: true,
  });

  // Explicitly validate to show valid state
  select.validate();

  container.appendChild(select.getElement());
  return container;
};

// Invalid state select
export const InvalidState = () => {
  const container = document.createElement('div');

  const description = document.createElement('p');
  description.textContent = 'Invalid state select (red border)';
  description.style.marginBottom = '8px';
  container.appendChild(description);

  const select = Select({
    options: countryOptions,
    value: '', // Empty value for required field = invalid
    required: true,
    validationMessage: 'Please select a country',
    showValidation: true,
  });

  // Explicitly validate to show invalid state
  select.validate();

  container.appendChild(select.getElement());
  return container;
};

export const Required = () => {
  const container = document.createElement('div');

  const description = document.createElement('p');
  description.textContent =
    'Required select (default state, no validation styling until interaction)';
  description.style.marginBottom = '8px';
  container.appendChild(description);

  const select = Select({
    options: countryOptions,
    placeholder: 'Select a country (required)',
    required: true,
    onChange: (event, value) => console.log('Selected value:', value),
  });

  container.appendChild(select.getElement());
  return container;
};

export const Disabled = () => {
  const container = document.createElement('div');

  const description = document.createElement('p');
  description.textContent = 'Disabled select';
  description.style.marginBottom = '8px';
  container.appendChild(description);

  const select = Select({
    options: countryOptions,
    value: 'us',
    disabled: true,
    onChange: (event, value) => console.log('Selected value:', value),
  });

  container.appendChild(select.getElement());
  return container;
};

export const WithValidation = () => {
  const container = document.createElement('div');

  const description = document.createElement('p');
  description.textContent =
    'Interactive validation demo (click Validate button to see state change)';
  description.style.marginBottom = '8px';
  container.appendChild(description);

  const select = Select({
    options: countryOptions,
    placeholder: 'Select a country',
    required: true,
    validationMessage: 'Please select a country',
    onChange: (event, value) => console.log('Selected value:', value),
    showValidation: true,
  });

  const button = document.createElement('button');
  button.textContent = 'Validate';
  button.style.marginTop = '10px';
  button.addEventListener('click', () => {
    const isValid = select.validate();
    console.log('Is select valid?', isValid);
  });

  container.appendChild(select.getElement());
  container.appendChild(button);

  return container;
};

export const Multiple = () => {
  const container = document.createElement('div');

  const description = document.createElement('p');
  description.textContent = 'Multiple selection';
  description.style.marginBottom = '8px';
  container.appendChild(description);

  const select = Select({
    options: countryOptions,
    placeholder: 'Select countries',
    multiple: true,
    value: ['ca', 'fr'],
    onChange: (event, value) => console.log('Selected values:', value),
    showValidation: false,
  });

  container.appendChild(select.getElement());
  return container;
};

export const GroupedOptions = () => {
  const container = document.createElement('div');

  const description = document.createElement('p');
  description.textContent = 'Grouped options';
  description.style.marginBottom = '8px';
  container.appendChild(description);

  // Options with groups
  const groupedOptions = [
    { value: 'north-america', label: 'North America', disabled: true },
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'mx', label: 'Mexico' },

    { value: 'europe', label: 'Europe', disabled: true },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'fr', label: 'France' },
    { value: 'de', label: 'Germany' },

    { value: 'asia', label: 'Asia', disabled: true },
    { value: 'jp', label: 'Japan' },
    { value: 'cn', label: 'China' },
    { value: 'in', label: 'India' },
  ];

  const select = Select({
    options: groupedOptions,
    placeholder: 'Select a country',
    onChange: (event, value) => console.log('Selected value:', value),
    showValidation: false,
  });

  container.appendChild(select.getElement());
  return container;
};
