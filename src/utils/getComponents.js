// src/utils/getComponents.js

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
      name: 'Card',
      stories: [
        {
          name: 'Default',
          module: () =>
            import('../components/Card/Card.stories.js').then((m) => m.Default),
        },
        {
          name: 'WithImage',
          module: () =>
            import('../components/Card/Card.stories.js').then(
              (m) => m.WithImage
            ),
        },
        {
          name: 'WithFooter',
          module: () =>
            import('../components/Card/Card.stories.js').then(
              (m) => m.WithFooter
            ),
        },
        {
          name: 'Outlined',
          module: () =>
            import('../components/Card/Card.stories.js').then(
              (m) => m.Outlined
            ),
        },
        {
          name: 'Elevated',
          module: () =>
            import('../components/Card/Card.stories.js').then(
              (m) => m.Elevated
            ),
        },
        {
          name: 'ComplexCard',
          module: () =>
            import('../components/Card/Card.stories.js').then(
              (m) => m.ComplexCard
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
    {
      name: 'Section',
      stories: [
        {
          name: 'Default',
          module: () =>
            import('../components/Section/Section.stories.js').then(
              (m) => m.Default
            ),
        },
        {
          name: 'MinorVariant',
          module: () =>
            import('../components/Section/Section.stories.js').then(
              (m) => m.MinorVariant
            ),
        },
        {
          name: 'WithBackgroundImage',
          module: () =>
            import('../components/Section/Section.stories.js').then(
              (m) => m.WithBackgroundImage
            ),
        },
        {
          name: 'NoPaddingBottom',
          module: () =>
            import('../components/Section/Section.stories.js').then(
              (m) => m.NoPaddingBottom
            ),
        },
      ],
    },
    {
      name: 'Navigation',
      stories: [
        {
          name: 'Default',
          module: () =>
            import('../components/Navigation/Navigation.stories.js').then(
              (m) => m.Default
            ),
        },
      ],
    },
    {
      name: 'Logo',
      stories: [
        {
          name: 'Default',
          module: () =>
            import('../components/Logo/Logo.stories.js').then((m) => m.Default),
        },
      ],
    },
  ];

  return components;
};
