import { describe, it, expect } from 'vitest';
import { Section } from './Section';

describe('Section component', () => {
  it('should create a section element', () => {
    const section = new Section({ children: 'This is a section.' });
    const element = section.getElement();
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.className).toBe('section');
  });

  it('should apply minor variant class', () => {
    const section = new Section({
      variant: 'minor',
      children: 'This is a minor section.',
    });
    const element = section.getElement();
    expect(element.classList.contains('section--minor')).toBe(true);
  });

  it('should append children correctly', () => {
    const section = new Section({
      children: 'This is a section with children.',
    });
    const element = section.getElement();
    expect(element.querySelector('.section__content').textContent).toBe(
      'This is a section with children.'
    );
  });

  it('should apply no padding bottom class', () => {
    const section = new Section({
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
    const section = new Section({
      backgroundImage: bgImage,
      children: 'This is a section.',
    });
    const element = section.getElement();
    expect(element.querySelector('.section__background-image')).not.toBeNull();
  });
});
