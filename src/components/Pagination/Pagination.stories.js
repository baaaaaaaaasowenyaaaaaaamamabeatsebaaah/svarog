// src/components/Pagination/Pagination.stories.js
import Pagination from './Pagination.js';

export default {
  title: 'Components/Navigation/Pagination',
  component: Pagination,
};

const onPageChange = (page) => {
  console.log(`Page changed to: ${page}`);
};

export const Default = () => {
  return Pagination({
    currentPage: 1,
    totalPages: 10,
    onPageChange,
  });
};

export const MiddlePage = () => {
  return Pagination({
    currentPage: 5,
    totalPages: 10,
    onPageChange,
  });
};

export const LastPage = () => {
  return Pagination({
    currentPage: 10,
    totalPages: 10,
    onPageChange,
  });
};

export const ManyPages = () => {
  return Pagination({
    currentPage: 10,
    totalPages: 50,
    onPageChange,
  });
};

export const FewPages = () => {
  return Pagination({
    currentPage: 2,
    totalPages: 3,
    onPageChange,
  });
};

export const SinglePage = () => {
  return Pagination({
    currentPage: 1,
    totalPages: 1,
    onPageChange,
  });
};

export const WithCustomSiblingCount = () => {
  return Pagination({
    currentPage: 10,
    totalPages: 20,
    siblingCount: 2,
    onPageChange,
  });
};

export const WithCustomClass = () => {
  return Pagination({
    currentPage: 3,
    totalPages: 10,
    className: 'custom-pagination',
    onPageChange,
  });
};

export const Interactive = () => {
  // Create container for interactive example
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '20px';
  container.style.padding = '20px';

  // Add heading
  const heading = document.createElement('h3');
  heading.textContent = 'Interactive Pagination Example';
  container.appendChild(heading);

  // Add content area
  const contentArea = document.createElement('div');
  contentArea.style.padding = '15px';
  contentArea.style.border = '1px solid #ddd';
  contentArea.style.borderRadius = '4px';
  contentArea.style.minHeight = '100px';
  contentArea.style.display = 'flex';
  contentArea.style.alignItems = 'center';
  contentArea.style.justifyContent = 'center';
  contentArea.style.fontSize = '1.5rem';
  contentArea.textContent = 'Page 1 Content';
  container.appendChild(contentArea);

  // Create pagination
  const pagination = Pagination({
    currentPage: 1,
    totalPages: 10,
    onPageChange: (page) => {
      contentArea.textContent = `Page ${page} Content`;
      pagination.update({ currentPage: page });
    },
  });

  container.appendChild(pagination.getElement());

  return container;
};

export const PaginationVariants = () => {
  // Create container
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '30px';
  container.style.padding = '20px';

  // Create sections for different variants
  const createSection = (title, component) => {
    const section = document.createElement('div');
    section.style.display = 'flex';
    section.style.flexDirection = 'column';
    section.style.gap = '10px';

    const titleElem = document.createElement('h3');
    titleElem.textContent = title;
    titleElem.style.marginBottom = '10px';

    section.appendChild(titleElem);
    section.appendChild(component.getElement());

    return section;
  };

  // Add examples
  container.appendChild(
    createSection(
      'First Page (Prev Disabled)',
      Pagination({
        currentPage: 1,
        totalPages: 10,
        onPageChange,
      })
    )
  );

  container.appendChild(
    createSection(
      'Middle Pages (With Both Ellipses)',
      Pagination({
        currentPage: 10,
        totalPages: 20,
        onPageChange,
      })
    )
  );

  container.appendChild(
    createSection(
      'Last Page (Next Disabled)',
      Pagination({
        currentPage: 10,
        totalPages: 10,
        onPageChange,
      })
    )
  );

  container.appendChild(
    createSection(
      'Few Pages (No Ellipses)',
      Pagination({
        currentPage: 2,
        totalPages: 5,
        onPageChange,
      })
    )
  );

  container.appendChild(
    createSection(
      'Many Pages with Extended Siblings',
      Pagination({
        currentPage: 15,
        totalPages: 30,
        siblingCount: 3,
        onPageChange,
      })
    )
  );

  return container;
};
