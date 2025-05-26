export const componentStyles = `
  /* Component-specific style overrides for default theme */
  
  /* Material UI specific enhancements */
  .card {
    transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .card:hover {
    transform: none;
    box-shadow: var(--card-hover-shadow);
  }

  h1, h2, h3, h4, h5, h6 {
    color: rgba(0, 0, 0, 0.87);
    line-height: 1.2;
    letter-spacing: 0;
  }
`;
