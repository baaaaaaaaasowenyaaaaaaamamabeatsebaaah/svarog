import './Sidebar.css';

export default class Sidebar {
  constructor(components, onComponentSelect) {
    this.components = components;
    this.onComponentSelect = onComponentSelect;

    this.sidebar = document.createElement('div');
    this.sidebar.className = 'sidebar';

    this.render();
  }

  render() {
    const list = document.createElement('ul');
    this.components.forEach((component) => {
      const listItem = document.createElement('li');
      listItem.textContent = component.name;
      listItem.addEventListener('click', () =>
        this.onComponentSelect(component)
      );
      list.appendChild(listItem);
    });

    this.sidebar.appendChild(list);
  }

  getElement() {
    return this.sidebar;
  }
}
