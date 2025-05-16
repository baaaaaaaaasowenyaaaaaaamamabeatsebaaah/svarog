// src/components/Card/Card.stories.js
import Card from './Card.js';
import Button from '../Button/Button.js';

export default {
  title: 'Components/Card',
  component: Card,
};

export const Default = () => {
  return new Card({
    title: 'Card Title',
    children: 'This is a simple card with some content.',
  });
};

export const WithImage = () => {
  return new Card({
    title: 'Card with Image',
    image: 'https://picsum.photos/300/200',
    children: 'This card includes an image at the top.',
  });
};

export const WithFooter = () => {
  const footerButton = new Button({
    text: 'Learn More',
    onClick: () => alert('Button clicked!'),
  }).getElement();

  return new Card({
    title: 'Card with Footer',
    children: 'This card has a footer with a button.',
    footer: footerButton,
  });
};

export const Outlined = () => {
  return new Card({
    title: 'Outlined Card',
    children: 'This card uses the outlined style.',
    outlined: true,
  });
};

export const Elevated = () => {
  return new Card({
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

  const cancelButton = new Button({
    text: 'Cancel',
    onClick: () => alert('Cancel clicked'),
    className: 'btn--secondary',
  }).getElement();

  const confirmButton = new Button({
    text: 'Confirm',
    onClick: () => alert('Confirm clicked'),
  }).getElement();

  footerContainer.appendChild(cancelButton);
  footerContainer.appendChild(confirmButton);

  return new Card({
    title: 'Complex Card Example',
    image: 'https://picsum.photos/400/200',
    children: contentContainer,
    footer: footerContainer,
    elevated: true,
  });
};
