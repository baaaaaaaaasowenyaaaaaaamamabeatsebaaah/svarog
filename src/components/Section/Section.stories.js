// src/components/Section/Section.stories.js
import { Section } from './Section.js';
import Typography from '../Typography/Typography.js';

export default {
  title: 'Section',
  component: Section,
};

export const Default = () => {
  const content = document.createElement('div');

  const heading = new Typography({
    children: 'Default Section',
    as: 'h3',
  }).getElement();

  const paragraph = new Typography({
    children:
      'This is a standard section with default styling. It demonstrates the basic appearance of the Section component.',
    as: 'p',
  }).getElement();

  content.appendChild(heading);
  content.appendChild(paragraph);

  const section = new Section({
    children: [content],
  });

  return section.getElement();
};

export const MinorVariant = () => {
  const content = document.createElement('div');

  const heading = new Typography({
    children: 'Minor Variant Section',
    as: 'h3',
  }).getElement();

  const paragraph = new Typography({
    children:
      'This uses the "minor" variant, which applies alternate background and text colors defined in CSS variables.',
    as: 'p',
  }).getElement();

  content.appendChild(heading);
  content.appendChild(paragraph);

  const section = new Section({
    variant: 'minor',
    children: [content],
  });

  return section.getElement();
};

export const WithBackgroundImage = () => {
  // Create background image element
  const bgImage = document.createElement('img');
  bgImage.src = 'https://picsum.photos/1200/300';
  bgImage.alt = 'Background Image';
  bgImage.style.objectFit = 'cover';

  const content = document.createElement('div');
  content.style.padding = '2rem';

  // Use the Typography component with class names instead of inline styles
  const heading = new Typography({
    children: 'Section With Background Image',
    as: 'h2',
    className: 'light-text', // Would need this CSS class defined somewhere
  }).getElement();

  const paragraph = new Typography({
    children:
      'This section has a background image from picsum.photos that fills the entire background.',
    as: 'p',
    className: 'light-text', // Would need this CSS class defined somewhere
  }).getElement();

  content.appendChild(heading);
  content.appendChild(paragraph);

  const section = new Section({
    backgroundImage: bgImage,
    children: [content],
  });

  // Add a style tag for demo purposes - in a real app, this would be in a CSS file
  const style = document.createElement('style');
  style.textContent = `.light-text { color: white; text-shadow: 0 0 5px rgba(0,0,0,0.7); }`;
  document.head.appendChild(style);

  return section.getElement();
};

export const WithTitleAndDescription = () => {
  const paragraph = new Typography({
    children:
      'This is the main content of the section. The title and description above are added through the Section props.',
    as: 'p',
  }).getElement();

  const section = new Section({
    title: 'Section Title',
    description:
      'This is a description of the section that appears below the title.',
    children: [paragraph],
  });

  return section.getElement();
};

export const NoPaddingBottom = () => {
  const paragraph = new Typography({
    children:
      'This section has no padding at the bottom, useful when you need sections to be flush with each other.',
    as: 'p',
  }).getElement();

  const section = new Section({
    noPaddingBottom: true,
    children: [paragraph],
  });

  return section.getElement();
};

export const WithCustomBackgroundColor = () => {
  const content = document.createElement('div');

  const heading = new Typography({
    children: 'Custom Background Color',
    as: 'h3',
  }).getElement();

  const paragraph = new Typography({
    children:
      'This section has a custom background color applied using the backgroundColor prop.',
    as: 'p',
  }).getElement();

  content.appendChild(heading);
  content.appendChild(paragraph);

  const section = new Section({
    backgroundColor: '#e6f7ff',
    children: [content],
  });

  return section.getElement();
};

export const WithIdForAnchor = () => {
  const paragraph = new Typography({
    children:
      'This section has an ID for anchor links. You can link to this section with "#my-section-id".',
    as: 'p',
  }).getElement();

  const section = new Section({
    id: 'my-section-id',
    children: [paragraph],
  });

  return section.getElement();
};

export const BackgroundColorAndImage = () => {
  // Create background image element
  const bgImage = document.createElement('img');
  bgImage.src = 'https://picsum.photos/1200/300';
  bgImage.alt = 'Background Image';
  bgImage.style.objectFit = 'cover';
  bgImage.style.opacity = '0.7'; // Make image semi-transparent

  const content = document.createElement('div');
  content.style.padding = '2rem';

  const heading = new Typography({
    children: 'Background Color & Image',
    as: 'h3',
    className: 'light-text',
  }).getElement();

  const paragraph = new Typography({
    children:
      'This section demonstrates using both a background color and a semi-transparent background image together.',
    as: 'p',
    className: 'light-text',
  }).getElement();

  content.appendChild(heading);
  content.appendChild(paragraph);

  const section = new Section({
    backgroundColor: '#004466',
    backgroundImage: bgImage,
    children: [content],
  });

  return section.getElement();
};

export const ComprehensiveExample = () => {
  // Create background image element
  const bgImage = document.createElement('img');
  bgImage.src = 'https://picsum.photos/1200/400';
  bgImage.alt = 'Background Image';
  bgImage.style.objectFit = 'cover';

  // Create content with dark background for contrast
  const content = document.createElement('div');
  content.style.padding = '2rem';
  content.style.backgroundColor = 'rgba(255,255,255,0.9)';
  content.style.borderRadius = '8px';

  const heading = new Typography({
    children: 'Comprehensive Example',
    as: 'h2',
  }).getElement();

  const text = new Typography({
    children:
      'This example combines multiple Section features: background image, ID for anchor links, title, and description.',
    as: 'p',
  }).getElement();

  const button = document.createElement('button');
  button.textContent = 'Call to Action';
  button.className = 'cta-button'; // Use a class instead of inline styles

  content.appendChild(heading);
  content.appendChild(text);
  content.appendChild(button);

  const section = new Section({
    id: 'comprehensive-example',
    title: 'Section Title',
    description:
      'This is the section description that appears above the main content.',
    backgroundImage: bgImage,
    backgroundColor: '#001a33', // Visible if image fails to load
    children: [content],
  });

  // Add a style tag for demo purposes - in a real app, this would be in a CSS file
  const style = document.createElement('style');
  style.textContent = `
    .cta-button {
      padding: 10px 20px;
      background-color: #0077cc;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 20px;
    }
  `;
  document.head.appendChild(style);

  return section.getElement();
};
