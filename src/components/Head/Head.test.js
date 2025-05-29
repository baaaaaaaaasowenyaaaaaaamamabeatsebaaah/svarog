// src/components/Head/Head.test.js
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import Head from './Head.js';

describe('Head Component', () => {
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

  it('should create basic SEO metadata', () => {
    const head = Head({
      title: 'Test Page',
      description: 'A test description for SEO',
      keywords: ['test', 'seo'],
    });

    head.render();

    // Validate title
    const titleElement = document.querySelector('title');
    expect(titleElement).not.toBeNull();
    expect(titleElement.textContent).toBe('Test Page');

    // Validate description
    const descriptionMeta = document.querySelector('meta[name="description"]');
    expect(descriptionMeta).not.toBeNull();
    expect(descriptionMeta.getAttribute('content')).toBe(
      'A test description for SEO'
    );

    // Validate keywords
    const keywordsMeta = document.querySelector('meta[name="keywords"]');
    expect(keywordsMeta).not.toBeNull();
    expect(keywordsMeta.getAttribute('content')).toBe('test, seo');
  });

  it('should handle long title and description', () => {
    const longTitle =
      'This is an extremely long title that exceeds the recommended sixty characters for SEO optimization';
    const longDescription =
      'This is an extremely long description that goes well beyond the recommended one hundred and sixty characters and should be truncated to ensure proper display in search results and maintain readability';

    const head = Head({
      title: longTitle,
      description: longDescription,
    });

    head.render();

    // Validate truncated title
    const titleElement = document.querySelector('title');
    expect(titleElement.textContent.length).toBeLessThanOrEqual(60);
    expect(titleElement.textContent.endsWith('...')).toBe(true);

    // Validate truncated description
    const descriptionMeta = document.querySelector('meta[name="description"]');
    expect(descriptionMeta.getAttribute('content').length).toBeLessThanOrEqual(
      160
    );
    expect(descriptionMeta.getAttribute('content').endsWith('...')).toBe(true);
  });

  it('should handle robots indexing configuration', () => {
    const head = Head({
      title: 'Restricted Page',
      description: 'A page with restricted indexing',
      robots: {
        index: false,
        follow: false,
      },
    });

    head.render();

    // Validate robots meta tag
    const robotsMeta = document.querySelector('meta[name="robots"]');
    expect(robotsMeta).not.toBeNull();
    expect(robotsMeta.getAttribute('content')).toBe('noindex, nofollow');
  });

  it('should set document language', () => {
    const head = Head({
      title: 'Multilingual Page',
      description: 'A page with specific language',
      lang: 'fr',
    });

    head.render();

    // Validate document language
    expect(document.documentElement.lang).toBe('fr');

    // Validate language meta tag
    const languageMeta = document.querySelector(
      'meta[http-equiv="content-language"]'
    );
    expect(languageMeta).not.toBeNull();
    expect(languageMeta.getAttribute('content')).toBe('fr');
  });

  it('should handle canonical URL', () => {
    const canonicalUrl = 'https://www.example.com/test-page';
    const head = Head({
      title: 'Canonical URL Test',
      description: 'Testing canonical URL',
      canonicalUrl,
    });

    head.render();

    // Validate canonical link
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    expect(canonicalLink).not.toBeNull();
    expect(canonicalLink.getAttribute('href')).toBe(canonicalUrl);
  });

  it('should add open graph tags when provided', () => {
    const head = Head({
      title: 'Open Graph Test',
      description: 'Testing Open Graph tags',
      openGraph: {
        title: 'OG Title',
        description: 'OG Description',
        image: 'https://example.com/image.jpg',
        type: 'article',
        url: 'https://example.com/article',
        siteName: 'Example Site',
      },
    });

    head.render();

    // Validate OG tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    expect(ogTitle).not.toBeNull();
    expect(ogTitle.getAttribute('content')).toBe('OG Title');

    const ogImage = document.querySelector('meta[property="og:image"]');
    expect(ogImage).not.toBeNull();
    expect(ogImage.getAttribute('content')).toBe(
      'https://example.com/image.jpg'
    );
  });

  it('should add twitter card tags when provided', () => {
    const head = Head({
      title: 'Twitter Card Test',
      description: 'Testing Twitter Card tags',
      twitterCard: {
        title: 'Twitter Title',
        description: 'Twitter Description',
        image: 'https://example.com/twitter-image.jpg',
        type: 'summary_large_image',
        site: '@examplesite',
        creator: '@exampleuser',
      },
    });

    head.render();

    // Validate Twitter Card tags
    const twitterCard = document.querySelector('meta[name="twitter:card"]');
    expect(twitterCard).not.toBeNull();
    expect(twitterCard.getAttribute('content')).toBe('summary_large_image');

    const twitterImage = document.querySelector('meta[name="twitter:image"]');
    expect(twitterImage).not.toBeNull();
    expect(twitterImage.getAttribute('content')).toBe(
      'https://example.com/twitter-image.jpg'
    );
  });

  it('should update meta tags with updateMeta method', () => {
    const head = Head({
      title: 'Update Test',
      description: 'Testing update method',
    });

    head.render();

    // Update description
    head.updateMeta('description', 'Updated description');

    // Validate updated meta tag
    const descriptionMeta = document.querySelector('meta[name="description"]');
    expect(descriptionMeta.getAttribute('content')).toBe('Updated description');
  });

  it('should add new meta tags with addMeta method', () => {
    const head = Head({
      title: 'Add Meta Test',
      description: 'Testing addMeta method',
    });

    head.render();

    // Add a new meta tag
    head.addMeta({ name: 'author', content: 'Test Author' });

    // Validate new meta tag
    const authorMeta = document.querySelector('meta[name="author"]');
    expect(authorMeta).not.toBeNull();
    expect(authorMeta.getAttribute('content')).toBe('Test Author');
  });

  it('should add alternate language links', () => {
    const head = Head({
      title: 'Multilingual Test',
      description: 'Testing alternate languages',
      alternateLanguages: [
        { hreflang: 'es', href: 'https://example.com/es' },
        { hreflang: 'fr', href: 'https://example.com/fr' },
      ],
    });

    head.render();

    // Validate alternate language links
    const altLinks = document.querySelectorAll('link[rel="alternate"]');
    expect(altLinks.length).toBe(2);
    expect(altLinks[0].getAttribute('hreflang')).toBe('es');
    expect(altLinks[0].getAttribute('href')).toBe('https://example.com/es');
  });

  it('should set theme color', () => {
    const head = Head({
      title: 'Theme Color Test',
      description: 'Testing theme color',
      themeColor: '#ff0000',
    });

    head.render();

    // Validate theme color
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    expect(themeColorMeta).not.toBeNull();
    expect(themeColorMeta.getAttribute('content')).toBe('#ff0000');

    // Test updating theme color
    head.setThemeColor('#00ff00');
    expect(
      document.querySelector('meta[name="theme-color"]').getAttribute('content')
    ).toBe('#00ff00');
  });

  it('should handle update method for multiple properties', () => {
    const head = Head({
      title: 'Original Title',
      description: 'Original description',
    });

    head.render();

    // Update multiple properties
    head.update({
      title: 'Updated Title',
      description: 'Updated description',
      lang: 'fr',
    });

    // Render the updated head
    head.render();

    // Validate updated elements
    const titleElement = document.querySelector('title');
    expect(titleElement.textContent).toBe('Updated Title');

    const descriptionMeta = document.querySelector('meta[name="description"]');
    expect(descriptionMeta.getAttribute('content')).toBe('Updated description');

    expect(document.documentElement.lang).toBe('fr');
  });
});
