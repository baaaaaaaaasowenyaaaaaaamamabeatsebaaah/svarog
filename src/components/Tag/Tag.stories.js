// src/components/Tag/Tag.stories.js
import Tag from './Tag.js';

export default {
  title: 'Components/Tag',
  component: Tag,
};

export const Default = () => {
  return Tag({
    label: 'JavaScript',
    onClick: (value) => console.log(`Clicked: ${value}`),
  });
};

export const WithIcon = () => {
  return Tag({
    label: 'React',
    icon: '⚛️',
    onClick: (value) => console.log(`Clicked: ${value}`),
  });
};

export const WithCount = () => {
  return Tag({
    label: 'Articles',
    count: 42,
    onClick: (value) => console.log(`Clicked: ${value}`),
  });
};

export const Selected = () => {
  return Tag({
    label: 'Selected Tag',
    selected: true,
    onClick: (value) => console.log(`Clicked: ${value}`),
  });
};

export const Removable = () => {
  const tag = Tag({
    label: 'Remove Me',
    removable: true,
    onRemove: (value) => {
      console.log(`Removed: ${value}`);
      // Also remove from DOM for visual feedback
      const element = tag.getElement();
      element.style.animation = 'tag-fade-out 0.2s ease forwards';
      setTimeout(() => {
        tag.destroy();
        element.remove();
      }, 200);
    },
    onClick: (value) => console.log(`Clicked: ${value}`),
  });

  return tag;
};

export const Disabled = () => {
  return Tag({
    label: 'Disabled Tag',
    disabled: true,
    onClick: (_value) => console.log('Should not fire'),
  });
};

export const Sizes = () => {
  const container = document.createElement('div');
  container.style.cssText = 'display: flex; gap: 12px; align-items: center;';

  ['sm', 'md', 'lg'].forEach((size) => {
    const tag = Tag({
      label: `${size.toUpperCase()} Size`,
      size,
      onClick: (value) => console.log(`Clicked ${size}: ${value}`),
    });
    container.appendChild(tag.getElement());
  });

  return container;
};

export const Variants = () => {
  const container = document.createElement('div');
  container.style.cssText = 'display: flex; gap: 12px; flex-wrap: wrap;';

  const variants = [
    'default',
    'primary',
    'secondary',
    'success',
    'warning',
    'danger',
    'info',
  ];

  variants.forEach((variant) => {
    const tag = Tag({
      label: variant.charAt(0).toUpperCase() + variant.slice(1),
      variant,
      onClick: (value) => console.log(`Clicked ${variant}: ${value}`),
    });
    container.appendChild(tag.getElement());
  });

  return container;
};

export const FilterExample = () => {
  const container = document.createElement('div');
  container.style.cssText = 'padding: 20px;';

  const title = document.createElement('h3');
  title.textContent = 'Filter by Category';
  title.style.marginBottom = '16px';
  container.appendChild(title);

  const tagContainer = document.createElement('div');
  tagContainer.style.cssText = 'display: flex; gap: 8px; flex-wrap: wrap;';

  const categories = [
    { label: 'Technology', count: 45 },
    { label: 'Design', count: 23 },
    { label: 'Business', count: 67 },
    { label: 'Marketing', count: 34 },
    { label: 'Development', count: 89 },
  ];

  const selectedCategories = new Set();

  categories.forEach((category) => {
    const tag = Tag({
      label: category.label,
      count: category.count,
      onClick: (value) => {
        // Capture tag reference in closure
        if (selectedCategories.has(value)) {
          selectedCategories.delete(value);
          tag.setSelected(false);
        } else {
          selectedCategories.add(value);
          tag.setSelected(true);
        }
        console.log('Selected:', Array.from(selectedCategories));
      },
    });

    tagContainer.appendChild(tag.getElement());
  });

  container.appendChild(tagContainer);
  return container;
};

export const SkillTags = () => {
  const container = document.createElement('div');
  container.style.cssText = 'padding: 20px;';

  const title = document.createElement('h3');
  title.textContent = 'Your Skills';
  title.style.marginBottom = '16px';
  container.appendChild(title);

  const tagContainer = document.createElement('div');
  tagContainer.style.cssText = 'display: flex; gap: 8px; flex-wrap: wrap;';

  const skills = [
    { label: 'JavaScript', icon: '📜' },
    { label: 'React', icon: '⚛️' },
    { label: 'Node.js', icon: '🟢' },
    { label: 'CSS', icon: '🎨' },
    { label: 'TypeScript', icon: '📘' },
  ];

  skills.forEach((skill) => {
    const tag = Tag({
      label: skill.label,
      icon: skill.icon,
      variant: 'primary',
      removable: true,
      size: 'sm',
      onRemove: (value) => {
        // Capture tag reference in closure
        const element = tag.getElement();
        element.style.animation = 'tag-fade-out 0.2s ease forwards';
        setTimeout(() => {
          tag.destroy();
          element.remove();
        }, 200);
        console.log(`Removed skill: ${value}`);
      },
    });

    tagContainer.appendChild(tag.getElement());
  });

  container.appendChild(tagContainer);
  return container;
};

export const InteractiveDemo = () => {
  const container = document.createElement('div');
  container.style.cssText = 'padding: 20px; max-width: 600px;';

  const title = document.createElement('h3');
  title.textContent = 'Interactive Tag Demo';
  title.style.marginBottom = '16px';
  container.appendChild(title);

  const info = document.createElement('p');
  info.textContent =
    'Click tags to select, use keyboard navigation, or add custom tags.';
  info.style.cssText = 'color: #666; margin-bottom: 16px;';
  container.appendChild(info);

  const tagContainer = document.createElement('div');
  tagContainer.style.cssText =
    'display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px;';

  // Create input for adding tags
  const inputContainer = document.createElement('div');
  inputContainer.style.cssText = 'display: flex; gap: 8px;';

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Add a tag...';
  input.style.cssText =
    'flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px;';

  const addButton = document.createElement('button');
  addButton.textContent = 'Add Tag';
  addButton.style.cssText =
    'padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;';

  const addTag = () => {
    const value = input.value.trim();
    if (value) {
      const tag = Tag({
        label: value,
        removable: true,
        variant: 'info',
        onClick: () => {
          // Capture tag reference in closure
          tag.setSelected(!tag.isSelected());
        },
        onRemove: () => {
          // Capture tag reference in closure
          const element = tag.getElement();
          element.style.animation = 'tag-fade-out 0.2s ease forwards';
          setTimeout(() => {
            tag.destroy();
            element.remove();
          }, 200);
        },
      });
      tagContainer.appendChild(tag.getElement());
      input.value = '';
    }
  };

  addButton.onclick = addTag;
  input.onkeydown = (e) => {
    if (e.key === 'Enter') addTag();
  };

  inputContainer.appendChild(input);
  inputContainer.appendChild(addButton);

  container.appendChild(tagContainer);
  container.appendChild(inputContainer);

  // Add some default tags
  ['Sample', 'Interactive', 'Demo'].forEach((label) => {
    const tag = Tag({
      label,
      removable: true,
      onClick: () => {
        tag.setSelected(!tag.isSelected());
      },
      onRemove: () => {
        const element = tag.getElement();
        element.style.animation = 'tag-fade-out 0.2s ease forwards';
        setTimeout(() => {
          tag.destroy();
          element.remove();
        }, 200);
      },
    });
    tagContainer.appendChild(tag.getElement());
  });

  return container;
};
