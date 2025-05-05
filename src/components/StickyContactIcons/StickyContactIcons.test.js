// src/components/StickyContactIcons/StickyContactIcons.test.js
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import StickyContactIcons from './StickyContactIcons.js';

describe('StickyContactIcons', () => {
  const defaultProps = {
    location: 'Luisenstr. 1',
    phone: '0176/88778877',
    email: 'info@muchandy.de',
  };

  let stickyIcons;
  let element;

  beforeEach(() => {
    stickyIcons = new StickyContactIcons(defaultProps);
    element = stickyIcons.getElement();
    document.body.appendChild(element);
  });

  afterEach(() => {
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
  });

  it('should render correctly', () => {
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.className).toContain('sticky-contact-icons');
  });

  it('should render location icon with correct href', () => {
    const locationIcon = element.querySelector(
      '.sticky-contact-icons__icon--location'
    );
    expect(locationIcon).not.toBeNull();

    const locationLink = locationIcon.closest('a');
    expect(locationLink).not.toBeNull();
    expect(locationLink.getAttribute('data-href')).toBe('#location');
    expect(locationLink.getAttribute('title')).toBe(defaultProps.location);
  });

  it('should render phone icon with correct href', () => {
    const phoneIcon = element.querySelector(
      '.sticky-contact-icons__icon--phone'
    );
    expect(phoneIcon).not.toBeNull();

    const phoneLink = phoneIcon.closest('a');
    expect(phoneLink).not.toBeNull();
    expect(phoneLink.getAttribute('data-href')).toBe('tel:017688778877');
    expect(phoneLink.getAttribute('title')).toBe(defaultProps.phone);
  });

  it('should render email icon with correct href', () => {
    const emailIcon = element.querySelector(
      '.sticky-contact-icons__icon--email'
    );
    expect(emailIcon).not.toBeNull();

    const emailLink = emailIcon.closest('a');
    expect(emailLink).not.toBeNull();
    expect(emailLink.getAttribute('data-href')).toBe(
      `mailto:${defaultProps.email}`
    );
    expect(emailLink.getAttribute('title')).toBe(defaultProps.email);
  });

  it('should hide tooltips when showTooltips is false', () => {
    const iconsWithoutTooltips = new StickyContactIcons({
      ...defaultProps,
      showTooltips: false,
    });
    const el = iconsWithoutTooltips.getElement();

    const links = el.querySelectorAll('a');
    links.forEach((link) => {
      expect(link.getAttribute('title')).toBe('');
    });
  });

  it('should call location click handler', () => {
    const onLocationClick = vi.fn(() => false);
    const iconsWithHandler = new StickyContactIcons({
      ...defaultProps,
      onLocationClick,
    });
    const el = iconsWithHandler.getElement();
    document.body.appendChild(el);

    const locationLink = el
      .querySelector('.sticky-contact-icons__icon--location')
      .closest('a');
    locationLink.click();

    expect(onLocationClick).toHaveBeenCalledTimes(1);
    document.body.removeChild(el);
  });

  it('should call phone click handler', () => {
    const onPhoneClick = vi.fn(() => false);
    const iconsWithHandler = new StickyContactIcons({
      ...defaultProps,
      onPhoneClick,
    });
    const el = iconsWithHandler.getElement();
    document.body.appendChild(el);

    const phoneLink = el
      .querySelector('.sticky-contact-icons__icon--phone')
      .closest('a');
    phoneLink.click();

    expect(onPhoneClick).toHaveBeenCalledTimes(1);
    document.body.removeChild(el);
  });

  it('should call email click handler', () => {
    const onEmailClick = vi.fn(() => false);
    const iconsWithHandler = new StickyContactIcons({
      ...defaultProps,
      onEmailClick,
    });
    const el = iconsWithHandler.getElement();
    document.body.appendChild(el);

    const emailLink = el
      .querySelector('.sticky-contact-icons__icon--email')
      .closest('a');
    emailLink.click();

    expect(onEmailClick).toHaveBeenCalledTimes(1);
    document.body.removeChild(el);
  });

  it('should throw error if required props are missing', () => {
    expect(
      () =>
        new StickyContactIcons({
          location: 'Luisenstr. 1',
          // phone is missing
          email: 'info@muchandy.de',
        })
    ).toThrow('StickyContactIcons: Missing required props: phone');
  });

  it('should apply custom class name', () => {
    const customClass = 'custom-icons-class';
    const iconsWithClass = new StickyContactIcons({
      ...defaultProps,
      className: customClass,
    });
    const el = iconsWithClass.getElement();

    expect(el.className).toContain('sticky-contact-icons');
    expect(el.className).toContain(customClass);
  });
});
