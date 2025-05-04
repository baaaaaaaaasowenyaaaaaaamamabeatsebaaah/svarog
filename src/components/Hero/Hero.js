// src/components/Hero/Hero.js
import './Hero.css';
import { Component } from '../../utils/componentFactory.js';
import Button from '../Button/Button.js';

export default class Hero extends Component {
  constructor(props) {
    super();
    this.props = {
      title: '',
      subtitle: '',
      ctaText: '',
      ctaLink: '',
      onCtaClick: null,
      backgroundImage: '',
      className: '',
      align: 'center',
      ...props,
    };
    this.element = this.createComponentElement();
  }

  createComponentElement() {
    const {
      title,
      subtitle,
      ctaText,
      ctaLink,
      onCtaClick,
      backgroundImage,
      className,
      align = 'center',
    } = this.props;

    const hero = this.createElement('section', {
      className: this.createClassNames('hero', `hero--${align}`, className),
    });

    if (backgroundImage) {
      hero.style.backgroundImage = `url(${backgroundImage})`;
      hero.classList.add('hero--with-background');
    }

    const content = this.createElement('div', {
      className: 'hero__content',
    });

    // Add title (check if not empty)
    if (title) {
      const titleElement = this.createElement('h1', {
        className: 'hero__title',
        textContent: title,
      });
      content.appendChild(titleElement);
    }

    // Add subtitle (check if not empty)
    if (subtitle) {
      const subtitleElement = this.createElement('p', {
        className: 'hero__subtitle',
        textContent: subtitle,
      });
      content.appendChild(subtitleElement);
    }

    // Add CTA button
    if (ctaText && (ctaLink || onCtaClick)) {
      const ctaButton = new Button({
        text: ctaText,
        variant: 'primary',
        size: 'large',
        className: 'hero__cta',
        onClick: (e) => {
          if (onCtaClick) {
            onCtaClick(e);
          } else if (ctaLink) {
            window.location.href = ctaLink;
          }
        },
      }).getElement();

      content.appendChild(ctaButton);
    }

    hero.appendChild(content);
    return hero;
  }
}
