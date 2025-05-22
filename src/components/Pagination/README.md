# Pagination Component

The Pagination component provides navigation controls for paginated content with customizable page ranges and responsive design.

## Usage

```javascript
import { Pagination } from '@svarog-ui/core';

// Create a pagination component
const pagination = Pagination({
  currentPage: 1,
  totalPages: 10,
  onPageChange: (newPage) => {
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
  currentPage: 2,
});

// Clean up when removing
pagination.destroy();
```

## Props

| Prop         | Type     | Default  | Description                                                 |
| ------------ | -------- | -------- | ----------------------------------------------------------- |
| currentPage  | number   | 1        | Current active page                                         |
| totalPages   | number   | 1        | Total number of pages                                       |
| onPageChange | function | () => {} | Callback called with the new page number when page changes  |
| siblingCount | number   | 1        | Number of page buttons to show on each side of current page |
| className    | string   | ''       | Additional CSS class for styling                            |

## Methods

### getElement()

Returns the pagination DOM element.

```javascript
const paginationElement = pagination.getElement();
```

### update(props)

Updates the pagination with new properties.

```javascript
// Update current page
pagination.update({ currentPage: 3 });

// Update multiple properties
pagination.update({
  currentPage: 2,
  totalPages: 20,
});
```

### setCurrentPage(page)

Convenience method to update only the current page.

```javascript
pagination.setCurrentPage(5);
```

### setTotalPages(total)

Convenience method to update only the total pages.

```javascript
pagination.setTotalPages(15);
```

### destroy()

Cleans up event listeners. Call before removing the component.

```javascript
pagination.destroy();
```

## Customization

The Pagination component can be customized using CSS variables and classes:

```css
.pagination {
  /* Custom pagination styles */
}

.pagination__list {
  /* Custom list styles */
}

.pagination__button {
  /* Custom button styles */
}

.pagination__button--active {
  /* Custom active button styles */
}

.pagination__dots {
  /* Custom dots styles */
}
```

## Pagination Range Logic

The component intelligently handles large numbers of pages by displaying:

1. Always the first page
2. Always the last page
3. The current page and a number of siblings on each side (controlled by `siblingCount`)
4. Ellipsis dots (`...`) when there are gaps in the sequence

For example, with 20 total pages, current page 7, and siblingCount 1:

- Display: 1 ... 6 7 8 ... 20

## Accessibility

The Pagination component implements these accessibility features:

- Proper `aria-label` for navigation
- `aria-current="page"` for the current page button
- Disabled state for previous/next buttons when at boundaries
- Keyboard navigable buttons
- Responsive design with appropriate text labels on larger screens

## Examples

### Basic Pagination

```javascript
const pagination = Pagination({
  currentPage: 1,
  totalPages: 10,
  onPageChange: (page) => {
    console.log(`Go to page ${page}`);
    loadPageContent(page);
  },
});
```

### Custom Sibling Count

Showing more page numbers around the current page:

```javascript
const pagination = Pagination({
  currentPage: 5,
  totalPages: 20,
  siblingCount: 2, // Show more page numbers around current page
  onPageChange: handlePageChange,
});
```

### Integration with Data Fetching

```javascript
// Initialize pagination and content
const pagination = Pagination({
  currentPage: 1,
  totalPages: totalPages,
  onPageChange: (page) => {
    showLoadingIndicator();
    fetchPageData(page)
      .then((data) => {
        renderContent(data);
        pagination.update({ currentPage: page });
        hideLoadingIndicator();
      })
      .catch((error) => {
        showError(error);
        hideLoadingIndicator();
      });
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
    currentPage,
    totalPages,
    onPageChange: async (page) => {
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
