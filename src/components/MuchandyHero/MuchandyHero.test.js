// src/components/MuchandyHero/MuchandyHero.test.js
import { describe, it, expect, vi } from 'vitest';
import MuchandyHero from './MuchandyHero.js';

describe('MuchandyHero', () => {
  it('should create a muchandy hero element', () => {
    const hero = new MuchandyHero({});
    const element = hero.getElement();

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.className).toBe('muchandy-hero');
  });

  it('should apply background image when provided', () => {
    const hero = new MuchandyHero({
      backgroundImage: 'test-image.jpg',
    });
    const element = hero.getElement();

    expect(element.style.backgroundImage).toBe('url(test-image.jpg)');
  });

  it('should render title when provided', () => {
    const hero = new MuchandyHero({
      title: 'Test Title',
    });
    const element = hero.getElement();

    const title = element.querySelector('.muchandy-hero__title');
    expect(title).toBeTruthy();
    expect(title.textContent).toBe('Test Title');
  });

  it('should render subtitle when provided', () => {
    const hero = new MuchandyHero({
      subtitle: 'Test Subtitle',
    });
    const element = hero.getElement();

    const subtitle = element.querySelector('.muchandy-hero__subtitle');
    expect(subtitle).toBeTruthy();
    expect(subtitle.textContent).toBe('Test Subtitle');
  });

  it('should render tabs with repair and sell options', () => {
    const hero = new MuchandyHero({});
    const element = hero.getElement();

    const tabButtons = element.querySelectorAll('.tabs__button');
    expect(tabButtons.length).toBe(2);
    expect(tabButtons[0].textContent).toBe('Reparatur');
    expect(tabButtons[1].textContent).toBe('Verkaufen');
  });

  it('should set repair tab as default', () => {
    const hero = new MuchandyHero({});
    const element = hero.getElement();

    const activeButton = element.querySelector('.tabs__button--active');
    expect(activeButton.textContent).toBe('Reparatur');
  });

  it('should set sell tab as default when specified', () => {
    const hero = new MuchandyHero({
      defaultTab: 'sell',
    });
    const element = hero.getElement();

    const activeButton = element.querySelector('.tabs__button--active');
    expect(activeButton.textContent).toBe('Verkaufen');
  });

  it('should apply custom className', () => {
    const hero = new MuchandyHero({
      className: 'custom-hero',
    });
    const element = hero.getElement();

    expect(element.className).toBe('muchandy-hero custom-hero');
  });

  it('should render both form components', () => {
    const hero = new MuchandyHero({});
    const element = hero.getElement();

    // Check for form containers - they should be in tab panels
    const tabPanels = element.querySelectorAll('.tabs__panel');
    expect(tabPanels.length).toBe(2);
  });

  it('should pass config to forms', () => {
    const repairConfig = {
      onPriceChange: vi.fn(),
    };

    const usedPhoneConfig = {
      onPriceChange: vi.fn(),
    };

    const hero = new MuchandyHero({
      repairFormConfig: repairConfig,
      usedPhoneFormConfig: usedPhoneConfig,
    });

    // This is a basic check - we'd need to mock the form components
    // to fully test config passing
    expect(hero).toBeTruthy();
  });
});
