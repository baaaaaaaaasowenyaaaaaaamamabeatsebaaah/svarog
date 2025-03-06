// src/components/Card/Card.test.js
import { describe, it, expect, vi } from 'vitest';
import Card from './Card.js';

describe('Card component', () => {
  it('should create a card element', () => {
    const card = new Card({
      children: 'Card content',
    });

    const element = card.getElement();
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.className).toBe('card');
    expect(element.textContent).toContain('Card content');
  });

  it('should render with a title', () => {
    const card = new Card({
      title: 'Card Title',
      children: 'Card content',
    });

    const element = card.getElement();
    const titleElement = element.querySelector('.card__title');
    expect(titleElement).not.toBeNull();
    expect(titleElement.textContent).toBe('Card Title');
  });

  it('should render with an image from URL', () => {
    const imageUrl = 'https://example.com/image.jpg';
    const card = new Card({
      image: imageUrl,
      children: 'Card content',
    });

    const element = card.getElement();
    const imageElement = element.querySelector('img');
    expect(imageElement).not.toBeNull();
    expect(imageElement.src).toContain(imageUrl);
  });

  it('should render with an image element', () => {
    const imgElement = document.createElement('img');
    imgElement.src = 'https://example.com/image.jpg';
    imgElement.alt = 'Test image';

    const card = new Card({
      image: imgElement,
      children: 'Card content',
    });

    const element = card.getElement();
    const imageElement = element.querySelector('img');
    expect(imageElement).not.toBeNull();
    expect(imageElement).toBe(imgElement);
  });

  it('should render with a footer', () => {
    const card = new Card({
      children: 'Card content',
      footer: 'Footer content',
    });

    const element = card.getElement();
    const footerElement = element.querySelector('.card__footer');
    expect(footerElement).not.toBeNull();
    expect(footerElement.textContent).toBe('Footer content');
  });

  it('should apply outlined class when outlined is true', () => {
    const card = new Card({
      children: 'Card content',
      outlined: true,
    });

    const element = card.getElement();
    expect(element.classList.contains('card--outlined')).toBe(true);
  });

  it('should apply elevated class when elevated is true', () => {
    const card = new Card({
      children: 'Card content',
      elevated: true,
    });

    const element = card.getElement();
    expect(element.classList.contains('card--elevated')).toBe(true);
  });

  it('should apply additional class names', () => {
    const card = new Card({
      children: 'Card content',
      className: 'custom-class',
    });

    const element = card.getElement();
    expect(element.classList.contains('custom-class')).toBe(true);
  });

  it('should throw an error when children is not provided', () => {
    expect(() => {
      new Card({});
    }).toThrow('Card: children is required');
  });
});
