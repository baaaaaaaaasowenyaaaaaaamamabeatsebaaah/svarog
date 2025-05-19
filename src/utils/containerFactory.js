// src/utils/containerFactory.js
import { Component } from './componentFactory.js';

/**
 * Base Container class to handle component state and logic
 * @extends Component
 */
export class Container extends Component {
  /**
   * Create a new Container
   * @param {Object} options - Container options
   * @param {Function} options.PresentationalComponent - Presentational component class
   * @param {Object} [options.initialState={}] - Initial state
   * @param {Object} [options.props={}] - Props to pass to presentational component
   */
  constructor({ PresentationalComponent, initialState = {}, props = {} }) {
    super();

    if (!PresentationalComponent) {
      throw new Error('Container requires a PresentationalComponent');
    }

    this.PresentationalComponent = PresentationalComponent;
    this.props = props;

    // Initialize state
    this._state = { ...initialState };

    // Create presentational component instance
    this.presentational = this._createPresentationalComponent();

    // Bind event handlers
    this._bindEventHandlers();
  }

  /**
   * Create the presentational component with current props and state
   * @private
   * @returns {Component} Presentational component instance
   */
  _createPresentationalComponent() {
    // Merge props and state into presentational component props
    const presentationalProps = {
      ...this.props,
      ...this._getPresentationalPropsFromState(),
      // Add container callbacks
      container: this,
    };

    return new this.PresentationalComponent(presentationalProps);
  }

  /**
   * Transform container state to presentational props
   * Override this method in subclasses
   * @private
   * @returns {Object} Props derived from state
   */
  _getPresentationalPropsFromState() {
    // Default implementation passes state directly as props
    // Override this method to transform state to props
    return { ...this._state };
  }

  /**
   * Bind event handlers
   * Override this method in subclasses
   * @private
   */
  _bindEventHandlers() {
    // To be implemented by subclasses
  }

  /**
   * Update the presentational component after state changes
   * @private
   */
  _updatePresentational() {
    // Get updated props
    const presentationalProps = {
      ...this.props,
      ...this._getPresentationalPropsFromState(),
      container: this,
    };

    // Update the presentational component
    if (this.presentational.update) {
      this.presentational.update(presentationalProps);
    } else {
      // If no update method, recreate the component
      const element = this.getElement();
      const parent = element.parentNode;

      // Create new presentational component
      this.presentational = this._createPresentationalComponent();

      // Replace element if mounted
      if (parent) {
        parent.replaceChild(this.presentational.getElement(), element);
      }
    }
  }

  /**
   * Set state and update presentational component
   * @override
   * @param {Object|Function} newState - New state object or updater function
   * @param {Function} [callback] - Optional callback after state update
   */
  setState(newState, callback) {
    super.setState(newState, (updatedState, prevState) => {
      // Update presentational component
      this._updatePresentational();

      // Call original callback if provided
      if (typeof callback === 'function') {
        callback(updatedState, prevState);
      }
    });
  }

  /**
   * Get the container's element (delegates to presentational component)
   * @override
   * @returns {HTMLElement} Component element
   */
  getElement() {
    return this.presentational.getElement();
  }

  /**
   * Destroy the container and its presentational component
   * @override
   */
  destroy() {
    if (this.presentational.destroy) {
      this.presentational.destroy();
    }
    super.destroy();
  }
}

/**
 * Create a container factory for a specific presentational component
 * @param {string} name - Container name
 * @param {Function} PresentationalComponent - Presentational component class
 * @returns {Function} Container factory function
 */
export function createContainerFactory(name, PresentationalComponent) {
  return (props = {}) => {
    return new Container({
      PresentationalComponent,
      props,
    });
  };
}
