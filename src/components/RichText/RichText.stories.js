// src/components/RichText/RichText.stories.js
import RichText from './RichText.js';

export default {
  title: 'Components/RichText',
  component: RichText,
};

// Basic rich text content
export const BasicContent = () => {
  const content = `
    <h1>Basic Rich Text Example</h1>
    <p>This is a <strong>rich text</strong> component that can render <em>formatted HTML content</em> safely.</p>
    <p>It supports various HTML elements including:</p>
    <ul>
      <li>Headings (h1-h6)</li>
      <li>Paragraphs and text formatting</li>
      <li>Lists (ordered and unordered)</li>
      <li>Links and images</li>
      <li>Tables and more</li>
    </ul>
  `;

  const richText = RichText({ content });
  return richText.getElement();
};

// Impressum example (German)
export const ImpressumExample = () => {
  const impressumContent = `
    <h1>Impressum</h1>

    <h2>Angaben gemäß § 5 TMG</h2>
    <p>
      <strong>Musterfirma GmbH</strong><br>
      Musterstraße 123<br>
      12345 Musterstadt<br>
      Deutschland
    </p>

    <h2>Vertreten durch</h2>
    <p>Geschäftsführer: Max Mustermann</p>

    <h2>Kontakt</h2>
    <p>
      <strong>Telefon:</strong> <a href="tel:+49123456789">+49 (0) 123 456789</a><br>
      <strong>E-Mail:</strong> <a href="mailto:info@musterfirma.de">info@musterfirma.de</a><br>
      <strong>Website:</strong> <a href="https://www.musterfirma.de" target="_blank">www.musterfirma.de</a>
    </p>

    <h2>Registereintrag</h2>
    <p>
      Eintragung im Handelsregister<br>
      Registergericht: Amtsgericht Musterstadt<br>
      Registernummer: HRB 12345
    </p>

    <h2>Umsatzsteuer-ID</h2>
    <p>
      Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br>
      DE123456789
    </p>

    <h2>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
    <p>
      Max Mustermann<br>
      Musterstraße 123<br>
      12345 Musterstadt
    </p>
  `;

  const richText = RichText({
    content: impressumContent,
    variant: 'legal',
  });
  return richText.getElement();
};

// Privacy Policy example (German)
export const PrivacyPolicyExample = () => {
  const privacyContent = `
    <h1>Datenschutzerklärung</h1>

    <h2>1. Datenschutz auf einen Blick</h2>

    <h3>Allgemeine Hinweise</h3>
    <p>Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.</p>

    <h3>Datenerfassung auf dieser Website</h3>
    <p><strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong></p>
    <p>Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.</p>

    <h2>2. Hosting und Content Delivery Networks (CDN)</h2>

    <h3>Externes Hosting</h3>
    <p>Diese Website wird bei einem externen Dienstleister gehostet (Hoster). Die personenbezogenen Daten, die auf dieser Website erfasst werden, werden auf den Servern des Hosters gespeichert.</p>

    <h2>3. Allgemeine Hinweise und Pflichtinformationen</h2>

    <h3>Datenschutz</h3>
    <p>Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.</p>

    <blockquote>
      <p><strong>Wichtiger Hinweis:</strong> Diese Datenschutzerklärung ist ein Muster und muss an die individuellen Gegebenheiten Ihrer Website angepasst werden.</p>
    </blockquote>

    <h3>Widerruf Ihrer Einwilligung zur Datenverarbeitung</h3>
    <p>Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen Einwilligung möglich. Sie können eine bereits erteilte Einwilligung jederzeit widerrufen.</p>

    <h2>4. Kontakt</h2>
    <p>Bei Fragen zum Datenschutz wenden Sie sich bitte an:</p>
    <p>
      <strong>E-Mail:</strong> <a href="mailto:datenschutz@musterfirma.de">datenschutz@musterfirma.de</a><br>
      <strong>Telefon:</strong> <a href="tel:+49123456789">+49 (0) 123 456789</a>
    </p>
  `;

  const richText = RichText({
    content: privacyContent,
    variant: 'legal',
  });
  return richText.getElement();
};

// Content with different formatting elements
export const ComplexFormatting = () => {
  const content = `
    <h1>Rich Text Formatting Examples</h1>

    <h2>Text Formatting</h2>
    <p>This paragraph contains <strong>bold text</strong>, <em>italic text</em>, <u>underlined text</u>, and <code>inline code</code>.</p>

    <h2>Lists</h2>
    <h3>Unordered List</h3>
    <ul>
      <li>First item</li>
      <li>Second item with nested list:
        <ul>
          <li>Nested item 1</li>
          <li>Nested item 2</li>
        </ul>
      </li>
      <li>Third item</li>
    </ul>

    <h3>Ordered List</h3>
    <ol>
      <li>First step</li>
      <li>Second step</li>
      <li>Third step</li>
    </ol>

    <h2>Links</h2>
    <p>Different types of links:</p>
    <ul>
      <li><a href="https://example.com" target="_blank">External link</a> (opens in new tab)</li>
      <li><a href="mailto:test@example.com">Email link</a></li>
      <li><a href="tel:+123456789">Phone link</a></li>
      <li><a href="#section">Internal link</a></li>
    </ul>

    <h2>Code Block</h2>
    <pre><code>function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));</code></pre>

    <h2>Blockquote</h2>
    <blockquote>
      <p>This is a blockquote. It's used to highlight important information or quotes from other sources.</p>
    </blockquote>

    <h2>Horizontal Rule</h2>
    <p>Below is a horizontal rule:</p>
    <hr>
    <p>Content after the horizontal rule.</p>
  `;

  const richText = RichText({ content });
  return richText.getElement();
};

// Table example
export const TableExample = () => {
  const content = `
    <h1>Table Example</h1>
    <p>This example shows how tables are rendered in the RichText component:</p>

    <table>
      <thead>
        <tr>
          <th>Service</th>
          <th>Description</th>
          <th>Price</th>
          <th>Duration</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Basic Package</strong></td>
          <td>Website creation with basic features</td>
          <td>€1,999</td>
          <td>2-3 weeks</td>
        </tr>
        <tr>
          <td><strong>Professional Package</strong></td>
          <td>Advanced website with custom functionality</td>
          <td>€4,999</td>
          <td>4-6 weeks</td>
        </tr>
        <tr>
          <td><strong>Enterprise Package</strong></td>
          <td>Full-scale application development</td>
          <td>€9,999+</td>
          <td>8-12 weeks</td>
        </tr>
      </tbody>
    </table>

    <p><small>All prices are excluding VAT. Contact us for a custom quote.</small></p>
  `;

  const richText = RichText({ content });
  return richText.getElement();
};

// Size variants
export const SizeVariants = () => {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '2rem';

  const content = `
    <h2>Sample Heading</h2>
    <p>This is a paragraph with <strong>bold text</strong> and <em>italic text</em>.</p>
    <ul>
      <li>List item one</li>
      <li>List item two</li>
    </ul>
  `;

  // Small size
  const smallTitle = document.createElement('h3');
  smallTitle.textContent = 'Small Size';
  container.appendChild(smallTitle);

  const smallRichText = RichText({ content, size: 'small' });
  container.appendChild(smallRichText.getElement());

  // Default size
  const defaultTitle = document.createElement('h3');
  defaultTitle.textContent = 'Default Size';
  container.appendChild(defaultTitle);

  const defaultRichText = RichText({ content });
  container.appendChild(defaultRichText.getElement());

  // Large size
  const largeTitle = document.createElement('h3');
  largeTitle.textContent = 'Large Size';
  container.appendChild(largeTitle);

  const largeRichText = RichText({ content, size: 'large' });
  container.appendChild(largeRichText.getElement());

  return container;
};

// XSS Protection demonstration
export const XSSProtection = () => {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '1rem';

  // Safe content
  const safeTitle = document.createElement('h3');
  safeTitle.textContent = 'Safe Content (Allowed)';
  container.appendChild(safeTitle);

  const safeContent = `
    <h2>Safe Content</h2>
    <p>This content contains only <strong>safe HTML elements</strong> that are allowed.</p>
    <a href="https://example.com">Safe external link</a>
  `;

  const safeRichText = RichText({ content: safeContent });
  container.appendChild(safeRichText.getElement());

  // Dangerous content (sanitized)
  const dangerousTitle = document.createElement('h3');
  dangerousTitle.textContent = 'Dangerous Content (Sanitized)';
  container.appendChild(dangerousTitle);

  const dangerousContent = `
    <h2>Attempted XSS Attack</h2>
    <p>The following dangerous elements have been removed:</p>
    <script>alert('This script is removed!');</script>
    <iframe src="malicious.html">This iframe is removed</iframe>
    <a href="javascript:alert('XSS')">This link is sanitized</a>
    <p>But this safe content remains.</p>
  `;

  const dangerousRichText = RichText({ content: dangerousContent });
  container.appendChild(dangerousRichText.getElement());

  // Info box
  const infoBox = document.createElement('div');
  infoBox.style.padding = '1rem';
  infoBox.style.backgroundColor = '#f0f9ff';
  infoBox.style.border = '1px solid #0284c7';
  infoBox.style.borderRadius = '4px';
  infoBox.innerHTML = `
    <p><strong>Security Note:</strong> The RichText component automatically sanitizes dangerous HTML elements like &lt;script&gt;, &lt;iframe&gt;, and malicious URLs to prevent XSS attacks.</p>
  `;
  container.appendChild(infoBox);

  return container;
};

// Content with maxLength
export const TruncatedContent = () => {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '1rem';

  const longContent = `
    <h2>Lorem Ipsum</h2>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    <ul>
      <li>This is a very long list item that contains a lot of text</li>
      <li>Another long list item with even more text content</li>
    </ul>
  `;

  // Full content
  const fullTitle = document.createElement('h3');
  fullTitle.textContent = 'Full Content';
  container.appendChild(fullTitle);

  const fullRichText = RichText({ content: longContent });
  container.appendChild(fullRichText.getElement());

  // Truncated content
  const truncatedTitle = document.createElement('h3');
  truncatedTitle.textContent = 'Truncated Content (maxLength: 200)';
  container.appendChild(truncatedTitle);

  const truncatedRichText = RichText({
    content: longContent,
    maxLength: 200,
  });
  container.appendChild(truncatedRichText.getElement());

  // Info about truncation
  const infoBox = document.createElement('div');
  infoBox.style.padding = '0.5rem';
  infoBox.style.backgroundColor = '#fffbeb';
  infoBox.style.border = '1px solid #f59e0b';
  infoBox.style.borderRadius = '4px';
  infoBox.innerHTML = `<p><strong>Truncated:</strong> ${truncatedRichText.isTruncated() ? 'Yes' : 'No'}</p>`;
  container.appendChild(infoBox);

  return container;
};

// Variant examples
export const VariantExamples = () => {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '2rem';

  const content = `
    <h2>Sample Heading</h2>
    <p>This is a sample paragraph that demonstrates how different variants affect the appearance of rich text content.</p>
    <ul>
      <li>First item</li>
      <li>Second item</li>
    </ul>
  `;

  // Default variant
  const defaultTitle = document.createElement('h3');
  defaultTitle.textContent = 'Default Variant';
  container.appendChild(defaultTitle);

  const defaultRichText = RichText({ content });
  container.appendChild(defaultRichText.getElement());

  // Legal variant
  const legalTitle = document.createElement('h3');
  legalTitle.textContent = 'Legal Variant';
  container.appendChild(legalTitle);

  const legalRichText = RichText({ content, variant: 'legal' });
  container.appendChild(legalRichText.getElement());

  // Compact variant
  const compactTitle = document.createElement('h3');
  compactTitle.textContent = 'Compact Variant';
  container.appendChild(compactTitle);

  const compactRichText = RichText({ content, variant: 'compact' });
  container.appendChild(compactRichText.getElement());

  return container;
};

// Interactive example with update capabilities
export const InteractiveExample = () => {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '1rem';

  // Controls
  const controls = document.createElement('div');
  controls.style.padding = '1rem';
  controls.style.backgroundColor = '#f8f9fa';
  controls.style.borderRadius = '4px';
  controls.style.marginBottom = '1rem';

  const contentTextarea = document.createElement('textarea');
  contentTextarea.style.width = '100%';
  contentTextarea.style.height = '100px';
  contentTextarea.style.marginBottom = '0.5rem';
  contentTextarea.value =
    '<h2>Edit this content</h2><p>Type your HTML content here and see it update in real-time!</p>';

  const updateButton = document.createElement('button');
  updateButton.textContent = 'Update Content';
  updateButton.style.padding = '0.5rem 1rem';
  updateButton.style.backgroundColor = '#0066cc';
  updateButton.style.color = 'white';
  updateButton.style.border = 'none';
  updateButton.style.borderRadius = '4px';
  updateButton.style.cursor = 'pointer';

  controls.appendChild(document.createTextNode('HTML Content:'));
  controls.appendChild(document.createElement('br'));
  controls.appendChild(contentTextarea);
  controls.appendChild(document.createElement('br'));
  controls.appendChild(updateButton);

  container.appendChild(controls);

  // RichText component
  const richText = RichText({ content: contentTextarea.value });
  container.appendChild(richText.getElement());

  // Update functionality
  updateButton.addEventListener('click', () => {
    richText.setContent(contentTextarea.value);
  });

  return container;
};
