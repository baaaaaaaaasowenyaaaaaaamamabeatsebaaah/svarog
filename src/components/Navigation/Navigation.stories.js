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

export const ResponsiveNavigation = () => {
  const container = document.createElement('div');

  // Create info message
  const info = document.createElement('div');
  info.style.marginBottom = '1rem';
  info.style.padding = '1rem';
  info.style.backgroundColor = '#f8f9fa';
  info.style.borderRadius = '4px';
  info.innerHTML =
    '<p>Resize your browser window to see the responsive navigation. On smaller screens, the navigation will collapse into a hamburger menu.</p>';

  // Create header-like container for the navigation
  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.alignItems = 'center';
  header.style.padding = '1rem';
  header.style.backgroundColor = 'white';
  header.style.borderRadius = '4px';
  header.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';

  // Add a logo/title
  const title = document.createElement('div');
  title.style.fontWeight = 'bold';
  title.style.fontSize = '1.25rem';
  title.textContent = 'Site Title';

  // Create the navigation
  const nav = new Navigation({
    items: navItems,
    responsive: true,
  });

  header.appendChild(title);
  header.appendChild(nav.getElement());

  container.appendChild(info);
  container.appendChild(header);

  return container;
};
