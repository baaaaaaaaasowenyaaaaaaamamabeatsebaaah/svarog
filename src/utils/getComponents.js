export const getComponents = () => {
  const components = [
    {
      name: 'Button',
      stories: [
        {
          name: 'Default',
          module: () =>
            import('../components/Button/Button.stories.js').then(
              (m) => m.Default
            ),
        },
        {
          name: 'Disabled',
          module: () =>
            import('../components/Button/Button.stories.js').then(
              (m) => m.Disabled
            ),
        },
      ],
    },
    {
      name: 'Grid',
      stories: [
        {
          name: 'Default',
          module: () =>
            import('../components/Grid/Grid.stories.js').then((m) => m.Default),
        },
      ],
    },
    {
      name: 'Link',
      stories: [
        {
          name: 'Default',
          module: () =>
            import('../components/Link/Link.stories.js').then((m) => m.Default),
        },
        {
          name: 'BlockLink',
          module: () =>
            import('../components/Link/Link.stories.js').then(
              (m) => m.BlockLink
            ),
        },
      ],
    },
    {
      name: 'Typography',
      stories: [
        {
          name: 'Default',
          module: () =>
            import('../components/Typography/Typography.stories.js').then(
              (m) => m.Default
            ),
        },

        {
          name: 'Heading',
          module: () =>
            import('../components/Typography/Typography.stories.js').then(
              (m) => m.Heading
            ),
        },
        {
          name: 'Italic',
          module: () =>
            import('../components/Typography/Typography.stories.js').then(
              (m) => m.Italic
            ),
        },
      ],
    },
  ];

  return components;
};
