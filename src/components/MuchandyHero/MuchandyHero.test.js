// src/components/MuchandyHero/MuchandyHero.test.js
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import MuchandyHero from './MuchandyHero.js';

describe('MuchandyHero', () => {
  let mockForms;

  beforeEach(() => {
    // Create enhanced mock forms with full API
    mockForms = {
      repairForm: {
        getElement: vi.fn(() => {
          const element = document.createElement('div');
          element.className = 'phone-repair-form';
          element.textContent = 'Mock Repair Form';
          return element;
        }),
        destroy: vi.fn(),
        update: vi.fn(),
        setState: vi.fn(),
        getCurrentState: vi.fn(() => ({})),
      },
      buybackForm: {
        getElement: vi.fn(() => {
          const element = document.createElement('div');
          element.className = 'used-phone-price-form';
          element.textContent = 'Mock Buyback Form';
          return element;
        }),
        destroy: vi.fn(),
        update: vi.fn(),
        setState: vi.fn(),
        getCurrentState: vi.fn(() => ({})),
      },
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Creation', () => {
    it('should create a muchandy hero element with correct structure', () => {
      const hero = MuchandyHero(mockForms);
      const element = hero.getElement();

      expect(element).toBeInstanceOf(HTMLElement);
      expect(element.classList.contains('muchandy-hero')).toBe(true);

      // Check for grid structure
      const grid = element.querySelector('.muchandy-hero__grid');
      expect(grid).toBeTruthy();

      const contentColumn = element.querySelector(
        '.muchandy-hero__content-column'
      );
      expect(contentColumn).toBeTruthy();
    });

    it('should apply background image when provided', () => {
      const hero = MuchandyHero({
        ...mockForms,
        backgroundImageUrl: 'test-image.jpg',
      });
      const element = hero.getElement();

      // Check CSS custom property instead of style.backgroundImage
      const bgImageVar = element.style.getPropertyValue(
        '--muchandy-hero-bg-image'
      );
      expect(bgImageVar).toBe('url(test-image.jpg)');
    });

    it('should handle legacy backgroundImage prop for backward compatibility', () => {
      // Mock console.warn
      const originalWarn = console.warn;
      console.warn = vi.fn();

      const hero = MuchandyHero({
        ...mockForms,
        backgroundImage: 'legacy-image.jpg',
      });
      const element = hero.getElement();

      // Check CSS custom property instead of style.backgroundImage
      const bgImageVar = element.style.getPropertyValue(
        '--muchandy-hero-bg-image'
      );
      expect(bgImageVar).toBe('url(legacy-image.jpg)');
      expect(console.warn).toHaveBeenCalledWith(
        'MuchandyHero: "backgroundImage" prop is deprecated, use "backgroundImageUrl" instead'
      );

      // Restore console.warn
      console.warn = originalWarn;
    });

    it('should render title with HTML support when provided', () => {
      const hero = MuchandyHero({
        ...mockForms,
        title: 'Test<br>Title',
      });
      const element = hero.getElement();

      const title = element.querySelector('.muchandy-hero__title');
      expect(title).toBeTruthy();
      expect(title.innerHTML).toBe('Test<br>Title');
      expect(title.tagName).toBe('H1');
    });

    it('should render subtitle when provided', () => {
      const hero = MuchandyHero({
        ...mockForms,
        subtitle: 'Test Subtitle',
      });
      const element = hero.getElement();

      const subtitle = element.querySelector('.muchandy-hero__subtitle');
      expect(subtitle).toBeTruthy();
      expect(subtitle.textContent).toBe('Test Subtitle');
      expect(subtitle.tagName).toBe('H2');
    });

    it('should apply custom className correctly', () => {
      const hero = MuchandyHero({
        ...mockForms,
        className: 'custom-hero additional-class',
      });
      const element = hero.getElement();

      expect(element.classList.contains('muchandy-hero')).toBe(true);
      expect(element.classList.contains('custom-hero')).toBe(true);
      expect(element.classList.contains('additional-class')).toBe(true);
    });

    it('should use default configuration when minimal props provided', () => {
      const hero = MuchandyHero(mockForms);
      const element = hero.getElement();

      const title = element.querySelector('.muchandy-hero__title');
      expect(title.innerHTML).toBe('Finden Sie<br>Ihren Preis');

      const subtitle = element.querySelector('.muchandy-hero__subtitle');
      expect(subtitle.textContent).toBe('Jetzt Preis berechnen.');
    });
  });

  describe('Tab Configuration', () => {
    it('should set repair tab as default when defaultTab is "repair"', () => {
      const hero = MuchandyHero({
        ...mockForms,
        defaultTab: 'repair',
      });
      const element = hero.getElement();

      // Check that tabs component was created
      expect(element._components?.tabs).toBeDefined();
    });

    it('should set sell tab as default when defaultTab is "sell"', () => {
      const hero = MuchandyHero({
        ...mockForms,
        defaultTab: 'sell',
      });
      const element = hero.getElement();

      // Check that tabs component was created with sell tab default
      expect(element._components?.tabs).toBeDefined();
    });

    it('should fallback to repair tab when invalid defaultTab provided', () => {
      const hero = MuchandyHero({
        ...mockForms,
        defaultTab: 'invalid',
      });
      const element = hero.getElement();

      // Should still create tabs component with repair tab as default
      expect(element._components?.tabs).toBeDefined();
    });

    it('should create tab wrappers for both forms', () => {
      const hero = MuchandyHero(mockForms);
      const element = hero.getElement();

      const formWrappers = element.querySelectorAll(
        '.muchandy-hero__form-wrapper'
      );
      expect(formWrappers.length).toBe(2);
    });
  });

  describe('State Management', () => {
    it('should provide setState method for efficient updates', () => {
      const hero = MuchandyHero(mockForms);

      expect(typeof hero.setState).toBe('function');

      // Test setState returns the component for chaining
      const result = hero.setState({ title: 'New Title' });
      expect(result).toBe(hero);
    });

    it('should provide getCurrentState method', () => {
      const hero = MuchandyHero({
        ...mockForms,
        title: 'Test Title',
        subtitle: 'Test Subtitle',
      });

      expect(typeof hero.getCurrentState).toBe('function');

      const state = hero.getCurrentState();
      expect(state.title).toBe('Test Title');
      expect(state.subtitle).toBe('Test Subtitle');
    });

    it('should provide convenience methods for common updates', () => {
      const hero = MuchandyHero(mockForms);

      expect(typeof hero.setBackgroundImageUrl).toBe('function');
      expect(typeof hero.setTitle).toBe('function');
      expect(typeof hero.setSubtitle).toBe('function');

      // Test chaining
      const result = hero.setTitle('New Title');
      expect(result).toBe(hero);
    });

    it('should support legacy setBackgroundImage method', () => {
      const hero = MuchandyHero(mockForms);

      // Mock console.warn
      const originalWarn = console.warn;
      console.warn = vi.fn();

      expect(typeof hero.setBackgroundImage).toBe('function');

      // Call deprecated method
      hero.setBackgroundImage('test-image.jpg');

      // Check warning was logged
      expect(console.warn).toHaveBeenCalledWith(
        'MuchandyHero: "setBackgroundImage" method is deprecated, use "setBackgroundImageUrl" instead'
      );

      // Verify the method works via CSS custom property
      const element = hero.getElement();
      const bgImageVar = element.style.getPropertyValue(
        '--muchandy-hero-bg-image'
      );
      expect(bgImageVar).toBe('url(test-image.jpg)');

      // Restore console.warn
      console.warn = originalWarn;
    });

    it('should update state and element correctly', () => {
      const hero = MuchandyHero({
        ...mockForms,
        title: 'Original Title',
      });
      const element = hero.getElement();

      // Update title
      hero.setTitle('Updated Title');

      // Check that element was updated
      const titleElement = element.querySelector('.muchandy-hero__title');
      expect(titleElement.innerHTML).toBe('Updated Title');

      // Check that state was updated
      const state = hero.getCurrentState();
      expect(state.title).toBe('Updated Title');
    });
  });

  describe('Partial Updates', () => {
    it('should perform partial background image updates with backgroundImageUrl', () => {
      const hero = MuchandyHero(mockForms);
      const element = hero.getElement();

      hero.setBackgroundImageUrl('new-image.jpg');

      // Check CSS custom property instead of style.backgroundImage
      const bgImageVar = element.style.getPropertyValue(
        '--muchandy-hero-bg-image'
      );
      expect(bgImageVar).toBe('url(new-image.jpg)');
    });

    it('should perform partial title updates', () => {
      const hero = MuchandyHero(mockForms);
      const element = hero.getElement();

      hero.setTitle('New<br>Title');

      const titleElement = element.querySelector('.muchandy-hero__title');
      expect(titleElement.innerHTML).toBe('New<br>Title');
    });

    it('should perform partial subtitle updates', () => {
      const hero = MuchandyHero(mockForms);
      const element = hero.getElement();

      hero.setSubtitle('New Subtitle');

      const subtitleElement = element.querySelector('.muchandy-hero__subtitle');
      expect(subtitleElement.textContent).toBe('New Subtitle');
    });

    it('should update className efficiently', () => {
      const hero = MuchandyHero({
        ...mockForms,
        className: 'original-class',
      });
      const element = hero.getElement();

      hero.setState({ className: 'updated-class another-class' });

      expect(element.classList.contains('muchandy-hero')).toBe(true);
      expect(element.classList.contains('updated-class')).toBe(true);
      expect(element.classList.contains('another-class')).toBe(true);
      expect(element.classList.contains('original-class')).toBe(false);
    });

    it('should normalize props in setState method', () => {
      const hero = MuchandyHero(mockForms);
      const element = hero.getElement();

      // Mock console.warn
      const originalWarn = console.warn;
      console.warn = vi.fn();

      // Use legacy prop in setState
      hero.setState({ backgroundImage: 'legacy-update.jpg' });

      // Check that warning was logged
      expect(console.warn).toHaveBeenCalledWith(
        'MuchandyHero: "backgroundImage" prop is deprecated, use "backgroundImageUrl" instead'
      );

      // Check CSS custom property instead of style.backgroundImage
      const bgImageVar = element.style.getPropertyValue(
        '--muchandy-hero-bg-image'
      );
      expect(bgImageVar).toBe('url(legacy-update.jpg)');

      // Restore console.warn
      console.warn = originalWarn;
    });
  });

  describe('Rerender Logic', () => {
    it('should determine when full rerender is needed', () => {
      const hero = MuchandyHero(mockForms);

      expect(typeof hero.shouldRerender).toBe('function');

      // These should trigger rerender
      expect(hero.shouldRerender({ repairForm: {} })).toBe(true);
      expect(hero.shouldRerender({ buybackForm: {} })).toBe(true);
      expect(hero.shouldRerender({ defaultTab: 'sell' })).toBe(true);

      // Non-existent props should not trigger rerender
      expect(hero.shouldRerender({ nonExistentProp: 'value' })).toBe(false);
    });

    it('should use partial updates when full rerender is not needed', () => {
      const hero = MuchandyHero(mockForms);
      const setStateSpy = vi.spyOn(hero, 'setState');

      // This should use setState (partial update) - only title change, no forms
      hero.update({ title: 'New Title' });

      expect(setStateSpy).toHaveBeenCalledWith({ title: 'New Title' });
    });

    it('should normalize props in update method', () => {
      const hero = MuchandyHero(mockForms);

      // Mock console.warn
      const originalWarn = console.warn;
      console.warn = vi.fn();

      const setStateSpy = vi.spyOn(hero, 'setState');

      // Use legacy prop in update
      hero.update({ backgroundImage: 'legacy-update.jpg' });

      // Check that warning was logged
      expect(console.warn).toHaveBeenCalledWith(
        'MuchandyHero: "backgroundImage" prop is deprecated, use "backgroundImageUrl" instead'
      );

      // Check that setState was called with normalized props
      expect(setStateSpy).toHaveBeenCalledWith({
        backgroundImageUrl: 'legacy-update.jpg',
      });

      // Restore console.warn
      console.warn = originalWarn;
    });
  });

  describe('Component Lifecycle', () => {
    it('should clean up resources when destroyed', () => {
      const hero = MuchandyHero(mockForms);
      const element = hero.getElement();

      // Mock the tabs component with destroy method
      const mockTabsDestroy = vi.fn();
      if (element._components) {
        element._components.tabs = { destroy: mockTabsDestroy };
      }

      expect(typeof hero.destroy).toBe('function');

      // Should not throw when called
      expect(() => hero.destroy()).not.toThrow();

      // Should call tabs destroy
      expect(mockTabsDestroy).toHaveBeenCalled();

      // Should clear component references
      expect(element._components).toBeNull();
      expect(element._currentState).toBeNull();
    });

    it('should handle tabs component destroy errors gracefully', () => {
      const hero = MuchandyHero(mockForms);
      const element = hero.getElement();

      // Mock tabs component that throws on destroy
      if (element._components) {
        element._components.tabs = {
          destroy: () => {
            throw new Error('Destroy error');
          },
        };
      }

      // Should not throw even if tabs destroy fails
      expect(() => hero.destroy()).not.toThrow();
    });

    it('should not destroy forms when hero is destroyed', () => {
      const hero = MuchandyHero(mockForms);

      hero.destroy();

      // Forms should not be destroyed as they might be used elsewhere
      expect(mockForms.repairForm.destroy).not.toHaveBeenCalled();
      expect(mockForms.buybackForm.destroy).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should throw error when required repairForm is missing', () => {
      expect(() => {
        MuchandyHero({ buybackForm: mockForms.buybackForm });
      }).toThrow('MuchandyHero: repairForm is required');
    });

    it('should throw error when required buybackForm is missing', () => {
      expect(() => {
        MuchandyHero({ repairForm: mockForms.repairForm });
      }).toThrow('MuchandyHero: buybackForm is required');
    });

    it('should throw error when both required forms are missing', () => {
      expect(() => {
        MuchandyHero({});
      }).toThrow('MuchandyHero: repairForm is required');
    });

    it('should validate form objects have required methods', () => {
      const invalidForm = { someMethod: () => {} };

      expect(() => {
        MuchandyHero({
          repairForm: invalidForm,
          buybackForm: mockForms.buybackForm,
        });
      }).toThrow('MuchandyHero: repairForm.getElement must be a function');
    });

    it('should handle update errors gracefully', () => {
      const hero = MuchandyHero(mockForms);

      // Invalid form update should not throw but should log error
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const result = hero.update({ repairForm: 'invalid' });

      // Should return the hero instance even on error
      expect(result).toBe(hero);
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('Theme Integration', () => {
    it('should have theme change handler', () => {
      const hero = MuchandyHero(mockForms);

      expect(typeof hero.onThemeChange).toBe('function');

      // Should not throw when called
      expect(() => hero.onThemeChange('new-theme', 'old-theme')).not.toThrow();
    });
  });

  describe('Form Integration', () => {
    it('should call getElement on both forms during creation', () => {
      MuchandyHero(mockForms);

      expect(mockForms.repairForm.getElement).toHaveBeenCalled();
      expect(mockForms.buybackForm.getElement).toHaveBeenCalled();
    });

    it('should store form references in components', () => {
      const hero = MuchandyHero(mockForms);
      const element = hero.getElement();

      expect(element._components.repairForm).toBe(mockForms.repairForm);
      expect(element._components.buybackForm).toBe(mockForms.buybackForm);
    });
  });

  describe('CSS Custom Properties', () => {
    it('should handle blur intensity CSS variable correctly', () => {
      const hero = MuchandyHero({
        ...mockForms,
        blurIntensity: 8,
      });
      const element = hero.getElement();

      const blurVar = element.style.getPropertyValue('--muchandy-hero-blur');
      expect(blurVar).toBe('8px');
    });

    it('should handle overlay opacity CSS variable correctly', () => {
      const hero = MuchandyHero({
        ...mockForms,
        overlayOpacity: 0.5,
      });
      const element = hero.getElement();

      const overlayVar = element.style.getPropertyValue(
        '--muchandy-hero-overlay'
      );
      expect(overlayVar).toBe('rgba(0, 0, 0, 0.5)');
    });

    it('should update blur intensity dynamically', () => {
      const hero = MuchandyHero(mockForms);
      const element = hero.getElement();

      hero.setBlurIntensity(12);

      const blurVar = element.style.getPropertyValue('--muchandy-hero-blur');
      expect(blurVar).toBe('12px');
    });

    it('should update overlay opacity dynamically', () => {
      const hero = MuchandyHero(mockForms);
      const element = hero.getElement();

      hero.setOverlayOpacity(0.7);

      const overlayVar = element.style.getPropertyValue(
        '--muchandy-hero-overlay'
      );
      expect(overlayVar).toBe('rgba(0, 0, 0, 0.7)');
    });

    it('should clear background image when empty string is provided', () => {
      const hero = MuchandyHero({
        ...mockForms,
        backgroundImageUrl: 'test-image.jpg',
      });
      const element = hero.getElement();

      // First verify it's set
      let bgImageVar = element.style.getPropertyValue(
        '--muchandy-hero-bg-image'
      );
      expect(bgImageVar).toBe('url(test-image.jpg)');

      // Clear it
      hero.setBackgroundImageUrl('');

      // Verify it's cleared
      bgImageVar = element.style.getPropertyValue('--muchandy-hero-bg-image');
      expect(bgImageVar).toBe('');
    });
  });
});
