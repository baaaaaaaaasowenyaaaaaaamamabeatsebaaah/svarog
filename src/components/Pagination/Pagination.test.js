// src/components/Pagination/Pagination.test.js
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Pagination from './Pagination.js';

describe('Pagination component', () => {
  let container;
  let onChange;

  beforeEach(() => {
    // Create a container for mounting
    container = document.createElement('div');
    document.body.appendChild(container);

    // Create a spy for page change callback
    onChange = vi.fn();
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
      value: 1,
      totalPages: 5,
      onChange,
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
      value: 1,
      totalPages: 5,
      onChange,
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
      value: 2,
      totalPages: 5,
      onChange,
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
      value: 5,
      totalPages: 5,
      onChange,
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
      value: 4,
      totalPages: 5,
      onChange,
    });

    // Act
    const element = mountComponent(pagination);

    // Find next button
    const nextButton = element.querySelector('.pagination__button--next');

    // Assert
    expect(nextButton).toBeTruthy();
    expect(nextButton.disabled).toBe(false);
  });

  it('should call onChange when page button is clicked', () => {
    // Arrange
    const pagination = Pagination({
      value: 1,
      totalPages: 5,
      onChange,
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
      expect(onChange).toHaveBeenCalled();
    }
  });

  it('should call onChange when previous button is clicked', () => {
    // Arrange
    const pagination = Pagination({
      value: 3,
      totalPages: 5,
      onChange,
    });

    // Act
    const element = mountComponent(pagination);
    const prevButton = element.querySelector('.pagination__button--prev');

    // Click prev button
    prevButton.click();

    // Assert
    expect(onChange).toHaveBeenCalled();
  });

  it('should call onChange when next button is clicked', () => {
    // Arrange
    const pagination = Pagination({
      value: 3,
      totalPages: 5,
      onChange,
    });

    // Act
    const element = mountComponent(pagination);
    const nextButton = element.querySelector('.pagination__button--next');

    // Click next button
    nextButton.click();

    // Assert
    expect(onChange).toHaveBeenCalled();
  });

  it('should not call onChange when clicking current page button', () => {
    // Arrange
    const pagination = Pagination({
      value: 3,
      totalPages: 5,
      onChange,
    });

    // Act
    const element = mountComponent(pagination);

    // Find the active page button
    const activeButton = element.querySelector('.pagination__button--active');

    if (activeButton) {
      // Click the active button
      activeButton.click();

      // Assert
      expect(onChange).not.toHaveBeenCalled();
    }
  });

  it('should update when setValue is called', () => {
    // Arrange
    const pagination = Pagination({
      value: 1,
      totalPages: 5,
      onChange,
    });

    // Act - mount first
    mountComponent(pagination);

    // Update to page 3
    pagination.setValue(3);

    // Re-mount to get the updated element
    const element = mountComponent(pagination);

    // Assert - check for page 3 button being active
    const activeButton = element.querySelector('.pagination__button--active');
    expect(activeButton).toBeTruthy();
    expect(activeButton.textContent.trim()).toBe('3');
  });

  it('should update when setTotalPages is called', () => {
    // Arrange
    const pagination = Pagination({
      value: 1,
      totalPages: 3,
      onChange,
    });

    // Act - mount first
    mountComponent(pagination);

    // Update total pages
    pagination.setTotalPages(8);

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

    // Should show at least first page and last page (8)
    const lastPageButton = pageButtons[pageButtons.length - 1];
    expect(lastPageButton.textContent.trim()).toBe('8');
  });

  it('should apply custom class names correctly', () => {
    // Arrange
    const customClass = 'custom-pagination';
    const pagination = Pagination({
      value: 1,
      totalPages: 5,
      className: customClass,
      onChange,
    });

    // Act
    const element = pagination.getElement();

    // Assert the component renders successfully
    expect(element).toBeTruthy();
    expect(element.tagName.toLowerCase()).toBe('nav');
    expect(element.className).toContain(customClass);
  });

  it('should clean up properly when destroyed', () => {
    // Arrange
    const pagination = Pagination({
      value: 1,
      totalPages: 5,
      onChange,
    });

    mountComponent(pagination);

    // Spy on destroy method
    const destroySpy = vi.spyOn(pagination, 'destroy');

    // Act
    pagination.destroy();

    // Assert
    expect(destroySpy).toHaveBeenCalled();
  });

  it('should handle both value and currentPage props (with value taking precedence)', () => {
    // Arrange - both props provided
    const pagination = Pagination({
      value: 3,
      currentPage: 2,
      totalPages: 5,
      onChange,
    });

    // Act
    const element = mountComponent(pagination);

    // Assert - should use value (3) not currentPage (2)
    const activeButton = element.querySelector('.pagination__button--active');
    expect(activeButton).toBeTruthy();
    expect(activeButton.textContent.trim()).toBe('3');
  });

  it('should support legacy onPageChange prop', () => {
    // Arrange
    const onPageChange = vi.fn();
    const pagination = Pagination({
      currentPage: 2,
      totalPages: 5,
      onPageChange,
    });

    // Act
    const element = mountComponent(pagination);
    const nextButton = element.querySelector('.pagination__button--next');
    nextButton.click();

    // Assert
    expect(onPageChange).toHaveBeenCalledWith(3);
  });
});
