# Pagination Component

The Pagination component provides navigation controls for paginated content with customizable page ranges and responsive design. **Styles are automatically injected** - no separate CSS imports required.

## Features

✅ **Zero Configuration** - Styles inject automatically  
✅ **SSR Compatible** - Works in Node.js environments  
✅ **Responsive Design** - Mobile-optimized navigation  
✅ **Accessibility Compliant** - Full ARIA support  
✅ **Tree Shakeable** - Only loads when used

## Usage

```javascript
import { Pagination } from '@svarog-ui/core';

// Create a pagination component - styles inject automatically
const pagination = Pagination({
  value: 1,
  totalPages: 10,
  onChange: (newPage) => {
    console.log(`Navigated to page ${newPage}`);
    // Update your content based on the new page
  },
});

// Add to DOM
document
  .querySelector('.pagination-container')
  .appendChild(pagination.getElement());

// Update properties
pagination.update({
  value: 2,
});

// Clean up when removing
pagination.destroy();
```

## Props

| Prop         | Type     | Default    | Description                                                 |
| ------------ | -------- | ---------- | ----------------------------------------------------------- |
| value        | number   | 1          | Current active page                                         |
| currentPage  | number   | 1          | Current active page (deprecated, use value instead)         |
| totalPages   | number   | 1          | Total number of pages                                       |
| onChange     | function | () => {}   | Callback called with the new page number when page changes  |
| onPageChange | function | () => {}   | Callback when page changes (deprecated, use onChange)       |
| siblingCount | number   | 1          | Number of page buttons to show on each side of current page |
| className    | string   | ''         | Additional CSS class for styling                            |
| prevText     | string   | 'Previous' | Text for the previous button                                |
| nextText     | string   | 'Next'     | Text for the next button                                    |

## API Methods

### getElement()

Returns the pagination DOM element.

```javascript
const paginationElement = pagination.getElement();
```

### update(props)

Updates the pagination with new properties.

```javascript
// Update current page
pagination.update({ value: 3 });

// Update multiple properties
pagination.update({
  value: 2,
  totalPages: 20,
});
```

### setValue(page)

Convenience method to update only the current page.

```javascript
pagination.setValue(5);
```

### setCurrentPage(page)

Legacy method to update the current page (deprecated, use setValue instead).

```javascript
pagination.setCurrentPage(5);
```

### setTotalPages(total)

Convenience method to update only the total pages.

```javascript
pagination.setTotalPages(15);
```

### destroy()

Cleans up event listeners and button instances. Call before removing the component.

```javascript
pagination.destroy();
```

## Styling & Customization

### CSS Variables

The component uses CSS variables for theming. Styles are automatically injected:

```css
:root {
  --space-2: 8px;
  --space-3: 12px;
  --space-8: 32px;
  --color-text-light: #6b7280;
}
```

### CSS Classes

All styles are automatically injected. Available classes for customization:

```css
.pagination {
  /* Main pagination container */
}

.pagination__list {
  /* Button list container */
}

.pagination__button {
  /* Individual page buttons */
}

.pagination__button--active {
  /* Active/current page button */
}

.pagination__button--prev,
.pagination__button--next {
  /* Previous/next navigation buttons */
}

.pagination__dots {
  /* Ellipsis dots */
}
```

### Custom Styling

Override styles using CSS specificity:

```css
/* Custom pagination styling */
.my-custom-pagination .pagination__button {
  border-radius: 8px;
  font-weight: 600;
}

.my-custom-pagination .pagination__button--active {
  background: linear-gradient(45deg, #ff6b6b, #ee5a24);
}
```

## Pagination Logic

The component intelligently handles large numbers of pages by displaying:

1. **Always the first page**
2. **Always the last page**
3. **Current page and siblings** (controlled by `siblingCount`)
4. **Ellipsis dots** (`...`) when there are gaps

### Examples

```javascript
// With 20 pages, current page 7, siblingCount 1:
// Display: 1 ... 6 7 8 ... 20

// With 20 pages, current page 15, siblingCount 2:
// Display: 1 ... 13 14 15 16 17 ... 20
```

## Accessibility Features

- **ARIA Navigation**: Proper `aria-label` for navigation landmark
- **Current Page**: `aria-current="page"` for active page
- **Button States**: Disabled state for boundary buttons
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Descriptive labels for all buttons
- **Responsive Design**: Mobile-friendly with icon fallbacks

## Complete Examples

### Basic Pagination

```javascript
const pagination = Pagination({
  value: 1,
  totalPages: 10,
  onChange: (page) => {
    console.log(`Go to page ${page}`);
    loadPageContent(page);
  },
});
```

### Extended Sibling Count

```javascript
const pagination = Pagination({
  value: 5,
  totalPages: 20,
  siblingCount: 2, // Show more page numbers around current page
  onChange: handlePageChange,
});
```

### Integration with Data Fetching

```javascript
// Initialize pagination and content
const pagination = Pagination({
  value: 1,
  totalPages: totalPages,
  onChange: async (page) => {
    try {
      showLoadingIndicator();

      const data = await fetchPageData(page);
      renderContent(data);

      // Update pagination state
      pagination.update({ value: page });

      hideLoadingIndicator();
    } catch (error) {
      showError(error);
      hideLoadingIndicator();
    }
  },
});
```

### Server-Side Pagination

```javascript
const setupPagination = (initialData) => {
  const { items, currentPage, totalPages } = initialData;

  // Render initial items
  renderItems(items);

  // Setup pagination
  const pagination = Pagination({
    value: currentPage,
    totalPages,
    onChange: async (page) => {
      try {
        // Show loading state
        showLoading(true);

        // Update URL with new page parameter
        history.pushState({}, '', `?page=${page}`);

        // Fetch new data
        const response = await fetch(`/api/items?page=${page}`);
        const data = await response.json();

        // Update content
        renderItems(data.items);

        // Hide loading state
        showLoading(false);
      } catch (error) {
        handleError(error);
      }
    },
  });

  return pagination;
};
```

### Dynamic Pagination Updates

```javascript
const pagination = Pagination({
  value: 1,
  totalPages: 5,
  onChange: (page) => console.log(`Page ${page}`),
});

// Dynamically update total pages based on search results
const updateSearch = async (query) => {
  const results = await searchItems(query);

  // Update pagination with new total
  pagination.update({
    value: 1, // Reset to first page
    totalPages: Math.ceil(results.total / results.perPage),
  });

  renderSearchResults(results.items);
};
```

## Migration from CSS Imports

**Before (Old Approach):**

```javascript
import './Pagination.css'; // ❌ Causes Node.js errors
import Pagination from './Pagination.js';
```

**After (CSS Injection):**

```javascript
import Pagination from './Pagination.js'; // ✅ Styles inject automatically
```

## Node.js Compatibility

The component now works seamlessly in Node.js environments:

```javascript
// This works without errors in Node.js
const { Pagination } = require('@svarog-ui/core');

// Or with ES modules
import { Pagination } from '@svarog-ui/core';
```

## Browser Support

- **Modern browsers**: Full support with automatic style injection
- **SSR**: Compatible with server-side rendering
- **Legacy browsers**: Graceful degradation with core functionality
