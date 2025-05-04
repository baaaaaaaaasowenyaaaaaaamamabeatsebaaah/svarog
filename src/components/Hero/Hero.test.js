// src/components/Hero/Hero.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest';
import Hero from './Hero.js';

describe('Hero', () => {
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      title: 'Welcome to Our Site',
      subtitle: 'Discover amazing content and features',
      ctaText: 'Get Started',
      ctaLink: '/signup',
      backgroundImage: 'https://via.placeholder.com/1920x1080',
      align: 'center',
    };
  });

  it('should render correctly with all props', () => {
    const hero = new Hero(defaultProps);
    const element = hero.getElement();

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.classList.contains('hero')).toBe(true);
    expect(element.querySelector('.hero__title').textContent).toBe(
      defaultProps.title
    );
    expect(element.querySelector('.hero__subtitle').textContent).toBe(
      defaultProps.subtitle
    );
  });

  it('should apply background image when provided', () => {
    const hero = new Hero(defaultProps);
    const element = hero.getElement();

    expect(element.style.backgroundImage).toBe(
      `url(${defaultProps.backgroundImage})`
    );
    expect(element.classList.contains('hero--with-background')).toBe(true);
  });

  it('should apply alignment classes', () => {
    const alignments = ['left', 'center', 'right'];

    alignments.forEach((align) => {
      const hero = new Hero({ ...defaultProps, align });
      const element = hero.getElement();

      expect(element.classList.contains(`hero--${align}`)).toBe(true);
    });
  });

  it('should handle CTA click', () => {
    const onCtaClick = vi.fn();
    const hero = new Hero({
      ...defaultProps,
      onCtaClick,
      ctaLink: null,
    });
    const element = hero.getElement();
    const button = element.querySelector('.hero__cta');

    button.click();
    expect(onCtaClick).toHaveBeenCalled();
  });

  it('should navigate to ctaLink when clicked', () => {
    const originalLocation = window.location;
    delete window.location;
    window.location = { href: '' };

    const hero = new Hero(defaultProps);
    const element = hero.getElement();
    const button = element.querySelector('.hero__cta');

    button.click();
    expect(window.location.href).toBe(defaultProps.ctaLink);

    window.location = originalLocation;
  });

  it('should work with minimal props', () => {
    const hero = new Hero({ title: 'Simple Hero' });
    const element = hero.getElement();

    expect(element.querySelector('.hero__title').textContent).toBe(
      'Simple Hero'
    );
    expect(element.querySelector('.hero__subtitle')).toBeNull();
    expect(element.querySelector('.hero__cta')).toBeNull();
  });
});
