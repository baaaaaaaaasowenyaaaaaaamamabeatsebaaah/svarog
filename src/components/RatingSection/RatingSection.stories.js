// src/components/RatingSection/RatingSection.stories.js
import RatingSection from './RatingSection.js';

// Smart config loading: try local first, fallback to production
let apiConfig;
try {
  // Try local config (development)
  apiConfig = (await import('../../config/api.config.local.js')).apiConfig;
  console.log('🔑 RatingSection: Using local API config');
} catch {
  // Fallback to production config
  apiConfig = (await import('../../config/api.config.js')).apiConfig;
  console.log('🌍 RatingSection: Using production API config');
}

const createStatusBanner = () => {
  const hasGoogleKey =
    apiConfig.googleMaps?.apiKey &&
    !['YOUR_GOOGLE_MAPS_API_KEY_HERE', 'YOUR_GOOGLE_MAPS_API_KEY'].includes(
      apiConfig.googleMaps.apiKey
    );

  const hasFacebookToken =
    apiConfig.facebook?.accessToken &&
    !['YOUR_FACEBOOK_ACCESS_TOKEN_HERE', 'YOUR_FACEBOOK_ACCESS_TOKEN'].includes(
      apiConfig.facebook.accessToken
    );

  const banner = document.createElement('div');
  banner.style.cssText = `
    padding: 12px 16px;
    margin-bottom: 20px;
    border-radius: 4px;
    font-size: 14px;
    line-height: 1.4;
  `;

  let status = '';
  let bgColor = '';
  let borderColor = '';
  let textColor = '';

  if (hasGoogleKey && hasFacebookToken) {
    status = '✅ Beide APIs konfiguriert - Live-Daten werden geladen';
    bgColor = '#d4edda';
    borderColor = '#c3e6cb';
    textColor = '#155724';
  } else if (hasGoogleKey || hasFacebookToken) {
    status = '⚠️ Nur eine API konfiguriert - Teilweise Live-Daten';
    bgColor = '#fff3cd';
    borderColor = '#ffeaa7';
    textColor = '#856404';
  } else {
    status = '📱 Demo-Modus - Mock-Daten werden verwendet';
    bgColor = '#cce7ff';
    borderColor = '#99d6ff';
    textColor = '#0056b3';
  }

  banner.style.backgroundColor = bgColor;
  banner.style.border = `1px solid ${borderColor}`;
  banner.style.color = textColor;

  banner.innerHTML = `
    <strong>${status}</strong><br>
    <small>
      Google Places API: ${hasGoogleKey ? '✅ Konfiguriert' : '❌ Fehlend'} |
      Facebook Graph API: ${hasFacebookToken ? '✅ Konfiguriert' : '❌ Fehlend'}
    </small>
  `;

  return banner;
};

export default {
  title: 'Components/RatingSection',
  component: RatingSection,
  tags: ['autodocs'],
};

// Complete rating section with both Google and Facebook
export const Complete = () => {
  const container = document.createElement('div');
  container.appendChild(createStatusBanner());

  const ratingSection = RatingSection({
    title: 'Kundenbewertungen',
    googlePlaceId: 'ChIJ9ZsAL_p1nkcRaVYZabonLbg', // Example Google Place ID
    facebookPageId: '1234567890', // Example Facebook Page ID
    showWertgarantie: true,
    wertgarantieImageUrl: 'https://picsum.photos/200/80',
    onLoadComplete: (platform, data) => {
      console.log(`${platform} data loaded:`, data);
    },
    onError: (platform, error) => {
      console.error(`${platform} error:`, error);
    },
  });

  container.appendChild(ratingSection.getElement());
  return container;
};

// Only Google ratings
export const GoogleOnly = () => {
  const container = document.createElement('div');
  container.appendChild(createStatusBanner());

  const ratingSection = RatingSection({
    title: 'Google Bewertungen',
    googlePlaceId: 'ChIJ9ZsAL_p1nkcRaVYZabonLbg',
    showWertgarantie: true,
    wertgarantieImageUrl: 'https://picsum.photos/200/80',
  });

  container.appendChild(ratingSection.getElement());
  return container;
};

// Only Facebook ratings
export const FacebookOnly = () => {
  const container = document.createElement('div');
  container.appendChild(createStatusBanner());

  const ratingSection = RatingSection({
    title: 'Facebook Bewertungen',
    facebookPageId: '1234567890',
    showWertgarantie: true,
    wertgarantieImageUrl: '/https://picsum.photos/200/80',
  });

  container.appendChild(ratingSection.getElement());
  return container;
};

// Without Wertgarantie logo
export const WithoutWertgarantie = () => {
  const container = document.createElement('div');
  container.appendChild(createStatusBanner());

  const ratingSection = RatingSection({
    title: 'Bewertungen ohne Siegel',
    googlePlaceId: 'ChIJ9ZsAL_p1nkcRaVYZabonLbg',
    facebookPageId: '1234567890',
    showWertgarantie: false,
  });

  container.appendChild(ratingSection.getElement());
  return container;
};

// Custom Wertgarantie image
export const CustomWertgarantie = () => {
  const container = document.createElement('div');
  container.appendChild(createStatusBanner());

  const ratingSection = RatingSection({
    title: 'Bewertungen mit Custom Siegel',
    googlePlaceId: 'ChIJ9ZsAL_p1nkcRaVYZabonLbg',
    facebookPageId: '1234567890',
    showWertgarantie: true,
    wertgarantieImageUrl: '/https://picsum.photos/200/80',
  });

  container.appendChild(ratingSection.getElement());
  return container;
};

// Interactive example with controls
export const Interactive = () => {
  const container = document.createElement('div');
  container.appendChild(createStatusBanner());

  const currentRatingSection = RatingSection({
    title: 'Interaktive Bewertungen',
    googlePlaceId: 'ChIJ9ZsAL_p1nkcRaVYZabonLbg',
    facebookPageId: '1234567890',
    showWertgarantie: true,
    wertgarantieImageUrl: 'https://picsum.photos/200/80',
    onLoadComplete: (platform, _data) => {
      updateStatus(`✅ ${platform} erfolgreich geladen`);
    },
    onError: (platform, error) => {
      updateStatus(`❌ ${platform} Fehler: ${error.message}`);
    },
  });

  // Controls container
  const controls = document.createElement('div');
  controls.style.cssText = `
    background: #f8f9fa;
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 20px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12px;
    align-items: center;
  `;

  // Title input
  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.value = 'Interaktive Bewertungen';
  titleInput.placeholder = 'Section Title';
  titleInput.style.cssText =
    'padding: 8px; border: 1px solid #ddd; border-radius: 4px;';

  // Google Place ID input
  const googleInput = document.createElement('input');
  googleInput.type = 'text';
  googleInput.value = 'ChIJ9ZsAL_p1nkcRaVYZabonLbg';
  googleInput.placeholder = 'Google Place ID';
  googleInput.style.cssText =
    'padding: 8px; border: 1px solid #ddd; border-radius: 4px;';

  // Facebook Page ID input
  const facebookInput = document.createElement('input');
  facebookInput.type = 'text';
  facebookInput.value = '1234567890';
  facebookInput.placeholder = 'Facebook Page ID';
  facebookInput.style.cssText =
    'padding: 8px; border: 1px solid #ddd; border-radius: 4px;';

  // Wertgarantie toggle
  const wertgarantieToggle = document.createElement('input');
  wertgarantieToggle.type = 'checkbox';
  wertgarantieToggle.checked = true;
  wertgarantieToggle.id = 'wertgarantie-toggle';

  const wertgarantieLabel = document.createElement('label');
  wertgarantieLabel.htmlFor = 'wertgarantie-toggle';
  wertgarantieLabel.textContent = 'Wertgarantie anzeigen';
  wertgarantieLabel.style.display = 'flex';
  wertgarantieLabel.style.alignItems = 'center';
  wertgarantieLabel.style.gap = '8px';
  wertgarantieLabel.insertBefore(
    wertgarantieToggle,
    wertgarantieLabel.firstChild
  );

  // Update button
  const updateBtn = document.createElement('button');
  updateBtn.textContent = 'Aktualisieren';
  updateBtn.style.cssText = `
    padding: 8px 16px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  `;

  // Refresh button
  const refreshBtn = document.createElement('button');
  refreshBtn.textContent = 'Cache leeren & neu laden';
  refreshBtn.style.cssText = `
    padding: 8px 16px;
    background: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  `;

  // Status display
  const statusDisplay = document.createElement('div');
  statusDisplay.style.cssText = `
    grid-column: 1 / -1;
    padding: 8px;
    background: #e9ecef;
    border-radius: 4px;
    font-size: 14px;
    min-height: 20px;
  `;

  const updateStatus = (message) => {
    statusDisplay.textContent = message;
    setTimeout(() => {
      statusDisplay.textContent = '';
    }, 5000);
  };

  // Event handlers
  updateBtn.onclick = () => {
    currentRatingSection.update({
      title: titleInput.value,
      googlePlaceId: googleInput.value || null,
      facebookPageId: facebookInput.value || null,
      showWertgarantie: wertgarantieToggle.checked,
    });
    updateStatus('Konfiguration aktualisiert');
  };

  refreshBtn.onclick = async () => {
    updateStatus('Cache wird geleert...');
    await currentRatingSection.refresh();
    updateStatus('Daten neu geladen');
  };

  // Add controls
  controls.appendChild(titleInput);
  controls.appendChild(googleInput);
  controls.appendChild(facebookInput);
  controls.appendChild(wertgarantieLabel);
  controls.appendChild(updateBtn);
  controls.appendChild(refreshBtn);
  controls.appendChild(statusDisplay);

  container.appendChild(controls);
  container.appendChild(currentRatingSection.getElement());

  return container;
};

// Error handling demo
export const ErrorHandling = () => {
  const container = document.createElement('div');
  container.appendChild(createStatusBanner());

  const info = document.createElement('div');
  info.style.cssText = `
    background: #fff3cd;
    padding: 12px;
    border-radius: 4px;
    margin-bottom: 16px;
    font-size: 14px;
    border: 1px solid #ffeaa7;
  `;
  info.innerHTML = `
    <strong>Error Handling Demo</strong><br>
    Diese Story verwendet absichtlich ungültige IDs um Fehlerbehandlung zu demonstrieren.
  `;

  const ratingSection = RatingSection({
    title: 'Fehlerbehandlung Demo',
    googlePlaceId: 'invalid_place_id_123',
    facebookPageId: 'invalid_page_id_456',
    showWertgarantie: true,
    wertgarantieImageUrl: 'https://picsum.photos/200/80',
    onError: (platform, error) => {
      console.log(`Demo error for ${platform}:`, error.message);
    },
  });

  container.appendChild(info);
  container.appendChild(ratingSection.getElement());
  return container;
};

// Performance monitoring
export const PerformanceMonitoring = () => {
  const container = document.createElement('div');
  container.appendChild(createStatusBanner());

  const metricsDisplay = document.createElement('div');
  metricsDisplay.style.cssText = `
    background: #e7f3ff;
    padding: 12px;
    border-radius: 4px;
    margin-bottom: 16px;
    font-size: 14px;
    border: 1px solid #bee5eb;
  `;

  const startTime = Date.now();
  const loadTimes = {};

  const updateMetrics = () => {
    const cacheStatus = ratingSection.getCacheStatus();
    metricsDisplay.innerHTML = `
      <strong>Performance Metrics</strong><br>
      <strong>Load Times:</strong><br>
      Google: ${loadTimes.google || 'Loading...'}ms<br>
      Facebook: ${loadTimes.facebook || 'Loading...'}ms<br>
      <strong>Cache Status:</strong><br>
      Google: ${cacheStatus.google ? (cacheStatus.google.cached ? `Cached (${Math.round(cacheStatus.google.age / 1000)}s alt)` : 'Not cached') : 'N/A'}<br>
      Facebook: ${cacheStatus.facebook ? (cacheStatus.facebook.cached ? `Cached (${Math.round(cacheStatus.facebook.age / 1000)}s alt)` : 'Not cached') : 'N/A'}
    `;
  };

  const ratingSection = RatingSection({
    title: 'Performance Monitoring',
    googlePlaceId: 'ChIJ9ZsAL_p1nkcRaVYZabonLbg',
    facebookPageId: '1234567890',
    showWertgarantie: true,
    wertgarantieImageUrl: 'https://picsum.photos/200/80',
    onLoadComplete: (platform, _data) => {
      loadTimes[platform] = Date.now() - startTime;
      updateMetrics();
    },
    onError: (platform, error) => {
      loadTimes[platform] = `Error: ${error.message}`;
      updateMetrics();
    },
  });

  // Update metrics every second
  setInterval(updateMetrics, 1000);
  updateMetrics();

  container.appendChild(metricsDisplay);
  container.appendChild(ratingSection.getElement());
  return container;
};
