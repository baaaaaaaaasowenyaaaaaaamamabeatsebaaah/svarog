// src/components/Modal/Modal.stories.js
import Modal from './Modal.js';
import Button from '../Button/index.js';
import Form from '../Form/index.js';
import Input from '../Input/index.js';
import Select from '../Select/index.js';

export default {
  title: 'Components/Modal',
  component: Modal,
};

// Default modal
export const Default = () => {
  const triggerButton = Button({
    text: 'Open Modal',
    variant: 'primary',
  });

  const modal = Modal({
    title: 'Default Modal',
    content:
      'This is a default modal dialog. Click the X button, press ESC, or click outside to close.',
    actions: [
      { text: 'Cancel', variant: 'secondary', action: 'cancel' },
      { text: 'Confirm', variant: 'primary', action: 'confirm' },
    ],
    onAction: (action) => {
      console.log('Action:', action);
      modal.close();
    },
  });

  triggerButton.getElement().addEventListener('click', () => modal.open());

  return triggerButton.getElement();
};

// Cookie consent modal
export const CookieConsent = () => {
  const modal = Modal({
    title: 'Cookie Consent',
    content: `
      <p>We use cookies to improve your experience on our website. By continuing to browse, you agree to our use of cookies.</p>
      <p><a href="/privacy-policy" target="_blank">Learn more about our Privacy Policy</a></p>
    `,
    variant: 'minimal',
    size: 'small',
    closeOnBackdrop: false,
    closeOnEscape: false,
    showCloseButton: false,
    actions: [
      { text: 'Necessary Only', variant: 'secondary', action: 'necessary' },
      { text: 'Accept All', variant: 'primary', action: 'accept-all' },
    ],
    onAction: (action) => {
      console.log('Cookie consent:', action);
      localStorage.setItem('cookie-consent', action);
      modal.close();
    },
  });

  // Auto-open after a short delay
  setTimeout(() => modal.open(), 500);

  const container = document.createElement('div');
  container.innerHTML =
    '<p>Cookie consent modal will appear automatically...</p>';
  return container;
};

// Confirmation dialog
export const ConfirmationDialog = () => {
  const deleteButton = Button({
    text: 'Delete Item',
    variant: 'danger',
  });

  const modal = Modal({
    title: 'Confirm Delete',
    content:
      'Are you sure you want to delete this item? This action cannot be undone.',
    variant: 'danger',
    size: 'small',
    actions: [
      { text: 'Cancel', variant: 'secondary', action: 'cancel' },
      { text: 'Delete', variant: 'danger', action: 'delete' },
    ],
    onAction: (action) => {
      if (action === 'delete') {
        console.log('Item deleted!');
        showToast('Item deleted successfully', 'success');
      }
      modal.close();
    },
  });

  deleteButton.getElement().addEventListener('click', () => modal.open());

  return deleteButton.getElement();
};

// Success notification
export const SuccessNotification = () => {
  const button = Button({
    text: 'Save Settings',
    variant: 'primary',
  });

  button.getElement().addEventListener('click', () => {
    const modal = Modal({
      content: '✓ Settings saved successfully!',
      variant: 'success',
      size: 'small',
      showCloseButton: false,
      showBackdrop: false,
      lockBodyScroll: false,
      className: 'toast-notification',
    });

    modal.open();
    setTimeout(() => modal.close(), 3000);
  });

  return button.getElement();
};

// Form modal
export const FormModal = () => {
  const button = Button({
    text: 'Open Contact Form',
    variant: 'primary',
  });

  const modal = Modal({
    title: 'Contact Us',
    size: 'medium',
    onClose: () => console.log('Form modal closed'),
  });

  // Create form inputs
  const nameInput = Input({
    label: 'Name',
    placeholder: 'Enter your name',
    required: true,
  });

  const emailInput = Input({
    label: 'Email',
    type: 'email',
    placeholder: 'email@example.com',
    required: true,
  });

  const subjectSelect = Select({
    label: 'Subject',
    placeholder: 'Select a subject',
    options: [
      { value: 'general', label: 'General Inquiry' },
      { value: 'support', label: 'Technical Support' },
      { value: 'billing', label: 'Billing Question' },
      { value: 'feedback', label: 'Feedback' },
    ],
  });

  const messageInput = Input({
    label: 'Message',
    placeholder: 'Enter your message',
    required: true,
  });

  // Create form
  const form = Form({
    onSubmit: (e) => {
      e.preventDefault();
      console.log('Form submitted');
      showToast('Message sent successfully!', 'success');
      modal.close();
    },
  });

  // Add fields to form
  const formElement = form.getElement();
  formElement.appendChild(nameInput.getElement());
  formElement.appendChild(emailInput.getElement());
  formElement.appendChild(subjectSelect.getElement());
  formElement.appendChild(messageInput.getElement());

  // Add submit button
  const submitButton = Button({
    text: 'Send Message',
    variant: 'primary',
    type: 'submit',
  });
  formElement.appendChild(submitButton.getElement());

  // Set form as modal content
  modal.update({ content: formElement });

  button.getElement().addEventListener('click', () => modal.open());

  return button.getElement();
};

// Loading modal
export const LoadingModal = () => {
  const button = Button({
    text: 'Process Data',
    variant: 'primary',
  });

  button.getElement().addEventListener('click', async () => {
    const modal = Modal({
      content: `
        <div style="text-align: center;">
          <div class="spinner" style="
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid var(--color-primary);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
          "></div>
          <p>Processing your request...</p>
        </div>
        <style>
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      `,
      variant: 'minimal',
      size: 'small',
      showCloseButton: false,
      closeOnBackdrop: false,
      closeOnEscape: false,
    });

    modal.open();

    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 3000));

    modal.close();
    showToast('Process completed!', 'success');
  });

  return button.getElement();
};

// Info modal
export const InfoModal = () => {
  const button = Button({
    text: 'Show Info',
    variant: 'primary',
  });

  const modal = Modal({
    title: 'Information',
    content: `
      <p>This is an informational modal with important details.</p>
      <ul>
        <li>Feature 1: Advanced security</li>
        <li>Feature 2: Real-time updates</li>
        <li>Feature 3: Cloud synchronization</li>
      </ul>
    `,
    variant: 'info',
    actions: [{ text: 'Got it', variant: 'primary', action: 'ok' }],
    onAction: () => modal.close(),
  });

  button.getElement().addEventListener('click', () => modal.open());

  return button.getElement();
};

// Warning modal
export const WarningModal = () => {
  const button = Button({
    text: 'Show Warning',
    variant: 'warning',
  });

  const modal = Modal({
    title: 'Warning',
    content: 'Your session will expire in 5 minutes. Please save your work.',
    variant: 'warning',
    size: 'small',
    actions: [
      { text: 'Continue Session', variant: 'primary', action: 'continue' },
      { text: 'Log Out', variant: 'secondary', action: 'logout' },
    ],
    onAction: (action) => {
      console.log('User chose:', action);
      modal.close();
    },
  });

  button.getElement().addEventListener('click', () => modal.open());

  return button.getElement();
};

// Fullscreen modal
export const FullscreenModal = () => {
  const button = Button({
    text: 'Open Fullscreen',
    variant: 'primary',
  });

  const modal = Modal({
    title: 'Fullscreen Modal',
    content: `
      <div style="height: 100%; display: flex; align-items: center; justify-content: center;">
        <div style="text-align: center;">
          <h2>Full Screen Content</h2>
          <p>This modal takes up the entire viewport.</p>
          <p>Perfect for image galleries, videos, or immersive content.</p>
        </div>
      </div>
    `,
    size: 'fullscreen',
    variant: 'minimal',
  });

  button.getElement().addEventListener('click', () => modal.open());

  return button.getElement();
};

// No backdrop modal
export const NoBackdropModal = () => {
  const button = Button({
    text: 'Open Without Backdrop',
    variant: 'primary',
  });

  const modal = Modal({
    title: 'No Backdrop',
    content:
      'This modal has no backdrop. You can still interact with the page behind it.',
    showBackdrop: false,
    lockBodyScroll: false,
    actions: [{ text: 'Close', variant: 'primary', action: 'close' }],
    onAction: () => modal.close(),
  });

  button.getElement().addEventListener('click', () => modal.open());

  return button.getElement();
};

// Multiple modals
export const MultipleModals = () => {
  const button = Button({
    text: 'Open First Modal',
    variant: 'primary',
  });

  const secondModal = Modal({
    title: 'Second Modal',
    content: 'This is the second modal, opened from the first one.',
    size: 'small',
    actions: [{ text: 'Close', variant: 'primary', action: 'close' }],
    onAction: () => secondModal.close(),
  });

  const firstModal = Modal({
    title: 'First Modal',
    content:
      'This is the first modal. Click the button below to open another modal.',
    actions: [
      { text: 'Open Second Modal', variant: 'primary', action: 'open-second' },
      { text: 'Close', variant: 'secondary', action: 'close' },
    ],
    onAction: (action) => {
      if (action === 'open-second') {
        secondModal.open();
      } else {
        firstModal.close();
      }
    },
  });

  button.getElement().addEventListener('click', () => firstModal.open());

  return button.getElement();
};

// All variants
export const AllVariants = () => {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexWrap = 'wrap';
  container.style.gap = '10px';

  const variants = [
    'default',
    'info',
    'success',
    'warning',
    'danger',
    'minimal',
  ];

  variants.forEach((variant) => {
    const button = Button({
      text: `${variant.charAt(0).toUpperCase() + variant.slice(1)} Modal`,
      variant: variant === 'default' ? 'secondary' : variant,
    });

    const modal = Modal({
      title: `${variant.charAt(0).toUpperCase() + variant.slice(1)} Modal`,
      content: `This is a ${variant} modal. Notice the styled header and overall appearance.`,
      variant: variant,
      actions: [{ text: 'Close', variant: 'primary', action: 'close' }],
      onAction: () => modal.close(),
    });

    button.getElement().addEventListener('click', () => modal.open());
    container.appendChild(button.getElement());
  });

  return container;
};

// Helper function for toast notifications
function showToast(message, variant = 'info', duration = 3000) {
  const toast = Modal({
    content: message,
    variant: variant,
    size: 'small',
    showCloseButton: false,
    closeOnBackdrop: false,
    showBackdrop: false,
    lockBodyScroll: false,
    className: 'toast-notification',
  });

  toast.open();
  setTimeout(() => toast.close(), duration);

  return toast;
}
