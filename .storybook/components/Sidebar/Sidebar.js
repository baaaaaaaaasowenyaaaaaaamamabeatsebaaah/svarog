// .storybook/components/Sidebar/Sidebar.js
import './Sidebar.css';

export default class Sidebar {
  constructor(components, onStorySelect) {
    this.components = components;
    this.onStorySelect = onStorySelect;
    this.sidebar = document.createElement('div');
    this.sidebar.className = 'sidebar';

    // Use a custom implementation instead of the Navigation component
    this.renderCustomSidebar();
  }

  renderCustomSidebar() {
    // Clear any existing content
    this.sidebar.innerHTML = '';

    // Create a container for the navigation
    const navContainer = document.createElement('nav');
    navContainer.className = 'sidebar-nav';

    // Create the main list
    const componentList = document.createElement('ul');
    componentList.className = 'component-list';

    // Add components and their stories
    this.components.forEach((component) => {
      // Create component item
      const componentItem = document.createElement('li');
      componentItem.className = 'component-item';

      // Create component header
      const componentHeader = document.createElement('div');
      componentHeader.className = 'component-header';
      componentHeader.textContent = component.name;

      // Make component header expandable
      componentHeader.addEventListener('click', () => {
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

          const storyLink = document.createElement('a');
          storyLink.className = 'story-link';
          storyLink.textContent = story.name;
          storyLink.href = '#';
          storyLink.addEventListener('click', (e) => {
            e.preventDefault();
            this.selectStory(story);
          });

          storyItem.appendChild(storyLink);
          storiesList.appendChild(storyItem);
        });

        componentItem.appendChild(storiesList);
      }

      componentList.appendChild(componentItem);
    });

    navContainer.appendChild(componentList);
    this.sidebar.appendChild(navContainer);
  }

  selectStory(story) {
    // Remove active class from all stories
    const activeStories = this.sidebar.querySelectorAll('.story-link.active');
    activeStories.forEach((el) => el.classList.remove('active'));

    // Call the provided onStorySelect callback
    if (this.onStorySelect && typeof this.onStorySelect === 'function') {
      this.onStorySelect(story);
    }
  }

  getElement() {
    return this.sidebar;
  }
}
