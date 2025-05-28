// src/components/BackToTop/BackToTop.stories.js
import BackToTop from './BackToTop.js';
import { createElement } from '../../utils/componentFactory.js';

// Global component tracking for proper cleanup
const activeComponents = new Set();

// Enhanced cleanup that handles all scenarios
const cleanupStory = () => {
  // Destroy all tracked components
  activeComponents.forEach((component) => {
    try {
      if (component && typeof component.destroy === 'function') {
        component.destroy();
      }
    } catch (err) {
      console.warn('Error destroying component:', err);
    }
  });
  activeComponents.clear();

  // Reset scroll positions in all possible containers
  if (typeof window !== 'undefined') {
    window.scrollTo(0, 0);

    [document.documentElement, document.body].forEach((el) => {
      if (el) el.scrollTop = 0;
    });

    document.querySelectorAll('[style*="overflow"]').forEach((el) => {
      el.scrollTop = 0;
    });

    // Clean up any BackToTop buttons that might be attached to document.body
    document.querySelectorAll('.back-to-top').forEach((btn) => {
      // Only remove if it's directly in body (not in story containers)
      if (btn.parentNode === document.body) {
        btn.parentNode.removeChild(btn);
      }
    });
  }
};

// Register component for tracking and cleanup
const registerComponent = (component) => {
  activeComponents.add(component);
  return component;
};

// Helper to create scrollable content
const createScrollableContent = (height = '200vh', containerHeight = null) => {
  const contentHeight = containerHeight
    ? `calc(${containerHeight} * 3)`
    : height;

  return createElement('div', {
    style: {
      height: contentHeight,
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

// Helper to create a scrollable container
const createScrollableContainer = (height = '400px') => {
  return createElement('div', {
    style: {
      height,
      overflow: 'auto',
      border: '2px solid #ccc',
      borderRadius: '8px',
      position: 'relative',
      backgroundColor: '#fff',
    },
  });
};

// Default story with container scrolling
export const Default = () => {
  cleanupStory();

  const container = createScrollableContainer();
  const content = createScrollableContent('800px', '400px');
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

// Presentational stories for static documentation
export const PresentationalDefault = () => {
  cleanupStory();

  const container = createScrollableContainer('300px');
  const content = createElement('div', {
    style: {
      height: '600px',
      padding: '2rem',
      background: 'linear-gradient(to bottom, #f8f9fa, #e9ecef)',
    },
    children: [
      createElement('h3', {
        text: 'Default BackToTop Button',
        style: { margin: '0 0 1rem 0' },
      }),
      createElement('p', {
        text: 'A simple back-to-top button with default styling. Scroll down to see it appear.',
        style: { margin: '0 0 2rem 0' },
      }),
      createElement('div', {
        style: { marginTop: '200px', textAlign: 'center' },
        children: [
          createElement('p', {
            text: 'Scroll down more...',
            style: { margin: '0' },
          }),
        ],
      }),
      createElement('div', {
        style: { marginTop: '200px', textAlign: 'center' },
        children: [
          createElement('p', {
            text: 'The button should be visible now!',
            style: { margin: '0', fontWeight: 'bold' },
          }),
        ],
      }),
    ],
  });

  container.appendChild(content);

  const backToTop = registerComponent(
    BackToTop({
      scrollTarget: container,
      showAfter: 50,
    })
  );

  container.appendChild(backToTop.getElement());
  return container;
};

export const PresentationalVariants = () => {
  cleanupStory();

  const mainContainer = createElement('div', {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '1.5rem',
      padding: '1rem',
    },
  });

  const variants = [
    { icon: '↑', label: 'Default Arrow', color: '#007bff' },
    { icon: '⬆️', label: 'Emoji Arrow', color: '#28a745' },
    { icon: '🔝', label: 'TOP Emoji', color: '#ffc107' },
    { icon: '🚀', label: 'Rocket', color: '#dc3545' },
    { icon: '⤴️', label: 'Curved Arrow', color: '#6f42c1' },
    { icon: '☝️', label: 'Finger Point', color: '#fd7e14' },
  ];

  variants.forEach(({ icon, label, color }) => {
    const container = createElement('div', {
      style: {
        border: `2px solid ${color}`,
        borderRadius: '8px',
        overflow: 'hidden',
      },
    });

    const header = createElement('div', {
      style: {
        padding: '0.75rem',
        background: color,
        color: 'white',
        fontWeight: 'bold',
        fontSize: '0.875rem',
      },
      children: [createElement('span', { text: label })],
    });

    const scrollArea = createElement('div', {
      style: {
        height: '200px',
        overflow: 'auto',
        position: 'relative',
      },
    });

    const content = createElement('div', {
      style: {
        height: '400px',
        padding: '1rem',
        background: 'linear-gradient(to bottom, #f8f9fa, #e9ecef)',
      },
      children: [
        createElement('p', {
          text: `Scroll to see the ${label} button`,
          style: { margin: '0 0 1rem 0', fontSize: '0.875rem' },
        }),
        createElement('div', {
          style: { marginTop: '150px', textAlign: 'center' },
          children: [
            createElement('p', {
              text: 'Button visible!',
              style: { margin: '0', fontSize: '0.75rem' },
            }),
          ],
        }),
      ],
    });

    scrollArea.appendChild(content);

    const backToTop = registerComponent(
      BackToTop({
        scrollTarget: scrollArea,
        showAfter: 30,
        icon,
      })
    );

    scrollArea.appendChild(backToTop.getElement());

    container.appendChild(header);
    container.appendChild(scrollArea);
    mainContainer.appendChild(container);
  });

  return mainContainer;
};

export const PresentationalDisabled = () => {
  cleanupStory();

  const container = createScrollableContainer('300px');
  const content = createElement('div', {
    style: {
      height: '600px',
      padding: '2rem',
      background: 'linear-gradient(to bottom, #f8f9fa, #e9ecef)',
    },
    children: [
      createElement('h3', {
        text: 'Disabled BackToTop Button',
        style: { margin: '0 0 1rem 0' },
      }),
      createElement('p', {
        text: 'This button is disabled and will not respond to clicks. Notice the reduced opacity.',
        style: { margin: '0 0 2rem 0' },
      }),
      createElement('div', {
        style: {
          marginTop: '200px',
          textAlign: 'center',
          padding: '1rem',
          background: 'rgba(220, 53, 69, 0.1)',
          borderRadius: '8px',
          border: '1px solid rgba(220, 53, 69, 0.2)',
        },
        children: [
          createElement('p', {
            text: '⚠️ Button is disabled',
            style: { margin: '0', color: '#dc3545', fontWeight: 'bold' },
          }),
          createElement('p', {
            text: 'Clicking will have no effect',
            style: { margin: '0.5rem 0 0 0', fontSize: '0.875rem' },
          }),
        ],
      }),
    ],
  });

  container.appendChild(content);

  const backToTop = registerComponent(
    BackToTop({
      scrollTarget: container,
      showAfter: 50,
      disabled: true,
    })
  );

  // Force show the disabled button for demonstration
  setTimeout(() => backToTop.show(), 100);

  container.appendChild(backToTop.getElement());
  return container;
};

// Container scrolling story - demonstrates scrolling within a specific container
export const ContainerScrolling = () => {
  cleanupStory();

  const scrollContainer = createElement('div', {
    style: {
      height: '400px',
      overflow: 'auto',
      border: '2px solid #4caf50',
      borderRadius: '8px',
      position: 'relative',
    },
  });

  const content = createElement('div', {
    style: {
      height: '1200px',
      padding: '2rem',
      background: 'linear-gradient(to bottom, #e8f5e8, #c8e6c9)',
    },
    children: [
      createElement('div', {
        style: {
          background: 'rgba(255, 255, 255, 0.9)',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          border: '2px solid #4caf50',
        },
        children: [
          createElement('h2', {
            text: '📦 Container Scrolling Demo',
            style: { margin: '0 0 0.5rem 0', color: '#2e7d32' },
          }),
          createElement('p', {
            text: 'This uses container scrolling (div with overflow: auto). Scroll within this container.',
            style: { margin: '0', fontSize: '0.9rem' },
          }),
        ],
      }),
      createElement('div', {
        style: { marginTop: '300px' },
        children: [
          createElement('div', {
            style: {
              background: 'rgba(255, 255, 255, 0.8)',
              padding: '2rem',
              borderRadius: '12px',
              textAlign: 'center',
            },
            children: [
              createElement('h3', {
                text: '📍 Middle Section',
                style: { margin: '0 0 1rem 0' },
              }),
              createElement('p', {
                text: 'The BackToTop button should be visible now.',
                style: { margin: '0' },
              }),
            ],
          }),
        ],
      }),
      createElement('div', {
        style: { marginTop: '300px' },
        children: [
          createElement('div', {
            style: {
              background: 'rgba(255, 255, 255, 0.9)',
              padding: '2rem',
              borderRadius: '12px',
              textAlign: 'center',
            },
            children: [
              createElement('h3', {
                text: '🎯 Bottom Section',
                style: { margin: '0 0 1rem 0' },
              }),
              createElement('p', {
                text: 'Click the BackToTop button to scroll this container back to the top!',
                style: { margin: '0' },
              }),
            ],
          }),
        ],
      }),
    ],
  });

  scrollContainer.appendChild(content);

  const backToTop = registerComponent(
    BackToTop({
      scrollTarget: scrollContainer, // Specific container
      showAfter: 100,
      scrollDuration: 600,
      icon: '📦',
    })
  );

  scrollContainer.appendChild(backToTop.getElement());
  return scrollContainer;
};

// Window scrolling story - demonstrates document-level scrolling in Storybook
export const WindowScrolling = () => {
  cleanupStory();

  // Create a very tall container that forces the Storybook stage to scroll
  const container = createElement('div', {
    style: {
      minHeight: '300vh', // Forces stage scrolling
      width: '100%',
      position: 'relative',
      padding: '2rem',
      background: 'linear-gradient(to bottom, #e3f2fd, #bbdefb, #90caf9)',
    },
    children: [
      createElement('div', {
        style: {
          position: 'sticky',
          top: '10px',
          background: 'rgba(255, 255, 255, 0.9)',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          border: '2px solid #2196f3',
        },
        children: [
          createElement('h2', {
            text: '🪟 Document Scrolling Demo',
            style: { margin: '0 0 0.5rem 0', color: '#1976d2' },
          }),
          createElement('p', {
            text: 'This demonstrates document-level scrolling. In Storybook, this means the .stage element scrolls.',
            style: { margin: '0', fontSize: '0.9rem' },
          }),
        ],
      }),
      createElement('div', {
        style: { marginTop: '50vh' },
        children: [
          createElement('div', {
            style: {
              background: 'rgba(255, 255, 255, 0.8)',
              padding: '2rem',
              borderRadius: '12px',
              textAlign: 'center',
            },
            children: [
              createElement('h3', {
                text: '📍 Middle Section',
                style: { margin: '0 0 1rem 0' },
              }),
              createElement('p', {
                text: 'The BackToTop button should be visible now since you scrolled the document/stage.',
                style: { margin: '0' },
              }),
            ],
          }),
        ],
      }),
      createElement('div', {
        style: { marginTop: '80vh' },
        children: [
          createElement('div', {
            style: {
              background: 'rgba(255, 255, 255, 0.9)',
              padding: '2rem',
              borderRadius: '12px',
              textAlign: 'center',
            },
            children: [
              createElement('h3', {
                text: '🎯 Bottom Section',
                style: { margin: '0 0 1rem 0' },
              }),
              createElement('p', {
                text: 'Click the BackToTop button to scroll back to the top!',
                style: { margin: '0' },
              }),
            ],
          }),
        ],
      }),
    ],
  });

  // Detect Storybook's actual scrolling container
  setTimeout(() => {
    const storybookStage =
      document.querySelector('.stage') ||
      document.querySelector('.stage__inner') ||
      document.documentElement;

    console.log('🎭 Detected Storybook scroll container:', storybookStage);

    const backToTop = registerComponent(
      BackToTop({
        scrollTarget: storybookStage, // Target the actual scrolling element
        showAfter: 200,
        scrollDuration: 800,
        icon: '🔝',
      })
    );

    // Append to the story container so it's positioned relative to the scrolling area
    container.appendChild(backToTop.getElement());
  }, 100);

  return container;
};

// Custom icon story
export const CustomIcon = () => {
  cleanupStory();

  const container = createScrollableContainer();
  const content = createScrollableContent('800px', '400px');
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

// Custom position story
export const CustomPosition = () => {
  cleanupStory();

  const container = createScrollableContainer();
  const content = createScrollableContent('800px', '400px');
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

// With callbacks story
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

  const content = createScrollableContent('800px', '400px');
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

// Fast scroll animation
export const FastScroll = () => {
  cleanupStory();

  const container = createScrollableContainer();
  const content = createScrollableContent('800px', '400px');
  container.appendChild(content);

  const backToTop = registerComponent(
    BackToTop({
      scrollTarget: container,
      scrollDuration: 200,
      showAfter: 100,
    })
  );

  container.appendChild(backToTop.getElement());
  return container;
};

// Slow scroll animation
export const SlowScroll = () => {
  cleanupStory();

  const container = createScrollableContainer();
  const content = createScrollableContent('800px', '400px');
  container.appendChild(content);

  const backToTop = registerComponent(
    BackToTop({
      scrollTarget: container,
      scrollDuration: 1500,
      showAfter: 100,
    })
  );

  container.appendChild(backToTop.getElement());
  return container;
};

// Multiple icons showcase
export const IconVariants = () => {
  cleanupStory();

  const mainContainer = createElement('div', {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '1rem',
      padding: '1rem',
    },
  });

  const icons = ['↑', '⬆️', '🔝', '▲', '⇧', '⤴️', '🚀', '☝️'];

  icons.forEach((icon) => {
    const container = createScrollableContainer('300px');
    const content = createScrollableContent('600px', '300px');
    container.appendChild(content);

    const backToTop = registerComponent(
      BackToTop({
        scrollTarget: container,
        icon,
        showAfter: 50,
      })
    );

    container.appendChild(backToTop.getElement());

    const wrapper = createElement('div', {
      children: [
        createElement('h3', {
          text: `Icon: ${icon}`,
          style: { margin: '0 0 0.5rem 0', textAlign: 'center' },
        }),
        container,
      ],
    });

    mainContainer.appendChild(wrapper);
  });

  return mainContainer;
};

// Interactive demo with controls
export const InteractiveDemo = () => {
  cleanupStory();

  const mainContainer = createElement('div', {
    style: { position: 'relative' },
  });

  const container = createScrollableContainer('500px');

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

  const content = createScrollableContent('1000px', '500px');
  container.appendChild(content);

  const backToTop = registerComponent(
    BackToTop({
      scrollTarget: container,
      showAfter: 150,
      icon: '🚀',
    })
  );

  container.appendChild(backToTop.getElement());

  // Wire up controls
  showButton.addEventListener('click', () => backToTop.show());
  hideButton.addEventListener('click', () => backToTop.hide());
  scrollButton.addEventListener('click', () => backToTop.scrollToTop());

  mainContainer.appendChild(container);
  return mainContainer;
};

// Disabled state demo
export const DisabledState = () => {
  cleanupStory();

  const container = createScrollableContainer();
  const content = createScrollableContent('800px', '400px');
  container.appendChild(content);

  const backToTop = registerComponent(
    BackToTop({
      scrollTarget: container,
      showAfter: 50,
      disabled: true,
    })
  );

  // Force show to demonstrate disabled appearance
  setTimeout(() => backToTop.show(), 100);

  container.appendChild(backToTop.getElement());

  const info = createElement('p', {
    text: "The button is disabled and won't respond to clicks",
    style: {
      position: 'absolute',
      top: '1rem',
      left: '1rem',
      background: '#fff',
      padding: '0.5rem',
      border: '1px solid #ccc',
      borderRadius: '4px',
      fontSize: '0.875rem',
    },
  });

  container.appendChild(info);

  return container;
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
  argTypes: {
    showAfter: {
      control: { type: 'number', min: 0, max: 1000, step: 50 },
      description: 'Scroll distance (px) before button appears',
    },
    scrollDuration: {
      control: { type: 'number', min: 100, max: 2000, step: 100 },
      description: 'Smooth scroll animation duration (ms)',
    },
    icon: {
      control: { type: 'text' },
      description: 'Icon content (text or emoji)',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the button is disabled',
    },
  },
};
