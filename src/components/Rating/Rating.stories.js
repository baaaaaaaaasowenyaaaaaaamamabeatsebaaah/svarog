// src/components/Rating/Rating.stories.js
import Rating from './Rating.js';

export default {
  title: 'Components/Rating',
  component: Rating,
};

export const Default = () => {
  const rating = Rating({
    source: 'google',
    score: 4.7,
    totalRatings: 1234,
    reviewerImages: [
      '/api/placeholder/40/40',
      '/api/placeholder/40/40',
      '/api/placeholder/40/40',
    ],
  });
  return rating.getElement();
};

export const Facebook = () => {
  const rating = Rating({
    source: 'facebook',
    score: 4.5,
    totalRatings: 5678,
  });
  return rating.getElement();
};

export const Trustpilot = () => {
  const rating = Rating({
    source: 'trustpilot',
    score: 4.9,
    totalRatings: 9012,
    reviewerImages: [
      '/api/placeholder/40/40',
      '/api/placeholder/40/40',
      '/api/placeholder/40/40',
      '/api/placeholder/40/40',
      '/api/placeholder/40/40',
    ],
  });
  return rating.getElement();
};

export const NoImages = () => {
  const rating = Rating({
    source: 'google',
    score: 4.2,
    totalRatings: 3456,
    options: {
      showReviewerImages: false,
    },
  });
  return rating.getElement();
};

export const LimitedImages = () => {
  const rating = Rating({
    source: 'facebook',
    score: 4.6,
    totalRatings: 7890,
    reviewerImages: [
      '/api/placeholder/40/40',
      '/api/placeholder/40/40',
      '/api/placeholder/40/40',
      '/api/placeholder/40/40',
      '/api/placeholder/40/40',
      '/api/placeholder/40/40',
    ],
    options: {
      maxReviewerImages: 3,
    },
  });
  return rating.getElement();
};

export const WithFallbackImage = () => {
  const rating = Rating({
    source: 'google',
    score: 4.3,
    totalRatings: 2468,
    // Intentionally using invalid images to trigger fallback
    reviewerImages: [
      '/invalid-image-1.jpg',
      '/invalid-image-2.jpg',
      '/invalid-image-3.jpg',
    ],
    options: {
      fallbackImageUrl: '/api/placeholder/40/40',
    },
  });
  return rating.getElement();
};

export const Interactive = () => {
  const container = document.createElement('div');

  const rating = Rating({
    source: 'google',
    score: 4.0,
    totalRatings: 2500,
    reviewerImages: ['/api/placeholder/40/40', '/api/placeholder/40/40'],
    options: {
      fallbackImageUrl: '/api/placeholder/40/40',
    },
  });

  container.appendChild(rating.getElement());

  // Add controls to update the rating
  const controls = document.createElement('div');
  controls.style.marginTop = '20px';

  // Score controls
  const scoreLabel = document.createElement('label');
  scoreLabel.textContent = 'Score: ';
  const scoreInput = document.createElement('input');
  scoreInput.type = 'number';
  scoreInput.min = '0';
  scoreInput.max = '5';
  scoreInput.step = '0.1';
  scoreInput.value = '4.0';
  scoreInput.style.width = '60px';
  scoreInput.addEventListener('change', () => {
    rating.setScore(parseFloat(scoreInput.value));
  });

  // Ratings count controls
  const ratingsLabel = document.createElement('label');
  ratingsLabel.textContent = 'Ratings: ';
  ratingsLabel.style.marginLeft = '20px';
  const ratingsInput = document.createElement('input');
  ratingsInput.type = 'number';
  ratingsInput.min = '0';
  ratingsInput.value = '2500';
  ratingsInput.style.width = '80px';
  ratingsInput.addEventListener('change', () => {
    rating.setTotalRatings(parseInt(ratingsInput.value));
  });

  // Source selector
  const sourceLabel = document.createElement('label');
  sourceLabel.textContent = 'Source: ';
  sourceLabel.style.marginLeft = '20px';
  const sourceSelect = document.createElement('select');
  ['google', 'facebook', 'trustpilot'].forEach((source) => {
    const option = document.createElement('option');
    option.value = source;
    option.textContent = source.charAt(0).toUpperCase() + source.slice(1);
    sourceSelect.appendChild(option);
  });
  sourceSelect.addEventListener('change', () => {
    rating.update({ source: sourceSelect.value });
  });

  // Reviewer images controls
  const imagesLabel = document.createElement('label');
  imagesLabel.textContent = 'Images: ';
  imagesLabel.style.marginLeft = '20px';
  const imagesToggle = document.createElement('input');
  imagesToggle.type = 'checkbox';
  imagesToggle.checked = true;
  imagesToggle.addEventListener('change', () => {
    rating.update({
      options: {
        showReviewerImages: imagesToggle.checked,
      },
    });
  });

  // Append controls
  controls.appendChild(scoreLabel);
  controls.appendChild(scoreInput);
  controls.appendChild(ratingsLabel);
  controls.appendChild(ratingsInput);
  controls.appendChild(sourceLabel);
  controls.appendChild(sourceSelect);
  controls.appendChild(imagesLabel);
  controls.appendChild(imagesToggle);

  container.appendChild(controls);

  return container;
};
