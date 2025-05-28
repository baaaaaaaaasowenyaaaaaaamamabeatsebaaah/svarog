# Modal Component

A flexible, accessible modal dialog component for Svarog UI that supports various use cases including notifications, confirmations, cookie consent, and custom content.

## Features

- 🎯 **Multiple variants**: default, info, success, warning, danger, minimal
- ♿ **Fully accessible**: Focus trap, keyboard navigation, ARIA attributes
- 🎨 **Theme aware**: Inherits Svarog theme styling
- 📱 **Responsive**: Works on all screen sizes
- 🔒 **Body scroll lock**: Prevents background scrolling when open
- ⌨️ **Keyboard support**: ESC to close, TAB for navigation
- 🎭 **Backdrop options**: Click outside to close (optional)
- 🚀 **Smooth animations**: CSS transitions for open/close
- 🔧 **Flexible content**: Supports text, HTML, or components
- 📍 **Auto-positioning**: Centers automatically, with size variants

## Installation

```javascript
import { Modal } from 'svarog-ui';
```

## Basic Usage

```javascript
// Simple notification modal
const modal = Modal({
  title: 'Welcome!',
  content: 'Thank you for visiting our site.',
  variant: 'info',
});

// Open the modal
modal.open();

// Close programmatically
modal.close();
```

## API

### Props

| Prop              | Type                           | Default   | Description                                                                 |
| ----------------- | ------------------------------ | --------- | --------------------------------------------------------------------------- |
| `title`           | string                         | -         | Modal title (optional)                                                      |
| `content`         | string\|HTMLElement\|Component | -         | Modal content                                                               |
| `variant`         | string                         | 'default' | Style variant: 'default', 'info', 'success', 'warning', 'danger', 'minimal' |
| `size`            | string                         | 'medium'  | Modal size: 'small', 'medium', 'large', 'fullscreen'                        |
| `showCloseButton` | boolean                        | true      | Show close button in header                                                 |
| `closeOnBackdrop` | boolean                        | true      | Close when clicking backdrop                                                |
| `closeOnEscape`   | boolean                        | true      | Close when pressing ESC key                                                 |
| `showBackdrop`    | boolean                        | true      | Show backdrop overlay                                                       |
| `lockBodyScroll`  | boolean                        | true      | Prevent body scroll when open                                               |
| `autoFocus`       | boolean                        | true      | Auto-focus first focusable element                                          |
| `restoreFocus`    | boolean                        | true      | Restore focus to trigger element on close                                   |
| `ariaLabel`       | string                         | -         | Accessibility label                                                         |
| `ariaDescribedBy` | string                         | -         | ID of element describing the modal                                          |
| `className`       | string                         | -         | Additional CSS classes                                                      |
| `actions`         | Array                          | -         | Action buttons configuration                                                |
| `onOpen`          | Function                       | -         | Callback when modal opens                                                   |
| `onClose`         | Function                       | -         | Callback when modal closes                                                  |
| `onAction`        | Function                       | -         | Callback for action buttons                                                 |

### Methods

| Method          | Description                   |
| --------------- | ----------------------------- |
| `open()`        | Opens the modal               |
| `close()`       | Closes the modal              |
| `isOpen()`      | Returns whether modal is open |
| `update(props)` | Updates modal props           |
| `destroy()`     | Removes modal and cleans up   |
| `getElement()`  | Returns the modal element     |

## Examples

### Cookie Consent Modal

```javascript
const cookieModal = Modal({
  title: 'Cookie Consent',
  content:
    'We use cookies to improve your experience. By continuing, you agree to our cookie policy.',
  variant: 'minimal',
  size: 'small',
  closeOnBackdrop: false,
  closeOnEscape: false,
  showCloseButton: false,
  actions: [
    {
      text: 'Accept All',
      variant: 'primary',
      action: 'accept-all',
    },
    {
      text: 'Necessary Only',
      variant: 'secondary',
      action: 'necessary',
    },
  ],
  onAction: (action) => {
    if (action === 'accept-all') {
      // Set all cookies
      localStorage.setItem('cookie-consent', 'all');
    } else {
      // Set only necessary cookies
      localStorage.setItem('cookie-consent', 'necessary');
    }
    cookieModal.close();
  },
});

// Show on page load if no consent
if (!localStorage.getItem('cookie-consent')) {
  cookieModal.open();
}
```

### Confirmation Dialog

```javascript
const confirmModal = Modal({
  title: 'Confirm Delete',
  content:
    'Are you sure you want to delete this item? This action cannot be undone.',
  variant: 'danger',
  size: 'small',
  actions: [
    {
      text: 'Cancel',
      variant: 'secondary',
      action: 'cancel',
    },
    {
      text: 'Delete',
      variant: 'danger',
      action: 'delete',
    },
  ],
  onAction: async (action) => {
    if (action === 'delete') {
      await deleteItem();
      showToast('Item deleted successfully');
    }
    confirmModal.close();
  },
});
```

### Form Modal

```javascript
const formModal = Modal({
  title: 'Contact Us',
  content: Form({
    fields: [
      { name: 'name', type: 'text', label: 'Name', required: true },
      { name: 'email', type: 'email', label: 'Email', required: true },
      { name: 'message', type: 'textarea', label: 'Message', required: true },
    ],
    onSubmit: async (data) => {
      await sendMessage(data);
      formModal.close();
      showToast('Message sent successfully!');
    },
  }),
  size: 'large',
  variant: 'default',
});
```

### Image Gallery Modal

```javascript
const galleryModal = Modal({
  content: Image({
    src: '/path/to/image.jpg',
    alt: 'Gallery image',
  }),
  variant: 'minimal',
  size: 'fullscreen',
  showCloseButton: true,
  className: 'gallery-modal',
});
```

### Notification Toast

```javascript
// Helper function for toast notifications
function showToast(message, variant = 'info', duration = 3000) {
  const toast = Modal({
    content: message,
    variant: variant,
    size: 'small',
    showCloseButton: false,
    closeOnBackdrop: false,
    showBackdrop: false,
    className: 'toast-notification',
    lockBodyScroll: false,
  });

  toast.open();

  setTimeout(() => {
    toast.close();
  }, duration);

  return toast;
}

// Usage
showToast('Settings saved successfully!', 'success');
showToast('Network error occurred', 'danger');
```

### Loading Modal

```javascript
const loadingModal = Modal({
  content: `
    <div class="loading-spinner"></div>
    <p>Processing your request...</p>
  `,
  variant: 'minimal',
  size: 'small',
  showCloseButton: false,
  closeOnBackdrop: false,
  closeOnEscape: false,
  lockBodyScroll: true,
});

// Show during async operation
loadingModal.open();
await performOperation();
loadingModal.close();
```

## CSS Classes

The component uses these CSS classes for styling:

- `.modal` - Root modal element
- `.modal--[variant]` - Variant modifier (info, success, etc.)
- `.modal--[size]` - Size modifier (small, medium, large, fullscreen)
- `.modal--open` - Applied when modal is open
- `.modal__backdrop` - Backdrop overlay
- `.modal__container` - Centers the modal dialog
- `.modal__dialog` - The modal dialog box
- `.modal__header` - Modal header section
- `.modal__title` - Modal title
- `.modal__close` - Close button
- `.modal__content` - Modal content area
- `.modal__footer` - Modal footer/actions area
- `.modal__actions` - Action buttons container

## Accessibility

The Modal component follows WAI-ARIA best practices:

- Uses `role="dialog"` and `aria-modal="true"`
- Implements focus trap to keep focus within modal
- Supports keyboard navigation (Tab, Shift+Tab)
- ESC key closes modal (when enabled)
- Manages focus on open/close
- Announces to screen readers
- Prevents background interaction

## Performance Considerations

- Uses CSS transforms for smooth animations
- Lazy renders content only when opened
- Cleans up event listeners on destroy
- Minimal DOM operations
- Efficient focus management

## Browser Support

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+
- Mobile browsers

## Related Components

- [Toast](#) - Simpler notification component
- [Dialog](#) - Native dialog element wrapper
- [Drawer](#) - Slide-out panel component
- [Popover](#) - Contextual overlay component

## Migration from v3

If upgrading from Svarog v3:

- `Popup` component renamed to `Modal`
- New `variant` prop replaces custom styling
- `onConfirm`/`onCancel` replaced with `onAction`
- Better TypeScript support
- Improved accessibility
