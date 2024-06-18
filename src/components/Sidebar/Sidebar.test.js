import Sidebar from './Sidebar';

describe('Sidebar', () => {
  const mockComponents = [
    { name: 'Component1', module: jest.fn() },
    { name: 'Component2', module: jest.fn() },
  ];
  const mockOnComponentSelect = jest.fn();

  let sidebar;

  beforeEach(() => {
    sidebar = new Sidebar(mockComponents, mockOnComponentSelect);
  });

  test('should create sidebar component', () => {
    expect(sidebar).toBeDefined();
  });

  test('should render sidebar correctly', () => {
    const element = sidebar.getElement();
    expect(element).toBeDefined();
    expect(element.className).toContain('sidebar');
  });

  test('should call onComponentSelect when a component is selected', () => {
    const element = sidebar.getElement();
    document.body.appendChild(element); // Append the sidebar element to the document body to ensure elements are rendered

    // Log the HTML structure of the sidebar
    console.log(element.innerHTML);

    const componentItem = element.querySelector('li');
    if (componentItem) {
      componentItem.click();
      expect(mockOnComponentSelect).toHaveBeenCalledWith(mockComponents[0]);
    } else {
      throw new Error('Component item not found in sidebar');
    }

    document.body.removeChild(element); // Clean up after the test
  });
});
