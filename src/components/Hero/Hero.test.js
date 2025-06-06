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
      ctaHref: '/signup',
      backgroundImageUrl: 'https://via.placeholder.com/1920x1080',
      align: 'center',
    };
  });

  it('should render correctly with all props', () => {
    const hero = Hero(defaultProps);
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
    const hero = Hero(defaultProps);
    const element = hero.getElement();

    // Browser adds quotes around URLs automatically
    expect(element.style.backgroundImage).toBe(
      `url("${defaultProps.backgroundImageUrl}")`
    );
    expect(element.classList.contains('hero--with-background')).toBe(true);
  });

  it('should apply alignment classes', () => {
    const alignments = ['left', 'center', 'right'];

    alignments.forEach((align) => {
      const hero = Hero({ ...defaultProps, align });
      const element = hero.getElement();

      expect(element.classList.contains(`hero--${align}`)).toBe(true);
    });
  });

  it('should handle CTA click', () => {
    const onClick = vi.fn();
    const hero = Hero({
      ...defaultProps,
      onClick,
      ctaHref: null,
    });
    const element = hero.getElement();
    const button = element.querySelector('.hero__cta');

    button.click();
    expect(onClick).toHaveBeenCalled();
  });

  it('should navigate to ctaHref when clicked', () => {
    const originalLocation = window.location;
    delete window.location;
    window.location = { href: '' };

    const hero = Hero(defaultProps);
    const element = hero.getElement();
    const button = element.querySelector('.hero__cta');

    button.click();
    expect(window.location.href).toBe(defaultProps.ctaHref);

    window.location = originalLocation;
  });

  it('should work with minimal props', () => {
    const hero = Hero({ title: 'Simple Hero' });
    const element = hero.getElement();

    expect(element.querySelector('.hero__title').textContent).toBe(
      'Simple Hero'
    );
    expect(element.querySelector('.hero__subtitle')).toBeNull();
    expect(element.querySelector('.hero__cta')).toBeNull();
  });

  it('should update title with setTitle method', () => {
    const hero = Hero({ title: 'Original Title' });
    hero.setTitle('New Title');
    const element = hero.getElement();

    expect(element.querySelector('.hero__title').textContent).toBe('New Title');
  });

  it('should update subtitle with setSubtitle method', () => {
    const hero = Hero({ subtitle: 'Original Subtitle' });
    hero.setSubtitle('New Subtitle');
    const element = hero.getElement();

    expect(element.querySelector('.hero__subtitle').textContent).toBe(
      'New Subtitle'
    );
  });

  it('should update background image with setBackgroundImage method', () => {
    const hero = Hero({ backgroundImageUrl: 'original.jpg' });
    hero.setBackgroundImage('new.jpg');
    const element = hero.getElement();

    // Browser adds quotes around URLs
    expect(element.style.backgroundImage).toBe('url("new.jpg")');
  });

  it('should update alignment with setAlignment method', () => {
    const hero = Hero({ align: 'center' });
    hero.setAlignment('left');
    const element = hero.getElement();

    expect(element.classList.contains('hero--left')).toBe(true);
  });

  it('should allow updating multiple props at once', () => {
    const hero = Hero({
      title: 'Original Title',
      subtitle: 'Original Subtitle',
    });
    hero.update({
      title: 'New Title',
      subtitle: 'New Subtitle',
    });

    const element = hero.getElement();
    expect(element.querySelector('.hero__title').textContent).toBe('New Title');
    expect(element.querySelector('.hero__subtitle').textContent).toBe(
      'New Subtitle'
    );
  });

  it('should clean up properly when destroyed', () => {
    const hero = Hero(defaultProps);
    const element = hero.getElement();

    // Mock removeEventListener to verify it's called
    const originalRemoveEventListener = element.removeEventListener;
    element.removeEventListener = vi.fn();

    hero.destroy();

    // Should have tried to remove listeners
    expect(element.removeEventListener).toHaveBeenCalled();

    // Restore original
    element.removeEventListener = originalRemoveEventListener;
  });

  it('should handle legacy prop backgroundImage', () => {
    const hero = Hero({
      title: 'Legacy Props',
      backgroundImage: 'legacy.jpg',
    });
    const element = hero.getElement();

    // Browser adds quotes around URLs
    expect(element.style.backgroundImage).toBe('url("legacy.jpg")');
  });

  it('should handle legacy prop ctaLink', () => {
    const originalLocation = window.location;
    delete window.location;
    window.location = { href: '' };

    const hero = Hero({
      ctaText: 'Legacy CTA',
      ctaLink: '/legacy-url',
    });
    const element = hero.getElement();
    const button = element.querySelector('.hero__cta');

    button.click();
    expect(window.location.href).toBe('/legacy-url');

    window.location = originalLocation;
  });

  it('should handle legacy prop onCtaClick', () => {
    const onCtaClick = vi.fn();
    const hero = Hero({
      ctaText: 'Legacy Click',
      onCtaClick,
    });
    const element = hero.getElement();
    const button = element.querySelector('.hero__cta');

    button.click();
    expect(onCtaClick).toHaveBeenCalled();
  });
});
