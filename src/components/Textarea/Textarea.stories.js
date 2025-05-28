// src/components/Textarea/Textarea.stories.js
import Textarea from './Textarea.js';

export default {
  title: 'Components/Textarea',
  component: Textarea,
};

export const Default = () => {
  return Textarea({
    placeholder: 'Enter your message...',
    onChange: (event, value) => console.log('Textarea value:', value),
  });
};

export const WithValue = () => {
  return Textarea({
    value:
      'This is some initial text content that spans multiple lines.\n\nIt demonstrates how the textarea handles pre-filled content.',
    onChange: (event, value) => console.log('Textarea value:', value),
  });
};

export const Required = () => {
  return Textarea({
    placeholder: 'Required field',
    required: true,
    errorMessage: 'This field is required',
    onChange: (event, value) => console.log('Textarea value:', value),
  });
};

export const Disabled = () => {
  return Textarea({
    value: 'This textarea is disabled',
    disabled: true,
  });
};

export const Readonly = () => {
  return Textarea({
    value:
      'This textarea is read-only. You can select and copy the text but cannot edit it.',
    readonly: true,
  });
};

export const WithRows = () => {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '20px';

  const small = Textarea({
    placeholder: '2 rows',
    rows: 2,
  });

  const medium = Textarea({
    placeholder: '5 rows',
    rows: 5,
  });

  const large = Textarea({
    placeholder: '10 rows',
    rows: 10,
  });

  container.appendChild(small.getElement());
  container.appendChild(medium.getElement());
  container.appendChild(large.getElement());

  return container;
};

export const WithCharacterCount = () => {
  return Textarea({
    placeholder: 'Type something...',
    showCharCount: true,
    onChange: (event, value) => console.log('Characters:', value.length),
  });
};

export const WithMaxLength = () => {
  return Textarea({
    placeholder: 'Maximum 100 characters',
    maxLength: 100,
    showCharCount: true,
    errorMessage: 'Text cannot exceed 100 characters',
  });
};

export const AutoResize = () => {
  return Textarea({
    placeholder: 'This textarea will grow as you type...',
    autoResize: true,
    rows: 3,
    onChange: (event, value) => console.log('Auto-resize textarea:', value),
  });
};

export const NoResize = () => {
  return Textarea({
    placeholder: 'This textarea cannot be resized',
    resizable: false,
    rows: 5,
  });
};

export const WithValidation = () => {
  const container = document.createElement('div');

  const textarea = Textarea({
    placeholder: 'Enter at least 10 characters',
    required: true,
    minLength: 10,
    errorMessage: 'Please enter at least 10 characters',
    onChange: (event, value) => console.log('Textarea value:', value),
  });

  const button = document.createElement('button');
  button.textContent = 'Validate';
  button.style.marginTop = '10px';
  button.addEventListener('click', () => {
    const isValid = textarea.validate();
    console.log('Is textarea valid?', isValid);
  });

  container.appendChild(textarea.getElement());
  container.appendChild(button);

  return container;
};

export const Loading = () => {
  return Textarea({
    placeholder: 'Loading state...',
    loading: true,
  });
};

export const ValidState = () => {
  return Textarea({
    value: 'This content is valid',
    error: false,
  });
};

export const InvalidState = () => {
  return Textarea({
    value: 'Too short',
    error: true,
    errorMessage: 'Content must be at least 20 characters',
  });
};

export const WithCustomStyling = () => {
  const textarea = Textarea({
    placeholder: 'Custom styled textarea',
    className: 'custom-textarea-example',
  });

  // Add custom styles
  const style = document.createElement('style');
  style.textContent = `
    .custom-textarea-example .textarea-custom {
      background-color: #f0f8ff;
      border: 2px dashed #4169e1;
      font-family: monospace;
    }
    
    .custom-textarea-example .textarea-custom--focused {
      border-color: #1e90ff;
      background-color: #ffffff;
    }
  `;
  document.head.appendChild(style);

  return textarea.getElement();
};

export const AllFeatures = () => {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '30px';
  container.style.padding = '20px';

  const examples = [
    {
      title: 'Basic',
      component: Textarea({
        placeholder: 'Basic textarea',
      }),
    },
    {
      title: 'With Character Count',
      component: Textarea({
        placeholder: 'Shows character count',
        showCharCount: true,
      }),
    },
    {
      title: 'With Max Length',
      component: Textarea({
        placeholder: 'Max 50 characters',
        maxLength: 50,
        showCharCount: true,
      }),
    },
    {
      title: 'Auto Resize',
      component: Textarea({
        placeholder: 'Grows as you type',
        autoResize: true,
        rows: 2,
      }),
    },
    {
      title: 'Required Field',
      component: Textarea({
        placeholder: 'This field is required',
        required: true,
        errorMessage: 'Please fill out this field',
      }),
    },
    {
      title: 'Disabled',
      component: Textarea({
        value: 'Disabled textarea',
        disabled: true,
      }),
    },
    {
      title: 'Read-only',
      component: Textarea({
        value: 'Read-only content',
        readonly: true,
      }),
    },
    {
      title: 'Loading',
      component: Textarea({
        placeholder: 'Loading...',
        loading: true,
      }),
    },
  ];

  examples.forEach(({ title, component }) => {
    const wrapper = document.createElement('div');

    const label = document.createElement('h3');
    label.textContent = title;
    label.style.marginBottom = '10px';
    label.style.fontSize = '16px';
    label.style.fontWeight = 'bold';

    wrapper.appendChild(label);
    wrapper.appendChild(component.getElement());
    container.appendChild(wrapper);
  });

  return container;
};

export const FormIntegration = () => {
  const form = document.createElement('form');
  form.style.display = 'flex';
  form.style.flexDirection = 'column';
  form.style.gap = '20px';
  form.style.maxWidth = '500px';

  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.placeholder = 'Your name';
  nameInput.style.padding = '8px';
  nameInput.style.border = '1px solid #ccc';
  nameInput.style.borderRadius = '4px';

  const messageTextarea = Textarea({
    name: 'message',
    placeholder: 'Your message',
    required: true,
    minLength: 20,
    maxLength: 500,
    showCharCount: true,
    autoResize: true,
    rows: 4,
    errorMessage: 'Message must be between 20 and 500 characters',
  });

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = 'Send Message';
  submitButton.style.padding = '10px 20px';
  submitButton.style.backgroundColor = '#007bff';
  submitButton.style.color = 'white';
  submitButton.style.border = 'none';
  submitButton.style.borderRadius = '4px';
  submitButton.style.cursor = 'pointer';

  form.appendChild(nameInput);
  form.appendChild(messageTextarea.getElement());
  form.appendChild(submitButton);

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const isValid = messageTextarea.validate();
    if (isValid) {
      console.log('Form submitted:', {
        name: nameInput.value,
        message: messageTextarea.getValue(),
      });
      alert('Message sent!');
    }
  });

  return form;
};

export const DynamicUpdates = () => {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '20px';

  const textarea = Textarea({
    placeholder: 'This textarea can be updated dynamically',
    autoResize: true,
  });

  const controls = document.createElement('div');
  controls.style.display = 'flex';
  controls.style.gap = '10px';
  controls.style.flexWrap = 'wrap';

  const createButton = (text, onClick) => {
    const button = document.createElement('button');
    button.textContent = text;
    button.style.padding = '5px 10px';
    button.addEventListener('click', onClick);
    return button;
  };

  controls.appendChild(
    createButton('Set Value', () => {
      textarea.setValue('This is dynamically set content!');
    })
  );

  controls.appendChild(
    createButton('Clear', () => {
      textarea.setValue('');
    })
  );

  controls.appendChild(
    createButton('Disable', () => {
      textarea.update({ disabled: true });
    })
  );

  controls.appendChild(
    createButton('Enable', () => {
      textarea.update({ disabled: false });
    })
  );

  controls.appendChild(
    createButton('Set Error', () => {
      textarea.update({
        error: true,
        errorMessage: 'Something went wrong!',
      });
    })
  );

  controls.appendChild(
    createButton('Clear Error', () => {
      textarea.update({ error: false });
    })
  );

  controls.appendChild(
    createButton('Toggle Loading', () => {
      const currentElement = textarea.getElement();
      const isLoading = currentElement.querySelector(
        '.textarea-custom--loading'
      );
      textarea.update({ loading: !isLoading });
    })
  );

  container.appendChild(textarea.getElement());
  container.appendChild(controls);

  return container;
};
