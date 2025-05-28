// src/components/BackToTop/BackToTop.stories.js
import BackToTop from './BackToTop.js';
import { createElement } from '../../utils/componentFactory.js';

// Helper to create scrollable content
const createScrollableContent = (height = '200vh') => {
  return createElement('div', {
    style: {
      height,
      padding: '2rem',
      background: 'linear-gradient(to bottom, #f0f0f0, #e0e0e0)',
    },
    children: [
      createElement('h1', { text: 'Scroll down to see the BackToTop button' }),
      createElement('p', {
        text: 'This content is tall enough to require scrolling. The BackToTop button will appear when you scroll down 300px (by default).',
      }),
      createElement('div', {
        style: { marginTop: '50vh' },
        children: [
          createElement('h2', { text: 'Middle of the page' }),
          createElement('p', { text: 'Keep scrolling to see more content...' }),
        ],
      }),
      createElement('div', {
        style: { marginTop: '50vh' },
        children: [
          createElement('h2', { text: 'Bottom of the page' }),
          createElement('p', {
            text: 'Click the BackToTop button to return to the top!',
          }),
        ],
      }),
    ],
  });
};

// Helper to create a scrollable container for Storybook
const createScrollableContainer = (height = '400px') => {
  return createElement('div', {
    style: {
      height,
      overflow: 'auto',
      border: '2px solid #ccc',
      borderRadius: '8px',
      position: 'relative',
    },
  });
};

export const Default = () => {
  const container = createScrollableContainer();

  // Add scrollable content
  const content = createScrollableContent();
  container.appendChild(content);

  // Add BackToTop component - it will auto-detect the scrollable container
  const backToTop = BackToTop({
    scrollTarget: container, // Explicitly target the container
    showAfter: 100, // Lower threshold for demo
  });

  // Mount the button to the container for proper positioning
  container.appendChild(backToTop.getElement());

  return container;
};

export const WindowScrolling = () => {
  const container = createElement('div');

  const content = createScrollableContent();
  container.appendChild(content);

  const backToTop = BackToTop({
    scrollTarget: window, // Explicitly use window
    showAfter: 200,
  });
  container.appendChild(backToTop.getElement());

  return container;
};

export const CustomIcon = () => {
  const container = createScrollableContainer();

  const content = createScrollableContent();
  container.appendChild(content);

  const backToTop = BackToTop({
    scrollTarget: container,
    icon: '⬆️',
    showAfter: 100,
  });
  container.appendChild(backToTop.getElement());

  return container;
};

export const CustomPosition = () => {
  const container = createScrollableContainer();

  const content = createScrollableContent();
  container.appendChild(content);

  const backToTop = BackToTop({
    scrollTarget: container,
    position: { bottom: '1rem', left: '1rem' },
    icon: '🔝',
    showAfter: 100,
  });
  container.appendChild(backToTop.getElement());

  return container;
};

export const WithCallbacks = () => {
  const container = createScrollableContainer();

  // Create status display
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
    },
    text: 'Button status: hidden',
  });
  container.appendChild(status);

  const content = createScrollableContent();
  container.appendChild(content);

  const backToTop = BackToTop({
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
  });
  container.appendChild(backToTop.getElement());

  return container;
};

export const FastScroll = () => {
  const container = createScrollableContainer();

  const content = createScrollableContent();
  container.appendChild(content);

  const backToTop = BackToTop({
    scrollTarget: container,
    scrollDuration: 200, // Very fast
    showAfter: 100,
  });
  container.appendChild(backToTop.getElement());

  return container;
};

export const SlowScroll = () => {
  const container = createScrollableContainer();

  const content = createScrollableContent();
  container.appendChild(content);

  const backToTop = BackToTop({
    scrollTarget: container,
    scrollDuration: 1500, // Very slow
    showAfter: 100,
  });
  container.appendChild(backToTop.getElement());

  return container;
};

export const AlwaysVisible = () => {
  const container = createScrollableContainer();

  const content = createScrollableContent();
  container.appendChild(content);

  const backToTop = BackToTop({
    scrollTarget: container,
    showAfter: 0, // Always show
  });
  container.appendChild(backToTop.getElement());

  // Force show the button
  setTimeout(() => {
    backToTop.show();
  }, 100);

  return container;
};

export const Disabled = () => {
  const container = createScrollableContainer();

  const content = createScrollableContent();
  container.appendChild(content);

  const backToTop = BackToTop({
    scrollTarget: container,
    disabled: true,
    showAfter: 50,
  });
  container.appendChild(backToTop.getElement());

  // Force show the disabled button for demonstration
  setTimeout(() => {
    backToTop.show();
  }, 100);

  return container;
};

export const MultipleButtons = () => {
  const container = createScrollableContainer('600px');

  const content = createScrollableContent('300vh');
  container.appendChild(content);

  // Default button
  const defaultButton = BackToTop({
    scrollTarget: container,
    showAfter: 100,
  });
  container.appendChild(defaultButton.getElement());

  // Custom button on the left
  const leftButton = BackToTop({
    scrollTarget: container,
    position: { bottom: '2rem', left: '2rem' },
    icon: '⬅️',
    ariaLabel: 'Scroll to left',
    showAfter: 150,
    onClick: () => {
      container.scrollTo({ left: 0, behavior: 'smooth' });
    },
  });
  container.appendChild(leftButton.getElement());

  return container;
};

export const InteractiveDemo = () => {
  const mainContainer = createElement('div', {
    style: { position: 'relative' },
  });

  const container = createScrollableContainer();

  // Control panel
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
    },
  });

  const showButton = createElement('button', {
    text: 'Force Show',
    style: { marginRight: '0.5rem', padding: '0.25rem 0.5rem' },
  });

  const hideButton = createElement('button', {
    text: 'Force Hide',
    style: { marginRight: '0.5rem', padding: '0.25rem 0.5rem' },
  });

  const scrollButton = createElement('button', {
    text: 'Scroll to Top',
    style: { padding: '0.25rem 0.5rem' },
  });

  controls.appendChild(showButton);
  controls.appendChild(hideButton);
  controls.appendChild(scrollButton);

  mainContainer.appendChild(controls);

  const content = createScrollableContent();
  container.appendChild(content);

  const backToTop = BackToTop({
    scrollTarget: container,
    showAfter: 150,
    icon: '🚀',
  });
  container.appendChild(backToTop.getElement());

  // Wire up controls
  showButton.addEventListener('click', () => backToTop.show());
  hideButton.addEventListener('click', () => backToTop.hide());
  scrollButton.addEventListener('click', () => backToTop.scrollToTop());

  mainContainer.appendChild(container);

  return mainContainer;
};

export const AllVariants = () => {
  const container = createScrollableContainer('500px');

  const content = createScrollableContent('400vh');
  container.appendChild(content);

  // Create multiple variants
  const variants = [
    {
      position: { bottom: '2rem', right: '2rem' },
      icon: '↑',
      label: 'Default',
    },
    {
      position: { bottom: '6rem', right: '2rem' },
      icon: '⬆️',
      label: 'Emoji',
    },
    {
      position: { bottom: '10rem', right: '2rem' },
      icon: '🔝',
      label: 'Top emoji',
    },
    {
      position: { bottom: '2rem', right: '6rem' },
      icon: '▲',
      label: 'Triangle',
    },
  ];

  variants.forEach(({ position, icon, label }) => {
    const backToTop = BackToTop({
      scrollTarget: container,
      position,
      icon,
      ariaLabel: `${label} - Back to top`,
      showAfter: 100,
    });
    container.appendChild(backToTop.getElement());
  });

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
};
