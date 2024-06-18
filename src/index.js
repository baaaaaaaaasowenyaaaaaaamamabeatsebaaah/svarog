import './styles/index.css';
import './styles/theme-default.css';
import './styles/theme-dark.css';
import { switchTheme } from './utils/theme';
import { THEMES } from './constants/themes';
import Sidebar from './components/Sidebar/Sidebar';
import Stage from './components/Stage/Stage';
import { getComponents } from './utils/getComponents';

const app = document.getElementById('app');
app.style.display = 'flex';

const components = getComponents();

const stage = new Stage();

const onComponentSelect = (component) => {
  component
    .module()
    .then((module) => {
      const story = module.Default();
      console.log('Selected component:', story); // Log the selected component
      stage.setComponent(story);
    })
    .catch((error) => {
      console.error('Error loading component module', error);
    });
};

const initializeApp = () => {
  const sidebar = new Sidebar(components, onComponentSelect);

  app.appendChild(sidebar.getElement());
  app.appendChild(stage.getElement());
};

if (!document.querySelector('.sidebar') && !document.querySelector('.stage')) {
  initializeApp();
}

const renderStories = (currentTheme) => {
  console.log(`Rendering stories for theme: ${currentTheme}`);
  switchTheme(currentTheme);
};

// Initial render with default theme
renderStories(THEMES.DEFAULT);

export { default as Button } from './components/Button/Button';
export { default as Sidebar } from './components/Sidebar/Sidebar';
export { default as Stage } from './components/Stage/Stage';
