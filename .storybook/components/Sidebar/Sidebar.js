// .storybook/components/Sidebar/Sidebar.js
import './Sidebar.css';

export default class Sidebar {
  constructor(components, prototypes, onStorySelect) {
    this.components = components;
    this.prototypes = prototypes || [];
    this.onStorySelect = onStorySelect;
    this.sidebar = document.createElement('div');
    this.sidebar.className = 'sidebar';

    // Use a custom implementation instead of the Navigation component
    this.renderCategorizedSidebar();
  }

  renderCategorizedSidebar() {
    // Clear any existing content
    this.sidebar.innerHTML = '';

    // Create a container for the navigation
    const navContainer = document.createElement('nav');
    navContainer.className = 'sidebar-nav';

    // Create Components category
    const componentsCategory = this.createCategory(
      'Components',
      this.components
    );
    navContainer.appendChild(componentsCategory);

    // Create Prototypes category (if we have prototypes)
    if (this.prototypes && this.prototypes.length > 0) {
      const prototypesCategory = this.createCategory(
        'Prototypes',
        this.prototypes,
        'prototypes'
      );
      navContainer.appendChild(prototypesCategory);
    }

    this.sidebar.appendChild(navContainer);
  }

  createCategory(title, items, categoryType = 'components') {
    const categoryContainer = document.createElement('div');
    categoryContainer.className = 'sidebar-category';

    // Category title
    const categoryTitle = document.createElement('h2');
    categoryTitle.className = 'sidebar-category__title';
    categoryTitle.textContent = title;
    categoryContainer.appendChild(categoryTitle);

    // Create the main list
    const componentList = document.createElement('ul');
    componentList.className = 'component-list';

    // Add components and their stories
    items.forEach((component) => {
      // Create component item
      const componentItem = document.createElement('li');
      componentItem.className = 'component-item';
      componentItem.dataset.category = categoryType;

      // Create component header
      const componentHeader = document.createElement('div');
      componentHeader.className = 'component-header';

      // Title text span
      const headerText = document.createElement('span');
      headerText.className = 'component-header__text';
      headerText.textContent = component.name;
      componentHeader.appendChild(headerText);

      // Make component header expandable
      componentHeader.addEventListener('click', () => {
        // Toggle expanded state for this item
        componentItem.classList.toggle('expanded');
      });

      componentItem.appendChild(componentHeader);

      // Create stories list
      if (component.stories && component.stories.length > 0) {
        const storiesList = document.createElement('ul');
        storiesList.className = 'stories-list';

        component.stories.forEach((story) => {
          const storyItem = document.createElement('li');
          storyItem.className = 'story-item';
          storyItem.dataset.category = categoryType;

          const storyLink = document.createElement('a');
          storyLink.className = 'story-link';
          storyLink.textContent = story.name;
          storyLink.href = '#';
          storyLink.dataset.category = categoryType;
          storyLink.addEventListener('click', (e) => {
            e.preventDefault();
            this.selectStory(story, storyLink);
          });

          storyItem.appendChild(storyLink);
          storiesList.appendChild(storyItem);
        });

        componentItem.appendChild(storiesList);
      }

      componentList.appendChild(componentItem);
    });

    categoryContainer.appendChild(componentList);
    return categoryContainer;
  }

  selectStory(story, storyLink) {
    // Remove active class from all stories
    const activeStories = this.sidebar.querySelectorAll('.story-link.active');
    activeStories.forEach((el) => el.classList.remove('active'));

    // Add active class to selected story
    if (storyLink) {
      storyLink.classList.add('active');

      // Ensure the parent component is expanded
      const componentItem = storyLink.closest('.component-item');
      if (componentItem) {
        componentItem.classList.add('expanded');
      }
    }

    // Call the provided onStorySelect callback
    if (this.onStorySelect && typeof this.onStorySelect === 'function') {
      this.onStorySelect(story);
    }
  }

  getElement() {
    return this.sidebar;
  }
}
