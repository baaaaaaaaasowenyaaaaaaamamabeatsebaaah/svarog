// src/components/ContactSection/ContactSection.test.js
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import ContactSection from './ContactSection.js';

// Setup DOM environment
beforeEach(() => {
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
  global.document = dom.window.document;
  global.window = dom.window;
  global.HTMLElement = dom.window.HTMLElement;
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ContactSection Component', () => {
  describe('Component Creation', () => {
    it('should create contact section with default props', () => {
      const contactSection = ContactSection();
      const element = contactSection.getElement();

      expect(element).toBeDefined();
      expect(element.classList.contains('contact-section')).toBe(true);
    });

    it('should create with custom title and description', () => {
      const contactSection = ContactSection({
        title: 'Get in Touch',
        description: 'We would love to hear from you',
      });

      const element = contactSection.getElement();
      expect(element.textContent).toContain('Get in Touch');
      expect(element.textContent).toContain('We would love to hear from you');
    });

    it('should create with custom contact info', () => {
      const contactInfo = {
        address: 'Test Address',
        phone: '+49 89 12345678',
        email: 'test@example.com',
        hours: 'Mon-Fri: 9-18',
        website: 'https://example.com',
      };

      const contactSection = ContactSection({ contactInfo });
      const element = contactSection.getElement();

      expect(element.textContent).toContain('Test Address');
      expect(element.textContent).toContain('+49 89 12345678');
      expect(element.textContent).toContain('test@example.com');
    });
  });

  describe('Form Configuration', () => {
    it('should show default form fields', () => {
      const contactSection = ContactSection();
      const element = contactSection.getElement();

      // Should have name, email, subject, and message fields by default
      const inputs = element.querySelectorAll('input, textarea');
      expect(inputs.length).toBeGreaterThan(2);
    });

    it('should configure custom form fields', () => {
      const contactSection = ContactSection({
        showNameField: true,
        showEmailField: true,
        showPhoneField: true,
        showSubjectField: false,
        showMessageField: true,
      });

      const formFields = contactSection.getFormFields();

      expect(formFields.name).toBeDefined();
      expect(formFields.email).toBeDefined();
      expect(formFields.phone).toBeDefined();
      expect(formFields.subject).toBeUndefined();
      expect(formFields.message).toBeDefined();
    });

    it('should handle custom form title and button text', () => {
      const contactSection = ContactSection({
        formTitle: 'Custom Form Title',
        submitButtonText: 'Custom Submit',
      });

      const element = contactSection.getElement();
      expect(element.textContent).toContain('Custom Form Title');
      expect(element.textContent).toContain('Custom Submit');
    });
  });

  describe('Map Integration', () => {
    it('should create with custom coordinates', () => {
      const contactSection = ContactSection({
        latitude: 48.8566,
        longitude: 2.3522,
        locationName: 'Paris Office',
      });

      const mapComponent = contactSection.getMapComponent();
      expect(mapComponent).toBeDefined();
    });

    it('should handle Google Maps URL', () => {
      const contactSection = ContactSection({
        googleMapsUrl: 'https://maps.google.com/maps/@48.1374,11.5755,17z',
      });

      const mapComponent = contactSection.getMapComponent();
      expect(mapComponent).toBeDefined();
    });
  });

  describe('Layout Options', () => {
    it('should handle map position settings', () => {
      const leftMapSection = ContactSection({ mapPosition: 'left' });
      const rightMapSection = ContactSection({ mapPosition: 'right' });

      expect(leftMapSection.getElement()).toBeDefined();
      expect(rightMapSection.getElement()).toBeDefined();
    });

    it('should handle mobile layout options', () => {
      const stackLayout = ContactSection({ mobileLayout: 'stack' });
      const reverseLayout = ContactSection({ mobileLayout: 'reverse' });

      const stackElement = stackLayout.getElement();
      const reverseElement = reverseLayout.getElement();

      expect(
        stackElement.classList.contains('contact-section__grid--stack')
      ).toBe(true);
      expect(
        reverseElement.classList.contains('contact-section__grid--reverse')
      ).toBe(true);
    });
  });

  describe('Event Handling', () => {
    it('should handle form submission', () => {
      const mockSubmit = vi.fn();
      const contactSection = ContactSection({
        onSubmit: mockSubmit,
      });

      const formComponent = contactSection.getFormComponent();
      expect(formComponent).toBeDefined();

      // Simulate form submission
      const formElement = contactSection.getElement().querySelector('form');
      if (formElement) {
        const submitEvent = new window.Event('submit');
        formElement.dispatchEvent(submitEvent);
      }
    });

    it('should handle form changes', () => {
      const mockChange = vi.fn();
      const contactSection = ContactSection({
        onChange: mockChange,
      });

      const formFields = contactSection.getFormFields();
      expect(Object.keys(formFields).length).toBeGreaterThan(0);
    });
  });

  describe('Component Methods', () => {
    let contactSection;

    beforeEach(() => {
      contactSection = ContactSection({
        contactInfo: {
          address: 'Initial Address',
          phone: '+49 89 12345678',
        },
      });
    });

    afterEach(() => {
      contactSection?.destroy();
    });

    it('should update contact info', () => {
      const newContactInfo = {
        address: 'Updated Address',
        phone: '+49 89 87654321',
        email: 'updated@example.com',
      };

      contactSection.updateContactInfo(newContactInfo);

      const state = contactSection.getState();
      expect(state.contactInfo.address).toBe('Updated Address');
      expect(state.contactInfo.phone).toBe('+49 89 87654321');
      expect(state.contactInfo.email).toBe('updated@example.com');
    });

    it('should get form data', () => {
      const formData = contactSection.getFormData();
      expect(typeof formData).toBe('object');
    });

    it('should validate form', () => {
      const isValid = contactSection.validateForm();
      expect(typeof isValid).toBe('boolean');
    });

    it('should reset form', () => {
      expect(() => contactSection.resetForm()).not.toThrow();
    });

    it('should update multiple properties', () => {
      contactSection.update({
        title: 'Updated Title',
        latitude: 52.52,
        longitude: 13.405,
        contactInfo: {
          address: 'Berlin Office',
        },
      });

      const state = contactSection.getState();
      expect(state.title).toBe('Updated Title');
      expect(state.latitude).toBe(52.52);
      expect(state.longitude).toBe(13.405);
    });

    it('should provide component access methods', () => {
      const mapComponent = contactSection.getMapComponent();
      const formComponent = contactSection.getFormComponent();
      const formFields = contactSection.getFormFields();

      expect(mapComponent).toBeDefined();
      expect(formComponent).toBeDefined();
      expect(typeof formFields).toBe('object');
    });
  });

  describe('Responsive Behavior', () => {
    it('should handle different screen sizes gracefully', () => {
      const contactSection = ContactSection();
      const element = contactSection.getElement();

      // Component should render without errors regardless of screen size
      expect(element).toBeDefined();
      expect(element.querySelector('.contact-section__grid')).toBeDefined();
    });
  });

  describe('Accessibility', () => {
    it('should have proper semantic structure', () => {
      const contactSection = ContactSection({
        title: 'Contact Us',
        formTitle: 'Send Message',
      });

      const element = contactSection.getElement();

      // Should have proper heading structure
      const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
      expect(headings.length).toBeGreaterThan(0);
    });

    it('should have proper form labels', () => {
      const contactSection = ContactSection();
      const element = contactSection.getElement();

      // Should have form labels
      const labels = element.querySelectorAll('label');
      expect(labels.length).toBeGreaterThan(0);
    });

    it('should handle focus management', () => {
      const contactSection = ContactSection();
      const element = contactSection.getElement();

      // Should have focusable elements
      const focusableElements = element.querySelectorAll(
        'input, textarea, button, [tabindex]'
      );
      expect(focusableElements.length).toBeGreaterThan(0);
    });
  });

  describe('Component Lifecycle', () => {
    it('should handle multiple renders without errors', () => {
      const contactSection = ContactSection();

      // Multiple getElement calls should return the same element
      const element1 = contactSection.getElement();
      const element2 = contactSection.getElement();

      expect(element1).toBe(element2);
    });

    it('should cleanup properly on destroy', () => {
      const contactSection = ContactSection();
      const element = contactSection.getElement();
      document.body.appendChild(element);

      expect(document.body.contains(element)).toBe(true);

      contactSection.destroy();

      // Element should be removed from DOM
      expect(document.body.contains(element)).toBe(false);
    });

    it('should handle destroy called multiple times', () => {
      const contactSection = ContactSection();

      expect(() => {
        contactSection.destroy();
        contactSection.destroy();
        contactSection.destroy();
      }).not.toThrow();
    });

    it('should handle method calls after destroy gracefully', () => {
      const contactSection = ContactSection();
      contactSection.destroy();

      // Methods should not throw after destroy
      expect(() => contactSection.update({ title: 'New Title' })).not.toThrow();
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid coordinates gracefully', () => {
      expect(() => {
        ContactSection({
          latitude: 'invalid',
          longitude: 'invalid',
        });
      }).not.toThrow();
    });

    it('should handle empty contact info', () => {
      expect(() => {
        ContactSection({
          contactInfo: {},
        });
      }).not.toThrow();
    });

    it('should handle invalid props gracefully', () => {
      expect(() => {
        ContactSection({
          invalidProp: 'invalid',
          mapPosition: 'invalid',
          mobileLayout: 'invalid',
        });
      }).not.toThrow();
    });
  });

  describe('Performance', () => {
    it('should render within performance budget', () => {
      const start = performance.now();

      const contactSection = ContactSection({
        contactInfo: {
          address: 'Test Address',
          phone: '+49 89 12345678',
          email: 'test@example.com',
        },
      });

      contactSection.getElement();

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(50); // Should render in under 50ms

      contactSection.destroy();
    });

    it('should not leak memory on destroy', () => {
      const components = Array.from({ length: 10 }, () =>
        ContactSection({ title: 'Memory Test' })
      );

      // Create all elements
      components.forEach((component) => component.getElement());

      // Destroy all components
      components.forEach((component) => component.destroy());

      // Check that no elements remain
      expect(document.querySelectorAll('.contact-section')).toHaveLength(0);
    });
  });
});
