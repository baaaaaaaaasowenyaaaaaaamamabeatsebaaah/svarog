// src/components/Section/Section.stories.js
import { Section } from './Section.js';

export default {
  title: 'Section',
  component: Section,
};

export const Default = () => {
  const p = document.createElement('p');
  p.textContent = 'This is a section with default settings.';

  const section = new Section({
    children: [p],
  });

  return section.getElement();
};

export const MinorVariant = () => {
  const p = document.createElement('p');
  p.textContent = 'This is a minor variant section.';

  const section = new Section({
    variant: 'minor',
    children: [p],
  });

  return section.getElement();
};

export const WithBackgroundImage = () => {
  const bgImage = document.createElement('img');
  bgImage.src = 'https://via.placeholder.com/150';
  bgImage.alt = 'Background Image';

  const p = document.createElement('p');
  p.textContent = 'This section has a background image.';

  const section = new Section({
    backgroundImage: bgImage,
    children: [p],
  });

  return section.getElement();
};

export const NoPaddingBottom = () => {
  const p = document.createElement('p');
  p.textContent = 'This section has no padding at the bottom.';

  const section = new Section({
    noPaddingBottom: true,
    children: [p],
  });

  return section.getElement();
};
