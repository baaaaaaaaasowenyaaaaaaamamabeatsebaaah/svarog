// .storybook/components/Stage/Stage.js
import './Stage.css';

export default class Stage {
  constructor() {
    this.stage = document.createElement('div');
    this.stage.className = 'stage';

    // Create inner container for styling
    this.stageInner = document.createElement('div');
    this.stageInner.className = 'stage__inner';
    this.stage.appendChild(this.stageInner);

    // Show empty state initially
    this.showEmptyState();
  }

  showEmptyState() {
    this.stageInner.innerHTML = '';

    const emptyState = document.createElement('div');
    emptyState.className = 'stage__empty';

    const icon = document.createElement('div');
    icon.className = 'stage__empty-icon';
    icon.textContent = '⚑';

    const title = document.createElement('h3');
    title.className = 'stage__empty-title';
    title.textContent = 'Select a component or prototype';

    const message = document.createElement('p');
    message.className = 'stage__empty-message';
    message.textContent = 'Choose a story from the sidebar to view it here.';

    emptyState.appendChild(icon);
    emptyState.appendChild(title);
    emptyState.appendChild(message);

    this.stageInner.appendChild(emptyState);
  }

  setComponent(component) {
    this.stageInner.innerHTML = '';

    if (component && typeof component.getElement === 'function') {
      this.stageInner.appendChild(component.getElement());
    } else if (component instanceof HTMLElement) {
      this.stageInner.appendChild(component);
    } else {
      console.error('Component does not have getElement method', component);
      this.showEmptyState();
    }
  }

  getElement() {
    return this.stage;
  }
}
