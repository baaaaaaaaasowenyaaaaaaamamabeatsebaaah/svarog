# Grid Component

The Grid component provides a flexible 12-column grid system for creating responsive layouts.

## Usage

```javascript
import { Grid } from '@svarog-ui/core';

// Create a grid
const grid = Grid({
  gap: '1rem',
});

// Create columns
const column1 = Grid.Column({
  width: 6, // 6/12 columns (half width)
  children: myElement1,
});

const column2 = Grid.Column({
  width: 6, // 6/12 columns (half width)
  children: myElement2,
});

// Add columns to grid
grid.appendChild(column1.getElement());
grid.appendChild(column2.getElement());

// Add grid to DOM
document.body.appendChild(grid.getElement());
```

## Grid Props

| Prop          | Type    | Default | Description                                                |
| ------------- | ------- | ------- | ---------------------------------------------------------- |
| gap           | string  | null    | Shorthand for both rowGap and columnGap (e.g., '1rem')     |
| rowGap        | string  | null    | Gap between rows (e.g., '1rem', '10px')                    |
| columnGap     | string  | null    | Gap between columns (e.g., '1rem', '10px')                 |
| alignItems    | string  | null    | Vertical alignment ('start', 'end', 'center', 'stretch')   |
| justifyItems  | string  | null    | Horizontal alignment ('start', 'end', 'center', 'stretch') |
| reverse       | boolean | false   | Reverses column order (RTL layout)                         |
| mobileReverse | boolean | false   | Reverses column order only on mobile devices               |

## Column Props

| Prop          | Type                         | Default  | Description                                           |
| ------------- | ---------------------------- | -------- | ----------------------------------------------------- |
| children      | HTMLElement or HTMLElement[] | Required | Content to display inside the column                  |
| width         | number                       | 12       | Column width (1-12) for all screen sizes              |
| mobileWidth   | number                       | null     | Column width (1-12) for mobile screens (<768px)       |
| tabletWidth   | number                       | null     | Column width (1-12) for tablet screens (768px-1023px) |
| desktopWidth  | number                       | null     | Column width (1-12) for desktop screens (≥1024px)     |
| offset        | number                       | null     | Number of columns to offset for all screen sizes      |
| desktopOffset | number                       | null     | Number of columns to offset for desktop screens       |

## Grid Methods

### getElement()

Returns the grid DOM element.

```javascript
const gridElement = grid.getElement();
```

### appendChild(child)

Appends a child element to the grid.

```javascript
grid.appendChild(columnElement);
```

### update(props)

Updates multiple grid properties at once.

```javascript
grid.update({
  gap: '2rem',
  alignItems: 'center',
});
```

### destroy()

Cleans up resources. Call when removing the grid.

```javascript
grid.destroy();
```

## Column Methods

### getElement()

Returns the column DOM element.

```javascript
const columnElement = column.getElement();
```

### update(props)

Updates multiple column properties at once.

```javascript
column.update({
  width: 4,
  mobileWidth: 12,
});
```

### destroy()

Cleans up resources. Call when removing the column.

```javascript
column.destroy();
```

## Responsive Behavior

The Grid component is fully responsive:

- Use `width` for default column width across all screen sizes
- Use `mobileWidth` to override width on mobile (<768px)
- Use `tabletWidth` to override width on tablets (768px-1023px)
- Use `desktopWidth` to override width on desktop (≥1024px)

Example of a responsive layout:

```javascript
const column = Grid.Column({
  width: 6, // 6/12 by default
  mobileWidth: 12, // 12/12 (full width) on mobile
  tabletWidth: 8, // 8/12 on tablets
  desktopWidth: 4, // 4/12 on large screens
  children: myElement,
});
```

## Examples

### Two-Column Layout

```javascript
const grid = Grid({ gap: '1rem' });

const column1 = Grid.Column({
  width: 6,
  children: myElement1,
});

const column2 = Grid.Column({
  width: 6,
  children: myElement2,
});

grid.appendChild(column1.getElement());
grid.appendChild(column2.getElement());
```

### Responsive Layout

```javascript
const grid = Grid({ gap: '1rem' });

const column1 = Grid.Column({
  width: 6,
  mobileWidth: 12, // Full width on mobile
  children: myElement1,
});

const column2 = Grid.Column({
  width: 6,
  mobileWidth: 12, // Full width on mobile
  children: myElement2,
});

grid.appendChild(column1.getElement());
grid.appendChild(column2.getElement());
```

### With Column Offsets

```javascript
const grid = Grid({ gap: '1rem' });

const column1 = Grid.Column({
  width: 4,
  children: myElement1,
});

const column2 = Grid.Column({
  width: 4,
  offset: 4, // Skip 4 columns
  children: myElement2,
});

grid.appendChild(column1.getElement());
grid.appendChild(column2.getElement());
```

### Nested Grids

```javascript
const outerGrid = Grid({ gap: '1rem' });

// Header row
const headerColumn = Grid.Column({
  width: 12,
  children: headerElement,
});

// Content row with nested grid
const nestedGrid = Grid({ gap: '0.5rem' });

const nestedColumn1 = Grid.Column({
  width: 6,
  children: contentElement1,
});

const nestedColumn2 = Grid.Column({
  width: 6,
  children: contentElement2,
});

nestedGrid.appendChild(nestedColumn1.getElement());
nestedGrid.appendChild(nestedColumn2.getElement());

const contentColumn = Grid.Column({
  width: 12,
  children: nestedGrid.getElement(),
});

// Footer row
const footerColumn = Grid.Column({
  width: 12,
  children: footerElement,
});

outerGrid.appendChild(headerColumn.getElement());
outerGrid.appendChild(contentColumn.getElement());
outerGrid.appendChild(footerColumn.getElement());
```

## Browser Support

The Grid component uses CSS Grid Layout and is compatible with:

- Chrome 57+
- Firefox 52+
- Safari 10.1+
- Edge 16+

For older browsers, consider using a CSS Grid polyfill or a fallback layout.

## Accessibility

The Grid component is designed with accessibility in mind:

- Maintains a logical source order in the HTML
- Preserves content flow even when visually reordered (with `reverse` option)
- Works with screen readers and other assistive technologies
