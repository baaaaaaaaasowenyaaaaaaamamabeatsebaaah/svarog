/// src/components/Pagination/Pagination.js
import './Pagination.css';
import { Component } from '../../utils/componentFactory.js';
import Button from '../Button/Button.js';

export default class Pagination extends Component {
  constructor(props) {
    super();
    this.props = {
      currentPage: 1,
      totalPages: 1,
      onPageChange: () => {},
      siblingCount: 1,
      className: '',
      ...props,
    };
    this.element = this.createComponentElement();
  }

  generatePaginationRange() {
    const { currentPage, totalPages, siblingCount = 1 } = this.props;

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

    // No dots
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, '...', totalPages];
    }

    // Right dots only
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      );
      return [firstPageIndex, '...', ...rightRange];
    }

    // Both dots
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [firstPageIndex, '...', ...middleRange, '...', lastPageIndex];
    }

    return [];
  }

  /**
   * Handle page click
   * @param {number|string} page - Page number or navigation action
   */
  handlePageClick(page) {
    const { currentPage, totalPages, onPageChange } = this.props;

    if (page === '...') return;

    let newPage = currentPage;

    if (page === 'prev') {
      newPage = Math.max(1, currentPage - 1);
    } else if (page === 'next') {
      newPage = Math.min(totalPages, currentPage + 1);
    } else {
      newPage = Number(page);
    }

    if (newPage !== currentPage) {
      onPageChange(newPage);
    }
  }

  /**
   * Create the pagination element
   * @returns {HTMLElement} The pagination element
   */
  createComponentElement() {
    const { currentPage, totalPages, className = '' } = this.props;

    // Create pagination container
    const pagination = this.createElement('nav', {
      className: this.createClassNames('pagination', className),
      'aria-label': 'Pagination Navigation',
    });

    // Create pagination list
    const list = this.createElement('ul', {
      className: 'pagination__list',
    });

    // Previous button
    const prevButton = this.createElement('li', {
      className: 'pagination__item',
    });

    const prevBtn = new Button({
      text: 'Previous',
      variant: 'ghost',
      disabled: currentPage === 1,
      className: 'pagination__button pagination__button--prev',
      onClick: () => this.handlePageClick('prev'),
    }).getElement();

    prevButton.appendChild(prevBtn);
    list.appendChild(prevButton);

    // Page numbers
    const paginationRange = this.generatePaginationRange();

    paginationRange.forEach((page) => {
      const pageItem = this.createElement('li', {
        className: 'pagination__item',
      });

      if (page === '...') {
        const dots = this.createElement('span', {
          className: 'pagination__dots',
          textContent: '...',
        });
        pageItem.appendChild(dots);
      } else {
        const pageBtn = new Button({
          text: String(page),
          variant: page === currentPage ? 'primary' : 'ghost',
          className: this.createClassNames(
            'pagination__button',
            page === currentPage ? 'pagination__button--active' : ''
          ),
          onClick: () => this.handlePageClick(page),
        }).getElement();

        pageItem.appendChild(pageBtn);
      }

      list.appendChild(pageItem);
    });

    // Next button
    const nextButton = this.createElement('li', {
      className: 'pagination__item',
    });

    const nextBtn = new Button({
      text: 'Next',
      variant: 'ghost',
      disabled: currentPage === totalPages,
      className: 'pagination__button pagination__button--next',
      onClick: () => this.handlePageClick('next'),
    }).getElement();

    nextButton.appendChild(nextBtn);
    list.appendChild(nextButton);

    pagination.appendChild(list);

    return pagination;
  }

  getElement() {
    return this.element;
  }
}
