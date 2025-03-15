// .storybook/main.js
import '../src/styles/index.js';
import './index.css';
import { getComponents } from '../src/utils/getComponents.js';
import { getPrototypes } from '../src/utils/getPrototypes.js';
import Sidebar from './components/Sidebar/Sidebar.js';
import Stage from './components/Stage/Stage.js';
import HeaderToolbar from './components/HeaderToolbar/HeaderToolbar.js';
import { switchTheme, getCurrentTheme } from '../src/utils/theme.js';

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

const onStorySelect = (story) => {
  story
    .module()
    .then((module) => {
      const storyComponent = module();
      stage.setComponent(storyComponent);

      // Remember the last viewed story in localStorage
      try {
        localStorage.setItem(
          'svarog-storybook-last-story',
          JSON.stringify({
            name: story.name,
          })
        );
      } catch (error) {
        console.debug('Could not save story to localStorage', error);
      }
    })
    .catch((error) => {
      console.error('Error loading story module', error);
      // Show an error state in the stage
      const errorElement = document.createElement('div');
      errorElement.style.padding = '20px';
      errorElement.style.color = '#dc3545';
      errorElement.innerHTML = `<h3>Error Loading Story</h3><p>${error.message}</p>`;
      stage.setComponent(errorElement);
    });
};

const onSelectTheme = (theme) => {
  // Update UI to indicate current theme
  const themeSelector = document.querySelector('.theme-selector');
  if (themeSelector) {
    Array.from(themeSelector.options).forEach((option) => {
      if (option.value === theme) {
        option.selected = true;
      }
    });
  }

  // Store selected theme in localStorage before switching
  try {
    localStorage.setItem('svarog-storybook-theme', theme);
    console.log('Main: Theme saved to localStorage:', theme);
  } catch (error) {
    console.debug('Main: Could not save theme to localStorage', error);
  }

  // Apply the theme - this dispatches the 'themechange' event that preview.js listens for
  console.log(`Main: Switching theme to: ${theme}`);
  switchTheme(theme);

  // Force re-render of the current story if one is loaded
  setTimeout(() => {
    const activeStoryLink = document.querySelector('.story-link.active');
    if (activeStoryLink) {
      console.log('Main: Refreshing current story with new theme');
      activeStoryLink.click();
    }
  }, 100);
};

// Ensure theme is fully applied during initialization
const applyInitialTheme = () => {
  // Get theme from localStorage or use default
  let savedTheme;
  try {
    savedTheme = localStorage.getItem('svarog-storybook-theme');
    console.log('Main: Found saved theme in localStorage:', savedTheme);
  } catch (error) {
    console.debug('Main: Could not read theme from localStorage', error);
  }

  // Make sure we have a valid theme
  const themeToApply = savedTheme || getCurrentTheme() || 'default';
  console.log('Main: Using initial theme:', themeToApply);

  return themeToApply;
};

const initializeApp = () => {
  // Apply theme first to ensure it's ready before components load
  const initialTheme = applyInitialTheme();

  const headerToolbar = new HeaderToolbar({
    onSelectTheme,
    initialTheme,
  });
  headerContainer.appendChild(headerToolbar.getElement());

  const sidebar = new Sidebar(components, prototypes, onStorySelect);
  contentContainer.appendChild(sidebar.getElement());
  contentContainer.appendChild(stage.getElement());

  // Initialize the theme selector but don't trigger a theme change yet
  // Let preview.js handle the initial theme application
  console.log('Main: Initializing with theme:', initialTheme);

  // Try to load the last viewed story if available
  try {
    const lastStoryJson = localStorage.getItem('svarog-storybook-last-story');
    if (lastStoryJson) {
      const storyData = JSON.parse(lastStoryJson);
      console.log('Attempting to restore last viewed story:', storyData.name);

      // Allow the DOM to render fully before attempting to find and select the story
      setTimeout(() => {
        // Find the matching story in our components and prototypes
        const findAndSelectStory = (items) => {
          for (const component of items) {
            for (const story of component.stories) {
              if (story.name === storyData.name) {
                console.log('Found last story, loading it:', story.name);

                // Find the component item and expand it
                const componentItems =
                  document.querySelectorAll('.component-item');
                componentItems.forEach((item) => {
                  const storyLinks = item.querySelectorAll('.story-link');
                  storyLinks.forEach((link) => {
                    if (link.textContent === story.name) {
                      // Expand the component
                      item.classList.add('expanded');

                      // Click the story link
                      link.click();
                    }
                  });
                });

                return true;
              }
            }
          }
          return false;
        };

        // Try to find the story in both components and prototypes
        if (!findAndSelectStory(components)) {
          findAndSelectStory(prototypes);
        }
      }, 100); // Small delay to ensure DOM is ready
    }
  } catch (error) {
    console.debug('Could not restore last story', error);
  }
};

if (!document.querySelector('.sidebar') && !document.querySelector('.stage')) {
  initializeApp();
}
