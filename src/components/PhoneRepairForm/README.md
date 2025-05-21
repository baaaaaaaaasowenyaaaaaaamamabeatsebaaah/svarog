### Creating a Custom Mock Service

````javascript
import { PhoneRepairFormFactory } from '@svarog-ui/core';

// Create custom mock service that simulates specific failures
const customMockService = {
  fetchManufacturers: () => {
    return Promise.resolve([
      { id: '1', name: 'Apple' },
      { id: '2', name: 'Samsung' },
      { id: '3', name: 'Huawei' },
    ]);
  },
  fetchDevices: (manufacturerId) => {
    // Simulate error when selecting Huawei
    if (manufacturerId === '3') {
      return Promise.reject(new Error('Server error when fetching devices'));
    }

    // Return different devices for different manufacturers
    if (manufacturerId === '1') {
      return Promise.resolve([
        { id: '1', name: 'iPhone 13' },
        { id: '2', name: 'iPhone 14' },
      ]);
    } else {
      return Promise.resolve([
        { id: '3', name: 'Galaxy S21' },
        { id: '4', name: 'Galaxy S22' },
      ]);
    }
  },
  fetchActions: (deviceId) => {
    return Promise.resolve([
      { id: '1', name: 'Display Repair' },
      { id: '2', name: 'Battery Replacement' },
    ]);
  },
  fetchPrice: (actionId) => {
    // Random delay to simulate network variability
    const delay = 300 + Math.random() * 500;

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          price: actionId === '1' ? 19900 : 8900,
          deviceName: 'Demo Device',
          actionName: actionId === '1' ? 'Display Repair' : 'Battery Replacement',
        });
      }, delay);
    });
  },
};

// Create form with custom mock service
const form = PhoneRepairFormFactory.createWithMockService({
  service: customMockService,
  onPriceChange: (price) => console.log('Price updated:', price),
  onScheduleClick: (repairInfo) => console.log('Repair scheduled:', repairInfo),
  labels: {
    deviceLoadError: 'Sorry, we encountered a problem loading devices. Please try another manufacturer.',
  },
});

// Add to demo container
document.getElementById('demo-container').appendChild(form.getElement());
```### Data Response Formats

**Manufacturers:**
```javascript
[
  { id: '1', name: 'Apple' },
  { id: '2', name: 'Samsung' }
]
````

**Devices:**

```javascript
[
  { id: '1', name: 'iPhone 13' },
  { id: '2', name: 'iPhone 14' },
];
```

**Actions:**

```javascript
[
  { id: '1', name: 'Display Repair' },
  { id: '2', name: 'Battery Replacement' },
];
```

**Price:**

````javascript
{
  price: 12900, // in cents, or 129.00 in decimal format
  // Optional additional info
  deviceName: "iPhone 13",
  actionName: "Display Repair",
  manufacturerName: "Apple"
}
```## Service Classes

### PhoneRepairService

Handles real API requests:

```javascript
import { PhoneRepairService } from '@svarog-ui/core';

const service = new PhoneRepairService({
  baseUrl: '/api/v2', // Default is '/api'
});

// Use service methods
const manufacturers = await service.fetchManufacturers();
const devices = await service.fetchDevices(manufacturerId);
const actions = await service.fetchActions(deviceId);
const price = await service.fetchPrice(actionId);
````

### MockPhoneRepairService

For development/testing environments:

````javascript
import { MockPhoneRepairService } from '@svarog-ui/core';
import { mockPhoneRepairData } from '../__mocks__/phoneRepairData';

const mockService = new MockPhoneRepairService(mockPhoneRepairData, 300);

// Use like a regular service
const manufacturers = await mockService.fetchManufacturers();
```## Factory Methods

### PhoneRepairFormFactory.createStandard(options)

Creates a form with a real API service.

```javascript
const form = PhoneRepairFormFactory.createStandard({
  onPriceChange,
  onScheduleClick,
  usedPhoneUrl,
  labels,
  apiOptions: { baseUrl: '/api/v2' },  // Override default API options
  className,
});
````

### PhoneRepairFormFactory.createWithMockData(options)

Creates a form with a mock service using provided data.

```javascript
const form = PhoneRepairFormFactory.createWithMockData({
  mockData, // Required - mock data structure
  mockDelay: 300, // Optional - artificial delay in milliseconds
  onPriceChange,
  onScheduleClick,
  usedPhoneUrl,
  labels,
  className,
});
```

### PhoneRepairFormFactory.createWithMockService(options)

Creates a form with a custom mock service for special test cases.

````javascript
// Create a custom mock service that simulates specific errors
const errorMockService = {
  fetchManufacturers: () => Promise.resolve([...]),
  fetchDevices: (id) => id === '3' ? Promise.reject(new Error('Network error')) : Promise.resolve([...]),
  fetchActions: () => Promise.resolve([...]),
  fetchPrice: () => Promise.resolve({ price: 99 }),
};

const form = PhoneRepairFormFactory.createWithMockService({
  service: errorMockService,
  onPriceChange,
  onScheduleClick,
  usedPhoneUrl,
  labels,
  className,
});
```# PhoneRepairForm Component

The PhoneRepairForm component provides a multi-step interface for users to select a phone manufacturer, device model, and repair service to get pricing information.

## Usage

### Recommended: Using PhoneRepairFormFactory

The easiest way to create a PhoneRepairForm is through the factory:

```javascript
import { PhoneRepairFormFactory } from '@svarog-ui/core';

// Create a form with real API service
const form = PhoneRepairFormFactory.createStandard({
  onPriceChange: (priceData) => console.log('Price updated:', priceData),
  onScheduleClick: (repairInfo) => console.log('Repair scheduled:', repairInfo),
  usedPhoneUrl: 'https://example.com/used-phones',
});

// Add to DOM
document.body.appendChild(form.getElement());
````

### For Testing/Development: With Mock Data

```javascript
import { PhoneRepairFormFactory } from '@svarog-ui/core';
import { mockPhoneRepairData } from '../__mocks__/phoneRepairData.js';

// Create a form with mock data
const form = PhoneRepairFormFactory.createWithMockData({
  mockData: mockPhoneRepairData,
  onPriceChange: (priceData) => console.log('Price updated:', priceData),
  onScheduleClick: (repairInfo) => console.log('Repair scheduled:', repairInfo),
  mockDelay: 300, // Simulated API delay in milliseconds
});

// Add to DOM
document.body.appendChild(form.getElement());
```

### Advanced Usage: Direct Component Creation

#### Presentation Component

```javascript
import { PhoneRepairForm } from '@svarog-ui/core';

// Create a simple form with callbacks
const repairForm = PhoneRepairForm({
  onManufacturerChange: (manufacturerId) =>
    console.log('Manufacturer selected:', manufacturerId),
  onDeviceChange: (deviceId) => console.log('Device selected:', deviceId),
  onActionChange: (actionId) => console.log('Action selected:', actionId),
  onScheduleClick: (repairInfo) => console.log('Schedule clicked:', repairInfo),
});

// Add to DOM
document.body.appendChild(repairForm.getElement());

// Later, update the form with data
repairForm.setManufacturers([
  { id: '1', name: 'Apple' },
  { id: '2', name: 'Samsung' },
  { id: '3', name: 'Google' },
]);
```

#### With Container

```javascript
import { PhoneRepairFormContainer } from '@svarog-ui/core';
import PhoneRepairService from './services/PhoneRepairService';

// Create a service that fetches data
const service = new PhoneRepairService({ baseUrl: 'https://api.example.com' });

// Create the container component
const formContainer = PhoneRepairFormContainer({
  service,
  onPriceChange: (price) => console.log('Price updated:', price),
  onScheduleClick: (repairInfo) => console.log('Repair scheduled:', repairInfo),
  usedPhoneUrl: 'https://example.com/used-phones',
});

// Add to DOM
document.body.appendChild(formContainer.getElement());
```

## Props

### PhoneRepairForm Props

| Prop                 | Type     | Default | Description                                    |
| -------------------- | -------- | ------- | ---------------------------------------------- |
| manufacturers        | Array    | []      | Array of manufacturer objects                  |
| devices              | Array    | []      | Array of device objects                        |
| actions              | Array    | []      | Array of action/service objects                |
| selectedManufacturer | string   | ""      | ID of selected manufacturer                    |
| selectedDevice       | string   | ""      | ID of selected device                          |
| selectedAction       | string   | ""      | ID of selected action                          |
| currentPrice         | Object   | null    | Current price data object                      |
| loading              | Object   | {}      | Loading states for different parts of the form |
| error                | Object   | {}      | Error states for different parts of the form   |
| labels               | Object   | {}      | Text labels to customize UI (see below)        |
| className            | string   | ""      | Additional CSS class names                     |
| usedPhoneUrl         | string   | "#"     | URL for the "used phone" link                  |
| onManufacturerChange | Function | null    | Callback when manufacturer changes             |
| onDeviceChange       | Function | null    | Callback when device changes                   |
| onActionChange       | Function | null    | Callback when action changes                   |
| onScheduleClick      | Function | null    | Callback when schedule button is clicked       |

### PhoneRepairFormContainer Options

| Option          | Type     | Default | Description                                |
| --------------- | -------- | ------- | ------------------------------------------ |
| service         | Object   | -       | Service object with API methods (required) |
| onPriceChange   | Function | null    | Callback when price updates                |
| onScheduleClick | Function | null    | Callback when schedule button is clicked   |
| usedPhoneUrl    | string   | "#"     | URL for the "used phone" link              |
| labels          | Object   | {}      | Text labels to customize UI                |
| className       | string   | ""      | Additional CSS class names                 |

### PhoneRepairFormFactory Options

| Option          | Type     | Description                                        |
| --------------- | -------- | -------------------------------------------------- |
| onPriceChange   | Function | Callback when price updates                        |
| onScheduleClick | Function | Callback when schedule button is clicked           |
| usedPhoneUrl    | string   | URL for the "used phone" link                      |
| labels          | Object   | Text labels to customize UI                        |
| className       | string   | Additional CSS class names                         |
| apiOptions      | Object   | API configuration (for createStandard)             |
| mockData        | Object   | Mock data structure (for createWithMockData)       |
| mockDelay       | number   | Simulated API delay in ms (for createWithMockData) |
| service         | Object   | Custom service object (for createWithMockService)  |

### Available Label Options

````javascript
{
  title: 'Reparatur anfragen',                  // Form title
  manufacturerStep: 'Hersteller',               // Label for manufacturer step
  deviceStep: 'Modell',                         // Label for device step
  serviceStep: 'Service',                       // Label for service step
  manufacturerLabel: 'Hersteller:',             // Label for manufacturer field
  deviceLabel: 'Modell:',                       // Label for device field
  serviceLabel: 'Service:',                     // Label for service field
  priceLabel: 'Preis:',                         // Label for price display
  manufacturerPlaceholder: 'Hersteller auswählen', // Placeholder for manufacturer select
  devicePlaceholder: 'Zuerst Hersteller auswählen', // Placeholder for device select
  servicePlaceholder: 'Zuerst Modell auswählen',    // Placeholder for service select
  initialPriceText: 'Bitte zuerst Hersteller, Modell und Service auswählen', // Initial price text
  loadingPriceText: 'Preis wird geladen...',    // Price loading text
  priceNotAvailable: 'Preis nicht verfügbar',   // Price not available text
  deviceLoadError: 'Fehler beim Laden der Geräte', // Device loading error message
  actionLoadError: 'Fehler beim Laden der Services', // Action loading error message
  priceLoadError: 'Fehler beim Laden des Preises',   // Price loading error message
  usedPhoneText: 'Zu teuer? Finde hier ein günstiges Gebrauchtes!', // Used phone link text
  scheduleButtonText: 'Jetzt Termin vereinbaren', // Schedule button text
}

### Expected Service Interface

The service object passed to PhoneRepairFormContainer (or custom services created for PhoneRepairFormFactory.createWithMockService) should implement:

```javascript
{
  fetchManufacturers: () => Promise<Array>,     // Get all manufacturers
  fetchDevices: (manufacturerId) => Promise<Array>, // Get devices for manufacturer
  fetchActions: (deviceId) => Promise<Array>,   // Get actions for device
  fetchPrice: (actionId) => Promise<Object>     // Get price for action
}
````

### Expected Mock Data Structure

The mockData structure provided to PhoneRepairFormFactory.createWithMockData should follow:

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
          actions: [
            {
              id: 1,
              name: 'Display Repair',
              deviceId: 1,
              prices: [
                {
                  id: 1,
                  price: 149,  // in whole euros or cents
                  actionId: 1,
                },
              ],
            },
            // more actions...
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

### PhoneRepairForm Methods

#### getElement()

Returns the form DOM element.

```javascript
const formElement = repairForm.getElement();
```

#### setManufacturers(manufacturers)

Updates the manufacturers list.

```javascript
repairForm.setManufacturers([
  { id: '1', name: 'Apple' },
  { id: '2', name: 'Samsung' },
]);
```

#### setDevices(devices)

Updates the devices list.

```javascript
repairForm.setDevices([
  { id: '1', name: 'iPhone 13' },
  { id: '2', name: 'iPhone 14' },
]);
```

#### setActions(actions)

Updates the actions list.

```javascript
repairForm.setActions([
  { id: '1', name: 'Display Repair' },
  { id: '2', name: 'Battery Replacement' },
]);
```

#### setPrice(price)

Updates the price data.

```javascript
repairForm.setPrice({
  price: 12900, // in cents
  deviceName: 'iPhone 13',
  actionName: 'Display Repair',
});
```

#### setLoading(loading)

Updates loading states.

```javascript
repairForm.setLoading({
  manufacturers: true,
  devices: false,
  actions: false,
  price: false,
});
```

#### setErrors(error)

Updates error states.

```javascript
repairForm.setErrors({
  devices: 'Failed to load devices',
});
```

#### setState(newState)

Updates multiple form state properties efficiently.

```javascript
repairForm.setState({
  selectedManufacturer: '1',
  manufacturers: [...],
  priceDisplayText: 'Loading...',
});
```

#### update(props)

Updates multiple component properties at once.

```javascript
repairForm.update({
  manufacturers: newManufacturers,
  selectedManufacturer: '1',
  className: 'custom-form',
});
```

#### destroy()

Cleans up resources. Call before removing from DOM.

```javascript
repairForm.destroy();
```

### PhoneRepairFormContainer Methods

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
  title: 'Book a Repair',
  manufacturerStep: 'Brand',
  deviceStep: 'Model',
  serviceStep: 'Service Type',
  manufacturerPlaceholder: 'Select brand',
  devicePlaceholder: 'First select a brand',
  servicePlaceholder: 'First select a model',
  initialPriceText: 'Please complete all selections to see price',
  loadingPriceText: 'Loading price...',
  priceLabel: 'Your repair estimate:',
  usedPhoneText: 'Looking for a better deal on a used phone?',
  scheduleButtonText: 'Book Appointment Now',
  deviceLoadError: 'Failed to load devices. Please try again.',
  actionLoadError: 'Failed to load services. Please try again.',
  priceLoadError: 'Failed to load price. Please try again.',
};

const form = PhoneRepairFormFactory.createStandard({
  labels: customLabels,
  // other options...
});
```

### CSS Customization

The PhoneRepairForm appearance can be customized using CSS variables:

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

### Using PhoneRepairFormFactory

```javascript
import { PhoneRepairFormFactory } from '@svarog-ui/core';
import { mockPhoneRepairData } from './__mocks__/phoneRepairData';

// Create form with mock data for development
const form = PhoneRepairFormFactory.createWithMockData({
  mockData: mockPhoneRepairData,
  mockDelay: 300,
  onPriceChange: (priceData) => {
    console.log(`Repair price: €${(priceData.price / 100).toFixed(2)}`);
    document.getElementById('summary-price').textContent =
      `€${(priceData.price / 100).toFixed(2)}`;
  },
  onScheduleClick: (repairInfo) => {
    console.log('Scheduled repair:', repairInfo);
    // Navigate to confirmation page
    window.location.href = `/confirmation?repair=${btoa(JSON.stringify(repairInfo))}`;
  },
  labels: {
    title: 'Book a Repair',
    manufacturerStep: 'Brand',
    deviceStep: 'Model',
    serviceStep: 'Service',
  },
});

document.getElementById('repair-form-container').appendChild(form.getElement());
```

### Complete Workflow With Real API

```javascript
import { PhoneRepairFormFactory } from '@svarog-ui/core';

// Create form with real API endpoints
const form = PhoneRepairFormFactory.createStandard({
  apiOptions: {
    baseUrl: '/api/repair/v2', // Override default API base URL
  },
  onPriceChange: (priceData) => {
    // Update checkout summary
    updateSummary(priceData);
  },
  onScheduleClick: async (repairInfo) => {
    try {
      // Show loading state
      showLoadingOverlay();

      // Submit to booking API
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(repairInfo),
      });

      if (!response.ok) {
        throw new Error('Failed to create booking');
      }

      const booking = await response.json();

      // Navigate to confirmation page
      window.location.href = `/confirmation?booking=${booking.id}`;
    } catch (error) {
      // Handle error
      hideLoadingOverlay();
      showErrorMessage('Failed to schedule repair: ' + error.message);
    }
  },
  usedPhoneUrl: '/used-phones',
  labels: {
    scheduleButtonText: 'Book Now',
  },
});

// Add to page
document.getElementById('repair-form-container').appendChild(form.getElement());

// Helper functions for the example
function updateSummary(priceData) {
  const summaryEl = document.getElementById('repair-summary');
  summaryEl.innerHTML = `
    <h3>Repair Summary</h3>
    <p><strong>Device:</strong> ${priceData.deviceName || 'Not selected'}</p>
    <p><strong>Service:</strong> ${priceData.actionName || 'Not selected'}</p>
    <p><strong>Price:</strong> €${(priceData.price / 100).toFixed(2)}</p>
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

The PhoneRepairForm component implements these accessibility features:

- Proper form structure with semantic HTML elements
- Step indicator with ARIA roles and labels
- Proper focus management between steps
- Form validation with clear error messages
- Accessibility attributes on all interactive elements

## Browser Support

The PhoneRepairForm component is compatible with:

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome for Android)
