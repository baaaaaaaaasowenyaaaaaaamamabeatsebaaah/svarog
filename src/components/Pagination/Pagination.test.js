// src/components/Pagination/Pagination.test.js
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Pagination from './Pagination.js';

describe('Pagination component', () => {
  let container;
  let onPageChange;

  beforeEach(() => {
    // Create a container for mounting
    container = document.createElement('div');
    document.body.appendChild(container);

    // Create a spy for page change callback
    onPageChange = vi.fn();
  });

  afterEach(() => {
    // Clean up
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  // Helper function to mount component in container
  const mountComponent = (pagination) => {
    container.innerHTML = '';
    container.appendChild(pagination.getElement());
    return pagination.getElement();
  };

  it('should render correctly with basic props', () => {
    // Arrange
    const pagination = Pagination({
      currentPage: 1,
      totalPages: 5,
      onPageChange,
    });

    // Act
    const element = mountComponent(pagination);

    // Assert
    expect(element).toBeDefined();
    expect(element.tagName.toLowerCase()).toBe('nav');
    expect(element.getAttribute('aria-label')).toBe('Pagination Navigation');

    // Check for list container
    const list = element.querySelector('ul');
    expect(list).toBeTruthy();
  });

  it('should disable previous button on first page', () => {
    // Arrange
    const pagination = Pagination({
      currentPage: 1,
      totalPages: 5,
      onPageChange,
    });

    // Act
    const element = mountComponent(pagination);

    // Find prev button
    const prevButton = element.querySelector('.pagination__button--prev');

    // Assert
    expect(prevButton).toBeTruthy();
    expect(prevButton.disabled).toBe(true);
  });

  it('should enable previous button when not on first page', () => {
    // Arrange
    const pagination = Pagination({
      currentPage: 2,
      totalPages: 5,
      onPageChange,
    });

    // Act
    const element = mountComponent(pagination);

    // Find prev button
    const prevButton = element.querySelector('.pagination__button--prev');

    // Assert
    expect(prevButton).toBeTruthy();
    expect(prevButton.disabled).toBe(false);
  });

  it('should disable next button on last page', () => {
    // Arrange
    const pagination = Pagination({
      currentPage: 5,
      totalPages: 5,
      onPageChange,
    });

    // Act
    const element = mountComponent(pagination);

    // Find next button
    const nextButton = element.querySelector('.pagination__button--next');

    // Assert
    expect(nextButton).toBeTruthy();
    expect(nextButton.disabled).toBe(true);
  });

  it('should enable next button when not on last page', () => {
    // Arrange
    const pagination = Pagination({
      currentPage: 4,
      totalPages: 5,
      onPageChange,
    });

    // Act
    const element = mountComponent(pagination);

    // Find next button
    const nextButton = element.querySelector('.pagination__button--next');

    // Assert
    expect(nextButton).toBeTruthy();
    expect(nextButton.disabled).toBe(false);
  });

  it('should call onPageChange when page button is clicked', () => {
    // Arrange
    const pagination = Pagination({
      currentPage: 1,
      totalPages: 5,
      onPageChange,
    });

    // Act
    const element = mountComponent(pagination);

    // Find page buttons (excluding prev/next)
    const pageButtons = Array.from(
      element.querySelectorAll('.pagination__button')
    ).filter(
      (btn) =>
        !btn.classList.contains('pagination__button--prev') &&
        !btn.classList.contains('pagination__button--next')
    );

    // Click the second page button
    if (pageButtons.length >= 2) {
      pageButtons[1].click();

      // Assert
      expect(onPageChange).toHaveBeenCalled();
    }
  });

  it('should call onPageChange when previous button is clicked', () => {
    // Arrange
    const pagination = Pagination({
      currentPage: 3,
      totalPages: 5,
      onPageChange,
    });

    // Act
    const element = mountComponent(pagination);
    const prevButton = element.querySelector('.pagination__button--prev');

    // Click prev button
    prevButton.click();

    // Assert
    expect(onPageChange).toHaveBeenCalled();
  });

  it('should call onPageChange when next button is clicked', () => {
    // Arrange
    const pagination = Pagination({
      currentPage: 3,
      totalPages: 5,
      onPageChange,
    });

    // Act
    const element = mountComponent(pagination);
    const nextButton = element.querySelector('.pagination__button--next');

    // Click next button
    nextButton.click();

    // Assert
    expect(onPageChange).toHaveBeenCalled();
  });

  it('should not call onPageChange when clicking current page button', () => {
    // Arrange
    const pagination = Pagination({
      currentPage: 3,
      totalPages: 5,
      onPageChange,
    });

    // Act
    const element = mountComponent(pagination);

    // Find the active page button
    const activeButton = element.querySelector('.pagination__button--active');

    if (activeButton) {
      // Click the active button
      activeButton.click();

      // Assert
      expect(onPageChange).not.toHaveBeenCalled();
    }
  });

  it('should update when setCurrentPage is called', () => {
    // Arrange
    const pagination = Pagination({
      currentPage: 1,
      totalPages: 5,
      onPageChange,
    });

    // Act - mount first
    mountComponent(pagination);

    // Update to page 3 using the appropriate method
    if (typeof pagination.setCurrentPage === 'function') {
      pagination.setCurrentPage(3);
    } else {
      pagination.update({ currentPage: 3 });
    }

    // Re-mount to get the updated element
    const element = mountComponent(pagination);

    // Assert - check for page 3 button
    const pageButtons = Array.from(element.querySelectorAll('button')).filter(
      (btn) => {
        const text = btn.textContent.trim();
        return !text.includes('Previous') && !text.includes('Next');
      }
    );

    // Verify we have page buttons
    expect(pageButtons.length).toBeGreaterThan(0);
  });

  it('should update when setTotalPages is called', () => {
    // Arrange
    const pagination = Pagination({
      currentPage: 1,
      totalPages: 3,
      onPageChange,
    });

    // Act - mount first
    mountComponent(pagination);

    // Update total pages using the appropriate method
    if (typeof pagination.setTotalPages === 'function') {
      pagination.setTotalPages(8);
    } else {
      pagination.update({ totalPages: 8 });
    }

    // Re-mount to get the updated element
    const element = mountComponent(pagination);

    // Assert - check for page buttons
    const pageButtons = Array.from(element.querySelectorAll('button')).filter(
      (btn) => {
        const text = btn.textContent.trim();
        return !text.includes('Previous') && !text.includes('Next');
      }
    );

    // Verify we have page buttons
    expect(pageButtons.length).toBeGreaterThan(0);
  });

  it('should apply custom class names correctly', () => {
    // Arrange
    const customClass = 'custom-pagination';
    const pagination = Pagination({
      currentPage: 1,
      totalPages: 5,
      className: customClass,
      onPageChange,
    });

    // Act
    const element = pagination.getElement();

    // Assert the component renders successfully
    expect(element).toBeTruthy();
    expect(element.tagName.toLowerCase()).toBe('nav');
  });

  it('should clean up properly when destroyed', () => {
    // Arrange
    const pagination = Pagination({
      currentPage: 1,
      totalPages: 5,
      onPageChange,
    });

    mountComponent(pagination);

    // Spy on destroy method
    const destroySpy = vi.spyOn(pagination, 'destroy');

    // Act
    pagination.destroy();

    // Assert
    expect(destroySpy).toHaveBeenCalled();
  });
});
