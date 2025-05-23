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
    value: 1,
    totalPages: 10,
    onChange: onPageChange,
  });
};

export const MiddlePage = () => {
  return Pagination({
    value: 5,
    totalPages: 10,
    onChange: onPageChange,
  });
};

export const LastPage = () => {
  return Pagination({
    value: 10,
    totalPages: 10,
    onChange: onPageChange,
  });
};

export const ManyPages = () => {
  return Pagination({
    value: 10,
    totalPages: 50,
    onChange: onPageChange,
  });
};

export const FewPages = () => {
  return Pagination({
    value: 2,
    totalPages: 3,
    onChange: onPageChange,
  });
};

export const SinglePage = () => {
  return Pagination({
    value: 1,
    totalPages: 1,
    onChange: onPageChange,
  });
};

export const WithCustomSiblingCount = () => {
  return Pagination({
    value: 10,
    totalPages: 20,
    siblingCount: 2,
    onChange: onPageChange,
  });
};

export const WithCustomClass = () => {
  return Pagination({
    value: 3,
    totalPages: 10,
    className: 'custom-pagination',
    onChange: onPageChange,
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
    value: 1,
    totalPages: 10,
    onChange: (page) => {
      contentArea.textContent = `Page ${page} Content`;
      pagination.update({ value: page });
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
        value: 1,
        totalPages: 10,
        onChange: onPageChange,
      })
    )
  );

  container.appendChild(
    createSection(
      'Middle Pages (With Both Ellipses)',
      Pagination({
        value: 10,
        totalPages: 20,
        onChange: onPageChange,
      })
    )
  );

  container.appendChild(
    createSection(
      'Last Page (Next Disabled)',
      Pagination({
        value: 10,
        totalPages: 10,
        onChange: onPageChange,
      })
    )
  );

  container.appendChild(
    createSection(
      'Few Pages (No Ellipses)',
      Pagination({
        value: 2,
        totalPages: 5,
        onChange: onPageChange,
      })
    )
  );

  container.appendChild(
    createSection(
      'Many Pages with Extended Siblings',
      Pagination({
        value: 15,
        totalPages: 30,
        siblingCount: 3,
        onChange: onPageChange,
      })
    )
  );

  return container;
};
