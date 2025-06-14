// src/components/Breadcrumb/Breadcrumb.stories.js
import Breadcrumb from './Breadcrumb.js';

export default {
  title: 'Navigation/Breadcrumb',
  component: Breadcrumb,
  argTypes: {
    separator: {
      control: 'text',
      description: 'Character used to separate breadcrumb items',
    },
    maxItems: {
      control: { type: 'number', min: 2, max: 10 },
      description: 'Maximum number of items to display before truncation',
    },
  },
};

export const Default = () => {
  const breadcrumb = Breadcrumb({
    items: [
      { label: 'Home', href: '/' },
      { label: 'Products', href: '/products' },
      { label: 'Laptops', href: '/products/laptops' },
      { label: 'MacBook Pro 16"' },
    ],
  });

  return breadcrumb.getElement();
};

export const CustomSeparator = () => {
  const breadcrumb = Breadcrumb({
    items: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Users', href: '/dashboard/users' },
      { label: 'Profile', href: '/dashboard/users/profile' },
      { label: 'Edit Profile' },
    ],
    separator: '>',
  });

  return breadcrumb.getElement();
};

export const WithClickHandlers = () => {
  const breadcrumb = Breadcrumb({
    items: [
      {
        label: 'Home',
        href: '/',
        onClick: (e, item) => {
          e.preventDefault();
          alert(`Clicked on ${item.label}`);
        },
      },
      {
        label: 'Category',
        href: '/category',
        onClick: (e, item) => {
          e.preventDefault();
          alert(`Clicked on ${item.label}`);
        },
      },
      { label: 'Current Page' },
    ],
    onClick: (e, item, index) => {
      console.log(`Global click handler: ${item.label} at index ${index}`);
    },
  });

  return breadcrumb.getElement();
};

export const TruncatedLong = () => {
  const breadcrumb = Breadcrumb({
    items: [
      { label: 'Home', href: '/' },
      { label: 'Electronics', href: '/electronics' },
      { label: 'Computers', href: '/electronics/computers' },
      { label: 'Laptops', href: '/electronics/computers/laptops' },
      {
        label: 'Gaming Laptops',
        href: '/electronics/computers/laptops/gaming',
      },
      {
        label: 'ASUS ROG',
        href: '/electronics/computers/laptops/gaming/asus-rog',
      },
      { label: 'ASUS ROG Strix G15' },
    ],
    maxItems: 4,
  });

  return breadcrumb.getElement();
};

export const ShortPath = () => {
  const breadcrumb = Breadcrumb({
    items: [{ label: 'Documentation', href: '/docs' }, { label: 'Components' }],
    separator: '•',
  });

  return breadcrumb.getElement();
};

export const SingleItem = () => {
  const breadcrumb = Breadcrumb({
    items: [{ label: 'Current Page' }],
  });

  return breadcrumb.getElement();
};

export const WithEmojis = () => {
  const breadcrumb = Breadcrumb({
    items: [
      { label: '🏠 Home', href: '/' },
      { label: '📱 Electronics', href: '/electronics' },
      { label: '💻 Laptops', href: '/electronics/laptops' },
      { label: '🎮 Gaming Laptop' },
    ],
    separator: '→',
  });

  return breadcrumb.getElement();
};

export const CustomClassName = () => {
  // Add custom styles for this story
  const style = document.createElement('style');
  style.textContent = `
    .custom-breadcrumb {
      background-color: #f3f4f6;
      padding: 1rem;
      border-radius: 0.5rem;
      border: 1px solid #e5e7eb;
    }

    .custom-breadcrumb .breadcrumb-link {
      font-weight: 600;
      color: #059669;
    }

    .custom-breadcrumb .breadcrumb-link:hover {
      color: #047857;
      background-color: #d1fae5;
    }

    .custom-breadcrumb .breadcrumb-separator {
      color: #6b7280;
    }
  `;

  if (!document.head.querySelector('[data-custom-breadcrumb]')) {
    style.setAttribute('data-custom-breadcrumb', '');
    document.head.appendChild(style);
  }

  const breadcrumb = Breadcrumb({
    items: [
      { label: 'Admin', href: '/admin' },
      { label: 'Settings', href: '/admin/settings' },
      { label: 'User Management', href: '/admin/settings/users' },
      { label: 'Create User' },
    ],
    className: 'custom-breadcrumb',
  });

  return breadcrumb.getElement();
};

export const Interactive = () => {
  const container = document.createElement('div');
  container.style.padding = '1rem';

  // Initialize breadcrumb first
  const currentBreadcrumb = Breadcrumb({
    items: [{ label: 'Home', href: '/' }, { label: 'Current Page' }],
  });

  // Create breadcrumb container that will be updated
  const breadcrumbContainer = document.createElement('div');
  breadcrumbContainer.appendChild(currentBreadcrumb.getElement());

  // Control buttons
  const controls = document.createElement('div');
  controls.style.marginBottom = '1rem';
  controls.style.display = 'flex';
  controls.style.gap = '0.5rem';
  controls.style.flexWrap = 'wrap';

  // Add button functionality
  const addButton = document.createElement('button');
  addButton.textContent = 'Add Item';
  addButton.style.padding = '0.5rem 1rem';
  addButton.style.marginRight = '0.5rem';
  addButton.onclick = () => {
    try {
      const items = currentBreadcrumb.getPath();
      const newLabel = `Page ${items.length}`;
      currentBreadcrumb.addItem({
        label: newLabel,
        href: `/${newLabel.toLowerCase().replace(' ', '-')}`,
      });

      // Update the container with the new element
      breadcrumbContainer.innerHTML = '';
      breadcrumbContainer.appendChild(currentBreadcrumb.getElement());
    } catch (error) {
      console.error('Add item error:', error);
    }
  };

  // Remove button functionality
  const removeButton = document.createElement('button');
  removeButton.textContent = 'Remove Item';
  removeButton.style.padding = '0.5rem 1rem';
  removeButton.style.marginRight = '0.5rem';
  removeButton.onclick = () => {
    try {
      currentBreadcrumb.popItem();

      // Update the container with the new element
      breadcrumbContainer.innerHTML = '';
      breadcrumbContainer.appendChild(currentBreadcrumb.getElement());
    } catch (error) {
      alert(error.message);
    }
  };

  // Separator change functionality
  const changeSeparatorButton = document.createElement('button');
  changeSeparatorButton.textContent = 'Change Separator';
  changeSeparatorButton.style.padding = '0.5rem 1rem';
  changeSeparatorButton.style.marginRight = '0.5rem';
  let separatorIndex = 0;
  const separators = ['/', '>', '•', '→', '|'];
  changeSeparatorButton.onclick = () => {
    try {
      separatorIndex = (separatorIndex + 1) % separators.length;
      currentBreadcrumb.setSeparator(separators[separatorIndex]);

      // Update the container with the new element
      breadcrumbContainer.innerHTML = '';
      breadcrumbContainer.appendChild(currentBreadcrumb.getElement());
    } catch (error) {
      console.error('Change separator error:', error);
    }
  };

  // Truncation toggle functionality
  const toggleTruncationButton = document.createElement('button');
  toggleTruncationButton.textContent = 'Toggle Truncation';
  toggleTruncationButton.style.padding = '0.5rem 1rem';
  let truncated = false;
  toggleTruncationButton.onclick = () => {
    try {
      truncated = !truncated;
      currentBreadcrumb.setMaxItems(truncated ? 3 : undefined);

      // Update the container with the new element
      breadcrumbContainer.innerHTML = '';
      breadcrumbContainer.appendChild(currentBreadcrumb.getElement());
    } catch (error) {
      console.error('Toggle truncation error:', error);
    }
  };

  // Add info display
  const infoDiv = document.createElement('div');
  infoDiv.style.marginTop = '1rem';
  infoDiv.style.padding = '1rem';
  infoDiv.style.backgroundColor = '#f8f9fa';
  infoDiv.style.borderRadius = '0.5rem';
  infoDiv.style.fontSize = '0.875rem';
  infoDiv.innerHTML = `
    <strong>Interactive Breadcrumb Demo</strong><br>
    • Add Item: Adds a new page to the breadcrumb path<br>
    • Remove Item: Removes the last item (except if it's the only one)<br>
    • Change Separator: Cycles through different separator characters<br>
    • Toggle Truncation: Shows/hides truncation with max 3 items
  `;

  controls.appendChild(addButton);
  controls.appendChild(removeButton);
  controls.appendChild(changeSeparatorButton);
  controls.appendChild(toggleTruncationButton);

  container.appendChild(infoDiv);
  container.appendChild(controls);
  container.appendChild(breadcrumbContainer);

  return container;
};
