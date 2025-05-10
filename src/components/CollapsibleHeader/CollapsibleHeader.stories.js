// src/components/CollapsibleHeader/CollapsibleHeader.stories.js
import CollapsibleHeader from './CollapsibleHeader.js';
import Logo from '../Logo/Logo.js';
import logoFarbe from '../../../.storybook/assets/svg/logo-farbe.svg';
import logoIconFarbe from '../../../.storybook/assets/svg/logo-icon-farbe.svg';

export default {
  title: 'Components/Layout/CollapsibleHeader',
  component: CollapsibleHeader,
};

// Custom Logo component that handles webpack imports properly
class StoryLogo extends Logo {
  constructor(props) {
    // Process any webpack module objects and convert to URLs
    const processedProps = { ...props };

    if (processedProps.sources) {
      // Handle different source formats
      if (Array.isArray(processedProps.sources)) {
        processedProps.sources = processedProps.sources.map((source) => {
          if (source && typeof source === 'object') {
            if (source.src && source.src.toString) {
              return {
                ...source,
                src: source.src.toString(),
              };
            }
          }
          return source;
        });
      } else if (
        typeof processedProps.sources === 'object' &&
        processedProps.sources.toString
      ) {
        // Handle single webpack module object
        processedProps.sources = processedProps.sources.toString();
      }
    }

    super(processedProps);
  }
}

// Sample navigation items
const navigationItems = [
  { id: 'repair', label: 'Reparatur', href: '/reparatur' },
  { id: 'purchase', label: 'Ankauf', href: '/ankauf' },
  { id: 'used', label: 'Gebrauchte', href: '/gebrauchte' },
  { id: 'services', label: 'Services', href: '/services' },
  { id: 'find-us', label: 'So Finden Sie Uns', href: '/kontakt' },
];

export const MuchandyHeader = () => {
  // Create a wrapper with scroll area
  const wrapper = document.createElement('div');
  wrapper.style.height = '500px';
  wrapper.style.overflow = 'auto';
  wrapper.style.position = 'relative';
  wrapper.style.border = '1px solid #ccc';

  // Create content to allow scrolling
  const content = document.createElement('div');
  content.style.height = '1200px';
  content.style.padding = '20px';
  content.style.paddingTop = '200px';
  content.innerHTML =
    '<h2>Scroll down to see header collapse and logo change</h2>';

  // Add custom CSS for logo sizing - proper CSS with specificity instead of !important
  const style = document.createElement('style');
  style.textContent = `
    /* Use high specificity selectors instead of !important */
    .story-wrapper .collapsible-header .logo-container,
    .story-wrapper .collapsible-header .logo-image {
      width: 120px;
      height: auto;
      max-height: none;
    }
    
    /* Use attribute selectors for specific logos */
    .story-wrapper [data-logo-type="regular"] {
      display: block;
    }
    
    .story-wrapper [data-logo-type="compact"] {
      display: none;
    }
    
    /* When collapsed, switch visibility */
    .story-wrapper .collapsible-header--collapsed [data-logo-type="regular"] {
      display: none;
    }
    
    .story-wrapper .collapsible-header--collapsed [data-logo-type="compact"] {
      display: block;
    }
    
    /* Mobile-specific styles */
    @media (max-width: 768px) {
      .story-wrapper .collapsible-header .logo-container,
      .story-wrapper .collapsible-header .logo-image {
        width: 60px;
      }
      
      .story-wrapper [data-logo-type="regular"] {
        display: none;
      }
      
      .story-wrapper [data-logo-type="compact"] {
        display: block;
      }
    }
  `;
  document.head.appendChild(style);

  // Add class for proper CSS targeting
  wrapper.classList.add('story-wrapper');

  // Create the header with empty logo properties
  const headerProps = {
    siteName: 'MUCHANDY',
    navigation: {
      items: navigationItems,
    },
    contactInfo: {
      location: 'Luisenstr. 1',
      phone: '0176/88778877',
      email: 'info@muchandy.de',
    },
    collapseThreshold: 50,
    callButtonText: 'Anrufen',
    showStickyIcons: true,
    stickyIconsPosition: 'right',
  };

  const header = new CollapsibleHeader(headerProps);
  const headerElement = header.getElement();

  // Create an object to store our logos
  const logos = {
    regular: null,
    compact: null,
  };

  // Append header and content to the wrapper
  wrapper.appendChild(headerElement);
  wrapper.appendChild(content);

  // After the header is rendered, set up our custom logos
  setTimeout(() => {
    // Find the logo container in the header
    const logoContainer = headerElement.querySelector(
      '.collapsible-header__logo'
    );
    if (logoContainer) {
      // Clear existing content
      logoContainer.innerHTML = '';

      // Create the regular logo
      const regularLogo = new StoryLogo({
        sources: logoFarbe,
        alt: 'MUCHANDY',
        className: 'regular-logo',
      });

      // Create the compact logo
      const compactLogo = new StoryLogo({
        sources: logoIconFarbe,
        alt: 'MUCHANDY Icon',
        className: 'compact-logo',
      });

      // Store references to both logos
      logos.regular = regularLogo.getElement();
      logos.compact = compactLogo.getElement();

      // Add data attributes for CSS targeting instead of inline styles
      logos.regular.setAttribute('data-logo-type', 'regular');
      logos.compact.setAttribute('data-logo-type', 'compact');

      // Create a link for the logos
      const logoLink = document.createElement('a');
      logoLink.href = '/';
      logoLink.appendChild(logos.regular);
      logoLink.appendChild(logos.compact);

      // Add to the container
      logoContainer.appendChild(logoLink);
    }

    // Set up custom scroll handler
    const handleScroll = () => {
      const scrollY = wrapper.scrollTop;
      const collapseThreshold = headerProps.collapseThreshold;

      // Determine if header should be collapsed
      const shouldCollapse = scrollY > collapseThreshold;

      // Update header collapse class - let CSS handle the logo visibility
      headerElement.classList.toggle(
        'collapsible-header--collapsed',
        shouldCollapse
      );
    };

    // Set up scroll listener
    wrapper.addEventListener('scroll', handleScroll);

    // Initial call to ensure proper state
    handleScroll();

    // Add mobile view testing button
    const mobileViewButton = document.createElement('button');
    mobileViewButton.textContent = 'Toggle Mobile View';
    mobileViewButton.style.position = 'fixed';
    mobileViewButton.style.bottom = '20px';
    mobileViewButton.style.left = '20px';
    mobileViewButton.style.zIndex = '9999';
    mobileViewButton.style.padding = '8px 16px';
    mobileViewButton.style.backgroundColor = '#4294d0';
    mobileViewButton.style.color = 'white';
    mobileViewButton.style.border = 'none';
    mobileViewButton.style.borderRadius = '4px';
    mobileViewButton.style.cursor = 'pointer';

    let isMobileView = false;

    mobileViewButton.addEventListener('click', () => {
      isMobileView = !isMobileView;
      if (isMobileView) {
        // Apply mobile styles to wrapper
        wrapper.style.width = '375px'; // iPhone size
        wrapper.style.height = '667px';
        // Add mobile class for CSS targeting
        wrapper.classList.add('mobile-view');
      } else {
        // Reset to desktop
        wrapper.style.width = 'auto';
        wrapper.style.height = '500px';
        // Remove mobile class
        wrapper.classList.remove('mobile-view');
      }
    });

    wrapper.appendChild(mobileViewButton);
  }, 0);

  return wrapper;
};

// Rest of the story file for WithoutStickyIcons and SecondDesign would follow a similar pattern

// Ensure all sticky contact icons are removed when the story is unmounted
export const parameters = {
  docs: {
    story: {
      inline: false,
    },
  },
  beforeDestroy: () => {
    // Remove any sticky contact icons in the document
    const stickyElements = document.querySelectorAll('.sticky-contact-icons');
    stickyElements.forEach((el) => {
      if (el.parentElement) {
        el.parentElement.removeChild(el);
      }
    });

    // Remove any custom styles we added
    const customStyles = document.querySelectorAll('style');
    customStyles.forEach((style) => {
      if (
        style.textContent.includes('story-wrapper') ||
        style.textContent.includes('data-logo-type')
      ) {
        style.parentNode.removeChild(style);
      }
    });
  },
};
