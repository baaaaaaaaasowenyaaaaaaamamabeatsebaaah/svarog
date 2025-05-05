// src/components/StickyContactIcons/StickyContactIcons.stories.js
import StickyContactIcons from './StickyContactIcons.js';

export default {
  title: 'Components/StickyContactIcons',
  component: StickyContactIcons,
};

export const Default = () => {
  return new StickyContactIcons({
    location: 'Luisenstr. 1',
    phone: '0176/88778877',
    email: 'info@muchandy.de',
  });
};

export const WithoutTooltips = () => {
  return new StickyContactIcons({
    location: 'Luisenstr. 1',
    phone: '0176/88778877',
    email: 'info@muchandy.de',
    showTooltips: false,
  });
};

export const WithCustomClass = () => {
  return new StickyContactIcons({
    location: 'Luisenstr. 1',
    phone: '0176/88778877',
    email: 'info@muchandy.de',
    className: 'primary-contact-icons',
  });
};

export const WithClickHandlers = () => {
  // Create a wrapper for demonstration purposes
  const wrapper = document.createElement('div');
  wrapper.style.position = 'relative';
  wrapper.style.height = '400px';
  wrapper.style.border = '1px dashed #ccc';
  wrapper.style.padding = '20px';

  // Status display for click events
  const statusDisplay = document.createElement('div');
  statusDisplay.id = 'click-status';
  statusDisplay.style.padding = '15px';
  statusDisplay.style.backgroundColor = '#f5f5f5';
  statusDisplay.style.borderRadius = '4px';
  statusDisplay.style.marginBottom = '20px';
  statusDisplay.innerHTML = '<p>Click an icon to see the event</p>';

  // Create the sticky contact icons component
  const stickyIcons = new StickyContactIcons({
    location: 'Luisenstr. 1',
    phone: '0176/88778877',
    email: 'info@muchandy.de',
    locationId: 'location-section',
    onLocationClick: () => {
      statusDisplay.innerHTML = `<p><strong>Location clicked!</strong> - ${new Date().toLocaleTimeString()}</p>`;
      return false; // Prevent default behavior
    },
    onPhoneClick: () => {
      statusDisplay.innerHTML = `<p><strong>Phone clicked!</strong> - ${new Date().toLocaleTimeString()}</p>`;
      return false; // Prevent default behavior
    },
    onEmailClick: () => {
      statusDisplay.innerHTML = `<p><strong>Email clicked!</strong> - ${new Date().toLocaleTimeString()}</p>`;
      return false; // Prevent default behavior
    },
  });

  // Add note about position
  const note = document.createElement('p');
  note.textContent =
    'Note: Icons are positioned fixed on the right side of the viewport, not within this container.';
  note.style.color = '#666';

  // Append elements to wrapper
  wrapper.appendChild(statusDisplay);
  wrapper.appendChild(note);
  document.body.appendChild(stickyIcons.getElement());

  // Return wrapper for story display
  return wrapper;
};

// Add story parameters without unused event parameter
export const parameters = {
  docs: {
    story: {
      inline: false,
    },
  },
  beforeDestroy: () => {
    const stickyElements = document.querySelectorAll('.sticky-contact-icons');
    stickyElements.forEach((el) => {
      if (el.parentElement) {
        el.parentElement.removeChild(el);
      }
    });
  },
};
