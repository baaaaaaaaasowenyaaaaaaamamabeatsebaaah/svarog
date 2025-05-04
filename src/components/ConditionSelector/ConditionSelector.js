// src/components/ConditionSelector/ConditionSelector.js
import './ConditionSelector.css';
import { Component } from '../../utils/componentFactory.js';

/**
 * ConditionSelector component for displaying and selecting device conditions
 * @extends Component
 */
export default class ConditionSelector extends Component {
  /**
   * Creates a new ConditionSelector instance
   *
   * @param {Object} props - ConditionSelector properties
   * @param {Array} props.conditions - Array of condition objects
   * @param {Function} props.onSelect - Callback when a condition is selected
   * @param {string} [props.selectedId] - ID of the currently selected condition
   * @param {boolean} [props.isLoading=false] - Whether the component is in loading state
   * @param {string} [props.className=''] - Additional CSS class names
   */
  constructor({
    conditions = [],
    onSelect,
    selectedId = '',
    isLoading = false,
    className = '',
  }) {
    super();

    // Store props
    this.props = {
      conditions,
      onSelect,
      selectedId,
      isLoading,
      className,
    };

    this.element = this.createConditionSelector();
  }

  /**
   * Creates the condition selector element
   * @private
   * @returns {HTMLElement} The condition selector element
   */
  createConditionSelector() {
    const { conditions, selectedId, isLoading, className } = this.props;

    // Create container
    const container = this.createElement('div', {
      className: this.createClassNames('condition-selector', className, {
        'condition-selector--loading': isLoading,
      }),
    });

    // If there are no conditions, show a message or return empty container
    if (!conditions.length) {
      return container;
    }

    // Condition options container
    const optionsContainer = this.createElement('div', {
      className: 'condition-options',
    });

    // Create condition options
    conditions.forEach((condition) => {
      const option = this.createConditionOption(condition, selectedId);
      optionsContainer.appendChild(option);
    });

    container.appendChild(optionsContainer);
    return container;
  }

  /**
   * Creates a single condition option
   * @private
   * @param {Object} condition - Condition data
   * @param {string} selectedId - Currently selected condition ID
   * @returns {HTMLElement} The condition option element
   */
  createConditionOption(condition, selectedId) {
    const isSelected = condition.id.toString() === selectedId.toString();

    // Create option container
    const optionContainer = this.createElement('div', {
      className: this.createClassNames('condition-option', {
        'condition-option--selected': isSelected,
      }),
      attributes: {
        'data-condition-id': condition.id.toString(),
      },
    });

    // Create radio input
    const radioInput = this.createElement('input', {
      attributes: {
        type: 'radio',
        name: 'condition',
        value: condition.id.toString(),
      },
      checked: isSelected,
    });

    // Create label
    const optionLabel = this.createElement('label', {
      className: 'condition-option__label',
      events: {
        click: () => this.handleConditionSelect(condition.id),
      },
    });

    // Create icon
    const icon = this.createElement('span', {
      className: 'condition-option__icon',
      textContent: this.getConditionIcon(condition.name),
    });

    // Create content container
    const content = this.createElement('div', {
      className: 'condition-option__content',
    });

    // Create title
    const title = this.createElement('div', {
      className: 'condition-option__title',
      textContent: condition.name,
    });

    // Create description
    const description = this.createElement('div', {
      className: 'condition-option__description',
      textContent: condition.description || '',
    });

    // Assemble the elements
    content.appendChild(title);
    content.appendChild(description);
    optionLabel.appendChild(icon);
    optionLabel.appendChild(content);
    optionContainer.appendChild(radioInput);
    optionContainer.appendChild(optionLabel);

    return optionContainer;
  }

  /**
   * Get an icon for a condition based on its name
   * @private
   * @param {string} conditionName - Name of the condition
   * @returns {string} Icon representation
   */
  getConditionIcon(conditionName) {
    const lowerName = conditionName.toLowerCase();

    if (lowerName.includes('new') || lowerName.includes('neu')) {
      return '✨';
    } else if (lowerName.includes('good') || lowerName.includes('gut')) {
      return '👍';
    } else if (lowerName.includes('fair') || lowerName.includes('akzeptabel')) {
      return '👌';
    } else if (lowerName.includes('poor') || lowerName.includes('schlecht')) {
      return '🔧';
    }

    return '📱';
  }

  /**
   * Handles condition selection
   * @private
   * @param {string|number} conditionId - Selected condition ID
   */
  handleConditionSelect(conditionId) {
    if (this.props.isLoading || !this.props.onSelect) {
      return;
    }

    // Update selected state
    this.props.selectedId = conditionId.toString();
    this.updateSelectedState();

    // Call onSelect callback
    this.props.onSelect(conditionId);
  }

  /**
   * Updates the selected state in the DOM
   * @private
   */
  updateSelectedState() {
    const { selectedId } = this.props;

    // Find all option containers
    const options = this.element.querySelectorAll('.condition-option');

    // Update selected state
    options.forEach((option) => {
      const id = option.getAttribute('data-condition-id');
      const isSelected = id === selectedId;

      // Update class
      option.classList.toggle('condition-option--selected', isSelected);

      // Update radio button
      const radio = option.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = isSelected;
      }
    });
  }

  /**
   * Set loading state
   * @param {boolean} isLoading - New loading state
   */
  setLoading(isLoading) {
    this.props.isLoading = isLoading;
    this.element.classList.toggle('condition-selector--loading', isLoading);
    return this;
  }

  /**
   * Update conditions
   * @param {Array} conditions - New conditions array
   * @param {string} [selectedId=''] - New selected condition ID
   */
  updateConditions(conditions = [], selectedId = '') {
    this.props.conditions = conditions;
    this.props.selectedId = selectedId;

    // Replace the current element with a new one
    const newElement = this.createConditionSelector();

    if (this.element.parentNode) {
      this.element.parentNode.replaceChild(newElement, this.element);
    }

    this.element = newElement;
    return this;
  }

  /**
   * Set selected condition
   * @param {string|number} conditionId - Selected condition ID
   */
  setSelectedCondition(conditionId) {
    this.props.selectedId = conditionId.toString();
    this.updateSelectedState();
    return this;
  }

  /**
   * Gets the condition selector element
   * @returns {HTMLElement} The condition selector element
   */
  getElement() {
    return this.element;
  }
}
