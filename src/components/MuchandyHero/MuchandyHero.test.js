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

  it('should render title with HTML when provided', () => {
    const { repairForm, buybackForm } = createMockForms();
    const hero = new MuchandyHero({
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
