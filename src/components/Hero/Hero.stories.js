// src/components/Hero/Hero.stories.js
import Hero from './Hero.js';

export default {
  title: 'Components/Layout/Hero',
  component: Hero,
};

export const Default = () => {
  const hero = Hero({
    title: 'Welcome to Svarog',
    subtitle: 'Build amazing web applications with our component library',
    ctaText: 'Get Started',
    ctaHref: '/docs',
  });
  return hero.getElement();
};

export const WithBackground = () => {
  const hero = Hero({
    title: 'Create Beautiful Websites',
    subtitle: 'Modern components for modern web development',
    ctaText: 'Explore Components',
    ctaHref: '/components',
    backgroundImageUrl:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80',
  });
  return hero.getElement();
};

export const LeftAligned = () => {
  const hero = Hero({
    title: 'Left Aligned Hero',
    subtitle: 'This hero section is aligned to the left',
    ctaText: 'Learn More',
    ctaHref: '/about',
    align: 'left',
  });
  return hero.getElement();
};

export const RightAligned = () => {
  const hero = Hero({
    title: 'Right Aligned Hero',
    subtitle: 'This hero section is aligned to the right',
    ctaText: 'Contact Us',
    ctaHref: '/contact',
    align: 'right',
  });
  return hero.getElement();
};

export const WithCallbackAction = () => {
  const hero = Hero({
    title: 'Interactive Hero',
    subtitle: 'Click the button to see an alert',
    ctaText: 'Click Me',
    onClick: () => alert('Button clicked!'),
  });
  return hero.getElement();
};

export const MinimalHero = () => {
  const hero = Hero({
    title: 'Simple Hero Section',
  });
  return hero.getElement();
};

export const WithLongContent = () => {
  const hero = Hero({
    title: 'Discover the Power of Modern Web Development',
    subtitle:
      "Our comprehensive component library provides everything you need to build stunning, responsive web applications. From basic UI elements to complex interactive components, we've got you covered.",
    ctaText: 'Start Building Today',
    ctaHref: '/get-started',
    backgroundImageUrl:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1920&q=80',
  });
  return hero.getElement();
};

// Legacy props example to show backward compatibility
export const LegacyProps = () => {
  const hero = Hero({
    title: 'Using Legacy Props',
    subtitle: 'This example demonstrates backward compatibility',
    ctaText: 'Learn More',
    ctaLink: '/legacy', // Legacy prop instead of ctaHref
    backgroundImage:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1920&q=80', // Legacy prop instead of backgroundImageUrl
    onCtaClick: () => alert('Legacy click handler works!'), // Legacy prop instead of onClick
  });
  return hero.getElement();
};
