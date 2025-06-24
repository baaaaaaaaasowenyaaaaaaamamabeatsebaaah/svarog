// src/utils/getComponents.js

export const getComponents = () => {
  const components = [
    // =========================================
    // FOUNDATION COMPONENTS
    // Basic building blocks - sorted by complexity
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
      name: 'RichText',
      category: 'Foundation',
      stories: [
        {
          name: 'BasicContent',
          module: () =>
            import('../components/RichText/RichText.stories.js').then(
              (m) => m.BasicContent
            ),
        },
        {
          name: 'ImpressumExample',
          module: () =>
            import('../components/RichText/RichText.stories.js').then(
              (m) => m.ImpressumExample
            ),
        },
        {
          name: 'PrivacyPolicyExample',
          module: () =>
            import('../components/RichText/RichText.stories.js').then(
              (m) => m.PrivacyPolicyExample
            ),
        },
        {
          name: 'ComplexFormatting',
          module: () =>
            import('../components/RichText/RichText.stories.js').then(
              (m) => m.ComplexFormatting
            ),
        },
        {
          name: 'TableExample',
          module: () =>
            import('../components/RichText/RichText.stories.js').then(
              (m) => m.TableExample
            ),
        },
        {
          name: 'SizeVariants',
          module: () =>
            import('../components/RichText/RichText.stories.js').then(
              (m) => m.SizeVariants
            ),
        },
        {
          name: 'XSSProtection',
          module: () =>
            import('../components/RichText/RichText.stories.js').then(
              (m) => m.XSSProtection
            ),
        },
        {
          name: 'TruncatedContent',
          module: () =>
            import('../components/RichText/RichText.stories.js').then(
              (m) => m.TruncatedContent
            ),
        },
        {
          name: 'VariantExamples',
          module: () =>
            import('../components/RichText/RichText.stories.js').then(
              (m) => m.VariantExamples
            ),
        },
        {
          name: 'InteractiveExample',
          module: () =>
            import('../components/RichText/RichText.stories.js').then(
              (m) => m.InteractiveExample
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
      name: 'Tag',
      category: 'Foundation',
      stories: [
        {
          name: 'Default',
          module: () =>
            import('../components/Tag/Tag.stories.js').then((m) => m.Default),
        },
        {
          name: 'WithIcon',
          module: () =>
            import('../components/Tag/Tag.stories.js').then((m) => m.WithIcon),
        },
        {
          name: 'WithCount',
          module: () =>
            import('../components/Tag/Tag.stories.js').then((m) => m.WithCount),
        },
        {
          name: 'Selected',
          module: () =>
            import('../components/Tag/Tag.stories.js').then((m) => m.Selected),
        },
        {
          name: 'Removable',
          module: () =>
            import('../components/Tag/Tag.stories.js').then((m) => m.Removable),
        },
        {
          name: 'Disabled',
          module: () =>
            import('../components/Tag/Tag.stories.js').then((m) => m.Disabled),
        },
        {
          name: 'Sizes',
          module: () =>
            import('../components/Tag/Tag.stories.js').then((m) => m.Sizes),
        },
        {
          name: 'Variants',
          module: () =>
            import('../components/Tag/Tag.stories.js').then((m) => m.Variants),
        },
        {
          name: 'FilterExample',
          module: () =>
            import('../components/Tag/Tag.stories.js').then(
              (m) => m.FilterExample
            ),
        },
        {
          name: 'SkillTags',
          module: () =>
            import('../components/Tag/Tag.stories.js').then((m) => m.SkillTags),
        },
        {
          name: 'InteractiveDemo',
          module: () =>
            import('../components/Tag/Tag.stories.js').then(
              (m) => m.InteractiveDemo
            ),
        },
      ],
    },

    // =========================================
    // FORM COMPONENTS
    // All form-related components - sorted by complexity
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
          name: 'UsingValue',
          module: () =>
            import('../components/Checkbox/Checkbox.stories.js').then(
              (m) => m.UsingValue
            ),
        },
        {
          name: 'UsingDefaultValue',
          module: () =>
            import('../components/Checkbox/Checkbox.stories.js').then(
              (m) => m.UsingDefaultValue
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
          name: 'Loading',
          module: () =>
            import('../components/Checkbox/Checkbox.stories.js').then(
              (m) => m.Loading
            ),
        },
        {
          name: 'LoadingAndChecked',
          module: () =>
            import('../components/Checkbox/Checkbox.stories.js').then(
              (m) => m.LoadingAndChecked
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
        {
          name: 'WithLinkInLabel',
          module: () =>
            import('../components/Checkbox/Checkbox.stories.js').then(
              (m) => m.WithLinkInLabel
            ),
        },
        {
          name: 'WithPrivacyPolicyLink',
          module: () =>
            import('../components/Checkbox/Checkbox.stories.js').then(
              (m) => m.WithPrivacyPolicyLink
            ),
        },
        {
          name: 'WithIconInLabel',
          module: () =>
            import('../components/Checkbox/Checkbox.stories.js').then(
              (m) => m.WithIconInLabel
            ),
        },
        {
          name: 'NewsletterSignup',
          module: () =>
            import('../components/Checkbox/Checkbox.stories.js').then(
              (m) => m.NewsletterSignup
            ),
        },
        {
          name: 'DynamicLabelUpdate',
          module: () =>
            import('../components/Checkbox/Checkbox.stories.js').then(
              (m) => m.DynamicLabelUpdate
            ),
        },
        {
          name: 'ImprovedValidationUX',
          module: () =>
            import('../components/Checkbox/Checkbox.stories.js').then(
              (m) => m.ImprovedValidationUX
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

    // =========================================
    // LAYOUT COMPONENTS
    // Layout and structure components - sorted by complexity
    // =========================================
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
      name: 'FAQSection',
      category: 'Layout',
      stories: [
        {
          name: 'Default',
          module: () =>
            import('../components/FAQSection/FAQSection.stories.js').then(
              (m) => m.Default
            ),
        },
        {
          name: 'BasicFAQ',
          module: () =>
            import('../components/FAQSection/FAQSection.stories.js').then(
              (m) => m.BasicFAQ
            ),
        },
        {
          name: 'WithoutTitle',
          module: () =>
            import('../components/FAQSection/FAQSection.stories.js').then(
              (m) => m.WithoutTitle
            ),
        },
        {
          name: 'MultipleMode',
          module: () =>
            import('../components/FAQSection/FAQSection.stories.js').then(
              (m) => m.MultipleMode
            ),
        },
        {
          name: 'DifferentIconTypes',
          module: () =>
            import('../components/FAQSection/FAQSection.stories.js').then(
              (m) => m.DifferentIconTypes
            ),
        },
        {
          name: 'DifferentVariants',
          module: () =>
            import('../components/FAQSection/FAQSection.stories.js').then(
              (m) => m.DifferentVariants
            ),
        },
        {
          name: 'SectionStyling',
          module: () =>
            import('../components/FAQSection/FAQSection.stories.js').then(
              (m) => m.SectionStyling
            ),
        },
        {
          name: 'ProgrammaticControl',
          module: () =>
            import('../components/FAQSection/FAQSection.stories.js').then(
              (m) => m.ProgrammaticControl
            ),
        },
        {
          name: 'DynamicFAQs',
          module: () =>
            import('../components/FAQSection/FAQSection.stories.js').then(
              (m) => m.DynamicFAQs
            ),
        },
        {
          name: 'SearchExample',
          module: () =>
            import('../components/FAQSection/FAQSection.stories.js').then(
              (m) => m.SearchExample
            ),
        },
        {
          name: 'WithCallback',
          module: () =>
            import('../components/FAQSection/FAQSection.stories.js').then(
              (m) => m.WithCallback
            ),
        },
        {
          name: 'CustomerSupportFAQ',
          module: () =>
            import('../components/FAQSection/FAQSection.stories.js').then(
              (m) => m.CustomerSupportFAQ
            ),
        },
        {
          name: 'TechnicalFAQ',
          module: () =>
            import('../components/FAQSection/FAQSection.stories.js').then(
              (m) => m.TechnicalFAQ
            ),
        },
        {
          name: 'ComprehensiveExample',
          module: () =>
            import('../components/FAQSection/FAQSection.stories.js').then(
              (m) => m.ComprehensiveExample
            ),
        },
      ],
    },
    {
      name: 'ProductGrid',
      category: 'Layout',
      stories: [
        {
          name: 'Default',
          module: () =>
            import('../components/ProductGrid/ProductGrid.stories.js').then(
              (m) => m.Default
            ),
        },
        {
          name: 'WithSkeletonLoading',
          module: () =>
            import('../components/ProductGrid/ProductGrid.stories.js').then(
              (m) => m.WithSkeletonLoading
            ),
        },
        {
          name: 'WithLazyLoading',
          module: () =>
            import('../components/ProductGrid/ProductGrid.stories.js').then(
              (m) => m.WithLazyLoading
            ),
        },
        {
          name: 'WithTagFiltering',
          module: () =>
            import('../components/ProductGrid/ProductGrid.stories.js').then(
              (m) => m.WithTagFiltering
            ),
        },
        {
          name: 'CustomColumns',
          module: () =>
            import('../components/ProductGrid/ProductGrid.stories.js').then(
              (m) => m.CustomColumns
            ),
        },
        {
          name: 'DynamicUpdates',
          module: () =>
            import('../components/ProductGrid/ProductGrid.stories.js').then(
              (m) => m.DynamicUpdates
            ),
        },
        {
          name: 'ProgrammaticFilters',
          module: () =>
            import('../components/ProductGrid/ProductGrid.stories.js').then(
              (m) => m.ProgrammaticFilters
            ),
        },
      ],
    },

    // =========================================
    // NAVIGATION COMPONENTS
    // Navigation-related components
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
    {
      name: 'Breadcrumb',
      category: 'Navigation',
      stories: [
        {
          name: 'Default',
          module: () =>
            import('../components/Breadcrumb/Breadcrumb.stories.js').then(
              (m) => m.Default
            ),
        },
        {
          name: 'CustomSeparator',
          module: () =>
            import('../components/Breadcrumb/Breadcrumb.stories.js').then(
              (m) => m.CustomSeparator
            ),
        },
        {
          name: 'WithClickHandlers',
          module: () =>
            import('../components/Breadcrumb/Breadcrumb.stories.js').then(
              (m) => m.WithClickHandlers
            ),
        },
        {
          name: 'TruncatedLong',
          module: () =>
            import('../components/Breadcrumb/Breadcrumb.stories.js').then(
              (m) => m.TruncatedLong
            ),
        },
        {
          name: 'ShortPath',
          module: () =>
            import('../components/Breadcrumb/Breadcrumb.stories.js').then(
              (m) => m.ShortPath
            ),
        },
        {
          name: 'SingleItem',
          module: () =>
            import('../components/Breadcrumb/Breadcrumb.stories.js').then(
              (m) => m.SingleItem
            ),
        },
        {
          name: 'WithEmojis',
          module: () =>
            import('../components/Breadcrumb/Breadcrumb.stories.js').then(
              (m) => m.WithEmojis
            ),
        },
        {
          name: 'CustomClassName',
          module: () =>
            import('../components/Breadcrumb/Breadcrumb.stories.js').then(
              (m) => m.CustomClassName
            ),
        },
        {
          name: 'Interactive',
          module: () =>
            import('../components/Breadcrumb/Breadcrumb.stories.js').then(
              (m) => m.Interactive
            ),
        },
      ],
    },

    // =========================================
    // MEDIA COMPONENTS
    // Media-related components - sorted by complexity
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
      name: 'RatingSection',
      category: 'Media',
      stories: [
        {
          name: 'Complete',
          module: () =>
            import('../components/RatingSection/RatingSection.stories.js').then(
              (m) => m.Complete
            ),
        },
        {
          name: 'GoogleOnly',
          module: () =>
            import('../components/RatingSection/RatingSection.stories.js').then(
              (m) => m.GoogleOnly
            ),
        },
        {
          name: 'FacebookOnly',
          module: () =>
            import('../components/RatingSection/RatingSection.stories.js').then(
              (m) => m.FacebookOnly
            ),
        },
        {
          name: 'WithoutWertgarantie',
          module: () =>
            import('../components/RatingSection/RatingSection.stories.js').then(
              (m) => m.WithoutWertgarantie
            ),
        },
        {
          name: 'Interactive',
          module: () =>
            import('../components/RatingSection/RatingSection.stories.js').then(
              (m) => m.Interactive
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
    {
      name: 'ImageSlider',
      category: 'Media',
      stories: [
        {
          name: 'Default',
          module: () =>
            import('../components/ImageSlider/ImageSlider.stories.js').then(
              (m) => m.Default
            ),
        },
        {
          name: 'WithThumbnails',
          module: () =>
            import('../components/ImageSlider/ImageSlider.stories.js').then(
              (m) => m.WithThumbnails
            ),
        },
        {
          name: 'ProductDetail',
          module: () =>
            import('../components/ImageSlider/ImageSlider.stories.js').then(
              (m) => m.ProductDetail
            ),
        },
        {
          name: 'MinimalArrows',
          module: () =>
            import('../components/ImageSlider/ImageSlider.stories.js').then(
              (m) => m.MinimalArrows
            ),
        },
        {
          name: 'DotsOnly',
          module: () =>
            import('../components/ImageSlider/ImageSlider.stories.js').then(
              (m) => m.DotsOnly
            ),
        },
        {
          name: 'NoLoop',
          module: () =>
            import('../components/ImageSlider/ImageSlider.stories.js').then(
              (m) => m.NoLoop
            ),
        },
        {
          name: 'SingleImage',
          module: () =>
            import('../components/ImageSlider/ImageSlider.stories.js').then(
              (m) => m.SingleImage
            ),
        },
        {
          name: 'WithCustomStyling',
          module: () =>
            import('../components/ImageSlider/ImageSlider.stories.js').then(
              (m) => m.WithCustomStyling
            ),
        },
        {
          name: 'WithChangeCallback',
          module: () =>
            import('../components/ImageSlider/ImageSlider.stories.js').then(
              (m) => m.WithChangeCallback
            ),
        },
        {
          name: 'MobileOptimized',
          module: () =>
            import('../components/ImageSlider/ImageSlider.stories.js').then(
              (m) => m.MobileOptimized
            ),
        },
        {
          name: 'Gallery',
          module: () =>
            import('../components/ImageSlider/ImageSlider.stories.js').then(
              (m) => m.Gallery
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

    // =========================================
    // UI ELEMENTS
    // Interactive UI components - sorted by complexity
    // =========================================
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
      name: 'CookieConsent',
      category: 'UI Elements',
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

    // =========================================
    // PAGE STRUCTURE COMPONENTS
    // High-level page structure - sorted by hierarchy
    // =========================================
    {
      name: 'Page',
      category: 'Page Structure',
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

    // =========================================
    // COMMERCE COMPONENTS
    // E-commerce specific components - sorted by complexity
    // =========================================
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
        {
          name: 'WithCustomIcons',
          module: () =>
            import(
              '../components/ConditionSelector/ConditionSelector.stories.js'
            ).then((m) => m.WithCustomIcons),
        },
        {
          name: 'WithoutIcons',
          module: () =>
            import(
              '../components/ConditionSelector/ConditionSelector.stories.js'
            ).then((m) => m.WithoutIcons),
        },
        {
          name: 'ToggleIcons',
          module: () =>
            import(
              '../components/ConditionSelector/ConditionSelector.stories.js'
            ).then((m) => m.ToggleIcons),
        },
        {
          name: 'MixedIconTypes',
          module: () =>
            import(
              '../components/ConditionSelector/ConditionSelector.stories.js'
            ).then((m) => m.MixedIconTypes),
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
          name: 'WithPriceInfo',
          module: () =>
            import('../components/ProductCard/ProductCard.stories.js').then(
              (m) => m.WithPriceInfo
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
          name: 'WithShippingInfo',
          module: () =>
            import('../components/ProductCard/ProductCard.stories.js').then(
              (m) => m.WithShippingInfo
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
          name: 'DynamicPriceInfo',
          module: () =>
            import('../components/ProductCard/ProductCard.stories.js').then(
              (m) => m.DynamicPriceInfo
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
      name: 'ProductDetail',
      category: 'Commerce',
      stories: [
        {
          name: 'Default',
          module: () =>
            import('../components/ProductDetail/ProductDetail.stories.js').then(
              (m) => m.Default
            ),
        },
        {
          name: 'WithPriceInfo',
          module: () =>
            import('../components/ProductDetail/ProductDetail.stories.js').then(
              (m) => m.WithPriceInfo
            ),
        },
        {
          name: 'WithAdditionalButtons',
          module: () =>
            import('../components/ProductDetail/ProductDetail.stories.js').then(
              (m) => m.WithAdditionalButtons
            ),
        },
        {
          name: 'LoadingState',
          module: () =>
            import('../components/ProductDetail/ProductDetail.stories.js').then(
              (m) => m.LoadingState
            ),
        },
        {
          name: 'NoImages',
          module: () =>
            import('../components/ProductDetail/ProductDetail.stories.js').then(
              (m) => m.NoImages
            ),
        },
        {
          name: 'SingleImage',
          module: () =>
            import('../components/ProductDetail/ProductDetail.stories.js').then(
              (m) => m.SingleImage
            ),
        },
        {
          name: 'MinimalConfiguration',
          module: () =>
            import('../components/ProductDetail/ProductDetail.stories.js').then(
              (m) => m.MinimalConfiguration
            ),
        },
        {
          name: 'CustomCurrency',
          module: () =>
            import('../components/ProductDetail/ProductDetail.stories.js').then(
              (m) => m.CustomCurrency
            ),
        },
        {
          name: 'InteractiveDemo',
          module: () =>
            import('../components/ProductDetail/ProductDetail.stories.js').then(
              (m) => m.InteractiveDemo
            ),
        },
        {
          name: 'MobilePreview',
          module: () =>
            import('../components/ProductDetail/ProductDetail.stories.js').then(
              (m) => m.MobilePreview
            ),
        },
        {
          name: 'LuxuryProduct',
          module: () =>
            import('../components/ProductDetail/ProductDetail.stories.js').then(
              (m) => m.LuxuryProduct
            ),
        },
        {
          name: 'ImprovedUXFlow',
          module: () =>
            import('../components/ProductDetail/ProductDetail.stories.js').then(
              (m) => m.ImprovedUXFlow
            ),
        },
      ],
    },

    // =========================================
    // CONTACT COMPONENTS
    // Contact-related components
    // =========================================
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
          name: 'WithFullAddressInfo',
          module: () =>
            import(
              '../components/ContactSection/ContactSection.stories.js'
            ).then((m) => m.WithFullAddressInfo),
        },
        {
          name: 'WithCallbacks',
          module: () =>
            import(
              '../components/ContactSection/ContactSection.stories.js'
            ).then((m) => m.WithCallbacks),
        },
        {
          name: 'BerlinOffice',
          module: () =>
            import(
              '../components/ContactSection/ContactSection.stories.js'
            ).then((m) => m.BerlinOffice),
        },
        {
          name: 'OnlyPhoneAndEmail',
          module: () =>
            import(
              '../components/ContactSection/ContactSection.stories.js'
            ).then((m) => m.OnlyPhoneAndEmail),
        },
      ],
    },

    // =========================================
    // BLOG COMPONENTS
    // Blog-specific components
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

    // =========================================
    // REPAIR COMPONENTS
    // Repair service specific components (Muchandy)
    // =========================================
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
        {
          name: 'WithCallButton',
          module: () =>
            import(
              '../components/PhoneRepairForm/PhoneRepairForm.stories.js'
            ).then((m) => m.WithCallButton),
        },
        {
          name: 'FullyConfiguredExample',
          module: () =>
            import(
              '../components/PhoneRepairForm/PhoneRepairForm.stories.js'
            ).then((m) => m.FullyConfiguredExample),
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
        {
          name: 'WithCallButton',
          module: () =>
            import(
              '../components/UsedPhonePriceForm/UsedPhonePriceForm.stories.js'
            ).then((m) => m.WithCallButton),
        },
        {
          name: 'FullyConfiguredWithButtons',
          module: () =>
            import(
              '../components/UsedPhonePriceForm/UsedPhonePriceForm.stories.js'
            ).then((m) => m.FullyConfiguredWithButtons),
        },
      ],
    },

    // =========================================
    // BRANDING COMPONENTS
    // Brand-specific components
    // =========================================
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
        {
          name: 'WithAPIDelay',
          module: () =>
            import('../components/MuchandyHero/MuchandyHero.stories.js').then(
              (m) => m.WithAPIDelay
            ),
        },
        {
          name: 'WithDifferentLoadingTimes',
          module: () =>
            import('../components/MuchandyHero/MuchandyHero.stories.js').then(
              (m) => m.WithDifferentLoadingTimes
            ),
        },
        {
          name: 'WithCustomLoadingComponent',
          module: () =>
            import('../components/MuchandyHero/MuchandyHero.stories.js').then(
              (m) => m.WithCustomLoadingComponent
            ),
        },
        {
          name: 'WithAPIError',
          module: () =>
            import('../components/MuchandyHero/MuchandyHero.stories.js').then(
              (m) => m.WithAPIError
            ),
        },
        {
          name: 'WithCustomErrorComponent',
          module: () =>
            import('../components/MuchandyHero/MuchandyHero.stories.js').then(
              (m) => m.WithCustomErrorComponent
            ),
        },
        {
          name: 'WithRetryableError',
          module: () =>
            import('../components/MuchandyHero/MuchandyHero.stories.js').then(
              (m) => m.WithRetryableError
            ),
        },
        {
          name: 'RealisticProductionScenario',
          module: () =>
            import('../components/MuchandyHero/MuchandyHero.stories.js').then(
              (m) => m.RealisticProductionScenario
            ),
        },
        {
          name: 'WithFormPropUpdates',
          module: () =>
            import('../components/MuchandyHero/MuchandyHero.stories.js').then(
              (m) => m.WithFormPropUpdates
            ),
        },
      ],
    },

    // =========================================
    // UTILITY COMPONENTS
    // Utility and system components
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
