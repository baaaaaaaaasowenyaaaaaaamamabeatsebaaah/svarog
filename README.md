# Svarog Component Library

## Getting Started

### Installation

```bash
npm install svarog
```

### Usage

```javascript
import { Button } from 'svarog';

const myButton = new Button({
  text: 'Click Me',
  onClick: () => alert('Button clicked!'),
});

document.body.appendChild(myButton.getElement());
```

### Contribution

#### Running the Project

```bash
npm start
```

#### Running Tests

```bash
npm test
```
