// .storybook/main.js
// Set a flag before importing themeManager to prevent auto-initialization
window.__STORYBOOK_DISABLE_THEME_INIT__ = true;

import '../src/styles/index.js';
import './index.css';
import { getComponents } from '../src/utils/getComponents.js';
import { getPrototypes } from '../src/utils/getPrototypes.js';
import Sidebar from './components/Sidebar/Sidebar.js';
import Stage from './components/Stage/Stage.js';
import HeaderToolbar from './components/HeaderToolbar/HeaderToolbar.js';
import themeManager, {
  loadTheme,
  switchTheme,
} from '../src/utils/themeManager.js';

const app = document.getElementById('app');

const headerContainer = document.createElement('div');
headerContainer.classList.add('header-container');

const contentContainer = document.createElement('div');
contentContainer.classList.add('content-container');

app.appendChild(headerContainer);
app.appendChild(contentContainer);

const components = getComponents();
const prototypes = getPrototypes();
const stage = new Stage();

let currentStoryLoadToken = null;

const onStorySelect = (story) => {
  const loadToken = {};
  currentStoryLoadToken = loadToken;

  story
    .module()
    .then((module) => {
      if (currentStoryLoadToken !== loadToken) return;
      console.log('Story module loaded:', module);
      const storyFunction = module();
      console.log('Story function result:', storyFunction);

      // Check what we got from the story
      if (storyFunction && typeof storyFunction.getElement === 'function') {
        console.log('Story returned component with getElement');
        stage.setComponent(storyFunction);
      } else if (storyFunction instanceof HTMLElement) {
        console.log('Story returned HTMLElement');
        stage.setComponent(storyFunction);
      } else {
        console.error('Story did not return a valid component', storyFunction);
        const errorElement = document.createElement('div');
        errorElement.style.padding = '20px';
        errorElement.style.color = '#dc3545';
        errorElement.innerHTML = `<h3>Invalid Story Component</h3><p>The story must return either an HTMLElement or an object with a getElement() method.</p>`;
        stage.setComponent(errorElement);
      }
    })
    .catch((error) => {
      if (currentStoryLoadToken !== loadToken) return;
      console.error('Error loading story module', error);
      const errorElement = document.createElement('div');
      errorElement.style.padding = '20px';
      errorElement.style.color = '#dc3545';
      errorElement.innerHTML = `<h3>Error Loading Story</h3><p>${error.message}</p>`;
      stage.setComponent(errorElement);
    });
};

const onSelectTheme = async (theme) => {
  console.log(`Main: Switching theme to: ${theme}`);

  try {
    // Save theme preference
    localStorage.setItem('svarog-storybook-theme', theme);
    console.log('Main: Theme saved to localStorage:', theme);

    // Use loadTheme which will fall back to switchTheme in legacy mode
    await loadTheme(theme);

    // Verify the selector is in sync
    const themeSelector = document.querySelector('.theme-selector');
    if (themeSelector && themeSelector.value !== theme) {
      console.log(
        'Main: Updating selector from',
        themeSelector.value,
        'to',
        theme
      );
      themeSelector.value = theme;
    }

    // Force re-render of the current story if one is loaded
    setTimeout(() => {
      const activeStoryLink = document.querySelector('.story-link.active');
      if (activeStoryLink) {
        console.log('Main: Refreshing current story with new theme');
        activeStoryLink.click();
      }
    }, 100);
  } catch (error) {
    console.error('Main: Failed to load theme:', error);
  }
};

const initializeApp = async () => {
  // Get saved theme from localStorage
  const savedTheme =
    localStorage.getItem('svarog-storybook-theme') || 'default';
  console.log('Main: Initializing with saved theme:', savedTheme);

  // Manually initialize themeManager with the correct theme
  themeManager.loadBaseVariables();
  switchTheme(savedTheme);

  // Create UI components
  const headerToolbar = new HeaderToolbar({
    onSelectTheme,
    initialTheme: savedTheme,
  });

  headerContainer.appendChild(headerToolbar.getElement());

  // Listen for theme changes to keep selector in sync
  themeManager.onThemeChange((newTheme, oldTheme) => {
    console.log('Main: Theme changed externally:', oldTheme, '->', newTheme);
    const themeSelector = document.querySelector('.theme-selector');
    if (themeSelector && themeSelector.value !== newTheme) {
      themeSelector.value = newTheme;
    }
  });

  const sidebar = new Sidebar(components, prototypes, onStorySelect);
  contentContainer.appendChild(sidebar.getElement());
  contentContainer.appendChild(stage.getElement());

  // Try to load the last viewed story if available
  try {
    const lastStoryJson = localStorage.getItem('svarog-storybook-last-story');
    if (lastStoryJson) {
      const storyData = JSON.parse(lastStoryJson);
      console.log('Attempting to restore last viewed story:', storyData.name);

      // Allow the DOM to render fully before attempting to find and select the story
      setTimeout(() => {
        const storyLinks = document.querySelectorAll('.story-link');
        storyLinks.forEach((link) => {
          if (link.textContent === storyData.name) {
            link.click();
          }
        });
      }, 100);
    }
  } catch (error) {
    console.debug('Could not restore last story', error);
  }
};

// Initialize the app only once
if (!document.querySelector('.sidebar') && !document.querySelector('.stage')) {
  initializeApp();
}
