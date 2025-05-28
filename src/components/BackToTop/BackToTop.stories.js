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
      if (
        component &&
        !component.isDestroyed() &&
        typeof component.destroy === 'function'
      ) {
        component.destroy();
      }
    } catch (err) {
      console.warn('Error destroying component:', err);
    }
  });
  activeComponents.clear();

  // Reset scroll positions in all possible containers
  if (typeof window !== 'undefined') {
    // Reset main window
    window.scrollTo(0, 0);

    // Reset document containers
    [document.documentElement, document.body].forEach((el) => {
      if (el) el.scrollTop = 0;
    });

    // Reset any custom scrollable containers
    document.querySelectorAll('[style*="overflow"]').forEach((el) => {
      el.scrollTop = 0;
    });

    // Clean up any remaining back-to-top buttons
    document.querySelectorAll('.back-to-top').forEach((btn) => {
      if (btn.parentNode) {
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
        textContent: 'Scroll down to see the BackToTop button',
        style: { margin: '0 0 1rem 0' },
      }),
      createElement('p', {
        textContent:
          'This content is tall enough to require scrolling. The BackToTop button will appear when you scroll down.',
        style: { margin: '0 0 2rem 0' },
      }),
      createElement('div', {
        style: { marginTop: '50vh' },
        children: [
          createElement('h2', {
            textContent: 'Middle of the page',
            style: { margin: '0 0 1rem 0' },
          }),
          createElement('p', {
            textContent: 'Keep scrolling to see more content...',
            style: { margin: '0' },
          }),
        ],
      }),
      createElement('div', {
        style: { marginTop: '50vh' },
        children: [
          createElement('h2', {
            textContent: 'Bottom of the page',
            style: { margin: '0 0 1rem 0' },
          }),
          createElement('p', {
            textContent: 'Click the BackToTop button to return to the top!',
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

// Enhanced window scrolling story
export const WindowScrolling = () => {
  cleanupStory();

  // Create the main container with explicit height to force scrolling
  const container = createElement('div', {
    style: {
      height: '300vh', // Much taller to ensure scrolling
      position: 'relative',
      width: '100%',
    },
  });

  const content = createElement('div', {
    style: {
      padding: '2rem',
      background: 'linear-gradient(to bottom, #f0f0f0, #e0e0e0)',
      height: '100%',
      minHeight: '300vh',
    },
    children: [
      createElement('h1', {
        textContent: 'Window Scrolling Demo',
        style: { margin: '0 0 1rem 0' },
      }),
      createElement('p', {
        textContent:
          'Scroll down to see the BackToTop button appear after 100px of scrolling.',
        style: { margin: '0 0 2rem 0' },
      }),
      createElement('div', {
        style: {
          marginTop: '30vh',
          padding: '1rem',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '8px',
        },
        children: [
          createElement('h2', {
            textContent: 'Scroll More...',
            style: { margin: '0 0 1rem 0' },
          }),
          createElement('p', {
            textContent: 'Keep scrolling to trigger the BackToTop button.',
            style: { margin: '0' },
          }),
        ],
      }),
      createElement('div', {
        style: {
          marginTop: '60vh',
          padding: '1rem',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '8px',
        },
        children: [
          createElement('h2', {
            textContent: 'Button Should Be Visible',
            style: { margin: '0 0 1rem 0' },
          }),
          createElement('p', {
            textContent:
              'The BackToTop button should be visible now. Click it to return to the top!',
            style: { margin: '0' },
          }),
        ],
      }),
      createElement('div', {
        style: {
          marginTop: '80vh',
          padding: '1rem',
          backgroundColor: 'rgba(255, 255, 255, 1)',
          borderRadius: '8px',
        },
        children: [
          createElement('h2', {
            textContent: 'Bottom Section',
            style: { margin: '0 0 1rem 0' },
          }),
          createElement('p', {
            textContent:
              'This is the bottom. The BackToTop button should definitely be visible now!',
            style: { margin: '0' },
          }),
        ],
      }),
    ],
  });

  container.appendChild(content);

  // Debug function to find the actual scrolling element
  const findScrollingElement = () => {
    // Try multiple strategies to find the scrolling container
    const candidates = [];

    // Check parent window (Storybook iframe case)
    if (window.parent !== window) {
      try {
        candidates.push(window.parent);
        if (window.parent.document) {
          candidates.push(window.parent.document.documentElement);
          candidates.push(window.parent.document.body);
        }
      } catch (_e) {
        // Cross-origin, can't access parent
      }
    }

    // Check current window
    candidates.push(window);
    candidates.push(document.documentElement);
    candidates.push(document.body);

    // Check for Storybook specific containers
    const storybookContainers = [
      document.querySelector('#storybook-root'),
      document.querySelector('[data-name="Main"]'),
      document.querySelector('.sb-show-main'),
      document.querySelector('#root'),
    ].filter(Boolean);

    candidates.push(...storybookContainers);

    console.log('Scroll candidates found:', candidates.length);

    // Test each candidate
    for (const candidate of candidates) {
      if (!candidate) continue;

      try {
        if (candidate === window || candidate.window === candidate) {
          console.log('Testing window candidate:', candidate);
          return candidate;
        }

        const computedStyle = window.getComputedStyle(candidate);
        const hasScrollableStyle =
          computedStyle.overflow === 'auto' ||
          computedStyle.overflow === 'scroll' ||
          computedStyle.overflowY === 'auto' ||
          computedStyle.overflowY === 'scroll';

        const hasScrollableContent =
          candidate.scrollHeight > candidate.clientHeight;

        console.log('Testing element:', candidate, {
          hasScrollableStyle,
          hasScrollableContent,
          scrollHeight: candidate.scrollHeight,
          clientHeight: candidate.clientHeight,
        });

        if (hasScrollableStyle || hasScrollableContent) {
          return candidate;
        }
      } catch (e) {
        console.log('Error testing candidate:', e);
      }
    }

    return window; // Fallback
  };

  // Create BackToTop component after DOM is ready
  setTimeout(() => {
    const scrollTarget = findScrollingElement();
    console.log('Selected scroll target:', scrollTarget);

    const backToTop = registerComponent(
      BackToTop({
        scrollTarget,
        showAfter: 100, // Lower threshold for easier testing
        scrollDuration: 600,
        onShow: () => {
          console.log('BackToTop button shown');
        },
        onHide: () => {
          console.log('BackToTop button hidden');
        },
      })
    );

    // Append button to the story container instead of document.body
    container.appendChild(backToTop.getElement());

    // Force initial visibility check after a brief delay
    setTimeout(() => {
      console.log('Forcing initial visibility check');
      if (backToTop.checkVisibility) {
        backToTop.checkVisibility();
      }
    }, 200);
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
    textContent: 'Button status: hidden',
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
      scrollDuration: 200, // Very fast
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
      scrollDuration: 1500, // Very slow
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

    // Add label
    const wrapper = createElement('div', {
      children: [
        createElement('h3', {
          textContent: `Icon: ${icon}`,
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
    textContent: 'Force Show',
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
    textContent: 'Force Hide',
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
    textContent: 'Scroll to Top',
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
    textContent: "The button is disabled and won't respond to clicks",
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

// Auto-detection demo
export const AutoDetection = () => {
  cleanupStory();

  const mainContainer = createElement('div', {
    style: {
      height: '200vh',
      padding: '2rem',
      background: 'linear-gradient(to bottom, #e3f2fd, #bbdefb)',
    },
    children: [
      createElement('h1', {
        textContent: 'Auto-Detection Demo',
        style: { margin: '0 0 1rem 0' },
      }),
      createElement('p', {
        textContent:
          'This demo automatically detects the best scroll container. No scrollTarget specified.',
        style: { margin: '0 0 2rem 0' },
      }),
      createElement('div', {
        style: {
          marginTop: '50vh',
          padding: '1rem',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '8px',
        },
        children: [
          createElement('h2', {
            textContent: 'Scroll Detection Working',
            style: { margin: '0 0 1rem 0' },
          }),
          createElement('p', {
            textContent:
              'The component automatically found the scrolling container.',
            style: { margin: '0' },
          }),
        ],
      }),
    ],
  });

  // Create BackToTop without specifying scrollTarget
  setTimeout(() => {
    const backToTop = registerComponent(
      BackToTop({
        showAfter: 150,
        icon: '🎯',
      })
    );

    document.body.appendChild(backToTop.getElement());
  }, 100);

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
          'A floating button that provides smooth scroll-to-top functionality with intelligent visibility control and auto-detection of scroll containers.',
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
