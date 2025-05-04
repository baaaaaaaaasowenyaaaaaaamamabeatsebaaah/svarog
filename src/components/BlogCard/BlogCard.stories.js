// src/components/BlogCard/BlogCard.stories.js
import BlogCard from './BlogCard.js';

export default {
  title: 'Components/Blog/BlogCard',
  component: BlogCard,
};

const defaultArgs = {
  title: 'Getting Started with Web Components',
  slug: 'getting-started-with-web-components',
  excerpt:
    'Learn how to create reusable web components using vanilla JavaScript. This guide covers the basics of custom elements, shadow DOM, and component lifecycle.',
  featuredImage:
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80',
  publishedDate: '2024-01-15T00:00:00Z',
  author: 'Jane Smith',
  categories: ['Web Development', 'JavaScript'],
};

export const Default = () => {
  return new BlogCard(defaultArgs);
};

export const WithoutImage = () => {
  const args = { ...defaultArgs };
  delete args.featuredImage;
  return new BlogCard(args);
};

export const WithoutAuthor = () => {
  const args = { ...defaultArgs };
  delete args.author;
  return new BlogCard(args);
};

export const WithLongExcerpt = () => {
  return new BlogCard({
    ...defaultArgs,
    excerpt:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  });
};

export const WithManyCategories = () => {
  return new BlogCard({
    ...defaultArgs,
    categories: [
      'Web Development',
      'JavaScript',
      'Frontend',
      'Tutorial',
      'Components',
    ],
  });
};
