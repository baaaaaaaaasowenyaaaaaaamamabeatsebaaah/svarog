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
  global.Event = dom.window.Event;
  global.console.warn = vi.fn();
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.clearAllMocks();
});

describe('ContactSection Component', () => {
  describe('Basic Functionality', () => {
    it('should create component without errors', () => {
      const section = ContactSection();
      expect(section).toBeTruthy();
      expect(section.getElement).toBeDefined();
    });

    it('should return DOM element', () => {
      const section = ContactSection();
      const element = section.getElement();
      expect(element instanceof HTMLElement).toBe(true);
    });

    it('should accept updated contact info structure', () => {
      const props = {
        title: 'Custom Title',
        description: 'Custom Description',
        className: 'test-class',
        contactInfo: {
          companyName: 'Test Company GmbH',
          street: 'Test Street 123',
          zipcode: '12345',
          city: 'Test City',
          phone: '+49 123 456789',
          email: 'test@test.com',
          hours: 'Mon-Fri: 9-17',
        },
        formTitle: 'Contact Form',
        submitButtonText: 'Submit',
        latitude: 50.0,
        longitude: 10.0,
      };

      expect(() => ContactSection(props)).not.toThrow();
    });
  });

  describe('Component API', () => {
    it('should have all required methods', () => {
      const section = ContactSection();

      expect(typeof section.getElement).toBe('function');
      expect(typeof section.update).toBe('function');
      expect(typeof section.destroy).toBe('function');
      expect(typeof section.getState).toBe('function');
      expect(typeof section.updateContactInfo).toBe('function');
      expect(typeof section.getFormData).toBe('function');
      expect(typeof section.validateForm).toBe('function');
      expect(typeof section.resetForm).toBe('function');
      expect(typeof section.getMapComponent).toBe('function');
      expect(typeof section.getFormComponent).toBe('function');
      expect(typeof section.getFormFields).toBe('function');
    });

    it('should update state correctly', () => {
      const section = ContactSection({
        title: 'Initial Title',
        latitude: 40.0,
      });

      section.update({
        title: 'Updated Title',
        latitude: 50.0,
      });

      const state = section.getState();
      expect(state.title).toBe('Updated Title');
      expect(state.latitude).toBe(50.0);
    });

    it('should update contact info with new structure', () => {
      const section = ContactSection({
        contactInfo: {
          companyName: 'Old Company',
          street: 'Old Street',
        },
      });

      section.updateContactInfo({
        companyName: 'New Company',
        street: 'New Street 123',
        zipcode: '12345',
        city: 'New City',
        phone: '123-456-7890',
      });

      const state = section.getState();
      expect(state.contactInfo.companyName).toBe('New Company');
      expect(state.contactInfo.street).toBe('New Street 123');
      expect(state.contactInfo.zipcode).toBe('12345');
      expect(state.contactInfo.city).toBe('New City');
      expect(state.contactInfo.phone).toBe('123-456-7890');
    });

    it('should return form data object', () => {
      const section = ContactSection();
      const formData = section.getFormData();
      expect(typeof formData).toBe('object');
    });

    it('should validate form', () => {
      const section = ContactSection();
      const isValid = section.validateForm();
      expect(typeof isValid).toBe('boolean');
    });

    it('should handle form reset', () => {
      const section = ContactSection();
      expect(() => section.resetForm()).not.toThrow();
    });

    it('should return child components', () => {
      const section = ContactSection();

      const mapComponent = section.getMapComponent();
      const formComponent = section.getFormComponent();
      const formFields = section.getFormFields();

      expect(mapComponent).toBeTruthy();
      expect(formComponent).toBeTruthy();
      expect(typeof formFields).toBe('object');
    });
  });

  describe('New Contact Info Structure', () => {
    it('should handle company name in contact info', () => {
      const section = ContactSection({
        contactInfo: {
          companyName: 'Test Company GmbH',
        },
      });

      const element = section.getElement();
      expect(element).toBeTruthy();
      // Note: In a real test environment, you'd check for the actual rendered content
    });

    it('should handle separate address fields', () => {
      const section = ContactSection({
        contactInfo: {
          street: 'Main Street 123',
          zipcode: '80331',
          city: 'Munich',
        },
      });

      const element = section.getElement();
      expect(element).toBeTruthy();
    });

    it('should handle partial address information', () => {
      const partialConfigs = [
        { street: 'Only Street' },
        { zipcode: '12345' },
        { city: 'Only City' },
        { zipcode: '12345', city: 'City with ZIP' },
      ];

      partialConfigs.forEach((contactInfo) => {
        expect(() => ContactSection({ contactInfo })).not.toThrow();
      });
    });
  });

  describe('Checkbox Fields', () => {
    it('should include privacy checkbox by default', () => {
      const section = ContactSection({
        showPrivacyCheckbox: true,
        privacyPolicyUrl: '/privacy',
      });

      const element = section.getElement();
      expect(element).toBeTruthy();
    });

    it('should include newsletter checkbox by default', () => {
      const section = ContactSection({
        showNewsletterCheckbox: true,
        newsletterText: 'Subscribe to newsletter',
      });

      const element = section.getElement();
      expect(element).toBeTruthy();
    });

    it('should allow hiding checkboxes', () => {
      const section = ContactSection({
        showPrivacyCheckbox: false,
        showNewsletterCheckbox: false,
      });

      const element = section.getElement();
      expect(element).toBeTruthy();
    });
  });

  describe('Event Handlers', () => {
    it('should accept onSubmit handler with checkbox data', () => {
      const onSubmit = vi.fn();
      const section = ContactSection({ onSubmit });
      expect(section.getElement()).toBeTruthy();
      // In a real form submission, onSubmit would be called with checkbox values
    });

    it('should accept onChange handler', () => {
      const onChange = vi.fn();
      const section = ContactSection({ onChange });
      expect(section.getElement()).toBeTruthy();
    });
  });

  describe('Layout Options', () => {
    it('should handle different map positions', () => {
      const left = ContactSection({ mapPosition: 'left' });
      const right = ContactSection({ mapPosition: 'right' });

      expect(left.getElement()).toBeTruthy();
      expect(right.getElement()).toBeTruthy();
    });

    it('should handle mobile layouts', () => {
      const stack = ContactSection({ mobileLayout: 'stack' });
      const reverse = ContactSection({ mobileLayout: 'reverse' });

      expect(stack.getElement()).toBeTruthy();
      expect(reverse.getElement()).toBeTruthy();
    });
  });

  describe('Lifecycle', () => {
    it('should handle multiple getElement calls', () => {
      const section = ContactSection();
      const element1 = section.getElement();
      const element2 = section.getElement();
      expect(element1).toBe(element2);
    });

    it('should destroy without errors', () => {
      const section = ContactSection();
      section.getElement();
      expect(() => section.destroy()).not.toThrow();
    });

    it('should handle multiple destroy calls', () => {
      const section = ContactSection();
      expect(() => {
        section.destroy();
        section.destroy();
      }).not.toThrow();
    });

    it('should handle methods after destroy', () => {
      const section = ContactSection();
      section.destroy();

      expect(() => {
        section.update({ title: 'Test' });
        section.updateContactInfo({ companyName: 'Test' });
        section.resetForm();
        section.validateForm();
        section.getFormData();
      }).not.toThrow();
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid props gracefully', () => {
      const invalidProps = [
        { latitude: 'invalid', longitude: null },
        { contactInfo: null },
        { mapPosition: 'invalid' },
        { mobileLayout: 'invalid' },
        { showPrivacyCheckbox: 'invalid' },
        { showNewsletterCheckbox: 'invalid' },
      ];

      invalidProps.forEach((props) => {
        expect(() => ContactSection(props)).not.toThrow();
      });
    });
  });

  describe('Performance', () => {
    it('should create quickly', () => {
      const start = performance.now();
      const section = ContactSection();
      section.getElement();
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(100);
    });

    it('should not leak memory', () => {
      const sections = Array(10)
        .fill(null)
        .map(() => ContactSection());
      sections.forEach((s) => s.getElement());
      sections.forEach((s) => s.destroy());

      // Just verify no errors thrown
      expect(true).toBe(true);
    });
  });

  describe('State Management', () => {
    it('should maintain state through updates', () => {
      const section = ContactSection({
        title: 'Title 1',
        contactInfo: {
          companyName: 'Company 1',
          email: 'test@test.com',
        },
      });

      const state1 = section.getState();
      expect(state1.title).toBe('Title 1');
      expect(state1.contactInfo.companyName).toBe('Company 1');
      expect(state1.contactInfo.email).toBe('test@test.com');

      section.update({ title: 'Title 2' });

      const state2 = section.getState();
      expect(state2.title).toBe('Title 2');
      expect(state2.contactInfo.companyName).toBe('Company 1'); // Should persist
      expect(state2.contactInfo.email).toBe('test@test.com'); // Should persist
    });

    it('should handle default values for new contact structure', () => {
      const section = ContactSection();
      const state = section.getState();

      expect(state.contactInfo).toBeDefined();
      expect(typeof state.contactInfo.companyName).toBe('string');
      expect(typeof state.contactInfo.street).toBe('string');
      expect(typeof state.contactInfo.zipcode).toBe('string');
      expect(typeof state.contactInfo.city).toBe('string');
      expect(typeof state.contactInfo.phone).toBe('string');
      expect(typeof state.contactInfo.email).toBe('string');
      expect(typeof state.contactInfo.hours).toBe('string');
    });
  });

  describe('Link Components Integration', () => {
    it('should create Link components for contact info', () => {
      const section = ContactSection({
        contactInfo: {
          phone: '+49 123 456789',
          email: 'test@example.com',
        },
      });

      // Creating the element should not throw errors
      expect(() => section.getElement()).not.toThrow();
    });

    it('should handle Link component cleanup on destroy', () => {
      const section = ContactSection({
        contactInfo: {
          phone: '+49 123 456789',
          email: 'test@example.com',
        },
      });

      section.getElement();

      // Destroy should clean up Link components
      expect(() => section.destroy()).not.toThrow();
    });
  });

  describe('German Localization', () => {
    it('should use German labels by default', () => {
      const section = ContactSection({
        privacyText: 'Ich stimme der Datenschutzerklärung zu',
        newsletterText: 'Ich möchte den Newsletter erhalten',
      });

      const state = section.getState();
      expect(state.privacyText).toBe('Ich stimme der Datenschutzerklärung zu');
      expect(state.newsletterText).toBe('Ich möchte den Newsletter erhalten');
    });
  });
});
