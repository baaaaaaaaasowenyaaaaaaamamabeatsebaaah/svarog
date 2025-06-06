// src/components/Tabs/Tabs.styles.js
import { css } from '../../utils/styleInjection.js';

export const tabsStyles = css`
  .tabs {
    width: 100%;
  }

  /* Default variant */
  .tabs__list {
    display: flex;
    border-bottom: 2px solid var(--color-border-light);
    margin-bottom: var(--space-4);
  }

  .tabs__button {
    background: none;
    border: none;
    padding: var(--space-3) var(--space-4);
    font-size: var(--font-size-xl);
    font-family: var(--font-family-base);
    color: var(--color-text);
    cursor: pointer;
    border-bottom: 2px solid transparent;
    margin-bottom: -2px;
    transition: all 0.2s ease;
  }

  .tabs__button:hover {
    color: var(--color-brand-secondary);
  }

  .tabs__button--active {
    color: var(--color-brand-secondary);
    border-bottom-color: var(--color-brand-secondary);
    font-weight: var(--font-weight-bold);
  }

  .tabs__panel {
    display: none;
  }

  .tabs__panel--active {
    display: block;
  }

  /* Simple variant - without underline */
  .tabs--simple .tabs__list {
    border-bottom: none;
  }

  .tabs--simple .tabs__button {
    border-bottom: none;
    margin-bottom: 0;
  }

  .tabs--simple .tabs__button--active {
    border-bottom: none;
  }

  /* Border variant - with border styling */
  .tabs--border .tabs__list {
    border-bottom: none;
    margin-bottom: 0px;
  }

  .tabs--border .tabs__button--bordered {
    background: none;
    border: 1px solid var(--color-brand-secondary-light);
    border-left: none;
    margin-bottom: 0;
    border-bottom: 1px solid var(--color-brand-secondary-light);
    /* Styling similar to disabled button for inactive tabs */
    background-color: var(--button-disabled-bg);
    color: var(--button-disabled-color);
  }

  /* First button has left border */
  .tabs--border .tabs__button--first {
    border-left: 1px solid var(--color-brand-secondary-light);
    border-top-left-radius: 0;
  }

  /* Last button has rounded corner */
  .tabs--border .tabs__button--bordered:last-child {
    border-top-right-radius: 0;
  }

  .tabs--border .tabs__button--bordered:hover:not(.tabs__button--active) {
    background-color: var(--color-bg-transparent);
    color: var(--color-brand-secondary);
  }

  .tabs--border .tabs__button--active {
    background-color: var(--color-bg-transparent);
    color: var(--color-brand-secondary);
    font-weight: var(--font-weight-bold);
    border-bottom-color: transparent;
    position: relative;
  }

  .tabs--border .tabs__button--active:after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 1px;
    background-color: var(--color-bg-transparent);
  }

  .tabs--border .tabs__panel--bordered {
    padding: var(--space-4) 0;
    border: 1px solid var(--color-brand-secondary-light);
    border-radius: 0;
    margin-top: -1px;
  }

  /* Tab button alignments */
  .tabs--align-center .tabs__list {
    justify-content: center;
  }

  .tabs--align-right .tabs__list {
    justify-content: flex-end;
  }
`;
