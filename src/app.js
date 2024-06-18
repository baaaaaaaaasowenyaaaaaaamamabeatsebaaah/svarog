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
      // eslint-disable-next-line no-console
      console.log('Selected component:', story); // Log the selected component
      stage.setComponent(story);
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
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
  // eslint-disable-next-line no-console
  console.log(`Rendering stories for theme: ${currentTheme}`);
  switchTheme(currentTheme);
};

// Initial render with default theme
renderStories(THEMES.DEFAULT);
