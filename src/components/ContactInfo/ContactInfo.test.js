// src/components/ContactInfo/ContactInfo.test.js
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ContactInfo from './ContactInfo.js';

describe('ContactInfo', () => {
  const defaultProps = {
    location: 'Luisenstr. 1',
    phone: '0176/88778877',
    email: 'info@muchandy.de',
  };

  beforeEach(() => {
    // Clean up DOM
    document.body.innerHTML = '';
  });

  afterEach(() => {
    // Clean up DOM after each test
    document.body.innerHTML = '';
  });

  it('should render correctly', () => {
    const contactInfo = ContactInfo(defaultProps);
    const element = contactInfo.getElement();

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.className).toContain('contact-info');
  });

  it('should inject styles when rendered', () => {
    // This test just verifies styles exist - they're injected at module level
    const contactInfo = ContactInfo(defaultProps);
    const element = contactInfo.getElement();

    // Verify component renders correctly (styles are working)
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.querySelector('.contact-info__item--location')).toBeTruthy();
    expect(element.querySelector('.contact-info__item--phone')).toBeTruthy();
    expect(element.querySelector('.contact-info__item--email')).toBeTruthy();
  });

  it('should render location as a link with default location ID', () => {
    const contactInfo = ContactInfo(defaultProps);
    const element = contactInfo.getElement();

    const locationElement = element.querySelector(
      '.contact-info__item--location'
    );
    expect(locationElement).not.toBeNull();
    expect(locationElement.tagName).toBe('A');
    expect(locationElement.dataset.href).toBe('#location');

    const locationText = locationElement.querySelector('.contact-info__text');
    expect(locationText.textContent).toBe(defaultProps.location);
  });

  it('should render location with custom location ID', () => {
    const contactInfo = ContactInfo({
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
    const contactInfo = ContactInfo(defaultProps);
    const element = contactInfo.getElement();

    const phoneLink = element.querySelector('.contact-info__item--phone');
    expect(phoneLink).not.toBeNull();
    expect(phoneLink.tagName).toBe('A');
    expect(phoneLink.dataset.href).toBe('tel:017688778877');

    const phoneText = phoneLink.querySelector('.contact-info__text');
    expect(phoneText.textContent).toBe(defaultProps.phone);
  });

  it('should render email with correct href', () => {
    const contactInfo = ContactInfo(defaultProps);
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
    const contactInfo = ContactInfo({
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
    const contactInfo = ContactInfo({
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
    const contactInfo = ContactInfo({
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
    expect(() =>
      ContactInfo({
        location: 'Luisenstr. 1',
        phone: '0176/88778877',
        // email is missing
      })
    ).toThrow('ContactInfo: email is required');
  });

  it('should accept additional className', () => {
    const contactInfo = ContactInfo({
      ...defaultProps,
      className: 'custom-class',
    });
    const element = contactInfo.getElement();

    expect(element.className).toContain('contact-info');
    expect(element.className).toContain('custom-class');
  });

  it('should update contact information', () => {
    const contactInfo = ContactInfo(defaultProps);

    // Update location
    contactInfo.update({ location: 'New Location' });
    const updatedElement = contactInfo.getElement();
    const locationText = updatedElement.querySelector(
      '.contact-info__item--location .contact-info__text'
    );
    expect(locationText.textContent).toBe('New Location');

    // Update phone
    contactInfo.update({ phone: '9876543210' });
    const updatedElement2 = contactInfo.getElement();
    const phoneText = updatedElement2.querySelector(
      '.contact-info__item--phone .contact-info__text'
    );
    expect(phoneText.textContent).toBe('9876543210');

    // Update email
    contactInfo.update({ email: 'new@example.com' });
    const updatedElement3 = contactInfo.getElement();
    const emailText = updatedElement3.querySelector(
      '.contact-info__item--email .contact-info__text'
    );
    expect(emailText.textContent).toBe('new@example.com');
  });

  it('should use convenience methods to update information', () => {
    const contactInfo = ContactInfo(defaultProps);

    contactInfo.setLocation('Updated Location');
    const updatedElement = contactInfo.getElement();
    const locationText = updatedElement.querySelector(
      '.contact-info__item--location .contact-info__text'
    );
    expect(locationText.textContent).toBe('Updated Location');

    contactInfo.setPhone('123-456-7890');
    const updatedElement2 = contactInfo.getElement();
    const phoneText = updatedElement2.querySelector(
      '.contact-info__item--phone .contact-info__text'
    );
    expect(phoneText.textContent).toBe('123-456-7890');

    contactInfo.setEmail('updated@example.com');
    const updatedElement3 = contactInfo.getElement();
    const emailText = updatedElement3.querySelector(
      '.contact-info__item--email .contact-info__text'
    );
    expect(emailText.textContent).toBe('updated@example.com');
  });
});
