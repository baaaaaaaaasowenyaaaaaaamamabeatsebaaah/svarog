# Svarog Component Library

Svarog is a lightweight, vanilla JavaScript component library with built-in theme support. It provides reusable UI components for web applications without any framework dependencies.

## Features

- 🛠️ **Pure JavaScript** - No framework dependencies
- 🎨 **Theme System** - Multiple themes with CSS variables
- 📱 **Responsive** - Mobile-friendly components
- 🧪 **Tested** - Comprehensive test coverage
- 📚 **Component Viewer** - Built-in Storybook-like component explorer

## Getting Started

### Installation

```bash
npm install @baaaaaaaaasowenyaaaaaaamamabeatsebaaah/svarog
```

### Usage

```javascript
import { Button } from '@baaaaaaaaasowenyaaaaaaamamabeatsebaaah/svarog';

// Create a button
const myButton = new Button({
  text: 'Click Me',
  onClick: () => alert('Button clicked!'),
});

// Add the button to the DOM
document.body.appendChild(myButton.getElement());
```

### Using Themes

Svarog includes a powerful theme system:

```javascript
import { switchTheme } from '@baaaaaaaaasowenyaaaaaaamamabeatsebaaah/svarog';

// Switch to the cabalou theme
switchTheme('cabalou');

// Switch back to the default theme
switchTheme('default');
```

## Available Components

Svarog currently provides the following components:

- **Button** - Standard button with variants
- **Card** - Container for content with optional image, title, and footer
- **Grid** - Responsive grid layout system
- **Link** - Enhanced anchor elements
- **Logo** - SVG logo container
- **Navigation** - Navigation menu with responsive support
- **Section** - Content section container
- **Typography** - Text components with consistent styling

## Development

### Prerequisites

- Node.js (v20 or later)
- npm

### Setup

```bash
# Clone the repository
git clone https://github.com/baaaaaaaaasowenyaaaaaaamamabeatsebaaah/svarog.git
cd svarog

# Install dependencies
npm install
```

### Development Workflow

```bash
# Start the development server with component viewer
npm start

# Run tests
npm test

# Build for production
npm run build

# Create a new component
npm run create-component ComponentName
```

### Project Structure

```
svarog/
├── .storybook/       # Component viewer setup
├── docs/             # Documentation
├── public/           # Static assets
├── scripts/          # Build scripts
├── src/
│   ├── components/   # UI components
│   ├── constants/    # Constants and enums
│   ├── styles/       # CSS styles and themes
│   └── utils/        # Utility functions
└── tests/            # Test helpers
```

## Component Design Principles

All Svarog components follow these principles:

1. **Self-contained** - Each component includes its own CSS and tests
2. **Accessible** - Components follow accessibility best practices
3. **Themeable** - Styling is based on CSS variables for easy theming
4. **Extensible** - Components can be customized through props
5. **Predictable** - Consistent API across all components

## Creating Custom Components

Use our component generator to create new components:

```bash
npm run create-component MyComponent
```

This creates a new component with the standard structure:

```
src/components/MyComponent/
├── MyComponent.js        # Component implementation
├── MyComponent.css       # Component styles
├── MyComponent.stories.js # Component examples
└── MyComponent.test.js   # Component tests
```

## Theme System

Learn more about the theme system in [THEMES.md](docs/THEMES.md).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC
