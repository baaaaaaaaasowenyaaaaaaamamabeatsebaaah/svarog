// src/utils/componentRegistry.js

/**
 * Registry for component instances
 */
class ComponentRegistry {
  constructor() {
    this.components = new Map();
    this.groups = new Map();
  }

  /**
   * Register a component
   * @param {string} id - Component ID
   * @param {Object} component - Component instance
   * @param {string} [group] - Optional group name
   * @returns {Function} Unregister function
   */
  register(id, component, group = null) {
    if (!id) {
      throw new Error('Component ID is required for registration');
    }

    // Store component by ID
    this.components.set(id, component);

    // Add to group if specified
    if (group) {
      if (!this.groups.has(group)) {
        this.groups.set(group, new Set());
      }
      this.groups.get(group).add(id);
    }

    // Return unregister function
    return () => this.unregister(id);
  }

  /**
   * Unregister a component
   * @param {string} id - Component ID
   */
  unregister(id) {
    // Remove from component map
    this.components.delete(id);

    // Remove from all groups
    this.groups.forEach((components, group) => {
      if (components.has(id)) {
        components.delete(id);

        // Clean up empty groups
        if (components.size === 0) {
          this.groups.delete(group);
        }
      }
    });
  }

  /**
   * Get a component by ID
   * @param {string} id - Component ID
   * @returns {Object|null} Component instance or null if not found
   */
  get(id) {
    return this.components.get(id) || null;
  }

  /**
   * Get all components in a group
   * @param {string} group - Group name
   * @returns {Array} Array of component instances
   */
  getGroup(group) {
    if (!this.groups.has(group)) {
      return [];
    }

    return Array.from(this.groups.get(group))
      .map((id) => this.components.get(id))
      .filter(Boolean);
  }

  /**
   * Get all component IDs
   * @returns {Array<string>} Array of component IDs
   */
  getAllIds() {
    return Array.from(this.components.keys());
  }

  /**
   * Get all registered groups
   * @returns {Array<string>} Array of group names
   */
  getAllGroups() {
    return Array.from(this.groups.keys());
  }

  /**
   * Clear all registrations
   */
  clear() {
    this.components.clear();
    this.groups.clear();
  }
}

// Export singleton instance
export const componentRegistry = new ComponentRegistry();

// Named exports for convenience
export const register = componentRegistry.register.bind(componentRegistry);
export const unregister = componentRegistry.unregister.bind(componentRegistry);
export const getComponent = componentRegistry.get.bind(componentRegistry);
export const getComponentGroup =
  componentRegistry.getGroup.bind(componentRegistry);
