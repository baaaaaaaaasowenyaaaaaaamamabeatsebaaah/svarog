// .storybook/utils/bodyMountedStories.js

/**
 * Creates a Storybook container for components that need to be mounted to document.body
 * Handles proper cleanup when navigating between stories
 *
 * @param {Function} Component - Component factory function
 * @param {Object} props - Props to pass to the component
 * @param {Object} options - Additional options
 * @param {string} options.title - Title to display in the container
 * @param {string} options.description - Description text
 * @param {number} options.height - Container height in pixels
 * @param {string} options.statusId - ID for the status display element
 * @returns {HTMLElement} Container element for Storybook display
 */
export const createBodyMountedStory = (Component, props, options = {}) => {
  const {
    title = 'Body Mounted Component',
    description = 'This component is mounted to document.body but will be cleaned up when navigating away.',
    height = 400,
    statusId = 'status-display',
  } = options;

  // Create a container for the story display
  const storyContainer = document.createElement('div');
  storyContainer.style.position = 'relative';
  storyContainer.style.minHeight = `${height}px`;
  storyContainer.style.border = '1px dashed #ccc';
  storyContainer.style.padding = '20px';
  storyContainer.dataset.storyId = `story-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Add description and placeholder
  storyContainer.innerHTML = `
    <div style="padding: 15px; background-color: #f5f5f5; border-radius: 4px; margin-bottom: 20px;">
      <p><strong>${title}</strong></p>
      <p style="color: #666;">${description}</p>
    </div>
    <div id="${statusId}" style="padding: 15px; background-color: #fff; border: 1px solid #eee; border-radius: 4px; margin-top: 20px;">
      <p>Component status updates will appear here</p>
    </div>
  `;

  // Create the component instance
  const component = Component(props);

  // Store reference to the element
  const element = component.getElement();

  // Add a data attribute to track which story created this element
  element.dataset.createdBy = storyContainer.dataset.storyId;

  // Append to body
  document.body.appendChild(element);

  // Keep track of whether we've cleaned up
  let isCleanedUp = false;

  // Function to handle cleanup
  const cleanup = () => {
    if (isCleanedUp) return;
    isCleanedUp = true;

    try {
      if (element && element.parentNode === document.body) {
        document.body.removeChild(element);
      }

      if (component && typeof component.destroy === 'function') {
        component.destroy();
      }

      if (observer) {
        observer.disconnect();
      }

      // Remove the unload listener if it exists
      if (unloadListener) {
        window.removeEventListener('beforeunload', unloadListener);
      }

      console.log(
        `Cleaned up body-mounted component for story: ${storyContainer.dataset.storyId}`
      );
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  };

  // Set up cleanup when the story container is removed from DOM
  const observer = new MutationObserver((mutations) => {
    // Check if our container is no longer in the DOM
    if (!document.body.contains(storyContainer)) {
      cleanup();
      return;
    }

    // Check for story navigation
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        for (const removedNode of mutation.removedNodes) {
          if (
            removedNode === storyContainer ||
            (removedNode.contains && removedNode.contains(storyContainer))
          ) {
            cleanup();
            return;
          }
        }
      }
    }
  });

  // Start observing the document
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Also clean up any existing body-mounted components from other stories
  const existingElements = document.querySelectorAll('[data-created-by]');
  existingElements.forEach((existingEl) => {
    if (existingEl.dataset.createdBy !== storyContainer.dataset.storyId) {
      console.log(
        `Removing orphaned body-mounted component: ${existingEl.dataset.createdBy}`
      );
      if (existingEl.parentNode === document.body) {
        document.body.removeChild(existingEl);
      }
    }
  });

  // Add a manual cleanup button
  const cleanupButton = document.createElement('button');
  cleanupButton.textContent = 'Force Cleanup';
  cleanupButton.style.cssText =
    'margin-top: 20px; padding: 8px 16px; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer;';
  cleanupButton.addEventListener('click', cleanup);
  storyContainer.appendChild(cleanupButton);

  // Also clean up on page unload
  const unloadListener = () => cleanup();
  window.addEventListener('beforeunload', unloadListener);

  // Update status display method
  storyContainer.updateStatus = (message) => {
    const statusEl = storyContainer.querySelector(`#${statusId}`);
    if (statusEl) {
      statusEl.innerHTML = `<p>${message}</p>`;
    }
  };

  return storyContainer;
};
