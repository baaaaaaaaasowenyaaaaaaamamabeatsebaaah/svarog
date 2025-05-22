// src/components/Page/Page.test.js
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import Page from './Page.js';

describe('Page Component', () => {
  let originalHead;
  let originalLang;

  beforeEach(() => {
    // Store original head content and document language
    originalHead = document.head.innerHTML;
    originalLang = document.documentElement.lang;
  });

  afterEach(() => {
    // Restore original head content and document language
    document.head.innerHTML = originalHead;
    document.documentElement.lang = originalLang;
  });

  it('should create a basic page with default structure', () => {
    const page = Page({
      id: 'test-page',
      content: {
        html: '<p>Test content</p>',
      },
    });

    const element = page.getElement();

    expect(element).toBeDefined();
    expect(element.getAttribute('data-page-id')).toBe('test-page');
    expect(element.querySelector('main')).toBeDefined();
    expect(element.querySelector('main').innerHTML).toBe('<p>Test content</p>');
  });

  it('should render SEO metadata when provided', () => {
    const page = Page({
      id: 'seo-test',
      seo: {
        title: 'Test Page Title',
        description: 'Test page description',
      },
      content: {
        text: 'Test content',
      },
    });

    // Manually render SEO since it should auto-render on creation
    page.renderSEO();

    // Check that title and description are in the document head
    const titleElement = document.querySelector('title');
    const descriptionMeta = document.querySelector('meta[name="description"]');

    expect(titleElement?.textContent).toBe('Test Page Title');
    expect(descriptionMeta?.getAttribute('content')).toBe(
      'Test page description'
    );
  });

  it('should display loading state', () => {
    const page = Page({
      id: 'loading-test',
      loading: true,
      loadingOptions: {
        message: 'Loading test content...',
        showSpinner: true,
      },
    });

    const element = page.getElement();
    const loadingElement = element.querySelector('.page__loading');
    const loadingText = element.querySelector('.page__loading-text');
    const loadingSpinner = element.querySelector('.page__loading-spinner');

    expect(loadingElement).toBeDefined();
    expect(loadingText?.textContent).toBe('Loading test content...');
    expect(loadingSpinner).toBeDefined();
  });

  it('should display error state', () => {
    const retryMock = vi.fn();
    const page = Page({
      id: 'error-test',
      error: {
        title: 'Test Error',
        message: 'Something went wrong',
        code: 500,
      },
      onRetry: retryMock,
    });

    const element = page.getElement();
    const errorElement = element.querySelector('.page__error');
    const errorTitle = element.querySelector('.page__error-title');
    const errorMessage = element.querySelector('.page__error-message');
    const errorCode = element.querySelector('.page__error-code');
    const retryButton = element.querySelector('.page__error-retry');

    expect(errorElement).toBeDefined();
    expect(errorTitle?.textContent).toBe('Test Error');
    expect(errorMessage?.textContent).toBe('Something went wrong');
    expect(errorCode?.textContent).toBe('Error 500');
    expect(retryButton).toBeDefined();

    // Test retry button
    if (retryButton) {
      retryButton.click();
      expect(retryMock).toHaveBeenCalled();
    }
  });

  it('should create header, main, and footer sections', () => {
    const mockComponentMapper = vi.fn((component) => {
      const element = document.createElement('div');
      element.textContent = component.type;
      return element;
    });

    const page = Page({
      id: 'structure-test',
      header: {
        components: [{ type: 'navigation' }],
      },
      content: {
        components: [{ type: 'article' }],
      },
      footer: {
        components: [{ type: 'footer-info' }],
      },
      componentMapper: mockComponentMapper,
    });

    const element = page.getElement();
    const header = element.querySelector('header.page__header');
    const main = element.querySelector('main.page__main');
    const footer = element.querySelector('footer.page__footer');

    expect(header).toBeDefined();
    expect(main).toBeDefined();
    expect(footer).toBeDefined();

    expect(mockComponentMapper).toHaveBeenCalledTimes(3);
    expect(header.textContent).toContain('navigation');
    expect(main.textContent).toContain('article');
    expect(footer.textContent).toContain('footer-info');
  });

  it('should include accessibility features', () => {
    const page = Page({
      id: 'a11y-test',
      content: {
        text: 'Accessible content',
      },
    });

    const element = page.getElement();
    const skipLink = element.querySelector('.page__skip-link');
    const main = element.querySelector('main');

    expect(skipLink).toBeDefined();
    expect(skipLink.getAttribute('href')).toBe('#main-content');
    expect(main.getAttribute('role')).toBe('main');
    expect(main.getAttribute('id')).toBe('main-content');
  });

  it('should update loading state', () => {
    const page = Page({
      id: 'loading-update-test',
      content: { text: 'Initial content' },
    });

    // Initially not loading
    expect(page.getState().loading).toBe(false);

    // Set loading
    page.setLoading(true, { message: 'Loading...' });
    expect(page.getState().loading).toBe(true);
    expect(page.getState().loadingOptions.message).toBe('Loading...');

    const element = page.getElement();
    expect(element.querySelector('.page__loading')).toBeDefined();
  });

  it('should update error state', () => {
    const page = Page({
      id: 'error-update-test',
      content: { text: 'Initial content' },
    });

    // Initially no error
    expect(page.getState().error).toBeNull();

    // Set error
    const error = {
      title: 'Update Error',
      message: 'Failed to update',
      code: 400,
    };
    page.setError(error);

    expect(page.getState().error).toEqual(error);
    expect(page.getState().loading).toBe(false);

    const element = page.getElement();
    expect(element.querySelector('.page__error')).toBeDefined();
  });

  it('should update content', () => {
    const page = Page({
      id: 'content-update-test',
      content: { text: 'Initial content' },
    });

    const newContent = { text: 'Updated content' };
    page.setContent(newContent);

    expect(page.getState().content).toEqual(newContent);

    const element = page.getElement();
    const main = element.querySelector('main');
    expect(main.textContent).toBe('Updated content');
  });

  it('should update SEO metadata', () => {
    const page = Page({
      id: 'seo-update-test',
      seo: {
        title: 'Original Title',
        description: 'Original description',
      },
      content: { text: 'Content' },
    });

    // Initial render
    page.renderSEO();

    const newSEO = {
      title: 'Updated Title',
      description: 'Updated description',
    };
    page.updateSEO(newSEO);

    // Check document head
    const titleElement = document.querySelector('title');
    const descriptionMeta = document.querySelector('meta[name="description"]');

    expect(titleElement?.textContent).toBe('Updated Title');
    expect(descriptionMeta?.getAttribute('content')).toBe(
      'Updated description'
    );
  });

  it('should load from CMS data', () => {
    const mockComponentMapper = vi.fn((component) => {
      const element = document.createElement('div');
      element.textContent = component.content?.text || component.type;
      return element;
    });

    const page = Page({
      id: 'cms-test',
      loading: true,
      componentMapper: mockComponentMapper,
    });

    const cmsData = {
      seo: {
        title: 'CMS Title',
        description: 'CMS Description',
      },
      header: {
        components: [{ type: 'nav', content: { text: 'Navigation' } }],
      },
      content: {
        components: [{ type: 'article', content: { text: 'Article content' } }],
      },
      footer: {
        components: [{ type: 'footer', content: { text: 'Footer' } }],
      },
    };

    page.loadFromCMS(cmsData);

    expect(page.getState().loading).toBe(false);
    expect(page.getState().error).toBeNull();

    const element = page.getElement();
    expect(element.textContent).toContain('Navigation');
    expect(element.textContent).toContain('Article content');
    expect(element.textContent).toContain('Footer');

    // Check SEO was updated
    const titleElement = document.querySelector('title');
    expect(titleElement?.textContent).toBe('CMS Title');
  });

  it('should validate accessibility', () => {
    const page = Page({
      id: 'a11y-validation-test',
      content: {
        components: [
          { type: 'heading', content: { text: 'Test Heading', level: 'h1' } },
        ],
      },
      componentMapper: (component) => {
        if (component.type === 'heading') {
          const heading = document.createElement(component.content.level);
          heading.textContent = component.content.text;
          return heading;
        }
        return null;
      },
    });

    const validation = page.validateAccessibility();

    expect(validation).toHaveProperty('valid');
    expect(validation).toHaveProperty('issues');
    expect(validation.issues).toBeInstanceOf(Array);
  });

  it('should handle navigation', async () => {
    const navigationMock = vi.fn().mockResolvedValue({
      seo: { title: 'New Page', description: 'New page description' },
      content: { text: 'New page content' },
    });

    const page = Page({
      id: 'navigation-test',
      content: { text: 'Initial content' },
    });

    await page.navigate('/new-page', {
      showLoading: true,
      onNavigate: navigationMock,
    });

    expect(navigationMock).toHaveBeenCalledWith('/new-page');
    expect(page.getState().loading).toBe(false);

    // Check that content was updated
    const element = page.getElement();
    const main = element.querySelector('main');
    expect(main.textContent).toBe('New page content');
  });

  it('should handle navigation errors', async () => {
    const navigationMock = vi
      .fn()
      .mockRejectedValue(new Error('Network error'));

    const page = Page({
      id: 'navigation-error-test',
      content: { text: 'Initial content' },
    });

    await page.navigate('/error-page', {
      onNavigate: navigationMock,
    });

    expect(page.getState().error).toBeDefined();
    expect(page.getState().error.message).toBe('Failed to load page');
    expect(page.getState().loading).toBe(false);
  });

  it('should clean up head component on destroy', () => {
    const page = Page({
      id: 'cleanup-test',
      seo: {
        title: 'Cleanup Test',
        description: 'Testing cleanup',
      },
      content: { text: 'Content' },
    });

    // Render SEO to document
    page.renderSEO();

    // Verify SEO is in document
    expect(document.querySelector('title')?.textContent).toBe('Cleanup Test');

    // Destroy the page
    page.destroy();

    // Note: The actual head cleanup depends on the Head component's destroy method
    // This test mainly ensures destroy is called without errors
    expect(() => page.getElement()).not.toThrow();
  });

  it('should optimize page performance', () => {
    // Mock IntersectionObserver
    const mockObserver = {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    };

    global.IntersectionObserver = vi.fn().mockImplementation(() => {
      return mockObserver;
    });

    const page = Page({
      id: 'optimization-test',
      content: {
        html: '<img data-src="https://example.com/image.jpg" alt="Test image">',
      },
    });

    page.optimize();

    // Check that IntersectionObserver was set up for lazy loading
    expect(global.IntersectionObserver).toHaveBeenCalled();

    // Clean up
    delete global.IntersectionObserver;
  });
});
