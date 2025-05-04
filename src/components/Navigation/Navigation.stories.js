// src/components/Navigation/Navigation.stories.js
import Navigation from './Navigation.js';

export default {
  title: 'Components/Navigation',
  component: Navigation,
};

// Sample navigation items
const navItems = [
  {
    id: 'home',
    label: 'Home',
    href: '#',
  },
  {
    id: 'products',
    label: 'Products',
    href: '#',
    items: [
      {
        id: 'category1',
        label: 'Category 1',
        href: '#category1',
      },
      {
        id: 'category2',
        label: 'Category 2',
        href: '#category2',
        items: [
          {
            id: 'subcategory1',
            label: 'Subcategory 1',
            href: '#subcategory1',
          },
          {
            id: 'subcategory2',
            label: 'Subcategory 2',
            href: '#subcategory2',
          },
        ],
      },
      {
        id: 'category3',
        label: 'Category 3',
        href: '#category3',
      },
    ],
  },
  {
    id: 'about',
    label: 'About',
    href: '#',
  },
  {
    id: 'contact',
    label: 'Contact',
    href: '#',
  },
  {
    id: 'disabled',
    label: 'Disabled',
    href: '#',
    disabled: true,
  },
];

export const Default = () => {
  return new Navigation({
    items: navItems,
  });
};

export const Vertical = () => {
  return new Navigation({
    items: navItems,
    horizontal: false,
  });
};

export const WithActiveItem = () => {
  return new Navigation({
    items: navItems,
    activeId: 'products',
  });
};

export const NonExpandable = () => {
  return new Navigation({
    items: navItems,
    expandable: false,
  });
};

export const WithItemSelectionCallback = () => {
  const container = document.createElement('div');

  // Create output area to show selected items
  const output = document.createElement('div');
  output.style.marginTop = '20px';
  output.style.padding = '10px';
  output.style.border = '1px solid #ccc';
  output.style.borderRadius = '4px';
  output.innerHTML = '<p>Click on a navigation item</p>';

  // Create navigation with callback
  const navigation = new Navigation({
    items: navItems,
    onItemSelect: (item) => {
      output.innerHTML = `
        <p><strong>Selected Item:</strong></p>
        <pre>${JSON.stringify(item, null, 2)}</pre>
      `;
    },
  });

  container.appendChild(navigation.getElement());
  container.appendChild(output);

  return container;
};

export const CustomStyling = () => {
  const container = document.createElement('div');

  // Add custom CSS
  const style = document.createElement('style');
  style.textContent = `
    .custom-nav {
      --nav-link-color: #555555;
      --nav-link-hover-color: #ff6b6b;
      --nav-link-active-color: #ff6b6b;
      --nav-link-padding: 0.75rem 1.25rem;
      --nav-link-radius: 30px;
      --nav-active-font-weight: 700;
      --nav-dropdown-bg: white;
      --nav-dropdown-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      --nav-dropdown-radius: 12px;
      --nav-dropdown-border: none;
      --nav-dropdown-link-padding: 0.75rem 1.5rem;
      --nav-focus-shadow: 0 0 0 3px rgba(255, 107, 107, 0.3);
    }
    
    .custom-nav .nav__link {
      font-weight: 500;
      transition: all 0.3s ease;
    }
    
    .custom-nav .nav__link:hover {
      transform: translateY(-2px);
    }
  `;

  const nav = new Navigation({
    items: navItems,
    className: 'custom-nav',
  });

  container.appendChild(style);
  container.appendChild(nav.getElement());

  return container;
};
