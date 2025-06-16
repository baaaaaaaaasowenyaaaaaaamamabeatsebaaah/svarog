# FAQSection Component

The FAQSection component creates beautiful, accessible FAQ (Frequently Asked Questions) sections by combining the Section and Accordion components. It features **automatic CSS injection**, **smart FAQ defaults**, and comprehensive **programmatic control**.

## Features

✅ **Zero CSS Import Errors** - Styles inject automatically, works everywhere
✅ **Smart FAQ Defaults** - Plus/minus icons, bordered variant, single-mode expansion
✅ **Flexible Content** - Support for HTML, text, and component content
✅ **Programmatic Control** - Full API for adding, updating, removing FAQs
✅ **Search Support** - Built-in FAQ search functionality
✅ **Multiple Icon Types** - Plus/minus, arrow, chevron, caret, or no icon
✅ **Section Integration** - Title, description, background, variants
✅ **Full Accessibility** - ARIA attributes, keyboard navigation
✅ **Mobile Optimized** - Responsive design with mobile-specific adjustments
✅ **Theme Aware** - Automatically adapts to theme changes

## Usage

```javascript
import { FAQSection } from '@svarog-ui/core';

// Basic FAQ section
const faqSection = FAQSection({
  title: 'Frequently Asked Questions',
  faqs: [
    {
      question: 'What is this component?',
      answer:
        'A beautiful FAQ section that combines Section and Accordion components.',
    },
    {
      question: 'How do I use it?',
      answer:
        'Simply pass an array of FAQ objects with question and answer properties.',
    },
  ],
});

document.body.appendChild(faqSection.getElement());
```

## Props

### Required Props

| Prop | Type  | Description                                  |
| ---- | ----- | -------------------------------------------- |
| faqs | Array | Array of FAQ objects (question/answer pairs) |

### FAQ Object Structure

Each FAQ object must have:

| Property | Type   | Required | Description                           |
| -------- | ------ | -------- | ------------------------------------- |
| question | string | Yes      | The FAQ question text                 |
| answer   | string | Yes      | The FAQ answer (supports HTML)        |
| id       | string | No       | Unique ID (auto-generated if missing) |

### Optional Props

| Prop            | Type     | Default          | Description                                    |
| --------------- | -------- | ---------------- | ---------------------------------------------- |
| title           | string   | null             | Section title                                  |
| description     | string   | null             | Section description                            |
| **multiple**    | boolean  | **false**        | Allow multiple FAQs open (single mode default) |
| **variant**     | string   | **'bordered'**   | Accordion variant (bordered default for FAQs)  |
| **iconType**    | string   | **'plus-minus'** | Icon type (plus-minus default for FAQs)        |
| defaultExpanded | Array    | []               | Initially expanded FAQ IDs                     |
| sectionVariant  | string   | null             | Section variant ('minor')                      |
| backgroundColor | string   | null             | Section background color                       |
| noPaddingBottom | boolean  | false            | Remove section bottom padding                  |
| className       | string   | ''               | Additional CSS classes                         |
| id              | string   | null             | Section ID for anchor links                    |
| onChange        | Function | null             | Callback when FAQ expansion changes            |

## Methods

### FAQ Control Methods

#### expandFAQ(identifier)

Expand a specific FAQ by ID or zero-based index.

```javascript
faqSection.expandFAQ('faq-1'); // By ID
faqSection.expandFAQ(0); // By index (first FAQ)
```

#### collapseFAQ(identifier)

Collapse a specific FAQ by ID or index.

```javascript
faqSection.collapseFAQ('faq-2'); // By ID
faqSection.collapseFAQ(1); // By index
```

#### toggleFAQ(identifier)

Toggle a specific FAQ's expanded state.

```javascript
faqSection.toggleFAQ('faq-3');
faqSection.toggleFAQ(2);
```

#### expandAll()

Expand all FAQs (only works when `multiple` is true).

```javascript
faqSection.expandAll();
```

#### collapseAll()

Collapse all FAQs.

```javascript
faqSection.collapseAll();
```

#### getExpandedFAQs()

Get array of currently expanded FAQ IDs.

```javascript
const expanded = faqSection.getExpandedFAQs();
// ['faq-1', 'faq-3']
```

### Content Management Methods

#### addFAQ(faq, index)

Add a new FAQ, optionally at a specific position.

```javascript
// Add at end
faqSection.addFAQ({
  question: 'New question?',
  answer: 'New answer.',
});

// Insert at position 1
faqSection.addFAQ(
  {
    question: 'Inserted question?',
    answer: 'Inserted answer.',
  },
  1
);
```

#### removeFAQ(identifier)

Remove a FAQ by ID or index.

```javascript
faqSection.removeFAQ('faq-2'); // By ID
faqSection.removeFAQ(1); // By index
```

#### updateFAQ(identifier, updates)

Update a specific FAQ's properties.

```javascript
faqSection.updateFAQ('faq-1', {
  question: 'Updated question?',
  answer: 'Updated answer with new information.',
});
```

#### searchFAQs(query)

Search FAQs by question or answer content.

```javascript
const results = faqSection.searchFAQs('pricing');
// Returns array of matching FAQs with their indices
```

### Configuration Methods

#### setIconType(iconType)

Change the icon type dynamically.

```javascript
faqSection.setIconType('arrow'); // Clean CSS arrow
faqSection.setIconType('chevron'); // Right-pointing chevron
faqSection.setIconType('plus-minus'); // Plus/minus (default)
```

#### update(props)

Update multiple properties at once.

```javascript
faqSection.update({
  title: 'Updated FAQ Title',
  multiple: true,
  iconType: 'arrow',
  backgroundColor: '#f5f5f5',
});
```

#### getAccordion()

Get access to the internal accordion component.

```javascript
const accordion = faqSection.getAccordion();
// Full accordion API available
```

## Icon Types

### Plus/Minus (Default)

Perfect for FAQ sections - clear expand/collapse indication.

```javascript
FAQSection({
  faqs: faqs,
  iconType: 'plus-minus', // Default for FAQs
});
```

### CSS Arrow

Clean, modern arrow that matches Select component styling.

```javascript
FAQSection({
  faqs: faqs,
  iconType: 'arrow', // Matches Select component
});
```

### Chevron

Subtle right-pointing chevron that rotates down.

```javascript
FAQSection({
  faqs: faqs,
  iconType: 'chevron',
});
```

### Caret

Small triangular caret - minimal and clean.

```javascript
FAQSection({
  faqs: faqs,
  iconType: 'caret',
});
```

### No Icon

Clean FAQ without expand/collapse indicators.

```javascript
FAQSection({
  faqs: faqs,
  iconType: 'no-icon',
});
```

## Variants

### Bordered (Default)

Each FAQ appears as a separate card - perfect for FAQ sections.

```javascript
FAQSection({
  faqs: faqs,
  variant: 'bordered', // Default for FAQs
});
```

### Default

Standard accordion styling with subtle borders.

```javascript
FAQSection({
  faqs: faqs,
  variant: '', // Or omit variant prop
});
```

### Minimal

Clean design with minimal visual elements.

```javascript
FAQSection({
  faqs: faqs,
  variant: 'minimal',
});
```

### Flush

No border radius, extends to container edges.

```javascript
FAQSection({
  faqs: faqs,
  variant: 'flush',
});
```

## Examples

### Basic FAQ Section

```javascript
const basicFAQ = FAQSection({
  title: 'Frequently Asked Questions',
  description: 'Common questions about our service.',
  faqs: [
    {
      question: 'What does your service cost?',
      answer: 'Our pricing starts at €29/month with flexible plans available.',
    },
    {
      question: 'Do you offer support?',
      answer:
        'Yes, we provide 24/7 customer support via email, chat, and phone.',
    },
  ],
});
```

### FAQ with HTML Content

```javascript
const htmlFAQ = FAQSection({
  title: 'Technical FAQ',
  faqs: [
    {
      question: 'What integrations do you support?',
      answer: `
        <p>We support multiple integration options:</p>
        <ul>
          <li>REST API with comprehensive documentation</li>
          <li>GraphQL endpoint for flexible queries</li>
          <li>Webhooks for real-time notifications</li>
          <li>Pre-built connectors for popular platforms</li>
        </ul>
        <p>Visit our <a href="/docs">documentation</a> for details.</p>
      `,
    },
  ],
});
```

### Multiple Mode FAQ

```javascript
const multipleFAQ = FAQSection({
  title: 'Help Center',
  faqs: faqs,
  multiple: true, // Allow multiple open
  defaultExpanded: ['faq-1', 'faq-3'], // Start with these expanded
});
```

### Customer Support FAQ

```javascript
const supportFAQ = FAQSection({
  id: 'customer-support',
  title: 'Customer Support',
  description: 'Everything you need to know about getting help.',
  sectionVariant: 'minor', // Alternate section styling
  iconType: 'plus-minus', // Clear FAQ indication
  faqs: [
    {
      id: 'contact',
      question: 'How can I contact support?',
      answer:
        'Email: support@company.com, Phone: +1-555-HELP, Live chat available 24/7.',
    },
    {
      id: 'response-time',
      question: 'What are your response times?',
      answer:
        'We respond to all inquiries within 24 hours, critical issues within 4 hours.',
    },
  ],
});
```

### Programmatic FAQ Management

```javascript
const dynamicFAQ = FAQSection({
  title: 'Dynamic FAQ Management',
  faqs: initialFAQs,
});

// Add FAQ dynamically
const addNewFAQ = () => {
  dynamicFAQ.addFAQ({
    question: 'New question from user?',
    answer: 'Dynamically added answer.',
  });
};

// Update existing FAQ
const updatePricing = () => {
  dynamicFAQ.updateFAQ('pricing', {
    answer: 'Updated pricing: Starting at €39/month (was €29/month).',
  });
};

// Search and expand matching FAQs
const searchAndExpand = (query) => {
  const results = dynamicFAQ.searchFAQs(query);
  dynamicFAQ.collapseAll();
  results.forEach((faq) => {
    dynamicFAQ.expandFAQ(faq.id || `faq-${faq.index + 1}`);
  });
};
```

### FAQ with Callback

```javascript
const faqWithCallback = FAQSection({
  title: 'Analytics FAQ',
  faqs: faqs,
  onChange: (expandedItems) => {
    // Track FAQ usage
    analytics.track('FAQ_Interaction', {
      expandedFAQs: expandedItems,
      timestamp: Date.now(),
    });

    // Update UI
    updateFAQStatus(expandedItems);
  },
});
```

### Section Styling Options

```javascript
// Minor section variant
const minorFAQ = FAQSection({
  faqs: faqs,
  sectionVariant: 'minor',
});

// Custom background
const coloredFAQ = FAQSection({
  faqs: faqs,
  backgroundColor: '#f0f8ff',
});

// No bottom padding (flush with next section)
const flushFAQ = FAQSection({
  faqs: faqs,
  noPaddingBottom: true,
});

// With anchor ID
const anchoredFAQ = FAQSection({
  id: 'pricing-faq',
  faqs: faqs,
});
```

### Method Chaining

```javascript
const chainedFAQ = FAQSection({ faqs: initialFAQs })
  .expandFAQ(0) // Expand first FAQ
  .setIconType('arrow') // Change to arrow icons
  .addFAQ({
    // Add new FAQ
    question: 'Chained question?',
    answer: 'Chained answer.',
  })
  .update({
    // Update multiple props
    title: 'Updated via Chaining',
    multiple: true,
  });
```

## Styling & Theming

### CSS Variables

Customize the FAQ appearance with CSS variables:

```css
:root {
  /* FAQ Section Specific */
  --faq-section-gap: 1.5rem;

  /* FAQ Title & Description */
  --faq-title-font-size: 2rem;
  --faq-title-font-weight: 600;
  --faq-title-color: var(--color-text);
  --faq-title-margin-bottom: 0.75rem;
  --faq-title-align: left;

  --faq-description-font-size: 1.125rem;
  --faq-description-color: var(--color-text-light);
  --faq-description-margin-bottom: 2rem;
  --faq-description-max-width: 600px;

  /* FAQ Questions */
  --faq-question-font-size: 1.125rem;
  --faq-question-font-weight: 500;
  --faq-question-padding: 1.25rem 1rem;

  /* FAQ Answers */
  --faq-answer-font-size: 1rem;
  --faq-answer-line-height: 1.6;
  --faq-answer-color: var(--color-text);
  --faq-answer-padding: 1rem;
  --faq-answer-paragraph-spacing: 1rem;
  --faq-answer-list-margin: 0.75rem 0;
  --faq-answer-list-padding: 1.5rem;
  --faq-answer-list-item-spacing: 0.5rem;
  --faq-answer-link-color: var(--color-primary);
  --faq-answer-link-decoration: underline;
  --faq-answer-link-hover-color: var(--color-primary-dark);

  /* FAQ Items (Bordered Variant) */
  --faq-item-spacing: 1rem;
  --faq-item-border-radius: 8px;
  --faq-item-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  --faq-item-hover-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  --faq-item-expanded-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  --faq-item-transition: box-shadow 0.2s ease;

  /* FAQ Icons */
  --faq-icon-color: var(--color-primary);
  --faq-icon-font-weight: 300;

  /* Search Highlighting */
  --faq-highlight-bg: #fff3cd;
  --faq-highlight-color: #856404;
  --faq-highlight-padding: 0.125rem 0.25rem;
  --faq-highlight-radius: 3px;

  /* Loading States */
  --faq-loading-opacity: 0.6;
  --faq-loading-animation: pulse 1.5s ease-in-out infinite;
}

/* Mobile Specific Variables */
@media (max-width: 768px) {
  :root {
    --faq-title-font-size-mobile: 1.75rem;
    --faq-title-align-mobile: center;
    --faq-description-font-size-mobile: 1rem;
    --faq-description-align-mobile: center;
    --faq-description-margin-bottom-mobile: 1.5rem;
    --faq-question-font-size-mobile: 1rem;
    --faq-question-padding-mobile: 1rem 0.75rem;
    --faq-answer-padding-mobile: 0.75rem;
    --faq-answer-font-size-mobile: 0.875rem;
    --faq-item-spacing-mobile: 0.75rem;
    --faq-item-border-radius-mobile: 6px;
  }
}
```

### Custom FAQ Themes

```css
/* Corporate FAQ Theme */
.corporate-faq {
  --faq-title-color: #1a365d;
  --faq-item-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  --faq-item-border-radius: 4px;
  --faq-icon-color: #2d3748;
}

/* Modern FAQ Theme */
.modern-faq {
  --faq-item-border-radius: 12px;
  --faq-item-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  --faq-icon-color: #667eea;
  --faq-answer-link-color: #667eea;
}

/* Minimal FAQ Theme */
.minimal-faq {
  --faq-item-shadow: none;
  --faq-item-border-radius: 0;
  --faq-question-padding: 1rem 0;
  --faq-answer-padding: 0 0 1rem 0;
}
```

## Search Integration

### Basic Search

```javascript
const searchableFAQ = FAQSection({
  title: 'Searchable FAQ',
  faqs: allFAQs,
});

// Search functionality
const handleSearch = (query) => {
  if (query.trim()) {
    const results = searchableFAQ.searchFAQs(query);

    // Show only matching FAQs
    searchableFAQ.collapseAll();
    results.forEach((faq) => {
      searchableFAQ.expandFAQ(faq.id || `faq-${faq.index + 1}`);
    });

    console.log(`Found ${results.length} matching FAQs`);
  } else {
    searchableFAQ.collapseAll();
  }
};

// Bind to search input
searchInput.addEventListener('input', (e) => {
  handleSearch(e.target.value);
});
```

### Advanced Search with Highlighting

```javascript
const highlightSearchResults = (query) => {
  const results = faqSection.searchFAQs(query);

  // Update FAQ content with highlights
  results.forEach((faq) => {
    const highlightedQuestion = faq.question.replace(
      new RegExp(query, 'gi'),
      `<span class="faq-highlight">$&</span>`
    );

    const highlightedAnswer = faq.answer.replace(
      new RegExp(query, 'gi'),
      `<span class="faq-highlight">$&</span>`
    );

    faqSection.updateFAQ(faq.index, {
      question: highlightedQuestion,
      answer: highlightedAnswer,
    });
  });
};
```

## Accessibility

The FAQSection component provides comprehensive accessibility features:

- **ARIA Attributes**: Proper `aria-expanded`, `aria-controls`, `aria-labelledby`
- **Keyboard Navigation**: Enter/Space to toggle, Tab to navigate
- **Screen Reader Support**: Announces FAQ state changes
- **Focus Management**: Visible focus indicators
- **Semantic HTML**: Proper heading hierarchy
- **Reduced Motion**: Respects `prefers-reduced-motion` preference

### Custom ARIA Labels

```javascript
const accessibleFAQ = FAQSection({
  faqs: faqs,
  // Sets aria-label for the entire accordion
  title: 'Customer Support FAQ', // Used for aria-label
});

// Manual ARIA customization via accordion
const accordion = accessibleFAQ.getAccordion();
// Access full accordion API for advanced ARIA customization
```

## Performance

- **Optimized Rendering**: Efficient DOM updates and minimal re-renders
- **Smart Defaults**: FAQ-optimized settings out of the box
- **Event Delegation**: Efficient event handling
- **Memory Management**: Proper cleanup on destroy
- **CSS Optimization**: Minimal, focused styles
- **Tree Shaking**: Only loads when imported

## Browser Support

- **Modern Browsers**: Full support (Chrome 60+, Firefox 55+, Safari 12+)
- **Mobile**: Optimized for touch interfaces
- **Keyboard**: Full keyboard navigation support
- **Screen Readers**: Compatible with all major screen readers

## Migration Guide

### From Separate Section + Accordion

```javascript
// OLD: Manual combination
const section = Section({
  title: 'FAQ',
  children: [accordion.getElement()],
});

// NEW: Integrated component
const faqSection = FAQSection({
  title: 'FAQ',
  faqs: faqData,
});
```

### FAQ Data Structure

```javascript
// Convert from accordion items to FAQ format
const accordionItems = [{ id: '1', title: 'Question?', content: 'Answer.' }];

const faqData = [{ id: '1', question: 'Question?', answer: 'Answer.' }];
```

## Related Components

- **Accordion**: Core functionality for collapsible content
- **Section**: Container with title, description, and styling
- **Card**: Alternative for individual FAQ cards
- **Typography**: For styled FAQ text content

## Advanced Usage

### FAQ Management System

```javascript
class FAQManager {
  constructor(container) {
    this.container = container;
    this.faqSection = FAQSection({
      title: 'FAQ Management',
      faqs: [],
      multiple: true,
    });

    this.container.appendChild(this.faqSection.getElement());
  }

  async loadFAQs(category) {
    const faqs = await fetch(`/api/faqs/${category}`).then((r) => r.json());
    this.faqSection.update({ faqs });
  }

  addUserFAQ(question, answer) {
    this.faqSection.addFAQ({
      question,
      answer,
      id: `user-${Date.now()}`,
    });
  }

  searchAndHighlight(query) {
    const results = this.faqSection.searchFAQs(query);
    // Implement highlighting logic
    return results;
  }
}
```

### FAQ Analytics Integration

```javascript
const analyticsEnabledFAQ = FAQSection({
  title: 'Product FAQ',
  faqs: productFAQs,
  onChange: (expandedItems) => {
    // Track FAQ interactions
    analytics.track('FAQ_Viewed', {
      faqIds: expandedItems,
      section: 'product',
      timestamp: Date.now(),
    });
  },
});

// Track search behavior
const trackFAQSearch = (query, resultsCount) => {
  analytics.track('FAQ_Search', {
    query,
    resultsCount,
    section: 'product',
  });
};
```

The FAQSection component provides a complete, accessible, and highly customizable solution for creating beautiful FAQ sections with minimal effort and maximum flexibility.
