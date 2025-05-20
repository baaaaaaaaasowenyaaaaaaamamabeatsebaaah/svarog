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
 *
 * @param {Object} props - Pagination properties
 * @param {number} [props.currentPage=1] - Current active page
 * @param {number} [props.totalPages=1] - Total number of pages
 * @param {Function} [props.onPageChange] - Callback when page changes (receives page number)
 * @param {number} [props.siblingCount=1] - Number of siblings to show around current page
 * @param {string} [props.className=''] - Additional CSS class names
 * @returns {Object} Pagination component API
 */
const createPagination = (props) => {
  // Validate required props
  if (
    props.currentPage !== undefined &&
    typeof props.currentPage !== 'number'
  ) {
    throw new Error('Pagination: currentPage must be a number');
  }

  if (props.totalPages !== undefined && typeof props.totalPages !== 'number') {
    throw new Error('Pagination: totalPages must be a number');
  }

  /**
   * Generate the pagination range with dots for ellipsis
   * @private
   */
  const generatePaginationRange = (currentPage, totalPages, siblingCount) => {
    // Total pagination items to show
    const totalPageNumbers = siblingCount * 2 + 5;

    // If total pages is less than total pagination items, show all pages
    if (totalPages <= totalPageNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    // No left dots, but right dots
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, '...', totalPages];
    }

    // Left dots, but no right dots
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      );
      return [firstPageIndex, '...', ...rightRange];
    }

    // Both left and right dots
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [firstPageIndex, '...', ...middleRange, '...', lastPageIndex];
    }

    return [];
  };

  // Create pagination rendering function for use with baseComponent
  const renderPagination = (state) => {
    const {
      currentPage = 1,
      totalPages = 1,
      siblingCount = 1,
      className = '',
      onPageChange = () => {},
    } = state;

    // Define handlePageClick inside the render function to access current state
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

    // Create pagination container
    const pagination = createElement('nav', {
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
    const prevButton = createElement('li', {
      className: 'pagination__item',
    });

    const prevBtn = Button({
      text: 'Previous',
      disabled: currentPage <= 1,
      className: 'pagination__button pagination__button--prev',
      onClick: () => handlePageClick('prev'),
    }).getElement();

    prevButton.appendChild(prevBtn);
    list.appendChild(prevButton);

    // Page numbers
    const paginationRange = generatePaginationRange(
      currentPage,
      totalPages,
      siblingCount
    );

    paginationRange.forEach((page) => {
      const pageItem = createElement('li', {
        className: 'pagination__item',
      });

      if (page === '...') {
        const dots = createElement('span', {
          className: 'pagination__dots',
          text: '...',
        });
        pageItem.appendChild(dots);
      } else {
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
        }).getElement();

        pageItem.appendChild(pageBtn);
      }

      list.appendChild(pageItem);
    });

    // Next button
    const nextButton = createElement('li', {
      className: 'pagination__item',
    });

    const nextBtn = Button({
      text: 'Next',
      disabled: currentPage >= totalPages,
      className: 'pagination__button pagination__button--next',
      onClick: () => handlePageClick('next'),
    }).getElement();

    nextButton.appendChild(nextBtn);
    list.appendChild(nextButton);

    pagination.appendChild(list);

    return pagination;
  };

  // Create the component using baseComponent
  const component = createBaseComponent(renderPagination)(props);

  // Add additional methods specifically for Pagination

  /**
   * Sets the current page
   * @param {number} page - New current page
   * @returns {Object} Component instance for chaining
   */
  component.setCurrentPage = (page) => {
    return component.update({ currentPage: page });
  };

  /**
   * Set the total pages
   * @param {number} total - New total pages
   * @returns {Object} Component instance for chaining
   */
  component.setTotalPages = (total) => {
    return component.update({ totalPages: total });
  };

  // Add theme change handling
  component.onThemeChange = () => {
    // No specific theme handling needed for pagination
    // CSS variables will handle the styling
  };

  // Return the enhanced component
  return component;
};

// Only one default export
const enhancedPagination = createComponent(
  'Pagination',
  withThemeAwareness(createPagination)
);
export default enhancedPagination;
