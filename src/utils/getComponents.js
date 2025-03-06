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
    {
      name: 'Input',
      stories: [
        {
          name: 'Default',
          module: () =>
            import('../components/Input/Input.stories.js').then(
              (m) => m.Default
            ),
        },
        {
          name: 'WithValue',
          module: () =>
            import('../components/Input/Input.stories.js').then(
              (m) => m.WithValue
            ),
        },
        {
          name: 'Email',
          module: () =>
            import('../components/Input/Input.stories.js').then((m) => m.Email),
        },
        {
          name: 'Password',
          module: () =>
            import('../components/Input/Input.stories.js').then(
              (m) => m.Password
            ),
        },
        {
          name: 'WithValidation',
          module: () =>
            import('../components/Input/Input.stories.js').then(
              (m) => m.WithValidation
            ),
        },
      ],
    },
    {
      name: 'Select',
      stories: [
        {
          name: 'Default',
          module: () =>
            import('../components/Select/Select.stories.js').then(
              (m) => m.Default
            ),
        },
        {
          name: 'WithValue',
          module: () =>
            import('../components/Select/Select.stories.js').then(
              (m) => m.WithValue
            ),
        },
        {
          name: 'Required',
          module: () =>
            import('../components/Select/Select.stories.js').then(
              (m) => m.Required
            ),
        },
        {
          name: 'Multiple',
          module: () =>
            import('../components/Select/Select.stories.js').then(
              (m) => m.Multiple
            ),
        },
      ],
    },
    {
      name: 'Checkbox',
      stories: [
        {
          name: 'Default',
          module: () =>
            import('../components/Checkbox/Checkbox.stories.js').then(
              (m) => m.Default
            ),
        },
        {
          name: 'Checked',
          module: () =>
            import('../components/Checkbox/Checkbox.stories.js').then(
              (m) => m.Checked
            ),
        },
        {
          name: 'Required',
          module: () =>
            import('../components/Checkbox/Checkbox.stories.js').then(
              (m) => m.Required
            ),
        },
        {
          name: 'Disabled',
          module: () =>
            import('../components/Checkbox/Checkbox.stories.js').then(
              (m) => m.Disabled
            ),
        },
      ],
    },
    {
      name: 'Radio',
      stories: [
        {
          name: 'SingleRadio',
          module: () =>
            import('../components/Radio/Radio.stories.js').then(
              (m) => m.SingleRadio
            ),
        },
        {
          name: 'RadioGroup',
          module: () =>
            import('../components/Radio/Radio.stories.js').then(
              (m) => m.BasicRadioGroup
            ),
        },
        {
          name: 'HorizontalRadioGroup',
          module: () =>
            import('../components/Radio/Radio.stories.js').then(
              (m) => m.HorizontalLayout
            ),
        },
      ],
    },
    {
      name: 'Form',
      stories: [
        {
          name: 'SimpleForm',
          module: () =>
            import('../components/Form/Form.stories.js').then(
              (m) => m.SimpleForm
            ),
        },
        {
          name: 'CompleteForm',
          module: () =>
            import('../components/Form/Form.stories.js').then(
              (m) => m.CompleteForm
            ),
        },
        {
          name: 'HorizontalForm',
          module: () =>
            import('../components/Form/Form.stories.js').then(
              (m) => m.HorizontalForm
            ),
        },
        {
          name: 'FormWithValidation',
          module: () =>
            import('../components/Form/Form.stories.js').then(
              (m) => m.FormWithValidation
            ),
        },
        {
          name: 'FormWithDifferentLabelPositions',
          module: () =>
            import('../components/Form/Form.stories.js').then(
              (m) => m.FormWithDifferentLabelPositions
            ),
        },
      ],
    },

    {
      name: 'Rating',
      stories: [
        {
          name: 'Default',
          module: () =>
            import('../components/Rating/Rating.stories.js').then(
              (m) => m.Default
            ),
        },
        {
          name: 'Facebook',
          module: () =>
            import('../components/Rating/Rating.stories.js').then(
              (m) => m.Facebook
            ),
        },
        {
          name: 'Trustpilot',
          module: () =>
            import('../components/Rating/Rating.stories.js').then(
              (m) => m.Trustpilot
            ),
        },
        {
          name: 'NoImages',
          module: () =>
            import('../components/Rating/Rating.stories.js').then(
              (m) => m.NoImages
            ),
        },
        {
          name: 'LimitedImages',
          module: () =>
            import('../components/Rating/Rating.stories.js').then(
              (m) => m.LimitedImages
            ),
        },
      ],
    },

    {
      name: 'Map',
      stories: [
        {
          name: 'Default',
          module: () =>
            import('../components/Map/Map.stories.js').then((m) => m.Default),
        },
        {
          name: 'SpecificCoordinates',
          module: () =>
            import('../components/Map/Map.stories.js').then(
              (m) => m.SpecificCoordinates
            ),
        },
        {
          name: 'SanFrancisco',
          module: () =>
            import('../components/Map/Map.stories.js').then(
              (m) => m.SanFrancisco
            ),
        },
        {
          name: 'LosAngeles',
          module: () =>
            import('../components/Map/Map.stories.js').then(
              (m) => m.LosAngeles
            ),
        },
        {
          name: 'StoreLocation',
          module: () =>
            import('../components/Map/Map.stories.js').then(
              (m) => m.StoreLocation
            ),
        },
      ],
    },

    {
      name: 'Head',
      stories: [
        {
          name: 'BasicSEO',
          module: () =>
            import('../components/Head/Head.stories.js').then(
              (m) => m.BasicSEO
            ),
        },
        {
          name: 'AdvancedSEO',
          module: () =>
            import('../components/Head/Head.stories.js').then(
              (m) => m.AdvancedSEO
            ),
        },
        {
          name: 'RestrictedIndexing',
          module: () =>
            import('../components/Head/Head.stories.js').then(
              (m) => m.RestrictedIndexing
            ),
        },
        {
          name: 'MultiLanguage',
          module: () =>
            import('../components/Head/Head.stories.js').then(
              (m) => m.MultiLanguage
            ),
        },
      ],
    },
  ];

  return components;
};
