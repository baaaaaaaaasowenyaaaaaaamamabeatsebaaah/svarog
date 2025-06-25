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
    // Create mock services
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
    it('should create container and show hero immediately', () => {
      container = MuchandyHeroContainer({
        repairService: mockRepairService,
        buybackService: mockBuybackService,
      });

      const element = container.getElement();
      expect(element).toBeInstanceOf(HTMLElement);
      expect(element.classList.contains('muchandy-hero-container')).toBe(true);

      // Should show hero immediately
      const heroEl = element.querySelector('.muchandy-hero');
      expect(heroEl).toBeTruthy();

      // Should have forms (form containers handle their own loading states)
      const hasFormContent =
        element.querySelector('.tabs') ||
        element.querySelector('.muchandy-hero__form-container');
      expect(hasFormContent).toBeTruthy();
    });

    it('should render hero with all props', () => {
      container = MuchandyHeroContainer({
        repairService: mockRepairService,
        buybackService: mockBuybackService,
        title: 'Test Title',
        subtitle: 'Test Subtitle',
        backgroundImageUrl: 'test-bg.jpg',
        defaultTab: 'sell',
        className: 'custom-class',
        blurIntensity: 8,
        overlayOpacity: 0.5,
      });

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

      const titleEl = element.querySelector('.muchandy-hero__title');
      expect(titleEl?.innerHTML).toBe('Test Title');

      const subtitleEl = element.querySelector('.muchandy-hero__subtitle');
      expect(subtitleEl?.textContent).toBe('Test Subtitle');
    });

    it('should throw error if required services are missing', () => {
      expect(() => {
        MuchandyHeroContainer({ buybackService: mockBuybackService });
      }).toThrow('MuchandyHeroContainer: repairService is required');

      expect(() => {
        MuchandyHeroContainer({ repairService: mockRepairService });
      }).toThrow('MuchandyHeroContainer: buybackService is required');
    });
  });

  describe('State Management', () => {
    it('should provide state information', () => {
      container = MuchandyHeroContainer({
        repairService: mockRepairService,
        buybackService: mockBuybackService,
      });

      const state = container.getState();
      expect(state.isInitialized).toBe(true);
      expect(state.hasHero).toBe(true);
      expect(state.hasRepairForm).toBe(true);
      expect(state.hasBuybackForm).toBe(true);
      expect(state.destroyed).toBe(false);
    });

    it('should provide access to hero instance', () => {
      container = MuchandyHeroContainer({
        repairService: mockRepairService,
        buybackService: mockBuybackService,
      });

      const hero = container.getHero();
      expect(hero).toBeTruthy();
      expect(typeof hero.getElement).toBe('function');
      expect(typeof hero.update).toBe('function');
      expect(typeof hero.destroy).toBe('function');
    });

    it('should provide access to form containers', () => {
      container = MuchandyHeroContainer({
        repairService: mockRepairService,
        buybackService: mockBuybackService,
      });

      const forms = container.getForms();
      expect(forms.repairForm).toBeTruthy();
      expect(forms.buybackForm).toBeTruthy();
      expect(typeof forms.repairForm.getElement).toBe('function');
      expect(typeof forms.buybackForm.getElement).toBe('function');
    });
  });

  describe('Updates', () => {
    it('should update hero props', () => {
      container = MuchandyHeroContainer({
        repairService: mockRepairService,
        buybackService: mockBuybackService,
        title: 'Initial Title',
        subtitle: 'Initial Subtitle', // Add initial subtitle
      });

      const element = container.getElement();

      // Verify initial state
      let titleEl = element.querySelector('.muchandy-hero__title');
      expect(titleEl?.innerHTML).toBe('Initial Title');

      let subtitleEl = element.querySelector('.muchandy-hero__subtitle');
      expect(subtitleEl?.textContent).toBe('Initial Subtitle');

      // Update props
      container.update({
        title: 'Updated Title',
        subtitle: 'New Subtitle',
      });

      // Re-query elements after update
      titleEl = element.querySelector('.muchandy-hero__title');
      expect(titleEl?.innerHTML).toBe('Updated Title');

      subtitleEl = element.querySelector('.muchandy-hero__subtitle');
      expect(subtitleEl?.textContent).toBe('New Subtitle');
    });

    it('should filter out service props on update', () => {
      container = MuchandyHeroContainer({
        repairService: mockRepairService,
        buybackService: mockBuybackService,
        title: 'Initial Title', // Add initial title
      });

      const element = container.getElement();

      // Should not throw when updating with service props
      expect(() => {
        container.update({
          repairService: {},
          buybackService: {},
          title: 'New Title',
        });
      }).not.toThrow();

      const titleEl = element.querySelector('.muchandy-hero__title');
      expect(titleEl?.innerHTML).toBe('New Title');
    });
  });

  describe('Refresh Functionality', () => {
    it('should refresh forms', () => {
      container = MuchandyHeroContainer({
        repairService: mockRepairService,
        buybackService: mockBuybackService,
      });

      const initialForms = container.getForms();
      const initialRepairForm = initialForms.repairForm;
      const initialBuybackForm = initialForms.buybackForm;

      // Spy on destroy methods
      const repairDestroySpy = vi.spyOn(initialRepairForm, 'destroy');
      const buybackDestroySpy = vi.spyOn(initialBuybackForm, 'destroy');

      container.refresh();

      // Old forms should be destroyed
      expect(repairDestroySpy).toHaveBeenCalled();
      expect(buybackDestroySpy).toHaveBeenCalled();

      // New forms should be created
      const newForms = container.getForms();
      expect(newForms.repairForm).not.toBe(initialRepairForm);
      expect(newForms.buybackForm).not.toBe(initialBuybackForm);
      expect(newForms.repairForm).toBeTruthy();
      expect(newForms.buybackForm).toBeTruthy();
    });
  });

  describe('Cleanup', () => {
    it('should clean up all resources on destroy', () => {
      container = MuchandyHeroContainer({
        repairService: mockRepairService,
        buybackService: mockBuybackService,
      });

      const element = container.getElement();
      document.body.appendChild(element);

      const hero = container.getHero();
      const forms = container.getForms();

      // Spy on destroy methods
      const heroDestroySpy = vi.spyOn(hero, 'destroy');
      const repairDestroySpy = vi.spyOn(forms.repairForm, 'destroy');
      const buybackDestroySpy = vi.spyOn(forms.buybackForm, 'destroy');

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

      // State should reflect destruction
      const state = container.getState();
      expect(state.destroyed).toBe(true);
    });

    it('should handle multiple destroy calls gracefully', () => {
      container = MuchandyHeroContainer({
        repairService: mockRepairService,
        buybackService: mockBuybackService,
      });

      // Should not throw on multiple destroy calls
      expect(() => {
        container.destroy();
        container.destroy();
      }).not.toThrow();
    });
  });

  describe('Form Callbacks', () => {
    it('should pass callbacks to form containers', () => {
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

      const forms = container.getForms();
      expect(forms.repairForm).toBeTruthy();
      expect(forms.buybackForm).toBeTruthy();

      // The callbacks are passed to the form containers
      // which handle them internally
    });
  });

  describe('Form Labels', () => {
    it('should pass custom labels to forms', () => {
      const repairFormLabels = {
        manufacturerStep: 'Brand',
        deviceStep: 'Model',
        serviceStep: 'Repair',
      };

      const buybackFormLabels = {
        manufacturerStep: 'Brand',
        deviceStep: 'Model',
        conditionStep: 'Condition',
      };

      container = MuchandyHeroContainer({
        repairService: mockRepairService,
        buybackService: mockBuybackService,
        repairFormLabels,
        buybackFormLabels,
      });

      // Labels are passed to form containers
      const element = container.getElement();
      expect(element.querySelector('.muchandy-hero')).toBeTruthy();
    });
  });

  describe('Integration', () => {
    it('should work with delayed services', async () => {
      const delayedRepairService = {
        fetchManufacturers: () =>
          new Promise((resolve) =>
            setTimeout(() => resolve(mockPhoneRepairData.manufacturers), 50)
          ),
        fetchDevices: mockRepairService.fetchDevices,
        fetchActions: mockRepairService.fetchActions,
        fetchPrice: mockRepairService.fetchPrice,
      };

      container = MuchandyHeroContainer({
        repairService: delayedRepairService,
        buybackService: mockBuybackService,
      });

      const element = container.getElement();
      const heroEl = element.querySelector('.muchandy-hero');
      expect(heroEl).toBeTruthy();

      // Forms handle their own loading states
      const hasFormContent = element.querySelector('.tabs');
      expect(hasFormContent).toBeTruthy();
    });

    it('should handle service errors gracefully', async () => {
      const errorService = {
        fetchManufacturers: () => Promise.reject(new Error('Network error')),
        fetchDevices: () => Promise.reject(new Error('Not implemented')),
        fetchActions: () => Promise.reject(new Error('Not implemented')),
        fetchPrice: () => Promise.reject(new Error('Not implemented')),
      };

      container = MuchandyHeroContainer({
        repairService: errorService,
        buybackService: mockBuybackService,
      });

      const element = container.getElement();
      const heroEl = element.querySelector('.muchandy-hero');
      expect(heroEl).toBeTruthy();

      // Hero should still be functional
      const hero = container.getHero();
      expect(hero).toBeTruthy();
    });
  });
});
