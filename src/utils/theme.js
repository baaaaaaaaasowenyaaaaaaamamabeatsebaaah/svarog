export const switchTheme = (theme) => {
  document.body.classList.remove('default-theme', 'dark-theme');
  document.body.classList.add(`${theme}-theme`);
};
