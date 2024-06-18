import Stage from './Stage';

describe('Stage', () => {
  let stage;

  beforeEach(() => {
    stage = new Stage();
  });

  test('should create stage component', () => {
    expect(stage).toBeDefined();
  });

  test('should render stage correctly', () => {
    const element = stage.getElement();
    expect(element).toBeDefined();
    expect(element.className).toContain('stage');
  });

  test('should set and render component correctly', () => {
    const mockComponent = {
      getElement: jest.fn(() => {
        const div = document.createElement('div');
        div.className = 'mock-component';
        return div;
      }),
    };

    stage.setComponent(mockComponent);
    const element = stage.getElement();
    expect(element.querySelector('.mock-component')).toBeDefined();
  });
});
