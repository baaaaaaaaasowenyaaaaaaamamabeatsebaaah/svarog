// src/components/StepsIndicator/StepsIndicator.styles.js
import { css } from '../../utils/styleInjection.js';

export const stepsIndicatorStyles = css`
  .steps-indicator {
    display: flex;
    flex-direction: column;
    margin: 0 0 var(--space-6);
    padding: 0;
    position: relative;
    width: 100%;
    font-family: var(--font-family-primary, sans-serif);
  }

  /* Progress bar */
  .steps-indicator__progress-bar {
    position: relative;
    display: flex;
    width: 100%;
    height: var(--space-2);
    margin: var(--space-4) 0;
    padding: 0;
    background: transparent;
    z-index: 1;
  }

  .steps-indicator__section {
    position: relative;
    flex: 1;
    height: 100%;
    background-color: var(--color-gray-200);
    transition: all 0.3s ease;
  }

  /* Active section - with borders */
  .steps-indicator__section--active {
    background-color: var(--color-brand-secondary-light);
  }

  /* Completed section - filled with primary color */
  .steps-indicator__section--completed {
    background-color: var(--color-brand-secondary);
  }

  /* Success section - filled with success color */
  .steps-indicator__section--success {
    background-color: var(--color-brand-secondary);
  }

  /* Step items container */
  .steps-indicator__steps {
    display: flex;
    justify-content: space-between;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 2;
  }

  /* Individual step */
  .steps-indicator__step {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding-top: var(--space-1);
    /* Fixed width allocation for each step */
    width: 33.333%;
    max-width: 120px;
  }

  /* Step number container with fixed positioning */
  .steps-indicator__number-container {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 40px;
  }

  /* Step number circle */
  .steps-indicator__number {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--color-gray-200);
    color: var(--color-gray-400);
    font-size: var(--font-size-sm);
    font-weight: 600;
    border: 2px solid var(--color-gray-200);
  }

  /* Step label */
  .steps-indicator__label {
    font-size: var(--font-size-sm);
    font-weight: 500;
    color: var(--color-gray-400);
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color 0.25s ease;
    margin-top: var(--space-12); /* Increased for larger circles */
    word-wrap: break-word;
    hyphens: auto;
  }

  /* Active state - with borders */
  .steps-indicator__step--active .steps-indicator__number {
    background-color: var(--color-brand-secondary-light);
    border: 2px solid var(--color-brand-secondary-light);
    color: var(--color-white);
    transform: scale(1.05);
  }

  .steps-indicator__step--active .steps-indicator__label {
    color: var(--color-brand-secondary-light);
    font-weight: 600;
  }

  /* Completed state - filled */
  .steps-indicator__step--completed .steps-indicator__number {
    background-color: var(--color-brand-secondary);
    border-color: var(--color-brand-secondary);
    color: white;
  }

  .steps-indicator__step--completed .steps-indicator__label {
    color: var(--color-brand-secondary);
  }

  /* Loading state */
  .steps-indicator--loading .steps-indicator__number {
    position: relative;
    overflow: hidden;
  }

  .steps-indicator--loading .steps-indicator__number::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.3) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    animation: shimmer 1.5s infinite;
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }

  .steps-indicator--loading .steps-indicator__section {
    position: relative;
    overflow: hidden;
  }

  .steps-indicator--loading .steps-indicator__section::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.3) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    animation: shimmer 1.5s infinite;
  }

  /* Responsive adjustments */
  @media (max-width: 640px) {
    .steps-indicator__label {
      font-size: var(--font-size-xs);
      max-width: 80px;
    }
  }

  @media (max-width: 480px) {
    .steps-indicator {
      margin-left: var(--space-4);
    }

    .steps-indicator__progress-bar {
      flex-direction: column;
      width: var(--space-2);
      height: auto;
      position: absolute;
      left: 17px;
      top: 14px;
      bottom: 0;
      margin: 0;
    }

    .steps-indicator__section {
      width: 100%;
      height: auto;
      flex: 1;
    }

    .steps-indicator__steps {
      position: relative;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--space-8);
    }

    .steps-indicator__step {
      flex-direction: row;
      align-items: center;
      text-align: left;
      width: auto;
      max-width: none;
    }

    .steps-indicator__number-container {
      position: static;
      transform: none;
      margin-right: var(--space-3);
    }

    .steps-indicator__label {
      margin-top: 0;
      max-width: none;
    }
  }
`;
