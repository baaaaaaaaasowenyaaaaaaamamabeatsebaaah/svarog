// src/components/MuchandyHero/MuchandyHero.test.js
import { describe, it, expect } from 'vitest';
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
    };

    // Create mock for buybackForm
    const buybackForm = {
      getElement: () => {
        const element = document.createElement('div');
        element.className = 'used-phone-price-form';
        element.textContent = 'Mock Buyback Form';
        return element;
      },
    };

    return { repairForm, buybackForm };
  };

  it('should create a muchandy hero element', () => {
    const { repairForm, buybackForm } = createMockForms();
    const hero = new MuchandyHero({ repairForm, buybackForm });
    const element = hero.getElement();

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.className).toBe('muchandy-hero');
  });

  it('should apply background image when provided', () => {
    const { repairForm, buybackForm } = createMockForms();
    const hero = new MuchandyHero({
      backgroundImage: 'test-image.jpg',
      repairForm,
      buybackForm,
    });
    const element = hero.getElement();

    expect(element.style.backgroundImage).toBe('url(test-image.jpg)');
  });

  it('should render title when provided', () => {
    const { repairForm, buybackForm } = createMockForms();
    const hero = new MuchandyHero({
      title: 'Test Title',
      repairForm,
      buybackForm,
    });
    const element = hero.getElement();

    const title = element.querySelector('.muchandy-hero__title');
    expect(title).toBeTruthy();
    expect(title.textContent).toBe('Test Title');
  });

  it('should render subtitle when provided', () => {
    const { repairForm, buybackForm } = createMockForms();
    const hero = new MuchandyHero({
      subtitle: 'Test Subtitle',
      repairForm,
      buybackForm,
    });
    const element = hero.getElement();

    const subtitle = element.querySelector('.muchandy-hero__subtitle');
    expect(subtitle).toBeTruthy();
    expect(subtitle.textContent).toBe('Test Subtitle');
  });

  it('should render tabs with repair and sell options', () => {
    const { repairForm, buybackForm } = createMockForms();
    const hero = new MuchandyHero({
      repairForm,
      buybackForm,
    });
    const element = hero.getElement();

    const tabButtons = element.querySelectorAll('.tabs__button');
    expect(tabButtons.length).toBe(2);
    expect(tabButtons[0].textContent).toBe('Reparatur');
    expect(tabButtons[1].textContent).toBe('Verkaufen');
  });

  it('should set repair tab as default', () => {
    const { repairForm, buybackForm } = createMockForms();
    const hero = new MuchandyHero({
      repairForm,
      buybackForm,
    });
    const element = hero.getElement();

    const activeButton = element.querySelector('.tabs__button--active');
    expect(activeButton.textContent).toBe('Reparatur');
  });

  it('should set sell tab as default when specified', () => {
    const { repairForm, buybackForm } = createMockForms();
    const hero = new MuchandyHero({
      defaultTab: 'sell',
      repairForm,
      buybackForm,
    });
    const element = hero.getElement();

    const activeButton = element.querySelector('.tabs__button--active');
    expect(activeButton.textContent).toBe('Verkaufen');
  });

  it('should apply custom className', () => {
    const { repairForm, buybackForm } = createMockForms();
    const hero = new MuchandyHero({
      className: 'custom-hero',
      repairForm,
      buybackForm,
    });
    const element = hero.getElement();

    expect(element.className).toBe('muchandy-hero custom-hero');
  });

  it('should render both form components', () => {
    const { repairForm, buybackForm } = createMockForms();
    const hero = new MuchandyHero({
      repairForm,
      buybackForm,
    });
    const element = hero.getElement();

    // Check for form containers - they should be in tab panels
    const tabPanels = element.querySelectorAll('.tabs__panel');
    expect(tabPanels.length).toBe(2);
  });

  it('should use a grid layout', () => {
    const { repairForm, buybackForm } = createMockForms();
    const hero = new MuchandyHero({
      repairForm,
      buybackForm,
    });
    const element = hero.getElement();

    // Check that a grid is being used
    const grid = element.querySelector('.grid');
    expect(grid).toBeTruthy();

    // Check that there's a column with width 6
    const column = element.querySelector('.column');
    expect(column).toBeTruthy();
    expect(column.style.gridColumnEnd).toBe('span 6');
  });

  it('should apply left and right margins', () => {
    const { repairForm, buybackForm } = createMockForms();
    const hero = new MuchandyHero({
      repairForm,
      buybackForm,
    });
    const element = hero.getElement();

    expect(element.style.paddingLeft).toBe('64px');
    expect(element.style.paddingRight).toBe('64px');
  });
});
