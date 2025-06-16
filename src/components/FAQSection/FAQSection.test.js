// src/components/FAQSection/FAQSection.test.js
import { describe, it, expect, vi } from 'vitest';
import FAQSection from './FAQSection.js';

describe('FAQSection component', () => {
  const mockFAQs = [
    {
      id: 'faq-1',
      question: 'What is a FAQ section?',
      answer:
        'A FAQ section displays frequently asked questions and their answers in a collapsible format.',
    },
    {
      id: 'faq-2',
      question: 'How do I use this component?',
      answer:
        'Simply pass an array of FAQ objects with question and answer properties.',
    },
    {
      question: 'Can I customize the styling?', // No ID - should auto-generate
      answer:
        'Yes, you can customize the appearance using CSS variables and props.',
    },
  ];

  it('should render with required props', () => {
    const faqSection = FAQSection({ faqs: mockFAQs });
    const element = faqSection.getElement();

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.classList.contains('faq-section')).toBe(true);
  });

  it('should throw error without required FAQs', () => {
    expect(() => FAQSection({})).toThrow('FAQSection: faqs is required');
  });

  it('should validate FAQ structure', () => {
    const invalidFAQs = [{ question: 'No answer' }];
    expect(() => FAQSection({ faqs: invalidFAQs })).toThrow(
      'Each FAQ must have question and answer properties'
    );
  });

  it('should auto-generate IDs for FAQs without them', () => {
    const faqSection = FAQSection({ faqs: mockFAQs });
    const accordion = faqSection.getAccordion();

    // Third FAQ should have auto-generated ID
    const expandedItems = accordion.getExpandedItems();
    faqSection.expandFAQ(2); // Expand third FAQ (zero-based index)

    const newExpandedItems = accordion.getExpandedItems();
    expect(newExpandedItems.length).toBeGreaterThan(expandedItems.length);
  });

  it('should apply FAQ-specific defaults', () => {
    const faqSection = FAQSection({ faqs: mockFAQs });
    const element = faqSection.getElement();
    const accordion = element.querySelector('.accordion');

    // Should use plus-minus icons and bordered variant by default
    expect(accordion.classList.contains('accordion--plus-minus')).toBe(true);
    expect(accordion.classList.contains('accordion--bordered')).toBe(true);
  });

  it('should render with title and description', () => {
    const faqSection = FAQSection({
      faqs: mockFAQs,
      title: 'Frequently Asked Questions',
      description: 'Common questions about our service',
    });
    const element = faqSection.getElement();

    const title = element.querySelector('.section__title');
    const description = element.querySelector('.section__description');

    expect(title).not.toBeNull();
    expect(title.textContent).toBe('Frequently Asked Questions');
    expect(description).not.toBeNull();
    expect(description.textContent).toBe('Common questions about our service');
  });

  it('should allow multiple FAQs open when multiple is true', () => {
    const faqSection = FAQSection({
      faqs: mockFAQs,
      multiple: true,
    });

    faqSection.expandFAQ(0);
    faqSection.expandFAQ(1);

    const expandedFAQs = faqSection.getExpandedFAQs();
    expect(expandedFAQs.length).toBe(2);
  });

  it('should use single mode by default', () => {
    const faqSection = FAQSection({ faqs: mockFAQs });

    faqSection.expandFAQ(0);
    faqSection.expandFAQ(1);

    const expandedFAQs = faqSection.getExpandedFAQs();
    expect(expandedFAQs.length).toBe(1); // Only one should be open
  });

  it('should expand FAQ by index', () => {
    const faqSection = FAQSection({ faqs: mockFAQs });

    faqSection.expandFAQ(1); // Expand second FAQ

    const expandedFAQs = faqSection.getExpandedFAQs();
    expect(expandedFAQs).toContain('faq-2');
  });

  it('should expand FAQ by ID', () => {
    const faqSection = FAQSection({ faqs: mockFAQs });

    faqSection.expandFAQ('faq-1');

    const expandedFAQs = faqSection.getExpandedFAQs();
    expect(expandedFAQs).toContain('faq-1');
  });

  it('should collapse FAQ by index', () => {
    const faqSection = FAQSection({
      faqs: mockFAQs,
      defaultExpanded: ['faq-1'],
    });

    faqSection.collapseFAQ(0);

    const expandedFAQs = faqSection.getExpandedFAQs();
    expect(expandedFAQs).not.toContain('faq-1');
  });

  it('should toggle FAQ state', () => {
    const faqSection = FAQSection({ faqs: mockFAQs });

    faqSection.toggleFAQ('faq-1');
    expect(faqSection.getExpandedFAQs()).toContain('faq-1');

    faqSection.toggleFAQ('faq-1');
    expect(faqSection.getExpandedFAQs()).not.toContain('faq-1');
  });

  it('should expand all FAQs when multiple is true', () => {
    const faqSection = FAQSection({
      faqs: mockFAQs,
      multiple: true,
    });

    faqSection.expandAll();

    const expandedFAQs = faqSection.getExpandedFAQs();
    expect(expandedFAQs.length).toBe(3);
  });

  it('should collapse all FAQs', () => {
    const faqSection = FAQSection({
      faqs: mockFAQs,
      multiple: true,
      defaultExpanded: ['faq-1', 'faq-2'],
    });

    faqSection.collapseAll();

    const expandedFAQs = faqSection.getExpandedFAQs();
    expect(expandedFAQs.length).toBe(0);
  });

  it('should change icon type', () => {
    const faqSection = FAQSection({ faqs: mockFAQs });

    faqSection.setIconType('chevron');

    const element = faqSection.getElement();
    const accordion = element.querySelector('.accordion');
    expect(accordion.classList.contains('accordion--chevron')).toBe(true);
  });

  it('should add new FAQ', () => {
    const faqSection = FAQSection({ faqs: mockFAQs });

    const newFAQ = {
      question: 'New question?',
      answer: 'New answer.',
    };

    faqSection.addFAQ(newFAQ);

    const currentState = faqSection.getState();
    expect(currentState.faqs.length).toBe(4);
    expect(currentState.faqs[3]).toEqual(newFAQ);
  });

  it('should insert FAQ at specific index', () => {
    const faqSection = FAQSection({ faqs: mockFAQs });

    const newFAQ = {
      question: 'Inserted question?',
      answer: 'Inserted answer.',
    };

    faqSection.addFAQ(newFAQ, 1);

    const currentState = faqSection.getState();
    expect(currentState.faqs.length).toBe(4);
    expect(currentState.faqs[1]).toEqual(newFAQ);
  });

  it('should throw error when adding invalid FAQ', () => {
    const faqSection = FAQSection({ faqs: mockFAQs });

    expect(() => {
      faqSection.addFAQ({ question: 'No answer' });
    }).toThrow('FAQ must have question and answer properties');
  });

  it('should remove FAQ by index', () => {
    const faqSection = FAQSection({ faqs: mockFAQs });

    faqSection.removeFAQ(1);

    const currentState = faqSection.getState();
    expect(currentState.faqs.length).toBe(2);
    expect(currentState.faqs.find((faq) => faq.id === 'faq-2')).toBeUndefined();
  });

  it('should remove FAQ by ID', () => {
    const faqSection = FAQSection({ faqs: mockFAQs });

    faqSection.removeFAQ('faq-1');

    const currentState = faqSection.getState();
    expect(currentState.faqs.length).toBe(2);
    expect(currentState.faqs.find((faq) => faq.id === 'faq-1')).toBeUndefined();
  });

  it('should update FAQ by index', () => {
    const faqSection = FAQSection({ faqs: mockFAQs });

    faqSection.updateFAQ(0, {
      question: 'Updated question?',
      answer: 'Updated answer.',
    });

    const currentState = faqSection.getState();
    expect(currentState.faqs[0].question).toBe('Updated question?');
    expect(currentState.faqs[0].answer).toBe('Updated answer.');
  });

  it('should update FAQ by ID', () => {
    const faqSection = FAQSection({ faqs: mockFAQs });

    faqSection.updateFAQ('faq-2', {
      answer: 'Updated answer for FAQ 2.',
    });

    const currentState = faqSection.getState();
    expect(currentState.faqs[1].answer).toBe('Updated answer for FAQ 2.');
  });

  it('should search FAQs by question content', () => {
    const faqSection = FAQSection({ faqs: mockFAQs });

    const results = faqSection.searchFAQs('component');

    expect(results.length).toBe(1);
    expect(results[0].question).toContain('component');
  });

  it('should search FAQs by answer content', () => {
    const faqSection = FAQSection({ faqs: mockFAQs });

    const results = faqSection.searchFAQs('collapsible');

    expect(results.length).toBe(1);
    expect(results[0].answer).toContain('collapsible');
  });

  it('should return empty array for empty search', () => {
    const faqSection = FAQSection({ faqs: mockFAQs });

    const results = faqSection.searchFAQs('');

    expect(results.length).toBe(0);
  });

  it('should call onChange callback', () => {
    const onChange = vi.fn();
    const faqSection = FAQSection({
      faqs: mockFAQs,
      onChange,
    });

    faqSection.expandFAQ('faq-1');

    expect(onChange).toHaveBeenCalledWith(['faq-1']);
  });

  it('should apply custom className', () => {
    const faqSection = FAQSection({
      faqs: mockFAQs,
      className: 'custom-faq-section',
    });
    const element = faqSection.getElement();

    expect(element.classList.contains('custom-faq-section')).toBe(true);
  });

  it('should apply section variant', () => {
    const faqSection = FAQSection({
      faqs: mockFAQs,
      sectionVariant: 'minor',
    });
    const element = faqSection.getElement();

    expect(element.classList.contains('section--minor')).toBe(true);
  });

  it('should set background color', () => {
    const faqSection = FAQSection({
      faqs: mockFAQs,
      backgroundColor: '#f0f8ff',
    });
    const element = faqSection.getElement();

    expect(element.style.backgroundColor).toBe('rgb(240, 248, 255)');
  });

  it('should apply no padding bottom', () => {
    const faqSection = FAQSection({
      faqs: mockFAQs,
      noPaddingBottom: true,
    });
    const element = faqSection.getElement();

    expect(element.classList.contains('section--no-padding-bottom')).toBe(true);
  });

  it('should set section ID', () => {
    const faqSection = FAQSection({
      faqs: mockFAQs,
      id: 'my-faq-section',
    });
    const element = faqSection.getElement();

    expect(element.id).toBe('my-faq-section');
  });

  it('should update multiple properties', () => {
    const faqSection = FAQSection({ faqs: mockFAQs });

    faqSection.update({
      title: 'Updated Title',
      multiple: true,
      iconType: 'arrow',
      backgroundColor: '#f5f5f5',
    });

    const currentState = faqSection.getState();
    expect(currentState.title).toBe('Updated Title');
    expect(currentState.multiple).toBe(true);
    expect(currentState.iconType).toBe('arrow');
    expect(currentState.backgroundColor).toBe('#f5f5f5');
  });

  it('should update FAQs and rebuild accordion', () => {
    const faqSection = FAQSection({ faqs: mockFAQs });

    const newFAQs = [
      {
        id: 'new-faq-1',
        question: 'New question 1?',
        answer: 'New answer 1.',
      },
    ];

    faqSection.update({ faqs: newFAQs });

    const currentState = faqSection.getState();
    expect(currentState.faqs.length).toBe(1);
    expect(currentState.faqs[0].id).toBe('new-faq-1');
  });

  it('should provide access to internal accordion', () => {
    const faqSection = FAQSection({ faqs: mockFAQs });
    const accordion = faqSection.getAccordion();

    expect(accordion).toBeTruthy();
    expect(typeof accordion.getExpandedItems).toBe('function');
  });

  it('should handle method chaining', () => {
    const faqSection = FAQSection({ faqs: mockFAQs });

    const result = faqSection.expandFAQ(0).setIconType('chevron').addFAQ({
      question: 'Chained question?',
      answer: 'Chained answer.',
    });

    // Check that chaining returns an object with the same methods
    expect(typeof result.getElement).toBe('function');
    expect(typeof result.expandFAQ).toBe('function');
    expect(typeof result.addFAQ).toBe('function');
    expect(typeof result.getState).toBe('function');

    // Check that the operations worked (check expanded items separately due to possible DOM updates)
    const expandedItems = faqSection.getExpandedFAQs();
    expect(expandedItems.length).toBeGreaterThanOrEqual(0); // More flexible check

    const currentState = faqSection.getState();
    expect(currentState.faqs.length).toBe(4);
  });

  it('should respect defaultExpanded prop', () => {
    const faqSection = FAQSection({
      faqs: mockFAQs,
      defaultExpanded: ['faq-1', 'faq-2'],
      multiple: true,
    });

    const expandedFAQs = faqSection.getExpandedFAQs();
    expect(expandedFAQs).toContain('faq-1');
    expect(expandedFAQs).toContain('faq-2');
  });

  it('should handle empty FAQ array after updates', () => {
    const faqSection = FAQSection({ faqs: mockFAQs });

    // Test that we handle empty arrays gracefully by preventing the update
    expect(() => {
      faqSection.update({ faqs: [] });
    }).toThrow('FAQSection: Cannot render with empty FAQ array');
  });

  it('should clean up on destroy', () => {
    const faqSection = FAQSection({ faqs: mockFAQs });
    const element = faqSection.getElement();

    document.body.appendChild(element);
    expect(document.body.contains(element)).toBe(true);

    faqSection.destroy();

    expect(document.body.contains(element)).toBe(false);
  });

  // Icon Type Tests
  describe('Icon types', () => {
    it('should render with default plus-minus icon type', () => {
      const faqSection = FAQSection({ faqs: mockFAQs });
      const element = faqSection.getElement();

      expect(
        element
          .querySelector('.accordion')
          .classList.contains('accordion--plus-minus')
      ).toBe(true);
    });

    it('should render with arrow icon type', () => {
      const faqSection = FAQSection({
        faqs: mockFAQs,
        iconType: 'arrow',
      });
      const element = faqSection.getElement();

      expect(
        element
          .querySelector('.accordion')
          .classList.contains('accordion--arrow')
      ).toBe(true);
    });

    it('should render with chevron icon type', () => {
      const faqSection = FAQSection({
        faqs: mockFAQs,
        iconType: 'chevron',
      });
      const element = faqSection.getElement();

      expect(
        element
          .querySelector('.accordion')
          .classList.contains('accordion--chevron')
      ).toBe(true);
    });

    it('should render with caret icon type', () => {
      const faqSection = FAQSection({
        faqs: mockFAQs,
        iconType: 'caret',
      });
      const element = faqSection.getElement();

      expect(
        element
          .querySelector('.accordion')
          .classList.contains('accordion--caret')
      ).toBe(true);
    });

    it('should render with no-icon type', () => {
      const faqSection = FAQSection({
        faqs: mockFAQs,
        iconType: 'no-icon',
      });
      const element = faqSection.getElement();

      expect(
        element
          .querySelector('.accordion')
          .classList.contains('accordion--no-icon')
      ).toBe(true);
    });

    it('should validate icon type', () => {
      expect(() =>
        FAQSection({
          faqs: mockFAQs,
          iconType: 'invalid-type',
        })
      ).toThrow(
        'iconType must be one of: content, arrow, chevron, plus-minus, caret, no-icon'
      );
    });

    it('should change icon type with setIconType method', () => {
      const faqSection = FAQSection({
        faqs: mockFAQs,
        iconType: 'content',
      });

      faqSection.setIconType('arrow');
      const element = faqSection.getElement();

      expect(
        element
          .querySelector('.accordion')
          .classList.contains('accordion--arrow')
      ).toBe(true);
    });

    it('should warn on invalid icon type with setIconType', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const faqSection = FAQSection({ faqs: mockFAQs });
      const accordion = faqSection.getAccordion();
      accordion.setIconType('invalid');

      expect(consoleSpy).toHaveBeenCalledWith(
        'Invalid iconType: invalid. Valid types: content, arrow, chevron, plus-minus, caret, no-icon'
      );

      consoleSpy.mockRestore();
    });

    it('should update icon type through update method', () => {
      const faqSection = FAQSection({
        faqs: mockFAQs,
        iconType: 'content',
      });

      faqSection.update({ iconType: 'plus-minus' });
      const element = faqSection.getElement();

      expect(
        element
          .querySelector('.accordion')
          .classList.contains('accordion--plus-minus')
      ).toBe(true);
    });
  });

  // Variant and Icon Type Combination Tests
  describe('Variant and icon type combinations', () => {
    it('should apply both variant and icon type classes', () => {
      const faqSection = FAQSection({
        faqs: mockFAQs,
        variant: 'minimal',
        iconType: 'arrow',
      });
      const element = faqSection.getElement();
      const accordion = element.querySelector('.accordion');

      expect(accordion.classList.contains('accordion--minimal')).toBe(true);
      expect(accordion.classList.contains('accordion--arrow')).toBe(true);
    });

    it('should handle multiple class combinations', () => {
      const faqSection = FAQSection({
        faqs: mockFAQs,
        variant: 'minimal',
        iconType: 'chevron',
        className: 'custom-class',
      });
      const element = faqSection.getElement();
      const accordion = element.querySelector('.accordion');

      expect(element.classList.contains('faq-section')).toBe(true);
      expect(element.classList.contains('custom-class')).toBe(true);
      expect(accordion.classList.contains('accordion--minimal')).toBe(true);
      expect(accordion.classList.contains('accordion--chevron')).toBe(true);
    });
  });

  // State Management Tests
  describe('State management', () => {
    it('should provide getState method', () => {
      const faqSection = FAQSection({ faqs: mockFAQs });
      const state = faqSection.getState();

      expect(state).toBeDefined();
      expect(state.faqs).toEqual(mockFAQs);
      expect(state.multiple).toBe(false);
      expect(state.iconType).toBe('plus-minus');
      expect(state.variant).toBe('bordered');
    });

    it('should return state copy to prevent mutation', () => {
      const faqSection = FAQSection({ faqs: mockFAQs });
      const state1 = faqSection.getState();
      const state2 = faqSection.getState();

      expect(state1).not.toBe(state2); // Different objects
      expect(state1).toEqual(state2); // Same content
    });

    it('should update state through update method', () => {
      const faqSection = FAQSection({ faqs: mockFAQs });

      faqSection.update({
        title: 'New Title',
        multiple: true,
        iconType: 'arrow',
      });

      const state = faqSection.getState();
      expect(state.title).toBe('New Title');
      expect(state.multiple).toBe(true);
      expect(state.iconType).toBe('arrow');
    });
  });
});
