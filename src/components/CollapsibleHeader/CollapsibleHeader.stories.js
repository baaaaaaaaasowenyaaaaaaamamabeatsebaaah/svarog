// src/components/CollapsibleHeader/CollapsibleHeader.stories.js
import CollapsibleHeaderContainer from './CollapsibleHeaderContainer.js';
import logoFarbe from '../../../.storybook/assets/svg/logo-farbe.svg';
import logoIconFarbe from '../../../.storybook/assets/svg/logo-icon-farbe.svg';

export default {
  title: 'Components/Layout/CollapsibleHeader',
  component: CollapsibleHeaderContainer,
  parameters: {
    docs: {
      description: {
        component:
          'A collapsible header that changes on scroll with optional sticky contact icons.',
      },
    },
  },
};

/**
 * Creates a story-specific version of the header container
 * This is necessary to handle scrolling within the Storybook iframe
 */
const createStoryHeader = (props) => {
  // Create the container div for the entire story
  const container = document.createElement('div');
  container.style.height = '500px';
  container.style.overflow = 'auto';
  container.style.position = 'relative';
  container.style.border = '1px solid #ccc';

  // Create the header using CollapsibleHeaderContainer
  const headerContainer = CollapsibleHeaderContainer({
    ...props,
    // Override the default scroll handler to use our container
    _storyMode: true, // Signal that we're in story mode
  });

  // Get the header element and add it to our container
  const headerElement = headerContainer.getElement();
  container.appendChild(headerElement);

  // Create content for scrolling
  const content = document.createElement('div');
  content.style.height = '1200px';
  content.style.padding = '20px';
  content.style.paddingTop = '200px';
  content.innerHTML =
    '<h2>Scroll down to see header collapse</h2><p>The header will collapse and show sticky icons.</p>';
  container.appendChild(content);

  // Special handling for story mode - use container scroll instead of window
  container.addEventListener('scroll', () => {
    // Use the container's scrollTop instead of window.scrollY
    const scrollTop = container.scrollTop;
    const shouldCollapse = scrollTop > (props.collapseThreshold || 100);

    // Access via the safe story helper API
    if (
      headerContainer._story &&
      shouldCollapse !== headerContainer._story.isCollapsed()
    ) {
      // Update collapsed state
      headerContainer._story.setCollapsed(shouldCollapse);

      // Get icon element
      const iconElement = headerContainer._story.getIconElement();

      // Handle icon display and positioning
      if (iconElement) {
        // Make sure element is in the DOM
        if (shouldCollapse && !iconElement.parentNode) {
          container.appendChild(iconElement);
        }

        // Position the icons properly for the story
        iconElement.style.display = shouldCollapse ? 'flex' : 'none';
        iconElement.style.position = 'fixed';
        iconElement.style.right = '0px';

        if (headerContainer._story.isMobile()) {
          iconElement.style.bottom = '16px';
          iconElement.style.top = 'auto';
          iconElement.style.flexDirection = 'row';
        } else {
          const headerHeight = headerElement.offsetHeight || 300;
          iconElement.style.top = `${headerHeight + 200}px`;
          iconElement.style.bottom = 'auto';
          iconElement.style.flexDirection = 'column';
        }
      }
    }
  });

  return container;
};

export const MuchandyHeader = () => {
  // Create a header container with custom logos
  const headerProps = {
    siteName: 'MUCHANDY',
    navigation: {
      items: [
        { id: 'repair', label: 'Reparatur', href: '#' },
        { id: 'purchase', label: 'Ankauf', href: '#' },
        { id: 'used', label: 'Gebrauchte', href: '#' },
        { id: 'services', label: 'Services', href: '#' },
        { id: 'find-us', label: 'So Finden Sie Uns', href: '#' },
      ],
    },
    contactInfo: {
      location: 'Luisenstr. 1',
      phone: '0176/88778877',
      email: 'info@muchandy.de',
    },
    collapseThreshold: 50,
    callButtonText: 'Anrufen',
    onCallClick: () => console.log('Call button clicked'),
    logo: logoFarbe,
    compactLogo: logoIconFarbe,
    showStickyIcons: true,
    stickyIconsPosition: 'right',
  };

  return createStoryHeader(headerProps);
};

MuchandyHeader.storyName = 'Muchandy Collapsible Header';

export const SecondDesign = () => {
  const headerProps = {
    siteName: 'SVAROG UI',
    navigation: {
      items: [
        { id: 'home', label: 'Home', href: '#' },
        { id: 'about', label: 'About', href: '#' },
        { id: 'services', label: 'Services', href: '#' },
        { id: 'contact', label: 'Contact', href: '#' },
      ],
    },
    contactInfo: {
      location: 'Main Street 123',
      phone: '123-456-7890',
      email: 'info@example.com',
    },
    collapseThreshold: 50,
    showStickyIcons: true,
  };

  return createStoryHeader(headerProps);
};

SecondDesign.storyName = 'Simple Design';

// Demonstration of legacy prop support
export const LegacyPropsSupport = () => {
  const headerProps = {
    siteName: 'Legacy Props Example',
    navigation: {
      items: [
        { id: 'home', label: 'Home', href: '#' },
        { id: 'contact', label: 'Contact', href: '#' },
      ],
    },
    contactInfo: {
      location: 'Main Street 123',
      phone: '123-456-7890',
      email: 'info@example.com',
    },
    collapseThreshold: 50,
    // Using legacy prop name which will be migrated to onCallClick
    onCallButtonClick: () => console.log('Legacy call button clicked'),
    showStickyIcons: true,
  };

  return createStoryHeader(headerProps);
};

LegacyPropsSupport.storyName = 'Legacy Props Support';

// We need to clean up event listeners and DOM elements when stories are unmounted
const cleanup = () => {
  // Remove any sticky icons from the DOM
  const stickyElements = document.querySelectorAll('.sticky-contact-icons');
  stickyElements.forEach((el) => {
    if (el.parentNode) el.parentNode.removeChild(el);
  });
};

// Attach the cleanup function to all stories
MuchandyHeader.parameters = {
  docs: { source: { type: 'dynamic' } },
  beforeDestroy: cleanup,
};

SecondDesign.parameters = {
  docs: { source: { type: 'dynamic' } },
  beforeDestroy: cleanup,
};

LegacyPropsSupport.parameters = {
  docs: { source: { type: 'dynamic' } },
  beforeDestroy: cleanup,
};
