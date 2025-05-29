// src/components/Card/Card.test.js
import { describe, it, expect } from 'vitest';
import Card from './Card.js';

describe('Card component', () => {
  it('should create a card element', () => {
    const card = Card({
      children: 'Card content',
    });

    const element = card.getElement();
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.className).toBe('card');
    expect(element.textContent).toContain('Card content');
  });

  it('should render with a title', () => {
    const card = Card({
      title: 'Card Title',
      children: 'Card content',
    });

    const element = card.getElement();
    const titleElement = element.querySelector('.card__title');
    expect(titleElement).not.toBeNull();
    expect(titleElement.textContent).toBe('Card Title');
  });

  it('should render with an image from imageUrl', () => {
    const imageUrl = 'https://example.com/image.jpg';
    const card = Card({
      imageUrl,
      children: 'Card content',
    });

    const element = card.getElement();
    const imageElement = element.querySelector('img');
    expect(imageElement).not.toBeNull();
    expect(imageElement.src).toContain(imageUrl);
  });

  it('should render with an imageElement', () => {
    const imgElement = document.createElement('img');
    imgElement.src = 'https://example.com/image.jpg';
    imgElement.alt = 'Test image';

    const card = Card({
      imageElement: imgElement,
      children: 'Card content',
    });

    const element = card.getElement();
    const imageElement = element.querySelector('img');
    expect(imageElement).not.toBeNull();
    expect(imageElement).toBe(imgElement);
  });

  it('should support legacy image prop with string value', () => {
    // Setup spy for console.warn
    const originalWarn = console.warn;
    const warnMock = vi.fn();
    console.warn = warnMock;

    const imageUrl = 'https://example.com/legacy-image.jpg';
    const card = Card({
      image: imageUrl,
      children: 'Card content',
    });

    const element = card.getElement();
    const imageElement = element.querySelector('img');
    expect(imageElement).not.toBeNull();
    expect(imageElement.src).toContain(imageUrl);
    expect(warnMock).toHaveBeenCalledWith(
      '[Card] image is deprecated, use imageUrl for strings or imageElement for DOM elements'
    );

    // Restore console.warn
    console.warn = originalWarn;
  });

  it('should support legacy image prop with element value', () => {
    // Setup spy for console.warn
    const originalWarn = console.warn;
    const warnMock = vi.fn();
    console.warn = warnMock;

    const imgElement = document.createElement('img');
    imgElement.src = 'https://example.com/legacy-element.jpg';
    imgElement.alt = 'Legacy test image';

    const card = Card({
      image: imgElement,
      children: 'Card content',
    });

    const element = card.getElement();
    const imageElement = element.querySelector('img');
    expect(imageElement).not.toBeNull();
    expect(imageElement).toBe(imgElement);
    expect(warnMock).toHaveBeenCalledWith(
      '[Card] image is deprecated, use imageUrl for strings or imageElement for DOM elements'
    );

    // Restore console.warn
    console.warn = originalWarn;
  });

  it('should render with a footer', () => {
    const card = Card({
      children: 'Card content',
      footer: 'Footer content',
    });

    const element = card.getElement();
    const footerElement = element.querySelector('.card__footer');
    expect(footerElement).not.toBeNull();
    expect(footerElement.textContent).toBe('Footer content');
  });

  it('should apply outlined class when outlined is true', () => {
    const card = Card({
      children: 'Card content',
      outlined: true,
    });

    const element = card.getElement();
    expect(element.classList.contains('card--outlined')).toBe(true);
  });

  it('should apply elevated class when elevated is true', () => {
    const card = Card({
      children: 'Card content',
      elevated: true,
    });

    const element = card.getElement();
    expect(element.classList.contains('card--elevated')).toBe(true);
  });

  it('should apply additional class names', () => {
    const card = Card({
      children: 'Card content',
      className: 'custom-class',
    });

    const element = card.getElement();
    expect(element.classList.contains('custom-class')).toBe(true);
  });

  it('should throw an error when children is not provided', () => {
    expect(() => {
      Card({});
    }).toThrow('Card: children is required');
  });

  it('should update card properties when update method is called', () => {
    const card = Card({
      title: 'Original Title',
      children: 'Original content',
    });

    const element = card.getElement();
    expect(element.querySelector('.card__title').textContent).toBe(
      'Original Title'
    );

    // Mock the parent node to test element replacement
    const parent = document.createElement('div');
    parent.appendChild(element);

    const updatedCard = card.update({
      title: 'Updated Title',
      children: 'Updated content',
      elevated: true,
    });

    const updatedElement = updatedCard.getElement();
    expect(updatedElement.querySelector('.card__title').textContent).toBe(
      'Updated Title'
    );
    expect(updatedElement.textContent).toContain('Updated content');
    expect(updatedElement.classList.contains('card--elevated')).toBe(true);
  });
});
