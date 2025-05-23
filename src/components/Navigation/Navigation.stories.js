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
  return Navigation({
    items: navItems,
    submenuShadow: false, // Default without shadow
  });
};

export const WithSubmenuShadow = () => {
  return Navigation({
    items: navItems,
    submenuShadow: true, // Only this story has shadow
  });
};

export const Vertical = () => {
  return Navigation({
    items: navItems,
    horizontal: false,
    submenuShadow: false,
  });
};

export const WithActiveItem = () => {
  return Navigation({
    items: navItems,
    value: 'products', // Using value instead of activeId for standardization
    submenuShadow: false,
  });
};

export const BurgerRight = () => {
  return Navigation({
    items: navItems,
    burgerPosition: 'right',
    submenuShadow: false,
  });
};

export const NonExpandable = () => {
  return Navigation({
    items: navItems,
    expandable: false,
    submenuShadow: false,
  });
};

export const WithItemSelectionCallback = () => {
  const container = document.createElement('div');

  // Create output area to show selected items
  const output = document.createElement('div');
  output.style.marginTop = '20px';
  output.style.padding = '10px';
  output.style.border = '1px solid #ccc';
  output.innerHTML = '<p>Click on a navigation item</p>';

  // Create navigation with callback
  const navigation = Navigation({
    items: navItems,
    submenuShadow: false,
    onSelect: (item) => {
      // Using onSelect instead of onItemSelect
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

export const MobileWithLogo = () => {
  const container = document.createElement('div');

  // Create a logo element
  const logo = document.createElement('div');
  logo.style.fontWeight = 'bold';
  logo.style.fontSize = '24px';
  logo.style.margin = '0 1rem';
  logo.textContent = 'LOGO';

  // Create navigation with right-aligned burger
  const navigation = Navigation({
    items: navItems,
    burgerPosition: 'right',
    submenuShadow: false,
  });

  const navElement = navigation.getElement();

  // Insert logo after the burger button
  navElement.insertBefore(logo, navElement.querySelector('.nav__list'));

  container.appendChild(navElement);

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
      --nav-active-font-weight: 700;
      --nav-dropdown-bg: white;
      --nav-dropdown-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
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

  const nav = Navigation({
    items: navItems,
    className: 'custom-nav',
    submenuShadow: false,
  });

  container.appendChild(style);
  container.appendChild(nav.getElement());

  return container;
};

export const ProgrammaticControl = () => {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '20px';

  // Create navigation
  const navigation = Navigation({
    items: navItems,
    submenuShadow: true,
  });

  // Create controls
  const controls = document.createElement('div');
  controls.style.display = 'flex';
  controls.style.gap = '10px';
  controls.style.flexWrap = 'wrap';

  // Active item control
  const activeItems = ['home', 'products', 'about', 'contact'];
  activeItems.forEach((id) => {
    const button = document.createElement('button');
    button.textContent = `Activate "${id}"`;
    button.onclick = () => navigation.setActiveItem(id);
    controls.appendChild(button);
  });

  // Expand/collapse controls
  const expandButton = document.createElement('button');
  expandButton.textContent = 'Expand Products';
  expandButton.onclick = () => navigation.expandItem('products');
  controls.appendChild(expandButton);

  const collapseButton = document.createElement('button');
  collapseButton.textContent = 'Collapse All';
  collapseButton.onclick = () => navigation.collapseAll();
  controls.appendChild(collapseButton);

  // Toggle mobile menu
  const toggleMobileButton = document.createElement('button');
  toggleMobileButton.textContent = 'Toggle Mobile Menu';
  toggleMobileButton.onclick = () => navigation.toggleMobileMenu();
  controls.appendChild(toggleMobileButton);

  container.appendChild(controls);
  container.appendChild(navigation.getElement());

  return container;
};

// New story to demonstrate standardized props
export const StandardizedProps = () => {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '20px';

  const info = document.createElement('div');
  info.innerHTML = `
    <h3>Using Standardized Props</h3>
    <ul>
      <li><strong>value</strong>: 'about' (alias for activeId)</li>
      <li><strong>onSelect</strong> instead of onItemSelect</li>
      <li>All items use <strong>href</strong> instead of url</li>
    </ul>
  `;

  const output = document.createElement('div');
  output.style.padding = '10px';
  output.style.border = '1px solid #ccc';
  output.innerHTML = '<p>Click on a navigation item</p>';

  // Create navigation with standardized props
  const navigation = Navigation({
    items: navItems,
    value: 'about', // Using value instead of activeId
    onSelect: (item) => {
      // Using onSelect instead of onItemSelect
      output.innerHTML = `
        <p><strong>Selected:</strong> ${item.label} (id: ${item.id})</p>
      `;
    },
    submenuShadow: true,
  });

  container.appendChild(info);
  container.appendChild(navigation.getElement());
  container.appendChild(output);

  return container;
};
