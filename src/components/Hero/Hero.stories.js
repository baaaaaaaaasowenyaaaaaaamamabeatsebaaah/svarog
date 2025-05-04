// src/components/Hero/Hero.stories.js
import Hero from './Hero.js';

export default {
  title: 'Components/Layout/Hero',
  component: Hero,
};

export const Default = () => {
  return new Hero({
    title: 'Welcome to Svarog',
    subtitle: 'Build amazing web applications with our component library',
    ctaText: 'Get Started',
    ctaLink: '/docs',
  });
};

export const WithBackground = () => {
  return new Hero({
    title: 'Create Beautiful Websites',
    subtitle: 'Modern components for modern web development',
    ctaText: 'Explore Components',
    ctaLink: '/components',
    backgroundImage:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80',
  });
};

export const LeftAligned = () => {
  return new Hero({
    title: 'Left Aligned Hero',
    subtitle: 'This hero section is aligned to the left',
    ctaText: 'Learn More',
    ctaLink: '/about',
    align: 'left',
  });
};

export const RightAligned = () => {
  return new Hero({
    title: 'Right Aligned Hero',
    subtitle: 'This hero section is aligned to the right',
    ctaText: 'Contact Us',
    ctaLink: '/contact',
    align: 'right',
  });
};

export const WithCallbackAction = () => {
  return new Hero({
    title: 'Interactive Hero',
    subtitle: 'Click the button to see an alert',
    ctaText: 'Click Me',
    onCtaClick: () => alert('Button clicked!'),
  });
};

export const MinimalHero = () => {
  return new Hero({
    title: 'Simple Hero Section',
  });
};

export const WithLongContent = () => {
  return new Hero({
    title: 'Discover the Power of Modern Web Development',
    subtitle:
      "Our comprehensive component library provides everything you need to build stunning, responsive web applications. From basic UI elements to complex interactive components, we've got you covered.",
    ctaText: 'Start Building Today',
    ctaLink: '/get-started',
    backgroundImage:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1920&q=80',
  });
};
