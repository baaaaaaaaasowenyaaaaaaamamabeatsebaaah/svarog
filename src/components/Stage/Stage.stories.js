import Stage from './Stage';
import Button from '../Button/Button';

export default {
  title: 'Stage',
};

export const Default = () => {
  const stage = new Stage();
  const button = new Button({
    text: 'Click Me',
    onClick: () => alert('Button Clicked!'),
  });

  stage.setComponent(button);

  const container = document.createElement('div');
  container.appendChild(stage.getElement());
  return stage; // Return the Stage instance, not the container
};
