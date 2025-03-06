import Rating from './Rating.js';

export default {
  title: 'Components/Rating',
  component: Rating,
};

export const Default = () => {
  const rating = new Rating({
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
  const rating = new Rating({
    source: 'facebook',
    score: 4.5,
    totalRatings: 5678,
  });
  return rating.getElement();
};

export const Trustpilot = () => {
  const rating = new Rating({
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
  const rating = new Rating({
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
  const rating = new Rating({
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
