// src/components/RichText/RichText.test.js
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import RichText from './RichText.js';

describe('RichText component', () => {
  let consoleSpy;

  beforeEach(() => {
    // Setup DOM environment
    document.body.innerHTML = '';
    consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('Basic functionality', () => {
    it('should create a richtext element with basic HTML', () => {
      const richText = RichText({
        content: '<h1>Hello World</h1><p>This is a paragraph.</p>',
      });

      const element = richText.getElement();
      expect(element).toBeInstanceOf(HTMLElement);
      expect(element.classList.contains('richtext')).toBe(true);
      expect(element.innerHTML).toContain('<h1>Hello World</h1>');
      expect(element.innerHTML).toContain('<p>This is a paragraph.</p>');
    });

    it('should throw error when content is missing', () => {
      expect(() => {
        RichText({});
      }).toThrow('RichText: content is required');
    });

    it('should throw error when content is not a string', () => {
      expect(() => {
        RichText({ content: 123 });
      }).toThrow('RichText: content must be a string');
    });

    it('should apply custom className', () => {
      const richText = RichText({
        content: '<p>Test</p>',
        className: 'custom-class',
      });

      const element = richText.getElement();
      expect(element.classList.contains('custom-class')).toBe(true);
    });

    it('should apply variant classes', () => {
      const richText = RichText({
        content: '<p>Test</p>',
        variant: 'legal',
      });

      const element = richText.getElement();
      expect(element.classList.contains('richtext--legal')).toBe(true);
    });

    it('should apply size classes', () => {
      const richText = RichText({
        content: '<p>Test</p>',
        size: 'large',
      });

      const element = richText.getElement();
      expect(element.classList.contains('richtext--large')).toBe(true);
    });
  });

  describe('XSS Protection and Sanitization', () => {
    it('should sanitize dangerous script tags by default', () => {
      const richText = RichText({
        content: '<p>Safe content</p><script>alert("XSS")</script>',
      });

      const element = richText.getElement();
      expect(element.innerHTML).toContain('<p>Safe content</p>');
      expect(element.innerHTML).not.toContain('<script>');
      expect(element.innerHTML).not.toContain('alert("XSS")');
    });

    it('should remove javascript: URLs from links', () => {
      const richText = RichText({
        content: '<a href="javascript:alert(\'XSS\')">Malicious Link</a>',
      });

      const element = richText.getElement();
      const link = element.querySelector('a');
      expect(link).toBeTruthy();
      expect(link.getAttribute('href')).toBeNull();
    });

    it('should remove data: URLs from images', () => {
      const richText = RichText({
        content:
          '<img src="data:text/html,<script>alert(\'XSS\')</script>" alt="test">',
      });

      const element = richText.getElement();
      const img = element.querySelector('img');
      expect(img).toBeTruthy();
      expect(img.getAttribute('src')).toBeNull();
      expect(img.getAttribute('alt')).toBe('test');
    });

    it('should preserve safe HTML elements', () => {
      const safeContent = `
        <h1>Heading</h1>
        <h2>Subheading</h2>
        <p>Paragraph with <strong>bold</strong> and <em>italic</em> text.</p>
        <ul>
          <li>List item 1</li>
          <li>List item 2</li>
        </ul>
        <a href="https://example.com">Safe link</a>
        <img src="https://example.com/image.jpg" alt="Safe image">
      `;

      const richText = RichText({ content: safeContent });
      const element = richText.getElement();

      expect(element.querySelector('h1')).toBeTruthy();
      expect(element.querySelector('h2')).toBeTruthy();
      expect(element.querySelector('p')).toBeTruthy();
      expect(element.querySelector('strong')).toBeTruthy();
      expect(element.querySelector('em')).toBeTruthy();
      expect(element.querySelector('ul')).toBeTruthy();
      expect(element.querySelector('li')).toBeTruthy();
      expect(element.querySelector('a')).toBeTruthy();
      expect(element.querySelector('img')).toBeTruthy();
    });

    it('should remove disallowed HTML elements but preserve content', () => {
      const richText = RichText({
        content:
          '<p>Safe paragraph</p><iframe src="malicious.html">Iframe content</iframe>',
      });

      const element = richText.getElement();
      expect(element.innerHTML).toContain('<p>Safe paragraph</p>');
      expect(element.innerHTML).not.toContain('<iframe');
      expect(element.innerHTML).not.toContain('Iframe content'); // iframe content is completely removed
    });

    it('should allow disabling sanitization', () => {
      const richText = RichText({
        content: '<p>Content</p><script>alert("test")</script>',
        sanitize: false,
      });

      const element = richText.getElement();
      expect(element.innerHTML).toContain('<script>alert("test")</script>');
    });
  });

  describe('Link Processing', () => {
    it('should add CSS classes to links', () => {
      const richText = RichText({
        content:
          '<a href="https://example.com">External</a><a href="mailto:test@example.com">Email</a><a href="tel:+123456789">Phone</a>',
      });

      const element = richText.getElement();
      const links = element.querySelectorAll('a');

      expect(links[0].classList.contains('richtext__link')).toBe(true);
      expect(links[0].classList.contains('richtext__link--external')).toBe(
        true
      );

      expect(links[1].classList.contains('richtext__link')).toBe(true);
      expect(links[1].classList.contains('richtext__link--email')).toBe(true);

      expect(links[2].classList.contains('richtext__link')).toBe(true);
      expect(links[2].classList.contains('richtext__link--phone')).toBe(true);
    });

    it('should add security attributes to external links', () => {
      const richText = RichText({
        content:
          '<a href="https://example.com" target="_blank">External Link</a>',
      });

      const element = richText.getElement();
      const link = element.querySelector('a');

      expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    });

    it('should allow disabling link processing', () => {
      const richText = RichText({
        content: '<a href="https://example.com">External</a>',
        processLinks: false,
      });

      const element = richText.getElement();
      const link = element.querySelector('a');

      expect(link.classList.contains('richtext__link')).toBe(false);
    });
  });

  describe('Content Methods', () => {
    it('should update content with setContent method', () => {
      const richText = RichText({ content: '<p>Original</p>' });

      richText.setContent('<p>Updated</p>');

      const element = richText.getElement();
      expect(element.innerHTML).toContain('<p>Updated</p>');
    });

    it('should return text content without HTML tags', () => {
      const richText = RichText({
        content:
          '<h1>Title</h1><p>Paragraph with <strong>bold</strong> text.</p>',
      });

      const textContent = richText.getTextContent();
      expect(textContent).toContain('Title');
      expect(textContent).toContain('Paragraph with bold text.');
      expect(textContent).not.toContain('<h1>');
      expect(textContent).not.toContain('<strong>');
    });

    it('should return HTML content', () => {
      const content = '<h1>Title</h1><p>Paragraph</p>';
      const richText = RichText({ content });

      const htmlContent = richText.getHTMLContent();
      expect(htmlContent).toContain('<h1>Title</h1>');
      expect(htmlContent).toContain('<p>Paragraph</p>');
    });

    it('should search for text within content', () => {
      const richText = RichText({
        content: '<h1>Important Title</h1><p>This is some content.</p>',
      });

      expect(richText.contains('Important')).toBe(true);
      expect(richText.contains('content')).toBe(true);
      expect(richText.contains('nonexistent')).toBe(false);
      expect(richText.contains('IMPORTANT')).toBe(true); // Case insensitive
    });
  });

  describe('Content Length and Truncation', () => {
    it('should truncate content when maxLength is specified', () => {
      const longContent = `<p>${'A'.repeat(100)}</p>`;
      const richText = RichText({
        content: longContent,
        maxLength: 50,
      });

      const textContent = richText.getTextContent();
      expect(textContent.length).toBeLessThanOrEqual(50);
      expect(textContent).toContain('...');
    });

    it('should indicate when content is truncated', () => {
      const longContent = `<p>${'A'.repeat(100)}</p>`;
      const richText = RichText({
        content: longContent,
        maxLength: 50,
      });

      expect(richText.isTruncated()).toBe(true);
    });

    it('should not truncate when content is shorter than maxLength', () => {
      const shortContent = '<p>Short content</p>';
      const richText = RichText({
        content: shortContent,
        maxLength: 100,
      });

      expect(richText.isTruncated()).toBe(false);
    });

    it('should throw error for invalid maxLength', () => {
      expect(() => {
        RichText({
          content: '<p>Test</p>',
          maxLength: -1,
        });
      }).toThrow('RichText: maxLength must be a positive integer');
    });
  });

  describe('Legacy Props Migration', () => {
    it('should migrate html prop to content with warning', () => {
      const richText = RichText({
        html: '<p>Legacy HTML content</p>',
      });

      const element = richText.getElement();
      expect(element.innerHTML).toContain('<p>Legacy HTML content</p>');
      expect(consoleSpy).toHaveBeenCalledWith(
        '[RichText] html prop is deprecated, use content instead'
      );
    });

    it('should migrate value prop to content', () => {
      const richText = RichText({
        value: '<p>Value prop content</p>',
      });

      const element = richText.getElement();
      expect(element.innerHTML).toContain('<p>Value prop content</p>');
    });

    it('should prioritize content over legacy props', () => {
      const richText = RichText({
        content: '<p>Content prop</p>',
        html: '<p>HTML prop</p>',
        value: '<p>Value prop</p>',
      });

      const element = richText.getElement();
      expect(element.innerHTML).toContain('<p>Content prop</p>');
    });
  });

  describe('Event Handling', () => {
    it('should handle click events', () => {
      const clickHandler = vi.fn();
      const richText = RichText({
        content: '<p>Clickable content</p>',
        onClick: clickHandler,
      });

      const element = richText.getElement();
      element.click();

      expect(clickHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('should have proper role attribute', () => {
      const richText = RichText({
        content: '<p>Accessible content</p>',
      });

      const element = richText.getElement();
      expect(element.getAttribute('role')).toBe('document');
    });

    it('should support aria-label', () => {
      const richText = RichText({
        content: '<p>Content</p>',
        ariaLabel: 'Article content',
      });

      const element = richText.getElement();
      expect(element.getAttribute('aria-label')).toBe('Article content');
    });

    it('should update aria-label with partial updates', () => {
      const richText = RichText({
        content: '<p>Content</p>',
        ariaLabel: 'Original label',
      });

      richText.update({ ariaLabel: 'Updated label' });

      const element = richText.getElement();
      expect(element.getAttribute('aria-label')).toBe('Updated label');
    });
  });

  describe('Performance Optimizations', () => {
    it('should always do full re-render (simplified vanilla JS approach)', () => {
      const richText = RichText({
        content: '<p>Original content</p>',
        className: 'original-class',
      });

      const initialElement = richText.getElement();

      // Update only className (RichText does full re-render for simplicity)
      richText.update({ className: 'new-class' });

      // In our vanilla JS implementation, we always do full re-render
      // Element reference will be different after update
      expect(richText.getElement()).not.toBe(initialElement);
      expect(richText.getElement().classList.contains('new-class')).toBe(true);
    });

    it('should handle content changes with full rerender', () => {
      const richText = RichText({
        content: '<p>Original content</p>',
      });

      const initialElement = richText.getElement();

      // Update content (full rerender)
      richText.update({ content: '<p>New content</p>' });

      // Element reference should be different (full rerender)
      expect(richText.getElement()).not.toBe(initialElement);
      expect(richText.getElement().innerHTML).toContain('<p>New content</p>');
    });
  });

  describe('Complex HTML Content', () => {
    it('should handle tables correctly', () => {
      const tableContent = `
        <table>
          <thead>
            <tr><th>Header 1</th><th>Header 2</th></tr>
          </thead>
          <tbody>
            <tr><td>Data 1</td><td>Data 2</td></tr>
          </tbody>
        </table>
      `;

      const richText = RichText({ content: tableContent });
      const element = richText.getElement();

      expect(element.querySelector('table')).toBeTruthy();
      expect(element.querySelector('thead')).toBeTruthy();
      expect(element.querySelector('tbody')).toBeTruthy();
      expect(element.querySelector('th')).toBeTruthy();
      expect(element.querySelector('td')).toBeTruthy();
    });

    it('should handle nested lists', () => {
      const listContent = `
        <ul>
          <li>Item 1</li>
          <li>Item 2
            <ul>
              <li>Nested Item 1</li>
              <li>Nested Item 2</li>
            </ul>
          </li>
        </ul>
      `;

      const richText = RichText({ content: listContent });
      const element = richText.getElement();

      const lists = element.querySelectorAll('ul');
      expect(lists.length).toBe(2); // Parent and nested list
    });

    it('should handle blockquotes and code blocks', () => {
      const content = `
        <blockquote>
          <p>This is a quote</p>
        </blockquote>
        <pre><code>function test() { return true; }</code></pre>
      `;

      const richText = RichText({ content });
      const element = richText.getElement();

      expect(element.querySelector('blockquote')).toBeTruthy();
      expect(element.querySelector('pre')).toBeTruthy();
      expect(element.querySelector('code')).toBeTruthy();
    });
  });
});
