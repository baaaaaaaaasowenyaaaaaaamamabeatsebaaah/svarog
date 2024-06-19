import { Grid, Column } from './Grid';
import './Grid.css';

export default {
  title: 'Grid',
  component: Grid,
};

export const Default = () => {
  const grid = new Grid({ rowGap: '1rem' });
  const column1 = new Column({ width: 6, children: [createColoredBox('red')] });
  const column2 = new Column({
    width: 6,
    children: [createColoredBox('blue')],
  });
  grid.appendChild(column1.getElement());
  grid.appendChild(column2.getElement());
  return grid.getElement();
};

export const Responsive = () => {
  const grid = new Grid({ rowGap: '1rem' });
  const column1 = new Column({
    width: 4,
    mobileWidth: 2,
    children: [createColoredBox('red')],
  });
  const column2 = new Column({
    width: 4,
    mobileWidth: 2,
    children: [createColoredBox('blue')],
  });
  const column3 = new Column({
    width: 4,
    mobileWidth: 2,
    children: [createColoredBox('green')],
  });
  grid.appendChild(column1.getElement());
  grid.appendChild(column2.getElement());
  grid.appendChild(column3.getElement());
  return grid.getElement();
};

const createColoredBox = (color) => {
  const box = document.createElement('div');
  box.style.backgroundColor = color;
  box.style.height = '100px';
  box.style.display = 'flex';
  box.style.alignItems = 'center';
  box.style.justifyContent = 'center';
  box.textContent = color;
  return box;
};
