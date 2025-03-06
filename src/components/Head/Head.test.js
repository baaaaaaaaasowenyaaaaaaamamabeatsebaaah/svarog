import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import Head from './Head.js';

describe('Head Component', () => {
  let originalHead;

  beforeEach(() => {
    // Store original head content
    originalHead = document.head.innerHTML;
  });

  afterEach(() => {
    // Restore original head content
    document.head.innerHTML = originalHead;
  });

  it('should create basic SEO metadata', () => {
    const head = new Head({
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

    const head = new Head({
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
    const head = new Head({
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
    const head = new Head({
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
    const head = new Head({
      title: 'Canonical URL Test',
      description: 'Testing canonical URL',
      canonicalUrl: canonicalUrl,
    });

    head.render();

    // Validate canonical link
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    expect(canonicalLink).not.toBeNull();
    expect(canonicalLink.getAttribute('href')).toBe(canonicalUrl);
  });
});
