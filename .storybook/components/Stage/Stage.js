import './Stage.css';

export default class Stage {
  constructor() {
    this.stage = document.createElement('div');
    this.stage.className = 'stage';
  }

  setComponent(component) {
    this.stage.innerHTML = '';
    if (component && typeof component.getElement === 'function') {
      this.stage.appendChild(component.getElement());
    } else if (component instanceof HTMLElement) {
      this.stage.appendChild(component);
    } else {
      // eslint-disable-next-line no-console
      console.error('Component does not have getElement method', component);
    }
  }

  getElement() {
    return this.stage;
  }
}
