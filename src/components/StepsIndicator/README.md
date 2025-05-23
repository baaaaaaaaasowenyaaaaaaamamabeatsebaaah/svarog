# StepsIndicator Component

The StepsIndicator component provides a clean, modern multi-step progress indicator with a 3-section progress bar.

## Usage

```javascript
import { StepsIndicator } from '@svarog-ui/core';

// Create a steps indicator
const stepsIndicator = StepsIndicator({
  steps: [
    { name: 'Step 1', completed: true },
    { name: 'Step 2', completed: false },
    { name: 'Step 3', completed: false },
  ],
  activeIndex: 1, // or value: 1
});

// Add to DOM
document.body.appendChild(stepsIndicator.getElement());
```

## Props

| Prop         | Type     | Default | Description                                   |
| ------------ | -------- | ------- | --------------------------------------------- |
| steps        | array    | -       | Array of step objects (required)              |
| activeIndex  | number   | -       | Index of the currently active step (required) |
| value        | number   | -       | Alias for activeIndex                         |
| loading      | boolean  | false   | Whether the component is in loading state     |
| className    | string   | ""      | Additional CSS classes                        |
| onStepChange | function | -       | Callback when active step changes             |
| onChange     | function | -       | Alias for onStepChange                        |

### Step Object Properties

| Property  | Type    | Description                   |
| --------- | ------- | ----------------------------- |
| name      | string  | Name of the step              |
| completed | boolean | Whether the step is completed |

## Methods

### getElement()

Returns the steps indicator DOM element.

```javascript
const element = stepsIndicator.getElement();
```

### getState()

Returns a copy of the component's current state.

```javascript
const state = stepsIndicator.getState();
console.log(`Current active step: ${state.activeIndex}`);
```

### update(props)

Updates the steps indicator with new properties.

```javascript
stepsIndicator.update({
  steps: updatedSteps,
  activeIndex: 2, // or value: 2
});
```

### setActiveStep(index)

Sets the active step to the specified index.

```javascript
stepsIndicator.setActiveStep(2); // Navigate to step 3
```

### setValue(index)

Alias for setActiveStep - sets the active step to the specified index.

```javascript
stepsIndicator.setValue(2); // Navigate to step 3
```

### completeStep(index)

Marks a specific step as completed.

```javascript
stepsIndicator.completeStep(0); // Mark the first step as completed
```

### resetSteps()

Resets all steps to incomplete and sets active index to 0.

```javascript
stepsIndicator.resetSteps(); // Start over
```

### destroy()

Cleans up resources and event listeners. Call before removing from the DOM.

```javascript
stepsIndicator.destroy();
```

## Behavior

The StepsIndicator always displays exactly 3 sections in the progress bar, regardless of how many steps are defined. This creates a clean, consistent visual representation:

- For 3 steps or fewer: Each section corresponds directly to a step
- For more than 3 steps: Steps are distributed proportionally across the 3 sections

## Loading State

The component supports a loading state that displays a subtle animation:

```javascript
// Create steps indicator in loading state
const stepsIndicator = StepsIndicator({
  steps: [
    { name: 'Step 1', completed: false },
    { name: 'Step 2', completed: false },
    { name: 'Step 3', completed: false },
  ],
  activeIndex: 0,
  loading: true,
});

// Update loading state
stepsIndicator.update({ loading: false });
```

## CSS Customization

The StepsIndicator appearance can be customized with CSS variables:

```css
:root {
  /* Colors */
  --color-gray-200: #e2e8f0;
  --color-gray-400: #a0aec0;
  --color-brand-secondary: #4299e1;
  --color-brand-secondary-light: #63b3ed;
  --color-white: #ffffff;

  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;

  /* Typography */
  --font-family-primary: system-ui, sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
}
```

## Examples

### Basic Steps Indicator

```javascript
const steps = [
  { name: 'Personal Info', completed: true },
  { name: 'Contact Details', completed: false },
  { name: 'Confirmation', completed: false },
];

const stepsIndicator = StepsIndicator({
  steps,
  activeIndex: 1, // or value: 1
});
```

### Using Helper Methods

```javascript
// Create steps indicator
const stepsIndicator = StepsIndicator({
  steps: [
    { name: 'Step 1', completed: false },
    { name: 'Step 2', completed: false },
    { name: 'Step 3', completed: false },
  ],
  activeIndex: 0,
});

// Complete the current step and move to the next
function moveToNextStep() {
  const state = stepsIndicator.getState();
  const currentIndex = state.activeIndex;

  // Mark current step as completed
  stepsIndicator.completeStep(currentIndex);

  // Move to next step if not at the end
  if (currentIndex < state.steps.length - 1) {
    stepsIndicator.setValue(currentIndex + 1); // Using setValue alias
  }
}

// Use the helper to move back
function moveToPreviousStep() {
  const currentIndex = stepsIndicator.getState().activeIndex;

  if (currentIndex > 0) {
    stepsIndicator.setActiveStep(currentIndex - 1);
  }
}

// Start over
function resetForm() {
  stepsIndicator.resetSteps();
}
```

### More than 3 Steps

```javascript
const steps = [
  { name: 'Information', completed: true },
  { name: 'Address', completed: true },
  { name: 'Payment', completed: false },
  { name: 'Review', completed: false },
  { name: 'Confirmation', completed: false },
];

const stepsIndicator = StepsIndicator({
  steps,
  value: 2, // Using value instead of activeIndex
});
```

### Interactive Steps Example

```javascript
const steps = [
  { name: 'Step 1', completed: false },
  { name: 'Step 2', completed: false },
  { name: 'Step 3', completed: false },
];

const stepsIndicator = StepsIndicator({
  steps,
  activeIndex: 0,
  onChange: (newIndex) => {
    console.log(`Step changed to ${newIndex + 1}`);
  },
});

// Move to next step
function nextStep() {
  const currentIndex = stepsIndicator.getState().activeIndex;

  if (currentIndex < steps.length - 1) {
    // Mark current step as completed
    steps[currentIndex].completed = true;

    // Update component
    stepsIndicator.update({
      steps: [...steps], // Create a new array to ensure update
      activeIndex: currentIndex + 1,
    });
  }
}

// Add step navigation buttons
const nextButton = document.createElement('button');
nextButton.textContent = 'Next Step';
nextButton.addEventListener('click', nextStep);
document.body.appendChild(nextButton);
```

## Accessibility

The StepsIndicator is built with accessibility in mind:

- Uses semantic HTML structure with appropriate ARIA roles
- Step elements have descriptive ARIA labels including completion state
- Current step is marked with `aria-current="step"`
- Purely decorative elements are hidden from screen readers
- Progress is communicated through both visual cues and screen reader announcements
- Loading state uses `aria-busy="true"` to communicate to assistive technologies

For best results in your application, complement this component with:

```javascript
// Additional contextual description for screen readers
const formContainer = document.createElement('div');
formContainer.setAttribute('aria-live', 'polite');
formContainer.appendChild(
  document.createTextNode('Step 2 of 3: Contact Details')
);

// Update this text when navigating between steps
function updateAccessibilityAnnouncement(stepIndex, steps) {
  formContainer.textContent = `Step ${stepIndex + 1} of ${steps.length}: ${steps[stepIndex].name}`;
}
```

## Responsive Behavior

The StepsIndicator is fully responsive and adapts to different screen sizes:

- On desktop: Horizontal layout with steps in a row
- On mobile: Vertical layout with steps stacked
