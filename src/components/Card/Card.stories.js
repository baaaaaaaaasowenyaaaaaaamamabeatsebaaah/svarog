// src/components/Card/Card.stories.js
import Card from './Card.js';
import Button from '../Button/Button.js';

export default {
  title: 'Components/Card',
  component: Card,
};

export const Default = () => {
  return Card({
    title: 'Card Title',
    children: 'This is a simple card with some content.',
  });
};

export const WithImageUrl = () => {
  return Card({
    title: 'Card with Image URL',
    imageUrl: 'https://picsum.photos/300/200',
    children: 'This card includes an image at the top using imageUrl prop.',
  });
};

export const WithImageElement = () => {
  const img = document.createElement('img');
  img.src = 'https://picsum.photos/300/200';
  img.alt = 'Custom image';
  img.className = 'custom-image';

  return Card({
    title: 'Card with Image Element',
    imageElement: img,
    children: 'This card includes a custom image element at the top.',
  });
};

export const WithLegacyImage = () => {
  return Card({
    title: 'Card with Legacy Image Prop',
    image: 'https://picsum.photos/300/200',
    children:
      'This card uses the deprecated image prop (will show a console warning).',
  });
};

export const WithFooter = () => {
  const footerButton = Button({
    text: 'Learn More',
    onClick: () => alert('Button clicked!'),
  }).getElement();

  return Card({
    title: 'Card with Footer',
    children: 'This card has a footer with a button.',
    footer: footerButton,
  });
};

export const Outlined = () => {
  return Card({
    title: 'Outlined Card',
    children: 'This card uses the outlined style.',
    outlined: true,
  });
};

export const Elevated = () => {
  return Card({
    title: 'Elevated Card',
    children: 'This card has a shadow elevation.',
    elevated: true,
  });
};

export const ComplexCard = () => {
  // Create content with multiple elements
  const contentContainer = document.createElement('div');

  const paragraph1 = document.createElement('p');
  paragraph1.textContent =
    'This is a complex card with multiple content elements.';
  contentContainer.appendChild(paragraph1);

  const list = document.createElement('ul');
  ['First item', 'Second item', 'Third item'].forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    list.appendChild(li);
  });
  contentContainer.appendChild(list);

  const paragraph2 = document.createElement('p');
  paragraph2.textContent =
    'The card demonstrates how to use complex content structures.';
  contentContainer.appendChild(paragraph2);

  // Create footer with multiple elements
  const footerContainer = document.createElement('div');
  footerContainer.style.display = 'flex';
  footerContainer.style.justifyContent = 'space-between';

  const cancelButton = Button({
    text: 'Cancel',
    onClick: () => alert('Cancel clicked'),
    variant: 'secondary',
  }).getElement();

  const confirmButton = Button({
    text: 'Confirm',
    onClick: () => alert('Confirm clicked'),
    variant: 'primary',
  }).getElement();

  footerContainer.appendChild(cancelButton);
  footerContainer.appendChild(confirmButton);

  // Create a custom image
  const img = document.createElement('img');
  img.src = 'https://picsum.photos/400/200';
  img.alt = 'Complex card example';
  img.style.borderRadius = '4px 4px 0 0';

  return Card({
    title: 'Complex Card Example',
    imageElement: img,
    children: contentContainer,
    footer: footerContainer,
    elevated: true,
  });
};
