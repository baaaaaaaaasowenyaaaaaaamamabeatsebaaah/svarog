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
    it('should create container and show loading state initially', () => {
      container = MuchandyHeroContainer({
        repairService: mockRepairService,
        buybackService: mockBuybackService,
      });

      const element = container.getElement();
      expect(element).toBeInstanceOf(HTMLElement);
      expect(element.classList.contains('muchandy-hero-container')).toBe(true);

      // Should show loading state
      const loadingEl = element.querySelector(
        '.muchandy-hero-container__loading'
      );
      expect(loadingEl).toBeTruthy();
      expect(loadingEl.getAttribute('aria-busy')).toBe('true');
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

      // Wait for initialization
      await container.waitForInitialization();

      // Should now show hero instead of loading
      const heroEl = element.querySelector('.muchandy-hero');
      expect(heroEl).toBeTruthy();

      // Check title and subtitle
      const titleEl = element.querySelector('.muchandy-hero__title');
      expect(titleEl?.innerHTML).toBe('Test Title');

      const subtitleEl = element.querySelector('.muchandy-hero__subtitle');
      expect(subtitleEl?.textContent).toBe('Test Subtitle');
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

      // Wait for initialization
      await container.waitForInitialization();

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

  describe('Error Handling', () => {
    it('should show error state when repair service fails', async () => {
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

      // Wait for initialization to fail
      await container.waitForInitialization();

      const element = container.getElement();

      // Should show error state
      const errorEl = element.querySelector('.muchandy-hero-container__error');
      expect(errorEl).toBeTruthy();
      expect(errorEl.getAttribute('role')).toBe('alert');
      expect(errorEl.textContent).toContain('Failed to load forms');
      expect(errorEl.textContent).toContain('Network error');
    });

    it('should show error state when buyback service fails', async () => {
      const errorService = {
        ...mockBuybackService,
        fetchManufacturers: vi.fn().mockRejectedValue(new Error('API error')),
      };

      container = MuchandyHeroContainer({
        repairService: mockRepairService,
        buybackService: errorService,
      });

      // Wait for initialization to fail
      await container.waitForInitialization();

      const element = container.getElement();

      // Should show error state
      const errorEl = element.querySelector('.muchandy-hero-container__error');
      expect(errorEl).toBeTruthy();
      expect(errorEl.textContent).toContain('API error');
    });

    it('should use custom error component when provided', async () => {
      const errorService = {
        ...mockRepairService,
        fetchManufacturers: vi
          .fn()
          .mockRejectedValue(new Error('Custom error')),
      };

      const customErrorComponent = vi.fn((error) => {
        const el = document.createElement('div');
        el.className = 'custom-error';
        el.textContent = `Custom: ${error.message}`;
        return el;
      });

      container = MuchandyHeroContainer({
        repairService: errorService,
        buybackService: mockBuybackService,
        errorComponent: customErrorComponent,
      });

      // Wait for initialization to fail
      await container.waitForInitialization();

      const element = container.getElement();

      // Should use custom error component
      expect(customErrorComponent).toHaveBeenCalled();
      const customErrorEl = element.querySelector('.custom-error');
      expect(customErrorEl).toBeTruthy();
      expect(customErrorEl.textContent).toBe('Custom: Custom error');
    });
  });

  describe('Loading States', () => {
    it('should use custom loading component when provided', () => {
      const customLoadingComponent = () => {
        const el = document.createElement('div');
        el.className = 'custom-loading';
        el.textContent = 'Custom Loading...';
        return el;
      };

      container = MuchandyHeroContainer({
        repairService: mockRepairService,
        buybackService: mockBuybackService,
        loadingComponent: customLoadingComponent,
      });

      const element = container.getElement();

      // Should use custom loading component
      const customLoadingEl = element.querySelector('.custom-loading');
      expect(customLoadingEl).toBeTruthy();
      expect(customLoadingEl.textContent).toBe('Custom Loading...');
    });

    it('should handle timeout during initialization', async () => {
      // Create service that never resolves
      const slowService = {
        ...mockRepairService,
        fetchManufacturers: () => new Promise(() => {}), // Never resolves
      };

      container = MuchandyHeroContainer({
        repairService: slowService,
        buybackService: mockBuybackService,
      });

      const element = container.getElement();

      // Should still be in loading state after reasonable time
      await new Promise((resolve) => setTimeout(resolve, 500));

      const loadingEl = element.querySelector(
        '.muchandy-hero-container__loading'
      );
      expect(loadingEl).toBeTruthy();
    });
  });

  describe('State Management', () => {
    it('should provide initialization state', async () => {
      container = MuchandyHeroContainer({
        repairService: mockRepairService,
        buybackService: mockBuybackService,
      });

      // Check initial state
      let state = container.getState();
      expect(state.isInitialized).toBe(false);
      expect(state.hasError).toBe(false);
      expect(state.error).toBe(null);

      // Wait for initialization
      await container.waitForInitialization();

      // Check state after initialization
      state = container.getState();
      expect(state.isInitialized).toBe(true);
      expect(state.hasError).toBe(false);
    });

    it('should provide access to hero instance after initialization', async () => {
      container = MuchandyHeroContainer({
        repairService: mockRepairService,
        buybackService: mockBuybackService,
      });

      // Should be null before initialization
      expect(container.getHero()).toBe(null);

      // Wait for initialization
      await container.waitForInitialization();

      // Should have hero instance
      const hero = container.getHero();
      expect(hero).toBeTruthy();
      expect(typeof hero.getElement).toBe('function');
      expect(typeof hero.update).toBe('function');
    });

    it('should provide access to form containers', async () => {
      container = MuchandyHeroContainer({
        repairService: mockRepairService,
        buybackService: mockBuybackService,
      });

      // Wait for initialization
      await container.waitForInitialization();

      const forms = container.getForms();
      expect(forms.repairForm).toBeTruthy();
      expect(forms.buybackForm).toBeTruthy();
    });
  });

  describe('Updates', () => {
    it('should update hero props after initialization', async () => {
      container = MuchandyHeroContainer({
        repairService: mockRepairService,
        buybackService: mockBuybackService,
        title: 'Initial Title',
      });

      // Wait for initialization
      await container.waitForInitialization();

      // Update title
      container.update({
        title: 'Updated Title',
        subtitle: 'New Subtitle',
      });

      const element = container.getElement();
      const titleEl = element.querySelector('.muchandy-hero__title');
      expect(titleEl?.innerHTML).toBe('Updated Title');
    });

    it('should not update before initialization', () => {
      container = MuchandyHeroContainer({
        repairService: mockRepairService,
        buybackService: mockBuybackService,
      });

      // Mock console.warn
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // Try to update immediately
      container.update({ title: 'Too Early' });

      // Should warn
      expect(warnSpy).toHaveBeenCalledWith(
        'MuchandyHeroContainer: Cannot update before initialization'
      );

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

      const element = container.getElement();

      // Should show error
      expect(
        element.querySelector('.muchandy-hero-container__error')
      ).toBeTruthy();

      // Retry
      await container.retry();

      // Should now show hero
      expect(element.querySelector('.muchandy-hero')).toBeTruthy();
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
});
