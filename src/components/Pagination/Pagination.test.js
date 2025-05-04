// src/components/Pagination/Pagination.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest';
import Pagination from './Pagination.js';

describe('Pagination', () => {
  let defaultProps;
  let onPageChange;

  beforeEach(() => {
    onPageChange = vi.fn();
    defaultProps = {
      currentPage: 1,
      totalPages: 10,
      onPageChange,
    };
  });

  it('should render correctly', () => {
    const pagination = new Pagination(defaultProps);
    const element = pagination.getElement();

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.classList.contains('pagination')).toBe(true);
  });

  it('should render page numbers', () => {
    const pagination = new Pagination(defaultProps);
    const element = pagination.getElement();
    const buttons = element.querySelectorAll('.pagination__button');

    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should disable previous button on first page', () => {
    const pagination = new Pagination(defaultProps);
    const element = pagination.getElement();
    const prevButton = element.querySelector('.pagination__button--prev');

    expect(prevButton.disabled).toBe(true);
  });

  it('should disable next button on last page', () => {
    const pagination = new Pagination({
      ...defaultProps,
      currentPage: 10,
    });
    const element = pagination.getElement();
    const nextButton = element.querySelector('.pagination__button--next');

    expect(nextButton.disabled).toBe(true);
  });

  it('should call onPageChange when clicking page number', () => {
    const pagination = new Pagination(defaultProps);
    const element = pagination.getElement();
    const pageButtons = element.querySelectorAll(
      '.pagination__button:not(.pagination__button--prev):not(.pagination__button--next)'
    );

    pageButtons[1].click(); // Click on page 2
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('should handle previous button click', () => {
    const pagination = new Pagination({
      ...defaultProps,
      currentPage: 5,
    });
    const element = pagination.getElement();
    const prevButton = element.querySelector('.pagination__button--prev');

    prevButton.click();
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it('should handle next button click', () => {
    const pagination = new Pagination({
      ...defaultProps,
      currentPage: 5,
    });
    const element = pagination.getElement();
    const nextButton = element.querySelector('.pagination__button--next');

    nextButton.click();
    expect(onPageChange).toHaveBeenCalledWith(6);
  });

  it('should show dots for many pages', () => {
    const pagination = new Pagination({
      ...defaultProps,
      currentPage: 5,
      totalPages: 20,
    });
    const element = pagination.getElement();
    const dots = element.querySelectorAll('.pagination__dots');

    expect(dots.length).toBeGreaterThan(0);
  });
});
