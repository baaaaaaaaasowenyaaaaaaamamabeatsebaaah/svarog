// src/components/Map/Map.stories.js - Modern Google Maps API Examples
import Map from './Map.js';
import { mapsConfig } from '../../config/maps.config.js';

const getApiKey = () => mapsConfig.apiKey;

const getApiKeyStatus = () => {
  const key = mapsConfig.apiKey;
  if (
    !key ||
    [
      'YOUR_GOOGLE_MAPS_API_KEY',
      'YOUR_ACTUAL_API_KEY_HERE',
      'YOUR_API_KEY',
      'API_KEY_HERE',
    ].includes(key)
  ) {
    return { valid: false, message: 'No valid API key configured' };
  }
  return { valid: true, message: 'Modern API key configured' };
};

const createStatusBanner = () => {
  const status = getApiKeyStatus();
  const banner = document.createElement('div');

  banner.style.cssText = `
    padding: 12px 16px;
    margin-bottom: 20px;
    border-radius: 4px;
    font-size: 14px;
    ${
      status.valid
        ? 'background: #d4edda; border: 1px solid #c3e6cb; color: #155724;'
        : 'background: #fff3cd; border: 1px solid #ffeaa7; color: #856404;'
    }
  `;

  banner.innerHTML = `
    <strong>${status.valid ? '✅' : '⚠️'} ${status.message}</strong><br>
    <small>${
      status.valid
        ? 'Maps will use modern AdvancedMarkerElement and Places API'
        : 'Maps will display in preview mode. Add API key to src/config/MapsConfig.js for modern functionality'
    }</small>
  `;

  return banner;
};

// Modern mucHANDY shop with AdvancedMarkerElement
export const MuchandyShopModern = () => {
  const container = document.createElement('div');
  container.appendChild(createStatusBanner());

  const map = Map({
    apiKey: getApiKey(),
    latitude: 48.1417262,
    longitude: 11.5609816,
    title: 'mucHANDY Handy Reparatur & An- und Verkauf',
    shopInfo: {
      name: 'mucHANDY München',
      address: 'Rosenheimer Str. 145, 81671 München',
      phone: '+49 89 12345678',
      website: 'https://www.muchandy.de',
      hours: 'Mo-Fr: 10:00-19:00, Sa: 10:00-16:00',
    },
    autoOpenInfo: true,
    onMapLoad: ({ map, marker }) => {
      console.log('Modern map loaded:', { map, marker });
    },
  });

  container.appendChild(map.getElement());
  return container;
};

// Mock version shows exactly what users see without API key
export const MockPreviewMode = () => {
  const container = document.createElement('div');

  const info = document.createElement('p');
  info.style.marginBottom = '10px';
  info.textContent =
    'This is how the map looks without an API key (modern template):';
  container.appendChild(info);

  const map = Map({
    latitude: 48.1417262,
    longitude: 11.5609816,
    title: 'mucHANDY Handy Reparatur Munich',
    shopInfo: {
      address: 'Rosenheimer Str. 145, 81671 München',
      phone: '+49 89 12345678',
      hours: 'Mo-Fr: 10:00-19:00',
    },
  });

  container.appendChild(map.getElement());
  return container;
};

// Using modern Place ID with new Places API
export const ModernPlacesAPI = () => {
  const container = document.createElement('div');
  container.appendChild(createStatusBanner());

  const map = Map({
    apiKey: getApiKey(),
    placeId: 'ChIJ9ZsAL_p1nkcRaVYZabonLbg', // Valid modern Place ID
    title: 'mucHANDY Luisenstraße',
    autoOpenInfo: true,
    onMapLoad: ({ _map, _marker }) => {
      console.log('Place details loaded with modern API');
    },
  });

  container.appendChild(map.getElement());
  return container;
};

// Multiple locations with modern markers
export const ModernElectronicsStores = () => {
  const container = document.createElement('div');
  container.appendChild(createStatusBanner());

  const stores = [
    {
      name: 'Saturn Munich City',
      lat: 48.1359,
      lng: 11.5754,
      address: 'Schwanthalerstraße 115, 80339 München',
      type: 'Electronics',
    },
    {
      name: 'MediaMarkt Munich',
      lat: 48.1486,
      lng: 11.5633,
      address: 'Einsteinstraße 130, 81675 München',
      type: 'Electronics',
    },
    {
      name: 'Apple Store Munich',
      lat: 48.1378,
      lng: 11.576,
      address: 'Rosenstraße 1, 80331 München',
      type: 'Apple Store',
    },
    {
      name: 'mucHANDY München',
      lat: 48.1417262,
      lng: 11.5609816,
      address: 'Rosenheimer Str. 145, 81671 München',
      type: 'Phone Repair',
    },
  ];

  const currentStore = stores[0];

  const map = Map({
    apiKey: getApiKey(),
    latitude: currentStore.lat,
    longitude: currentStore.lng,
    title: currentStore.name,
    shopInfo: {
      address: currentStore.address,
    },
    autoOpenInfo: true,
    options: {
      zoom: 15,
      mapType: 'roadmap',
    },
  });

  const select = document.createElement('select');
  select.style.cssText = `
    margin-bottom: 10px;
    padding: 8px;
    font-size: 14px;
    border: 1px solid #ddd;
    border-radius: 4px;
    width: 100%;
    max-width: 300px;
  `;

  stores.forEach((store, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = `${store.name} (${store.type})`;
    select.appendChild(option);
  });

  select.onchange = (e) => {
    const store = stores[e.target.value];
    map.setCoordinates(store.lat, store.lng);
    map.update({
      title: store.name,
      shopInfo: { address: store.address },
    });
  };

  container.appendChild(select);
  container.appendChild(map.getElement());

  return container;
};

// Dynamic location updates with modern API
export const ModernDynamicUpdates = () => {
  const container = document.createElement('div');
  container.appendChild(createStatusBanner());

  const map = Map({
    apiKey: getApiKey(),
    latitude: 48.1371,
    longitude: 11.5754,
    title: 'Munich City Center',
    options: {
      zoom: 14,
    },
  });

  const buttonsContainer = document.createElement('div');
  buttonsContainer.style.cssText =
    'margin-bottom: 10px; display: flex; gap: 10px; flex-wrap: wrap;';

  const locations = [
    {
      name: 'Load mucHANDY Shop',
      lat: 48.1417262,
      lng: 11.5609816,
      title: 'mucHANDY Shop',
      shopInfo: {
        name: 'mucHANDY München',
        address: 'Rosenheimer Str. 145, 81671 München',
        phone: '+49 89 12345678',
      },
    },
    {
      name: 'Load Marienplatz',
      lat: 48.1374,
      lng: 11.5755,
      title: 'Marienplatz München',
      shopInfo: {
        address: 'Marienplatz, 80331 München',
      },
    },
    {
      name: 'Load English Garden',
      lat: 48.1641,
      lng: 11.6037,
      title: 'Englischer Garten',
      shopInfo: {
        address: 'Englischer Garten, München',
      },
    },
  ];

  locations.forEach((location, index) => {
    const button = document.createElement('button');
    button.textContent = location.name;
    button.style.cssText = `
      padding: 8px 16px;
      background: ${index === 0 ? '#007bff' : '#28a745'};
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    `;

    button.onclick = () => {
      map.setCoordinates(location.lat, location.lng);
      map.update({
        title: location.title,
        shopInfo: location.shopInfo,
      });

      // Update button styles
      locations.forEach((_, i) => {
        const btn = buttonsContainer.children[i];
        btn.style.background = i === index ? '#dc3545' : '#28a745';
        btn.textContent = i === index ? 'Loaded!' : locations[i].name;
      });
    };

    buttonsContainer.appendChild(button);
  });

  container.appendChild(buttonsContainer);
  container.appendChild(map.getElement());

  return container;
};

// Modern URL parsing example
export const ModernURLParsing = () => {
  const container = document.createElement('div');
  container.appendChild(createStatusBanner());

  const map = Map({
    apiKey: getApiKey(),
    latitude: 48.1371,
    longitude: 11.5754,
    title: 'Default Location',
  });

  const urlInput = document.createElement('input');
  urlInput.type = 'text';
  urlInput.placeholder = 'Paste Google Maps URL here...';
  urlInput.style.cssText = `
    width: 100%;
    max-width: 500px;
    padding: 8px;
    font-size: 14px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 10px;
  `;

  const parseButton = document.createElement('button');
  parseButton.textContent = 'Parse URL';
  parseButton.style.cssText = `
    padding: 8px 16px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-left: 10px;
  `;

  const exampleUrls = [
    'https://maps.google.com/maps/place/Marienplatz/@48.1374,11.5755,17z',
    'https://maps.google.com/maps/@48.1417,11.5609,16z',
    'https://maps.google.com/maps/place/Eiffel+Tower/@48.8584,2.2945,17z',
  ];

  const exampleContainer = document.createElement('div');
  exampleContainer.style.marginBottom = '10px';

  const exampleLabel = document.createElement('p');
  exampleLabel.textContent = 'Example URLs:';
  exampleLabel.style.margin = '10px 0 5px 0';
  exampleContainer.appendChild(exampleLabel);

  exampleUrls.forEach((url) => {
    const exampleButton = document.createElement('button');
    exampleButton.textContent = url.split('/').pop().split('@')[0] || 'Example';
    exampleButton.style.cssText = `
      margin: 2px;
      padding: 4px 8px;
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
    `;
    exampleButton.onclick = () => {
      urlInput.value = url;
    };
    exampleContainer.appendChild(exampleButton);
  });

  parseButton.onclick = () => {
    const url = urlInput.value.trim();
    if (url) {
      map.setGoogleMapsUrl(url);
      parseButton.textContent = 'Parsed!';
      parseButton.style.background = '#28a745';
      setTimeout(() => {
        parseButton.textContent = 'Parse URL';
        parseButton.style.background = '#007bff';
      }, 2000);
    }
  };

  const inputContainer = document.createElement('div');
  inputContainer.style.display = 'flex';
  inputContainer.style.marginBottom = '10px';
  inputContainer.appendChild(urlInput);
  inputContainer.appendChild(parseButton);

  container.appendChild(exampleContainer);
  container.appendChild(inputContainer);
  container.appendChild(map.getElement());

  return container;
};

// Configuration and setup guide
export const ModernSetupGuide = () => {
  const container = document.createElement('div');

  const info = document.createElement('div');
  info.style.cssText = `
    padding: 20px;
    background-color: #f0f0f0;
    border-radius: 8px;
    margin-bottom: 20px;
    line-height: 1.6;
  `;

  info.innerHTML = `
    <h3>Modern Google Maps API Setup (2025)</h3>
    <p>To enable the modern Google Maps experience with AdvancedMarkerElement and new Places API:</p>

    <h4>1. Get API Key</h4>
    <ol>
      <li>Visit <a href="https://console.cloud.google.com/" target="_blank">Google Cloud Console</a></li>
      <li>Create new project or select existing</li>
      <li>Enable these APIs:
        <ul>
          <li>✅ Maps JavaScript API</li>
          <li>✅ Places API (New)</li>
          <li>✅ Maps Static API (optional)</li>
        </ul>
      </li>
      <li>Create API key with proper restrictions</li>
    </ol>

    <h4>2. Modern Features Enabled</h4>
    <ul>
      <li>🚀 <strong>AdvancedMarkerElement</strong> - No deprecation warnings</li>
      <li>🚀 <strong>Async Loading</strong> - Optimal performance</li>
      <li>🚀 <strong>Modern Places API</strong> - Latest place details</li>
      <li>🚀 <strong>Proper Event Handling</strong> - gmp-click events</li>
    </ul>

    <h4>3. Configuration</h4>
    <pre style="background: white; padding: 10px; border-radius: 4px; font-size: 12px;">
// src/config/MapsConfig.js
export const mapsConfig = {
  apiKey: 'YOUR_ACTUAL_API_KEY_HERE'
};</pre>

    <h4>Current Status</h4>
    <div style="background: ${getApiKeyStatus().valid ? '#d4edda' : '#fff3cd'}; padding: 10px; border-radius: 4px;">
      <strong>${getApiKeyStatus().valid ? '✅' : '⚠️'} ${getApiKeyStatus().message}</strong>
    </div>

    <h4>Modern vs Legacy Comparison</h4>
    <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
      <tr style="background: #f8f9fa;">
        <th style="padding: 8px; border: 1px solid #dee2e6;">Feature</th>
        <th style="padding: 8px; border: 1px solid #dee2e6;">Legacy</th>
        <th style="padding: 8px; border: 1px solid #dee2e6;">Modern (2025)</th>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #dee2e6;">Markers</td>
        <td style="padding: 8px; border: 1px solid #dee2e6;">❌ google.maps.Marker (deprecated)</td>
        <td style="padding: 8px; border: 1px solid #dee2e6;">✅ AdvancedMarkerElement</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #dee2e6;">Loading</td>
        <td style="padding: 8px; border: 1px solid #dee2e6;">⚠️ Synchronous loading</td>
        <td style="padding: 8px; border: 1px solid #dee2e6;">✅ Async with loading=async</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #dee2e6;">Places API</td>
        <td style="padding: 8px; border: 1px solid #dee2e6;">⚠️ PlacesService (legacy)</td>
        <td style="padding: 8px; border: 1px solid #dee2e6;">✅ Place class (modern)</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #dee2e6;">Events</td>
        <td style="padding: 8px; border: 1px solid #dee2e6;">addListener('click')</td>
        <td style="padding: 8px; border: 1px solid #dee2e6;">✅ addEventListener('gmp-click')</td>
      </tr>
    </table>
  `;

  const map = Map({
    apiKey: getApiKey(),
    latitude: 48.1417262,
    longitude: 11.5609816,
    title: 'Modern Map Implementation',
    shopInfo: {
      name: 'Svarog UI Map Component',
      address: 'Modern Google Maps API 2025',
      phone: '+49 123 456789',
      hours: 'Always available',
    },
  });

  container.appendChild(info);
  container.appendChild(map.getElement());

  return container;
};

// Performance comparison
export const PerformanceShowcase = () => {
  const container = document.createElement('div');
  container.appendChild(createStatusBanner());

  const performanceInfo = document.createElement('div');
  performanceInfo.style.cssText = `
    background: #e7f3ff;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 15px;
    border-left: 4px solid #007bff;
  `;

  performanceInfo.innerHTML = `
    <h4 style="margin: 0 0 10px 0;">🚀 Modern Performance Features</h4>
    <ul style="margin: 0; padding-left: 20px;">
      <li><strong>Async Script Loading</strong> - Non-blocking page load</li>
      <li><strong>Modern Marker API</strong> - Better rendering performance</li>
      <li><strong>Efficient Place Details</strong> - Optimized data fetching</li>
      <li><strong>Automatic Caching</strong> - Script loaded once, reused</li>
    </ul>
  `;

  const startTime = Date.now();

  const map = Map({
    apiKey: getApiKey(),
    latitude: 48.1417262,
    longitude: 11.5609816,
    title: 'Performance Test Location',
    onMapLoad: ({ map, marker }) => {
      const loadTime = Date.now() - startTime;
      const perfDisplay = document.createElement('div');
      perfDisplay.style.cssText = `
        background: #d4edda;
        padding: 10px;
        border-radius: 4px;
        margin-top: 10px;
        font-size: 14px;
      `;
      perfDisplay.innerHTML = `
        ✅ <strong>Map loaded successfully!</strong><br>
        Load time: ${loadTime}ms<br>
        Marker type: ${marker.constructor.name}<br>
        Modern API: ${map.getMapTypeId ? 'Yes' : 'No'}
      `;
      container.appendChild(perfDisplay);
    },
    onError: (error) => {
      const errorDisplay = document.createElement('div');
      errorDisplay.style.cssText = `
        background: #f8d7da;
        padding: 10px;
        border-radius: 4px;
        margin-top: 10px;
        font-size: 14px;
      `;
      errorDisplay.innerHTML = `❌ <strong>Load failed:</strong> ${error.message}`;
      container.appendChild(errorDisplay);
    },
  });

  container.appendChild(performanceInfo);
  container.appendChild(map.getElement());

  return container;
};
