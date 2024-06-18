import Sidebar from './Sidebar';

export default {
  title: 'Sidebar',
};

export const Default = () => {
  const components = [
    { name: 'Button', module: () => import('../Button/Button.stories.js') },
    { name: 'Stage', module: () => import('../Stage/Stage.stories.js') },
  ];
  const onComponentSelect = (component) => {
    component
      .module()
      .then((module) => {
        const story = module.Default();
        if (story.getElement) {
          document.getElementById('stage').innerHTML = '';
          document.getElementById('stage').appendChild(story.getElement());
        } else {
          console.error(
            'Selected component does not have getElement method',
            story
          );
        }
      })
      .catch((error) => {
        console.error('Error loading component module', error);
      });
  };

  const sidebar = new Sidebar(components, onComponentSelect);
  return sidebar; // Return the Sidebar instance
};
