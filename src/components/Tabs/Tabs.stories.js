// src/components/Tabs/Tabs.stories.js
import createTabs from './Tabs.js';
import Button from '../Button/Button.js';
import Card from '../Card/Card.js';

export default {
  title: 'Components/Tabs',
  component: createTabs,
};

// Helper function to create the same tabs for each variant
const createTabsConfig = () => ({
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

export const Default = () => {
  return createTabs(createTabsConfig());
};

export const SimpleVariant = () => {
  return createTabs({
    ...createTabsConfig(),
    variant: 'simple',
  });
};

export const BorderVariant = () => {
  return createTabs({
    ...createTabsConfig(),
    variant: 'border',
  });
};

export const WithComponents = () => {
  return createTabs({
    tabs: [
      {
        id: 'button',
        label: 'Button',
        content: Button({
          text: 'Click me!',
          variant: 'primary',
        }),
      },
      {
        id: 'card',
        label: 'Card',
        content: Card({
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
          container.appendChild(Button({ text: 'Button' }).getElement());
          return container;
        },
      },
    ],
  });
};

export const WithDefaultActiveTab = () => {
  return createTabs({
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
    defaultValue: 1, // Using new prop name
  });
};

export const WithCallback = () => {
  const container = document.createElement('div');

  const output = document.createElement('div');
  output.style.marginBottom = '20px';
  output.textContent = 'Click a tab to see the callback in action';

  const tabs = createTabs({
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
    onChange: (newIndex, oldIndex) => {
      output.textContent = `Switched from tab ${oldIndex + 1} to tab ${newIndex + 1}`;
    },
  });

  container.appendChild(output);
  container.appendChild(tabs.getElement());

  return container;
};

export const WithCustomStyling = () => {
  return createTabs({
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
  return createTabs({
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

export const AllVariants = () => {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '2rem';

  // Create heading and description for each variant
  const variants = [
    {
      name: 'Default',
      variant: 'default',
      description: 'With bottom border and active tab indicator',
    },
    {
      name: 'Simple',
      variant: 'simple',
      description: 'Clean tabs without bottom border',
    },
    {
      name: 'Border',
      variant: 'border',
      description:
        'Tabs with border styling and disabled appearance for inactive tabs',
    },
  ];

  variants.forEach(({ name, variant, description }) => {
    const section = document.createElement('div');

    const header = document.createElement('h3');
    header.textContent = `${name} Variant`;
    header.style.marginBottom = '0.5rem';

    const desc = document.createElement('p');
    desc.textContent = description;
    desc.style.marginBottom = '1rem';

    const tabs = createTabs({
      ...createTabsConfig(),
      variant,
    });

    section.appendChild(header);
    section.appendChild(desc);
    section.appendChild(tabs.getElement());
    container.appendChild(section);
  });

  return container;
};

export const TabAlignments = () => {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '2rem';

  // Create heading and section for each alignment
  const alignments = [
    { name: 'Left Alignment (Default)', align: 'left' },
    { name: 'Center Alignment', align: 'center' },
    { name: 'Right Alignment', align: 'right' },
  ];

  alignments.forEach(({ name, align }) => {
    const section = document.createElement('div');

    const header = document.createElement('h3');
    header.textContent = name;
    header.style.marginBottom = '1rem';

    const tabs = createTabs({
      ...createTabsConfig(),
      align,
    });

    section.appendChild(header);
    section.appendChild(tabs.getElement());
    container.appendChild(section);
  });

  return container;
};

// Example showing both legacy and new props for documentation
export const PropStandardization = () => {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '2rem';

  const header = document.createElement('h2');
  header.textContent = 'Prop Standardization Examples';
  container.appendChild(header);

  // Legacy props example
  const legacySection = document.createElement('div');
  const legacyHeader = document.createElement('h3');
  legacyHeader.textContent = 'Legacy Props (Deprecated)';
  legacyHeader.style.color = '#e53e3e';

  const legacyDesc = document.createElement('p');
  legacyDesc.textContent =
    'These props still work but will show deprecation warnings in the console:';

  const legacyCode = document.createElement('pre');
  legacyCode.textContent = `{
  defaultActiveTab: 0,  // Deprecated
  onTabChange: (newIndex, oldIndex) => { ... }  // Deprecated
}`;
  legacyCode.style.backgroundColor = '#f8f9fa';
  legacyCode.style.padding = '1rem';
  legacyCode.style.borderRadius = '4px';

  legacySection.appendChild(legacyHeader);
  legacySection.appendChild(legacyDesc);
  legacySection.appendChild(legacyCode);
  container.appendChild(legacySection);

  // New props example
  const newSection = document.createElement('div');
  const newHeader = document.createElement('h3');
  newHeader.textContent = 'Standardized Props (Recommended)';
  newHeader.style.color = '#38a169';

  const newDesc = document.createElement('p');
  newDesc.textContent = 'Use these standardized props going forward:';

  const newCode = document.createElement('pre');
  newCode.textContent = `{
  defaultValue: 0,  // ✓ Recommended
  onChange: (newIndex, oldIndex) => { ... }  // ✓ Recommended
}`;
  newCode.style.backgroundColor = '#f8f9fa';
  newCode.style.padding = '1rem';
  newCode.style.borderRadius = '4px';

  newSection.appendChild(newHeader);
  newSection.appendChild(newDesc);
  newSection.appendChild(newCode);
  container.appendChild(newSection);

  // Example tabs with both approaches
  const tabsLegacy = createTabs({
    tabs: [
      { id: 'legacy1', label: 'Legacy Tab 1', content: 'Using legacy props' },
      {
        id: 'legacy2',
        label: 'Legacy Tab 2',
        content: 'Check console for warnings',
      },
    ],
    defaultActiveTab: 1,
    onTabChange: () => console.log('Legacy callback'),
  });

  const tabsNew = createTabs({
    tabs: [
      { id: 'new1', label: 'New Tab 1', content: 'Using standardized props' },
      { id: 'new2', label: 'New Tab 2', content: 'No console warnings' },
    ],
    defaultValue: 1,
    onChange: () => console.log('Standardized callback'),
  });

  const examplesContainer = document.createElement('div');
  examplesContainer.style.display = 'flex';
  examplesContainer.style.gap = '1rem';
  examplesContainer.style.marginTop = '2rem';

  const legacyExample = document.createElement('div');
  legacyExample.style.flex = '1';
  const legacyTitle = document.createElement('h4');
  legacyTitle.textContent = 'Example with Legacy Props';
  legacyExample.appendChild(legacyTitle);
  legacyExample.appendChild(tabsLegacy.getElement());

  const newExample = document.createElement('div');
  newExample.style.flex = '1';
  const newTitle = document.createElement('h4');
  newTitle.textContent = 'Example with New Props';
  newExample.appendChild(newTitle);
  newExample.appendChild(tabsNew.getElement());

  examplesContainer.appendChild(legacyExample);
  examplesContainer.appendChild(newExample);
  container.appendChild(examplesContainer);

  return container;
};
