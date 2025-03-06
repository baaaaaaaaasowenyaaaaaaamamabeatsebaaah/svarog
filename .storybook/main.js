import '../src/styles/index.js';
import './index.css';
import { getComponents } from '../src/utils/getComponents.js';
import Sidebar from './components/Sidebar/Sidebar.js';
import Stage from './components/Stage/Stage.js';
import HeaderToolbar from './components/HeaderToolbar/HeaderToolbar.js';
import { switchTheme } from '../src/utils/theme.js';

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
