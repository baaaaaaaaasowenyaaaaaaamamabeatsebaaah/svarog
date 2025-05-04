// src/components/StepsIndicator/StepsIndicator.stories.js
import StepsIndicator from './StepsIndicator.js';

export default {
  title: 'Components/StepsIndicator',
  component: StepsIndicator,
  parameters: {
    docs: {
      description: {
        component:
          'A clean, modern multi-step progress indicator with a 3-section progress bar.',
      },
    },
  },
};

export const Default = () => {
  const steps = [
    { name: 'Step 1', completed: true },
    { name: 'Step 2', completed: false },
    { name: 'Step 3', completed: false },
  ];

  return new StepsIndicator({
    steps,
    activeIndex: 1,
  });
};

export const AllSteps = () => {
  // Create a container with all possible step combinations
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '48px';
  container.style.padding = '16px';

  // Example 1: Active first step
  const example1 = document.createElement('div');
  example1.innerHTML = '<h3>Step 1 of 3 active</h3>';
  const indicator1 = new StepsIndicator({
    steps: [
      { name: 'Step 1', completed: false },
      { name: 'Step 2', completed: false },
      { name: 'Step 3', completed: false },
    ],
    activeIndex: 0,
  });
  example1.appendChild(indicator1.getElement());

  // Example 2: Active second step
  const example2 = document.createElement('div');
  example2.innerHTML = '<h3>Step 2 of 3 active</h3>';
  const indicator2 = new StepsIndicator({
    steps: [
      { name: 'Step 1', completed: true },
      { name: 'Step 2', completed: false },
      { name: 'Step 3', completed: false },
    ],
    activeIndex: 1,
  });
  example2.appendChild(indicator2.getElement());

  // Example 3: Active third step
  const example3 = document.createElement('div');
  example3.innerHTML = '<h3>Step 3 of 3 active</h3>';
  const indicator3 = new StepsIndicator({
    steps: [
      { name: 'Step 1', completed: true },
      { name: 'Step 2', completed: true },
      { name: 'Step 3', completed: false },
    ],
    activeIndex: 2,
  });
  example3.appendChild(indicator3.getElement());

  // Example 4: More than 3 steps
  const example4 = document.createElement('div');
  example4.innerHTML = '<h3>5 steps total (Step 3 active)</h3>';
  const indicator4 = new StepsIndicator({
    steps: [
      { name: 'Information', completed: true },
      { name: 'Address', completed: true },
      { name: 'Payment', completed: false },
      { name: 'Review', completed: false },
      { name: 'Confirmation', completed: false },
    ],
    activeIndex: 2,
  });
  example4.appendChild(indicator4.getElement());

  // Add all examples to the container
  container.appendChild(example1);
  container.appendChild(example2);
  container.appendChild(example3);
  container.appendChild(example4);

  return container;
};

export const Interactive = () => {
  // Create container for demonstration
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '24px';
  container.style.padding = '16px';

  // Add title and description
  const header = document.createElement('div');
  header.innerHTML = `
    <h3 style="margin-top: 0; margin-bottom: 8px;">Interactive Steps Indicator</h3>
    <p style="margin-top: 0;">Use the buttons below to navigate through the steps.</p>
  `;
  container.appendChild(header);

  // Initial steps
  const steps = [
    { name: 'Personal Info', completed: false },
    { name: 'Contact Details', completed: false },
    { name: 'Confirmation', completed: false },
  ];

  const stepsIndicator = new StepsIndicator({
    steps,
    activeIndex: 0,
  });

  container.appendChild(stepsIndicator.getElement());

  // Create controls
  const controls = document.createElement('div');
  controls.style.display = 'flex';
  controls.style.gap = '12px';
  controls.style.marginTop = '16px';

  // Previous button
  const prevButton = document.createElement('button');
  prevButton.textContent = '← Previous';
  prevButton.style.padding = '8px 16px';
  prevButton.style.backgroundColor = '#e2e8f0';
  prevButton.style.border = 'none';
  prevButton.style.borderRadius = '4px';
  prevButton.style.cursor = 'pointer';
  prevButton.onclick = () => {
    const currentIndex = stepsIndicator.props.activeIndex;
    if (currentIndex > 0) {
      // Move to previous step
      stepsIndicator.update({
        activeIndex: currentIndex - 1,
      });

      // Update button states
      updateButtonStates();
    }
  };

  // Next button
  const nextButton = document.createElement('button');
  nextButton.textContent = 'Next →';
  nextButton.style.padding = '8px 16px';
  nextButton.style.backgroundColor = '#3182ce';
  nextButton.style.color = 'white';
  nextButton.style.border = 'none';
  nextButton.style.borderRadius = '4px';
  nextButton.style.cursor = 'pointer';
  nextButton.onclick = () => {
    const currentIndex = stepsIndicator.props.activeIndex;
    if (currentIndex < steps.length - 1) {
      // Mark current step as completed
      steps[currentIndex].completed = true;

      // Move to next step
      stepsIndicator.update({
        steps: [...steps],
        activeIndex: currentIndex + 1,
      });

      // Update button states
      updateButtonStates();
    }
  };

  // Reset button
  const resetButton = document.createElement('button');
  resetButton.textContent = 'Reset';
  resetButton.style.padding = '8px 16px';
  resetButton.style.backgroundColor = '#e2e8f0';
  resetButton.style.marginLeft = 'auto';
  resetButton.style.border = 'none';
  resetButton.style.borderRadius = '4px';
  resetButton.style.cursor = 'pointer';
  resetButton.onclick = () => {
    // Reset all steps
    steps.forEach((step) => (step.completed = false));

    // Update indicator
    stepsIndicator.update({
      steps: [...steps],
      activeIndex: 0,
    });

    // Update button states
    updateButtonStates();
  };

  controls.appendChild(prevButton);
  controls.appendChild(nextButton);
  controls.appendChild(resetButton);
  container.appendChild(controls);

  // Function to update button states
  function updateButtonStates() {
    const currentIndex = stepsIndicator.props.activeIndex;

    // Disable previous button if on first step
    prevButton.disabled = currentIndex === 0;
    prevButton.style.opacity = currentIndex === 0 ? '0.5' : '1';
    prevButton.style.cursor = currentIndex === 0 ? 'not-allowed' : 'pointer';

    // Disable next button if on last step
    nextButton.disabled = currentIndex === steps.length - 1;
    nextButton.style.opacity = currentIndex === steps.length - 1 ? '0.5' : '1';
    nextButton.style.cursor =
      currentIndex === steps.length - 1 ? 'not-allowed' : 'pointer';
  }

  // Initialize button states
  updateButtonStates();

  return container;
};
