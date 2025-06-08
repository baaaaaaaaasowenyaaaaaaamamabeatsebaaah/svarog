// src/utils/getComponents.js

export const getComponents = () => {
  const components = [
    // =========================================
    // FOUNDATION COMPONENTS
    // =========================================
    {
      name: 'Typography',
      category: 'Foundation',
      stories: [
        {
          name: 'AllHeadings',
          module: () =>
            import('../components/Typography/Typography.stories.js').then(
              (m) => m.AllHeadings
            ),
        },
        {
          name: 'TextElements',
          module: () =>
            import('../components/Typography/Typography.stories.js').then(
              (m) => m.TextElements
            ),
        },
        {
          name: 'TextAlignments',
          module: () =>
            import('../components/Typography/Typography.stories.js').then(
              (m) => m.TextAlignments
            ),
        },
        {
          name: 'FontWeights',
          module: () =>
            import('../components/Typography/Typography.stories.js').then(
              (m) => m.FontWeights
            ),
        },
        {
          name: 'FontStyles',
          module: () =>
            import('../components/Typography/Typography.stories.js').then(
              (m) => m.FontStyles
            ),
        },
        {
          name: 'Colors',
          module: () =>
            import('../components/Typography/Typography.stories.js').then(
              (m) => m.Colors
            ),
        },
        {
          name: 'CustomSizes',
          module: () =>
            import('../components/Typography/Typography.stories.js').then(
              (m) => m.CustomSizes
            ),
        },
        {
          name: 'InlineVsBlock',
          module: () =>
            import('../components/Typography/Typography.stories.js').then(
              (m) => m.InlineVsBlock
            ),
        },
        {
          name: 'WithCustomClasses',
          module: () =>
            import('../components/Typography/Typography.stories.js').then(
              (m) => m.WithCustomClasses
            ),
        },
        {
          name: 'WithCustomId',
          module: () =>
            import('../components/Typography/Typography.stories.js').then(
              (m) => m.WithCustomId
            ),
        },
        {
          name: 'ComplexContent',
          module: () =>
            import('../components/Typography/Typography.stories.js').then(
              (m) => m.ComplexContent
            ),
        },
        {
          name: 'WithNestedElements',
          module: () =>
            import('../components/Typography/Typography.stories.js').then(
              (m) => m.WithNestedElements
            ),
        },
        {
          name: 'CombinedFeatures',
          module: () =>
            import('../components/Typography/Typography.stories.js').then(
              (m) => m.CombinedFeatures
            ),
        },
        {
          name: 'ResponsiveTypography',
          module: () =>
            import('../components/Typography/Typography.stories.js').then(
              (m) => m.ResponsiveTypography
            ),
        },
      ],
    },
    {
      name: 'Button',
      category: 'Foundation',
      stories: [
        {
          name: 'Default',
          module: () =>
            import('../components/Button/Button.stories.js').then(
              (m) => m.Default
            ),
        },
        {
          name: 'Primary',
          module: () =>
            import('../components/Button/Button.stories.js').then(
              (m) => m.Primary
            ),
        },
        {
          name: 'Secondary',
          module: () =>
            import('../components/Button/Button.stories.js').then(
              (m) => m.Secondary
            ),
        },
        {
          name: 'Text',
          module: () =>
            import('../components/Button/Button.stories.js').then(
              (m) => m.Text
            ),
        },
        {
          name: 'Success',
          module: () =>
            import('../components/Button/Button.stories.js').then(
              (m) => m.Success
            ),
        },
        {
          name: 'Danger',
          module: () =>
            import('../components/Button/Button.stories.js').then(
              (m) => m.Danger
            ),
        },
        {
          name: 'Outlined',
          module: () =>
            import('../components/Button/Button.stories.js').then(
              (m) => m.Outlined
            ),
        },
        {
          name: 'IconButton',
          module: () =>
            import('../components/Button/Button.stories.js').then(
              (m) => m.IconButton
            ),
        },
        {
          name: 'Small',
          module: () =>
            import('../components/Button/Button.stories.js').then(
              (m) => m.Small
            ),
        },
        {
          name: 'Large',
          module: () =>
            import('../components/Button/Button.stories.js').then(
              (m) => m.Large
            ),
        },
        {
          name: 'Disabled',
          module: () =>
            import('../components/Button/Button.stories.js').then(
              (m) => m.Disabled
            ),
        },
        {
          name: 'WithCustomClass',
          module: () =>
            import('../components/Button/Button.stories.js').then(
              (m) => m.WithCustomClass
            ),
        },
        {
          name: 'AllVariants',
          module: () =>
            import('../components/Button/Button.stories.js').then(
              (m) => m.AllVariants
            ),
        },
        {
          name: 'ButtonWithIcon',
          module: () =>
            import('../components/Button/Button.stories.js').then(
              (m) => m.ButtonWithIcon
            ),
        },
        {
          name: 'ButtonIconRight',
          module: () =>
            import('../components/Button/Button.stories.js').then(
              (m) => m.ButtonIconRight
            ),
        },
      ],
    },
    {
      name: 'Link',
      category: 'Foundation',
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

    // =========================================
    // LAYOUT COMPONENTS
    // =========================================
    {
      name: 'Accordion',
      category: 'Layout',
      stories: [
        {
          name: 'Default',
          module: () =>
            import('../components/Accordion/Accordion.stories.js').then(
              (m) => m.Default
            ),
        },
        {
          name: 'SingleMode',
          module: () =>
            import('../components/Accordion/Accordion.stories.js').then(
              (m) => m.SingleMode
            ),
        },
        {
          name: 'WithDefaultExpanded',
          module: () =>
            import('../components/Accordion/Accordion.stories.js').then(
              (m) => m.WithDefaultExpanded
            ),
        },
        {
          name: 'WithHTMLContent',
          module: () =>
            import('../components/Accordion/Accordion.stories.js').then(
              (m) => m.WithHTMLContent
            ),
        },
        {
          name: 'WithComponents',
          module: () =>
            import('../components/Accordion/Accordion.stories.js').then(
              (m) => m.WithComponents
            ),
        },
        {
          name: 'BorderedVariant',
          module: () =>
            import('../components/Accordion/Accordion.stories.js').then(
              (m) => m.BorderedVariant
            ),
        },
        {
          name: 'MinimalVariant',
          module: () =>
            import('../components/Accordion/Accordion.stories.js').then(
              (m) => m.MinimalVariant
            ),
        },
        {
          name: 'FlushVariant',
          module: () =>
            import('../components/Accordion/Accordion.stories.js').then(
              (m) => m.FlushVariant
            ),
        },
        {
          name: 'WithCallback',
          module: () =>
            import('../components/Accordion/Accordion.stories.js').then(
              (m) => m.WithCallback
            ),
        },
        {
          name: 'ProgrammaticControl',
          module: () =>
            import('../components/Accordion/Accordion.stories.js').then(
              (m) => m.ProgrammaticControl
            ),
        },
        {
          name: 'LongContent',
          module: () =>
            import('../components/Accordion/Accordion.stories.js').then(
              (m) => m.LongContent
            ),
        },
        {
          name: 'AllVariants',
          module: () =>
            import('../components/Accordion/Accordion.stories.js').then(
              (m) => m.AllVariants
            ),
        },
      ],
    },
    {
      name: 'Grid',
      category: 'Layout',
      stories: [
        {
          name: 'TwoColumns',
          module: () =>
            import('../components/Grid/Grid.stories.js').then(
              (m) => m.TwoColumns
            ),
        },
        {
          name: 'ThreeColumns',
          module: () =>
            import('../components/Grid/Grid.stories.js').then(
              (m) => m.ThreeColumns
            ),
        },
        {
          name: 'ResponsiveGrid',
          module: () =>
            import('../components/Grid/Grid.stories.js').then(
              (m) => m.ResponsiveGrid
            ),
        },
        {
          name: 'FullyResponsive',
          module: () =>
            import('../components/Grid/Grid.stories.js').then(
              (m) => m.FullyResponsive
            ),
        },
        {
          name: 'ComplexResponsiveLayout',
          module: () =>
            import('../components/Grid/Grid.stories.js').then(
              (m) => m.ComplexResponsiveLayout
            ),
        },
        {
          name: 'DesktopOffset',
          module: () =>
            import('../components/Grid/Grid.stories.js').then(
              (m) => m.DesktopOffset
            ),
        },
      ],
    },
    {
      name: 'Section',
      category: 'Layout',
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
        {
          name: 'WithTitleAndDescription',
          module: () =>
            import('../components/Section/Section.stories.js').then(
              (m) => m.WithTitleAndDescription
            ),
        },
        {
          name: 'WithBackgroundColor',
          module: () =>
            import('../components/Section/Section.stories.js').then(
              (m) => m.WithCustomBackgroundColor
            ),
        },
        {
          name: 'WithIdForAnchor',
          module: () =>
            import('../components/Section/Section.stories.js').then(
              (m) => m.WithIdForAnchor
            ),
        },
        {
          name: 'BackgroundColorAndImage',
          module: () =>
            import('../components/Section/Section.stories.js').then(
              (m) => m.BackgroundColorAndImage
            ),
        },
        {
          name: 'ComprehensiveExample',
          module: () =>
            import('../components/Section/Section.stories.js').then(
              (m) => m.ComprehensiveExample
            ),
        },
      ],
    },
    {
      name: 'Card',
      category: 'Layout',
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
      name: 'Tabs',
      category: 'Layout',
      stories: [
        {
          name: 'Default',
          module: () =>
            import('../components/Tabs/Tabs.stories.js').then((m) => m.Default),
        },
        {
          name: 'SimpleVariant',
          module: () =>
            import('../components/Tabs/Tabs.stories.js').then(
              (m) => m.SimpleVariant
            ),
        },
        {
          name: 'BorderVariant',
          module: () =>
            import('../components/Tabs/Tabs.stories.js').then(
              (m) => m.BorderVariant
            ),
        },
        {
          name: 'WithComponents',
          module: () =>
            import('../components/Tabs/Tabs.stories.js').then(
              (m) => m.WithComponents
            ),
        },
        {
          name: 'WithDefaultActiveTab',
          module: () =>
            import('../components/Tabs/Tabs.stories.js').then(
              (m) => m.WithDefaultActiveTab
            ),
        },
        {
          name: 'WithCallback',
          module: () =>
            import('../components/Tabs/Tabs.stories.js').then(
              (m) => m.WithCallback
            ),
        },
        {
          name: 'WithCustomStyling',
          module: () =>
            import('../components/Tabs/Tabs.stories.js').then(
              (m) => m.WithCustomStyling
            ),
        },
        {
          name: 'WithHTMLContent',
          module: () =>
            import('../components/Tabs/Tabs.stories.js').then(
              (m) => m.WithHTMLContent
            ),
        },
        {
          name: 'AllVariants',
          module: () =>
            import('../components/Tabs/Tabs.stories.js').then(
              (m) => m.AllVariants
            ),
        },
        {
          name: 'TabAlignments',
          module: () =>
            import('../components/Tabs/Tabs.stories.js').then(
              (m) => m.TabAlignments
            ),
        },
      ],
    },

    // =========================================
    // NAVIGATION COMPONENTS
    // =========================================
    {
      name: 'Navigation',
      category: 'Navigation',
      stories: [
        {
          name: 'Default',
          module: () =>
            import('../components/Navigation/Navigation.stories.js').then(
              (m) => m.Default
            ),
        },
        {
          name: 'WithSubmenuShadow',
          module: () =>
            import('../components/Navigation/Navigation.stories.js').then(
              (m) => m.WithSubmenuShadow
            ),
        },
        {
          name: 'Vertical',
          module: () =>
            import('../components/Navigation/Navigation.stories.js').then(
              (m) => m.Vertical
            ),
        },
        {
          name: 'WithActiveItem',
          module: () =>
            import('../components/Navigation/Navigation.stories.js').then(
              (m) => m.WithActiveItem
            ),
        },
        {
          name: 'BurgerRight',
          module: () =>
            import('../components/Navigation/Navigation.stories.js').then(
              (m) => m.BurgerRight
            ),
        },
        {
          name: 'NonExpandable',
          module: () =>
            import('../components/Navigation/Navigation.stories.js').then(
              (m) => m.NonExpandable
            ),
        },
        {
          name: 'WithItemSelectionCallback',
          module: () =>
            import('../components/Navigation/Navigation.stories.js').then(
              (m) => m.WithItemSelectionCallback
            ),
        },
        {
          name: 'MobileWithLogo',
          module: () =>
            import('../components/Navigation/Navigation.stories.js').then(
              (m) => m.MobileWithLogo
            ),
        },
        {
          name: 'CustomStyling',
          module: () =>
            import('../components/Navigation/Navigation.stories.js').then(
              (m) => m.CustomStyling
            ),
        },
        {
          name: 'ProgrammaticControl',
          module: () =>
            import('../components/Navigation/Navigation.stories.js').then(
              (m) => m.CustomStyling
            ),
        },
      ],
    },
    {
      name: 'Pagination',
      category: 'Navigation',
      stories: [
        {
          name: 'Default',
          module: () =>
            import('../components/Pagination/Pagination.stories.js').then(
              (m) => m.Default
            ),
        },
        {
          name: 'MiddlePage',
          module: () =>
            import('../components/Pagination/Pagination.stories.js').then(
              (m) => m.MiddlePage
            ),
        },
        {
          name: 'LastPage',
          module: () =>
            import('../components/Pagination/Pagination.stories.js').then(
              (m) => m.LastPage
            ),
        },
        {
          name: 'ManyPages',
          module: () =>
            import('../components/Pagination/Pagination.stories.js').then(
              (m) => m.ManyPages
            ),
        },
        {
          name: 'FewPages',
          module: () =>
            import('../components/Pagination/Pagination.stories.js').then(
              (m) => m.FewPages
            ),
        },
        {
          name: 'SinglePage',
          module: () =>
            import('../components/Pagination/Pagination.stories.js').then(
              (m) => m.SinglePage
            ),
        },
        {
          name: 'WithCustomSiblingCount',
          module: () =>
            import('../components/Pagination/Pagination.stories.js').then(
              (m) => m.WithCustomSiblingCount
            ),
        },
      ],
    },

    // =========================================
    // FORM COMPONENTS
    // =========================================
    {
      name: 'Input',
      category: 'Form',
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
        {
          name: 'Number',
          module: () =>
            import('../components/Input/Input.stories.js').then(
              (m) => m.Number
            ),
        },
        {
          name: 'Required',
          module: () =>
            import('../components/Input/Input.stories.js').then(
              (m) => m.Required
            ),
        },
        {
          name: 'Disabled',
          module: () =>
            import('../components/Input/Input.stories.js').then(
              (m) => m.Disabled
            ),
        },
        {
          name: 'Pattern',
          module: () =>
            import('../components/Input/Input.stories.js').then(
              (m) => m.Pattern
            ),
        },
        {
          name: 'MinMaxLength',
          module: () =>
            import('../components/Input/Input.stories.js').then(
              (m) => m.MinMaxLength
            ),
        },
        {
          name: 'Search',
          module: () =>
            import('../components/Input/Input.stories.js').then(
              (m) => m.Search
            ),
        },
      ],
    },
    {
      name: 'Select',
      category: 'Form',
      stories: [
        // Basic stories
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
        {
          name: 'Disabled',
          module: () =>
            import('../components/Select/Select.stories.js').then(
              (m) => m.Disabled
            ),
        },
        {
          name: 'GroupedOptions',
          module: () =>
            import('../components/Select/Select.stories.js').then(
              (m) => m.GroupedOptions
            ),
        },
        // Validation stories
        {
          name: 'ValidState',
          module: () =>
            import('../components/Select/Select.stories.js').then(
              (m) => m.ValidState
            ),
        },
        {
          name: 'InvalidState',
          module: () =>
            import('../components/Select/Select.stories.js').then(
              (m) => m.InvalidState
            ),
        },
        {
          name: 'WithValidation',
          module: () =>
            import('../components/Select/Select.stories.js').then(
              (m) => m.WithValidation
            ),
        },
        // NEW: Loading and async stories
        {
          name: 'LoadingState',
          module: () =>
            import('../components/Select/Select.stories.js').then(
              (m) => m.LoadingState
            ),
        },
        {
          name: 'EmptyState',
          module: () =>
            import('../components/Select/Select.stories.js').then(
              (m) => m.EmptyState
            ),
        },
        {
          name: 'AutoLoading',
          module: () =>
            import('../components/Select/Select.stories.js').then(
              (m) => m.AutoLoading
            ),
        },
        {
          name: 'ManualLoading',
          module: () =>
            import('../components/Select/Select.stories.js').then(
              (m) => m.ManualLoading
            ),
        },
        {
          name: 'DependentSelects',
          module: () =>
            import('../components/Select/Select.stories.js').then(
              (m) => m.DependentSelects
            ),
        },
        {
          name: 'WithErrorHandling',
          module: () =>
            import('../components/Select/Select.stories.js').then(
              (m) => m.WithErrorHandling
            ),
        },
        {
          name: 'MultipleWithLoading',
          module: () =>
            import('../components/Select/Select.stories.js').then(
              (m) => m.MultipleWithLoading
            ),
        },
      ],
    },
    {
      name: 'Checkbox',
      category: 'Form',
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
        {
          name: 'DisabledChecked',
          module: () =>
            import('../components/Checkbox/Checkbox.stories.js').then(
              (m) => m.DisabledChecked
            ),
        },
        {
          name: 'WithValidation',
          module: () =>
            import('../components/Checkbox/Checkbox.stories.js').then(
              (m) => m.WithValidation
            ),
        },
        {
          name: 'Indeterminate',
          module: () =>
            import('../components/Checkbox/Checkbox.stories.js').then(
              (m) => m.Indeterminate
            ),
        },
        {
          name: 'Multiple',
          module: () =>
            import('../components/Checkbox/Checkbox.stories.js').then(
              (m) => m.Multiple
            ),
        },
        {
          name: 'CustomStyling',
          module: () =>
            import('../components/Checkbox/Checkbox.stories.js').then(
              (m) => m.CustomStyling
            ),
        },
      ],
    },
    {
      name: 'Radio',
      category: 'Form',
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
        {
          name: 'CheckedRadio',
          module: () =>
            import('../components/Radio/Radio.stories.js').then(
              (m) => m.CheckedRadio
            ),
        },
        {
          name: 'DisabledRadio',
          module: () =>
            import('../components/Radio/Radio.stories.js').then(
              (m) => m.DisabledRadio
            ),
        },
        {
          name: 'DisabledCheckedRadio',
          module: () =>
            import('../components/Radio/Radio.stories.js').then(
              (m) => m.DisabledCheckedRadio
            ),
        },
        {
          name: 'RequiredRadio',
          module: () =>
            import('../components/Radio/Radio.stories.js').then(
              (m) => m.RequiredRadio
            ),
        },
        {
          name: 'WithSelectedValue',
          module: () =>
            import('../components/Radio/Radio.stories.js').then(
              (m) => m.WithSelectedValue
            ),
        },
        {
          name: 'RequiredGroup',
          module: () =>
            import('../components/Radio/Radio.stories.js').then(
              (m) => m.RequiredGroup
            ),
        },
        {
          name: 'DisabledGroup',
          module: () =>
            import('../components/Radio/Radio.stories.js').then(
              (m) => m.DisabledGroup
            ),
        },
        {
          name: 'MixedDisabled',
          module: () =>
            import('../components/Radio/Radio.stories.js').then(
              (m) => m.MixedDisabled
            ),
        },
        {
          name: 'ProgrammaticControl',
          module: () =>
            import('../components/Radio/Radio.stories.js').then(
              (m) => m.ProgrammaticControl
            ),
        },
      ],
    },
    {
      name: 'Form',
      category: 'Form',
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
        {
          name: 'NoLabelsValidation',
          module: () =>
            import('../components/Form/Form.stories.js').then(
              (m) => m.NoLabelsValidation
            ),
        },
      ],
    },

    {
      name: 'Textarea',
      category: 'Form',
      stories: [
        {
          name: 'Default',
          module: () =>
            import('../components/Textarea/Textarea.stories.js').then(
              (m) => m.Default
            ),
        },
        {
          name: 'WithValue',
          module: () =>
            import('../components/Textarea/Textarea.stories.js').then(
              (m) => m.WithValue
            ),
        },
        {
          name: 'Required',
          module: () =>
            import('../components/Textarea/Textarea.stories.js').then(
              (m) => m.Required
            ),
        },
        {
          name: 'Disabled',
          module: () =>
            import('../components/Textarea/Textarea.stories.js').then(
              (m) => m.Disabled
            ),
        },
        {
          name: 'Readonly',
          module: () =>
            import('../components/Textarea/Textarea.stories.js').then(
              (m) => m.Readonly
            ),
        },
        {
          name: 'WithRows',
          module: () =>
            import('../components/Textarea/Textarea.stories.js').then(
              (m) => m.WithRows
            ),
        },
        {
          name: 'WithCharacterCount',
          module: () =>
            import('../components/Textarea/Textarea.stories.js').then(
              (m) => m.WithCharacterCount
            ),
        },
        {
          name: 'WithMaxLength',
          module: () =>
            import('../components/Textarea/Textarea.stories.js').then(
              (m) => m.WithMaxLength
            ),
        },
        {
          name: 'AutoResize',
          module: () =>
            import('../components/Textarea/Textarea.stories.js').then(
              (m) => m.AutoResize
            ),
        },
        {
          name: 'NoResize',
          module: () =>
            import('../components/Textarea/Textarea.stories.js').then(
              (m) => m.NoResize
            ),
        },
        {
          name: 'WithValidation',
          module: () =>
            import('../components/Textarea/Textarea.stories.js').then(
              (m) => m.WithValidation
            ),
        },
        {
          name: 'Loading',
          module: () =>
            import('../components/Textarea/Textarea.stories.js').then(
              (m) => m.Loading
            ),
        },
        {
          name: 'ValidState',
          module: () =>
            import('../components/Textarea/Textarea.stories.js').then(
              (m) => m.ValidState
            ),
        },
        {
          name: 'InvalidState',
          module: () =>
            import('../components/Textarea/Textarea.stories.js').then(
              (m) => m.InvalidState
            ),
        },
        {
          name: 'WithCustomStyling',
          module: () =>
            import('../components/Textarea/Textarea.stories.js').then(
              (m) => m.WithCustomStyling
            ),
        },
        {
          name: 'AllFeatures',
          module: () =>
            import('../components/Textarea/Textarea.stories.js').then(
              (m) => m.AllFeatures
            ),
        },
        {
          name: 'FormIntegration',
          module: () =>
            import('../components/Textarea/Textarea.stories.js').then(
              (m) => m.FormIntegration
            ),
        },
        {
          name: 'DynamicUpdates',
          module: () =>
            import('../components/Textarea/Textarea.stories.js').then(
              (m) => m.DynamicUpdates
            ),
        },
      ],
    },

    // =========================================
    // PAGE STRUCTURE COMPONENTS
    // =========================================
    {
      name: 'Page',
      stories: [
        {
          name: 'BasicPage',
          module: () =>
            import('../components/Page/Page.stories.js').then(
              (m) => m.BasicPage
            ),
        },
        {
          name: 'LoadingState',
          module: () =>
            import('../components/Page/Page.stories.js').then(
              (m) => m.LoadingState
            ),
        },
        {
          name: 'ErrorState',
          module: () =>
            import('../components/Page/Page.stories.js').then(
              (m) => m.ErrorState
            ),
        },
        {
          name: 'CompletePageStructure',
          module: () =>
            import('../components/Page/Page.stories.js').then(
              (m) => m.CompletePageStructure
            ),
        },
        {
          name: 'InteractivePage',
          module: () =>
            import('../components/Page/Page.stories.js').then(
              (m) => m.InteractivePage
            ),
        },
      ],
    },
    {
      name: 'Header',
      category: 'Page Structure',
      stories: [
        {
          name: 'Default',
          module: () =>
            import('../components/Header/Header.stories.js').then(
              (m) => m.Default
            ),
        },
        {
          name: 'WithoutLogo',
          module: () =>
            import('../components/Header/Header.stories.js').then(
              (m) => m.WithoutLogo
            ),
        },
        {
          name: 'WithoutNavigation',
          module: () =>
            import('../components/Header/Header.stories.js').then(
              (m) => m.WithoutNavigation
            ),
        },
        {
          name: 'MinimalHeader',
          module: () =>
            import('../components/Header/Header.stories.js').then(
              (m) => m.MinimalHeader
            ),
        },
        {
          name: 'WithManyNavItems',
          module: () =>
            import('../components/Header/Header.stories.js').then(
              (m) => m.WithManyNavItems
            ),
        },
      ],
    },
    {
      name: 'Footer',
      category: 'Page Structure',
      stories: [
        {
          name: 'Default',
          module: () =>
            import('../components/Footer/Footer.stories.js').then(
              (m) => m.Default
            ),
        },
        {
          name: 'MinimalFooter',
          module: () =>
            import('../components/Footer/Footer.stories.js').then(
              (m) => m.MinimalFooter
            ),
        },
        {
          name: 'WithLinksOnly',
          module: () =>
            import('../components/Footer/Footer.stories.js').then(
              (m) => m.WithLinksOnly
            ),
        },
        {
          name: 'WithSocialOnly',
          module: () =>
            import('../components/Footer/Footer.stories.js').then(
              (m) => m.WithSocialOnly
            ),
        },
        {
          name: 'ExtensiveFooter',
          module: () =>
            import('../components/Footer/Footer.stories.js').then(
              (m) => m.ExtensiveFooter
            ),
        },
      ],
    },
    {
      name: 'Hero',
      category: 'Page Structure',
      stories: [
        {
          name: 'Default',
          module: () =>
            import('../components/Hero/Hero.stories.js').then((m) => m.Default),
        },
        {
          name: 'WithBackground',
          module: () =>
            import('../components/Hero/Hero.stories.js').then(
              (m) => m.WithBackground
            ),
        },
        {
          name: 'LeftAligned',
          module: () =>
            import('../components/Hero/Hero.stories.js').then(
              (m) => m.LeftAligned
            ),
        },
        {
          name: 'RightAligned',
          module: () =>
            import('../components/Hero/Hero.stories.js').then(
              (m) => m.RightAligned
            ),
        },
        {
          name: 'WithCallbackAction',
          module: () =>
            import('../components/Hero/Hero.stories.js').then(
              (m) => m.WithCallbackAction
            ),
        },
        {
          name: 'MinimalHero',
          module: () =>
            import('../components/Hero/Hero.stories.js').then(
              (m) => m.MinimalHero
            ),
        },
        {
          name: 'WithLongContent',
          module: () =>
            import('../components/Hero/Hero.stories.js').then(
              (m) => m.WithLongContent
            ),
        },
      ],
    },
    {
      name: 'CollapsibleHeader',
      category: 'Page Structure',
      stories: [
        {
          name: 'MuchandyHeader',
          module: () =>
            import(
              '../components/CollapsibleHeader/CollapsibleHeader.stories.js'
            ).then((m) => m.MuchandyHeader),
        },
        {
          name: 'SecondDesign',
          module: () =>
            import(
              '../components/CollapsibleHeader/CollapsibleHeader.stories.js'
            ).then((m) => m.SecondDesign),
        },
      ],
    },

    // =========================================
    // MEDIA COMPONENTS
    // =========================================
    {
      name: 'Image',
      category: 'Media',
      stories: [
        {
          name: 'Default',
          module: () =>
            import('../components/Image/Image.stories.js').then(
              (m) => m.Default
            ),
        },
        {
          name: 'WithFallback',
          module: () =>
            import('../components/Image/Image.stories.js').then(
              (m) => m.WithFallback
            ),
        },
        {
          name: 'Responsive',
          module: () =>
            import('../components/Image/Image.stories.js').then(
              (m) => m.Responsive
            ),
        },
        {
          name: 'WithCustomSizes',
          module: () =>
            import('../components/Image/Image.stories.js').then(
              (m) => m.WithCustomSizes
            ),
        },
        {
          name: 'WithClickHandler',
          module: () =>
            import('../components/Image/Image.stories.js').then(
              (m) => m.WithClickHandler
            ),
        },
      ],
    },
    {
      name: 'Logo',
      category: 'Media',
      stories: [
        {
          name: 'Default',
          module: () =>
            import('../components/Logo/Logo.stories.js').then((m) => m.Default),
        },
        {
          name: 'WithCustomSizes',
          module: () =>
            import('../components/Logo/Logo.stories.js').then(
              (m) => m.WithCustomSizes
            ),
        },
        {
          name: 'WithFallback',
          module: () =>
            import('../components/Logo/Logo.stories.js').then(
              (m) => m.WithFallback
            ),
        },
        {
          name: 'WithClickHandler',
          module: () =>
            import('../components/Logo/Logo.stories.js').then(
              (m) => m.WithClickHandler
            ),
        },
        {
          name: 'SingleLogo', // Keep for backward compatibility
          module: () =>
            import('../components/Logo/Logo.stories.js').then(
              (m) => m.SingleLogo
            ),
        },
      ],
    },
    {
      name: 'Map',
      category: 'Media',
      stories: [
        {
          name: 'MuchandyShopModern', // 🆕 Google Places integration example
          module: () =>
            import('../components/Map/Map.stories.js').then(
              (m) => m.MuchandyShopModern
            ),
        },
        {
          name: 'MockPreviewMode', // 🆕 Mock view without API key
          module: () =>
            import('../components/Map/Map.stories.js').then(
              (m) => m.MockPreviewMode
            ),
        },
        {
          name: 'ModernPlacesAPI', // 🆕 Using Place ID directly
          module: () =>
            import('../components/Map/Map.stories.js').then(
              (m) => m.ModernPlacesAPI
            ),
        },
        {
          name: 'ModernElectronicsStores', // 🆕 Another shop example
          module: () =>
            import('../components/Map/Map.stories.js').then(
              (m) => m.ModernElectronicsStores
            ),
        },
        {
          name: 'ModernDynamicUpdates', // 🆕 Dynamic URL loading
          module: () =>
            import('../components/Map/Map.stories.js').then(
              (m) => m.ModernDynamicUpdates
            ),
        },
        {
          name: 'ModernURLParsing', // 🆕 Multiple shops selector
          module: () =>
            import('../components/Map/Map.stories.js').then(
              (m) => m.ModernURLParsing
            ),
        },
        {
          name: 'ModernSetupGuide', // 🆕 Simple coordinates example
          module: () =>
            import('../components/Map/Map.stories.js').then(
              (m) => m.ModernSetupGuide
            ),
        },
        {
          name: 'PerformanceShowcase', // 🆕 API configuration guide
          module: () =>
            import('../components/Map/Map.stories.js').then(
              (m) => m.PerformanceShowcase
            ),
        },
      ],
    },
    {
      name: 'Rating',
      category: 'Media',
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

    // =========================================
    // DOMAIN-SPECIFIC COMPONENTS
    // =========================================
    {
      name: 'BlogCard',
      category: 'Blog',
      stories: [
        {
          name: 'Default',
          module: () =>
            import('../components/BlogCard/BlogCard.stories.js').then(
              (m) => m.Default
            ),
        },
        {
          name: 'WithoutImage',
          module: () =>
            import('../components/BlogCard/BlogCard.stories.js').then(
              (m) => m.WithoutImage
            ),
        },
        {
          name: 'WithoutAuthor',
          module: () =>
            import('../components/BlogCard/BlogCard.stories.js').then(
              (m) => m.WithoutAuthor
            ),
        },
        {
          name: 'WithLongExcerpt',
          module: () =>
            import('../components/BlogCard/BlogCard.stories.js').then(
              (m) => m.WithLongExcerpt
            ),
        },
        {
          name: 'WithManyCategories',
          module: () =>
            import('../components/BlogCard/BlogCard.stories.js').then(
              (m) => m.WithManyCategories
            ),
        },
      ],
    },
    {
      name: 'BlogList',
      category: 'Blog',
      stories: [
        {
          name: 'Default',
          module: () =>
            import('../components/BlogList/BlogList.stories.js').then(
              (m) => m.Default
            ),
        },
        {
          name: 'WithoutTitle',
          module: () =>
            import('../components/BlogList/BlogList.stories.js').then(
              (m) => m.WithoutTitle
            ),
        },
        {
          name: 'EmptyState',
          module: () =>
            import('../components/BlogList/BlogList.stories.js').then(
              (m) => m.EmptyState
            ),
        },
        {
          name: 'TwoColumns',
          module: () =>
            import('../components/BlogList/BlogList.stories.js').then(
              (m) => m.TwoColumns
            ),
        },
        {
          name: 'SingleColumn',
          module: () =>
            import('../components/BlogList/BlogList.stories.js').then(
              (m) => m.SingleColumn
            ),
        },
      ],
    },
    {
      name: 'BlogDetail',
      category: 'Blog',
      stories: [
        {
          name: 'Default',
          module: () =>
            import('../components/BlogDetail/BlogDetail.stories.js').then(
              (m) => m.Default
            ),
        },
        {
          name: 'WithoutImage',
          module: () =>
            import('../components/BlogDetail/BlogDetail.stories.js').then(
              (m) => m.WithoutImage
            ),
        },
        {
          name: 'MinimalContent',
          module: () =>
            import('../components/BlogDetail/BlogDetail.stories.js').then(
              (m) => m.MinimalContent
            ),
        },
        {
          name: 'LongContent',
          module: () =>
            import('../components/BlogDetail/BlogDetail.stories.js').then(
              (m) => m.LongContent
            ),
        },
      ],
    },
    {
      name: 'PhoneRepairForm',
      category: 'Repair',
      stories: [
        {
          name: 'Default',
          module: () =>
            import(
              '../components/PhoneRepairForm/PhoneRepairForm.stories.js'
            ).then((m) => m.Default),
        },
        {
          name: 'WithPreselectedManufacturer',
          module: () =>
            import(
              '../components/PhoneRepairForm/PhoneRepairForm.stories.js'
            ).then((m) => m.WithPreselectedManufacturer),
        },
        {
          name: 'WithFullSelection',
          module: () =>
            import(
              '../components/PhoneRepairForm/PhoneRepairForm.stories.js'
            ).then((m) => m.WithFullSelection),
        },
        {
          name: 'WithCustomLabels',
          module: () =>
            import(
              '../components/PhoneRepairForm/PhoneRepairForm.stories.js'
            ).then((m) => m.WithCustomLabels),
        },
        {
          name: 'WithLoading',
          module: () =>
            import(
              '../components/PhoneRepairForm/PhoneRepairForm.stories.js'
            ).then((m) => m.WithLoading),
        },
        {
          name: 'WithError',
          module: () =>
            import(
              '../components/PhoneRepairForm/PhoneRepairForm.stories.js'
            ).then((m) => m.WithError),
        },
        {
          name: 'Interactive',
          module: () =>
            import(
              '../components/PhoneRepairForm/PhoneRepairForm.stories.js'
            ).then((m) => m.Interactive),
        },
      ],
    },
    {
      name: 'UsedPhonePriceForm',
      category: 'Repair',
      stories: [
        {
          name: 'Default',
          module: () =>
            import(
              '../components/UsedPhonePriceForm/UsedPhonePriceForm.stories.js'
            ).then((m) => m.Default),
        },
        {
          name: 'WithoutSteps',
          module: () =>
            import(
              '../components/UsedPhonePriceForm/UsedPhonePriceForm.stories.js'
            ).then((m) => m.WithoutSteps),
        },
        {
          name: 'WithPreselectedData',
          module: () =>
            import(
              '../components/UsedPhonePriceForm/UsedPhonePriceForm.stories.js'
            ).then((m) => m.WithPreselectedData),
        },
        {
          name: 'WithCustomTheme',
          module: () =>
            import(
              '../components/UsedPhonePriceForm/UsedPhonePriceForm.stories.js'
            ).then((m) => m.WithCustomTheme),
        },
        {
          name: 'WithErrorHandling',
          module: () =>
            import(
              '../components/UsedPhonePriceForm/UsedPhonePriceForm.stories.js'
            ).then((m) => m.WithErrorHandling),
        },
        {
          name: 'WithCustomLabels',
          module: () =>
            import(
              '../components/UsedPhonePriceForm/UsedPhonePriceForm.stories.js'
            ).then((m) => m.WithCustomLabels),
        },
        {
          name: 'WithLoading',
          module: () =>
            import(
              '../components/UsedPhonePriceForm/UsedPhonePriceForm.stories.js'
            ).then((m) => m.WithLoading),
        },
        {
          name: 'Interactive',
          module: () =>
            import(
              '../components/UsedPhonePriceForm/UsedPhonePriceForm.stories.js'
            ).then((m) => m.Interactive),
        },
      ],
    },
    {
      name: 'BackToTop',
      category: 'UI Elements',
      stories: [
        {
          name: 'Default',
          module: () =>
            import('../components/BackToTop/BackToTop.stories.js').then(
              (m) => m.Default
            ),
        },
        {
          name: 'WindowScrolling',
          module: () =>
            import('../components/BackToTop/BackToTop.stories.js').then(
              (m) => m.WindowScrolling
            ),
        },
        {
          name: 'CustomIcon',
          module: () =>
            import('../components/BackToTop/BackToTop.stories.js').then(
              (m) => m.CustomIcon
            ),
        },
        {
          name: 'CustomPosition',
          module: () =>
            import('../components/BackToTop/BackToTop.stories.js').then(
              (m) => m.CustomPosition
            ),
        },
        {
          name: 'WithCallbacks',
          module: () =>
            import('../components/BackToTop/BackToTop.stories.js').then(
              (m) => m.WithCallbacks
            ),
        },
        {
          name: 'FastScroll',
          module: () =>
            import('../components/BackToTop/BackToTop.stories.js').then(
              (m) => m.FastScroll
            ),
        },
        {
          name: 'SlowScroll',
          module: () =>
            import('../components/BackToTop/BackToTop.stories.js').then(
              (m) => m.SlowScroll
            ),
        },
        {
          name: 'PresentationalDefault',
          module: () =>
            import('../components/BackToTop/BackToTop.stories.js').then(
              (m) => m.PresentationalDefault
            ),
        },
        {
          name: 'PresentationalVariants',
          module: () =>
            import('../components/BackToTop/BackToTop.stories.js').then(
              (m) => m.PresentationalVariants
            ),
        },
        {
          name: 'PresentationalDisabled',
          module: () =>
            import('../components/BackToTop/BackToTop.stories.js').then(
              (m) => m.PresentationalDisabled
            ),
        },
        {
          name: 'InteractiveDemo',
          module: () =>
            import('../components/BackToTop/BackToTop.stories.js').then(
              (m) => m.InteractiveDemo
            ),
        },
      ],
    },
    {
      name: 'CookieConsent',
      category: 'UI Elements', // oder 'Legal' - je nach deiner Präferenz
      stories: [
        {
          name: 'Default',
          module: () =>
            import('../components/CookieConsent/CookieConsent.stories.js').then(
              (m) => m.Default
            ),
        },
        {
          name: 'ModalMode',
          module: () =>
            import('../components/CookieConsent/CookieConsent.stories.js').then(
              (m) => m.ModalMode
            ),
        },
        {
          name: 'TopBanner',
          module: () =>
            import('../components/CookieConsent/CookieConsent.stories.js').then(
              (m) => m.TopBanner
            ),
        },
        {
          name: 'DetailedView',
          module: () =>
            import('../components/CookieConsent/CookieConsent.stories.js').then(
              (m) => m.DetailedView
            ),
        },
        {
          name: 'WithLegalLinks',
          module: () =>
            import('../components/CookieConsent/CookieConsent.stories.js').then(
              (m) => m.WithLegalLinks
            ),
        },
        {
          name: 'ECommerceSetup',
          module: () =>
            import('../components/CookieConsent/CookieConsent.stories.js').then(
              (m) => m.ECommerceSetup
            ),
        },
        {
          name: 'CorporateSetup',
          module: () =>
            import('../components/CookieConsent/CookieConsent.stories.js').then(
              (m) => m.CorporateSetup
            ),
        },
        {
          name: 'ManagementFunctions',
          module: () =>
            import('../components/CookieConsent/CookieConsent.stories.js').then(
              (m) => m.ManagementFunctions
            ),
        },
        {
          name: 'AutoShowDemo',
          module: () =>
            import('../components/CookieConsent/CookieConsent.stories.js').then(
              (m) => m.AutoShowDemo
            ),
        },
        {
          name: 'AllPositions',
          module: () =>
            import('../components/CookieConsent/CookieConsent.stories.js').then(
              (m) => m.AllPositions
            ),
        },
      ],
    },
    {
      name: 'Modal',
      category: 'UI Elements',
      stories: [
        {
          name: 'Default',
          module: () =>
            import('../components/Modal/Modal.stories.js').then(
              (m) => m.Default
            ),
        },
        {
          name: 'CookieConsent',
          module: () =>
            import('../components/Modal/Modal.stories.js').then(
              (m) => m.CookieConsent
            ),
        },
        {
          name: 'ConfirmationDialog',
          module: () =>
            import('../components/Modal/Modal.stories.js').then(
              (m) => m.ConfirmationDialog
            ),
        },
        {
          name: 'SuccessNotification',
          module: () =>
            import('../components/Modal/Modal.stories.js').then(
              (m) => m.SuccessNotification
            ),
        },
        {
          name: 'FormModal',
          module: () =>
            import('../components/Modal/Modal.stories.js').then(
              (m) => m.FormModal
            ),
        },
        {
          name: 'LoadingModal',
          module: () =>
            import('../components/Modal/Modal.stories.js').then(
              (m) => m.LoadingModal
            ),
        },
        {
          name: 'InfoModal',
          module: () =>
            import('../components/Modal/Modal.stories.js').then(
              (m) => m.InfoModal
            ),
        },
        {
          name: 'WarningModal',
          module: () =>
            import('../components/Modal/Modal.stories.js').then(
              (m) => m.WarningModal
            ),
        },
        {
          name: 'FullscreenModal',
          module: () =>
            import('../components/Modal/Modal.stories.js').then(
              (m) => m.FullscreenModal
            ),
        },
        {
          name: 'NoBackdropModal',
          module: () =>
            import('../components/Modal/Modal.stories.js').then(
              (m) => m.NoBackdropModal
            ),
        },
        {
          name: 'MultipleModals',
          module: () =>
            import('../components/Modal/Modal.stories.js').then(
              (m) => m.MultipleModals
            ),
        },
        {
          name: 'AllVariants',
          module: () =>
            import('../components/Modal/Modal.stories.js').then(
              (m) => m.AllVariants
            ),
        },
      ],
    },
    {
      name: 'StepsIndicator',
      category: 'UI Elements',
      stories: [
        {
          name: 'Default',
          module: () =>
            import(
              '../components/StepsIndicator/StepsIndicator.stories.js'
            ).then((m) => m.Default),
        },
        {
          name: 'AllSteps',
          module: () =>
            import(
              '../components/StepsIndicator/StepsIndicator.stories.js'
            ).then((m) => m.AllSteps),
        },
        {
          name: 'Interactive',
          module: () =>
            import(
              '../components/StepsIndicator/StepsIndicator.stories.js'
            ).then((m) => m.Interactive),
        },
      ],
    },
    {
      name: 'PriceDisplay',
      category: 'Commerce',
      stories: [
        {
          name: 'Default',
          module: () =>
            import('../components/PriceDisplay/PriceDisplay.stories.js').then(
              (m) => m.Default
            ),
        },
        {
          name: 'Loading',
          module: () =>
            import('../components/PriceDisplay/PriceDisplay.stories.js').then(
              (m) => m.Loading
            ),
        },
        {
          name: 'Highlighted',
          module: () =>
            import('../components/PriceDisplay/PriceDisplay.stories.js').then(
              (m) => m.Highlighted
            ),
        },
        {
          name: 'WithCustomLabel',
          module: () =>
            import('../components/PriceDisplay/PriceDisplay.stories.js').then(
              (m) => m.WithCustomLabel
            ),
        },
        {
          name: 'DynamicUpdate',
          module: () =>
            import('../components/PriceDisplay/PriceDisplay.stories.js').then(
              (m) => m.DynamicUpdate
            ),
        },
        {
          name: 'DifferentPrices',
          module: () =>
            import('../components/PriceDisplay/PriceDisplay.stories.js').then(
              (m) => m.DifferentPrices
            ),
        },
      ],
    },
    {
      name: 'ConditionSelector',
      category: 'Commerce',
      stories: [
        {
          name: 'Default',
          module: () =>
            import(
              '../components/ConditionSelector/ConditionSelector.stories.js'
            ).then((m) => m.Default),
        },
        {
          name: 'WithSelectedCondition',
          module: () =>
            import(
              '../components/ConditionSelector/ConditionSelector.stories.js'
            ).then((m) => m.WithSelectedCondition),
        },
        {
          name: 'LoadingState',
          module: () =>
            import(
              '../components/ConditionSelector/ConditionSelector.stories.js'
            ).then((m) => m.LoadingState),
        },
        {
          name: 'Interactive',
          module: () =>
            import(
              '../components/ConditionSelector/ConditionSelector.stories.js'
            ).then((m) => m.Interactive),
        },
        {
          name: 'AllStates',
          module: () =>
            import(
              '../components/ConditionSelector/ConditionSelector.stories.js'
            ).then((m) => m.AllStates),
        },
        {
          name: 'CustomStyling',
          module: () =>
            import(
              '../components/ConditionSelector/ConditionSelector.stories.js'
            ).then((m) => m.CustomStyling),
        },
      ],
    },
    {
      name: 'ProductCard',
      category: 'Commerce',
      stories: [
        {
          name: 'Default',
          module: () =>
            import('../components/ProductCard/ProductCard.stories.js').then(
              (m) => m.DefaultProductCard
            ),
        },
        {
          name: 'WithCustomCurrency',
          module: () =>
            import('../components/ProductCard/ProductCard.stories.js').then(
              (m) => m.WithCustomCurrency
            ),
        },
        {
          name: 'WithLoadingPrice',
          module: () =>
            import('../components/ProductCard/ProductCard.stories.js').then(
              (m) => m.WithLoadingPrice
            ),
        },
        {
          name: 'WithHighlightedPrice',
          module: () =>
            import('../components/ProductCard/ProductCard.stories.js').then(
              (m) => m.WithHighlightedPrice
            ),
        },
        {
          name: 'DynamicPriceLoading',
          module: () =>
            import('../components/ProductCard/ProductCard.stories.js').then(
              (m) => m.DynamicPriceLoading
            ),
        },
        {
          name: 'WithMultipleSpecs',
          module: () =>
            import('../components/ProductCard/ProductCard.stories.js').then(
              (m) => m.WithMultipleSpecs
            ),
        },
        {
          name: 'WithLegacyOnReserve',
          module: () =>
            import('../components/ProductCard/ProductCard.stories.js').then(
              (m) => m.WithLegacyOnReserve
            ),
        },
        {
          name: 'ProductGrid',
          module: () =>
            import('../components/ProductCard/ProductCard.stories.js').then(
              (m) => m.ProductGrid
            ),
        },
      ],
    },
    {
      name: 'ContactSection',
      category: 'Contact',
      stories: [
        {
          name: 'Default',
          module: () =>
            import(
              '../components/ContactSection/ContactSection.stories.js'
            ).then((m) => m.Default),
        },
        {
          name: 'WithGoogleMaps',
          module: () =>
            import(
              '../components/ContactSection/ContactSection.stories.js'
            ).then((m) => m.WithGoogleMaps),
        },
        {
          name: 'MapOnRight',
          module: () =>
            import(
              '../components/ContactSection/ContactSection.stories.js'
            ).then((m) => m.MapOnRight),
        },
        {
          name: 'WithCustomFields',
          module: () =>
            import(
              '../components/ContactSection/ContactSection.stories.js'
            ).then((m) => m.WithCustomFields),
        },
        {
          name: 'WithMinorVariant',
          module: () =>
            import(
              '../components/ContactSection/ContactSection.stories.js'
            ).then((m) => m.WithMinorVariant),
        },
        {
          name: 'MobileReversedLayout',
          module: () =>
            import(
              '../components/ContactSection/ContactSection.stories.js'
            ).then((m) => m.MobileReversedLayout),
        },
        {
          name: 'MinimalConfiguration',
          module: () =>
            import(
              '../components/ContactSection/ContactSection.stories.js'
            ).then((m) => m.MinimalConfiguration),
        },
        {
          name: 'WithCallbacks',
          module: () =>
            import(
              '../components/ContactSection/ContactSection.stories.js'
            ).then((m) => m.WithCallbacks),
        },
      ],
    },
    {
      name: 'ContactInfo',
      category: 'Contact',
      stories: [
        {
          name: 'Default',
          module: () =>
            import('../components/ContactInfo/ContactInfo.stories.js').then(
              (m) => m.Default
            ),
        },
        {
          name: 'WithCustomClass',
          module: () =>
            import('../components/ContactInfo/ContactInfo.stories.js').then(
              (m) => m.WithCustomClass
            ),
        },
        {
          name: 'WithCustomLocationId',
          module: () =>
            import('../components/ContactInfo/ContactInfo.stories.js').then(
              (m) => m.WithCustomLocationId
            ),
        },
        {
          name: 'WithClickHandlers',
          module: () =>
            import('../components/ContactInfo/ContactInfo.stories.js').then(
              (m) => m.WithClickHandlers
            ),
        },
      ],
    },
    {
      name: 'StickyContactIcons',
      category: 'Contact',
      stories: [
        {
          name: 'Default',
          module: () =>
            import(
              '../components/StickyContactIcons/StickyContactIcons.stories.js'
            ).then((m) => m.Default),
        },
        {
          name: 'WithoutTooltips',
          module: () =>
            import(
              '../components/StickyContactIcons/StickyContactIcons.stories.js'
            ).then((m) => m.WithoutTooltips),
        },
        {
          name: 'WithCustomClass',
          module: () =>
            import(
              '../components/StickyContactIcons/StickyContactIcons.stories.js'
            ).then((m) => m.WithCustomClass),
        },
        {
          name: 'WithClickHandlers',
          module: () =>
            import(
              '../components/StickyContactIcons/StickyContactIcons.stories.js'
            ).then((m) => m.WithClickHandlers),
        },
      ],
    },
    {
      name: 'MuchandyHero',
      category: 'Branding',
      stories: [
        {
          name: 'Default',
          module: () =>
            import('../components/MuchandyHero/MuchandyHero.stories.js').then(
              (m) => m.Default
            ),
        },
        {
          name: 'WithSellTabDefault',
          module: () =>
            import('../components/MuchandyHero/MuchandyHero.stories.js').then(
              (m) => m.WithSellTabDefault
            ),
        },
        {
          name: 'WithoutBackgroundImage',
          module: () =>
            import('../components/MuchandyHero/MuchandyHero.stories.js').then(
              (m) => m.WithoutBackgroundImage
            ),
        },
        {
          name: 'WithCustomText',
          module: () =>
            import('../components/MuchandyHero/MuchandyHero.stories.js').then(
              (m) => m.WithCustomText
            ),
        },
        {
          name: 'WithMuchandyTheme',
          module: () =>
            import('../components/MuchandyHero/MuchandyHero.stories.js').then(
              (m) => m.WithMuchandyTheme
            ),
        },
        {
          name: 'WithCallbacks',
          module: () =>
            import('../components/MuchandyHero/MuchandyHero.stories.js').then(
              (m) => m.WithCallbacks
            ),
        },
        {
          name: 'MinimalConfiguration',
          module: () =>
            import('../components/MuchandyHero/MuchandyHero.stories.js').then(
              (m) => m.MinimalConfiguration
            ),
        },
        {
          name: 'WithDynamicUpdates',
          module: () =>
            import('../components/MuchandyHero/MuchandyHero.stories.js').then(
              (m) => m.WithDynamicUpdates
            ),
        },
      ],
    },

    // =========================================
    // UTILITY COMPONENTS
    // =========================================
    {
      name: 'Head',
      category: 'Utility',
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
