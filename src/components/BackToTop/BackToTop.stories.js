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

export const Default = () => {
  const container = createElement('div');

  // Add scrollable content
  const content = createScrollableContent();
  container.appendChild(content);

  // Add BackToTop component
  const backToTop = BackToTop();
  container.appendChild(backToTop.getElement());

  return container;
};

export const CustomIcon = () => {
  const container = createElement('div');

  const content = createScrollableContent();
  container.appendChild(content);

  const backToTop = BackToTop({
    icon: '⬆️',
    showAfter: 200,
  });
  container.appendChild(backToTop.getElement());

  return container;
};

export const CustomPosition = () => {
  const container = createElement('div');

  const content = createScrollableContent();
  container.appendChild(content);

  const backToTop = BackToTop({
    position: { bottom: '1rem', left: '1rem' },
    icon: '🔝',
  });
  container.appendChild(backToTop.getElement());

  return container;
};

export const WithCallbacks = () => {
  const container = createElement('div');

  // Create status display
  const status = createElement('div', {
    style: {
      position: 'fixed',
      top: '1rem',
      left: '1rem',
      background: '#fff',
      padding: '1rem',
      border: '1px solid #ccc',
      borderRadius: '4px',
      zIndex: '1000',
    },
    text: 'Button status: hidden',
  });
  container.appendChild(status);

  const content = createScrollableContent();
  container.appendChild(content);

  const backToTop = BackToTop({
    showAfter: 100,
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
  const container = createElement('div');

  const content = createScrollableContent();
  container.appendChild(content);

  const backToTop = BackToTop({
    scrollDuration: 200, // Very fast
    showAfter: 150,
  });
  container.appendChild(backToTop.getElement());

  return container;
};

export const SlowScroll = () => {
  const container = createElement('div');

  const content = createScrollableContent();
  container.appendChild(content);

  const backToTop = BackToTop({
    scrollDuration: 1500, // Very slow
    showAfter: 200,
  });
  container.appendChild(backToTop.getElement());

  return container;
};

export const CustomScrollContainer = () => {
  const scrollContainer = createElement('div', {
    style: {
      height: '400px',
      overflow: 'auto',
      border: '2px solid #ccc',
      margin: '2rem',
    },
  });

  const content = createScrollableContent('150vh');
  scrollContainer.appendChild(content);

  const backToTop = BackToTop({
    scrollTarget: scrollContainer,
    showAfter: 100,
    position: { bottom: '1rem', right: '1rem' },
  });

  const container = createElement('div');
  container.appendChild(scrollContainer);
  container.appendChild(backToTop.getElement());

  return container;
};

export const Disabled = () => {
  const container = createElement('div');

  const content = createScrollableContent();
  container.appendChild(content);

  const backToTop = BackToTop({
    disabled: true,
    showAfter: 100,
  });
  container.appendChild(backToTop.getElement());

  // Force show the disabled button for demonstration
  setTimeout(() => {
    backToTop.show();
  }, 100);

  return container;
};

export const MultipleButtons = () => {
  const container = createElement('div');

  const content = createScrollableContent('300vh');
  container.appendChild(content);

  // Default button
  const defaultButton = BackToTop({
    showAfter: 200,
  });
  container.appendChild(defaultButton.getElement());

  // Custom button on the left
  const leftButton = BackToTop({
    position: { bottom: '2rem', left: '2rem' },
    icon: '⬅️',
    ariaLabel: 'Scroll to left',
    showAfter: 300,
    onClick: () => {
      window.scrollTo({ left: 0, behavior: 'smooth' });
    },
  });
  container.appendChild(leftButton.getElement());

  return container;
};

export const InteractiveDemo = () => {
  const container = createElement('div');

  // Control panel
  const controls = createElement('div', {
    style: {
      position: 'fixed',
      top: '1rem',
      left: '1rem',
      background: '#fff',
      padding: '1rem',
      border: '1px solid #ccc',
      borderRadius: '4px',
      zIndex: '1000',
      minWidth: '200px',
    },
  });

  const showButton = createElement('button', {
    text: 'Force Show',
    style: { marginRight: '0.5rem' },
  });

  const hideButton = createElement('button', {
    text: 'Force Hide',
    style: { marginRight: '0.5rem' },
  });

  const scrollButton = createElement('button', {
    text: 'Scroll to Top',
  });

  controls.appendChild(showButton);
  controls.appendChild(hideButton);
  controls.appendChild(scrollButton);

  container.appendChild(controls);

  const content = createScrollableContent();
  container.appendChild(content);

  const backToTop = BackToTop({
    showAfter: 250,
    icon: '🚀',
  });
  container.appendChild(backToTop.getElement());

  // Wire up controls
  showButton.addEventListener('click', () => backToTop.show());
  hideButton.addEventListener('click', () => backToTop.hide());
  scrollButton.addEventListener('click', () => backToTop.scrollToTop());

  return container;
};

export const AllVariants = () => {
  const container = createElement('div');

  const content = createScrollableContent('400vh');
  container.appendChild(content);

  // Create multiple variants
  const variants = [
    {
      position: { bottom: '2rem', right: '2rem' },
      icon: '↑',
      label: 'Default',
    },
    { position: { bottom: '6rem', right: '2rem' }, icon: '⬆️', label: 'Emoji' },
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
      position,
      icon,
      ariaLabel: `${label} - Back to top`,
      showAfter: 150,
    });
    container.appendChild(backToTop.getElement());
  });

  return container;
};
