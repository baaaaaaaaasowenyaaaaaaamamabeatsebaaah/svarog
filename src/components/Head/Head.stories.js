import Head from './Head.js';

export default {
  title: 'Components/Head',
  component: Head,
};

export const BasicSEO = () => {
  const head = new Head({
    title: 'Professional Web Design Services',
    description:
      'Expert web design and development, creating stunning, high-performance websites tailored to your business needs.',
    keywords: ['web design', 'development', 'responsive websites'],
  });
  head.render();
  return head.getElement();
};

export const AdvancedSEO = () => {
  const head = new Head({
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
  const head = new Head({
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
  const head = new Head({
    title: 'Multilingual Website | International Presence',
    description: 'Serving customers globally with multilingual web solutions',
    lang: 'es',
    keywords: ['internacional', 'multilingüe', 'web global'],
  });
  head.render();
  return head.getElement();
};
