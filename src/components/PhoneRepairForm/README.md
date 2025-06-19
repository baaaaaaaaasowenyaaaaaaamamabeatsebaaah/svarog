# PhoneRepairForm Component

The PhoneRepairForm component provides a multi-step interface for users to select a phone manufacturer, device model, and repair service to get pricing information. It features async loading, error handling, algorithmic optimizations, and CSS injection for zero-configuration styling.

## Key Features

- **Multi-step selection flow**: Manufacturer → Device → Service → Price
- **Async data loading**: Supports loading states and error handling
- **Progressive disclosure**: Each step enables the next based on selection
- **Custom Select components**: Enhanced UI with loading and error states
- **Steps indicator**: Visual progress through the form
- **Price display**: Real-time price updates with formatting
- **Responsive design**: Works on desktop and mobile
- **Accessibility**: Full keyboard navigation and screen reader support
- **Theme awareness**: Responds to theme changes
- **CSS Injection**: Zero-configuration styling that works everywhere
- **SSR Compatible**: Safe for server-side rendering environments
- **Algorithmic Optimizations**: O(1) lookups, mathematical calculations, and memoized transformations

## CSS Injection Architecture

This component uses the modern CSS injection pattern:

✅ **Zero CSS Import Errors** - Works in Node.js, bundlers, everywhere
✅ **Zero Configuration** - Users just import and use components
✅ **SSR Compatible** - Styles inject safely in browser only
✅ **Tree Shakeable** - Only loads styles for used components
✅ **Performance Optimized** - Styles are cached and deduped
✅ **Developer Experience** - No separate CSS imports to remember

The component automatically injects its styles on first render using the `createStyleInjector` utility.

## Performance Optimizations

The PhoneRepairForm includes several algorithmic optimizations:

- **O(1) Lookup Maps**: Fast name resolution using Map data structures
- **Memoized Transformations**: Cached option transformations with WeakMap
- **Mathematical Step Progression**: Efficient step calculation using arithmetic
- **Bitwise Validation**: Ultra-fast form validation using bitwise operations
- **Partial Updates**: Only updates changed components instead of full re-renders

## Usage

### Recommended: Using PhoneRepairFormContainer

The easiest way to create a PhoneRepairForm is through the container which handles all API interactions:

```javascript
import PhoneRepairFormContainer from './PhoneRepairFormContainer.js';

// Create with a real service
const formContainer = PhoneRepairFormContainer({
  service: {
    fetchManufacturers: () => fetch('/api/manufacturers').then((r) => r.json()),
    fetchDevices: (manufacturerId) =>
      fetch(`/api/devices/${manufacturerId}`).then((r) => r.json()),
    fetchActions: (deviceId) =>
      fetch(`/api/actions/${deviceId}`).then((r) => r.json()),
    fetchPrice: (actionId) =>
      fetch(`/api/price/${actionId}`).then((r) => r.json()),
  },
  onPriceChange: (priceData) => console.log('Price updated:', priceData),
  onScheduleClick: (repairInfo) => console.log('Repair scheduled:', repairInfo),
  usedPhoneHref: 'https://example.com/used-phones',
});

// Add to DOM - styles will inject automatically
document.body.appendChild(formContainer.getElement());
```

### Direct Component Usage

For more control or custom integrations:

```javascript
import PhoneRepairForm from './PhoneRepairForm.js';

const repairForm = PhoneRepairForm({
  manufacturers: [
    { id: '1', name: 'Apple' },
    { id: '2', name: 'Samsung' },
  ],
  onManufacturerChange: (manufacturerId) => {
    // Load and set devices for this manufacturer
    loadDevices(manufacturerId).then((devices) => {
      repairForm.setDevices(devices);
    });
  },
  onDeviceChange: (deviceId) => {
    // Load and set actions for this device
    loadActions(deviceId).then((actions) => {
      repairForm.setActions(actions);
    });
  },
  onActionChange: (actionId) => {
    // Load and set price for this action
    loadPrice(actionId).then((price) => {
      repairForm.setPrice(price);
    });
  },
  onScheduleClick: (repairInfo) => {
    console.log('Schedule clicked:', repairInfo);
  },
});

// Styles inject automatically on first render
document.body.appendChild(repairForm.getElement());
```

## Props

### PhoneRepairForm Props

| Prop                 | Type     | Default | Description                                                   |
| -------------------- | -------- | ------- | ------------------------------------------------------------- |
| manufacturers        | Array    | []      | Array of manufacturer objects with `id` and `name`            |
| devices              | Array    | []      | Array of device objects with `id` and `name`                  |
| actions              | Array    | []      | Array of action/service objects with `id` and `name`          |
| selectedManufacturer | string   | ""      | ID of selected manufacturer                                   |
| selectedDevice       | string   | ""      | ID of selected device                                         |
| selectedAction       | string   | ""      | ID of selected action                                         |
| currentPrice         | Object   | null    | Current price data object                                     |
| loadingStates        | Object   | {}      | Loading states: `{manufacturers, devices, actions, price}`    |
| error                | Object   | {}      | Error states: `{manufacturers, devices, actions, price}`      |
| labels               | Object   | {}      | Text labels to customize UI (see below)                       |
| className            | string   | ""      | Additional CSS class names                                    |
| usedPhoneHref        | string   | null    | URL for the "used phone" link                                 |
| onManufacturerChange | Function | null    | Callback when manufacturer changes `(manufacturerId) => {}`   |
| onDeviceChange       | Function | null    | Callback when device changes `(deviceId) => {}`               |
| onActionChange       | Function | null    | Callback when action changes `(actionId) => {}`               |
| onScheduleClick      | Function | null    | Callback when schedule button is clicked `(repairInfo) => {}` |

### Deprecated Props

| Deprecated Prop | New Prop      | Type   | Description                     |
| --------------- | ------------- | ------ | ------------------------------- |
| usedPhoneUrl    | usedPhoneHref | string | URL for the "used phone" link   |
| loading         | loadingStates | Object | Loading states for each element |

### PhoneRepairFormContainer Props

| Prop            | Type     | Required | Description                                                   |
| --------------- | -------- | -------- | ------------------------------------------------------------- |
| service         | Object   | Yes      | Service object with API methods (see below)                   |
| onPriceChange   | Function | No       | Callback when price updates `(priceData) => {}`               |
| onScheduleClick | Function | No       | Callback when schedule button is clicked `(repairInfo) => {}` |
| usedPhoneHref   | string   | No       | URL for the "used phone" link                                 |
| labels          | Object   | No       | Text labels to customize UI                                   |
| className       | string   | No       | Additional CSS class names                                    |

### Service Interface

The service object passed to PhoneRepairFormContainer must implement:

```javascript
{
  fetchManufacturers: () => Promise<Array>,     // Get all manufacturers
  fetchDevices: (manufacturerId) => Promise<Array>, // Get devices for manufacturer
  fetchActions: (deviceId) => Promise<Array>,   // Get actions for device
  fetchPrice: (actionId) => Promise<Object>     // Get price for action
}
```

### Data Formats

**Manufacturers/Devices/Actions:**

```javascript
[
  { id: '1', name: 'Apple' },
  { id: '2', name: 'Samsung' },
];
```

**Price:**

```javascript
{
  price: 12900, // in cents or whole euros
  deviceName: "iPhone 13",      // optional
  actionName: "Display Repair", // optional
  manufacturerName: "Apple"     // optional
}
```

### Available Labels

```javascript
{
  manufacturerStep: 'Hersteller',
  deviceStep: 'Modell',
  serviceStep: 'Service',
  manufacturerPlaceholder: 'Hersteller auswählen',
  devicePlaceholder: 'Zuerst Hersteller auswählen',
  servicePlaceholder: 'Zuerst Modell auswählen',
  initialPriceText: 'Bitte zuerst Hersteller, Modell und Service auswählen',
  loadingPriceText: 'Preis wird geladen...',
  priceLabel: 'Ihr unverbindlicher Preisvorschlag:',
  usedPhoneText: 'Zu teuer? Finde hier ein günstiges Gebrauchtes!',
  scheduleButtonText: 'Jetzt Termin vereinbaren',
}
```

## Methods

### PhoneRepairForm Methods

#### State Management

- `setState(newState)` - Update multiple state properties efficiently
- `setLoading(loadingState)` - Update loading states
- `setErrors(errorState)` - Update error states
- `setManufacturers(manufacturers)` - Update manufacturers list
- `setDevices(devices)` - Update devices list
- `setActions(actions)` - Update actions list
- `setPrice(price)` - Update price data
- `getCurrentState()` - Get current component state

#### Component Lifecycle

- `getElement()` - Returns the form DOM element
- `update(props)` - Update component with new props
- `destroy()` - Clean up resources

### PhoneRepairFormContainer Methods

- `getElement()` - Returns the form DOM element
- `getContainerState()` - Get container state for debugging
- `refresh(resource)` - Manually refresh a specific resource
- `refreshManufacturers()` - Refresh manufacturers list
- `updateForm(props)` - Update the form with new props
- `getFormState()` - Get current form state
- `destroy()` - Clean up resources

## Callback Data Formats

### onScheduleClick Callback Data

```javascript
{
  manufacturer: {
    id: "1",
    name: "Apple"
  },
  device: {
    id: "3",
    name: "iPhone 13"
  },
  service: {
    id: "7",
    name: "Display Reparatur"
  },
  price: {
    price: 26900,
    deviceName: "iPhone 13",
    actionName: "Display Reparatur",
    manufacturerName: "Apple"
  },
  timestamp: "2024-06-19T10:30:00.000Z"
}
```

## Examples

### Basic Implementation

```javascript
import PhoneRepairFormContainer from './PhoneRepairFormContainer.js';

const container = PhoneRepairFormContainer({
  service: {
    fetchManufacturers: () => fetch('/api/manufacturers').then((r) => r.json()),
    fetchDevices: (id) =>
      fetch(`/api/manufacturers/${id}/devices`).then((r) => r.json()),
    fetchActions: (id) =>
      fetch(`/api/devices/${id}/actions`).then((r) => r.json()),
    fetchPrice: (id) => fetch(`/api/actions/${id}/price`).then((r) => r.json()),
  },
  onScheduleClick: (repairInfo) => {
    // Handle repair scheduling
    console.log('Scheduling repair:', repairInfo);
  },
});

// Styles inject automatically
document.getElementById('form-container').appendChild(container.getElement());
```

### With Custom Labels

```javascript
const customLabels = {
  manufacturerStep: 'Brand',
  deviceStep: 'Model',
  serviceStep: 'Repair Type',
  manufacturerPlaceholder: 'Select brand',
  devicePlaceholder: 'First select a brand',
  servicePlaceholder: 'First select a model',
  priceLabel: 'Your repair estimate:',
  scheduleButtonText: 'Book Appointment',
};

const container = PhoneRepairFormContainer({
  service: myService,
  labels: customLabels,
  onPriceChange: (price) => updateSummary(price),
  onScheduleClick: (info) => bookRepair(info),
});
```

### Error Handling

```javascript
const container = PhoneRepairFormContainer({
  service: {
    fetchManufacturers: () =>
      fetch('/api/manufacturers').then((r) => {
        if (!r.ok) throw new Error('Failed to load manufacturers');
        return r.json();
      }),
    // ... other methods with error handling
  },
  onScheduleClick: async (repairInfo) => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(repairInfo),
      });

      if (!response.ok) {
        throw new Error('Booking failed');
      }

      const booking = await response.json();
      window.location.href = `/confirmation?id=${booking.id}`;
    } catch (error) {
      alert('Failed to schedule repair: ' + error.message);
    }
  },
});
```

### Manual State Management

```javascript
import PhoneRepairForm from './PhoneRepairForm.js';

const form = PhoneRepairForm({
  manufacturers: [],
  onManufacturerChange: async (manufacturerId) => {
    form.setLoading({ devices: true });
    try {
      const devices = await fetchDevices(manufacturerId);
      form.setDevices(devices);
      form.setState({ selectedManufacturer: manufacturerId });
    } catch (error) {
      form.setErrors({ devices: error.message });
    } finally {
      form.setLoading({ devices: false });
    }
  },
});

// Load initial data
loadManufacturers().then((manufacturers) => {
  form.setManufacturers(manufacturers);
});
```

## Styling

The component uses CSS injection for automatic styling. You can customize using CSS custom properties:

```css
:root {
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --color-brand-primary: #4299e1;
  --color-danger-light: #f56565;
  --font-family-base: system-ui, sans-serif;
}

.phone-repair-form {
  max-width: 800px;
  margin: 0 auto;
}

.phone-repair-form__actions {
  margin-top: var(--space-6);
}
```

### CSS Injection Benefits

- **Zero Configuration**: No CSS imports needed, styles work automatically
- **Performance**: Styles are cached and deduped across instances
- **Bundle Size**: Only used component styles are included
- **SSR Safe**: Works in Node.js environments without errors
- **Theme Compatible**: Integrates seamlessly with CSS custom properties

## File Structure

```
src/components/PhoneRepairForm/
├── PhoneRepairForm.js          # Main component with CSS injection
├── PhoneRepairForm.styles.js   # Component-specific styles
├── PhoneRepairFormContainer.js # Container for API management
├── PhoneRepairForm.test.js     # Unit tests
├── PhoneRepairForm.stories.js  # Storybook stories
├── README.md                   # This documentation
└── index.js                    # Exports
```

## Accessibility

- Full keyboard navigation support
- Screen reader compatible with ARIA labels
- Focus management between form steps
- Clear error messaging
- Semantic HTML structure

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome for Android)
- Node.js environments (SSR compatible)

## Performance

- **CSS Injection**: Automatic style loading with caching and deduplication
- **Efficient partial updates**: Minimal DOM changes with algorithmic optimization
- **Debounced event handlers**: Smooth interactions
- **Lazy loading**: Dependent data loads only when needed
- **Memory leak prevention**: Proper cleanup with style injection management
- **O(1) operations**: Optimized lookup maps for name resolution
- **Mathematical algorithms**: Step progression and validation logic
- **Memoized transformations**: Cached select option transformations

## Migration from Legacy Props

If upgrading from an older version:

### Prop Migration

```javascript
// Before
const form = PhoneRepairForm({
  usedPhoneUrl: 'https://example.com/used', // ❌ Deprecated
  loading: { devices: true }, // ❌ Deprecated
});

// After
const form = PhoneRepairForm({
  usedPhoneHref: 'https://example.com/used', // ✅ New prop name
  loadingStates: { devices: true }, // ✅ New prop name
});
```

The component provides warnings in the console for deprecated props and automatically migrates them internally for backward compatibility.

## Migration from CSS Imports

If upgrading from a version that used CSS imports:

### Before (CSS Import)

```javascript
import './PhoneRepairForm.css'; // ❌ Remove this
import PhoneRepairForm from './PhoneRepairForm.js';
```

### After (CSS Injection)

```javascript
import PhoneRepairForm from './PhoneRepairForm.js'; // ✅ Styles included automatically
```

No other changes needed - the component API remains exactly the same!
