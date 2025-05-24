// src/components/Page/Page.js
import { createElement, validateProps } from '../../utils/componentFactory.js';
import { createBaseComponent } from '../../utils/baseComponent.js';
import Head from '../Head/Head.js';

/**
 * Migrates legacy props to standardized props
 * @param {Object} props - Original props
 * @returns {Object} Standardized props
 */
const migrateLegacyProps = (props) => {
  const migrated = { ...props };

  // No legacy props to migrate yet, but following the pattern
  // for future compatibility

  return migrated;
};

/**
 * Validates page-specific props
 * @param {Object} props - Page properties
 */
const validatePageProps = (props) => {
  if (!props.content && !props.children) {
    console.warn('Page: No content or children provided');
  }

  if (props.seo?.title && props.seo.title.length > 60) {
    console.warn('Page: SEO title exceeds recommended 60 characters');
  }

  if (props.seo?.description && props.seo.description.length > 160) {
    console.warn('Page: SEO description exceeds recommended 160 characters');
  }
};

/**
 * Creates the page loading state
 * @param {Object} options - Loading options
 * @returns {HTMLElement} Loading element
 */
const createLoadingState = (options = {}) => {
  const { message = 'Loading...', showSpinner = true } = options;

  const container = createElement('div', {
    classes: ['page__loading'],
    attributes: {
      'aria-live': 'polite',
      'aria-label': message,
    },
  });

  if (showSpinner) {
    const spinner = createElement('div', {
      classes: ['page__loading-spinner'],
      attributes: { 'aria-hidden': 'true' },
    });
    container.appendChild(spinner);
  }

  const text = createElement('p', {
    classes: ['page__loading-text'],
  });
  text.textContent = message;
  container.appendChild(text);

  return container;
};

/**
 * Creates the page error state
 * @param {Object} error - Error information
 * @param {Function} onRetry - Retry callback
 * @returns {HTMLElement} Error element
 */
const createErrorState = (error, onRetry) => {
  const {
    message = 'Something went wrong',
    code = 500,
    title = 'Error',
  } = error;

  const container = createElement('div', {
    classes: ['page__error'],
    attributes: {
      role: 'alert',
      'aria-live': 'assertive',
    },
  });

  const titleEl = createElement('h1', {
    classes: ['page__error-title'],
  });
  titleEl.textContent = title;
  container.appendChild(titleEl);

  const messageEl = createElement('p', {
    classes: ['page__error-message'],
  });
  messageEl.textContent = message;
  container.appendChild(messageEl);

  if (code) {
    const codeEl = createElement('p', {
      classes: ['page__error-code'],
    });
    codeEl.textContent = `Error ${code}`;
    container.appendChild(codeEl);
  }

  if (onRetry) {
    const retryBtn = createElement('button', {
      classes: ['page__error-retry'],
    });
    retryBtn.textContent = 'Try Again';
    retryBtn.addEventListener('click', onRetry);
    container.appendChild(retryBtn);
  }

  return container;
};

/**
 * Creates the page header section
 * @param {Object} headerConfig - Header configuration
 * @param {Function} componentMapper - Function to map components
 * @returns {HTMLElement|null} Header element
 */
const createPageHeader = (headerConfig, componentMapper) => {
  if (!headerConfig) return null;

  const header = createElement('header', {
    classes: ['page__header'],
    attributes: {
      role: 'banner',
    },
  });

  if (componentMapper && headerConfig.components) {
    headerConfig.components.forEach((component) => {
      const renderedComponent = componentMapper(component);
      if (renderedComponent) {
        header.appendChild(renderedComponent);
      }
    });
  }

  return header;
};

/**
 * Creates the page main content section
 * @param {Object} contentConfig - Content configuration
 * @param {Function} componentMapper - Function to map components
 * @returns {HTMLElement} Main content element
 */
const createPageMain = (contentConfig, componentMapper) => {
  const main = createElement('main', {
    classes: ['page__main'],
    attributes: {
      role: 'main',
      id: 'main-content',
    },
  });

  if (componentMapper && contentConfig?.components) {
    contentConfig.components.forEach((component) => {
      const renderedComponent = componentMapper(component);
      if (renderedComponent) {
        main.appendChild(renderedComponent);
      }
    });
  } else if (contentConfig?.html) {
    main.innerHTML = contentConfig.html;
  } else if (contentConfig?.text) {
    main.textContent = contentConfig.text;
  }

  return main;
};

/**
 * Creates the page footer section
 * @param {Object} footerConfig - Footer configuration
 * @param {Function} componentMapper - Function to map components
 * @returns {HTMLElement|null} Footer element
 */
const createPageFooter = (footerConfig, componentMapper) => {
  if (!footerConfig) return null;

  const footer = createElement('footer', {
    classes: ['page__footer'],
    attributes: {
      role: 'contentinfo',
    },
  });

  if (componentMapper && footerConfig.components) {
    footerConfig.components.forEach((component) => {
      const renderedComponent = componentMapper(component);
      if (renderedComponent) {
        footer.appendChild(renderedComponent);
      }
    });
  }

  return footer;
};

/**
 * Renders the complete page structure
 * @param {Object} state - Component state
 * @returns {HTMLElement} Page container element
 */
const renderPage = (state) => {
  const container = createElement('div', {
    classes: ['page'],
    attributes: {
      'data-page-id': state.id || 'page',
      'data-page-type': state.type || 'default',
    },
  });

  // Handle different page states
  if (state.loading) {
    container.appendChild(createLoadingState(state.loadingOptions));
    return container;
  }

  if (state.error) {
    container.appendChild(createErrorState(state.error, state.onRetry));
    return container;
  }

  // Skip to main content link for accessibility
  const skipLink = createElement('a', {
    classes: ['page__skip-link'],
    attributes: {
      href: '#main-content',
    },
  });
  skipLink.textContent = 'Skip to main content';
  container.appendChild(skipLink);

  // Create page sections
  const header = createPageHeader(state.header, state.componentMapper);
  const main = createPageMain(state.content, state.componentMapper);
  const footer = createPageFooter(state.footer, state.componentMapper);

  // Append sections to container
  [header, main, footer].forEach((section) => {
    if (section) container.appendChild(section);
  });

  return container;
};

/**
 * Creates a Page component for managing complete page structure and SEO
 * @param {Object} props - Page properties
 * @returns {Object} Page component with standard API
 */
const createPage = (props) => {
  // Migrate legacy props to standardized props
  const standardizedProps = migrateLegacyProps(props);

  // Validate required props
  validateProps(standardizedProps, createPage.requiredProps, 'Page');
  validatePageProps(standardizedProps);

  // Initialize page head management
  let headComponent = null;
  if (standardizedProps.seo) {
    headComponent = Head(standardizedProps.seo);
  }

  // Process initial state
  const initialState = {
    id: standardizedProps.id,
    type: standardizedProps.type || 'page',
    loading: standardizedProps.loading || false,
    error: standardizedProps.error || null,
    loadingOptions: standardizedProps.loadingOptions || {},
    onRetry: standardizedProps.onRetry,
    header: standardizedProps.header,
    content: standardizedProps.content || standardizedProps.children,
    footer: standardizedProps.footer,
    componentMapper: standardizedProps.componentMapper,
    seo: standardizedProps.seo,
  };

  // Create base component
  const pageComponent = createBaseComponent(renderPage)(initialState);

  // Create state management with direct object approach
  const componentState = {
    current: { ...initialState },

    get() {
      return { ...this.current };
    },

    set(newState) {
      this.current = { ...this.current, ...newState };
    },
  };

  // Add state methods directly to component object
  Object.defineProperty(pageComponent, 'getState', {
    value: function () {
      return componentState.get();
    },
    writable: false,
    enumerable: false,
    configurable: false,
  });

  Object.defineProperty(pageComponent, 'setState', {
    value: function (newState) {
      componentState.set(newState);
    },
    writable: false,
    enumerable: false,
    configurable: false,
  });

  // Override update method to sync with state
  const originalUpdate = pageComponent.update;
  Object.defineProperty(pageComponent, 'update', {
    value: function (newProps) {
      // Standardize incoming props on update as well
      const standardized = migrateLegacyProps(newProps);
      this.setState(standardized);
      return originalUpdate.call(this, standardized);
    },
    writable: false,
    enumerable: false,
    configurable: false,
  });

  // Enhanced component methods

  /**
   * Sets the page loading state
   * @param {boolean} loading - Loading state
   * @param {Object} options - Loading options
   * @returns {Object} Component instance for chaining
   */
  Object.defineProperty(pageComponent, 'setLoading', {
    value: function (loading, options = {}) {
      const currentState = this.getState();
      const currentOptions = currentState.loadingOptions || {};

      const newState = {
        loading,
        loadingOptions: { ...currentOptions, ...options },
      };

      this.setState(newState);
      this.update(newState);
      return this;
    },
    writable: false,
    enumerable: false,
    configurable: false,
  });

  /**
   * Sets the page error state
   * @param {Object|null} error - Error information
   * @returns {Object} Component instance for chaining
   */
  Object.defineProperty(pageComponent, 'setError', {
    value: function (error) {
      const newState = { error, loading: false };
      this.setState(newState);
      this.update(newState);
      return this;
    },
    writable: false,
    enumerable: false,
    configurable: false,
  });

  /**
   * Updates page content
   * @param {Object} contentData - New content data
   * @returns {Object} Component instance for chaining
   */
  Object.defineProperty(pageComponent, 'setContent', {
    value: function (contentData) {
      const newState = {
        content: contentData,
        error: null, // Clear error state when updating content
        loading: false, // Ensure loading is also cleared
      };
      this.setState(newState);
      this.update(newState);
      return this;
    },
    writable: false,
    enumerable: false,
    configurable: false,
  });

  /**
   * Updates page SEO metadata
   * @param {Object} seoData - New SEO data
   * @returns {Object} Component instance for chaining
   */
  Object.defineProperty(pageComponent, 'updateSEO', {
    value: function (seoData) {
      if (headComponent) {
        headComponent.update(seoData);
        headComponent.render();
      } else {
        headComponent = Head(seoData);
        headComponent.render();
      }

      const currentState = this.getState();
      const currentSEO = currentState.seo || {};
      const newSEO = { ...currentSEO, ...seoData };

      const newState = { seo: newSEO };
      this.setState(newState);
      this.update(newState);
      return this;
    },
    writable: false,
    enumerable: false,
    configurable: false,
  });

  /**
   * Renders page SEO metadata to document head
   * @returns {Object} Component instance for chaining
   */
  Object.defineProperty(pageComponent, 'renderSEO', {
    value: function () {
      if (headComponent) {
        headComponent.render();
      }
      return this;
    },
    writable: false,
    enumerable: false,
    configurable: false,
  });

  /**
   * Sets up page for specific CMS content
   * @param {Object} cmsData - CMS-specific data
   * @returns {Object} Component instance for chaining
   */
  Object.defineProperty(pageComponent, 'loadFromCMS', {
    value: function (cmsData) {
      const { seo, header, content, footer } = cmsData;

      // Update SEO if provided
      if (seo) {
        this.updateSEO(seo);
      }

      // Update page structure
      this.update({
        header,
        content,
        footer,
        loading: false,
        error: null,
      });

      return this;
    },
    writable: false,
    enumerable: false,
    configurable: false,
  });

  /**
   * Handles page navigation
   * @param {string} path - New page path
   * @param {Object} options - Navigation options
   * @returns {Promise} Navigation promise
   */
  Object.defineProperty(pageComponent, 'navigate', {
    value: async function (path, options = {}) {
      const { showLoading = true, onNavigate } = options;

      if (showLoading) {
        const currentState = this.getState();
        const currentOptions = currentState.loadingOptions || {};
        this.setLoading(true, {
          ...currentOptions,
          message: 'Loading page...',
        });
      }

      try {
        if (onNavigate) {
          const result = await onNavigate(path);
          if (result) {
            this.loadFromCMS(result);
          }
        }
      } catch (_error) {
        this.setError({
          message: 'Failed to load page',
          code: 500,
          title: 'Navigation Error',
        });
      }

      return this;
    },
    writable: false,
    enumerable: false,
    configurable: false,
  });

  /**
   * Optimizes page performance
   * @returns {Object} Component instance for chaining
   */
  Object.defineProperty(pageComponent, 'optimize', {
    value: function () {
      const element = this.getElement();

      // Lazy load images
      const images = element.querySelectorAll('img[data-src]');
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target;
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          });
        });

        images.forEach((img) => imageObserver.observe(img));
      }

      // Preload critical resources
      this.preloadCriticalResources();

      return this;
    },
    writable: false,
    enumerable: false,
    configurable: false,
  });

  /**
   * Preloads critical resources
   * @returns {Object} Component instance for chaining
   */
  Object.defineProperty(pageComponent, 'preloadCriticalResources', {
    value: function () {
      const state = this.getState();

      // Preload critical CSS/JS if specified
      if (state.seo?.preload) {
        state.seo.preload.forEach((resource) => {
          const link = createElement('link', {
            attributes: {
              rel: 'preload',
              href: resource.href,
              as: resource.as || 'script',
            },
          });
          document.head.appendChild(link);
        });
      }

      return this;
    },
    writable: false,
    enumerable: false,
    configurable: false,
  });

  /**
   * Validates page accessibility
   * @returns {Object} Accessibility report
   */
  Object.defineProperty(pageComponent, 'validateAccessibility', {
    value: function () {
      const element = this.getElement();
      const issues = [];

      // Check for skip link
      if (!element.querySelector('.page__skip-link')) {
        issues.push('Missing skip to main content link');
      }

      // Check for main landmark
      if (!element.querySelector('main[role="main"]')) {
        issues.push('Missing main landmark');
      }

      // Check for heading hierarchy
      const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
      if (headings.length === 0) {
        issues.push('No heading elements found');
      }

      return {
        valid: issues.length === 0,
        issues,
      };
    },
    writable: false,
    enumerable: false,
    configurable: false,
  });

  /**
   * Enhanced destroy method that cleans up head component
   */
  const originalDestroy = pageComponent.destroy;
  Object.defineProperty(pageComponent, 'destroy', {
    value: function () {
      if (headComponent) {
        headComponent.destroy();
        headComponent = null;
      }

      return originalDestroy.call(this);
    },
    writable: false,
    enumerable: false,
    configurable: false,
  });

  // Render SEO on initialization if provided
  if (headComponent) {
    headComponent.render();
  }

  return pageComponent;
};

// Define required props for validation
createPage.requiredProps = [];

// Export as both default and named export
export default createPage;
export { createPage as Page };
