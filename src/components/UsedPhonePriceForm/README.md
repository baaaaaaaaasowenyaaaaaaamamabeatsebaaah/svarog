# UsedPhonePriceForm Component

The UsedPhonePriceForm component provides a multi-step interface for users to select a phone manufacturer, device model, and condition to get a buyback price estimate. It features async loading, error handling, optimized user experience with algorithmic optimizations, and modern CSS injection for zero-configuration styling.

## Key Features

- **Multi-step selection flow**: Manufacturer → Device → Condition → Price
- **Async data loading**: Supports loading states and error handling
- **Progressive disclosure**: Each step enables the next based on selection
- **Custom Select components**: Enhanced UI with loading and error states
- **Condition selector**: Visual condition picker with descriptions
- **Steps indicator**: Visual progress through the form
- **Price display**: Real-time price updates with formatting
- **Responsive design**: Works on desktop and mobile
- **Accessibility**: Full keyboard navigation and screen reader support
- **Theme awareness**: Responds to theme changes
- **CSS Injection**: Automatic style injection with zero configuration
- **Algorithmic optimizations**: O(1) lookups, mathematical calculations, and memoized transformations

## Styling Architecture

This component uses **CSS injection** for styling, which provides several benefits:

✅ **Zero CSS Import Errors** - Works in Node.js, bundlers, everywhere  
✅ **Zero Configuration** - Users just import and use components  
✅ **SSR Compatible** - Styles inject safely in browser only  
✅ **Tree Shakeable** - Only loads styles for used components  
✅ **Performance Optimized** - Styles are cached and deduped  
✅ **Developer Experience** - No separate CSS imports to remember

The component automatically injects its styles when first rendered, and styles are cached to prevent duplicate injections.

## Usage

### Recommended: Using UsedPhonePriceFormContainer

The easiest way to create a UsedPhonePriceForm is through the container which handles all API interactions:

```javascript
import createUsedPhonePriceFormContainer from './UsedPhonePriceFormContainer.js';

// Create with a real service
const formContainer = createUsedPhonePriceFormContainer({
  service: {
    fetchManufacturers: () => fetch('/api/manufacturers').then((r) => r.json()),
    fetchDevices: (manufacturerId) =>
      fetch(`/api/devices/${manufacturerId}`).then((r) => r.json()),
    fetchConditions: (deviceId) =>
      fetch(`/api/conditions/${deviceId}`).then((r) => r.json()),
    fetchPrice: (conditionId) =>
      fetch(`/api/price/${conditionId}`).then((r) => r.json()),
  },
  onPriceChange: (priceData) => console.log('Price updated:', priceData),
  onSubmit: (formData) => console.log('Form submitted:', formData),
});

// Add to DOM
document.body.appendChild(formContainer.getElement());
```

### Direct Component Usage

For more control or custom integrations:

```javascript
import UsedPhonePriceForm from './UsedPhonePriceForm.js';

const priceForm = UsedPhonePriceForm({
  manufacturers: [
    { id: '1', name: 'Apple' },
    { id: '2', name: 'Samsung' },
  ],
  onManufacturerChange: (manufacturerId) => {
    // Load and set devices for this manufacturer
    loadDevices(manufacturerId).then((devices) => {
      priceForm.setDevices(devices);
    });
  },
  onDeviceChange: (deviceId) => {
    // Load and set conditions for this device
    loadConditions(deviceId).then((conditions) => {
      priceForm.setConditions(conditions);
    });
  },
  onConditionChange: (conditionId) => {
    // Load and set price for this condition
    loadPrice(conditionId).then((price) => {
      priceForm.setPrice(price);
    });
  },
  onSubmit: (formData) => {
    console.log('Submit clicked:', formData);
  },
});

document.body.appendChild(priceForm.getElement());
```

## Props

### UsedPhonePriceForm Props

| Prop                 | Type     | Default | Description                                                           |
| -------------------- | -------- | ------- | --------------------------------------------------------------------- |
| manufacturers        | Array    | []      | Array of manufacturer objects with `id` and `name`                    |
| devices              | Array    | []      | Array of device objects with `id` and `name`                          |
| conditions           | Array    | []      | Array of condition objects with `id`, `name`, and `description`       |
| selectedManufacturer | string   | ""      | ID of selected manufacturer                                           |
| selectedDevice       | string   | ""      | ID of selected device                                                 |
| selectedCondition    | string   | ""      | ID of selected condition                                              |
| currentPrice         | Object   | null    | Current price data object                                             |
| loadingStates        | Object   | {}      | Loading states: `{manufacturers, devices, conditions, price, submit}` |
| loading              | Object   | {}      | Alias for loadingStates (deprecated)                                  |
| error                | Object   | {}      | Error states: `{manufacturers, devices, conditions, price}`           |
| labels               | Object   | {}      | Text labels to customize UI (see below)                               |
| className            | string   | ""      | Additional CSS class names                                            |
| showStepsIndicator   | boolean  | true    | Whether to show the step indicator                                    |
| animationEnabled     | boolean  | true    | Whether to enable form animations                                     |
| onManufacturerChange | Function | null    | Callback when manufacturer changes `(manufacturerId) => {}`           |
| onDeviceChange       | Function | null    | Callback when device changes `(deviceId) => {}`                       |
| onConditionChange    | Function | null    | Callback when condition changes `(conditionId) => {}`                 |
| onSubmit             | Function | null    | Callback when form is submitted `(formData) => {}`                    |

### UsedPhonePriceFormContainer Props

| Prop               | Type     | Required | Description                                        |
| ------------------ | -------- | -------- | -------------------------------------------------- |
| service            | Object   | Yes      | Service object with API methods (see below)        |
| onPriceChange      | Function | No       | Callback when price updates `(priceData) => {}`    |
| onSubmit           | Function | No       | Callback when form is submitted `(formData) => {}` |
| labels             | Object   | No       | Text labels to customize UI                        |
| className          | string   | No       | Additional CSS class names                         |
| loadingStates      | Object   | No       | Loading states object                              |
| loading            | Object   | No       | Alias for loadingStates (deprecated)               |
| showStepsIndicator | boolean  | No       | Whether to show the step indicator (default: true) |

### Service Interface

The service object passed to UsedPhonePriceFormContainer must implement:

```javascript
{
  fetchManufacturers: () => Promise<Array>,     // Get all manufacturers
  fetchDevices: (manufacturerId) => Promise<Array>, // Get devices for manufacturer
  fetchConditions: (deviceId) => Promise<Array>,   // Get conditions for device
  fetchPrice: (conditionId) => Promise<Object>     // Get price for condition
}
```

### Data Formats

**Manufacturers/Devices:**

```javascript
[
  { id: '1', name: 'Apple' },
  { id: '2', name: 'Samsung' },
];
```

**Conditions:**

```javascript
[
  {
    id: '1',
    name: 'New',
    description: 'Like new, without any signs of wear',
  },
  {
    id: '2',
    name: 'Good',
    description: 'Minor signs of use, fully functional',
  },
];
```

**Price:**

```javascript
{
  price: 39900, // in cents or whole euros
  deviceName: "iPhone 13",      // optional
  conditionName: "Good",        // optional
  manufacturerName: "Apple"     // optional
}
```

### Available Labels

```javascript
{
  manufacturerStep: 'Hersteller',
  deviceStep: 'Modell',
  conditionStep: 'Zustand',
  manufacturerPlaceholder: 'Hersteller auswählen',
  devicePlaceholder: 'Zuerst Hersteller auswählen',
  initialPriceText: 'Bitte wählen Sie Hersteller, Modell und Zustand',
  loadingPriceText: 'Preis wird geladen...',
  priceLabel: 'Unser Angebot:',
  priceNotAvailable: 'Preis nicht verfügbar',
  submitButtonText: 'Verkaufen',
  submitButtonLoadingText: 'Wird verarbeitet...',
  conditionNewLabel: 'Neu',
  conditionGoodLabel: 'Gut',
  conditionFairLabel: 'Akzeptabel',
  conditionPoorLabel: 'Beschädigt',
}
```

## Methods

### UsedPhonePriceForm Methods

#### State Management

- `setState(newState)` - Update multiple state properties efficiently
- `setLoading(loadingState)` - Update loading states
- `setErrors(errorState)` - Update error states
- `setManufacturers(manufacturers)` - Update manufacturers list
- `setDevices(devices)` - Update devices list
- `setConditions(conditions)` - Update conditions list
- `setPrice(price)` - Update price data
- `getCurrentState()` - Get current component state

#### Component Lifecycle

- `getElement()` - Returns the form DOM element
- `update(props)` - Update component with new props
- `destroy()` - Clean up resources

### UsedPhonePriceFormContainer Methods

- `getElement()` - Returns the form DOM element
- `getContainerState()` - Get container state for debugging
- `refresh(resource)` - Manually refresh a specific resource
- `refreshManufacturers()` - Refresh manufacturers list
- `updateForm(props)` - Update the form with new props
- `getFormState()` - Get current form state
- `destroy()` - Clean up resources

## Examples

### Basic Implementation

```javascript
import createUsedPhonePriceFormContainer from './UsedPhonePriceFormContainer.js';

const container = createUsedPhonePriceFormContainer({
  service: {
    fetchManufacturers: () => fetch('/api/manufacturers').then((r) => r.json()),
    fetchDevices: (id) =>
      fetch(`/api/manufacturers/${id}/devices`).then((r) => r.json()),
    fetchConditions: (id) =>
      fetch(`/api/devices/${id}/conditions`).then((r) => r.json()),
    fetchPrice: (id) =>
      fetch(`/api/conditions/${id}/price`).then((r) => r.json()),
  },
  onSubmit: (formData) => {
    // Handle form submission
    console.log('Submitting sale:', formData);
  },
});

document.getElementById('form-container').appendChild(container.getElement());
```

### With Custom Labels

```javascript
const customLabels = {
  manufacturerStep: 'Brand',
  deviceStep: 'Model',
  conditionStep: 'Condition',
  manufacturerPlaceholder: 'Select brand',
  devicePlaceholder: 'First select a brand',
  initialPriceText: 'Complete all selections to see your buyback offer',
  priceLabel: 'Your buyback estimate:',
  submitButtonText: 'Sell Device',
};

const container = createUsedPhonePriceFormContainer({
  service: myService,
  labels: customLabels,
  onPriceChange: (price) => updateSummary(price),
  onSubmit: (info) => submitSale(info),
});
```

### Error Handling

```javascript
const container = createUsedPhonePriceFormContainer({
  service: {
    fetchManufacturers: () =>
      fetch('/api/manufacturers').then((r) => {
        if (!r.ok) throw new Error('Failed to load manufacturers');
        return r.json();
      }),
    // ... other methods with error handling
  },
  onSubmit: async (formData) => {
    try {
      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Sale submission failed');
      }

      const sale = await response.json();
      window.location.href = `/confirmation?id=${sale.id}`;
    } catch (error) {
      alert('Failed to submit sale: ' + error.message);
    }
  },
});
```

### Manual State Management

```javascript
import UsedPhonePriceForm from './UsedPhonePriceForm.js';

const form = UsedPhonePriceForm({
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

## Performance Optimizations

The UsedPhonePriceForm includes several algorithmic optimizations:

- **O(1) Lookup Maps**: Fast name resolution using Map data structures
- **Memoized Transformations**: Cached option transformations with WeakMap
- **Mathematical Step Progression**: Efficient step calculation using arithmetic
- **Bitwise Validation**: Ultra-fast form validation using bitwise operations
- **Partial Updates**: Only updates changed components instead of full re-renders
- **CSS Injection Caching**: Styles are injected once and cached automatically

## Styling Customization

The component automatically injects its styles, but you can customize them using CSS custom properties:

```css
:root {
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-12: 3rem;
  --color-bg-transparent: rgba(255, 255, 255, 0.8);
  --color-brand-primary: #4299e1;
  --color-danger-light: #f56565;
  --font-family-base: system-ui, sans-serif;
}

.used-phone-price-form {
  max-width: 800px;
  margin: 0 auto;
}

.used-phone-price-form__actions {
  margin-top: var(--space-6);
}
```

### Advanced Styling

You can also override specific component styles:

```css
/* Custom form background */
.used-phone-price-form {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

/* Custom animations */
.used-phone-price-form--animate-submit {
  animation: custom-submit-pulse 0.6s ease;
}

@keyframes custom-submit-pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.03);
  }
}
```

## File Structure

```
src/components/UsedPhonePriceForm/
├── UsedPhonePriceForm.js              # Main component with CSS injection
├── UsedPhonePriceForm.styles.js       # Component-specific styles
├── UsedPhonePriceFormContainer.js     # Container for API management
├── UsedPhonePriceForm.test.js         # Component tests
├── UsedPhoneProceFormContainer.test.js # Container tests
├── UsedPhonePriceForm.stories.js      # Storybook stories
├── README.md                          # This file
└── index.js                           # Exports
```

## Migration from CSS Imports

If you're upgrading from a version that used CSS imports, no changes are needed in your code. The component now automatically handles its styling through CSS injection, providing better compatibility and zero configuration.

## Accessibility

- Full keyboard navigation support
- Screen reader compatible with ARIA labels
- Focus management between form steps
- Clear error messaging
- Semantic HTML structure
- Proper form labels and descriptions

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome for Android)
- Node.js environments (SSR compatible)

## Performance

- Efficient partial updates to minimize DOM changes
- Debounced event handlers for smooth interactions
- Lazy loading of dependent data
- Memory leak prevention with proper cleanup
- Algorithmic optimizations for fast operations
- Automatic style caching and deduplication
