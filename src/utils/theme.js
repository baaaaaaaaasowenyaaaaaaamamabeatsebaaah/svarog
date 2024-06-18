export const switchTheme = (theme) => {
  document.body.classList.remove('default-theme', 'dark-theme');
  document.body.classList.add(`${theme}-theme`);
  console.log(
    `${theme.charAt(0).toUpperCase() + theme.slice(1)} theme enabled`
  );
};
