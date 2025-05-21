# UsedPhonePriceForm Component

The UsedPhonePriceForm component provides a multi-step interface for users to select a phone manufacturer, device model, and condition to get a buyback price estimate.

## Usage

### Recommended: Using the Factory

The easiest way to create a UsedPhonePriceForm is through the factory:

```javascript
import { UsedPhonePriceFormFactory } from '@svarog-ui/core';

// Create a form with real API service
const form = UsedPhonePriceFormFactory.createStandard({
  onPriceChange: (priceData) => console.log('Price updated:', priceData),
  onSubmit: (formData) => console.log('Form submitted:', formData),
});

// Add to DOM
document.body.appendChild(form.getElement());
```

### For Testing/Development: With Mock Data

```javascript
import { UsedPhonePriceFormFactory } from '@svarog-ui/core';
import { mockPhoneBuybackData } from '../__mocks__/phoneBuybackData.js';

// Create a form with mock data
const form = UsedPhonePriceFormFactory.createWithMockData({
  mockData: mockPhoneBuybackData,
  onPriceChange: (priceData) => console.log('Price updated:', priceData),
  onSubmit: (formData) => console.log('Form submitted:', formData),
  mockDelay: 300, // Simulated API delay in milliseconds
});

// Add to DOM
document.body.appendChild(form.getElement());
```

### Advanced Usage: Direct Component Creation

#### Presentation Component

```javascript
import { UsedPhonePriceForm } from '@svarog-ui/core';

// Create a simple form with callbacks
const buybackForm = UsedPhonePriceForm({
  onManufacturerChange: (manufacturerId) =>
    console.log('Manufacturer selected:', manufacturerId),
  onDeviceChange: (deviceId) => console.log('Device selected:', deviceId),
  onConditionChange: (conditionId) =>
    console.log('Condition selected:', conditionId),
  onSubmit: (formData) => console.log('Form submitted:', formData),
});

// Add to DOM
document.body.appendChild(buybackForm.getElement());

// Later, update the form with data
buybackForm.setManufacturers([
  { id: '1', name: 'Apple' },
  { id: '2', name: 'Samsung' },
  { id: '3', name: 'Google' },
]);
```

#### With Container

```javascript
import { UsedPhonePriceFormContainer } from '@svarog-ui/core';
import PhoneBuybackService from './services/PhoneBuybackService';

// Create a service that fetches data
const service = new PhoneBuybackService({ baseUrl: 'https://api.example.com' });

// Create the container component
const formContainer = UsedPhonePriceFormContainer({
  service,
  onPriceChange: (price) => console.log('Price updated:', price),
  onSubmit: (formData) => console.log('Form submitted:', formData),
});

// Add to DOM
document.body.appendChild(formContainer.getElement());
```

## Props

### UsedPhonePriceForm Props

| Prop                 | Type     | Default | Description                                    |
| -------------------- | -------- | ------- | ---------------------------------------------- |
| manufacturers        | Array    | []      | Array of manufacturer objects                  |
| devices              | Array    | []      | Array of device objects                        |
| conditions           | Array    | []      | Array of condition objects                     |
| selectedManufacturer | string   | ""      | ID of selected manufacturer                    |
| selectedDevice       | string   | ""      | ID of selected device                          |
| selectedCondition    | string   | ""      | ID of selected condition                       |
| currentPrice         | Object   | null    | Current price data object                      |
| loading              | Object   | {}      | Loading states for different parts of the form |
| error                | Object   | {}      | Error states for different parts of the form   |
| labels               | Object   | {}      | Text labels to customize UI (see below)        |
| className            | string   | ""      | Additional CSS class names                     |
| showStepsIndicator   | boolean  | true    | Whether to show the step indicator             |
| onManufacturerChange | Function | null    | Callback when manufacturer changes             |
| onDeviceChange       | Function | null    | Callback when device changes                   |
| onConditionChange    | Function | null    | Callback when condition changes                |
| onSubmit             | Function | null    | Callback when form is submitted                |

### UsedPhonePriceFormContainer Options

| Option             | Type     | Default | Description                                |
| ------------------ | -------- | ------- | ------------------------------------------ |
| service            | Object   | -       | Service object with API methods (required) |
| onPriceChange      | Function | null    | Callback when price updates                |
| onSubmit           | Function | null    | Callback when form is submitted            |
| labels             | Object   | {}      | Text labels to customize UI                |
| className          | string   | ""      | Additional CSS class names                 |
| showStepsIndicator | boolean  | true    | Whether to show step indicator             |

### UsedPhonePriceFormFactory Options

| Option             | Type     | Description                                        |
| ------------------ | -------- | -------------------------------------------------- |
| onPriceChange      | Function | Callback when price updates                        |
| onSubmit           | Function | Callback when form is submitted                    |
| labels             | Object   | Text labels to customize UI                        |
| className          | string   | Additional CSS class names                         |
| showStepsIndicator | boolean  | Whether to show step indicator                     |
| apiOptions         | Object   | API configuration (for createStandard)             |
| mockData           | Object   | Mock data structure (for createWithMockData)       |
| mockDelay          | number   | Simulated API delay in ms (for createWithMockData) |
| service            | Object   | Custom service object (for createWithMockService)  |

### Available Label Options

```javascript
{
  manufacturerStep: 'Hersteller',               // Label for manufacturer step
  deviceStep: 'Modell',                         // Label for device step
  conditionStep: 'Zustand',                     // Label for condition step
  manufacturerPlaceholder: 'Hersteller auswählen', // Placeholder for manufacturer select
  devicePlaceholder: 'Zuerst Hersteller auswählen', // Placeholder for device select
  initialPriceText: 'Bitte wählen Sie Hersteller, Modell und Zustand', // Initial price text
  loadingPriceText: 'Preis wird geladen...',    // Price loading text
  priceLabel: 'Unser Angebot:',                 // Label for price display
  priceNotAvailable: 'Preis nicht verfügbar',   // Price not available text
  deviceLoadError: 'Fehler beim Laden der Geräte', // Device loading error message
  actionLoadError: 'Fehler beim Laden der Services', // Action loading error message
  priceLoadError: 'Fehler beim Laden des Preises',   // Price loading error message
  submitButtonText: 'Verkaufen',                // Submit button text
  submitButtonLoadingText: 'Wird verarbeitet...', // Submit button loading text
  conditionNewLabel: 'Neu',                     // Label for new condition
  conditionGoodLabel: 'Gut',                    // Label for good condition
  conditionFairLabel: 'Akzeptabel',             // Label for fair condition
  conditionPoorLabel: 'Beschädigt',             // Label for poor condition
}
```

### Expected Service Interface

The service object passed to UsedPhonePriceFormContainer should implement:

```javascript
{
  fetchManufacturers: () => Promise<Array>,     // Get all manufacturers
  fetchDevices: (manufacturerId) => Promise<Array>, // Get devices for manufacturer
  fetchConditions: (deviceId) => Promise<Array>,   // Get conditions for device
  fetchPrice: (conditionId) => Promise<Object>     // Get price for condition
}
```

### Expected Mock Data Structure

The mockData structure provided to UsedPhonePriceFormFactory.createWithMockData should follow:

```javascript
{
  manufacturers: [
    {
      id: 1,
      name: 'Apple',
      devices: [
        {
          id: 1,
          name: 'iPhone 13',
          manufacturerId: 1,
          conditions: [
            {
              id: 1,
              name: 'Neu',
              description: 'Wie neu, ohne Gebrauchsspuren',
              deviceId: 1,
              prices: [
                {
                  id: 1,
                  price: 499,  // in whole euros or cents
                  conditionId: 1,
                },
              ],
            },
            // more conditions...
          ],
        },
        // more devices...
      ],
    },
    // more manufacturers...
  ],
}
```

## Methods

### UsedPhonePriceForm Methods

#### getElement()

Returns the form DOM element.

```javascript
const formElement = buybackForm.getElement();
```

#### setManufacturers(manufacturers)

Updates the manufacturers list.

```javascript
buybackForm.setManufacturers([
  { id: '1', name: 'Apple' },
  { id: '2', name: 'Samsung' },
]);
```

#### setDevices(devices)

Updates the devices list.

```javascript
buybackForm.setDevices([
  { id: '1', name: 'iPhone 13' },
  { id: '2', name: 'iPhone 14' },
]);
```

#### setConditions(conditions)

Updates the conditions list.

```javascript
buybackForm.setConditions([
  { id: '1', name: 'Neu', description: 'Wie neu, ohne Gebrauchsspuren' },
  { id: '2', name: 'Gut', description: 'Leichte Gebrauchsspuren' },
]);
```

#### setPrice(price)

Updates the price data.

```javascript
buybackForm.setPrice({
  price: 29900, // in cents
  deviceName: 'iPhone 13',
  conditionName: 'Neu',
});
```

#### setLoading(loading)

Updates loading states.

```javascript
buybackForm.setLoading({
  manufacturers: false,
  devices: true,
  conditions: false,
  price: false,
  submit: false,
});
```

#### setErrors(error)

Updates error states.

```javascript
buybackForm.setErrors({
  devices: 'Failed to load devices',
});
```

#### setState(newState)

Updates multiple form state properties efficiently.

```javascript
buybackForm.setState({
  selectedManufacturer: '1',
  manufacturers: [...],
  priceDisplayText: 'Loading...',
});
```

#### update(props)

Updates multiple component properties at once.

```javascript
buybackForm.update({
  manufacturers: newManufacturers,
  selectedManufacturer: '1',
  className: 'custom-form',
});
```

#### destroy()

Cleans up resources. Call before removing from DOM.

```javascript
buybackForm.destroy();
```

### UsedPhonePriceFormContainer Methods

#### getElement()

Returns the form DOM element.

```javascript
const formElement = formContainer.getElement();
```

#### destroy()

Cleans up resources. Call before removing from DOM.

```javascript
formContainer.destroy();
```

## Customization

### Custom Labels

```javascript
const customLabels = {
  manufacturerStep: 'Brand',
  deviceStep: 'Model',
  conditionStep: 'Condition',
  manufacturerPlaceholder: 'Select brand',
  devicePlaceholder: 'First select a brand',
  initialPriceText: 'Please complete all selections to see price',
  loadingPriceText: 'Loading price...',
  priceLabel: 'Our offer:',
  submitButtonText: 'Sell now',
  conditionNewLabel: 'Like new',
  conditionGoodLabel: 'Good',
  conditionFairLabel: 'Fair',
  conditionPoorLabel: 'Damaged',
};

const form = UsedPhonePriceFormFactory.createStandard({
  labels: customLabels,
  // other options...
});
```

### CSS Customization

The UsedPhonePriceForm appearance can be customized using CSS variables:

```css
:root {
  /* Form layout */
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-12: 3rem;

  /* Colors */
  --color-bg-transparent: rgba(255, 255, 255, 0.8);
  --color-brand-primary: #4299e1;
  --color-brand-primary-light: #63b3ed;
  --color-danger-light: #f56565;
  --color-text: #2d3748;

  /* Typography */
  --font-family-base: system-ui, -apple-system, sans-serif;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
}
```

## Examples

### Using UsedPhonePriceFormFactory

```javascript
import { UsedPhonePriceFormFactory } from '@svarog-ui/core';
import { mockPhoneBuybackData } from './__mocks__/phoneBuybackData';

// Create form with mock data for development
const form = UsedPhonePriceFormFactory.createWithMockData({
  mockData: mockPhoneBuybackData,
  mockDelay: 300,
  onPriceChange: (priceData) => {
    console.log(`Buyback price: €${(priceData.price / 100).toFixed(2)}`);
    document.getElementById('summary-price').textContent =
      `€${(priceData.price / 100).toFixed(2)}`;
  },
  onSubmit: (formData) => {
    console.log('Submitted form:', formData);
    // Navigate to confirmation page
    window.location.href = `/sell-confirmation?data=${btoa(JSON.stringify(formData))}`;
  },
  labels: {
    manufacturerStep: 'Brand',
    deviceStep: 'Model',
    conditionStep: 'Condition',
    submitButtonText: 'Sell Device',
  },
});

document
  .getElementById('buyback-form-container')
  .appendChild(form.getElement());
```

### Complete Workflow With Real API

```javascript
import { UsedPhonePriceFormFactory } from '@svarog-ui/core';

// Create form with real API endpoints
const form = UsedPhonePriceFormFactory.createStandard({
  apiOptions: {
    baseUrl: '/api/buyback/v1', // Override default API base URL
  },
  onPriceChange: (priceData) => {
    // Update buyback summary
    updateSummary(priceData);
  },
  onSubmit: async (formData) => {
    try {
      // Show loading state
      showLoadingOverlay();

      // Submit to booking API
      const response = await fetch('/api/sell-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create sell request');
      }

      const result = await response.json();

      // Navigate to confirmation page
      window.location.href = `/sell-confirmation?requestId=${result.id}`;
    } catch (error) {
      // Handle error
      hideLoadingOverlay();
      showErrorMessage('Failed to submit request: ' + error.message);
    }
  },
  labels: {
    submitButtonText: 'Sell Device',
  },
});

// Add to page
document
  .getElementById('buyback-form-container')
  .appendChild(form.getElement());

// Helper functions for the example
function updateSummary(priceData) {
  const summaryEl = document.getElementById('buyback-summary');
  summaryEl.innerHTML = `
    <h3>Buyback Summary</h3>
    <p><strong>Device:</strong> ${priceData.deviceName || 'Not selected'}</p>
    <p><strong>Condition:</strong> ${priceData.conditionName || 'Not selected'}</p>
    <p><strong>Our Offer:</strong> €${(priceData.price / 100).toFixed(2)}</p>
  `;
}

function showLoadingOverlay() {
  // Implementation details...
}

function hideLoadingOverlay() {
  // Implementation details...
}

function showErrorMessage(message) {
  // Implementation details...
}
```

## Accessibility

The UsedPhonePriceForm component implements these accessibility features:

- Proper form structure with semantic HTML elements
- Step indicator with ARIA roles and labels
- Proper focus management between steps
- Form validation with clear error messages
- Accessibility attributes on all interactive elements

## Browser Support

The UsedPhonePriceForm component is compatible with:

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome for Android)
