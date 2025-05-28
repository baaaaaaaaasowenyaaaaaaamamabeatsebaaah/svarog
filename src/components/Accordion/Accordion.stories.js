// src/components/Accordion/Accordion.stories.js
import Accordion from './Accordion.js';
import { Button } from '../Button/index.js';

export default {
  title: 'Components/Accordion',
  component: Accordion,
};

// Helper to create sample content
const createSampleContent = (text) => {
  const div = document.createElement('div');
  div.innerHTML = `
    <p>${text}</p>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
  `;
  return div;
};

const sampleItems = [
  {
    id: 'item-1',
    title: 'What is an accordion component?',
    content:
      'An accordion is a UI component that shows and hides content sections. It helps organize information in a compact, scannable format.',
  },
  {
    id: 'item-2',
    title: 'When should I use an accordion?',
    content:
      'Use accordions for FAQs, product details, navigation menus, or any content that benefits from progressive disclosure.',
  },
  {
    id: 'item-3',
    title: 'How does it improve user experience?',
    content:
      'Accordions reduce cognitive load by hiding complexity, make pages scannable, and give users control over what they see.',
  },
];

export const Default = () => {
  return Accordion({ items: sampleItems });
};

// NEW ICON TYPE STORIES

export const SelectAccordionConsistency = () => {
  const container = document.createElement('div');

  const title = document.createElement('h3');
  title.textContent = 'Select & Accordion Design Consistency';
  title.style.marginBottom = '1rem';

  const description = document.createElement('p');
  description.textContent =
    'Both components use identical arrow styling for perfect design consistency.';
  description.style.marginBottom = '2rem';
  description.style.color = '#666';

  // Create side-by-side layout
  const layout = document.createElement('div');
  layout.style.display = 'grid';
  layout.style.gridTemplateColumns = '1fr 1fr';
  layout.style.gap = '2rem';
  layout.style.alignItems = 'start';

  // Select section
  const selectSection = document.createElement('div');
  const selectTitle = document.createElement('h4');
  selectTitle.textContent = 'Select Component';
  selectTitle.style.marginBottom = '1rem';

  // Import Select if available, otherwise create placeholder
  let selectComponent;
  try {
    // This would work if Select is imported
    selectComponent = document.createElement('div');
    selectComponent.style.padding = '0.5rem 1rem';
    selectComponent.style.border = '1px solid #ccc';
    selectComponent.style.borderRadius = '4px';
    selectComponent.style.display = 'flex';
    selectComponent.style.justifyContent = 'space-between';
    selectComponent.style.alignItems = 'center';
    selectComponent.style.background = 'white';
    selectComponent.style.cursor = 'pointer';

    const selectText = document.createElement('span');
    selectText.textContent = 'Select an option';
    selectText.style.color = '#999';

    const selectArrow = document.createElement('div');
    selectArrow.style.width = '6px';
    selectArrow.style.height = '6px';
    selectArrow.style.borderRight = '2px solid currentColor';
    selectArrow.style.borderBottom = '2px solid currentColor';
    selectArrow.style.transform = 'translateY(-25%) rotate(45deg)';
    selectArrow.style.color = '#666';

    selectComponent.appendChild(selectText);
    selectComponent.appendChild(selectArrow);
  } catch (_e) {
    selectComponent = document.createElement('div');
    selectComponent.textContent = 'Select component would appear here';
    selectComponent.style.padding = '1rem';
    selectComponent.style.background = '#f5f5f5';
    selectComponent.style.borderRadius = '4px';
  }

  selectSection.appendChild(selectTitle);
  selectSection.appendChild(selectComponent);

  // Accordion section
  const accordionSection = document.createElement('div');
  const accordionTitle = document.createElement('h4');
  accordionTitle.textContent = 'Accordion Component';
  accordionTitle.style.marginBottom = '1rem';

  const accordion = Accordion({
    items: [
      {
        id: 'consistency-1',
        title: 'Same Arrow Design',
        content:
          'Notice how both components use identical arrow styling for a cohesive design language.',
      },
      {
        id: 'consistency-2',
        title: 'Perfect Consistency',
        content:
          'The arrow transforms and animations are exactly the same across both components.',
      },
    ],
    iconType: 'arrow',
  });

  accordionSection.appendChild(accordionTitle);
  accordionSection.appendChild(accordion.getElement());

  layout.appendChild(selectSection);
  layout.appendChild(accordionSection);

  container.appendChild(title);
  container.appendChild(description);
  container.appendChild(layout);

  return container;
};

export const ArrowIcon = () => {
  const container = document.createElement('div');

  const title = document.createElement('h3');
  title.textContent = 'CSS Arrow Icon (Select-style)';
  title.style.marginBottom = '1rem';

  const description = document.createElement('p');
  description.textContent =
    'Exact same CSS arrow as Select component - perfect design consistency across your UI.';
  description.style.marginBottom = '1rem';
  description.style.color = '#666';

  const accordion = Accordion({
    items: sampleItems,
    iconType: 'arrow',
  });

  container.appendChild(title);
  container.appendChild(description);
  container.appendChild(accordion.getElement());
  return container;
};

export const ChevronIcon = () => {
  const container = document.createElement('div');

  const title = document.createElement('h3');
  title.textContent = 'Chevron Icon';
  title.style.marginBottom = '1rem';

  const description = document.createElement('p');
  description.textContent =
    'Right-pointing chevron that rotates to point down when expanded.';
  description.style.marginBottom = '1rem';
  description.style.color = '#666';

  const accordion = Accordion({
    items: sampleItems,
    iconType: 'chevron',
  });

  container.appendChild(title);
  container.appendChild(description);
  container.appendChild(accordion.getElement());
  return container;
};

export const PlusMinusIcon = () => {
  const container = document.createElement('div');

  const title = document.createElement('h3');
  title.textContent = 'Plus/Minus Icon';
  title.style.marginBottom = '1rem';

  const description = document.createElement('p');
  description.textContent =
    'Plus sign that changes to minus when expanded - great for FAQ sections.';
  description.style.marginBottom = '1rem';
  description.style.color = '#666';

  const accordion = Accordion({
    items: sampleItems,
    iconType: 'plus-minus',
  });

  container.appendChild(title);
  container.appendChild(description);
  container.appendChild(accordion.getElement());
  return container;
};

export const CaretIcon = () => {
  const container = document.createElement('div');

  const title = document.createElement('h3');
  title.textContent = 'Caret Icon';
  title.style.marginBottom = '1rem';

  const description = document.createElement('p');
  description.textContent =
    'Small triangular caret that rotates - subtle and clean.';
  description.style.marginBottom = '1rem';
  description.style.color = '#666';

  const accordion = Accordion({
    items: sampleItems,
    iconType: 'caret',
  });

  container.appendChild(title);
  container.appendChild(description);
  container.appendChild(accordion.getElement());
  return container;
};

export const NoIcon = () => {
  const container = document.createElement('div');

  const title = document.createElement('h3');
  title.textContent = 'No Icon';
  title.style.marginBottom = '1rem';

  const description = document.createElement('p');
  description.textContent =
    'Clean accordion with no expand/collapse indicator - minimal design.';
  description.style.marginBottom = '1rem';
  description.style.color = '#666';

  const accordion = Accordion({
    items: sampleItems,
    iconType: 'no-icon',
  });

  container.appendChild(title);
  container.appendChild(description);
  container.appendChild(accordion.getElement());
  return container;
};

export const IconTypeComparison = () => {
  const container = document.createElement('div');
  container.style.display = 'grid';
  container.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
  container.style.gap = '2rem';

  const iconTypes = [
    {
      name: 'Content (Default)',
      type: 'content',
      description: 'Traditional dropdown arrow',
    },
    {
      name: 'CSS Arrow',
      type: 'arrow',
      description: 'Exact Select component match',
    },
    { name: 'Chevron', type: 'chevron', description: 'Right-pointing chevron' },
    {
      name: 'Plus/Minus',
      type: 'plus-minus',
      description: 'Plus/minus toggle',
    },
    { name: 'Caret', type: 'caret', description: 'Small triangular caret' },
    { name: 'No Icon', type: 'no-icon', description: 'Clean, minimal design' },
  ];

  iconTypes.forEach(({ name, type, description }) => {
    const section = document.createElement('div');
    section.style.border = '1px solid #e0e0e0';
    section.style.borderRadius = '8px';
    section.style.padding = '1rem';

    const heading = document.createElement('h4');
    heading.textContent = name;
    heading.style.marginTop = '0';
    heading.style.marginBottom = '0.5rem';
    heading.style.color = '#333';

    const desc = document.createElement('p');
    desc.textContent = description;
    desc.style.fontSize = '0.875rem';
    desc.style.color = '#666';
    desc.style.marginBottom = '1rem';

    const accordion = Accordion({
      items: [
        {
          id: `${type}-1`,
          title: 'Example Section',
          content: `This accordion uses the ${name.toLowerCase()} icon style.`,
        },
        {
          id: `${type}-2`,
          title: 'Another Section',
          content: 'Open multiple sections to see the icon behavior.',
        },
      ],
      iconType: type,
    });

    section.appendChild(heading);
    section.appendChild(desc);
    section.appendChild(accordion.getElement());
    container.appendChild(section);
  });

  return container;
};

export const DynamicIconSwitching = () => {
  const container = document.createElement('div');

  const title = document.createElement('h3');
  title.textContent = 'Dynamic Icon Type Switching';
  title.style.marginBottom = '1rem';

  const description = document.createElement('p');
  description.textContent =
    'Switch between different icon types programmatically:';
  description.style.marginBottom = '1rem';
  description.style.color = '#666';

  const controls = document.createElement('div');
  controls.style.marginBottom = '1rem';
  controls.style.display = 'flex';
  controls.style.gap = '0.5rem';
  controls.style.flexWrap = 'wrap';

  const accordion = Accordion({
    items: sampleItems,
    iconType: 'content',
    defaultExpanded: ['item-1'],
  });

  const iconTypes = [
    { label: 'Content', value: 'content' },
    { label: 'Arrow', value: 'arrow' },
    { label: 'Chevron', value: 'chevron' },
    { label: 'Plus/Minus', value: 'plus-minus' },
    { label: 'Caret', value: 'caret' },
    { label: 'No Icon', value: 'no-icon' },
  ];

  iconTypes.forEach(({ label, value }) => {
    const button = Button({
      text: label,
      variant: 'secondary',
      size: 'sm',
      onClick: () => accordion.setIconType(value),
    });
    controls.appendChild(button.getElement());
  });

  container.appendChild(title);
  container.appendChild(description);
  container.appendChild(controls);
  container.appendChild(accordion.getElement());

  return container;
};

export const ArrowWithVariants = () => {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '2rem';

  const variants = [
    { name: 'Default with Arrow', variant: '', iconType: 'arrow' },
    { name: 'Bordered with Arrow', variant: 'bordered', iconType: 'arrow' },
    { name: 'Minimal with Arrow', variant: 'minimal', iconType: 'arrow' },
    { name: 'Flush with Arrow', variant: 'flush', iconType: 'arrow' },
  ];

  variants.forEach(({ name, variant, iconType }) => {
    const section = document.createElement('div');

    const heading = document.createElement('h3');
    heading.textContent = name;
    heading.style.marginBottom = '1rem';

    const accordion = Accordion({
      items: sampleItems.map((item) => ({
        ...item,
        id: `${variant || 'default'}-${iconType}-${item.id}`,
      })),
      variant,
      iconType,
    });

    section.appendChild(heading);
    section.appendChild(accordion.getElement());
    container.appendChild(section);
  });

  return container;
};

// EXISTING STORIES (Updated)

export const SingleMode = () => {
  return Accordion({
    items: [
      {
        id: 'single-1',
        title: 'First Section',
        content: 'Only one section can be open at a time in single mode.',
      },
      {
        id: 'single-2',
        title: 'Second Section',
        content: 'Opening this section will automatically close the first one.',
      },
      {
        id: 'single-3',
        title: 'Third Section',
        content: 'This ensures users focus on one piece of content at a time.',
      },
    ],
    multiple: false,
    iconType: 'arrow', // Use the new arrow icon
  });
};

export const WithDefaultExpanded = () => {
  return Accordion({
    items: [
      {
        id: 'default-1',
        title: 'This starts expanded',
        content: 'This content is visible by default when the accordion loads.',
      },
      {
        id: 'default-2',
        title: 'This starts collapsed',
        content: 'This content is hidden until the user clicks to expand.',
      },
      {
        id: 'default-3',
        title: 'This also starts expanded',
        content: 'Multiple items can be expanded by default.',
      },
    ],
    defaultExpanded: ['default-1', 'default-3'],
    iconType: 'plus-minus', // Use plus/minus for FAQ-style
  });
};

export const WithHTMLContent = () => {
  return Accordion({
    items: [
      {
        id: 'html-1',
        title: 'Rich HTML Content',
        content: `
          <h3>This section contains HTML</h3>
          <p>You can include any valid HTML in accordion content:</p>
          <ul>
            <li>Lists like this one</li>
            <li>Links to <a href="#">other pages</a></li>
            <li>Even <strong>formatted</strong> <em>text</em></li>
          </ul>
          <p>This makes accordions very flexible for different content types.</p>
        `,
      },
      {
        id: 'html-2',
        title: 'Code Examples',
        content: `
          <h3>Code Snippet</h3>
          <pre><code>const accordion = Accordion({
  items: myItems,
  multiple: true,
  iconType: 'arrow'
});</code></pre>
          <p>You can include code examples and technical documentation.</p>
        `,
      },
    ],
    iconType: 'chevron',
  });
};

export const WithComponents = () => {
  const items = [
    {
      id: 'comp-1',
      title: 'This contains a button component',
      content: () => {
        const container = document.createElement('div');
        container.appendChild(
          createSampleContent('This section contains interactive components:')
        );

        const button = Button({
          text: 'Click Me',
          variant: 'primary',
          onClick: () => alert('Button inside accordion clicked!'),
        });

        container.appendChild(button.getElement());
        return container;
      },
    },
    {
      id: 'comp-2',
      title: 'Form elements',
      content: () => {
        const form = document.createElement('form');
        form.innerHTML = `
          <div style="margin-bottom: 1rem;">
            <label for="accordion-input">Your Name:</label>
            <input type="text" id="accordion-input" style="width: 100%; padding: 0.5rem;">
          </div>
          <div>
            <label for="accordion-select">Choose Option:</label>
            <select id="accordion-select" style="width: 100%; padding: 0.5rem;">
              <option>Option 1</option>
              <option>Option 2</option>
              <option>Option 3</option>
            </select>
          </div>
        `;
        return form;
      },
    },
  ];

  return Accordion({
    items,
    iconType: 'caret',
  });
};

export const BorderedVariant = () => {
  return Accordion({
    items: [
      {
        id: 'bordered-1',
        title: 'Bordered Style',
        content: 'Each accordion item has its own border and spacing.',
      },
      {
        id: 'bordered-2',
        title: 'Visual Separation',
        content: 'This variant provides clear visual separation between items.',
      },
      {
        id: 'bordered-3',
        title: 'Great for Cards',
        content:
          'Works well when accordion items should look like individual cards.',
      },
    ],
    variant: 'bordered',
    iconType: 'arrow',
  });
};

export const MinimalVariant = () => {
  return Accordion({
    items: [
      {
        id: 'minimal-1',
        title: 'Minimal Design',
        content: 'Clean and simple with minimal borders and padding.',
      },
      {
        id: 'minimal-2',
        title: 'Less Visual Weight',
        content:
          'Perfect for content-heavy pages where the accordion should be subtle.',
      },
      {
        id: 'minimal-3',
        title: 'Focused on Content',
        content:
          'The minimal variant keeps focus on the content rather than the container.',
      },
    ],
    variant: 'minimal',
    iconType: 'chevron',
  });
};

export const FlushVariant = () => {
  return Accordion({
    items: [
      {
        id: 'flush-1',
        title: 'Flush to Edges',
        content: 'No border radius and extends to container edges.',
      },
      {
        id: 'flush-2',
        title: 'Full Width',
        content: 'Great for sidebars or full-width layouts.',
      },
      {
        id: 'flush-3',
        title: 'Seamless Integration',
        content: 'Integrates seamlessly with surrounding content.',
      },
    ],
    variant: 'flush',
    iconType: 'plus-minus',
  });
};

export const WithCallback = () => {
  const container = document.createElement('div');

  const status = document.createElement('div');
  status.style.marginBottom = '1rem';
  status.style.padding = '1rem';
  status.style.background = '#f0f0f0';
  status.style.borderRadius = '4px';
  status.innerHTML = '<strong>Status:</strong> No items expanded';

  const items = [
    {
      id: 'callback-1',
      title: 'First Item',
      content: 'Expand and collapse to see callback in action.',
    },
    {
      id: 'callback-2',
      title: 'Second Item',
      content: 'The status above updates when items change.',
    },
    {
      id: 'callback-3',
      title: 'Third Item',
      content: 'Try expanding multiple items at once.',
    },
  ];

  const accordion = Accordion({
    items,
    iconType: 'arrow',
    onChange: (expandedItems) => {
      if (expandedItems.length === 0) {
        status.innerHTML = '<strong>Status:</strong> No items expanded';
      } else {
        const itemText = expandedItems
          .map((id) => {
            const item = items.find((i) => i.id === id);
            return item ? item.title : id;
          })
          .join(', ');
        status.innerHTML = `<strong>Status:</strong> Expanded: ${itemText}`;
      }
    },
  });

  container.appendChild(status);
  container.appendChild(accordion.getElement());

  return container;
};

export const ProgrammaticControl = () => {
  const container = document.createElement('div');

  const controls = document.createElement('div');
  controls.style.marginBottom = '1rem';
  controls.style.display = 'flex';
  controls.style.gap = '0.5rem';
  controls.style.flexWrap = 'wrap';

  const items = [
    {
      id: 'prog-1',
      title: 'Section One',
      content: 'This can be controlled programmatically.',
    },
    {
      id: 'prog-2',
      title: 'Section Two',
      content: 'Use the buttons above to control the accordion.',
    },
    {
      id: 'prog-3',
      title: 'Section Three',
      content: 'You can expand, collapse, or toggle specific items.',
    },
  ];

  const accordion = Accordion({
    items,
    iconType: 'arrow',
  });

  // Control buttons
  const expandAllBtn = Button({
    text: 'Expand All',
    variant: 'primary',
    size: 'sm',
    onClick: () => accordion.expandAll(),
  });

  const collapseAllBtn = Button({
    text: 'Collapse All',
    variant: 'secondary',
    size: 'sm',
    onClick: () => accordion.collapseAll(),
  });

  const toggleFirstBtn = Button({
    text: 'Toggle First',
    size: 'sm',
    onClick: () => accordion.toggle('prog-1'),
  });

  const expandSecondBtn = Button({
    text: 'Expand Second',
    size: 'sm',
    onClick: () => accordion.expand('prog-2'),
  });

  controls.appendChild(expandAllBtn.getElement());
  controls.appendChild(collapseAllBtn.getElement());
  controls.appendChild(toggleFirstBtn.getElement());
  controls.appendChild(expandSecondBtn.getElement());

  container.appendChild(controls);
  container.appendChild(accordion.getElement());

  return container;
};

export const LongContent = () => {
  const items = [
    {
      id: 'long-1',
      title: 'Very Long Content Section',
      content: `
        <h3>This section contains a lot of content</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <h4>More Details</h4>
        <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
        <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
        <h4>Additional Information</h4>
        <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.</p>
      `,
    },
    {
      id: 'long-2',
      title: 'Short Content',
      content: 'This one has less content for comparison.',
    },
  ];

  return Accordion({
    items,
    iconType: 'plus-minus',
  });
};

export const AllVariants = () => {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '2rem';

  const items = [
    {
      id: 'variant-1',
      title: 'First Item',
      content: 'Sample content for this variant.',
    },
    {
      id: 'variant-2',
      title: 'Second Item',
      content: 'Another piece of content.',
    },
    {
      id: 'variant-3',
      title: 'Third Item',
      content: 'Final content section.',
    },
  ];

  const variants = [
    { name: 'Default', variant: '', iconType: 'content' },
    { name: 'Bordered', variant: 'bordered', iconType: 'arrow' },
    { name: 'Minimal', variant: 'minimal', iconType: 'chevron' },
    { name: 'Flush', variant: 'flush', iconType: 'plus-minus' },
  ];

  variants.forEach(({ name, variant, iconType }) => {
    const section = document.createElement('div');

    const heading = document.createElement('h3');
    heading.textContent = `${name} Variant (${iconType} icon)`;
    heading.style.marginBottom = '1rem';

    const accordion = Accordion({
      items: items.map((item) => ({
        ...item,
        id: `${variant || 'default'}-${item.id}`,
      })),
      variant,
      iconType,
    });

    section.appendChild(heading);
    section.appendChild(accordion.getElement());
    container.appendChild(section);
  });

  return container;
};
