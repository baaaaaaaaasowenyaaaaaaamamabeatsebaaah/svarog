// src/components/Tabs/Tabs.stories.js
import Tabs from './Tabs.js';
import Button from '../Button/Button.js';
import Card from '../Card/Card.js';

export default {
  title: 'Components/Tabs',
  component: Tabs,
};

export const Default = () => {
  return new Tabs({
    tabs: [
      {
        id: 'tab1',
        label: 'Tab 1',
        content: 'This is the content for Tab 1',
      },
      {
        id: 'tab2',
        label: 'Tab 2',
        content: 'This is the content for Tab 2',
      },
      {
        id: 'tab3',
        label: 'Tab 3',
        content: 'This is the content for Tab 3',
      },
    ],
  });
};

export const WithComponents = () => {
  return new Tabs({
    tabs: [
      {
        id: 'button',
        label: 'Button',
        content: new Button({
          text: 'Click me!',
          variant: 'primary',
        }),
      },
      {
        id: 'card',
        label: 'Card',
        content: new Card({
          title: 'Card Title',
          children: 'This is a card component inside a tab',
        }),
      },
      {
        id: 'mixed',
        label: 'Mixed Content',
        content: () => {
          const container = document.createElement('div');
          container.appendChild(
            document.createTextNode('Some text with a button: ')
          );
          container.appendChild(new Button({ text: 'Button' }).getElement());
          return container;
        },
      },
    ],
  });
};

export const WithDefaultActiveTab = () => {
  return new Tabs({
    tabs: [
      {
        id: 'tab1',
        label: 'First Tab',
        content: 'First tab content',
      },
      {
        id: 'tab2',
        label: 'Second Tab (Active)',
        content: 'This tab is active by default',
      },
      {
        id: 'tab3',
        label: 'Third Tab',
        content: 'Third tab content',
      },
    ],
    defaultActiveTab: 1,
  });
};

export const WithCallback = () => {
  const container = document.createElement('div');

  const output = document.createElement('div');
  output.style.marginBottom = '20px';
  output.textContent = 'Click a tab to see the callback in action';

  const tabs = new Tabs({
    tabs: [
      {
        id: 'tab1',
        label: 'Tab 1',
        content: 'Content 1',
      },
      {
        id: 'tab2',
        label: 'Tab 2',
        content: 'Content 2',
      },
      {
        id: 'tab3',
        label: 'Tab 3',
        content: 'Content 3',
      },
    ],
    onTabChange: (newIndex, oldIndex) => {
      output.textContent = `Switched from tab ${oldIndex + 1} to tab ${newIndex + 1}`;
    },
  });

  container.appendChild(output);
  container.appendChild(tabs.getElement());

  return container;
};

export const WithCustomStyling = () => {
  return new Tabs({
    tabs: [
      {
        id: 'tab1',
        label: 'Custom Style 1',
        content: 'This tabs component has custom styling',
      },
      {
        id: 'tab2',
        label: 'Custom Style 2',
        content: 'You can add custom classes for different looks',
      },
    ],
    className: 'custom-styled-tabs',
  });
};

export const WithHTMLContent = () => {
  return new Tabs({
    tabs: [
      {
        id: 'html1',
        label: 'HTML Content',
        content: `
          <div style="padding: 20px;">
            <h3>Rich HTML Content</h3>
            <p>This tab contains <strong>formatted</strong> HTML content.</p>
            <ul>
              <li>List item 1</li>
              <li>List item 2</li>
              <li>List item 3</li>
            </ul>
          </div>
        `,
      },
      {
        id: 'html2',
        label: 'More HTML',
        content: `
          <div style="padding: 20px;">
            <h3>Another HTML Tab</h3>
            <p>With different content, including:</p>
            <ol>
              <li>Ordered lists</li>
              <li>Links: <a href="#">Click here</a></li>
              <li>And more...</li>
            </ol>
          </div>
        `,
      },
    ],
  });
};
