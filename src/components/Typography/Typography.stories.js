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

// Update each story following the same pattern, replacing:
// const typography = new Typography({...})
// with
// const typography = Typography({...})

// For example:
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

  // Continue with the rest of the story implementation...
  // ...
};

// Continue updating all other stories similarly
