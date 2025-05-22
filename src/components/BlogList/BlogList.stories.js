// src/components/BlogList/BlogList.stories.js
import BlogList from './BlogList.js';

export default {
  title: 'Components/Blog/BlogList',
  component: BlogList,
};

const samplePosts = [
  {
    title: 'Getting Started with Web Components',
    slug: 'getting-started-with-web-components',
    excerpt:
      'Learn how to create reusable web components using vanilla JavaScript.',
    featuredImage:
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80',
    publishedDate: '2024-01-15T00:00:00Z',
    author: 'Jane Smith',
    categories: ['Web Development', 'JavaScript'],
  },
  {
    title: 'Understanding CSS Grid Layout',
    slug: 'understanding-css-grid-layout',
    excerpt:
      'A comprehensive guide to CSS Grid Layout with practical examples.',
    featuredImage:
      'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&q=80',
    publishedDate: '2024-01-10T00:00:00Z',
    author: 'John Doe',
    categories: ['CSS', 'Web Design'],
  },
  {
    title: 'Modern JavaScript Features',
    slug: 'modern-javascript-features',
    excerpt:
      'Explore the latest JavaScript features and how to use them effectively.',
    featuredImage:
      'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80',
    publishedDate: '2024-01-05T00:00:00Z',
    author: 'Alice Johnson',
    categories: ['JavaScript', 'ES6+'],
  },
];

export const Default = () => {
  return BlogList({
    posts: samplePosts,
    title: 'Latest Posts',
  });
};

export const WithoutTitle = () => {
  return BlogList({
    posts: samplePosts,
  });
};

export const EmptyState = () => {
  return BlogList({
    posts: [],
    title: 'Blog Posts',
  });
};

export const TwoColumns = () => {
  return BlogList({
    posts: samplePosts,
    title: 'Latest Posts',
    columns: 2,
  });
};

export const SingleColumn = () => {
  return BlogList({
    posts: samplePosts,
    title: 'Latest Posts',
    columns: 1,
  });
};
