// src/components/StepsIndicator/StepsIndicator.test.js
import { describe, it, expect } from 'vitest';
import StepsIndicator from './StepsIndicator.js';

describe('StepsIndicator component', () => {
  it('should create a steps indicator element', () => {
    const steps = [
      { name: 'Step 1', completed: false },
      { name: 'Step 2', completed: false },
      { name: 'Step 3', completed: false },
    ];

    const stepsIndicator = new StepsIndicator({
      steps,
      activeIndex: 0,
    });

    const element = stepsIndicator.getElement();
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.className).toContain('steps-indicator');

    // Check that we have the correct number of step elements
    const stepElements = element.querySelectorAll('.steps-indicator__step');
    expect(stepElements.length).toBe(steps.length);
  });

  it('should throw error when steps are not provided', () => {
    expect(() => {
      new StepsIndicator({
        activeIndex: 0,
      });
    }).toThrow('StepsIndicator: steps must be an array');
  });

  it('should throw error when activeIndex is not a number', () => {
    const steps = [
      { name: 'Step 1', completed: false },
      { name: 'Step 2', completed: false },
    ];

    expect(() => {
      new StepsIndicator({
        steps,
        activeIndex: '0',
      });
    }).toThrow('StepsIndicator: activeIndex must be a number');
  });

  it('should mark active step correctly', () => {
    const steps = [
      { name: 'Step 1', completed: true },
      { name: 'Step 2', completed: false },
      { name: 'Step 3', completed: false },
    ];

    const stepsIndicator = new StepsIndicator({
      steps,
      activeIndex: 1,
    });

    const element = stepsIndicator.getElement();
    const stepElements = element.querySelectorAll('.steps-indicator__step');

    // Step 1 should be completed but not active
    expect(
      stepElements[0].classList.contains('steps-indicator__step--completed')
    ).toBe(true);
    expect(
      stepElements[0].classList.contains('steps-indicator__step--active')
    ).toBe(false);

    // Step 2 should be active but not completed
    expect(
      stepElements[1].classList.contains('steps-indicator__step--active')
    ).toBe(true);
    expect(
      stepElements[1].classList.contains('steps-indicator__step--completed')
    ).toBe(false);

    // Step 3 should be neither active nor completed
    expect(
      stepElements[2].classList.contains('steps-indicator__step--active')
    ).toBe(false);
    expect(
      stepElements[2].classList.contains('steps-indicator__step--completed')
    ).toBe(false);
  });

  it('should update steps and active index', () => {
    const initialSteps = [
      { name: 'Step 1', completed: false },
      { name: 'Step 2', completed: false },
    ];

    const stepsIndicator = new StepsIndicator({
      steps: initialSteps,
      activeIndex: 0,
    });

    document.body.appendChild(stepsIndicator.getElement());

    // Update steps and active index
    const updatedSteps = [
      { name: 'Step 1', completed: true },
      { name: 'Step 2', completed: false },
    ];

    stepsIndicator.update({
      steps: updatedSteps,
      activeIndex: 1,
    });

    // Check that the component was updated correctly
    const stepElements = document.querySelectorAll('.steps-indicator__step');

    // Step 1 should now be completed
    expect(
      stepElements[0].classList.contains('steps-indicator__step--completed')
    ).toBe(true);

    // Step 2 should now be active
    expect(
      stepElements[1].classList.contains('steps-indicator__step--active')
    ).toBe(true);

    document.body.removeChild(stepsIndicator.getElement());
  });

  it('should accept custom class names', () => {
    const steps = [
      { name: 'Step 1', completed: false },
      { name: 'Step 2', completed: false },
    ];

    const stepsIndicator = new StepsIndicator({
      steps,
      activeIndex: 0,
      className: 'custom-steps',
    });

    const element = stepsIndicator.getElement();
    expect(element.className).toContain('custom-steps');
  });
});
