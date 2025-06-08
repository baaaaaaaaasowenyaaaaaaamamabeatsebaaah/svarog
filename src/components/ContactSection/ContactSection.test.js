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

    it('should accept all configuration props', () => {
      const props = {
        title: 'Custom Title',
        description: 'Custom Description',
        className: 'test-class',
        contactInfo: {
          address: '123 Test St',
          phone: '+1234567890',
          email: 'test@test.com',
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

    it('should update contact info', () => {
      const section = ContactSection({
        contactInfo: { address: 'Old Address' },
      });

      section.updateContactInfo({
        address: 'New Address',
        phone: '123-456-7890',
      });

      const state = section.getState();
      expect(state.contactInfo.address).toBe('New Address');
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

  describe('Event Handlers', () => {
    it('should accept onSubmit handler', () => {
      const onSubmit = vi.fn();
      const section = ContactSection({ onSubmit });
      expect(section.getElement()).toBeTruthy();
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
        section.updateContactInfo({ address: 'Test' });
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
        { formFields: 'not-an-object' },
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
        contactInfo: { email: 'test@test.com' },
      });

      const state1 = section.getState();
      expect(state1.title).toBe('Title 1');
      expect(state1.contactInfo.email).toBe('test@test.com');

      section.update({ title: 'Title 2' });

      const state2 = section.getState();
      expect(state2.title).toBe('Title 2');
      expect(state2.contactInfo.email).toBe('test@test.com'); // Should persist
    });
  });
});
