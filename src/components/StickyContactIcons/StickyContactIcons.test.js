// src/components/StickyContactIcons/StickyContactIcons.test.js
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import StickyContactIcons from './StickyContactIcons.js';
import { removeStyles } from '../../utils/styleInjection.js';

describe('StickyContactIcons', () => {
  const defaultProps = {
    location: 'Luisenstr. 1',
    phone: '0176/88778877',
    email: 'info@muchandy.de',
  };

  let stickyIcons;
  let element;

  beforeEach(() => {
    stickyIcons = StickyContactIcons(defaultProps);
    element = stickyIcons.getElement();
    document.body.appendChild(element);
  });

  afterEach(() => {
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
    if (stickyIcons && stickyIcons.destroy) {
      stickyIcons.destroy();
    }
    // Clean up injected styles for testing
    removeStyles('stickycontacticons');
  });

  it('should render correctly', () => {
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.className).toContain('sticky-contact-icons');
  });

  it('should inject styles automatically', () => {
    // Check that styles were injected
    const injectedStyle = document.querySelector(
      '[data-svarog="stickycontacticons"]'
    );
    expect(injectedStyle).not.toBeNull();
    expect(injectedStyle.textContent).toContain('.sticky-contact-icons');
  });

  it('should render location icon with correct href', () => {
    // Find all links first and then test the first one (location)
    const links = element.querySelectorAll('a');
    expect(links.length).toBe(3);

    const locationLink = links[0];
    expect(locationLink).not.toBeNull();
    expect(locationLink.className).toContain('sticky-contact-icons__item');

    const locationIcon = locationLink.querySelector('span');
    expect(locationIcon).not.toBeNull();
    expect(locationIcon.className).toContain(
      'sticky-contact-icons__icon--location'
    );

    expect(locationLink.getAttribute('data-href')).toBe('#location');
    expect(locationLink.getAttribute('title')).toBe(defaultProps.location);
  });

  it('should render phone icon with correct href', () => {
    const links = element.querySelectorAll('a');
    const phoneLink = links[1];
    expect(phoneLink).not.toBeNull();
    expect(phoneLink.className).toContain('sticky-contact-icons__item');

    const phoneIcon = phoneLink.querySelector('span');
    expect(phoneIcon).not.toBeNull();
    expect(phoneIcon.className).toContain('sticky-contact-icons__icon--phone');

    expect(phoneLink.getAttribute('data-href')).toBe('tel:017688778877');
    expect(phoneLink.getAttribute('title')).toBe(defaultProps.phone);
  });

  it('should render email icon with correct href', () => {
    const links = element.querySelectorAll('a');
    const emailLink = links[2];
    expect(emailLink).not.toBeNull();
    expect(emailLink.className).toContain('sticky-contact-icons__item');

    const emailIcon = emailLink.querySelector('span');
    expect(emailIcon).not.toBeNull();
    expect(emailIcon.className).toContain('sticky-contact-icons__icon--email');

    expect(emailLink.getAttribute('data-href')).toBe(
      `mailto:${defaultProps.email}`
    );
    expect(emailLink.getAttribute('title')).toBe(defaultProps.email);
  });

  it('should hide tooltips when showTooltips is false', () => {
    const iconsWithoutTooltips = StickyContactIcons({
      ...defaultProps,
      showTooltips: false,
    });
    const el = iconsWithoutTooltips.getElement();

    const links = el.querySelectorAll('a');
    links.forEach((link) => {
      expect(link.getAttribute('title')).toBe('');
    });

    // Clean up
    iconsWithoutTooltips.destroy();
  });

  it('should call location click handler using onClick.location', () => {
    const locationClickHandler = vi.fn(() => false);
    const iconsWithHandler = StickyContactIcons({
      ...defaultProps,
      onClick: {
        location: locationClickHandler,
      },
    });
    const el = iconsWithHandler.getElement();
    document.body.appendChild(el);

    const links = el.querySelectorAll('a');
    const locationLink = links[0];
    expect(locationLink).not.toBeNull();
    locationLink.click();

    expect(locationClickHandler).toHaveBeenCalledTimes(1);

    // Clean up
    document.body.removeChild(el);
    iconsWithHandler.destroy();
  });

  it('should call phone click handler using onClick.phone', () => {
    const phoneClickHandler = vi.fn(() => false);
    const iconsWithHandler = StickyContactIcons({
      ...defaultProps,
      onClick: {
        phone: phoneClickHandler,
      },
    });
    const el = iconsWithHandler.getElement();
    document.body.appendChild(el);

    const links = el.querySelectorAll('a');
    const phoneLink = links[1];
    expect(phoneLink).not.toBeNull();
    phoneLink.click();

    expect(phoneClickHandler).toHaveBeenCalledTimes(1);

    // Clean up
    document.body.removeChild(el);
    iconsWithHandler.destroy();
  });

  it('should call email click handler using onClick.email', () => {
    const emailClickHandler = vi.fn(() => false);
    const iconsWithHandler = StickyContactIcons({
      ...defaultProps,
      onClick: {
        email: emailClickHandler,
      },
    });
    const el = iconsWithHandler.getElement();
    document.body.appendChild(el);

    const links = el.querySelectorAll('a');
    const emailLink = links[2];
    expect(emailLink).not.toBeNull();
    emailLink.click();

    expect(emailClickHandler).toHaveBeenCalledTimes(1);

    // Clean up
    document.body.removeChild(el);
    iconsWithHandler.destroy();
  });

  it('should support legacy location click handler (onLocationClick)', () => {
    const onLocationClick = vi.fn(() => false);
    const iconsWithHandler = StickyContactIcons({
      ...defaultProps,
      onLocationClick,
    });
    const el = iconsWithHandler.getElement();
    document.body.appendChild(el);

    const links = el.querySelectorAll('a');
    const locationLink = links[0];
    locationLink.click();

    expect(onLocationClick).toHaveBeenCalledTimes(1);

    // Clean up
    document.body.removeChild(el);
    iconsWithHandler.destroy();
  });

  it('should throw error if required props are missing', () => {
    expect(() =>
      StickyContactIcons({
        location: 'Luisenstr. 1',
        // phone is missing
        email: 'info@muchandy.de',
      })
    ).toThrow('StickyContactIcons: phone is required');
  });

  it('should apply custom class name', () => {
    const customClass = 'custom-icons-class';
    const iconsWithClass = StickyContactIcons({
      ...defaultProps,
      className: customClass,
    });
    const el = iconsWithClass.getElement();

    expect(el.className).toContain('sticky-contact-icons');
    expect(el.className).toContain(customClass);

    // Clean up
    iconsWithClass.destroy();
  });

  it('should update with new props', () => {
    const newLocation = 'New Address';

    // Update the component
    stickyIcons.update({ location: newLocation });

    // Get the updated element
    const updatedElement = stickyIcons.getElement();
    const links = updatedElement.querySelectorAll('a');
    const locationLink = links[0];

    expect(locationLink).not.toBeNull();
    expect(locationLink.getAttribute('aria-label')).toBe(
      `Go to ${newLocation} location`
    );
  });

  it('should not inject styles multiple times', () => {
    // Create multiple instances
    const icons1 = StickyContactIcons(defaultProps);
    const icons2 = StickyContactIcons(defaultProps);
    const icons3 = StickyContactIcons(defaultProps);

    // Should only have one style tag
    const styleTags = document.querySelectorAll(
      '[data-svarog="stickycontacticons"]'
    );
    expect(styleTags.length).toBe(1);

    // Clean up
    icons1.destroy();
    icons2.destroy();
    icons3.destroy();
  });
});
