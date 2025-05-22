// src/components/StickyContactIcons/StickyContactIcons.stories.js
import StickyContactIcons from './StickyContactIcons.js';
import { createBodyMountedStory } from '../../../.storybook/utils/bodyMountedStories.js';

export default {
  title: 'Components/StickyContactIcons',
  component: StickyContactIcons,
  parameters: {
    docs: {
      story: {
        inline: false,
      },
    },
  },
};

export const Default = () => {
  return createBodyMountedStory(
    StickyContactIcons,
    {
      location: 'Luisenstr. 1',
      phone: '0176/88778877',
      email: 'info@muchandy.de',
    },
    {
      title: 'StickyContactIcons',
      description:
        'Contact icons positioned fixed on the right side of the viewport',
    }
  );
};

export const WithoutTooltips = () => {
  return createBodyMountedStory(
    StickyContactIcons,
    {
      location: 'Luisenstr. 1',
      phone: '0176/88778877',
      email: 'info@muchandy.de',
      showTooltips: false,
    },
    {
      title: 'StickyContactIcons without tooltips',
      description: 'Icons without tooltips on hover, fixed on the viewport',
    }
  );
};

export const WithCustomClass = () => {
  return createBodyMountedStory(
    StickyContactIcons,
    {
      location: 'Luisenstr. 1',
      phone: '0176/88778877',
      email: 'info@muchandy.de',
      className: 'primary-contact-icons',
    },
    {
      title: 'StickyContactIcons with custom class',
      description: 'Icons with the "primary-contact-icons" CSS class',
    }
  );
};

export const WithClickHandlers = () => {
  const container = createBodyMountedStory(
    StickyContactIcons,
    {
      location: 'Luisenstr. 1',
      phone: '0176/88778877',
      email: 'info@muchandy.de',
      locationId: 'location-section',
      onLocationClick: () => {
        container.updateStatus(
          `<strong>Location clicked!</strong> - ${new Date().toLocaleTimeString()}`
        );
        return false; // Prevent default behavior
      },
      onPhoneClick: () => {
        container.updateStatus(
          `<strong>Phone clicked!</strong> - ${new Date().toLocaleTimeString()}`
        );
        return false; // Prevent default behavior
      },
      onEmailClick: () => {
        container.updateStatus(
          `<strong>Email clicked!</strong> - ${new Date().toLocaleTimeString()}`
        );
        return false; // Prevent default behavior
      },
    },
    {
      title: 'StickyContactIcons with click handlers',
      description: 'Click on any icon to see the event here',
    }
  );

  // Initialize the status display
  container.updateStatus('Click an icon to see the event');

  return container;
};
