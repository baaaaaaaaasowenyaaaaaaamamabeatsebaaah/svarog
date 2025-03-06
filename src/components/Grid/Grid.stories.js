// src/components/Grid/Grid.stories.js
import Grid from './Grid.js';

export default {
  title: 'Components/Grid',
  component: Grid,
};

const createColoredBox = (color, text = '') => {
  const box = document.createElement('div');
  box.style.backgroundColor = color;
  box.style.padding = '20px';
  box.style.color = 'white';
  box.style.display = 'flex';
  box.style.alignItems = 'center';
  box.style.justifyContent = 'center';
  box.style.minHeight = '100px';
  box.textContent = text || color;
  return box;
};

export const Default = () => {
  const grid = new Grid({ gap: '1rem' });

  const column1 = new Grid.Column({
    width: 6,
    children: [createColoredBox('#007bff', 'Column 1')],
  });

  const column2 = new Grid.Column({
    width: 6,
    children: [createColoredBox('#28a745', 'Column 2')],
  });

  grid.appendChild(column1.getElement());
  grid.appendChild(column2.getElement());

  return grid.getElement();
};

// ... rest of the stories remain the same but using Grid.Column instead of Column ...
