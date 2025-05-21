// src/components/Pagination/Pagination.js
import './Pagination.css';
import { createBaseComponent } from '../../utils/baseComponent.js';
import { withThemeAwareness } from '../../utils/composition.js';
import { createComponent } from '../../utils/componentFactory.js';
import Button from '../Button/Button.js';

/**
 * Creates a Pagination component for navigating through paginated content
 * @param {Object} props - Pagination properties
 * @param {number} [props.currentPage=1] - Current active page
 * @param {number} [props.totalPages=1] - Total number of pages
 * @param {Function} [props.onPageChange] - Callback when page changes (receives page number)
 * @param {number} [props.siblingCount=1] - Number of siblings to show around current page
 * @param {string} [props.className=''] - Additional CSS class names
 * @param {string} [props.prevText='Previous'] - Text for the previous button
 * @param {string} [props.nextText='Next'] - Text for the next button
 * @returns {Object} Pagination component API
 */
const createPagination = (props) => {
  let buttonInstances = [];

  /**
   * Generates the pagination range with ellipses
   */
  const generatePaginationRange = (currentPage, totalPages, siblingCount) => {
    if (totalPages <= 0) return [];
    currentPage = Math.max(1, Math.min(currentPage, totalPages));

    // For small page counts, show all pages
    if (totalPages <= siblingCount * 2 + 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // For larger page counts, use intelligent paging with ellipses
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    const pages = [1];
    if (shouldShowLeftDots) pages.push('...');

    // Add sibling pages
    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      if (i > 1 && i < totalPages) pages.push(i);
    }

    if (shouldShowRightDots) pages.push('...');
    if (totalPages > 1 && !pages.includes(totalPages)) pages.push(totalPages);

    return pages;
  };

  /**
   * Clean up button instances
   */
  const cleanupButtons = () => {
    buttonInstances.forEach((button) => {
      if (button?.destroy) button.destroy();
    });
    buttonInstances = [];
  };

  /**
   * Renders the pagination component
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

    // Handle page changes
    const handlePageClick = (page) => {
      if (page === '...') return;

      const newPage =
        page === 'prev'
          ? Math.max(1, currentPage - 1)
          : page === 'next'
            ? Math.min(totalPages, currentPage + 1)
            : Number(page);

      if (newPage !== currentPage && typeof onPageChange === 'function') {
        onPageChange(newPage);
      }
    };

    // Clean up previous buttons
    cleanupButtons();

    // Create container and list - directly create DOM elements to ensure classes are applied
    const container = document.createElement('nav');
    container.className = `pagination ${className}`.trim();
    container.setAttribute('aria-label', 'Pagination Navigation');
    container.setAttribute('role', 'navigation');

    const list = document.createElement('ul');
    list.className = 'pagination__list';
    list.setAttribute('role', 'list');

    // Add previous button
    const prevItem = document.createElement('li');
    prevItem.className = 'pagination__item';
    prevItem.setAttribute('role', 'listitem');

    const prevBtn = Button({
      text: prevText,
      disabled: currentPage <= 1,
      className: 'pagination__button pagination__button--prev',
      onClick: () => handlePageClick('prev'),
      ariaLabel: 'Go to previous page',
    });

    buttonInstances.push(prevBtn);
    prevItem.appendChild(prevBtn.getElement());
    list.appendChild(prevItem);

    // Add page buttons
    generatePaginationRange(currentPage, totalPages, siblingCount).forEach(
      (page) => {
        const pageItem = document.createElement('li');
        pageItem.className = 'pagination__item';
        pageItem.setAttribute('role', 'listitem');

        if (page === '...') {
          const dots = document.createElement('span');
          dots.className = 'pagination__dots';
          dots.textContent = '...';
          dots.setAttribute('aria-hidden', 'true');
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
              'aria-label': `Go to page ${page}${isCurrentPage ? ', current page' : ''}`,
            },
          });

          buttonInstances.push(pageBtn);
          pageItem.appendChild(pageBtn.getElement());
        }

        list.appendChild(pageItem);
      }
    );

    // Add next button
    const nextItem = document.createElement('li');
    nextItem.className = 'pagination__item';
    nextItem.setAttribute('role', 'listitem');

    const nextBtn = Button({
      text: nextText,
      disabled: currentPage >= totalPages,
      className: 'pagination__button pagination__button--next',
      onClick: () => handlePageClick('next'),
      ariaLabel: 'Go to next page',
    });

    buttonInstances.push(nextBtn);
    nextItem.appendChild(nextBtn.getElement());
    list.appendChild(nextItem);

    container.appendChild(list);
    return container;
  };

  // Create the component
  const component = createBaseComponent(renderPagination)(props);

  // Enhance destroy method
  const originalDestroy = component.destroy;
  component.destroy = function () {
    cleanupButtons();
    if (originalDestroy) originalDestroy.call(this);
  };

  // Add convenience methods
  component.setCurrentPage = function (page) {
    return this.update({ currentPage: page });
  };

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
