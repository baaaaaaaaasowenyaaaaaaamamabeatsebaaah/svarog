// src/components/Head/Head.stories.js
import Head from './Head.js';

export default {
  title: 'Components/Head',
  component: Head,
  parameters: {
    docs: {
      description: {
        component: 'A component for managing SEO metadata in document head.',
      },
    },
  },
};

export const BasicSEO = () => {
  const head = Head({
    title: 'Professional Web Design Services',
    description:
      'Expert web design and development, creating stunning, high-performance websites tailored to your business needs.',
    keywords: ['web design', 'development', 'responsive websites'],
  });
  head.render();
  return head.getElement();
};

export const AdvancedSEO = () => {
  const head = Head({
    title: 'Digital Marketing Agency | Growth Experts',
    description:
      'Comprehensive digital marketing solutions to accelerate your online presence and drive business growth.',
    canonicalUrl: 'https://www.yourcompany.com/digital-marketing',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: 'Your Digital Marketing Agency',
      description: 'Expert digital marketing solutions',
      offers: {
        '@type': 'Offer',
        description: 'Comprehensive digital marketing services',
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  });
  head.render();
  return head.getElement();
};

export const RestrictedIndexing = () => {
  const head = Head({
    title: 'Internal Development Page',
    description: 'A page for internal testing and development',
    robots: {
      index: false,
      follow: false,
    },
  });
  head.render();
  return head.getElement();
};

export const MultiLanguage = () => {
  const head = Head({
    title: 'Multilingual Website | International Presence',
    description: 'Serving customers globally with multilingual web solutions',
    lang: 'es',
    keywords: ['internacional', 'multilingüe', 'web global'],
    alternateLanguages: [
      { hreflang: 'en', href: 'https://example.com/en' },
      { hreflang: 'fr', href: 'https://example.com/fr' },
      { hreflang: 'de', href: 'https://example.com/de' },
    ],
  });
  head.render();
  return head.getElement();
};

export const WithOpenGraph = () => {
  const head = Head({
    title: 'Share This Page on Social Media',
    description: 'A page optimized for social media sharing.',
    openGraph: {
      title: 'Share This Awesome Content',
      description: 'Check out this amazing article about web development!',
      image: 'https://example.com/image.jpg',
      type: 'article',
      url: 'https://example.com/article',
      siteName: 'Web Dev Blog',
    },
  });
  head.render();
  return head.getElement();
};

export const WithTwitterCard = () => {
  const head = Head({
    title: 'Tweet This Content',
    description: 'Content optimized for Twitter sharing.',
    twitterCard: {
      title: 'Tweet This!',
      description: 'An insightful article about modern web development.',
      image: 'https://example.com/twitter-image.jpg',
      type: 'summary_large_image',
      site: '@webdevblog',
      creator: '@authorhandle',
    },
  });
  head.render();
  return head.getElement();
};

export const ComprehensiveSEO = () => {
  const container = document.createElement('div');
  container.style.marginBottom = '20px';

  // Create info element to show what's happening
  const info = document.createElement('div');
  info.innerHTML =
    '<h3>Comprehensive SEO Head (Check browser document head)</h3>' +
    '<p>This example demonstrates a comprehensive SEO setup with:</p>' +
    '<ul>' +
    '<li>Basic metadata (title, description)</li>' +
    '<li>Open Graph tags for social media</li>' +
    '<li>Twitter Card for Twitter sharing</li>' +
    '<li>Structured data (JSON-LD)</li>' +
    '<li>Alternate language versions</li>' +
    '<li>Additional meta tags</li>' +
    '</ul>' +
    '<p><strong>Note:</strong> The actual head tags are rendered in document.head, visible in browser DevTools.</p>';

  container.appendChild(info);

  // Create and render the head component
  const head = Head({
    title: 'Ultimate Guide to Modern JavaScript',
    description:
      'A comprehensive, in-depth guide to modern JavaScript programming techniques and best practices.',
    lang: 'en',
    canonicalUrl: 'https://example.com/javascript-guide',
    keywords: [
      'javascript',
      'programming',
      'web development',
      'ES6',
      'tutorial',
    ],
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: 'The Ultimate JavaScript Guide 2023',
      description:
        'Learn everything about modern JavaScript development in this comprehensive guide.',
      image: 'https://example.com/js-guide-cover.jpg',
      type: 'article',
      url: 'https://example.com/javascript-guide',
      siteName: 'Web Dev Academy',
    },
    twitterCard: {
      title: 'The Ultimate JavaScript Guide',
      description: 'Master modern JavaScript with this in-depth guide',
      image: 'https://example.com/js-guide-twitter.jpg',
      type: 'summary_large_image',
      site: '@webdevacademy',
      creator: '@jsexpert',
    },
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Ultimate Guide to Modern JavaScript',
      author: {
        '@type': 'Person',
        name: 'JS Expert',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Web Dev Academy',
        logo: {
          '@type': 'ImageObject',
          url: 'https://example.com/logo.png',
        },
      },
      datePublished: '2023-05-15',
      dateModified: '2023-05-20',
      image: 'https://example.com/js-guide-cover.jpg',
      description:
        'A comprehensive, in-depth guide to modern JavaScript programming techniques and best practices.',
    },
    alternateLanguages: [
      { hreflang: 'es', href: 'https://example.com/es/javascript-guide' },
      { hreflang: 'fr', href: 'https://example.com/fr/javascript-guide' },
    ],
    themeColor: '#3182ce',
  });

  head.render();

  // Add some additional meta tags to demonstrate the addMeta method
  head.addMeta({ name: 'author', content: 'JS Expert' });
  head.addMeta({ name: 'copyright', content: '© 2023 Web Dev Academy' });

  // Create button to toggle theme color
  const themeButton = document.createElement('button');
  themeButton.textContent = 'Change Theme Color';
  themeButton.style.padding = '8px 16px';
  themeButton.style.marginTop = '16px';
  themeButton.style.backgroundColor = '#3182ce';
  themeButton.style.color = 'white';
  themeButton.style.border = 'none';
  themeButton.style.borderRadius = '4px';
  themeButton.style.cursor = 'pointer';

  let currentColor = '#3182ce';
  themeButton.addEventListener('click', () => {
    currentColor = currentColor === '#3182ce' ? '#e53e3e' : '#3182ce';
    head.setThemeColor(currentColor);
    themeButton.style.backgroundColor = currentColor;
  });

  container.appendChild(themeButton);

  return container;
};

export const InteractiveHead = () => {
  const container = document.createElement('div');

  // Create info element
  const info = document.createElement('div');
  info.innerHTML =
    '<h3>Interactive Head Component</h3>' +
    '<p>Use the controls below to modify the head metadata in real-time.</p>';
  container.appendChild(info);

  // Create the head component
  const head = Head({
    title: 'Interactive Example',
    description: 'An interactive example of the Head component.',
  });
  head.render();

  // Create form for interactive controls
  const form = document.createElement('form');
  form.style.display = 'flex';
  form.style.flexDirection = 'column';
  form.style.gap = '16px';
  form.style.maxWidth = '500px';
  form.style.margin = '20px 0';

  // Title control
  const titleGroup = document.createElement('div');
  const titleLabel = document.createElement('label');
  titleLabel.textContent = 'Title:';
  titleLabel.htmlFor = 'title-input';
  const titleInput = document.createElement('input');
  titleInput.id = 'title-input';
  titleInput.type = 'text';
  titleInput.value = 'Interactive Example';
  titleInput.style.width = '100%';
  titleInput.style.padding = '8px';
  titleInput.style.marginTop = '4px';
  titleGroup.appendChild(titleLabel);
  titleGroup.appendChild(titleInput);
  form.appendChild(titleGroup);

  // Description control
  const descGroup = document.createElement('div');
  const descLabel = document.createElement('label');
  descLabel.textContent = 'Description:';
  descLabel.htmlFor = 'desc-input';
  const descInput = document.createElement('input');
  descInput.id = 'desc-input';
  descInput.type = 'text';
  descInput.value = 'An interactive example of the Head component.';
  descInput.style.width = '100%';
  descInput.style.padding = '8px';
  descInput.style.marginTop = '4px';
  descGroup.appendChild(descLabel);
  descGroup.appendChild(descInput);
  form.appendChild(descGroup);

  // Theme color control
  const colorGroup = document.createElement('div');
  const colorLabel = document.createElement('label');
  colorLabel.textContent = 'Theme Color:';
  colorLabel.htmlFor = 'color-input';
  const colorInput = document.createElement('input');
  colorInput.id = 'color-input';
  colorInput.type = 'color';
  colorInput.value = '#3182ce';
  colorInput.style.width = '50px';
  colorInput.style.height = '30px';
  colorInput.style.marginTop = '4px';
  colorGroup.appendChild(colorLabel);
  colorGroup.appendChild(colorInput);
  form.appendChild(colorGroup);

  // Apply button
  const applyButton = document.createElement('button');
  applyButton.type = 'button';
  applyButton.textContent = 'Apply Changes';
  applyButton.style.padding = '8px 16px';
  applyButton.style.backgroundColor = '#48bb78';
  applyButton.style.color = 'white';
  applyButton.style.border = 'none';
  applyButton.style.borderRadius = '4px';
  applyButton.style.cursor = 'pointer';

  applyButton.addEventListener('click', () => {
    head.update({
      title: titleInput.value,
      description: descInput.value,
    });
    head.setThemeColor(colorInput.value);
    head.render();
  });

  form.appendChild(applyButton);
  container.appendChild(form);

  return container;
};
