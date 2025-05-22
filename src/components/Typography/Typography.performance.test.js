// src/components/Typography/Typography.performance.test.js
import { describe, it, expect, vi } from 'vitest';
import Typography from './Typography';

describe('Typography performance optimizations', () => {
  it('should use partial updates for style changes', () => {
    // Setup
    const typography = Typography({
      children: 'Performance test',
      as: 'p',
    });

    // Get initial element
    const initialElement = typography.getElement();

    // Mock methods to verify they're called
    const partialUpdateSpy = vi.spyOn(typography, 'partialUpdate');
    const shouldRerenderSpy = vi.spyOn(typography, 'shouldRerender');

    // Update only the color (should use partial update)
    typography.update({ color: 'red' });

    // Verify partial update was used
    expect(shouldRerenderSpy).toHaveBeenCalledTimes(1);
    expect(shouldRerenderSpy).toHaveReturnedWith(false);
    expect(partialUpdateSpy).toHaveBeenCalledTimes(1);

    // Verify element reference is the same (no rebuild)
    expect(typography.getElement()).toBe(initialElement);

    // Verify style was updated
    expect(typography.getElement().style.color).toBe('red');
  });

  it('should do full rerender when changing element type', () => {
    // Setup
    const typography = Typography({
      children: 'Performance test',
      as: 'p',
    });

    // Get initial element
    const initialElement = typography.getElement();

    // Mock methods to verify they're called
    const partialUpdateSpy = vi.spyOn(typography, 'partialUpdate');
    const shouldRerenderSpy = vi.spyOn(typography, 'shouldRerender');

    // Update the element type (should cause full rerender)
    typography.update({ as: 'h1' });

    // Verify shouldRerender was called and returned true
    expect(shouldRerenderSpy).toHaveBeenCalledTimes(1);
    expect(shouldRerenderSpy).toHaveReturnedWith(true);

    // Verify partialUpdate was NOT called
    expect(partialUpdateSpy).not.toHaveBeenCalled();

    // Verify element reference is NOT the same (rebuild happened)
    expect(typography.getElement()).not.toBe(initialElement);

    // Verify element tag was updated
    expect(typography.getElement().tagName.toLowerCase()).toBe('h1');
  });

  it('should clean up event listeners on destroy', () => {
    // Setup with responsive sizing
    const typography = Typography({
      children: 'Performance test',
      as: 'p',
      tabletSize: '20px',
      mobileSize: '16px',
    });

    // Mock window.removeEventListener
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    // Call destroy
    typography.destroy();

    // Verify event listener was removed
    expect(removeEventListenerSpy).toHaveBeenCalledTimes(1);
    expect(removeEventListenerSpy.mock.calls[0][0]).toBe('resize');
  });
});
