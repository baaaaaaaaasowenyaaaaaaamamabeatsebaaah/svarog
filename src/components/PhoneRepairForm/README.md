# PhoneRepairForm Component

The PhoneRepairForm component provides a multi-step interface for users to select a phone manufacturer, device model, and repair service to get pricing information. It features async loading, error handling, optimized user experience with CSS injection for zero-configuration styling, and now includes dual action buttons and conditional link display.

## Key Features

- **Multi-step selection flow**: Manufacturer → Device → Service → Price
- **Dual action buttons**: Schedule appointment and Call now options
- **Smart link display**: "Too expensive?" link appears only after price is shown
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

## CSS Injection Architecture

This component uses the modern CSS injection pattern:

✅ **Zero CSS Import Errors** - Works in Node.js, bundlers, everywhere
✅ **Zero Configuration** - Users just import and use components
✅ **SSR Compatible** - Styles inject safely in browser only
✅ **Tree Shakeable** - Only loads styles for used components
✅ **Performance Optimized** - Styles are cached and deduped
✅ **Developer Experience** - No separate CSS imports to remember

The component automatically injects its styles on first render using the `createStyleInjector` utility.

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
  onCallClick: (repairInfo) => console.log('Call initiated:', repairInfo),
  callButtonText: 'Jetzt anrufen',
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
  onCallClick: (repairInfo) => {
    console.log('Call clicked:', repairInfo);
  },
  callButtonText: 'Jetzt anrufen',
  usedPhoneHref: 'https://example.com/used-phones',
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
| usedPhoneHref        | string   | null    | URL for the "used phone" link (shown after price loads)       |
| callButtonText       | string   | null    | Text for call button (button hidden if not provided)          |
| onManufacturerChange | Function | null    | Callback when manufacturer changes `(manufacturerId) => {}`   |
| onDeviceChange       | Function | null    | Callback when device changes `(deviceId) => {}`               |
| onActionChange       | Function | null    | Callback when action changes `(actionId) => {}`               |
| onScheduleClick      | Function | null    | Callback when schedule button is clicked `(repairInfo) => {}` |
| onCallClick          | Function | null    | Callback when call button is clicked `(repairInfo) => {}`     |

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
| onCallClick     | Function | No       | Callback when call button is clicked `(repairInfo) => {}`     |
| callButtonText  | string   | No       | Text for call button (button hidden if not provided)          |
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

**RepairInfo (passed to callbacks):**

```javascript
{
  manufacturer: {
    id: '1',
    name: 'Apple'
  },
  device: {
    id: '3',
    name: 'iPhone 13'
  },
  service: {
    id: '7',
    name: 'Display Reparatur'
  },
  price: {
    price: 26900,
    // ... other price data
  },
  timestamp: '2025-06-24T10:30:00.000Z'
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
  usedPhoneText: 'Zu teuer? Schau dir jetzt unsere Gebrauchten Modelle an!',
  scheduleButtonText: 'Jetzt Termin vereinbaren',
}
```

## New Features

### Dual Action Buttons

The form now supports two action buttons side by side:

1. **Schedule Button** (Primary) - Always shown, for scheduling repair appointments
2. **Call Button** (Secondary) - Optional, shown when `callButtonText` and `onCallClick` are provided

Both buttons:

- Share the same enable/disable logic
- Are enabled only when all selections are complete and price is loaded
- Receive the same `repairInfo` data structure
- Are responsive (side by side on desktop, stacked on mobile)

### Conditional Link Display

The "Zu teuer?" (Too expensive?) link now appears intelligently:

- ✅ Shows when: Price is loaded AND not loading AND href is provided
- ❌ Hidden when: No price selected OR price is loading OR no href
- Appears between price display and action buttons
- Provides better UX by showing alternatives only after price is visible

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

## Examples

### Basic Implementation with Call Button

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
    window.location.href = `/schedule?device=${repairInfo.device.id}`;
  },
  onCallClick: (repairInfo) => {
    // Handle call action
    console.log('Initiating call:', repairInfo);
    window.location.href = 'tel:+4912345678';
  },
  callButtonText: 'Jetzt anrufen',
  usedPhoneHref: '/used-phones',
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
  usedPhoneText: 'Too expensive? Check our refurbished phones!',
};

const container = PhoneRepairFormContainer({
  service: myService,
  labels: customLabels,
  callButtonText: 'Call Now',
  onPriceChange: (price) => updateSummary(price),
  onScheduleClick: (info) => bookRepair(info),
  onCallClick: (info) => initiateCall(info),
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
  onCallClick: (repairInfo) => {
    // Track call initiation
    analytics.track('repair_call_initiated', {
      device: repairInfo.device.name,
      service: repairInfo.service.name,
      price: repairInfo.price.price,
    });

    window.location.href = 'tel:+4912345678';
  },
  callButtonText: 'Jetzt anrufen',
});
```

### Conditional Button Display

```javascript
// Form with only schedule button (no call button)
const formScheduleOnly = PhoneRepairFormContainer({
  service: myService,
  onScheduleClick: handleSchedule,
  // No callButtonText or onCallClick = no call button shown
});

// Form with both buttons
const formWithBothButtons = PhoneRepairFormContainer({
  service: myService,
  onScheduleClick: handleSchedule,
  onCallClick: handleCall,
  callButtonText: 'Call Support',
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

/* Link styling */
.phone-repair-form__link-container {
  text-align: right;
  margin: var(--space-4) 0;
}

/* Button container styling */
.phone-repair-form__actions {
  display: flex;
  gap: var(--space-3);
  justify-content: flex-end;
}

/* Responsive button layout */
@media (max-width: 480px) {
  .phone-repair-form__actions {
    flex-direction: column;
  }

  .phone-repair-form__actions .btn {
    width: 100%;
  }
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
- Proper button states and ARIA attributes

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

## Migration Guide

### From Previous Version

If upgrading from a version without dual buttons:

```javascript
// Before: Single button
PhoneRepairFormContainer({
  service: myService,
  onScheduleClick: handleSchedule,
});

// After: Add call button (optional)
PhoneRepairFormContainer({
  service: myService,
  onScheduleClick: handleSchedule,
  onCallClick: handleCall, // New
  callButtonText: 'Jetzt anrufen', // New
});
```

### From CSS Import Version

If upgrading from a version that used CSS imports:

```javascript
// Before: Required CSS import
import './PhoneRepairForm.css'; // ❌ Remove this
import PhoneRepairForm from './PhoneRepairForm.js';

// After: Just import and use
import PhoneRepairForm from './PhoneRepairForm.js'; // ✅ Styles included automatically
```

No other changes needed - the component API remains exactly the same!
