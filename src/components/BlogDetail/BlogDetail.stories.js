// src/components/BlogDetail/BlogDetail.stories.js
import BlogDetail from './BlogDetail.js';

export default {
  title: 'Components/Blog/BlogDetail',
  component: BlogDetail,
};

const defaultContent = `
  <p>Web Components are a set of web platform APIs that allow you to create new custom, reusable, encapsulated HTML tags to use in web pages and web apps.</p>
  
  <h2>What are Web Components?</h2>
  <p>Web Components are based on four main specifications:</p>
  <ul>
    <li>Custom Elements</li>
    <li>Shadow DOM</li>
    <li>HTML Templates</li>
    <li>ES Modules</li>
  </ul>
  
  <h2>Getting Started</h2>
  <p>To create a custom element, you need to define a class that extends HTMLElement:</p>
  <pre><code>class MyElement extends HTMLElement {
  constructor() {
    super();
    // Element functionality
  }
}</code></pre>
  
  <blockquote>
    <p>"Web Components allow for the creation of reusable custom elements with encapsulated functionality and styling."</p>
  </blockquote>
  
  <h3>Benefits of Web Components</h3>
  <p>Web Components offer several advantages:</p>
  <ol>
    <li>Reusability across different frameworks</li>
    <li>Encapsulation of styles and behavior</li>
    <li>Native browser support</li>
    <li>Framework agnostic</li>
  </ol>
`;

export const Default = () => {
  return BlogDetail({
    title: 'Getting Started with Web Components',
    content: defaultContent,
    featuredImage:
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&q=80',
    publishedDate: '2024-01-15T00:00:00Z',
    author: 'Jane Smith',
    categories: ['Web Development', 'JavaScript', 'Tutorial'],
  });
};

export const WithoutImage = () => {
  return BlogDetail({
    title: 'Understanding Shadow DOM',
    content: defaultContent,
    publishedDate: '2024-01-15T00:00:00Z',
    author: 'John Doe',
    categories: ['Web Development'],
  });
};

export const MinimalContent = () => {
  return BlogDetail({
    title: 'Simple Blog Post',
    content: '<p>This is a simple blog post with minimal content.</p>',
  });
};

export const LongContent = () => {
  const longContent = `
    ${defaultContent}
    <h2>Advanced Topics</h2>
    <p>Let's dive deeper into Web Components...</p>
    ${defaultContent}
    <h2>Real-world Examples</h2>
    <p>Here are some practical applications of Web Components...</p>
    ${defaultContent}
  `;

  return BlogDetail({
    title: 'Comprehensive Guide to Web Components',
    content: longContent,
    featuredImage:
      'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1200&q=80',
    publishedDate: '2024-01-15T00:00:00Z',
    author: 'Expert Developer',
    categories: ['Web Development', 'JavaScript', 'Advanced'],
  });
};
