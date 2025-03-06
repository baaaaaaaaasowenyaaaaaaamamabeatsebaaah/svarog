// src/components/Radio/Radio.js
import './Radio.css';
import { Component } from '../../utils/componentFactory.js';

/**
 * Radio component
 * @extends Component
 */
export default class Radio extends Component {
  /**
   * Creates a new Radio instance
   *
   * @param {Object} props - Radio properties
   * @param {string} props.label - Radio label
   * @param {string} props.value - Radio value
   * @param {string} [props.id] - Radio id
   * @param {string} [props.name] - Radio name
   * @param {boolean} [props.checked=false] - Whether the radio is checked
   * @param {boolean} [props.required=false] - Whether the radio is required
   * @param {boolean} [props.disabled=false] - Whether the radio is disabled
   * @param {string} [props.className=''] - Additional CSS class names
   * @param {Function} [props.onChange] - Change event handler
   */
  constructor({
    label,
    value,
    id,
    name,
    checked = false,
    required = false,
    disabled = false,
    className = '',
    onChange,
  }) {
    super();

    // Validation
    if (!label) {
      throw new Error('Radio: label is required');
    }

    if (value === undefined || value === null) {
      throw new Error('Radio: value is required');
    }

    // Store props
    this.props = {
      label,
      value,
      id,
      name,
      checked,
      required,
      disabled,
      className,
      onChange,
    };

    // Create element
    this.container = this.createRadioContainer();
  }

  /**
   * Creates the radio container
   * @private
   * @returns {HTMLElement} The radio container element
   */
  createRadioContainer() {
    // Create container div
    const container = this.createElement('div', {
      className: this.createClassNames('radio-container', this.props.className),
    });

    // Create the radio wrapper
    const wrapper = this.createElement('label', {
      className: 'radio-wrapper',
    });

    // Create the actual radio input
    const input = this.createRadioInput();

    // Create custom radio indicator
    const indicator = this.createElement('span', {
      className: 'radio-indicator',
    });

    // Create label text
    const labelText = this.createElement('span', {
      className: 'radio-label',
      textContent: this.props.label,
    });

    // Assemble the component
    wrapper.appendChild(input);
    wrapper.appendChild(indicator);
    wrapper.appendChild(labelText);
    container.appendChild(wrapper);

    // Store reference to the input element
    this.input = input;

    return container;
  }

  /**
   * Creates the radio input element
   * @private
   * @returns {HTMLInputElement} The radio input element
   */
  createRadioInput() {
    const { value, id, name, checked, required, disabled } = this.props;

    // Create attributes object with only defined properties
    const attributes = {};
    if (id) attributes.id = id;
    if (name) attributes.name = name;
    if (value !== undefined) attributes.value = value;
    if (required) attributes.required = required;

    // Create input element
    const input = this.createElement('input', {
      className: 'radio-input',
      attributes: {
        type: 'radio',
        ...attributes,
      },
      events: {
        change: this.handleChange.bind(this),
      },
    });

    // Set properties that can't be set via attributes
    input.checked = checked;
    if (disabled) input.disabled = true;

    return input;
  }

  /**
   * Handles change events
   * @private
   * @param {Event} event - The change event
   */
  handleChange(event) {
    // Update internal state
    this.props.checked = event.target.checked;

    // Call onChange callback if provided
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(event, this.getValue());
    }
  }

  /**
   * Gets the radio value
   * @returns {string} The radio value
   */
  getValue() {
    return this.props.value;
  }

  /**
   * Checks if the radio is checked
   * @returns {boolean} Whether the radio is checked
   */
  isChecked() {
    return this.props.checked;
  }

  /**
   * Sets the checked state
   * @param {boolean} checked - The new checked state
   */
  setChecked(checked) {
    this.props.checked = checked;
    this.input.checked = checked;
    return this;
  }

  /**
   * Gets the radio element
   * @returns {HTMLElement} The radio container element
   */
  getElement() {
    return this.container;
  }
}
