// src/components/Pagination/Pagination.js
import './Pagination.css';
import {
  createComponent,
  createElement,
} from '../../utils/componentFactory.js';
import { createBaseComponent } from '../../utils/baseComponent.js';
import { withThemeAwareness } from '../../utils/composition.js';
import Button from '../Button/Button.js';

/**
 * Creates a Pagination component for navigating through paginated content
 * @param {Object} props - Pagination properties
 * @param {number} [props.currentPage=1] - Current active page
 * @param {number} [props.totalPages=1] - Total number of pages
 * @param {Function} [props.onPageChange] - Callback when page changes (receives page number)
 * @param {number} [props.siblingCount=1] - Number of siblings to show around current page
 * @param {string} [props.className=''] - Additional CSS class names
 * @returns {Object} Pagination component API
 */
const createPagination = (props) => {
  // Track button instances for proper cleanup
  let buttonInstances = [];

  /**
   * Generate the pagination range
   * @param {number} currentPage - Current active page
   * @param {number} totalPages - Total number of pages
   * @param {number} siblingCount - Number of siblings to show around current page
   * @returns {Array} Array of page numbers and ellipsis markers
   */
  const generatePaginationRange = (currentPage, totalPages, siblingCount) => {
    // For small page counts, show all pages
    if (totalPages <= siblingCount * 2 + 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // For larger page counts, use intelligent paging
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    // Determine if we need ellipses
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    // Always show first and last page
    let pages = [];

    // Add first page
    pages.push(1);

    // Add left ellipsis if needed
    if (shouldShowLeftDots) {
      pages.push('...');
    }

    // Add sibling pages and current page
    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      if (i > 1 && i < totalPages) {
        pages.push(i);
      }
    }

    // Add right ellipsis if needed
    if (shouldShowRightDots) {
      pages.push('...');
    }

    // Add last page if not already included
    if (rightSiblingIndex < totalPages) {
      pages.push(totalPages);
    }

    return pages;
  };

  /**
   * Clean up button instances
   */
  const cleanupButtons = () => {
    buttonInstances.forEach((button) => {
      if (button && typeof button.destroy === 'function') {
        button.destroy();
      }
    });
    buttonInstances = [];
  };

  const renderPagination = (state) => {
    const {
      currentPage = 1,
      totalPages = 1,
      siblingCount = 1,
      className = '',
      onPageChange = () => {},
    } = state;

    // Define page click handler
    const handlePageClick = (page) => {
      if (page === '...') return;

      let newPage = currentPage;

      if (page === 'prev') {
        newPage = Math.max(1, currentPage - 1);
      } else if (page === 'next') {
        newPage = Math.min(totalPages, currentPage + 1);
      } else {
        newPage = Number(page);
      }

      if (newPage !== currentPage && onPageChange) {
        onPageChange(newPage);
      }
    };

    // Clean up previous button instances
    cleanupButtons();

    // Create pagination container
    const container = createElement('nav', {
      className: `pagination ${className}`.trim(),
      attributes: {
        'aria-label': 'Pagination Navigation',
      },
    });

    // Create pagination list
    const list = createElement('ul', {
      className: 'pagination__list',
    });

    // Previous button
    const prevItem = createElement('li', { className: 'pagination__item' });
    const prevBtn = Button({
      text: 'Previous',
      disabled: currentPage <= 1,
      className: 'pagination__button pagination__button--prev',
      onClick: () => handlePageClick('prev'),
    });
    buttonInstances.push(prevBtn);
    prevItem.appendChild(prevBtn.getElement());
    list.appendChild(prevItem);

    // Generate pages to display
    const pages = generatePaginationRange(
      currentPage,
      totalPages,
      siblingCount
    );

    // Render page buttons
    pages.forEach((page) => {
      const pageItem = createElement('li', { className: 'pagination__item' });

      if (page === '...') {
        // Create ellipsis element
        const dots = createElement('span', {
          className: 'pagination__dots',
          text: '...',
        });
        pageItem.appendChild(dots);
      } else {
        // Create page button
        const isCurrentPage = page === currentPage;
        const pageBtn = Button({
          text: String(page),
          variant: isCurrentPage ? 'primary' : '',
          className:
            `pagination__button ${isCurrentPage ? 'pagination__button--active' : ''}`.trim(),
          onClick: () => handlePageClick(page),
          attributes: {
            'aria-current': isCurrentPage ? 'page' : null,
          },
        });

        buttonInstances.push(pageBtn);
        pageItem.appendChild(pageBtn.getElement());
      }

      list.appendChild(pageItem);
    });

    // Next button
    const nextItem = createElement('li', { className: 'pagination__item' });
    const nextBtn = Button({
      text: 'Next',
      disabled: currentPage >= totalPages,
      className: 'pagination__button pagination__button--next',
      onClick: () => handlePageClick('next'),
    });
    buttonInstances.push(nextBtn);
    nextItem.appendChild(nextBtn.getElement());
    list.appendChild(nextItem);

    container.appendChild(list);
    return container;
  };

  // Create the component
  const component = createBaseComponent(renderPagination)(props);

  // Add custom destroy method
  const originalDestroy = component.destroy;
  component.destroy = function () {
    cleanupButtons();
    if (originalDestroy) {
      originalDestroy.call(this);
    }
  };

  // Convenience methods
  component.setCurrentPage = function (page) {
    return this.update({ currentPage: page });
  };

  component.setTotalPages = function (total) {
    return this.update({ totalPages: total });
  };

  return component;
};

// Export the enhanced component
const PaginationComponent = createComponent(
  'Pagination',
  withThemeAwareness(createPagination)
);

export default PaginationComponent;
