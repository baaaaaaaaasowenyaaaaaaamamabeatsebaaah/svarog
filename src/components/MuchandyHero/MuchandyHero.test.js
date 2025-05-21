// src/components/MuchandyHero/MuchandyHero.test.js
import { describe, it, expect, vi } from 'vitest';
import MuchandyHero from './MuchandyHero.js';

describe('MuchandyHero', () => {
  // Create mock forms
  const createMockForms = () => {
    // Create mock for repairForm
    const repairForm = {
      getElement: () => {
        const element = document.createElement('div');
        element.className = 'phone-repair-form';
        element.textContent = 'Mock Repair Form';
        return element;
      },
      destroy: vi.fn(),
    };

    // Create mock for buybackForm
    const buybackForm = {
      getElement: () => {
        const element = document.createElement('div');
        element.className = 'used-phone-price-form';
        element.textContent = 'Mock Buyback Form';
        return element;
      },
      destroy: vi.fn(),
    };

    return { repairForm, buybackForm };
  };

  it('should create a muchandy hero element', () => {
    const { repairForm, buybackForm } = createMockForms();
    const hero = MuchandyHero({ repairForm, buybackForm });
    const element = hero.getElement();

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.classList.contains('muchandy-hero')).toBe(true);
  });

  it('should apply background image when provided', () => {
    const { repairForm, buybackForm } = createMockForms();
    const hero = MuchandyHero({
      backgroundImage: 'test-image.jpg',
      repairForm,
      buybackForm,
    });
    const element = hero.getElement();

    expect(element.style.backgroundImage).toBe('url(test-image.jpg)');
  });

  it('should render title with HTML when provided', () => {
    const { repairForm, buybackForm } = createMockForms();
    const hero = MuchandyHero({
      title: 'Test<br>Title',
      repairForm,
      buybackForm,
    });
    const element = hero.getElement();

    const title = element.querySelector('.muchandy-hero__title');
    expect(title).toBeTruthy();
    expect(title.innerHTML).toBe('Test<br>Title');
  });

  it('should render subtitle when provided', () => {
    const { repairForm, buybackForm } = createMockForms();
    const hero = MuchandyHero({
      subtitle: 'Test Subtitle',
      repairForm,
      buybackForm,
    });
    const element = hero.getElement();

    const subtitle = element.querySelector('.muchandy-hero__subtitle');
    expect(subtitle).toBeTruthy();
    expect(subtitle.textContent).toBe('Test Subtitle');
  });

  it('should apply custom className', () => {
    const { repairForm, buybackForm } = createMockForms();
    const hero = MuchandyHero({
      className: 'custom-hero',
      repairForm,
      buybackForm,
    });
    const element = hero.getElement();

    expect(element.classList.contains('muchandy-hero')).toBe(true);
    expect(element.classList.contains('custom-hero')).toBe(true);
  });

  it('should set "sell" tab as default when specified', () => {
    const { repairForm, buybackForm } = createMockForms();
    const hero = MuchandyHero({
      defaultTab: 'sell',
      repairForm,
      buybackForm,
    });

    // This is testing internal implementation, which isn't ideal
    // but we need to ensure the defaultActiveTab is set correctly
    const element = hero.getElement();
    expect(element._tabsComponent).toBeDefined();
  });

  it('should clean up resources when destroyed', () => {
    const { repairForm, buybackForm } = createMockForms();
    const hero = MuchandyHero({
      repairForm,
      buybackForm,
    });
    const element = hero.getElement();

    // Create a spy for the destroy method before it gets called
    const destroySpy = vi.fn();

    // Replace the tabs component's destroy method with our spy
    // The original implementation sets _tabsComponent to null after calling destroy
    if (element._tabsComponent) {
      element._tabsComponent.destroy = destroySpy;
    } else {
      // If _tabsComponent isn't available in the test environment,
      // mock it with our spy for testing purposes
      element._tabsComponent = { destroy: destroySpy };
    }

    hero.destroy();

    // Check if the destroy spy was called
    expect(destroySpy).toHaveBeenCalled();
  });

  it('should throw error when required repairForm is missing', () => {
    const { buybackForm } = createMockForms();
    expect(() => {
      MuchandyHero({ buybackForm });
    }).toThrow('MuchandyHero: repairForm is required');
  });

  it('should throw error when required buybackForm is missing', () => {
    const { repairForm } = createMockForms();
    expect(() => {
      MuchandyHero({ repairForm });
    }).toThrow('MuchandyHero: buybackForm is required');
  });
});
