// src/components/Typography/Typography.stories.js
import Typography from './Typography.js';

export default {
  title: 'Components/Typography',
  component: Typography,
};

// Helper function to create a demo container
const createContainer = (title) => {
  const container = document.createElement('div');
  container.style.marginBottom = '2rem';
  container.style.padding = '1rem';
  container.style.border = '1px solid #e0e0e0';
  container.style.borderRadius = '4px';

  const heading = document.createElement('h3');
  heading.textContent = title;
  heading.style.marginBottom = '1rem';
  container.appendChild(heading);

  return container;
};

export const AllHeadings = () => {
  const container = createContainer('All Heading Levels');
  const headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

  headings.forEach((tag, index) => {
    const typography = Typography({
      children: `Heading ${index + 1} - The quick brown fox`,
      as: tag,
      block: true,
      className: 'mb-3',
    });
    container.appendChild(typography.getElement());
  });

  return container;
};

export const TextElements = () => {
  const container = createContainer('Text Elements');

  // Paragraph
  const paragraph = Typography({
    children:
      'This is a paragraph element. It contains regular body text that can wrap across multiple lines when needed. Paragraphs are block elements by default.',
    as: 'p',
    block: true,
    className: 'mb-3',
  });
  container.appendChild(paragraph.getElement());

  // Span
  const span = Typography({
    children: 'This is a span element, which is inline by default.',
    as: 'span',
    className: 'mb-3',
  });
  container.appendChild(span.getElement());
  container.appendChild(document.createElement('br'));
  container.appendChild(document.createElement('br'));

  // Div
  const div = Typography({
    children: 'This is a div element with typography styling.',
    as: 'div',
    block: true,
    className: 'mb-3',
  });
  container.appendChild(div.getElement());

  return container;
};

export const TextAlignments = () => {
  const container = createContainer('Text Alignments');
  const alignments = ['left', 'center', 'right', 'justify'];

  alignments.forEach((align) => {
    const typography = Typography({
      children: `This text is aligned to the ${align}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut sollicitudin massa.`,
      as: 'p',
      textAlign: align,
      block: true,
      className: 'mb-3',
    });
    container.appendChild(typography.getElement());
  });

  return container;
};

export const FontWeights = () => {
  const container = createContainer('Font Weights');
  const weights = [
    { value: 'light', display: 'Light (300)' },
    { value: 'regular', display: 'Regular (400)' },
    { value: 'medium', display: 'Medium (500)' },
    { value: 'semibold', display: 'Semibold (600)' },
    { value: 'bold', display: 'Bold (700)' },
    { value: '100', display: 'Thin (100)' },
    { value: '900', display: 'Black (900)' },
  ];

  weights.forEach(({ value, display }) => {
    const typography = Typography({
      children: `${display} - The quick brown fox jumps over the lazy dog`,
      as: 'p',
      weight: value,
      block: true,
      className: 'mb-3',
    });
    container.appendChild(typography.getElement());
  });

  return container;
};

export const FontStyles = () => {
  const container = createContainer('Font Styles');

  // Normal
  const normal = Typography({
    children: 'Normal text style',
    as: 'p',
    block: true,
    className: 'mb-3',
  });
  container.appendChild(normal.getElement());

  // Italic
  const italic = Typography({
    children: 'Italic text style',
    as: 'p',
    italic: true,
    block: true,
    className: 'mb-3',
  });
  container.appendChild(italic.getElement());

  // Italic with weight
  const italicBold = Typography({
    children: 'Italic and bold text style',
    as: 'p',
    italic: true,
    weight: 'bold',
    block: true,
    className: 'mb-3',
  });
  container.appendChild(italicBold.getElement());

  return container;
};

export const Colors = () => {
  const container = createContainer('Text Colors');
  const colors = [
    { value: '#333333', name: 'Default Gray' },
    { value: '#0077cc', name: 'Primary Blue' },
    { value: '#cc0000', name: 'Error Red' },
    { value: '#00aa55', name: 'Success Green' },
    { value: '#ffaa00', name: 'Warning Orange' },
  ];

  colors.forEach(({ value, name }) => {
    const typography = Typography({
      children: `${name} - The quick brown fox jumps over the lazy dog`,
      as: 'p',
      color: value,
      block: true,
      className: 'mb-3',
    });
    container.appendChild(typography.getElement());
  });

  return container;
};

export const CustomSizes = () => {
  const container = createContainer('Custom Sizes with Responsive Behavior');

  const heading = Typography({
    children: 'This heading has custom responsive sizing',
    as: 'h2',
    tabletSize: '24px',
    mobileSize: '20px',
    block: true,
    className: 'mb-3',
  });
  container.appendChild(heading.getElement());

  const paragraph = Typography({
    children:
      'This paragraph also has custom responsive sizing that changes at tablet and mobile breakpoints.',
    as: 'p',
    tabletSize: '16px',
    mobileSize: '14px',
    block: true,
    className: 'mb-3',
  });
  container.appendChild(paragraph.getElement());

  const instruction = document.createElement('div');
  instruction.innerHTML =
    '<small>Resize the window to see the text size change at tablet (768px) and mobile (480px) breakpoints.</small>';
  container.appendChild(instruction);

  return container;
};

export const InlineVsBlock = () => {
  const container = createContainer('Inline vs Block Display');

  // Default paragraph (block)
  const paragraph = Typography({
    children: 'This is a paragraph (block by default).',
    as: 'p',
    className: 'mb-3',
  });
  container.appendChild(paragraph.getElement());

  // Force inline paragraph
  const inlineParagraph = Typography({
    children: 'This is a paragraph forced to display inline.',
    as: 'p',
    block: false,
    className: 'mb-3',
  });
  container.appendChild(inlineParagraph.getElement());
  container.appendChild(document.createElement('br'));
  container.appendChild(document.createElement('br'));

  // Default span (inline)
  const span = Typography({
    children: 'This is a span (inline by default).',
    as: 'span',
    className: 'mb-3',
  });
  container.appendChild(span.getElement());
  container.appendChild(document.createElement('br'));
  container.appendChild(document.createElement('br'));

  // Force block span
  const blockSpan = Typography({
    children: 'This is a span forced to display as block.',
    as: 'span',
    block: true,
    className: 'mb-3',
  });
  container.appendChild(blockSpan.getElement());

  return container;
};

export const WithCustomClasses = () => {
  const container = createContainer('Custom CSS Classes');

  // Add some custom styles for demonstration
  const style = document.createElement('style');
  style.textContent = `
    .custom-text {
      border-bottom: 2px dotted #0077cc;
      padding-bottom: 4px;
    }
    .highlight {
      background-color: #ffffcc;
      padding: 4px 8px;
    }
    .shadow-text {
      text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
    }
  `;
  container.appendChild(style);

  // Custom class examples
  const customClasses = [
    'custom-text',
    'highlight',
    'shadow-text',
    'custom-text highlight',
  ];

  customClasses.forEach((className) => {
    const typography = Typography({
      children: `This text has the custom class: ${className}`,
      as: 'p',
      className: `${className} mb-3`,
      block: true,
    });
    container.appendChild(typography.getElement());
  });

  return container;
};

export const WithCustomId = () => {
  const container = createContainer('Custom ID Attribute');

  const typography = Typography({
    children: 'This typography element has a custom ID attribute',
    as: 'h3',
    id: 'custom-heading-id',
    block: true,
  });
  container.appendChild(typography.getElement());

  const code = document.createElement('pre');
  code.textContent = `<h3 id="custom-heading-id" class="typography typography--h3 typography--block">
  This typography element has a custom ID attribute
</h3>`;
  code.style.backgroundColor = '#f5f5f5';
  code.style.padding = '10px';
  code.style.borderRadius = '4px';
  code.style.marginTop = '10px';
  container.appendChild(code);

  return container;
};

export const ComplexContent = () => {
  const container = createContainer('Complex Content');

  // Create an element to use as children
  const complexContent = document.createElement('div');
  complexContent.innerHTML = `
    <strong>This is bold text</strong> inside a <em>complex</em> HTML structure.
    <ul>
      <li>List item 1</li>
      <li>List item 2</li>
      <li>List item 3</li>
    </ul>
  `;

  const typography = Typography({
    children: complexContent,
    as: 'div',
    block: true,
  });

  container.appendChild(typography.getElement());

  return container;
};

export const WithNestedElements = () => {
  const container = createContainer('Nested Typography Components');

  // Create nested typography components
  const inner = Typography({
    children: 'This is a nested typography component',
    as: 'span',
    color: '#cc0000',
    italic: true,
  });

  const outer = Typography({
    children: inner,
    as: 'p',
    block: true,
    weight: 'bold',
  });

  container.appendChild(outer.getElement());

  const explanation = document.createElement('p');
  explanation.textContent =
    'The text above is a bold paragraph containing an italic, red span.';
  explanation.style.marginTop = '10px';
  explanation.style.fontSize = '14px';
  explanation.style.color = '#666';
  container.appendChild(explanation);

  return container;
};

export const CombinedFeatures = () => {
  const container = createContainer('Combined Typography Features');

  const typography = Typography({
    children: 'Typography with multiple styling features combined',
    as: 'h3',
    textAlign: 'center',
    color: '#0077cc',
    weight: 'semibold',
    italic: true,
    className: 'highlight',
    block: true,
  });

  container.appendChild(typography.getElement());

  // Add custom style for the highlight class
  const style = document.createElement('style');
  style.textContent = `
    .highlight {
      background-color: #f0f8ff;
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
  `;
  container.appendChild(style);

  return container;
};

export const ResponsiveTypography = () => {
  const container = createContainer('Responsive Typography Demonstration');

  // Instructions
  const instructions = document.createElement('div');
  instructions.innerHTML = `
    <p style="margin-bottom: 20px;">
      This story demonstrates responsive typography. Resize the browser window to see changes:
      <ul>
        <li>Desktop: Default sizes</li>
        <li>Tablet: Sizes change at 768px width</li>
        <li>Mobile: Sizes change at 480px width</li>
      </ul>
    </p>
  `;
  container.appendChild(instructions);

  // Create responsive typography examples
  const examples = [
    {
      content: 'Desktop: 32px / Tablet: 28px / Mobile: 24px',
      as: 'h1',
      tabletSize: '28px',
      mobileSize: '24px',
    },
    {
      content: 'Desktop: 24px / Tablet: 20px / Mobile: 18px',
      as: 'h2',
      tabletSize: '20px',
      mobileSize: '18px',
    },
    {
      content: 'Desktop: 16px / Tablet: 15px / Mobile: 14px',
      as: 'p',
      tabletSize: '15px',
      mobileSize: '14px',
    },
  ];

  examples.forEach((example) => {
    const typography = Typography({
      children: example.content,
      as: example.as,
      tabletSize: example.tabletSize,
      mobileSize: example.mobileSize,
      block: true,
      className: 'mb-4',
    });
    container.appendChild(typography.getElement());
  });

  return container;
};
