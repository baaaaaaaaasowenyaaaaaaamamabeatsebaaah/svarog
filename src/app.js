import './styles/index.css';
import './styles/theme-default.css';
import './styles/theme-dark.css';
import { switchTheme } from './utils/theme';
import { THEMES } from './constants/themes';
import Sidebar from './components/storybook/Sidebar/Sidebar';
import Stage from './components/storybook/Stage/Stage';
import { getComponents } from './utils/getComponents';

const app = document.getElementById('app');
app.style.display = 'flex';

const components = getComponents();

const stage = new Stage();

const onStorySelect = (story) => {
  story
    .module()
    .then((module) => {
      const storyComponent = module();
      stage.setComponent(storyComponent);
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Error loading story module', error);
    });
};

const initializeApp = () => {
  const sidebar = new Sidebar(components, onStorySelect);
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
