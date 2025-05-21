# Svarog Component Library

A lightweight, highly optimized vanilla JavaScript component library with powerful theming capabilities. Built with performance, maintainability, and flexibility in mind - **all with zero external dependencies**.

## Features

- 🔍 **Zero Dependencies** - Pure JavaScript with no external runtime dependencies
- 🎨 **Powerful Theming** - Comprehensive CSS variable-based theming system
- 🧱 **Factory Pattern** - Consistent component API using factory functions
- 🚀 **Performance Optimized** - Event delegation, DOM batching, and more
- ♿ **Accessible** - Follows accessibility best practices
- 🧪 **Well Tested** - Comprehensive test coverage with Vitest
- 📚 **Custom Component Explorer** - Built-in Storybook-like viewer developed from scratch in vanilla JS

## Installation

```bash
npm install svarog-ui
```

## Quick Start

```javascript
import { Button, Typography, Card, switchTheme } from 'svarog-ui';

// Create a button component
const button = Button({
  text: 'Click Me',
  variant: 'primary',
  onClick: () => console.log('Button clicked'),
});

// Add it to the DOM
document.body.appendChild(button.getElement());

// Switch themes dynamically
switchTheme('cabalou');
```

## Component API Pattern

All components follow a consistent API pattern:

```javascript
const component = Component({
  // Component configuration props
});

// Get the DOM element to insert into the document
const element = component.getElement();

// Update component properties after creation
component.update({
  // New properties
});

// Clean up when removing the component
component.destroy();
```

## Component Categories

Svarog includes a comprehensive set of components organized by category:

### Layout

- Grid - Flexible grid system
- Section - Content section with variants
- Card - Content container with theming

### UI Elements

- Button - Buttons with variants and states
- Typography - Text components with consistent styling
- Link - Enhanced anchor elements

### Form

- Input - Text input fields
- Select - Dropdown selection
- Checkbox - Checkbox inputs
- Radio - Radio button inputs
- Form - Form layout container

### Navigation

- Navigation - Responsive navigation menu
- Pagination - Page navigation controls
- Tabs - Tabbed interface

### Media

- Image - Responsive image component
- Logo - Brand logo component
- Map - Map integration

### Page Structure

- Header - Page header component
- Footer - Page footer component
- Hero - Hero banner section

## Theming System

Svarog includes a powerful theming system with three built-in themes: `default`, `cabalou`, and `muchandy`.

```javascript
import { switchTheme, getCurrentTheme, setThemeVariable } from 'svarog-ui';

// Switch to a different theme
switchTheme('cabalou');

// Get the current theme
const theme = getCurrentTheme();

// Override a specific theme variable
setThemeVariable('--button-bg', '#ff0000');
```

Themes are built with CSS variables, making them easy to extend and customize.

## Development Setup

```bash
# Clone the repository
git clone https://github.com/your-username/svarog.git
cd svarog

# Install dependencies
npm install

# Start development server with component viewer
npm start

# Run tests
npm test

# Build for production
npm run build
```

## Project Structure

```
svarog/
├── .storybook/       # Component viewer configuration
├── docs/             # Additional documentation
├── src/
│   ├── components/   # UI components
│   │   └── ComponentName/
│   │       ├── ComponentName.js
│   │       ├── ComponentName.css
│   │       ├── ComponentName.stories.js
│   │       ├── ComponentName.test.js
│   │       ├── index.js
│   │       └── README.md
│   ├── constants/    # Shared constants
│   ├── styles/       # Theme system
│   │   ├── base/     # Base styles
│   │   └── themes/   # Theme definitions
│   └── utils/        # Utility functions
├── scripts/          # Build and maintenance scripts
└── tests/            # Testing utilities
```

## Component Design Principles

All Svarog components adhere to these principles:

1. **Factory Functions** - Components use factory functions for creation
2. **Consistent API** - All components have getElement(), update(), and destroy() methods
3. **DOM Efficiency** - Minimizes DOM operations for better performance
4. **Event Delegation** - Uses event delegation for improved performance
5. **Memory Management** - Cleans up listeners and references in destroy()
6. **Validation** - Properly validates inputs with helpful error messages
7. **Accessibility** - Uses semantic markup and ARIA attributes
8. **Theming** - Uses CSS variables for consistent theming

## Creating a Component

Components follow this pattern:

```javascript
// src/components/MyComponent/MyComponent.js
import './MyComponent.css';
import {
  createComponent,
  createElement,
} from '../../utils/componentFactory.js';

const createMyComponent = (props) => {
  // Validate required props
  validateProps(props, createMyComponent.requiredProps);

  // Initial state
  const state = { ...props };

  // Render function
  const render = () => {
    const element = createElement('div', {
      classes: ['my-component'],
      // Add attributes, event handlers, etc.
    });

    return element;
  };

  // Create initial element
  let element = render();

  // Return public API
  return {
    getElement() {
      return element;
    },

    update(newProps) {
      Object.assign(state, newProps);
      const oldElement = element;
      element = render();

      if (oldElement.parentNode) {
        oldElement.parentNode.replaceChild(element, oldElement);
      }

      return this;
    },

    destroy() {
      // Clean up event listeners and resources
    },
  };
};

// Define required props
createMyComponent.requiredProps = ['prop1', 'prop2'];

// Export as a factory function
export default createComponent('MyComponent', createMyComponent);
```

## Performance Utilities

Svarog includes several performance optimization utilities:

- `debounce` - Limit function call frequency
- `throttle` - Restrict execution rate
- `rafThrottle` - Animation frame-based throttling
- `memoize` - Cache function results
- `batchDomUpdates` - Batch DOM operations

## Contributing

Contributions are welcome and appreciated! This project adheres to specific coding standards and practices that help maintain the library's quality and consistency.

### Development Workflow

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/svarog.git`
3. Create a feature branch: `git checkout -b feature/amazing-feature`
4. Install dependencies: `npm install`
5. Make your changes following our guidelines below
6. Test your changes: `npm test`
7. Commit with a descriptive message: `git commit -m 'Add some amazing feature'`
8. Push to your branch: `git push origin feature/amazing-feature`
9. Open a pull request with a detailed description

### Code Standards

- **Factory Functions**: Use factory functions instead of classes
- **Code Conciseness**: Write minimal code without sacrificing functionality
- **No Unused Variables**: Eliminate all unused variables and functions
- **Single Responsibility**: Functions should do one thing well
- **Component API**: Follow the standard `getElement()`, `update()`, `destroy()` pattern
- **Documentation**: Document "why" not just "what"
- **Error Handling**: Include proper validation and error messages
- **Theming**: Use CSS variables for all themeable properties

### Creating Components

New components should:

1. Follow the directory structure in `src/components/ComponentName/`
2. Include all required files:
   - `ComponentName.js` - Component implementation
   - `ComponentName.css` - Component styles
   - `ComponentName.stories.js` - Example stories
   - `ComponentName.test.js` - Unit tests
   - `index.js` - Export file
   - `README.md` - Component documentation

Use the component generator to scaffold a new component:

```bash
npm run create-component MyComponentName
```

### Testing Requirements

- All components must have unit tests
- Tests should cover:
  - Basic rendering
  - Props validation
  - Event handling
  - Update method
  - Destroy method
- Run tests before submitting: `npm test`
- Maintain or improve code coverage

### Documentation Standards

- Document all public methods with JSDoc comments
- Focus on explaining "why" rather than "what"
- Include usage examples in component README.md
- Document theme variables used by the component

### Pull Request Process

1. Ensure all tests pass
2. Update documentation if needed
3. Add stories for new features
4. Request review from at least one maintainer
5. Address review feedback promptly

By following these guidelines, you help maintain the quality and consistency of the Svarog Component Library. Thank you for your contributions!

## License

ISC
