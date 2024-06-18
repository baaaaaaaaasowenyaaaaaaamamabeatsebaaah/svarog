import Button from './Button';

test('Button should render correctly', () => {
  const button = new Button({ text: 'Click me', onClick: () => {} });
  document.body.appendChild(button.getElement());
  expect(document.body.querySelector('button').textContent).toBe('Click me');
});
