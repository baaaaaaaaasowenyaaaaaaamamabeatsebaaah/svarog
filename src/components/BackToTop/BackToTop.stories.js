// src/components/BackToTop/BackToTop.stories.js
import BackToTop from './BackToTop.js';
import BackToTopContainer from './BackToTopContainer.js';
import { createElement } from '../../utils/componentFactory.js';

// Global cleanup for Storybook
let activeComponents = [];
let storyCleanupTasks = [];

// Helper to clean up between stories
const cleanupStory = () => {
  // Destroy all active components
  activeComponents.forEach((component) => {
    try {
      if (component && typeof component.destroy === 'function') {
        component.destroy();
      }
    } catch (err) {
      console.warn('Error destroying component:', err);
    }
  });
  activeComponents = [];

  // Run additional cleanup tasks
  storyCleanupTasks.forEach((task) => {
    try {
      task();
    } catch (err) {
      console.warn('Error in cleanup task:', err);
    }
  });
  storyCleanupTasks = [];

  // Reset any scroll positions
  if (typeof window !== 'undefined') {
    window.scrollTo(0, 0);
  }
};

// Helper to register component for cleanup
const registerComponent = (component) => {
  activeComponents.push(component);
  return component;
};

// Helper to add cleanup task
const addCleanupTask = (task) => {
  storyCleanupTasks.push(task);
};

// Helper to create scrollable content
const createScrollableContent = (height = '200vh') => {
  return createElement('div', {
    style: {
      height,
      padding: '2rem',
      background: 'linear-gradient(to bottom, #f0f0f0, #e0e0e0)',
      boxSizing: 'border-box',
    },
    children: [
      createElement('h1', {
        text: 'Scroll down to see the BackToTop button',
        style: { margin: '0 0 1rem 0' },
      }),
      createElement('p', {
        text: 'This content is tall enough to require scrolling. The BackToTop button will appear when you scroll down.',
        style: { margin: '0 0 2rem 0' },
      }),
      createElement('div', {
        style: { marginTop: '50vh' },
        children: [
          createElement('h2', {
            text: 'Middle of the page',
            style: { margin: '0 0 1rem 0' },
          }),
          createElement('p', {
            text: 'Keep scrolling to see more content...',
            style: { margin: '0' },
          }),
        ],
      }),
      createElement('div', {
        style: { marginTop: '50vh' },
        children: [
          createElement('h2', {
            text: 'Bottom of the page',
            style: { margin: '0 0 1rem 0' },
          }),
          createElement('p', {
            text: 'Click the BackToTop button to return to the top!',
            style: { margin: '0' },
          }),
        ],
      }),
    ],
  });
};

// Helper to create a scrollable container for Storybook
const createScrollableContainer = (height = '400px') => {
  const container = createElement('div', {
    style: {
      height,
      overflow: 'auto',
      border: '2px solid #ccc',
      borderRadius: '8px',
      position: 'relative',
      backgroundColor: '#fff',
    },
  });

  // Add cleanup for scroll listeners on this container
  addCleanupTask(() => {
    container.scrollTop = 0; // Reset scroll position
  });

  return container;
};

// Presentational version for demos
const createPresentationalBackToTop = (props = {}) => {
  const classes = [
    'back-to-top',
    'back-to-top--visible', // Always visible for demo
    props.disabled ? 'back-to-top--disabled' : '',
    props.className,
  ].filter(Boolean);

  const iconElement = createElement('span', {
    classes: ['back-to-top__icon'],
    text: props.icon || '↑',
  });

  const element = createElement('button', {
    classes,
    attributes: {
      type: 'button',
      'aria-label': props.ariaLabel || 'Back to top',
      'aria-hidden': 'false',
      tabindex: props.disabled ? '-1' : '0',
    },
    children: [iconElement],
    style: {
      position: 'fixed',
      bottom: props.position?.bottom || '2rem',
      right: props.position?.right || '2rem',
      ...props.style,
    },
  });

  if (props.onClick) {
    element.addEventListener('click', props.onClick);
  }

  return {
    getElement: () => element,
    destroy: () => element.remove(),
  };
};

export const Default = () => {
  cleanupStory(); // Clean up previous story

  const container = createScrollableContainer();
  const content = createScrollableContent();
  container.appendChild(content);

  const backToTop = registerComponent(
    BackToTop({
      scrollTarget: container,
      showAfter: 100,
    })
  );

  container.appendChild(backToTop.getElement());
  return container;
};

export const WindowScrolling = () => {
  cleanupStory();

  const container = createElement('div', {
    style: { minHeight: '100vh' },
  });

  const content = createScrollableContent();
  container.appendChild(content);

  const backToTop = registerComponent(
    BackToTop({
      scrollTarget: window,
      showAfter: 200,
    })
  );

  container.appendChild(backToTop.getElement());
  return container;
};

export const CustomIcon = () => {
  cleanupStory();

  const container = createScrollableContainer();
  const content = createScrollableContent();
  container.appendChild(content);

  const backToTop = registerComponent(
    BackToTop({
      scrollTarget: container,
      icon: '⬆️',
      showAfter: 100,
    })
  );

  container.appendChild(backToTop.getElement());
  return container;
};

export const CustomPosition = () => {
  cleanupStory();

  const container = createScrollableContainer();
  const content = createScrollableContent();
  container.appendChild(content);

  const backToTop = registerComponent(
    BackToTop({
      scrollTarget: container,
      position: { bottom: '1rem', left: '1rem' },
      icon: '🔝',
      showAfter: 100,
    })
  );

  container.appendChild(backToTop.getElement());
  return container;
};

export const WithCallbacks = () => {
  cleanupStory();

  const container = createScrollableContainer();

  const status = createElement('div', {
    style: {
      position: 'absolute',
      top: '1rem',
      left: '1rem',
      background: '#fff',
      padding: '0.5rem 1rem',
      border: '1px solid #ccc',
      borderRadius: '4px',
      zIndex: '1001',
      fontSize: '0.875rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    text: 'Button status: hidden',
  });
  container.appendChild(status);

  const content = createScrollableContent();
  container.appendChild(content);

  const backToTop = registerComponent(
    BackToTop({
      scrollTarget: container,
      showAfter: 50,
      onClick: () => {
        status.textContent = 'Button clicked! Scrolling to top...';
        setTimeout(() => {
          status.textContent = 'Button status: hidden';
        }, 2000);
      },
      onShow: () => {
        status.textContent = 'Button status: visible';
      },
      onHide: () => {
        status.textContent = 'Button status: hidden';
      },
    })
  );

  container.appendChild(backToTop.getElement());
  return container;
};

export const FastScroll = () => {
  cleanupStory();

  const container = createScrollableContainer();
  const content = createScrollableContent();
  container.appendChild(content);

  const backToTop = registerComponent(
    BackToTop({
      scrollTarget: container,
      scrollDuration: 200, // Very fast
      showAfter: 100,
    })
  );

  container.appendChild(backToTop.getElement());
  return container;
};

export const SlowScroll = () => {
  cleanupStory();

  const container = createScrollableContainer();
  const content = createScrollableContent();
  container.appendChild(content);

  const backToTop = registerComponent(
    BackToTop({
      scrollTarget: container,
      scrollDuration: 1500, // Very slow
      showAfter: 100,
    })
  );

  container.appendChild(backToTop.getElement());
  return container;
};

// Presentational stories (always visible for demo purposes)
export const PresentationalDefault = () => {
  cleanupStory();

  const container = createElement('div', {
    style: {
      height: '400px',
      background: 'linear-gradient(to bottom, #f0f0f0, #e0e0e0)',
      position: 'relative',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.2rem',
      color: '#666',
    },
    text: 'BackToTop button always visible for demonstration',
  });

  const backToTop = registerComponent(createPresentationalBackToTop());
  container.appendChild(backToTop.getElement());

  return container;
};

export const PresentationalVariants = () => {
  cleanupStory();

  const container = createElement('div', {
    style: {
      height: '500px',
      background: 'linear-gradient(to bottom, #f0f0f0, #e0e0e0)',
      position: 'relative',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.2rem',
      color: '#666',
    },
    text: 'Multiple BackToTop button variants',
  });

  const variants = [
    {
      position: { bottom: '2rem', right: '2rem' },
      icon: '↑',
    },
    {
      position: { bottom: '6rem', right: '2rem' },
      icon: '⬆️',
    },
    {
      position: { bottom: '10rem', right: '2rem' },
      icon: '🔝',
    },
    {
      position: { bottom: '2rem', right: '6rem' },
      icon: '▲',
    },
  ];

  variants.forEach((props) => {
    const backToTop = registerComponent(createPresentationalBackToTop(props));
    container.appendChild(backToTop.getElement());
  });

  return container;
};

export const PresentationalDisabled = () => {
  cleanupStory();

  const container = createElement('div', {
    style: {
      height: '400px',
      background: 'linear-gradient(to bottom, #f0f0f0, #e0e0e0)',
      position: 'relative',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.2rem',
      color: '#666',
    },
    text: 'Disabled BackToTop button',
  });

  const backToTop = registerComponent(
    createPresentationalBackToTop({
      disabled: true,
    })
  );
  container.appendChild(backToTop.getElement());

  return container;
};

export const InteractiveDemo = () => {
  cleanupStory();

  const mainContainer = createElement('div', {
    style: { position: 'relative' },
  });

  const container = createScrollableContainer();

  const controls = createElement('div', {
    style: {
      position: 'absolute',
      top: '1rem',
      left: '1rem',
      background: '#fff',
      padding: '1rem',
      border: '1px solid #ccc',
      borderRadius: '4px',
      zIndex: '1001',
      minWidth: '200px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
  });

  const showButton = createElement('button', {
    text: 'Force Show',
    style: {
      marginRight: '0.5rem',
      padding: '0.25rem 0.5rem',
      border: '1px solid #ccc',
      borderRadius: '4px',
      background: '#fff',
      cursor: 'pointer',
    },
  });

  const hideButton = createElement('button', {
    text: 'Force Hide',
    style: {
      marginRight: '0.5rem',
      padding: '0.25rem 0.5rem',
      border: '1px solid #ccc',
      borderRadius: '4px',
      background: '#fff',
      cursor: 'pointer',
    },
  });

  const scrollButton = createElement('button', {
    text: 'Scroll to Top',
    style: {
      padding: '0.25rem 0.5rem',
      border: '1px solid #ccc',
      borderRadius: '4px',
      background: '#fff',
      cursor: 'pointer',
    },
  });

  controls.appendChild(showButton);
  controls.appendChild(hideButton);
  controls.appendChild(scrollButton);

  mainContainer.appendChild(controls);

  const content = createScrollableContent();
  container.appendChild(content);

  const backToTop = registerComponent(
    BackToTopContainer({
      scrollTarget: container,
      showAfter: 150,
      icon: '🚀',
      _storyMode: true,
    })
  );

  if (backToTop._story) {
    backToTop._story.mount(container);
    backToTop._story.setupScrollListener(container);
  }

  // Wire up controls
  showButton.addEventListener('click', () => backToTop.show());
  hideButton.addEventListener('click', () => backToTop.hide());
  scrollButton.addEventListener('click', () => backToTop.scrollToTop());

  mainContainer.appendChild(container);
  return mainContainer;
};

// Export metadata
export default {
  title: 'Components/BackToTop',
  component: BackToTop,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A floating button that provides smooth scroll-to-top functionality with intelligent visibility control.',
      },
    },
  },
};
