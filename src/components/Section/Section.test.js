// src/components/Section/Section.test.js
import { describe, it, expect } from 'vitest';
import Section from './index';

describe('Section component', () => {
  it('should create a section element', () => {
    const section = Section({ children: 'This is a section.' });
    const element = section.getElement();
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.className).toBe('section');
  });

  it('should apply minor variant class', () => {
    const section = Section({
      variant: 'minor',
      children: 'This is a minor section.',
    });
    const element = section.getElement();
    expect(element.classList.contains('section--minor')).toBe(true);
  });

  it('should append children correctly', () => {
    const section = Section({
      children: 'This is a section with children.',
    });
    const element = section.getElement();
    expect(element.querySelector('.section__content').textContent).toBe(
      'This is a section with children.'
    );
  });

  it('should apply no padding bottom class', () => {
    const section = Section({
      noPaddingBottom: true,
      children: 'This is a section.',
    });
    const element = section.getElement();
    expect(element.classList.contains('section--no-padding-bottom')).toBe(true);
  });

  it('should include background image', () => {
    const bgImage = document.createElement('img');
    bgImage.src = 'https://via.placeholder.com/150';
    bgImage.alt = 'Background Image';
    const section = Section({
      backgroundImageElement: bgImage,
      children: 'This is a section.',
    });
    const element = section.getElement();
    expect(element.querySelector('.section__background-image')).not.toBeNull();
  });

  it('should support legacy backgroundImage prop', () => {
    const bgImage = document.createElement('img');
    bgImage.src = 'https://via.placeholder.com/150';
    bgImage.alt = 'Background Image';
    const section = Section({
      backgroundImage: bgImage, // Using legacy prop
      children: 'This is a section.',
    });
    const element = section.getElement();
    expect(element.querySelector('.section__background-image')).not.toBeNull();
  });

  it('should apply custom background color', () => {
    const section = Section({
      backgroundColor: '#ff0000',
      children: 'This is a section.',
    });
    const element = section.getElement();
    expect(element.style.backgroundColor).toBe('rgb(255, 0, 0)');
  });

  it('should update section variant with setVariant method', () => {
    const section = Section({
      children: 'This is a section.',
    });

    section.setVariant('minor');

    const element = section.getElement();
    expect(element.classList.contains('section--minor')).toBe(true);
  });

  it('should update background color with setBackgroundColor method', () => {
    const section = Section({
      children: 'This is a section.',
    });

    section.setBackgroundColor('#0000ff');

    const element = section.getElement();
    expect(element.style.backgroundColor).toBe('rgb(0, 0, 255)');
  });

  it('should toggle bottom padding with setNoPaddingBottom method', () => {
    const section = Section({
      children: 'This is a section.',
    });

    section.setNoPaddingBottom(true);

    const element = section.getElement();
    expect(element.classList.contains('section--no-padding-bottom')).toBe(true);
  });

  it('should throw error for invalid variant', () => {
    expect(() => {
      Section({
        variant: 'invalid',
        children: 'Invalid variant.',
      });
    }).toThrow(/variant must be "minor" or undefined/);
  });

  it('should throw error when backgroundImageElement is not an HTMLElement', () => {
    expect(() => {
      Section({
        backgroundImageElement: 'not-an-element',
        children: 'Invalid backgroundImageElement.',
      });
    }).toThrow(/backgroundImageElement must be an HTMLElement/);
  });
});
