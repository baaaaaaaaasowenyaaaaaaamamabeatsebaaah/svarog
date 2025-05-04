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
    const typography = new Typography({
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
  const paragraph = new Typography({
    children:
      'This is a paragraph element. It contains regular body text that can wrap across multiple lines when needed. Paragraphs are block elements by default.',
    as: 'p',
    block: true,
    className: 'mb-3',
  });
  container.appendChild(paragraph.getElement());

  // Span (inline)
  const spanContainer = document.createElement('p');
  spanContainer.appendChild(
    document.createTextNode('This paragraph contains an ')
  );

  const inlineSpan = new Typography({
    children: 'inline span element',
    as: 'span',
    color: '#0066cc',
    weight: 'bold',
  });
  spanContainer.appendChild(inlineSpan.getElement());
  spanContainer.appendChild(document.createTextNode(' within the text.'));
  container.appendChild(spanContainer);

  // Div
  const divTypography = new Typography({
    children: 'This is a div element with typography styling.',
    as: 'div',
    block: true,
    className: 'mt-3',
  });
  container.appendChild(divTypography.getElement());

  return container;
};

export const TextAlignments = () => {
  const container = createContainer('Text Alignments');
  const alignments = ['left', 'center', 'right', 'justify'];

  alignments.forEach((align) => {
    const typography = new Typography({
      children: `This text is aligned to the ${align}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
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
    '100',
    '200',
    '300',
    '400',
    'normal',
    '500',
    '600',
    '700',
    'bold',
    '800',
    '900',
  ];

  weights.forEach((weight) => {
    const typography = new Typography({
      children: `Font weight: ${weight}`,
      as: 'div',
      weight: weight,
      block: true,
      className: 'mb-2',
    });
    container.appendChild(typography.getElement());
  });

  return container;
};

export const FontStyles = () => {
  const container = createContainer('Font Styles');

  // Normal
  const normal = new Typography({
    children: 'This is normal text style',
    as: 'p',
    italic: false,
    block: true,
    className: 'mb-3',
  });
  container.appendChild(normal.getElement());

  // Italic
  const italic = new Typography({
    children: 'This is italic text style',
    as: 'p',
    italic: true,
    block: true,
  });
  container.appendChild(italic.getElement());

  return container;
};

export const Colors = () => {
  const container = createContainer('Text Colors');
  const colors = [
    { color: '#333333', name: 'Default Dark' },
    { color: '#0066cc', name: 'Primary Blue' },
    { color: '#28a745', name: 'Success Green' },
    { color: '#dc3545', name: 'Danger Red' },
    { color: '#ffc107', name: 'Warning Yellow' },
    { color: '#6c757d', name: 'Secondary Gray' },
    { color: '#6f42c1', name: 'Purple' },
    { color: '#e83e8c', name: 'Pink' },
  ];

  colors.forEach(({ color, name }) => {
    const typography = new Typography({
      children: `${name} - ${color}`,
      as: 'div',
      color: color,
      block: true,
      className: 'mb-2',
      weight: 'bold',
    });
    container.appendChild(typography.getElement());
  });

  return container;
};

export const CustomSizes = () => {
  const container = createContainer('Custom Sizes');
  const sizes = ['12px', '14px', '16px', '18px', '24px', '32px', '48px'];

  sizes.forEach((size) => {
    const typography = new Typography({
      children: `Custom size: ${size}`,
      as: 'div',
      block: true,
      className: 'mb-2',
      style: `font-size: ${size}`,
    });
    container.appendChild(typography.getElement());
  });

  return container;
};

export const InlineVsBlock = () => {
  const container = createContainer('Inline vs Block Display');

  // Inline examples
  const inlineContainer = document.createElement('div');
  inlineContainer.style.marginBottom = '1rem';

  const inline1 = new Typography({
    children: 'Inline element 1',
    as: 'span',
    block: false,
    color: '#0066cc',
    className: 'mr-2',
  });

  const inline2 = new Typography({
    children: 'Inline element 2',
    as: 'span',
    block: false,
    color: '#28a745',
    className: 'mr-2',
  });

  const inline3 = new Typography({
    children: 'Inline element 3',
    as: 'span',
    block: false,
    color: '#dc3545',
  });

  inlineContainer.appendChild(inline1.getElement());
  inlineContainer.appendChild(inline2.getElement());
  inlineContainer.appendChild(inline3.getElement());
  container.appendChild(inlineContainer);

  // Block examples
  const block1 = new Typography({
    children: 'Block element 1',
    as: 'div',
    block: true,
    color: '#0066cc',
    className: 'mb-2',
  });

  const block2 = new Typography({
    children: 'Block element 2',
    as: 'div',
    block: true,
    color: '#28a745',
    className: 'mb-2',
  });

  const block3 = new Typography({
    children: 'Block element 3',
    as: 'div',
    block: true,
    color: '#dc3545',
  });

  container.appendChild(block1.getElement());
  container.appendChild(block2.getElement());
  container.appendChild(block3.getElement());

  return container;
};

export const WithCustomClasses = () => {
  const container = createContainer('With Custom CSS Classes');

  const typography = new Typography({
    children: 'This element has custom CSS classes applied',
    as: 'p',
    className: 'custom-class another-class',
    block: true,
  });

  container.appendChild(typography.getElement());

  const note = document.createElement('small');
  note.style.color = '#666';
  note.textContent = 'Check the element inspector to see the applied classes';
  container.appendChild(note);

  return container;
};

export const WithCustomId = () => {
  const container = createContainer('With Custom ID');

  const typography = new Typography({
    children: 'This element has a custom ID attribute',
    as: 'p',
    id: 'custom-typography-id',
    block: true,
  });

  container.appendChild(typography.getElement());

  const note = document.createElement('small');
  note.style.color = '#666';
  note.textContent = 'Check the element inspector to see the ID attribute';
  container.appendChild(note);

  return container;
};

export const ComplexContent = () => {
  const container = createContainer('Complex Content (HTML)');

  const typography = new Typography({
    children: `
      <strong>Bold text</strong>, <em>italic text</em>, and <u>underlined text</u>.
      <br><br>
      Lists can also be included:
      <ul>
        <li>First item</li>
        <li>Second item</li>
        <li>Third item</li>
      </ul>
      And even <a href="#">links</a> work!
    `,
    as: 'div',
    block: true,
  });

  container.appendChild(typography.getElement());

  return container;
};

export const WithNestedElements = () => {
  const container = createContainer('With Nested HTML Elements');

  // Create a nested element
  const nestedElement = document.createElement('div');
  const nestedTypography = new Typography({
    children: 'This is nested typography',
    as: 'p',
    color: '#0066cc',
    italic: true,
  });
  nestedElement.appendChild(nestedTypography.getElement());

  const outerTypography = new Typography({
    children: nestedElement,
    as: 'div',
    block: true,
    className: 'p-3',
    style: 'border: 1px solid #ccc; border-radius: 4px;',
  });

  container.appendChild(outerTypography.getElement());

  return container;
};

export const CombinedFeatures = () => {
  const container = createContainer('Combined Features Example');

  const heading = new Typography({
    children: 'Welcome to Our Application',
    as: 'h1',
    textAlign: 'center',
    color: '#2c3e50',
    weight: '700',
    block: true,
    className: 'mb-4',
  });

  const subheading = new Typography({
    children: 'Experience the power of typography',
    as: 'h3',
    textAlign: 'center',
    color: '#34495e',
    weight: '400',
    italic: true,
    block: true,
    className: 'mb-5',
  });

  const content = new Typography({
    children: `
      <p>Typography is the art and technique of arranging type to make written language legible, readable, and appealing when displayed. 
      The arrangement of type involves selecting typefaces, point sizes, line lengths, line-spacing, and letter-spacing, 
      and adjusting the space between pairs of letters.</p>
      
      <p>Good typography establishes a strong visual hierarchy, provides a graphic balance to the website, 
      and sets the product's overall tone. It can enhance the reading experience, making content more accessible 
      and engaging for users.</p>
    `,
    as: 'div',
    block: true,
    className: 'mb-4',
  });

  const footer = new Typography({
    children: '© 2024 Typography Component Demo',
    as: 'p',
    textAlign: 'center',
    color: '#7f8c8d',
    weight: '300',
    block: true,
    className: 'mt-5',
  });

  container.appendChild(heading.getElement());
  container.appendChild(subheading.getElement());
  container.appendChild(content.getElement());
  container.appendChild(footer.getElement());

  return container;
};

// Responsive Typography (showing tablet and mobile size props)
export const ResponsiveTypography = () => {
  const container = createContainer(
    'Responsive Typography (Note: These props are stored but not actively used in the component)'
  );

  const note = document.createElement('p');
  note.style.color = '#ff6b6b';
  note.style.marginBottom = '1rem';
  note.textContent =
    'Note: The tabletSize and mobileSize props are accepted but not actively applied in the current component implementation.';
  container.appendChild(note);

  const typography = new Typography({
    children: 'This typography component accepts responsive size props',
    as: 'h2',
    tabletSize: '24px',
    mobileSize: '18px',
    block: true,
  });

  container.appendChild(typography.getElement());

  const explanation = document.createElement('small');
  explanation.style.color = '#666';
  explanation.textContent =
    "Check the component props. The tabletSize and mobileSize values are stored but need implementation in the component's setStyle method.";
  container.appendChild(explanation);

  return container;
};
