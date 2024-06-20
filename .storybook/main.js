import '../styles/reset.css';
import './index.css';
import '../styles/default-theme.css';
import '../styles/cabalou-theme.css';

import { getComponents } from '../src/utils/getComponents';
import Sidebar from './components/Sidebar/Sidebar';
import Stage from './components/Stage/Stage';
import HeaderToolbar from './components/HeaderToolbar/HeaderToolbar';
import { switchTheme } from '../src/utils/theme';

const app = document.getElementById('app');

const headerContainer = document.createElement('div');
headerContainer.classList.add('header-container');

const contentContainer = document.createElement('div');
contentContainer.classList.add('content-container');

app.appendChild(headerContainer);
app.appendChild(contentContainer);

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
      console.error('Error loading story module', error);
    });
};

const onSelectTheme = (theme) => {
  console.log(`Switching theme to: ${theme}`);
  switchTheme(theme);
};

const initializeApp = () => {
  const headerToolbar = new HeaderToolbar({ onSelectTheme });
  headerContainer.appendChild(headerToolbar.getElement());

  const sidebar = new Sidebar(components, onStorySelect);
  contentContainer.appendChild(sidebar.getElement());
  contentContainer.appendChild(stage.getElement());
};

if (!document.querySelector('.sidebar') && !document.querySelector('.stage')) {
  initializeApp();
}
