/**
 * @file Main library entry point for Svarog UI Core
 * @description Provides both individual and categorized component exports
 * Auto-injects base styles when imported
 */

// Auto-inject base styles when core is imported
import './styles/baseStyles.js';

// Re-export all components and utilities from main index
export * from '../../../src/index.js';
