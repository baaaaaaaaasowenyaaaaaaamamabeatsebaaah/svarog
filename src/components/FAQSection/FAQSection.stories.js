// src/components/FAQSection/FAQSection.stories.js
import FAQSection from './FAQSection.js';

// Helper to create native buttons since we don't know the exact Button API
const createButton = (text, onClick, variant = 'primary') => {
  const button = document.createElement('button');
  button.textContent = text;
  button.onclick = onClick;
  button.style.cssText = `
    padding: 0.5rem 1rem;
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    background: ${variant === 'primary' ? '#007bff' : variant === 'secondary' ? '#6c757d' : '#fff'};
    color: ${variant === 'primary' || variant === 'secondary' ? '#fff' : '#333'};
    cursor: pointer;
    font-size: 0.875rem;
  `;
  button.onmouseover = () => (button.style.opacity = '0.8');
  button.onmouseout = () => (button.style.opacity = '1');
  return button;
};

export default {
  title: 'Components/FAQSection',
  component: FAQSection,
  parameters: {
    docs: {
      description: {
        component:
          'A comprehensive FAQ section component that combines Section and Accordion with smart defaults for FAQ usage.',
      },
    },
  },
};

// Sample FAQ data
const sampleFAQs = [
  {
    id: 'pricing',
    question: 'What does your service cost?',
    answer:
      'Our pricing varies based on your needs. We offer flexible plans starting from €29/month for basic features, with premium plans available for larger organizations.',
  },
  {
    id: 'support',
    question: 'Do you provide customer support?',
    answer:
      'Yes! We provide 24/7 customer support through email, chat, and phone. Premium customers also get priority support with dedicated account managers.',
  },
  {
    id: 'integration',
    question: 'How easy is it to integrate with existing systems?',
    answer: `
      <p>Integration is straightforward with our comprehensive API and pre-built connectors:</p>
      <ul>
        <li>REST and GraphQL APIs available</li>
        <li>Pre-built integrations for popular platforms</li>
        <li>Custom webhooks and data sync options</li>
        <li>Dedicated integration support team</li>
      </ul>
      <p>Most customers are up and running within 24 hours.</p>
    `,
  },
  {
    id: 'security',
    question: 'Is my data secure?',
    answer:
      'Absolutely. We use enterprise-grade security including AES-256 encryption, SOC 2 compliance, and regular security audits. Your data is stored in EU data centers with full GDPR compliance.',
  },
  {
    id: 'trial',
    question: 'Can I try it for free?',
    answer:
      "Yes! We offer a 14-day free trial with no credit card required. You'll have access to all premium features during the trial period.",
  },
];

const techFAQs = [
  {
    question: 'What technologies do you use?',
    answer:
      'We use modern JavaScript, Node.js, and cloud-native technologies for optimal performance and scalability.',
  },
  {
    question: 'Do you support API integrations?',
    answer:
      'Yes, we provide comprehensive REST and GraphQL APIs with detailed documentation and SDKs.',
  },
  {
    question: 'What about mobile compatibility?',
    answer:
      'Our platform is fully responsive and works seamlessly across all devices and screen sizes.',
  },
];

export const Default = () => {
  try {
    return FAQSection({
      title: 'Frequently Asked Questions',
      description: 'Common questions about our service and platform.',
      faqs: sampleFAQs,
    });
  } catch (error) {
    console.error('Error creating default FAQ section:', error);
    const errorDiv = document.createElement('div');
    errorDiv.style.color = 'red';
    errorDiv.textContent = `Error: ${error.message}`;
    return errorDiv;
  }
};

export const BasicFAQ = () => {
  return FAQSection({
    faqs: [
      {
        question: 'What is this component?',
        answer:
          'The FAQSection component combines a Section and Accordion to create beautiful FAQ sections.',
      },
      {
        question: 'How do I use it?',
        answer:
          'Simply pass an array of FAQ objects with question and answer properties.',
      },
      {
        question: 'Can I customize it?',
        answer:
          'Yes! You can customize styling, behavior, and layout through various props.',
      },
    ],
  });
};

export const WithoutTitle = () => {
  return FAQSection({
    faqs: sampleFAQs.slice(0, 3),
  });
};

export const MultipleMode = () => {
  return FAQSection({
    title: 'Multiple FAQs Open',
    description: 'You can expand multiple questions at the same time.',
    faqs: techFAQs,
    multiple: true,
    defaultExpanded: [], // Start with none expanded to avoid ID issues
  });
};

export const DifferentIconTypes = () => {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '3rem';

  const iconTypes = [
    { name: 'Plus/Minus (Default)', type: 'plus-minus' },
    { name: 'Arrow', type: 'arrow' },
    { name: 'Chevron', type: 'chevron' },
    { name: 'Caret', type: 'caret' },
    { name: 'No Icon', type: 'no-icon' },
  ];

  iconTypes.forEach(({ name, type }) => {
    const section = FAQSection({
      title: name,
      faqs: techFAQs.slice(0, 2).map((faq, index) => ({
        ...faq,
        id: `${type}-${index + 1}`,
      })),
      iconType: type,
    });

    container.appendChild(section.getElement());
  });

  return container;
};

export const DifferentVariants = () => {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '3rem';

  const variants = [
    { name: 'Bordered (Default)', variant: 'bordered' },
    { name: 'Default', variant: '' },
    { name: 'Minimal', variant: 'minimal' },
    { name: 'Flush', variant: 'flush' },
  ];

  variants.forEach(({ name, variant }) => {
    const section = FAQSection({
      title: `${name} Variant`,
      faqs: techFAQs.slice(0, 2).map((faq, index) => ({
        ...faq,
        id: `${variant || 'default'}-${index + 1}`,
      })),
      variant: variant || undefined,
    });

    container.appendChild(section.getElement());
  });

  return container;
};

export const SectionStyling = () => {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '2rem';

  // Minor variant section
  const minorSection = FAQSection({
    title: 'Minor Section Variant',
    description: 'This uses the minor section variant for alternate styling.',
    faqs: techFAQs.slice(0, 2),
    sectionVariant: 'minor',
  });

  // Custom background color
  const coloredSection = FAQSection({
    title: 'Custom Background',
    description: 'This section has a custom background color.',
    faqs: techFAQs.slice(1, 3),
    backgroundColor: '#f0f8ff',
  });

  // No padding bottom
  const noPaddingSection = FAQSection({
    title: 'No Bottom Padding',
    description: 'This section has no bottom padding.',
    faqs: techFAQs.slice(0, 2),
    noPaddingBottom: true,
  });

  container.appendChild(minorSection.getElement());
  container.appendChild(coloredSection.getElement());
  container.appendChild(noPaddingSection.getElement());

  return container;
};

export const ProgrammaticControl = () => {
  const container = document.createElement('div');

  const controls = document.createElement('div');
  controls.style.marginBottom = '2rem';
  controls.style.display = 'flex';
  controls.style.gap = '0.5rem';
  controls.style.flexWrap = 'wrap';

  const faqSection = FAQSection({
    title: 'Programmatic FAQ Control',
    description:
      'Use the buttons below to control the FAQ section programmatically.',
    faqs: sampleFAQs.slice(0, 4),
    multiple: true,
  });

  // Control buttons with error handling
  const expandAllBtn = createButton(
    'Expand All',
    () => {
      try {
        faqSection.expandAll();
      } catch (error) {
        console.warn('Error expanding all:', error.message);
      }
    },
    'primary'
  );

  const collapseAllBtn = createButton(
    'Collapse All',
    () => {
      try {
        faqSection.collapseAll();
      } catch (error) {
        console.warn('Error collapsing all:', error.message);
      }
    },
    'secondary'
  );

  const toggleFirstBtn = createButton('Toggle First', () => {
    try {
      faqSection.toggleFAQ(0);
    } catch (error) {
      console.warn('Error toggling first:', error.message);
    }
  });

  const expandByIdBtn = createButton('Expand Security', () => {
    try {
      faqSection.expandFAQ('security');
    } catch (error) {
      console.warn('Error expanding security:', error.message);
    }
  });

  const changeIconBtn = createButton('Change Icon', () => {
    try {
      const icons = ['plus-minus', 'arrow', 'chevron', 'caret'];
      const currentState = faqSection.getState();
      const current = icons.indexOf(currentState.iconType);
      const next = icons[(current + 1) % icons.length];
      faqSection.setIconType(next);
    } catch (error) {
      console.warn('Error changing icon:', error.message);
    }
  });

  controls.appendChild(expandAllBtn);
  controls.appendChild(collapseAllBtn);
  controls.appendChild(toggleFirstBtn);
  controls.appendChild(expandByIdBtn);
  controls.appendChild(changeIconBtn);

  container.appendChild(controls);
  container.appendChild(faqSection.getElement());

  return container;
};

export const DynamicFAQs = () => {
  const container = document.createElement('div');

  const controls = document.createElement('div');
  controls.style.marginBottom = '2rem';
  controls.style.display = 'flex';
  controls.style.gap = '0.5rem';
  controls.style.flexWrap = 'wrap';

  const faqSection = FAQSection({
    title: 'Dynamic FAQ Management',
    description: 'Add, update, and remove FAQs dynamically.',
    faqs: techFAQs.slice(0, 2),
  });

  let faqCounter = 1;

  const addFAQBtn = createButton(
    'Add FAQ',
    () => {
      try {
        faqSection.addFAQ({
          question: `Dynamic Question ${faqCounter}?`,
          answer: `This is a dynamically added FAQ #${faqCounter}.`,
        });
        faqCounter++;
      } catch (error) {
        console.warn('Error adding FAQ:', error.message);
      }
    },
    'primary'
  );

  const removeFAQBtn = createButton(
    'Remove Last',
    () => {
      try {
        const currentState = faqSection.getState();
        if (currentState.faqs.length > 0) {
          faqSection.removeFAQ(currentState.faqs.length - 1);
        }
      } catch (error) {
        console.warn('Error removing FAQ:', error.message);
      }
    },
    'secondary'
  );

  const updateFAQBtn = createButton('Update First', () => {
    try {
      const currentState = faqSection.getState();
      if (currentState.faqs.length > 0) {
        faqSection.updateFAQ(0, {
          question: 'Updated Question?',
          answer: `Updated at ${new Date().toLocaleTimeString()}`,
        });
      }
    } catch (error) {
      console.warn('Error updating FAQ:', error.message);
    }
  });

  controls.appendChild(addFAQBtn);
  controls.appendChild(removeFAQBtn);
  controls.appendChild(updateFAQBtn);

  container.appendChild(controls);
  container.appendChild(faqSection.getElement());

  return container;
};

export const SearchExample = () => {
  const container = document.createElement('div');

  const searchContainer = document.createElement('div');
  searchContainer.style.marginBottom = '2rem';

  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = 'Search FAQs...';
  searchInput.style.width = '100%';
  searchInput.style.maxWidth = '400px';
  searchInput.style.padding = '0.75rem';
  searchInput.style.border = '1px solid #ccc';
  searchInput.style.borderRadius = '4px';
  searchInput.style.fontSize = '1rem';

  const resultsDiv = document.createElement('div');
  resultsDiv.style.marginTop = '1rem';
  resultsDiv.style.fontSize = '0.875rem';
  resultsDiv.style.color = '#666';

  const faqSection = FAQSection({
    title: 'Searchable FAQs',
    description:
      'Type in the search box to find specific questions or answers.',
    faqs: sampleFAQs,
  });

  // Add debounced search with error handling
  let searchTimeout;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      try {
        const query = e.target.value.trim();

        if (query) {
          const results = faqSection.searchFAQs(query);
          resultsDiv.textContent = `Found ${results.length} matching FAQ${results.length !== 1 ? 's' : ''}`;

          // Collapse all first, then expand matching results
          faqSection.collapseAll();
          if (results.length > 0) {
            results.forEach((result) => {
              const faqId = result.id || `faq-${result.index + 1}`;
              faqSection.expandFAQ(faqId);
            });
          }
        } else {
          resultsDiv.textContent = '';
          faqSection.collapseAll();
        }
      } catch (error) {
        console.warn('Search error:', error.message);
        resultsDiv.textContent = 'Search error occurred';
        resultsDiv.style.color = '#dc3545';
      }
    }, 300); // Debounce search
  });

  searchContainer.appendChild(searchInput);
  searchContainer.appendChild(resultsDiv);

  container.appendChild(searchContainer);
  container.appendChild(faqSection.getElement());

  return container;
};

export const WithCallback = () => {
  const container = document.createElement('div');

  const status = document.createElement('div');
  status.style.marginBottom = '1rem';
  status.style.padding = '1rem';
  status.style.background = '#f0f0f0';
  status.style.borderRadius = '4px';
  status.innerHTML = '<strong>Status:</strong> No FAQs expanded';

  const faqSection = FAQSection({
    title: 'FAQ with Callback',
    description:
      'The status above updates when FAQs are expanded or collapsed.',
    faqs: techFAQs,
    multiple: true,
    onChange: (expandedItems) => {
      try {
        if (expandedItems.length === 0) {
          status.innerHTML = '<strong>Status:</strong> No FAQs expanded';
        } else {
          const currentState = faqSection.getState();
          const faqTitles = expandedItems
            .map((id) => {
              const faq = currentState.faqs.find(
                (f) =>
                  (f.id || `faq-${currentState.faqs.indexOf(f) + 1}`) === id
              );
              return faq ? faq.question : id;
            })
            .join(', ');
          status.innerHTML = `<strong>Status:</strong> Expanded: ${faqTitles}`;
        }
      } catch (error) {
        console.warn('Callback error:', error.message);
        status.innerHTML = '<strong>Status:</strong> Error updating status';
      }
    },
  });

  container.appendChild(status);
  container.appendChild(faqSection.getElement());

  return container;
};

export const CustomerSupportFAQ = () => {
  const supportFAQs = [
    {
      id: 'contact',
      question: 'How can I contact support?',
      answer: `
        <p>We offer multiple ways to get help:</p>
        <ul>
          <li><strong>Email:</strong> support@company.com (24/7)</li>
          <li><strong>Live Chat:</strong> Available on our website during business hours</li>
          <li><strong>Phone:</strong> +1 (555) 123-4567 (Mon-Fri, 9 AM - 6 PM)</li>
          <li><strong>Help Center:</strong> Comprehensive documentation and guides</li>
        </ul>
      `,
    },
    {
      id: 'response-time',
      question: 'What are your response times?',
      answer: `
        <p>Our support response times vary by plan:</p>
        <ul>
          <li><strong>Free Plan:</strong> 48-72 hours via email</li>
          <li><strong>Pro Plan:</strong> 24 hours via email, same-day chat</li>
          <li><strong>Enterprise:</strong> 4 hours via email, immediate chat priority</li>
        </ul>
        <p>Critical issues are always prioritized regardless of plan.</p>
      `,
    },
    {
      id: 'emergency',
      question: 'What if I have a critical emergency?',
      answer:
        'For critical emergencies affecting your production systems, contact our emergency hotline at +1 (555) 911-HELP. This line is monitored 24/7 for enterprise customers.',
    },
    {
      id: 'billing',
      question: 'I have a billing question',
      answer:
        'For billing inquiries, please contact billing@company.com or use the billing section in your account dashboard. Billing support is available Monday through Friday, 9 AM to 5 PM EST.',
    },
  ];

  return FAQSection({
    id: 'customer-support-faq',
    title: 'Customer Support',
    description: 'Everything you need to know about getting help and support.',
    faqs: supportFAQs,
    sectionVariant: 'minor',
  });
};

export const TechnicalFAQ = () => {
  const technicalFAQs = [
    {
      question: 'What are the system requirements?',
      answer: `
        <p>Our platform has minimal requirements:</p>
        <ul>
          <li><strong>Browser:</strong> Chrome 70+, Firefox 65+, Safari 12+, Edge 79+</li>
          <li><strong>JavaScript:</strong> Must be enabled</li>
          <li><strong>Internet:</strong> Stable connection recommended</li>
          <li><strong>Storage:</strong> 50MB for offline caching</li>
        </ul>
      `,
    },
    {
      question: 'Do you provide API documentation?',
      answer: `
        <p>Yes! We provide comprehensive API documentation including:</p>
        <ul>
          <li>Interactive API explorer</li>
          <li>Code examples in multiple languages</li>
          <li>SDK downloads for popular frameworks</li>
          <li>Webhook documentation and testing tools</li>
        </ul>
        <p>Visit our <a href="/docs/api">Developer Portal</a> for complete documentation.</p>
      `,
    },
    {
      question: 'Is there a rate limit on API calls?',
      answer:
        'API rate limits depend on your plan: Free (100 requests/hour), Pro (1,000 requests/hour), Enterprise (custom limits). Rate limit headers are included in all responses.',
    },
  ];

  return FAQSection({
    title: 'Technical Information',
    faqs: technicalFAQs,
    iconType: 'chevron',
    variant: 'minimal',
    backgroundColor: '#f8f9fa',
  });
};

export const ComprehensiveExample = () => {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '4rem';

  // Main FAQ section
  const mainFAQ = FAQSection({
    id: 'main-faq',
    title: 'Frequently Asked Questions',
    description:
      'Find answers to the most common questions about our platform, pricing, and services.',
    faqs: sampleFAQs,
    defaultExpanded: ['pricing'], // Start with pricing expanded
  });

  // Technical FAQ
  const techFAQ = FAQSection({
    id: 'technical-faq',
    title: 'Technical Documentation',
    description:
      'Technical information for developers and system administrators.',
    faqs: [
      {
        question: 'API Rate Limits',
        answer:
          'Standard: 1000 req/hour, Premium: 10000 req/hour, Enterprise: Custom',
      },
      {
        question: 'Supported Webhooks',
        answer:
          'We support webhooks for user events, payment notifications, and system updates.',
      },
    ],
    sectionVariant: 'minor',
    iconType: 'arrow',
    variant: 'bordered',
  });

  container.appendChild(mainFAQ.getElement());
  container.appendChild(techFAQ.getElement());

  return container;
};
