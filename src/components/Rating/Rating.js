import './Rating.css';

/**
 * Rating Component for displaying ratings from various sources
 */
export default class Rating {
  /**
   * Create a new Rating instance
   * @param {Object} config - Configuration object
   * @param {string} config.source - Rating source (e.g., 'google', 'facebook', 'trustpilot')
   * @param {number} config.score - Overall rating score
   * @param {number} config.totalRatings - Total number of ratings
   * @param {Array} [config.reviewerImages] - Optional array of reviewer profile images
   * @param {Object} [config.options] - Additional customization options
   * @param {boolean} [config.options.showReviewerImages=true] - Whether to show reviewer images
   * @param {number} [config.options.maxReviewerImages=5] - Maximum number of reviewer images to display
   */
  constructor({
    source,
    score,
    totalRatings,
    reviewerImages = [],
    options = {},
  }) {
    // Validate required parameters
    if (!source) {
      throw new Error('Rating: source is required');
    }
    if (score === undefined) {
      throw new Error('Rating: score is required');
    }
    if (totalRatings === undefined) {
      throw new Error('Rating: totalRatings is required');
    }

    // Configuration
    this.config = {
      source: source.toLowerCase(),
      score: parseFloat(score).toFixed(1),
      totalRatings: this.formatNumber(totalRatings),
      reviewerImages: reviewerImages || [],
      options: {
        showReviewerImages: options.showReviewerImages !== false,
        maxReviewerImages: options.maxReviewerImages || 5,
      },
    };

    // Create the rating element
    this.element = this.createRatingElement();
  }

  /**
   * Format large numbers with abbreviated notation
   * @param {number} num - Number to format
   * @returns {string} Formatted number
   */
  formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  /**
   * Create source logo element
   * @returns {HTMLElement} Logo element
   */
  createSourceLogo() {
    const logoContainer = document.createElement('div');
    logoContainer.className = `rating__logo rating__logo--${this.config.source}`;

    // SVG logos for different sources
    const logoSVGs = {
      google: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
          <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.42 6.63v5.52h7.16c4.18-3.85 6.64-9.53 6.64-16.26z"/>
          <path fill="#34A853" d="M24 46c5.96 0 10.96-1.97 14.62-5.33l-7.16-5.52c-1.97 1.32-4.49 2.1-7.46 2.1-5.74 0-10.61-3.88-12.36-9.1H4.34v5.7C8.02 41.54 15.4 46 24 46z"/>
          <path fill="#FBBC05" d="M11.64 28.15c-.88-2.62-.88-5.47 0-8.1V14.35H4.34c-2.83 5.67-2.83 12.33 0 18l7.3-5.7z"/>
          <path fill="#EA4335" d="M24 9.5c3.25 0 6.18 1.18 8.48 3.48l6.36-6.36C34.96 2.54 29.96 0 24 0 15.4 0 8.02 4.46 4.34 11.35l7.3 5.7C13.39 13.38 18.26 9.5 24 9.5z"/>
        </svg>
      `,
      facebook: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
          <path fill="#3F51B5" d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4z"/>
          <path fill="#FFF" d="M26.57 35v-9.63h3.23l.48-3.75h-3.71v-2.4c0-1.09.3-1.83 1.86-1.83h2v-3.36c-.35-.05-1.54-.15-2.93-.15-2.9 0-4.89 1.77-4.89 5.02v2.79h-3.27v3.75h3.27V35h3.96z"/>
        </svg>
      `,
      trustpilot: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
          <path fill="#00B67A" d="M24 4l5.49 16.88H47l-14.36 10.43 5.49 16.88L24 37.75l-14.13 10.44 5.49-16.88L1 20.88h17.51z"/>
        </svg>
      `,
    };

    // Create SVG element
    const svgElement = document.createElement('div');
    svgElement.innerHTML = logoSVGs[this.config.source] || logoSVGs.google;
    svgElement.className = 'rating__logo-svg';
    logoContainer.appendChild(svgElement);

    return logoContainer;
  }

  /**
   * Create star rating element
   * @returns {HTMLElement} Star rating element
   */
  createStarRating() {
    const starContainer = document.createElement('div');
    starContainer.className = 'rating__stars';

    // Calculate full, half, and empty stars
    const fullStars = Math.floor(parseFloat(this.config.score));
    const halfStar = parseFloat(this.config.score) % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    // Create star elements
    const createStars = (type, count) => {
      for (let i = 0; i < count; i++) {
        const star = document.createElement('span');
        star.className = `rating__star rating__star--${type}`;
        star.innerHTML = '★';
        starContainer.appendChild(star);
      }
    };

    createStars('full', fullStars);
    createStars('half', halfStar);
    createStars('empty', emptyStars);

    return starContainer;
  }

  /**
   * Create reviewer images element
   * @returns {HTMLElement|null} Reviewer images element
   */
  createReviewerImages() {
    // Skip if images are disabled or empty
    if (
      !this.config.options.showReviewerImages ||
      this.config.reviewerImages.length === 0
    ) {
      return null;
    }

    const imagesContainer = document.createElement('div');
    imagesContainer.className = 'rating__reviewer-images';

    // Limit number of images
    const imagesToShow = this.config.reviewerImages.slice(
      0,
      this.config.options.maxReviewerImages
    );

    imagesToShow.forEach((imageUrl) => {
      const img = document.createElement('img');
      img.src = imageUrl;
      img.alt = 'Reviewer profile';
      img.className = 'rating__reviewer-image';
      imagesContainer.appendChild(img);
    });

    return imagesContainer;
  }

  /**
   * Create the full rating element
   * @returns {HTMLElement} Rating container element
   */
  createRatingElement() {
    const container = document.createElement('div');
    container.className = `rating rating--${this.config.source}`;

    // Create score section
    const scoreSection = document.createElement('div');
    scoreSection.className = 'rating__score-section';

    // Add logo
    const logo = this.createSourceLogo();
    scoreSection.appendChild(logo);

    // Create score details
    const scoreDetails = document.createElement('div');
    scoreDetails.className = 'rating__score-details';

    // Score number
    const scoreNumber = document.createElement('div');
    scoreNumber.className = 'rating__score-number';
    scoreNumber.textContent = this.config.score;
    scoreDetails.appendChild(scoreNumber);

    // Star rating
    const starRating = this.createStarRating();
    scoreDetails.appendChild(starRating);

    // Total ratings
    const totalRatings = document.createElement('div');
    totalRatings.className = 'rating__total-ratings';
    totalRatings.textContent = `${this.config.totalRatings} Bewertungen`;
    scoreDetails.appendChild(totalRatings);

    scoreSection.appendChild(scoreDetails);
    container.appendChild(scoreSection);

    // Add reviewer images if available
    const reviewerImages = this.createReviewerImages();
    if (reviewerImages) {
      container.appendChild(reviewerImages);
    }

    return container;
  }

  /**
   * Get the rating element
   * @returns {HTMLElement} Rating element
   */
  getElement() {
    return this.element;
  }
}
