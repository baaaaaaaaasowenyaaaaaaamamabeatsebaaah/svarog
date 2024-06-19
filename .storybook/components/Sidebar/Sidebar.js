import './Sidebar.css';

export default class Sidebar {
  constructor(components, onStorySelect) {
    this.components = components;
    this.onStorySelect = onStorySelect;
    this.sidebar = document.createElement('div');
    this.sidebar.className = 'sidebar';
    this.render();
  }

  render() {
    this.sidebar.innerHTML = '';
    this.components.forEach((component) => {
      const componentItem = document.createElement('div');
      componentItem.className = 'component-item';
      const componentTitle = document.createElement('h3');
      componentTitle.textContent = component.name;
      componentItem.appendChild(componentTitle);

      if (component.stories && component.stories.length > 0) {
        component.stories.forEach((story) => {
          const storyButton = document.createElement('button');
          storyButton.textContent = story.name;
          storyButton.addEventListener('click', () => {
            this.onStorySelect(story);
          });
          componentItem.appendChild(storyButton);
        });
      } else {
        // eslint-disable-next-line no-console
        console.error('Component or stories are undefined:', component);
      }

      this.sidebar.appendChild(componentItem);
    });
  }

  getElement() {
    return this.sidebar;
  }
}
