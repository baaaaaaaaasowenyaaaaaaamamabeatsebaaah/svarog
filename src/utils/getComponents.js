export const getComponents = () => {
  // Add your component import paths here
  const components = [
    {
      name: 'Button',
      module: () => import('../components/Button/Button.stories.js'),
    },
    {
      name: 'Sidebar',
      module: () => import('../components/Sidebar/Sidebar.stories.js'),
    },
    {
      name: 'Stage',
      module: () => import('../components/Stage/Stage.stories.js'),
    },
  ];

  return components;
};
