// src/components/ContactInfo/ContactInfo.stories.js
import ContactInfo from './ContactInfo.js';

export default {
  title: 'Components/ContactInfo',
  component: ContactInfo,
};

export const Default = () => {
  return new ContactInfo({
    location: 'Luisenstr. 1',
    phone: '0176/88778877',
    email: 'info@muchandy.de',
  });
};

export const WithCustomClass = () => {
  return new ContactInfo({
    location: 'Luisenstr. 1',
    phone: '0176/88778877',
    email: 'info@muchandy.de',
    className: 'header-contact-info',
  });
};

export const WithCustomLocationId = () => {
  return new ContactInfo({
    location: 'Luisenstr. 1',
    phone: '0176/88778877',
    email: 'info@muchandy.de',
    locationId: 'store-location',
  });
};

export const WithClickHandlers = () => {
  // Create a status display for click testing
  const wrapper = document.createElement('div');
  wrapper.style.padding = '20px';
  wrapper.style.backgroundColor = '#f7f9fc';
  wrapper.style.borderRadius = '8px';
  wrapper.style.maxWidth = '500px';

  // Status display
  const statusDisplay = document.createElement('div');
  statusDisplay.id = 'click-status';
  statusDisplay.style.margin = '20px 0';
  statusDisplay.style.padding = '15px';
  statusDisplay.style.backgroundColor = '#ffffff';
  statusDisplay.style.border = '1px solid #e0e0e0';
  statusDisplay.style.borderRadius = '4px';
  statusDisplay.style.minHeight = '100px';
  statusDisplay.innerHTML = '<p>Click status will appear here</p>';

  // Title
  const title = document.createElement('h3');
  title.textContent = 'Click Testing Demo';
  title.style.marginBottom = '15px';

  // Create the contact info component with click handlers
  const contactInfo = new ContactInfo({
    location: 'Luisenstr. 1',
    phone: '0176/88778877',
    email: 'info@muchandy.de',
    locationId: 'location-section',
    onLocationClick: (event) => {
      statusDisplay.innerHTML =
        '<p><strong>Location clicked!</strong></p>' +
        `<p>Target: #${event.currentTarget.getAttribute('data-href').substring(1)}</p>` +
        `<p>Time: ${new Date().toLocaleTimeString()}</p>`;
      return false; // Prevent default behavior
    },
    onPhoneClick: (event) => {
      statusDisplay.innerHTML =
        '<p><strong>Phone clicked!</strong></p>' +
        `<p>Number: ${event.currentTarget.getAttribute('data-href').substring(4)}</p>` +
        `<p>Time: ${new Date().toLocaleTimeString()}</p>`;
      return false; // Prevent default behavior
    },
    onEmailClick: (event) => {
      statusDisplay.innerHTML =
        '<p><strong>Email clicked!</strong></p>' +
        `<p>Email: ${event.currentTarget.getAttribute('data-href').substring(7)}</p>` +
        `<p>Time: ${new Date().toLocaleTimeString()}</p>`;
      return false; // Prevent default behavior
    },
  });

  // Instructions
  const instructions = document.createElement('div');
  instructions.innerHTML = `
    <p><strong>Test instructions:</strong></p>
    <p>Click on any contact item below to see the click response in the status box.</p>
  `;

  // Append all elements
  wrapper.appendChild(title);
  wrapper.appendChild(instructions);
  wrapper.appendChild(contactInfo.getElement());
  wrapper.appendChild(statusDisplay);

  return wrapper;
};
