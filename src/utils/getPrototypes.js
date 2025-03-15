// src/utils/getPrototypes.js
export const getPrototypes = () => {
  const prototypes = [
    {
      name: 'Home Page',
      stories: [
        {
          name: 'Default Theme',
          module: () =>
            import('../prototypes/HomePage/DefaultTheme.js').then(
              (m) => m.default
            ),
        },
        {
          name: 'Cabalou Theme',
          module: () =>
            import('../prototypes/HomePage/CabalouTheme.js').then(
              (m) => m.default
            ),
        },
        {
          name: 'Muchandy Theme',
          module: () =>
            import('../prototypes/HomePage/MuchandyTheme.js').then(
              (m) => m.default
            ),
        },
      ],
    },
  ];

  return prototypes;
};
