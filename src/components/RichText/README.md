# RichText Component

The RichText component provides a secure way to render HTML content with automatic sanitization, making it perfect for displaying legal documents, blog posts, and other formatted content. **Designed specifically for SMBs who need to display Impressum and Datenschutz content safely.**

## Features

✅ **Zero Configuration** - Styles automatically inject when component is used
✅ **XSS Protection** - Built-in HTML sanitization prevents security vulnerabilities
✅ **SMB Optimized** - Perfect for Impressum/Datenschutz from legal generators
✅ **Performance Focused** - Partial updates for style-only changes
✅ **SSR Compatible** - Works in Node.js environments without errors
✅ **Accessibility First** - Proper semantic HTML and ARIA support
✅ **Link Processing** - Automatic security attributes for external links

## Quick Start

```javascript
import { RichText } from '@svarog-ui/core';

// Perfect for legal content from generators
const impressum = RichText({
  content: `
    <h1>Impressum</h1>
    <h2>Angaben gemäß § 5 TMG</h2>
    <p>Ihre Firma GmbH<br>
    Musterstraße 123<br>
    12345 Musterstadt</p>
  `,
  variant: 'legal',
});

document.body.appendChild(impressum.getElement());
```

## Props

| Prop         | Type     | Default    | Description                                 |
| ------------ | -------- | ---------- | ------------------------------------------- |
| content      | string   | (Required) | HTML content to render                      |
| variant      | string   | null       | Style variant ('legal', 'compact')          |
| size         | string   | null       | Size variant ('small', 'large')             |
| className    | string   | ''         | Additional CSS classes                      |
| id           | string   | null       | HTML ID attribute                           |
| sanitize     | boolean  | true       | Enable HTML sanitization (XSS protection)   |
| processLinks | boolean  | true       | Enable automatic link processing            |
| maxLength    | number   | null       | Maximum text length (truncates if exceeded) |
| ariaLabel    | string   | null       | Accessibility label                         |
| onClick      | function | null       | Click event handler                         |

### Standardized Props

This component follows the company-wide Props Standardization Guide:

- Uses `content` for main HTML content (standard)
- Supports legacy `value` and `html` props with deprecation warnings
- Uses `onClick` for click event handling (standard)

## Methods

### getElement()

Returns the rich text DOM element.

```javascript
const element = richText.getElement();
```

### setContent(content)

Updates the HTML content with sanitization.

```javascript
richText.setContent('<h1>New Content</h1><p>Updated safely</p>');
```

### getTextContent()

Returns plain text content without HTML tags.

```javascript
const plainText = richText.getTextContent();
console.log(plainText); // "New Content Updated safely"
```

### getHTMLContent()

Returns the current HTML content.

```javascript
const html = richText.getHTMLContent();
```

### contains(searchTerm)

Searches for text within the content (case-insensitive).

```javascript
const hasImprint = richText.contains('impressum'); // true/false
```

### isTruncated()

Checks if content was truncated due to maxLength.

```javascript
const wasTruncated = richText.isTruncated();
```

### update(props)

Updates multiple properties at once.

```javascript
richText.update({
  content: newContent,
  variant: 'compact',
  className: 'updated-styles',
});
```

### destroy()

Cleans up resources.

```javascript
richText.destroy();
```

## Security Features

### XSS Protection (Enabled by Default)

The component automatically sanitizes HTML to prevent XSS attacks:

```javascript
// Dangerous input
const maliciousContent = `
  <h1>Safe Title</h1>
  <script>alert('XSS!');</script>
  <a href="javascript:alert('XSS')">Malicious Link</a>
`;

// Automatically sanitized
const richText = RichText({ content: maliciousContent });
// Result: Only safe HTML remains, dangerous elements removed
```

### Allowed HTML Elements

**Text Structure:**

- `h1`, `h2`, `h3`, `h4`, `h5`, `h6` - Headings
- `p`, `div`, `span`, `br` - Paragraphs and containers
- `strong`, `b`, `em`, `i`, `u` - Text formatting
- `sub`, `sup` - Subscript/superscript

**Lists:**

- `ul`, `ol`, `li` - Lists

**Links & Media:**

- `a` - Links (with automatic security attributes)
- `img` - Images

**Tables:**

- `table`, `thead`, `tbody`, `tr`, `th`, `td` - Table elements

**Other:**

- `blockquote`, `pre`, `code` - Quotes and code
- `hr` - Horizontal rules

### Automatic Link Security

External links automatically get security attributes:

```javascript
// Input
const content = '<a href="https://external.com" target="_blank">Link</a>';

// Output (automatically enhanced)
// <a href="https://external.com" target="_blank" rel="noopener noreferrer" class="richtext__link richtext__link--external">Link</a>
```

## Use Cases

### 1. Impressum (German Legal Imprint)

```javascript
const impressum = RichText({
  content: `
    <h1>Impressum</h1>

    <h2>Angaben gemäß § 5 TMG</h2>
    <p>
      <strong>Ihre Firma GmbH</strong><br>
      Geschäftsführer: Max Mustermann<br>
      Musterstraße 123<br>
      12345 Musterstadt<br>
      Deutschland
    </p>

    <h2>Kontakt</h2>
    <p>
      <strong>Telefon:</strong> <a href="tel:+49123456789">+49 (0) 123 456789</a><br>
      <strong>E-Mail:</strong> <a href="mailto:info@firma.de">info@firma.de</a>
    </p>

    <h2>Handelsregister</h2>
    <p>
      Registergericht: Amtsgericht Musterstadt<br>
      Registernummer: HRB 12345
    </p>
  `,
  variant: 'legal',
  ariaLabel: 'Legal imprint information',
});
```

### 2. Datenschutz (Privacy Policy)

```javascript
const datenschutz = RichText({
  content: `
    <h1>Datenschutzerklärung</h1>

    <h2>1. Datenschutz auf einen Blick</h2>
    <p>Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen.</p>

    <h2>2. Allgemeine Hinweise und Pflichtinformationen</h2>
    <h3>Datenschutz</h3>
    <p>Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst.</p>

    <blockquote>
      <p><strong>Wichtig:</strong> Bei Fragen zum Datenschutz kontaktieren Sie uns unter <a href="mailto:datenschutz@firma.de">datenschutz@firma.de</a></p>
    </blockquote>
  `,
  variant: 'legal',
});
```

### 3. Blog Content

```javascript
const blogPost = RichText({
  content: `
    <h1>Why Small Businesses Need Professional Websites</h1>

    <p>In today's digital world, a professional website is not a luxury—it's a necessity for small and medium businesses.</p>

    <h2>Key Benefits</h2>
    <ul>
      <li><strong>Credibility:</strong> Professional appearance builds trust</li>
      <li><strong>Accessibility:</strong> 24/7 availability for customers</li>
      <li><strong>Growth:</strong> Expand your reach beyond local markets</li>
    </ul>

    <p>Ready to grow your business? <a href="/contact">Contact us today</a>!</p>
  `,
});
```

### 4. Terms and Conditions

```javascript
const terms = RichText({
  content: `
    <h1>Terms and Conditions</h1>

    <h2>1. Acceptance of Terms</h2>
    <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>

    <h2>2. Services</h2>
    <p>We provide web development services including:</p>
    <ol>
      <li>Website design and development</li>
      <li>E-commerce solutions</li>
      <li>Maintenance and support</li>
    </ol>

    <table>
      <thead>
        <tr><th>Service</th><th>Response Time</th></tr>
      </thead>
      <tbody>
        <tr><td>Critical Issues</td><td>2 hours</td></tr>
        <tr><td>General Support</td><td>24 hours</td></tr>
      </tbody>
    </table>
  `,
  variant: 'legal',
});
```

## Styling and Variants

### Variant: legal

Optimized for legal documents like Impressum and Datenschutz:

```javascript
const legalContent = RichText({
  content: legalHtml,
  variant: 'legal', // Adds special styling for legal documents
});
```

**Legal variant features:**

- Justified text alignment
- Enhanced heading styles with borders
- Professional spacing
- Optimized for readability

### Variant: compact

Reduces spacing for compact layouts:

```javascript
const compactContent = RichText({
  content: html,
  variant: 'compact', // Tighter spacing
});
```

### Size Variants

```javascript
// Small text
const small = RichText({ content: html, size: 'small' });

// Default size
const normal = RichText({ content: html });

// Large text
const large = RichText({ content: html, size: 'large' });
```

## Content Length Management

### Truncation

```javascript
const truncated = RichText({
  content: longHtmlContent,
  maxLength: 500, // Truncates text content to 500 characters
});

// Check if content was truncated
if (truncated.isTruncated()) {
  console.log('Content was shortened');
}
```

## Performance Optimizations

### Partial Updates

Style-only changes use efficient partial updates:

```javascript
const richText = RichText({ content: html });

// Efficient - no DOM rebuild
richText.update({ className: 'new-style' });

// Full rebuild - content changed
richText.update({ content: newHtml });
```

### Content Caching

The component caches sanitized content for performance:

```javascript
// First render: Sanitization happens
const richText1 = RichText({ content: html });

// Subsequent renders: Uses cached result if content unchanged
const richText2 = RichText({ content: html });
```

## CSS Customization

RichText styles are built on Svarog UI's base design system using standardized CSS variables:

```css
:root {
  /* Colors from base variables */
  --color-text: #1a202c;
  --color-text-light: #4a5568;
  --color-info: #4299e1;
  --color-info-dark: #3182ce;

  /* Spacing from base variables */
  --space-1: 4px;
  --space-2: 8px;
  --space-4: 16px;
  --space-6: 24px;

  /* Typography from base variables */
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 18px;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Border and radius from base variables */
  --color-border: #e2e8f0;
  --radius-sm: 2px;
  --radius-md: 6px;

  /* Transitions from base variables */
  --transition-fast: all 0.15s ease;
}
```

**All base variables are automatically loaded** when the RichText component is used - no manual CSS imports required!

## Migration from Other Solutions

### From innerHTML

```javascript
// Before (unsafe)
element.innerHTML = htmlContent;

// After (safe)
const richText = RichText({ content: htmlContent });
element.appendChild(richText.getElement());
```

### From markdown

```javascript
// If you have markdown, convert to HTML first
import { marked } from 'marked';

const htmlContent = marked(markdownContent);
const richText = RichText({ content: htmlContent });
```

## Legacy Props Support

The component supports legacy prop names with deprecation warnings:

```javascript
// Legacy (deprecated)
const richText1 = RichText({ html: content }); // Shows warning

// New standard
const richText2 = RichText({ content }); // Recommended
```

## Browser Support

- **Modern Browsers**: Full support with all features
- **Legacy Browsers**: Graceful degradation with fallback styles
- **SSR**: Complete Node.js compatibility

## Integration with Content Management

### With Legal Generators

Most German legal generators provide HTML output that works directly:

```javascript
// Directly use output from legal generators
const impressumHtml = generatedImpressumHtml;
const impressum = RichText({
  content: impressumHtml,
  variant: 'legal',
});
```

### With CMS Systems

```javascript
// WordPress, Strapi, etc.
const cmsContent = await fetchFromCMS('/api/legal/impressum');
const richText = RichText({
  content: cmsContent.html,
  variant: 'legal',
});
```

## Accessibility

The RichText component follows WCAG guidelines:

- **Semantic HTML**: Preserves heading hierarchy and structure
- **ARIA Support**: Includes proper ARIA labels and roles
- **Focus Management**: Proper keyboard navigation for links
- **Screen Reader**: Compatible with assistive technologies
- **High Contrast**: Supports high contrast mode

```javascript
const accessibleContent = RichText({
  content: html,
  ariaLabel: 'Company legal information',
  id: 'legal-content',
});
```

## Testing

The component includes comprehensive tests for:

- HTML sanitization and XSS protection
- Link processing and security attributes
- Content truncation and length management
- Performance optimizations
- Accessibility compliance

Run tests:

```bash
npm test src/components/RichText/
```

## File Structure

```
src/components/RichText/
├── RichText.js          # Main component with CSS injection
├── RichText.styles.js   # Component styles
├── RichText.test.js     # Comprehensive tests
├── RichText.stories.js  # Storybook examples
├── README.md           # This documentation
└── index.js            # Public exports
```

## Best Practices

### 1. Always Use Sanitization

```javascript
// ✅ Good - Default sanitization enabled
const richText = RichText({ content: userContent });

// ⚠️ Only disable for trusted content
const richText = RichText({
  content: trustedContent,
  sanitize: false,
});
```

### 2. Use Appropriate Variants

```javascript
// ✅ For legal documents
const legal = RichText({ content: impressum, variant: 'legal' });

// ✅ For compact layouts
const compact = RichText({ content: summary, variant: 'compact' });
```

### 3. Handle Long Content

```javascript
// ✅ Truncate very long content
const preview = RichText({
  content: longArticle,
  maxLength: 500,
});

if (preview.isTruncated()) {
  // Show "read more" link
}
```

### 4. Provide Accessibility

```javascript
// ✅ Always include ARIA labels for important content
const legalText = RichText({
  content: impressum,
  ariaLabel: 'Legal imprint and company information',
  variant: 'legal',
});
```

## Summary

The RichText component is the perfect solution for SMBs who need to display formatted HTML content safely. Whether it's legal documents generated by online tools, blog content, or any other HTML, the component provides:

- **Security first** with automatic XSS protection
- **SMB optimized** for common use cases like Impressum/Datenschutz
- **Zero configuration** with automatic style injection
- **Performance focused** with smart update strategies
- **Accessibility compliant** for all users

Perfect for businesses that need professional web presence without the complexity!
