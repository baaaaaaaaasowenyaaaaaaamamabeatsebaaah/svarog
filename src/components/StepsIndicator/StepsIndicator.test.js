// src/components/StepsIndicator/StepsIndicator.test.js
import { describe, it, expect, vi } from 'vitest';
import StepsIndicator from './StepsIndicator.js';

describe('StepsIndicator component', () => {
  it('should create a steps indicator element', () => {
    const steps = [
      { name: 'Step 1', completed: false },
      { name: 'Step 2', completed: false },
      { name: 'Step 3', completed: false },
    ];

    const stepsIndicator = StepsIndicator({
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
      StepsIndicator({
        activeIndex: 0,
      });
    }).toThrow('steps is required');
  });

  it('should throw error when activeIndex is not a number', () => {
    const steps = [
      { name: 'Step 1', completed: false },
      { name: 'Step 2', completed: false },
    ];

    expect(() => {
      StepsIndicator({
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

    const stepsIndicator = StepsIndicator({
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

  it('should call update with correct parameters for API methods', () => {
    // Create component with initial state
    const initialSteps = [
      { name: 'Step 1', completed: false },
      { name: 'Step 2', completed: false },
    ];

    const stepsIndicator = StepsIndicator({
      steps: initialSteps,
      activeIndex: 0,
    });

    // Spy on the update method
    stepsIndicator.update = vi.fn().mockReturnValue(stepsIndicator);

    // Test completeStep method
    stepsIndicator.completeStep(0);

    // Verify update was called with expected parameters for completeStep
    expect(stepsIndicator.update).toHaveBeenCalledTimes(1);
    const completeStepArgs = stepsIndicator.update.mock.calls[0][0];
    expect(completeStepArgs.steps[0].completed).toBe(true);
    expect(completeStepArgs.steps[1].completed).toBe(false);

    // Reset mock
    stepsIndicator.update.mockClear();

    // Test setActiveStep method
    stepsIndicator.setActiveStep(1);

    // Verify update was called with expected parameters for setActiveStep
    expect(stepsIndicator.update).toHaveBeenCalledTimes(1);
    const setActiveStepArgs = stepsIndicator.update.mock.calls[0][0];
    expect(setActiveStepArgs.activeIndex).toBe(1);

    // Reset mock
    stepsIndicator.update.mockClear();

    // Test resetSteps method
    stepsIndicator.resetSteps();

    // Verify update was called with expected parameters for resetSteps
    expect(stepsIndicator.update).toHaveBeenCalledTimes(1);
    const resetStepsArgs = stepsIndicator.update.mock.calls[0][0];
    expect(resetStepsArgs.activeIndex).toBe(0);
    expect(resetStepsArgs.steps[0].completed).toBe(false);
    expect(resetStepsArgs.steps[1].completed).toBe(false);
  });

  it('should accept custom class names', () => {
    const steps = [
      { name: 'Step 1', completed: false },
      { name: 'Step 2', completed: false },
    ];

    const stepsIndicator = StepsIndicator({
      steps,
      activeIndex: 0,
      className: 'custom-steps',
    });

    const element = stepsIndicator.getElement();
    expect(element.className).toContain('custom-steps');
  });

  it('should support loading state', () => {
    const steps = [
      { name: 'Step 1', completed: false },
      { name: 'Step 2', completed: false },
    ];

    const stepsIndicator = StepsIndicator({
      steps,
      activeIndex: 0,
      loading: true,
    });

    const element = stepsIndicator.getElement();
    expect(element.className).toContain('steps-indicator--loading');
    expect(element.getAttribute('aria-busy')).toBe('true');
  });

  it('should support value prop as an alias for activeIndex', () => {
    const steps = [
      { name: 'Step 1', completed: false },
      { name: 'Step 2', completed: false },
    ];

    const stepsIndicator = StepsIndicator({
      steps,
      value: 1, // Use value instead of activeIndex
    });

    const element = stepsIndicator.getElement();
    const state = element.state;

    expect(state.activeIndex).toBe(1);

    // Second step should be active
    const stepElements = element.querySelectorAll('.steps-indicator__step');
    expect(
      stepElements[1].classList.contains('steps-indicator__step--active')
    ).toBe(true);
  });

  it('should support onChange prop as an alias for onStepChange', () => {
    const mockCallback = vi.fn();
    const steps = [
      { name: 'Step 1', completed: false },
      { name: 'Step 2', completed: false },
    ];

    const stepsIndicator = StepsIndicator({
      steps,
      activeIndex: 0,
      onChange: mockCallback,
    });

    // Get the component's state to verify onStepChange was assigned
    const state = stepsIndicator.getState();
    expect(state.onStepChange).toBe(mockCallback);

    // Test that the callback is invoked when setActiveStep is called
    stepsIndicator.setActiveStep(1);
    expect(mockCallback).toHaveBeenCalledWith(1);
  });

  it('should support setValue method as an alias for setActiveStep', () => {
    const steps = [
      { name: 'Step 1', completed: false },
      { name: 'Step 2', completed: false },
    ];

    const stepsIndicator = StepsIndicator({
      steps,
      activeIndex: 0,
    });

    // Spy on the setActiveStep method
    stepsIndicator.setActiveStep = vi.fn();

    // Call setValue
    stepsIndicator.setValue(1);

    // Verify setActiveStep was called with the same parameter
    expect(stepsIndicator.setActiveStep).toHaveBeenCalledWith(1);
  });
});
