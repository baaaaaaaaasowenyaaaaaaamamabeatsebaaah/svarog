// src/components/Page/Page.stories.js
import Page from './Page.js';
import { validateSEO } from '../../utils/seoManager.js';

export default {
  title: 'Components/Page',
  component: Page,
  parameters: {
    docs: {
      description: {
        component:
          'A complete page component for managing structure, SEO, and content.',
      },
    },
  },
};

// Mock component mapper for demo purposes
const mockComponentMapper = (component) => {
  const { type, content } = component;

  switch (type) {
    case 'heading': {
      const headingElement = document.createElement(content.level || 'h2');
      headingElement.textContent = content.text;
      headingElement.className = 'demo-heading';
      return headingElement;
    }

    case 'paragraph': {
      const paragraphElement = document.createElement('p');
      paragraphElement.textContent = content.text;
      paragraphElement.className = 'demo-paragraph';
      return paragraphElement;
    }

    case 'image': {
      const imageElement = document.createElement('img');
      imageElement.src = content.src;
      imageElement.alt = content.alt || '';
      imageElement.className = 'demo-image';
      return imageElement;
    }

    case 'button': {
      const buttonElement = document.createElement('button');
      buttonElement.textContent = content.text;
      buttonElement.className = 'demo-button';
      return buttonElement;
    }

    default: {
      const defaultElement = document.createElement('div');
      defaultElement.textContent = `Component: ${type}`;
      defaultElement.className = 'demo-component';
      return defaultElement;
    }
  }
};

export const BasicPage = () => {
  const page = Page({
    id: 'basic-page',
    seo: {
      title: 'Basic Page Example',
      description:
        'A simple page demonstrating the basic Page component functionality.',
      keywords: ['example', 'basic', 'page'],
    },
    content: {
      components: [
        {
          type: 'heading',
          content: { text: 'Welcome to Our Basic Page', level: 'h1' },
        },
        {
          type: 'paragraph',
          content: {
            text: 'This is a basic page example showing the fundamental structure of our Page component.',
          },
        },
        {
          type: 'paragraph',
          content: {
            text: 'The page includes proper SEO metadata, accessibility features, and a clean component structure.',
          },
        },
      ],
    },
    componentMapper: mockComponentMapper,
  });

  return page.getElement();
};

export const LoadingState = () => {
  const page = Page({
    id: 'loading-page',
    loading: true,
    loadingOptions: {
      message: 'Loading awesome content...',
      showSpinner: true,
    },
  });

  return page.getElement();
};

export const ErrorState = () => {
  const page = Page({
    id: 'error-page',
    error: {
      title: 'Page Not Found',
      message: 'The page you are looking for could not be found.',
      code: 404,
    },
    onRetry: () => {
      alert('Retry button clicked!');
    },
  });

  return page.getElement();
};

export const CompletePageStructure = () => {
  const page = Page({
    id: 'complete-page',
    type: 'article',
    seo: {
      title: 'Complete Page Example | Demo Site',
      description:
        'A comprehensive example showing header, main content, and footer sections with proper SEO optimization.',
      canonicalUrl: 'https://example.com/complete-page',
      keywords: ['complete', 'example', 'page', 'structure'],
      openGraph: {
        title: 'Complete Page Example',
        description:
          'See how our Page component handles complete page structure.',
        image: 'https://picsum.photos/1200/630',
        type: 'article',
      },
      twitterCard: {
        title: 'Complete Page Example',
        description:
          'See how our Page component handles complete page structure.',
        image: 'https://picsum.photos/1200/630',
        type: 'summary_large_image',
      },
      schema: {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'Complete Page Example',
        description: 'A comprehensive example of the Page component',
        author: {
          '@type': 'Person',
          name: 'Demo Author',
        },
        datePublished: '2023-05-15',
      },
    },
    header: {
      components: [
        {
          type: 'heading',
          content: { text: 'Demo Site', level: 'h1' },
        },
        {
          type: 'paragraph',
          content: { text: 'Navigation would go here' },
        },
      ],
    },
    content: {
      components: [
        {
          type: 'heading',
          content: { text: 'Main Article Title', level: 'h1' },
        },
        {
          type: 'paragraph',
          content: {
            text: 'This is the main content area of the page. It demonstrates how the Page component can handle complex nested content structures.',
          },
        },
        {
          type: 'image',
          content: {
            src: 'https://picsum.photos/600/300',
            alt: 'Demo image showing page structure',
          },
        },
        {
          type: 'paragraph',
          content: {
            text: 'Additional content paragraphs can be added here. The Page component efficiently manages all content updates and SEO optimization.',
          },
        },
        {
          type: 'button',
          content: { text: 'Call to Action' },
        },
      ],
    },
    footer: {
      components: [
        {
          type: 'paragraph',
          content: { text: '© 2023 Demo Site. All rights reserved.' },
        },
      ],
    },
    componentMapper: mockComponentMapper,
  });

  return page.getElement();
};

export const InteractivePage = () => {
  const container = document.createElement('div');

  // Create the page
  const page = Page({
    id: 'interactive-page',
    seo: {
      title: 'Interactive Page Demo',
      description: 'Demonstrating dynamic page updates and SEO management.',
    },
    content: {
      components: [
        {
          type: 'heading',
          content: { text: 'Interactive Page Demo', level: 'h1' },
        },
        {
          type: 'paragraph',
          content: {
            text: 'Use the controls below to modify the page content and SEO.',
          },
        },
      ],
    },
    componentMapper: mockComponentMapper,
  });

  // Create controls
  const controls = document.createElement('div');
  controls.style.cssText = `
    margin: 20px 0;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: #f9f9f9;
  `;

  controls.innerHTML = `
    <h3>Page Controls</h3>
    <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 15px;">
      <button id="loading-btn" style="padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
        Toggle Loading
      </button>
      <button id="error-btn" style="padding: 8px 16px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">
        Show Error
      </button>
      <button id="content-btn" style="padding: 8px 16px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">
        Update Content
      </button>
      <button id="seo-btn" style="padding: 8px 16px; background: #6610f2; color: white; border: none; border-radius: 4px; cursor: pointer;">
        Update SEO
      </button>
      <button id="validate-btn" style="padding: 8px 16px; background: #fd7e14; color: white; border: none; border-radius: 4px; cursor: pointer;">
        Validate SEO
      </button>
    </div>
    <div id="status" style="padding: 10px; background: white; border: 1px solid #ddd; border-radius: 4px; min-height: 20px;"></div>
  `;

  container.appendChild(controls);
  container.appendChild(page.getElement());

  // Add event listeners
  const statusDiv = controls.querySelector('#status');

  controls.querySelector('#loading-btn').addEventListener('click', () => {
    try {
      const currentState = page.getState();
      const isLoading = currentState.loading;
      page.setLoading(!isLoading, {
        message: 'Updating content...',
        showSpinner: true,
      });
      statusDiv.textContent = `Loading state: ${!isLoading}`;
    } catch (error) {
      statusDiv.textContent = `Error: ${error.message}`;
    }
  });

  controls.querySelector('#error-btn').addEventListener('click', () => {
    try {
      const currentState = page.getState();
      const hasError = currentState.error;
      if (hasError) {
        page.setError(null);
        statusDiv.textContent = 'Error cleared';
      } else {
        page.setError({
          title: 'Demo Error',
          message: 'This is a demonstration error state.',
          code: 500,
        });
        statusDiv.textContent = 'Error state shown';
      }
    } catch (error) {
      statusDiv.textContent = `Error: ${error.message}`;
    }
  });

  controls.querySelector('#content-btn').addEventListener('click', () => {
    try {
      const randomId = Math.floor(Math.random() * 1000);
      page.setContent({
        components: [
          {
            type: 'heading',
            content: { text: `Updated Content #${randomId}`, level: 'h1' },
          },
          {
            type: 'paragraph',
            content: {
              text: `This content was updated at ${new Date().toLocaleTimeString()}`,
            },
          },
        ],
      });
      statusDiv.textContent = `Content updated with ID: ${randomId}`;
    } catch (error) {
      statusDiv.textContent = `Error: ${error.message}`;
    }
  });

  controls.querySelector('#seo-btn').addEventListener('click', () => {
    try {
      const timestamp = new Date().toLocaleTimeString();
      page.updateSEO({
        title: `Updated Page Title - ${timestamp}`,
        description: `Page description updated at ${timestamp}`,
      });
      statusDiv.textContent = `SEO updated at ${timestamp}`;
    } catch (error) {
      statusDiv.textContent = `Error: ${error.message}`;
    }
  });

  controls.querySelector('#validate-btn').addEventListener('click', () => {
    try {
      const currentState = page.getState();
      const seoData = currentState.seo || {};
      const validation = validateSEO(seoData);

      statusDiv.innerHTML = `
        <strong>SEO Validation Results:</strong><br>
        Score: ${validation.score}/100<br>
        Issues: ${validation.issues.length}<br>
        Warnings: ${validation.warnings.length}<br>
        Recommendations: ${validation.recommendations.length}<br>
        ${validation.issues.length > 0 ? `<br><strong>Issues:</strong> ${validation.issues.join(', ')}` : ''}
      `;
    } catch (error) {
      statusDiv.textContent = `Error: ${error.message}`;
    }
  });

  return container;
};

export const CMSSimulation = () => {
  const container = document.createElement('div');

  // Mock CMS data
  const mockCMSData = {
    seo: {
      title: 'Blog Article from CMS',
      description: 'This article was loaded from a simulated CMS system.',
      keywords: ['cms', 'blog', 'article'],
      canonicalUrl: 'https://example.com/blog/cms-article',
    },
    header: {
      components: [
        {
          type: 'heading',
          content: { text: 'Blog Site', level: 'h1' },
        },
      ],
    },
    content: {
      components: [
        {
          type: 'heading',
          content: { text: 'How to Integrate with CMS', level: 'h1' },
        },
        {
          type: 'paragraph',
          content: {
            text: 'This page demonstrates how the Page component can be integrated with a Content Management System.',
          },
        },
        {
          type: 'paragraph',
          content: {
            text: 'The component mapper translates CMS content into actual DOM elements, making it easy to work with any CMS backend.',
          },
        },
      ],
    },
    footer: {
      components: [
        {
          type: 'paragraph',
          content: { text: 'Content managed by CMS' },
        },
      ],
    },
  };

  // Create page in loading state initially
  const page = Page({
    id: 'cms-page',
    loading: true,
    loadingOptions: {
      message: 'Loading from CMS...',
    },
    componentMapper: mockComponentMapper,
  });

  container.appendChild(page.getElement());

  // Simulate CMS loading
  setTimeout(() => {
    page.loadFromCMS(mockCMSData);

    // Add status message
    const status = document.createElement('div');
    status.style.cssText = `
      margin: 20px 0;
      padding: 15px;
      background: #d4edda;
      border: 1px solid #c3e6cb;
      border-radius: 4px;
      color: #155724;
    `;
    status.textContent = 'Content successfully loaded from simulated CMS!';
    container.insertBefore(status, container.firstChild);
  }, 2000);

  return container;
};

export const AccessibilityDemo = () => {
  const page = Page({
    id: 'accessibility-page',
    seo: {
      title: 'Accessibility Features Demo',
      description:
        'Demonstrating the accessibility features of the Page component.',
    },
    content: {
      components: [
        {
          type: 'heading',
          content: { text: 'Accessibility Features', level: 'h1' },
        },
        {
          type: 'paragraph',
          content: {
            text: 'This page demonstrates the built-in accessibility features:',
          },
        },
        {
          type: 'paragraph',
          content: { text: '• Skip to main content link (visible on focus)' },
        },
        {
          type: 'paragraph',
          content: { text: '• Proper semantic HTML structure' },
        },
        {
          type: 'paragraph',
          content: { text: '• ARIA landmarks and labels' },
        },
        {
          type: 'paragraph',
          content: { text: '• Keyboard navigation support' },
        },
      ],
    },
    componentMapper: mockComponentMapper,
  });

  const container = document.createElement('div');
  container.appendChild(page.getElement());

  // Add accessibility validation
  const validationButton = document.createElement('button');
  validationButton.textContent = 'Validate Accessibility';
  validationButton.style.cssText = `
    margin: 20px 0;
    padding: 10px 20px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  `;

  const resultDiv = document.createElement('div');
  resultDiv.style.cssText = `
    margin: 10px 0;
    padding: 15px;
    border-radius: 4px;
    border: 1px solid #ddd;
  `;

  validationButton.addEventListener('click', () => {
    try {
      const validation = page.validateAccessibility();
      resultDiv.innerHTML = `
        <strong>Accessibility Validation:</strong><br>
        Status: ${validation.valid ? '✅ Passed' : '❌ Issues Found'}<br>
        ${validation.issues.length > 0 ? `Issues: ${validation.issues.join(', ')}` : 'No accessibility issues found!'}
      `;
      resultDiv.style.background = validation.valid ? '#d4edda' : '#f8d7da';
      resultDiv.style.borderColor = validation.valid ? '#c3e6cb' : '#f5c6cb';
    } catch (error) {
      resultDiv.innerHTML = `<strong>Error:</strong> ${error.message}`;
      resultDiv.style.background = '#f8d7da';
      resultDiv.style.borderColor = '#f5c6cb';
    }
  });

  container.appendChild(validationButton);
  container.appendChild(resultDiv);

  return container;
};
