// src/components/ContactInfo/ContactInfo.test.js
import { describe, it, expect, vi } from 'vitest';
import ContactInfo from './ContactInfo.js';

describe('ContactInfo', () => {
  const defaultProps = {
    location: 'Luisenstr. 1',
    phone: '0176/88778877',
    email: 'info@muchandy.de',
  };

  it('should render correctly', () => {
    const contactInfo = new ContactInfo(defaultProps);
    const element = contactInfo.getElement();

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.className).toContain('contact-info');
  });

  it('should render location as a link with default location ID', () => {
    const contactInfo = new ContactInfo(defaultProps);
    const element = contactInfo.getElement();

    const locationElement = element.querySelector(
      '.contact-info__item--location'
    );
    expect(locationElement).not.toBeNull();
    expect(locationElement.tagName).toBe('A');
    // Use dataset attribute instead of href which might not work in test environment
    expect(locationElement.dataset.href).toBe('#location');

    const locationText = locationElement.querySelector('.contact-info__text');
    expect(locationText.textContent).toBe(defaultProps.location);
  });

  it('should render location with custom location ID', () => {
    const contactInfo = new ContactInfo({
      ...defaultProps,
      locationId: 'store-location',
    });
    const element = contactInfo.getElement();

    const locationElement = element.querySelector(
      '.contact-info__item--location'
    );
    expect(locationElement.dataset.href).toBe('#store-location');
  });

  it('should render phone with correct href', () => {
    const contactInfo = new ContactInfo(defaultProps);
    const element = contactInfo.getElement();

    const phoneLink = element.querySelector('.contact-info__item--phone');
    expect(phoneLink).not.toBeNull();
    expect(phoneLink.tagName).toBe('A');
    expect(phoneLink.dataset.href).toBe('tel:017688778877');

    const phoneText = phoneLink.querySelector('.contact-info__text');
    expect(phoneText.textContent).toBe(defaultProps.phone);
  });

  it('should render email with correct href', () => {
    const contactInfo = new ContactInfo(defaultProps);
    const element = contactInfo.getElement();

    const emailLink = element.querySelector('.contact-info__item--email');
    expect(emailLink).not.toBeNull();
    expect(emailLink.tagName).toBe('A');
    expect(emailLink.dataset.href).toBe('mailto:info@muchandy.de');

    const emailText = emailLink.querySelector('.contact-info__text');
    expect(emailText.textContent).toBe(defaultProps.email);
  });

  it('should handle location click callback', () => {
    const onLocationClick = vi.fn(() => false);
    const contactInfo = new ContactInfo({
      ...defaultProps,
      onLocationClick,
    });

    const element = contactInfo.getElement();
    const locationLink = element.querySelector('.contact-info__item--location');

    // Create and dispatch a click event
    const event = new MouseEvent('click');
    Object.defineProperty(event, 'preventDefault', { value: vi.fn() });
    locationLink.dispatchEvent(event);

    expect(onLocationClick).toHaveBeenCalledTimes(1);
  });

  it('should handle phone click callback', () => {
    const onPhoneClick = vi.fn(() => false);
    const contactInfo = new ContactInfo({
      ...defaultProps,
      onPhoneClick,
    });

    const element = contactInfo.getElement();
    const phoneLink = element.querySelector('.contact-info__item--phone');

    // Create and dispatch a click event
    const event = new MouseEvent('click');
    Object.defineProperty(event, 'preventDefault', { value: vi.fn() });
    phoneLink.dispatchEvent(event);

    expect(onPhoneClick).toHaveBeenCalledTimes(1);
  });

  it('should handle email click callback', () => {
    const onEmailClick = vi.fn(() => false);
    const contactInfo = new ContactInfo({
      ...defaultProps,
      onEmailClick,
    });

    const element = contactInfo.getElement();
    const emailLink = element.querySelector('.contact-info__item--email');

    // Create and dispatch a click event
    const event = new MouseEvent('click');
    Object.defineProperty(event, 'preventDefault', { value: vi.fn() });
    emailLink.dispatchEvent(event);

    expect(onEmailClick).toHaveBeenCalledTimes(1);
  });

  it('should throw error if required props are missing', () => {
    expect(
      () =>
        new ContactInfo({
          location: 'Luisenstr. 1',
          phone: '0176/88778877',
          // email is missing
        })
    ).toThrow('ContactInfo: Missing required props: email');
  });

  it('should accept additional className', () => {
    const contactInfo = new ContactInfo({
      ...defaultProps,
      className: 'custom-class',
    });
    const element = contactInfo.getElement();

    expect(element.className).toContain('contact-info');
    expect(element.className).toContain('custom-class');
  });
});
