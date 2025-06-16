// src/components/FAQSection/FAQSection.js
import { createBaseComponent } from '../../utils/baseComponent.js';
import { withThemeAwareness } from '../../utils/composition.js';
import { createComponent } from '../../utils/componentFactory.js';
import { validateRequiredProps } from '../../utils/validation.js';

// Component imports
import Section from '../Section/Section.js';
import Accordion from '../Accordion/Accordion.js';

// CSS injection imports
import { createStyleInjector } from '../../utils/styleInjection.js';
import { faqSectionStyles } from './FAQSection.styles.js';

// Create style injector for FAQSection component
const injectFAQSectionStyles = createStyleInjector('FAQSection');

/**
 * Creates a FAQ Section component that combines Section and Accordion
 * @param {Object} props - FAQSection properties
 * @param {Array} props.faqs - Array of FAQ items with question/answer structure
 * @param {string} [props.title] - Section title
 * @param {string} [props.description] - Section description
 * @param {boolean} [props.multiple=false] - Allow multiple FAQs open (default: false for FAQs)
 * @param {string} [props.variant='bordered'] - Accordion variant (default: bordered for FAQs)
 * @param {string} [props.iconType='plus-minus'] - Icon type (default: plus-minus for FAQs)
 * @param {Array} [props.defaultExpanded=[]] - Initially expanded FAQ IDs
 * @param {string} [props.sectionVariant] - Section variant ('minor' for alternate styling)
 * @param {string} [props.backgroundColor] - Section background color
 * @param {boolean} [props.noPaddingBottom=false] - Remove section bottom padding
 * @param {string} [props.className=''] - Additional CSS classes
 * @param {string} [props.id] - Section ID for anchor links
 * @param {Function} [props.onChange] - Callback when FAQ expansion changes
 * @returns {Object} FAQSection component API
 */
const createFAQSection = (props = {}) => {
  // Validate required props
  validateRequiredProps(
    props,
    {
      faqs: {
        required: true,
        type: 'array',
        minLength: 1,
        validator: (faqs) => {
          const isValid = faqs.every(
            (faq) => faq.question && faq.answer && (faq.id || faq.question)
          );
          return isValid || 'Each FAQ must have question and answer properties';
        },
      },
    },
    'FAQSection'
  );

  // Normalize FAQ items to Accordion format
  const normalizeItems = (faqs) =>
    faqs.map((faq, index) => ({
      id: faq.id || `faq-${index + 1}`,
      title: faq.question,
      content: faq.answer,
    }));

  // Create initial state with smart defaults for FAQs
  const state = {
    faqs: props.faqs || [],
    title: props.title || null,
    description: props.description || null,
    multiple: props.multiple !== undefined ? props.multiple : false, // Single mode for FAQs
    variant: props.variant || 'bordered', // Bordered looks great for FAQs
    iconType: props.iconType || 'plus-minus', // Perfect for FAQ sections
    defaultExpanded: props.defaultExpanded || [],
    sectionVariant: props.sectionVariant || null,
    backgroundColor: props.backgroundColor || null,
    noPaddingBottom: props.noPaddingBottom || false,
    className: props.className || '',
    id: props.id || null,
    onChange: props.onChange || null,
  };

  // Internal accordion reference
  let accordionComponent = null;

  /**
   * Renders the FAQ section based on current state
   * @param {Object} currentState - Current component state
   * @returns {HTMLElement} FAQ section element
   */
  const renderFAQSection = (currentState) => {
    // Inject styles on render
    injectFAQSectionStyles(faqSectionStyles);

    // Prevent creating accordion with empty items
    if (!currentState.faqs || currentState.faqs.length === 0) {
      throw new Error('FAQSection: Cannot render with empty FAQ array');
    }

    // Create accordion with normalized items
    accordionComponent = Accordion({
      items: normalizeItems(currentState.faqs),
      multiple: currentState.multiple,
      variant: currentState.variant,
      iconType: currentState.iconType,
      defaultExpanded: currentState.defaultExpanded,
      className: 'faq-section__accordion',
      ariaLabel: currentState.title
        ? `${currentState.title} FAQs`
        : 'Frequently Asked Questions',
      onChange: currentState.onChange,
    });

    // Create section wrapper
    const section = Section({
      id: currentState.id,
      title: currentState.title,
      description: currentState.description,
      variant: currentState.sectionVariant,
      backgroundColor: currentState.backgroundColor,
      noPaddingBottom: currentState.noPaddingBottom,
      className: `faq-section ${currentState.className}`.trim(),
      children: [accordionComponent.getElement()],
    });

    return section.getElement();
  };

  // Create base component
  const baseComponent = createBaseComponent(renderFAQSection)(state);

  // Enhanced component with FAQ-specific methods
  const faqSectionComponent = {
    ...baseComponent,

    /**
     * Get current state (Svarog UI pattern)
     * @returns {Object} Current component state
     */
    getState() {
      return { ...state }; // Return copy to prevent direct mutation
    },

    /**
     * Get the internal accordion component
     * @returns {Object} Accordion component instance
     */
    getAccordion() {
      return accordionComponent;
    },

    /**
     * Expand a specific FAQ by ID or index
     * @param {string|number} identifier - FAQ ID or zero-based index
     * @returns {Object} FAQSection component (for chaining)
     */
    expandFAQ(identifier) {
      if (!accordionComponent) return this;

      try {
        const faqId =
          typeof identifier === 'number' ? `faq-${identifier + 1}` : identifier;

        accordionComponent.expand(faqId);
      } catch (error) {
        console.warn('FAQSection.expandFAQ error:', error.message);
      }
      return this;
    },

    /**
     * Collapse a specific FAQ by ID or index
     * @param {string|number} identifier - FAQ ID or zero-based index
     * @returns {Object} FAQSection component (for chaining)
     */
    collapseFAQ(identifier) {
      if (!accordionComponent) return this;

      try {
        const faqId =
          typeof identifier === 'number' ? `faq-${identifier + 1}` : identifier;

        accordionComponent.collapse(faqId);
      } catch (error) {
        console.warn('FAQSection.collapseFAQ error:', error.message);
      }
      return this;
    },

    /**
     * Toggle a specific FAQ by ID or index
     * @param {string|number} identifier - FAQ ID or zero-based index
     * @returns {Object} FAQSection component (for chaining)
     */
    toggleFAQ(identifier) {
      if (!accordionComponent) return this;

      try {
        const faqId =
          typeof identifier === 'number' ? `faq-${identifier + 1}` : identifier;

        accordionComponent.toggle(faqId);
      } catch (error) {
        console.warn('FAQSection.toggleFAQ error:', error.message);
      }
      return this;
    },

    /**
     * Expand all FAQs (only works when multiple is true)
     * @returns {Object} FAQSection component (for chaining)
     */
    expandAll() {
      if (accordionComponent) {
        try {
          accordionComponent.expandAll();
        } catch (error) {
          console.warn('FAQSection.expandAll error:', error.message);
        }
      }
      return this;
    },

    /**
     * Collapse all FAQs
     * @returns {Object} FAQSection component (for chaining)
     */
    collapseAll() {
      if (accordionComponent) {
        try {
          accordionComponent.collapseAll();
        } catch (error) {
          console.warn('FAQSection.collapseAll error:', error.message);
        }
      }
      return this;
    },

    /**
     * Get currently expanded FAQ IDs
     * @returns {Array} Array of expanded FAQ IDs
     */
    getExpandedFAQs() {
      try {
        return accordionComponent ? accordionComponent.getExpandedItems() : [];
      } catch (error) {
        console.warn('FAQSection.getExpandedFAQs error:', error.message);
        return [];
      }
    },

    /**
     * Set the FAQ icon type
     * @param {string} iconType - Icon type for the accordion
     * @returns {Object} FAQSection component (for chaining)
     */
    setIconType(iconType) {
      if (accordionComponent) {
        try {
          accordionComponent.setIconType(iconType);
        } catch (error) {
          console.warn('FAQSection.setIconType error:', error.message);
        }
      }
      return this;
    },

    /**
     * Add a new FAQ to the section
     * @param {Object} faq - FAQ object with question and answer
     * @param {number} [index] - Optional position to insert (default: append)
     * @returns {Object} FAQSection component (for chaining)
     */
    addFAQ(faq, index) {
      if (!faq.question || !faq.answer) {
        throw new Error('FAQ must have question and answer properties');
      }

      const currentState = this.getState();
      const newFaqs = [...currentState.faqs];

      if (typeof index === 'number' && index >= 0 && index <= newFaqs.length) {
        newFaqs.splice(index, 0, faq);
      } else {
        newFaqs.push(faq);
      }

      this.update({ faqs: newFaqs });
      return this;
    },

    /**
     * Remove a FAQ by ID or index
     * @param {string|number} identifier - FAQ ID or zero-based index
     * @returns {Object} FAQSection component (for chaining)
     */
    removeFAQ(identifier) {
      const currentState = this.getState();
      const newFaqs = currentState.faqs.filter((faq, index) => {
        if (typeof identifier === 'number') {
          return index !== identifier;
        }
        return faq.id !== identifier && faq.question !== identifier;
      });

      this.update({ faqs: newFaqs });
      return this;
    },

    /**
     * Update a specific FAQ
     * @param {string|number} identifier - FAQ ID or zero-based index
     * @param {Object} updates - FAQ updates
     * @returns {Object} FAQSection component (for chaining)
     */
    updateFAQ(identifier, updates) {
      const currentState = this.getState();
      const newFaqs = currentState.faqs.map((faq, index) => {
        const matches =
          typeof identifier === 'number'
            ? index === identifier
            : faq.id === identifier || faq.question === identifier;

        return matches ? { ...faq, ...updates } : faq;
      });

      this.update({ faqs: newFaqs });
      return this;
    },

    /**
     * Search FAQs by question or answer content
     * @param {string} query - Search query
     * @returns {Array} Array of matching FAQ objects with their indices
     */
    searchFAQs(query) {
      if (!query || typeof query !== 'string') return [];

      const currentState = this.getState();
      const searchTerm = query.toLowerCase();
      return currentState.faqs
        .map((faq, index) => ({ ...faq, index }))
        .filter((faq) => {
          const questionMatch =
            faq.question && faq.question.toLowerCase().includes(searchTerm);
          const answerMatch =
            faq.answer &&
            typeof faq.answer === 'string' &&
            faq.answer.toLowerCase().includes(searchTerm);
          return questionMatch || answerMatch;
        });
    },
  };

  // Override update to handle FAQ-specific updates
  const originalUpdate = faqSectionComponent.update;
  faqSectionComponent.update = function (newProps) {
    // Update internal state
    Object.assign(state, newProps);

    // If FAQs changed, we need to rebuild the accordion
    if (newProps.faqs) {
      originalUpdate.call(this, newProps);
      return this;
    }

    // For other props, try to update accordion and section directly
    if (
      accordionComponent &&
      (newProps.multiple !== undefined ||
        newProps.variant !== undefined ||
        newProps.iconType !== undefined ||
        newProps.defaultExpanded !== undefined ||
        newProps.onChange !== undefined)
    ) {
      try {
        accordionComponent.update({
          multiple: newProps.multiple,
          variant: newProps.variant,
          iconType: newProps.iconType,
          defaultExpanded: newProps.defaultExpanded,
          onChange: newProps.onChange,
        });
      } catch (error) {
        console.warn('Error updating accordion:', error.message);
      }
    }

    // Update section props if they exist
    const sectionElement = this.getElement();
    if (
      sectionElement &&
      (newProps.id !== undefined ||
        newProps.backgroundColor !== undefined ||
        newProps.className !== undefined ||
        newProps.sectionVariant !== undefined ||
        newProps.noPaddingBottom !== undefined)
    ) {
      // For major section changes, do a full update
      originalUpdate.call(this, newProps);
      return this;
    }

    return this;
  };

  return faqSectionComponent;
};

// Create the component with theme awareness
const FAQSectionComponent = withThemeAwareness(
  createComponent('FAQSection', createFAQSection)
);

// Export as factory function
export default FAQSectionComponent;
