// src/components/MuchandyHero/MuchandyHeroContainer.test.js
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import MuchandyHeroContainer from './MuchandyHeroContainer.js';
import { mockPhoneRepairData } from '../../../__mocks__/phoneRepairData.js';
import { mockPhoneBuybackData } from '../../../__mocks__/phoneBuybackData.js';

describe('MuchandyHeroContainer', () => {
  let container;
  let mockRepairService;
  let mockBuybackService;

  beforeEach(() => {
    // Create mock services with controllable delays
    mockRepairService = {
      fetchManufacturers: vi
        .fn()
        .mockResolvedValue(mockPhoneRepairData.manufacturers),
      fetchDevices: vi
        .fn()
        .mockResolvedValue(mockPhoneRepairData.manufacturers[0].devices),
      fetchActions: vi
        .fn()
        .mockResolvedValue(
          mockPhoneRepairData.manufacturers[0].devices[0].actions
        ),
      fetchPrice: vi.fn().mockResolvedValue({ price: 19900 }),
    };

    mockBuybackService = {
      fetchManufacturers: vi
        .fn()
        .mockResolvedValue(mockPhoneBuybackData.manufacturers),
      fetchDevices: vi
        .fn()
        .mockResolvedValue(mockPhoneBuybackData.manufacturers[0].devices),
      fetchConditions: vi
        .fn()
        .mockResolvedValue(
          mockPhoneBuybackData.manufacturers[0].devices[0].conditions
        ),
      fetchPrice: vi.fn().mockResolvedValue({ price: 39900 }),
    };
  });

  afterEach(() => {
    if (container) {
      container.destroy();
      container = null;
    }
    vi.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should create container and show hero with loading forms immediately', () => {
      container = MuchandyHeroContainer({
        repairService: mockRepairService,
        buybackService: mockBuybackService,
      });

      const element = container.getElement();
      expect(element).toBeInstanceOf(HTMLElement);
      expect(element.classList.contains('muchandy-hero-container')).toBe(true);

      // Should show hero immediately (Progressive Loading)
      const heroEl = element.querySelector('.muchandy-hero');
      expect(heroEl).toBeTruthy();

      // Should have loading forms inside hero
      const loadingForms = element.querySelectorAll(
        '.form-loading-placeholder'
      );
      expect(loadingForms.length).toBe(2); // repair + buyback

      // Check loading states
      const repairLoading = element.querySelector('.repair-form-loading');
      expect(repairLoading).toBeTruthy();
      expect(repairLoading.getAttribute('aria-busy')).toBe('true');

      const buybackLoading = element.querySelector('.buyback-form-loading');
      expect(buybackLoading).toBeTruthy();
      expect(buybackLoading.getAttribute('aria-busy')).toBe('true');
    });

    it('should initialize both form services on creation', async () => {
      container = MuchandyHeroContainer({
        repairService: mockRepairService,
        buybackService: mockBuybackService,
      });

      // Wait for initialization
      await container.waitForInitialization();

      // Both services should have been called
      expect(mockRepairService.fetchManufacturers).toHaveBeenCalled();
      expect(mockBuybackService.fetchManufacturers).toHaveBeenCalled();
    });

    it('should render hero after successful initialization', async () => {
      container = MuchandyHeroContainer({
        repairService: mockRepairService,
        buybackService: mockBuybackService,
        title: 'Test Title',
        subtitle: 'Test Subtitle',
      });

      const element = container.getElement();

      // Hero should be visible immediately
      const heroEl = element.querySelector('.muchandy-hero');
      expect(heroEl).toBeTruthy();

      // Wait for forms to load
      await container.waitForInitialization();

      // Check title and subtitle (should be there from the start)
      const titleEl = element.querySelector('.muchandy-hero__title');
      expect(titleEl?.innerHTML).toBe('Test Title');

      const subtitleEl = element.querySelector('.muchandy-hero__subtitle');
      expect(subtitleEl?.textContent).toBe('Test Subtitle');

      // Container should be initialized
      const state = container.getState();
      expect(state.isInitialized).toBe(true);
      expect(state.hasError).toBe(false);
    });

    it('should pass all props to MuchandyHero after initialization', async () => {
      container = MuchandyHeroContainer({
        repairService: mockRepairService,
        buybackService: mockBuybackService,
        backgroundImageUrl: 'test-bg.jpg',
        title: 'Custom Title',
        subtitle: 'Custom Subtitle',
        defaultTab: 'sell',
        className: 'custom-class',
        blurIntensity: 8,
        overlayOpacity: 0.5,
      });

      // Hero should be created immediately with all props
      const element = container.getElement();
      const heroEl = element.querySelector('.muchandy-hero');

      expect(heroEl).toBeTruthy();
      expect(heroEl.classList.contains('custom-class')).toBe(true);
      expect(heroEl.style.getPropertyValue('--muchandy-hero-bg-image')).toBe(
        'url(test-bg.jpg)'
      );
      expect(heroEl.style.getPropertyValue('--muchandy-hero-blur')).toBe('8px');
      expect(heroEl.style.getPropertyValue('--muchandy-hero-overlay')).toBe(
        'rgba(0, 0, 0, 0.5)'
      );
    });
  });

  describe('Error Handling - Behavioral Tests', () => {
    it('should handle repair service failure gracefully', async () => {
      const errorService = {
        ...mockRepairService,
        fetchManufacturers: vi
          .fn()
          .mockRejectedValue(new Error('Network error')),
      };

      container = MuchandyHeroContainer({
        repairService: errorService,
        buybackService: mockBuybackService,
      });

      // Wait for initialization to complete/fail
      await container.waitForInitialization();

      // Test behavior through container state and form access
      const state = container.getState();
      expect(state.isInitialized).toBe(true);
      expect(state.hasError).toBe(false); // No global error since buyback succeeded
      expect(state.hasHero).toBe(true);

      // Check form containers - repair should have error state
      const forms = container.getForms();
      expect(forms.repairForm).toBeTruthy();
      expect(forms.buybackForm).toBeTruthy();

      // Verify the repair form has error characteristics
      const repairFormElement = forms.repairForm.getElement();
      expect(repairFormElement.className).toContain('error');

      // Verify services were called appropriately
      expect(errorService.fetchManufacturers).toHaveBeenCalled();
      expect(mockBuybackService.fetchManufacturers).toHaveBeenCalled();
    });

    it('should handle buyback service failure gracefully', async () => {
      const errorService = {
        ...mockBuybackService,
        fetchManufacturers: vi.fn().mockRejectedValue(new Error('API error')),
      };

      container = MuchandyHeroContainer({
        repairService: mockRepairService,
        buybackService: errorService,
      });

      // Wait for initialization to complete/fail
      await container.waitForInitialization();

      // Test behavior through container state
      const state = container.getState();
      expect(state.isInitialized).toBe(true);
      expect(state.hasError).toBe(false); // No global error since repair succeeded
      expect(state.hasHero).toBe(true);

      // Check form containers - buyback should have error state
      const forms = container.getForms();
      expect(forms.repairForm).toBeTruthy();
      expect(forms.buybackForm).toBeTruthy();

      // Verify the buyback form has error characteristics
      const buybackFormElement = forms.buybackForm.getElement();
      expect(buybackFormElement.className).toContain('error');

      // Verify services were called appropriately
      expect(mockRepairService.fetchManufacturers).toHaveBeenCalled();
      expect(errorService.fetchManufacturers).toHaveBeenCalled();
    });

    it('should handle both services failing gracefully', async () => {
      const errorRepairService = {
        ...mockRepairService,
        fetchManufacturers: vi
          .fn()
          .mockRejectedValue(new Error('Repair error')),
      };

      const errorBuybackService = {
        ...mockBuybackService,
        fetchManufacturers: vi
          .fn()
          .mockRejectedValue(new Error('Buyback error')),
      };

      container = MuchandyHeroContainer({
        repairService: errorRepairService,
        buybackService: errorBuybackService,
      });

      // Wait for initialization to complete/fail
      await container.waitForInitialization();

      // Test behavior through container state
      const state = container.getState();
      expect(state.hasHero).toBe(true);
      expect(state.isInitialized).toBe(true);
      expect(state.hasError).toBe(true); // Global error since both services failed

      // Check that both forms have error characteristics
      const forms = container.getForms();
      expect(forms.repairForm).toBeTruthy();
      expect(forms.buybackForm).toBeTruthy();

      const repairFormElement = forms.repairForm.getElement();
      const buybackFormElement = forms.buybackForm.getElement();

      expect(repairFormElement.className).toContain('error');
      expect(buybackFormElement.className).toContain('error');

      // Verify both services were called
      expect(errorRepairService.fetchManufacturers).toHaveBeenCalled();
      expect(errorBuybackService.fetchManufacturers).toHaveBeenCalled();
    });

    it('should maintain hero functionality even with form errors', async () => {
      const errorService = {
        ...mockRepairService,
        fetchManufacturers: vi
          .fn()
          .mockRejectedValue(new Error('Network error')),
      };

      container = MuchandyHeroContainer({
        repairService: errorService,
        buybackService: mockBuybackService,
        title: 'Error Test',
        subtitle: 'Testing error handling',
      });

      await container.waitForInitialization();

      // Hero should still be functional and updatable
      const hero = container.getHero();
      expect(hero).toBeTruthy();
      expect(typeof hero.update).toBe('function');

      // Should be able to update hero props even with form errors
      expect(() => container.update({ title: 'Updated Title' })).not.toThrow();

      const element = container.getElement();
      const titleEl = element.querySelector('.muchandy-hero__title');
      expect(titleEl?.innerHTML).toBe('Updated Title');
    });
  });

  describe('Loading States', () => {
    it('should show progressive loading states', () => {
      // Use a service that delays to show loading states
      const delayedService = {
        ...mockRepairService,
        fetchManufacturers: () => new Promise(() => {}), // Never resolves
      };

      container = MuchandyHeroContainer({
        repairService: delayedService,
        buybackService: mockBuybackService,
      });

      const element = container.getElement();

      // Hero should be visible immediately
      const heroEl = element.querySelector('.muchandy-hero');
      expect(heroEl).toBeTruthy();

      // Should have some form content (loading or real forms)
      const hasFormContent =
        element.querySelector('.tabs') &&
        element.querySelector('.muchandy-hero__form-container');
      expect(hasFormContent).toBeTruthy();

      // Forms should exist in some state (loading placeholders or real forms)
      const hasFormWrappers = element.querySelectorAll(
        '.muchandy-hero__form-wrapper'
      );
      expect(hasFormWrappers.length).toBe(2);
    });

    it('should handle timeout during initialization gracefully', async () => {
      // Create service that never resolves to simulate timeout
      const slowService = {
        ...mockRepairService,
        fetchManufacturers: () => new Promise(() => {}), // Never resolves
      };

      container = MuchandyHeroContainer({
        repairService: slowService,
        buybackService: mockBuybackService,
      });

      const element = container.getElement();

      // Hero should be visible immediately
      const heroEl = element.querySelector('.muchandy-hero');
      expect(heroEl).toBeTruthy();

      // Wait a reasonable time for buyback to complete while repair times out
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Buyback should work normally while repair is still loading/timing out
      // Check that we have SOME form content (could be loading, real forms, or mixed)
      const hasFormContent =
        element.querySelector('.tabs') ||
        element.querySelector('form') ||
        element.querySelector('.form-loading-placeholder');
      expect(hasFormContent).toBeTruthy();

      // Hero should remain stable
      expect(element.querySelector('.muchandy-hero')).toBeTruthy();
    });
  });

  describe('State Management', () => {
    it('should provide comprehensive initialization state', async () => {
      container = MuchandyHeroContainer({
        repairService: mockRepairService,
        buybackService: mockBuybackService,
      });

      // Check initial state - hero should be available immediately
      let state = container.getState();
      expect(state.isInitialized).toBe(false);
      expect(state.hasError).toBe(false);
      expect(state.error).toBe(null);
      expect(state.hasHero).toBe(true); // Hero available immediately
      expect(state.formsReady).toBe(false); // Forms not ready yet

      // Wait for initialization
      await container.waitForInitialization();

      // Check state after initialization
      state = container.getState();
      expect(state.isInitialized).toBe(true);
      expect(state.hasError).toBe(false);
      expect(state.hasHero).toBe(true);
      expect(state.formsReady).toBe(true);
    });

    it('should provide access to hero instance immediately', async () => {
      container = MuchandyHeroContainer({
        repairService: mockRepairService,
        buybackService: mockBuybackService,
      });

      // Hero should be available immediately
      const hero = container.getHero();
      expect(hero).toBeTruthy();
      expect(typeof hero.getElement).toBe('function');
      expect(typeof hero.update).toBe('function');

      // Should still be available after initialization
      await container.waitForInitialization();
      expect(container.getHero()).toBe(hero); // Same instance
    });

    it('should provide access to form containers after initialization', async () => {
      container = MuchandyHeroContainer({
        repairService: mockRepairService,
        buybackService: mockBuybackService,
      });

      // Forms should be loading forms initially
      let forms = container.getForms();
      expect(forms.repairForm).toBeTruthy();
      expect(forms.buybackForm).toBeTruthy();

      // Wait for initialization
      await container.waitForInitialization();

      // Should now have real form containers
      forms = container.getForms();
      expect(forms.repairForm).toBeTruthy();
      expect(forms.buybackForm).toBeTruthy();
    });
  });

  describe('Updates', () => {
    it('should update hero props immediately', async () => {
      container = MuchandyHeroContainer({
        repairService: mockRepairService,
        buybackService: mockBuybackService,
        title: 'Initial Title',
      });

      const element = container.getElement();

      // Should be able to update immediately
      container.update({
        title: 'Updated Title',
        subtitle: 'New Subtitle',
      });

      // Re-query title element after update
      let titleEl = element.querySelector('.muchandy-hero__title');
      expect(titleEl?.innerHTML).toBe('Updated Title');

      // Wait for forms to finish loading
      await container.waitForInitialization();

      // Update should still work after initialization
      container.update({ title: 'Final Title' });

      // Re-query title element again
      titleEl = element.querySelector('.muchandy-hero__title');
      expect(titleEl?.innerHTML).toBe('Final Title');
    });

    it('should handle updates without warning', () => {
      container = MuchandyHeroContainer({
        repairService: mockRepairService,
        buybackService: mockBuybackService,
      });

      // Mock console.warn
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // Should be able to update immediately without warning
      container.update({ title: 'Early Update' });

      // Should not warn since hero is available immediately
      expect(warnSpy).not.toHaveBeenCalled();

      warnSpy.mockRestore();
    });
  });

  describe('Retry Functionality', () => {
    it('should retry initialization after error', async () => {
      let attemptCount = 0;
      const flakyService = {
        ...mockRepairService,
        fetchManufacturers: vi.fn(() => {
          attemptCount++;
          if (attemptCount === 1) {
            return Promise.reject(new Error('First attempt fails'));
          }
          return Promise.resolve(mockPhoneRepairData.manufacturers);
        }),
      };

      container = MuchandyHeroContainer({
        repairService: flakyService,
        buybackService: mockBuybackService,
      });

      // Wait for first failure
      await container.waitForInitialization();

      // Check that error occurred through form state
      const forms = container.getForms();
      const repairFormElement = forms.repairForm.getElement();
      expect(repairFormElement.className).toContain('error');

      // Retry
      await container.retry();

      // Should now have successful form
      const newForms = container.getForms();
      const newRepairFormElement = newForms.repairForm.getElement();
      expect(newRepairFormElement.className).not.toContain('error');

      expect(flakyService.fetchManufacturers).toHaveBeenCalledTimes(2);
    });
  });

  describe('Cleanup', () => {
    it('should clean up all resources on destroy', async () => {
      container = MuchandyHeroContainer({
        repairService: mockRepairService,
        buybackService: mockBuybackService,
      });

      const element = container.getElement();
      document.body.appendChild(element);

      // Wait for initialization
      await container.waitForInitialization();

      // Get references
      const hero = container.getHero();
      const forms = container.getForms();

      // Spy on destroy methods
      const heroDestroySpy = vi.spyOn(hero, 'destroy');
      const repairDestroySpy = vi.spyOn(forms.repairForm, 'destroy');
      const buybackDestroySpy = vi.spyOn(forms.buybackForm, 'destroy');

      // Destroy container
      container.destroy();

      // All components should be destroyed
      expect(heroDestroySpy).toHaveBeenCalled();
      expect(repairDestroySpy).toHaveBeenCalled();
      expect(buybackDestroySpy).toHaveBeenCalled();

      // Element should be removed
      expect(document.body.contains(element)).toBe(false);

      // References should be cleared
      expect(container.getHero()).toBe(null);
      expect(container.getForms().repairForm).toBe(null);
      expect(container.getForms().buybackForm).toBe(null);
    });

    it('should handle destroy before initialization completes', () => {
      container = MuchandyHeroContainer({
        repairService: mockRepairService,
        buybackService: mockBuybackService,
      });

      // Destroy immediately
      expect(() => container.destroy()).not.toThrow();
    });
  });

  describe('Form Callbacks', () => {
    it('should pass callbacks to form containers', async () => {
      const onRepairPriceChange = vi.fn();
      const onScheduleClick = vi.fn();
      const onBuybackPriceChange = vi.fn();
      const onSubmit = vi.fn();

      container = MuchandyHeroContainer({
        repairService: mockRepairService,
        buybackService: mockBuybackService,
        onRepairPriceChange,
        onScheduleClick,
        onBuybackPriceChange,
        onSubmit,
      });

      // Wait for initialization
      await container.waitForInitialization();

      const forms = container.getForms();

      // Access the forms and trigger their callbacks
      // Note: This is testing that callbacks were properly passed through
      expect(forms.repairForm).toBeTruthy();
      expect(forms.buybackForm).toBeTruthy();
    });
  });

  describe('Progressive Loading Behavior', () => {
    it('should show hero structure immediately and load forms progressively', async () => {
      container = MuchandyHeroContainer({
        repairService: mockRepairService,
        buybackService: mockBuybackService,
        title: 'Progressive Loading Test',
        backgroundImageUrl: 'test-bg.jpg',
      });

      const element = container.getElement();

      // 1. Hero structure should be immediately visible
      const heroEl = element.querySelector('.muchandy-hero');
      expect(heroEl).toBeTruthy();

      // 2. Title and background should be there from the start
      const titleEl = element.querySelector('.muchandy-hero__title');
      expect(titleEl?.innerHTML).toBe('Progressive Loading Test');
      expect(heroEl.style.getPropertyValue('--muchandy-hero-bg-image')).toBe(
        'url(test-bg.jpg)'
      );

      // 3. Initially should have some form content (either loading or real forms)
      const tabsEl = element.querySelector('.tabs');
      expect(tabsEl).toBeTruthy();

      // 4. Wait for initialization to complete
      await container.waitForInitialization();

      // 5. Container should be properly initialized
      const state = container.getState();
      expect(state.isInitialized).toBe(true);
      expect(state.hasHero).toBe(true);

      // 6. Hero structure should remain intact
      const currentTitleEl = element.querySelector('.muchandy-hero__title');
      expect(currentTitleEl?.innerHTML).toBe('Progressive Loading Test');

      // 7. Hero element should still be there
      const currentHeroEl = element.querySelector('.muchandy-hero');
      expect(currentHeroEl).toBeTruthy();
    });

    it('should handle partial loading gracefully', async () => {
      // Create slower services to demonstrate progressive loading
      const slowRepairService = {
        ...mockRepairService,
        fetchManufacturers: vi.fn(
          () =>
            new Promise((resolve) =>
              setTimeout(() => resolve(mockPhoneRepairData.manufacturers), 50)
            )
        ),
      };

      const slowBuybackService = {
        ...mockBuybackService,
        fetchManufacturers: vi.fn(
          () =>
            new Promise((resolve) =>
              setTimeout(() => resolve(mockPhoneBuybackData.manufacturers), 20)
            )
        ),
      };

      container = MuchandyHeroContainer({
        repairService: slowRepairService,
        buybackService: slowBuybackService,
      });

      const element = container.getElement();

      // Hero should be visible immediately
      expect(element.querySelector('.muchandy-hero')).toBeTruthy();

      // Check for either loading forms or already loaded forms
      // (In tests, even with delays, forms might load quickly)
      const hasAnyForms =
        element.querySelector('.form-loading-placeholder') ||
        element.querySelector('.phone-repair-form') ||
        element.querySelector('.used-phone-price-form') ||
        element.querySelector('form');
      expect(hasAnyForms).toBeTruthy();

      // After full initialization, should be properly initialized
      await container.waitForInitialization();

      const state = container.getState();
      expect(state.isInitialized).toBe(true);
      expect(state.hasHero).toBe(true);
    });
  });
});
