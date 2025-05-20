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
 * @param {string} [props.className=''] - Additional CSS class names for the root element
 * @param {string} [props.prevText='Previous'] - Text for the previous button
 * @param {string} [props.nextText='Next'] - Text for the next button
 * @returns {Object} Pagination component API
 */
const createPagination = (props) => {
  // Track button instances for proper cleanup
  let buttonInstances = [];

  /**
   * Generates the pagination range with appropriate ellipses
   * @param {number} currentPage - Current active page
   * @param {number} totalPages - Total number of pages
   * @param {number} siblingCount - Number of siblings to show around current page
   * @returns {Array} Array of page numbers and ellipsis markers
   */
  const generatePaginationRange = (currentPage, totalPages, siblingCount) => {
    // Handle invalid inputs gracefully
    if (totalPages <= 0) return [];
    if (currentPage < 1) currentPage = 1;
    if (currentPage > totalPages) currentPage = totalPages;

    // For small page counts, show all pages
    if (totalPages <= siblingCount * 2 + 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // For larger page counts, use intelligent paging with ellipses
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
    if (totalPages > 1 && !pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return pages;
  };

  /**
   * Clean up button instances to prevent memory leaks
   */
  const cleanupButtons = () => {
    buttonInstances.forEach((button) => {
      if (button && typeof button.destroy === 'function') {
        button.destroy();
      }
    });
    buttonInstances = [];
  };

  /**
   * Renders the pagination component
   * @param {Object} state - Current state of the pagination component
   * @returns {HTMLElement} The pagination DOM element
   */
  const renderPagination = (state) => {
    const {
      currentPage = 1,
      totalPages = 1,
      siblingCount = 1,
      className = '',
      onPageChange = () => {},
      prevText = 'Previous',
      nextText = 'Next',
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

      if (newPage !== currentPage && typeof onPageChange === 'function') {
        onPageChange(newPage);
      }
    };

    // Clean up previous button instances
    cleanupButtons();

    // Create pagination container with proper class names
    const container = createElement('nav', {
      className: `pagination ${className}`.trim(),
      attributes: {
        'aria-label': 'Pagination Navigation',
        role: 'navigation',
      },
    });

    // Create pagination list
    const list = createElement('ul', {
      className: 'pagination__list',
      attributes: {
        role: 'list',
      },
    });

    // Previous button
    const prevItem = createElement('li', {
      className: 'pagination__item',
      attributes: {
        role: 'listitem',
      },
    });

    const prevBtn = Button({
      text: prevText,
      disabled: currentPage <= 1,
      className: 'pagination__button pagination__button--prev',
      onClick: () => handlePageClick('prev'),
      ariaLabel: 'Go to previous page',
    });

    buttonInstances.push(prevBtn);

    // Ensure button is created successfully before appending
    const prevBtnElement = prevBtn.getElement();
    if (prevBtnElement) {
      prevItem.appendChild(prevBtnElement);
      list.appendChild(prevItem);
    }

    // Generate pages to display
    const pages = generatePaginationRange(
      currentPage,
      totalPages,
      siblingCount
    );

    // Render page buttons
    pages.forEach((page) => {
      const pageItem = createElement('li', {
        className: 'pagination__item',
        attributes: {
          role: 'listitem',
        },
      });

      if (page === '...') {
        // Create ellipsis element
        const dots = createElement('span', {
          className: 'pagination__dots',
          text: '...',
          attributes: {
            'aria-hidden': 'true',
          },
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
            'aria-label': `Go to page ${page}${isCurrentPage ? ', current page' : ''}`,
          },
        });

        buttonInstances.push(pageBtn);

        // Ensure button is created successfully before appending
        const pageBtnElement = pageBtn.getElement();
        if (pageBtnElement) {
          pageItem.appendChild(pageBtnElement);
        }
      }

      list.appendChild(pageItem);
    });

    // Next button
    const nextItem = createElement('li', {
      className: 'pagination__item',
      attributes: {
        role: 'listitem',
      },
    });

    const nextBtn = Button({
      text: nextText,
      disabled: currentPage >= totalPages,
      className: 'pagination__button pagination__button--next',
      onClick: () => handlePageClick('next'),
      ariaLabel: 'Go to next page',
    });

    buttonInstances.push(nextBtn);

    // Ensure button is created successfully before appending
    const nextBtnElement = nextBtn.getElement();
    if (nextBtnElement) {
      nextItem.appendChild(nextBtnElement);
      list.appendChild(nextItem);
    }

    container.appendChild(list);
    return container;
  };

  // Create the component with base lifecycle methods
  const component = createBaseComponent(renderPagination)(props);

  /**
   * Custom destroy method to clean up button instances
   */
  const originalDestroy = component.destroy;
  component.destroy = function () {
    cleanupButtons();
    if (originalDestroy) {
      originalDestroy.call(this);
    }
  };

  /**
   * Sets the current page
   * @param {number} page - New current page
   * @returns {Object} Component instance for chaining
   */
  component.setCurrentPage = function (page) {
    return this.update({ currentPage: page });
  };

  /**
   * Sets the total number of pages
   * @param {number} total - New total pages
   * @returns {Object} Component instance for chaining
   */
  component.setTotalPages = function (total) {
    return this.update({ totalPages: total });
  };

  return component;
};

// Export the enhanced component
export default createComponent(
  'Pagination',
  withThemeAwareness(createPagination)
);
