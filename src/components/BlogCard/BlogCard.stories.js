// src/components/BlogCard/BlogCard.stories.js
import BlogCard from './BlogCard.js';

export default {
  title: 'Components/Blog/BlogCard',
  component: BlogCard,
  parameters: {
    docs: {
      description: {
        component:
          'BlogCard component with CSS injection for displaying blog post previews. Styles are automatically injected when the component is rendered.',
      },
    },
  },
};

const defaultArgs = {
  title: 'Getting Started with Web Components',
  slug: 'getting-started-with-web-components',
  excerpt:
    'Learn how to create reusable web components using vanilla JavaScript. This guide covers the basics of custom elements, shadow DOM, and component lifecycle.',
  imageUrl:
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80',
  publishedDate: '2024-01-15T00:00:00Z',
  author: 'Jane Smith',
  categories: ['Web Development', 'JavaScript'],
};

export const Default = () => {
  return BlogCard(defaultArgs);
};

export const WithoutImage = () => {
  const args = { ...defaultArgs };
  delete args.imageUrl;
  return BlogCard(args);
};

export const WithoutAuthor = () => {
  const args = { ...defaultArgs };
  delete args.author;
  return BlogCard(args);
};

export const WithLongExcerpt = () => {
  return BlogCard({
    ...defaultArgs,
    excerpt:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  });
};

export const WithManyCategories = () => {
  return BlogCard({
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

// Story to demonstrate migration from legacy prop
export const LegacyPropMigration = () => {
  return BlogCard({
    ...defaultArgs,
    featuredImage: defaultArgs.imageUrl, // This will show a deprecation warning
  });
};

// Story to demonstrate style injection
export const StyleInjectionDemo = () => {
  const container = document.createElement('div');
  container.innerHTML = `
    <div style="margin-bottom: 1rem; padding: 1rem; background: #f5f5f5; border-radius: 4px;">
      <h3>CSS Injection Demo</h3>
      <p>This BlogCard component automatically injects its styles when rendered. Check the document head for a &lt;style&gt; tag with <code>data-svarog="blogcard"</code>.</p>
      <button onclick="
        const styleEl = document.querySelector('[data-svarog=blogcard]');
        if (styleEl) {
          alert('Styles found! ID: ' + styleEl.id + ', Length: ' + styleEl.textContent.length + ' characters');
        } else {
          alert('No styles found - component may not be rendered yet');
        }
      ">Check Injected Styles</button>
    </div>
  `;

  const blogCard = BlogCard(defaultArgs);
  container.appendChild(blogCard.getElement());

  return container;
};
