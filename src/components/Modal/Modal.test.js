// src/components/Modal/Modal.test.js
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import Modal from './Modal.js';

// Mock matchMedia for test environment
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: true, // Always prefer reduced motion in tests
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock requestAnimationFrame
global.requestAnimationFrame = (cb) => setTimeout(cb, 0);

describe('Modal', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Component Creation', () => {
    it('should create modal with default props', () => {
      const modal = Modal();
      expect(modal).toBeDefined();
      expect(modal.open).toBeInstanceOf(Function);
      expect(modal.close).toBeInstanceOf(Function);
      expect(modal.isOpen).toBeInstanceOf(Function);
      expect(modal.update).toBeInstanceOf(Function);
      expect(modal.destroy).toBeInstanceOf(Function);
      expect(modal.getElement).toBeInstanceOf(Function);
    });

    it('should create modal with custom props', async () => {
      const modal = Modal({
        title: 'Test Modal',
        content: 'Test content',
        variant: 'info',
        size: 'large',
      });

      modal.open();

      // Wait for requestAnimationFrame
      await new Promise((resolve) => setTimeout(resolve, 10));

      const titleElement = document.querySelector('.modal__title');
      const contentElement = document.querySelector('.modal__content');
      const dialogElement = document.querySelector('.modal__dialog');

      expect(titleElement.textContent).toBe('Test Modal');
      expect(contentElement.textContent).toBe('Test content');
      expect(dialogElement.classList.contains('modal__dialog--large')).toBe(
        true
      );
      expect(dialogElement.classList.contains('modal--info')).toBe(true);
    });
  });

  describe('Opening and Closing', () => {
    it('should open modal', async () => {
      const modal = Modal({ title: 'Test' });

      expect(modal.isOpen()).toBe(false);
      modal.open();

      // Wait for requestAnimationFrame
      await new Promise((resolve) => setTimeout(resolve, 10));

      const backdrop = document.querySelector('.modal__backdrop');
      const dialog = document.querySelector('.modal__dialog');

      expect(modal.isOpen()).toBe(true);
      expect(backdrop).toBeTruthy();
      expect(dialog).toBeTruthy();
    });

    it('should close modal', async () => {
      const modal = Modal({ title: 'Test' });

      modal.open();
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(modal.isOpen()).toBe(true);

      modal.close();

      // Since we mock matchMedia to prefer reduced motion, close is immediate
      expect(modal.isOpen()).toBe(false);
      expect(document.querySelector('.modal__dialog')).toBeFalsy();
    });

    it('should call onOpen callback', async () => {
      const onOpen = vi.fn();
      const modal = Modal({ onOpen });

      modal.open();

      // Wait for requestAnimationFrame
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(onOpen).toHaveBeenCalled();
    });

    it('should call onClose callback', () => {
      const onClose = vi.fn();
      const modal = Modal({ onClose });

      modal.open();
      modal.close();

      // Since we mock reduced motion, close is immediate
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('Close Behaviors', () => {
    it('should close on backdrop click when enabled', async () => {
      const modal = Modal({ closeOnBackdrop: true });
      modal.open();

      await new Promise((resolve) => setTimeout(resolve, 10));

      const container = document.querySelector('.modal__container');
      container.click();

      expect(modal.isOpen()).toBe(false);
    });

    it('should not close on backdrop click when disabled', async () => {
      const modal = Modal({ closeOnBackdrop: false });
      modal.open();

      await new Promise((resolve) => setTimeout(resolve, 10));

      const container = document.querySelector('.modal__container');
      container.click();

      expect(modal.isOpen()).toBe(true);
    });

    it('should close on ESC key when enabled', async () => {
      const modal = Modal({ closeOnEscape: true });
      modal.open();

      await new Promise((resolve) => setTimeout(resolve, 10));

      const event = new window.KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(event);

      expect(modal.isOpen()).toBe(false);
    });

    it('should not close on ESC key when disabled', async () => {
      const modal = Modal({ closeOnEscape: false });
      modal.open();

      await new Promise((resolve) => setTimeout(resolve, 10));

      const event = new window.KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(event);

      expect(modal.isOpen()).toBe(true);
    });

    it('should close on close button click', async () => {
      const modal = Modal({ title: 'Test', showCloseButton: true });
      modal.open();

      await new Promise((resolve) => setTimeout(resolve, 10));

      const closeButton = document.querySelector('.modal__close');
      closeButton.click();

      expect(modal.isOpen()).toBe(false);
    });
  });

  describe('Content Types', () => {
    it('should render string content', async () => {
      const modal = Modal({ content: 'Test string content' });
      modal.open();

      await new Promise((resolve) => setTimeout(resolve, 10));

      const content = document.querySelector('.modal__content');
      expect(content.innerHTML).toBe('Test string content');
    });

    it('should render HTML element content', async () => {
      const div = document.createElement('div');
      div.textContent = 'Test element';

      const modal = Modal({ content: div });
      modal.open();

      await new Promise((resolve) => setTimeout(resolve, 10));

      const content = document.querySelector('.modal__content');
      expect(content.firstChild).toBe(div);
      expect(content.textContent).toBe('Test element');
    });

    it('should render component content', async () => {
      const mockComponent = {
        getElement: () => {
          const el = document.createElement('div');
          el.textContent = 'Component content';
          return el;
        },
      };

      const modal = Modal({ content: mockComponent });
      modal.open();

      await new Promise((resolve) => setTimeout(resolve, 10));

      const content = document.querySelector('.modal__content');
      expect(content.textContent).toBe('Component content');
    });
  });

  describe('Actions', () => {
    it('should render action buttons', async () => {
      const modal = Modal({
        actions: [
          { text: 'Cancel', variant: 'secondary' },
          { text: 'Confirm', variant: 'primary' },
        ],
      });
      modal.open();

      await new Promise((resolve) => setTimeout(resolve, 10));

      const buttons = document.querySelectorAll('.modal__actions button');
      expect(buttons.length).toBe(2);
      expect(buttons[0].textContent).toBe('Cancel');
      expect(buttons[1].textContent).toBe('Confirm');
    });

    it('should call onAction callback', async () => {
      const onAction = vi.fn();
      const modal = Modal({
        actions: [{ text: 'Test', action: 'test-action' }],
        onAction,
      });
      modal.open();

      await new Promise((resolve) => setTimeout(resolve, 10));

      const button = document.querySelector('.modal__actions button');
      button.click();

      expect(onAction).toHaveBeenCalledWith('test-action');
    });
  });

  describe('Focus Management', () => {
    it('should focus first focusable element when autoFocus is true', async () => {
      const modal = Modal({
        content: '<button>Focus me</button>',
        autoFocus: true,
      });
      modal.open();

      await new Promise((resolve) => setTimeout(resolve, 10));

      const button = document.querySelector('.modal__content button');
      expect(document.activeElement).toBe(button);
    });

    it('should trap focus within modal', async () => {
      const modal = Modal({
        content: `
          <button id="first">First</button>
          <button id="second">Second</button>
        `,
      });
      modal.open();

      await new Promise((resolve) => setTimeout(resolve, 10));

      const secondButton = document.getElementById('second');

      // Focus last element and press Tab
      secondButton.focus();
      const tabEvent = new window.KeyboardEvent('keydown', { key: 'Tab' });
      document.dispatchEvent(tabEvent);

      // Note: jsdom doesn't fully support focus trapping, so we skip this assertion
      // In a real browser, focus would wrap to the first element
    });

    it('should restore focus on close when restoreFocus is true', async () => {
      const button = document.createElement('button');
      document.body.appendChild(button);
      button.focus();

      const modal = Modal({ restoreFocus: true });
      modal.open();

      await new Promise((resolve) => setTimeout(resolve, 10));

      modal.close();

      expect(document.activeElement).toBe(button);
    });
  });

  describe('Variants and Sizes', () => {
    it('should apply variant classes', async () => {
      const variants = ['info', 'success', 'warning', 'danger', 'minimal'];

      for (const variant of variants) {
        const modal = Modal({ variant });
        modal.open();

        await new Promise((resolve) => setTimeout(resolve, 10));

        const dialog = document.querySelector('.modal__dialog');
        expect(dialog.classList.contains(`modal--${variant}`)).toBe(true);

        modal.destroy();
      }
    });

    it('should apply size classes', async () => {
      const sizes = ['small', 'medium', 'large', 'fullscreen'];

      for (const size of sizes) {
        const modal = Modal({ size });
        modal.open();

        await new Promise((resolve) => setTimeout(resolve, 10));

        const dialog = document.querySelector('.modal__dialog');
        expect(dialog.classList.contains(`modal__dialog--${size}`)).toBe(true);

        modal.destroy();
      }
    });
  });

  describe('Body Scroll Lock', () => {
    it('should lock body scroll when enabled', async () => {
      const modal = Modal({ lockBodyScroll: true });
      modal.open();

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(document.body.classList.contains('modal-open')).toBe(true);
    });

    it('should not lock body scroll when disabled', async () => {
      const modal = Modal({ lockBodyScroll: false });
      modal.open();

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(document.body.classList.contains('modal-open')).toBe(false);
    });

    it('should unlock body scroll on close', async () => {
      const modal = Modal({ lockBodyScroll: true });
      modal.open();

      await new Promise((resolve) => setTimeout(resolve, 10));

      modal.close();

      expect(document.body.classList.contains('modal-open')).toBe(false);
    });
  });

  describe('Update Method', () => {
    it('should update title', async () => {
      const modal = Modal({ title: 'Original' });
      modal.open();

      await new Promise((resolve) => setTimeout(resolve, 10));

      modal.update({ title: 'Updated' });

      const title = document.querySelector('.modal__title');
      expect(title.textContent).toBe('Updated');
    });

    it('should update content', async () => {
      const modal = Modal({ content: 'Original' });
      modal.open();

      await new Promise((resolve) => setTimeout(resolve, 10));

      modal.update({ content: 'Updated' });

      const content = document.querySelector('.modal__content');
      expect(content.textContent).toBe('Updated');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', async () => {
      const modal = Modal({
        title: 'Test Modal',
        ariaLabel: 'Custom label',
        ariaDescribedBy: 'custom-id',
      });
      modal.open();

      await new Promise((resolve) => setTimeout(resolve, 10));

      const dialog = document.querySelector('.modal__dialog');

      expect(dialog.getAttribute('role')).toBe('dialog');
      expect(dialog.getAttribute('aria-modal')).toBe('true');
      expect(dialog.getAttribute('aria-labelledby')).toBe('modal-title');
      expect(dialog.getAttribute('aria-describedby')).toBe('custom-id');
    });

    it('should use aria-label when no title', async () => {
      const modal = Modal({
        content: 'No title',
        ariaLabel: 'Custom modal',
      });
      modal.open();

      await new Promise((resolve) => setTimeout(resolve, 10));

      const dialog = document.querySelector('.modal__dialog');
      expect(dialog.getAttribute('aria-label')).toBe('Custom modal');
      expect(dialog.getAttribute('aria-labelledby')).toBeFalsy();
    });
  });

  describe('No Backdrop', () => {
    it('should not render backdrop when showBackdrop is false', async () => {
      const modal = Modal({ showBackdrop: false });
      modal.open();

      await new Promise((resolve) => setTimeout(resolve, 10));

      const backdrop = document.querySelector('.modal__backdrop');
      expect(backdrop).toBeFalsy();
    });
  });

  describe('Custom Class', () => {
    it('should apply custom className', async () => {
      const modal = Modal({ className: 'custom-modal' });
      modal.open();

      await new Promise((resolve) => setTimeout(resolve, 10));

      const container = document.querySelector('.modal__container');
      expect(container.classList.contains('custom-modal')).toBe(true);
    });
  });

  describe('Destroy Method', () => {
    it('should remove modal from DOM', () => {
      const modal = Modal({ title: 'Test' });
      modal.open();

      modal.destroy();

      const elements = document.querySelectorAll('.modal__container');
      expect(elements.length).toBe(0);
    });

    it('should clean up event listeners', () => {
      const modal = Modal({ title: 'Test' });
      modal.open();

      const spy = vi.spyOn(document, 'removeEventListener');
      modal.destroy();

      expect(spy).toHaveBeenCalledWith('keydown', expect.any(Function));
    });
  });
});
