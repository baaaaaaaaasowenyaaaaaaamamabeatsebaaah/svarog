import { Section } from './Section';

export default {
  title: 'Section',
  component: Section,
};

export const Default = () => {
  const section = new Section({
    children: [
      document
        .createElement('p')
        .appendChild(
          document.createTextNode('This is a section with default settings.')
        ),
    ],
  });
  return section.getElement();
};

export const MinorVariant = () => {
  const section = new Section({
    variant: 'minor',
    children: [
      document
        .createElement('p')
        .appendChild(
          document.createTextNode('This is a minor variant section.')
        ),
    ],
  });
  return section.getElement();
};

export const WithBackgroundImage = () => {
  const bgImage = document.createElement('img');
  bgImage.src = 'https://via.placeholder.com/150';
  bgImage.alt = 'Background Image';

  const section = new Section({
    backgroundImage: bgImage,
    children: [
      document
        .createElement('p')
        .appendChild(
          document.createTextNode('This section has a background image.')
        ),
    ],
  });
  return section.getElement();
};

export const NoPaddingBottom = () => {
  const section = new Section({
    noPaddingBottom: true,
    children: [
      document
        .createElement('p')
        .appendChild(
          document.createTextNode('This section has no padding at the bottom.')
        ),
    ],
  });
  return section.getElement();
};
