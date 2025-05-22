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

  return StepsIndicator({
    steps,
    activeIndex: 1,
  });
};

export const AllSteps = () => {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '48px';
  container.style.padding = '16px';

  // Example 1: Active first step
  const example1 = document.createElement('div');
  example1.innerHTML = '<h3>Step 1 of 3 active</h3>';
  const indicator1 = StepsIndicator({
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
  const indicator2 = StepsIndicator({
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
  const indicator3 = StepsIndicator({
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
  const indicator4 = StepsIndicator({
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

  // Function to create a fresh component with given props
  function createFreshComponent(props) {
    // Clear previous component if it exists
    const indicatorContainer = container.querySelector('.indicator-container');
    if (indicatorContainer) {
      indicatorContainer.innerHTML = '';

      // Create new component and add to container
      const newComponent = StepsIndicator(props);
      indicatorContainer.appendChild(newComponent.getElement());
    } else {
      // Create initial component container
      const newIndicatorContainer = document.createElement('div');
      newIndicatorContainer.className = 'indicator-container';
      container.appendChild(newIndicatorContainer);

      // Create component and add to container
      const newComponent = StepsIndicator(props);
      newIndicatorContainer.appendChild(newComponent.getElement());
    }
  }

  // Add title and description
  const header = document.createElement('div');
  header.innerHTML = `
    <h3 style="margin-top: 0; margin-bottom: 8px;">Interactive Steps Indicator</h3>
    <p style="margin-top: 0;">Use the buttons below to navigate through the steps.</p>
  `;
  container.appendChild(header);

  // Initial steps
  let steps = [
    { name: 'Personal Info', completed: false },
    { name: 'Contact Details', completed: false },
    { name: 'Confirmation', completed: false },
  ];

  // Track current state
  let activeIndex = 0;
  let isWorkflowCompleted = false;

  // Create initial component
  createFreshComponent({
    steps,
    activeIndex,
  });

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

  // Next/Complete button
  const nextButton = document.createElement('button');
  nextButton.textContent = 'Next →';
  nextButton.style.padding = '8px 16px';
  nextButton.style.backgroundColor = '#3182ce';
  nextButton.style.color = 'white';
  nextButton.style.border = 'none';
  nextButton.style.borderRadius = '4px';
  nextButton.style.cursor = 'pointer';

  // Reset button
  const resetButton = document.createElement('button');
  resetButton.textContent = 'Reset';
  resetButton.style.padding = '8px 16px';
  resetButton.style.backgroundColor = '#e2e8f0';
  resetButton.style.marginLeft = 'auto';
  resetButton.style.border = 'none';
  resetButton.style.borderRadius = '4px';
  resetButton.style.cursor = 'pointer';

  // Function to update button states
  function updateButtonStates() {
    // Disable previous button if on first step
    prevButton.disabled = activeIndex === 0 || isWorkflowCompleted;
    prevButton.style.opacity =
      activeIndex === 0 || isWorkflowCompleted ? '0.5' : '1';
    prevButton.style.cursor =
      activeIndex === 0 || isWorkflowCompleted ? 'not-allowed' : 'pointer';

    // Change next button to Complete on last step
    if (activeIndex === steps.length - 1 && !isWorkflowCompleted) {
      nextButton.textContent = 'Complete ✓';
      nextButton.style.backgroundColor = '#48bb78'; // Green color for completion
    } else {
      nextButton.textContent = 'Next →';
      nextButton.style.backgroundColor = '#3182ce'; // Blue for next
    }

    // Disable next button when workflow is completed
    nextButton.disabled = isWorkflowCompleted;
    nextButton.style.opacity = isWorkflowCompleted ? '0.5' : '1';
    nextButton.style.cursor = isWorkflowCompleted ? 'not-allowed' : 'pointer';
  }

  // Button event handlers
  prevButton.onclick = () => {
    if (activeIndex > 0 && !isWorkflowCompleted) {
      // Move to previous step
      activeIndex--;

      // Create a fresh component with updated state
      createFreshComponent({
        steps,
        activeIndex,
      });

      // Update button states
      updateButtonStates();
    }
  };

  nextButton.onclick = () => {
    if (isWorkflowCompleted) return;

    // Mark current step as completed
    steps = [...steps];
    steps[activeIndex] = { ...steps[activeIndex], completed: true };

    if (activeIndex === steps.length - 1) {
      // If on last step, mark workflow as completed
      isWorkflowCompleted = true;

      // KEY FIX: Make the step appear as both completed AND keep it as active
      // This ensures that the section shows the success styling
      // Create a fresh component but use a DIFFERENT activeIndex
      // to trigger the success styling
      createFreshComponent({
        steps,
        activeIndex: activeIndex,
      });

      // Create a message to show completion
      const completionMessage = document.createElement('div');
      completionMessage.textContent = 'Process completed successfully!';
      completionMessage.style.padding = '8px 16px';
      completionMessage.style.marginTop = '16px';
      completionMessage.style.backgroundColor = '#c6f6d5';
      completionMessage.style.borderRadius = '4px';
      completionMessage.style.color = '#2f855a';
      completionMessage.style.fontWeight = '500';

      // Add message after the controls
      container.insertBefore(completionMessage, controls.nextSibling);
    } else {
      // Otherwise move to next step
      activeIndex++;

      // Create a fresh component with updated state
      createFreshComponent({
        steps,
        activeIndex,
      });
    }

    // Update button states
    updateButtonStates();
  };

  resetButton.onclick = () => {
    // Reset all steps
    steps = steps.map((step) => ({ ...step, completed: false }));
    activeIndex = 0;
    isWorkflowCompleted = false;

    // Remove completion message if it exists
    const completionMessage = container.querySelector(
      'div:not(.indicator-container):not(:first-child):not(.steps-indicator)'
    );
    if (completionMessage && completionMessage !== controls) {
      container.removeChild(completionMessage);
    }

    // Create a fresh component with updated state
    createFreshComponent({
      steps,
      activeIndex,
    });

    // Update button states
    updateButtonStates();
  };

  controls.appendChild(prevButton);
  controls.appendChild(nextButton);
  controls.appendChild(resetButton);
  container.appendChild(controls);

  // Initialize button states
  updateButtonStates();

  return container;
};
