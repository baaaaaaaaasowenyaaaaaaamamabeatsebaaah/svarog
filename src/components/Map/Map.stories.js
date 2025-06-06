import Map from './Map.js';
import { mapsConfig } from '../../config/maps.config.js';

// Use the config object
const getApiKey = () => mapsConfig.apiKey;

// Helper to check API key status
const getApiKeyStatus = () => {
  const key = mapsConfig.apiKey;
  if (
    !key ||
    key === 'YOUR_GOOGLE_MAPS_API_KEY' ||
    key === 'YOUR_ACTUAL_API_KEY_HERE'
  ) {
    return { valid: false, message: 'No valid API key configured' };
  }
  return { valid: true, message: 'API key configured' };
};

// Status banner component
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
        ? 'Maps will display with full Google Maps functionality'
        : 'Maps will display in preview mode. Add API key to src/config/MapsConfig.js for full functionality'
    }</small>
  `;

  return banner;
};

// Working example with your mucHANDY shop
export const MuchandyShopMunich = () => {
  const container = document.createElement('div');
  container.appendChild(createStatusBanner());

  const map = Map({
    apiKey: getApiKey(),
    // Using the coordinates directly since Place ID is old format
    latitude: 48.1417262,
    longitude: 11.5609816,
    locationName: 'mucHANDY Handy Reparatur & An- und Verkauf',
    shopInfo: {
      name: 'mucHANDY München',
      address: 'Rosenheimer Str. 145, 81671 München',
      phone: '+49 89 12345678',
      website: 'https://www.muchandy.de',
      hours: 'Mo-Fr: 10:00-19:00, Sa: 10:00-16:00',
    },
    autoOpenInfo: true,
  });

  container.appendChild(map.getElement());
  return container;
};

// Mock version without API key
export const MuchandyShopMockView = () => {
  const container = document.createElement('div');

  const info = document.createElement('p');
  info.style.marginBottom = '10px';
  info.textContent = 'This is how the map looks without an API key:';
  container.appendChild(info);

  const map = Map({
    latitude: 48.1417262,
    longitude: 11.5609816,
    locationName: 'mucHANDY Handy Reparatur Munich',
    shopInfo: {
      address: 'Rosenheimer Str. 145, 81671 München',
      phone: '+49 89 12345678',
      hours: 'Mo-Fr: 10:00-19:00',
    },
  });

  container.appendChild(map.getElement());
  return container;
};

// Using the new Place ID from your API test
export const MuchandyLuisenstrasse = () => {
  const container = document.createElement('div');
  container.appendChild(createStatusBanner());

  const map = Map({
    apiKey: getApiKey(),
    placeId: 'ChIJ9ZsAL_p1nkcRaVYZabonLbg', // Valid Place ID from your test
    locationName: 'mucHANDY Luisenstraße',
    autoOpenInfo: true,
  });

  container.appendChild(map.getElement());
  return container;
};

// Multiple shop examples with coordinates
export const MunichElectronicsStores = () => {
  const container = document.createElement('div');
  container.appendChild(createStatusBanner());

  const stores = [
    {
      name: 'Saturn Munich City',
      lat: 48.1359,
      lng: 11.5754,
      address: 'Schwanthalerstraße 115, 80339 München',
    },
    {
      name: 'MediaMarkt Munich',
      lat: 48.1486,
      lng: 11.5633,
      address: 'Einsteinstraße 130, 81675 München',
    },
    {
      name: 'Apple Store Munich',
      lat: 48.1378,
      lng: 11.576,
      address: 'Rosenstraße 1, 80331 München',
    },
  ];

  const currentStore = stores[0];

  const map = Map({
    apiKey: getApiKey(),
    latitude: currentStore.lat,
    longitude: currentStore.lng,
    locationName: currentStore.name,
    shopInfo: {
      address: currentStore.address,
    },
    autoOpenInfo: true,
    options: {
      zoom: 15,
    },
  });

  const select = document.createElement('select');
  select.style.cssText = `
    margin-bottom: 10px;
    padding: 8px;
    font-size: 14px;
    border: 1px solid #ddd;
    border-radius: 4px;
  `;

  stores.forEach((store, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = store.name;
    select.appendChild(option);
  });

  select.onchange = (e) => {
    const store = stores[e.target.value];
    map.setCoordinates(store.lat, store.lng);
    map.update({
      locationName: store.name,
      shopInfo: { address: store.address },
    });
  };

  container.appendChild(select);
  container.appendChild(map.getElement());

  return container;
};

// Dynamic URL update example
export const DynamicShopUpdate = () => {
  const container = document.createElement('div');
  container.appendChild(createStatusBanner());

  const map = Map({
    apiKey: getApiKey(),
    latitude: 48.1371,
    longitude: 11.5754,
    locationName: 'Munich City Center',
  });

  const button = document.createElement('button');
  button.textContent = 'Load mucHANDY Shop';
  button.style.cssText = `
    margin-bottom: 10px;
    padding: 8px 16px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  `;
  button.onclick = () => {
    map.setCoordinates(48.1417262, 11.5609816);
    map.update({
      locationName: 'mucHANDY Shop',
      shopInfo: {
        name: 'mucHANDY München',
        address: 'Rosenheimer Str. 145, 81671 München',
      },
    });
    button.textContent = 'Shop Loaded!';
    button.style.background = '#28a745';
  };

  container.appendChild(button);
  container.appendChild(map.getElement());

  return container;
};

// Shop selector with working place IDs
export const ShopSelector = () => {
  const container = document.createElement('div');
  container.appendChild(createStatusBanner());

  const shops = [
    {
      name: 'mucHANDY Munich (Coordinates)',
      latitude: 48.1417262,
      longitude: 11.5609816,
      info: {
        address: 'Rosenheimer Str. 145, 81671 München',
      },
    },
    {
      name: 'mucHANDY Luisenstraße',
      placeId: 'ChIJ9ZsAL_p1nkcRaVYZabonLbg',
    },
    {
      name: 'Munich Central Station',
      latitude: 48.1403,
      longitude: 11.5554,
      info: {
        name: 'Hauptbahnhof München',
        address: 'Bayerstraße 10A, 80335 München',
      },
    },
  ];

  const map = Map({
    apiKey: getApiKey(),
    latitude: shops[0].latitude,
    longitude: shops[0].longitude,
    locationName: shops[0].name,
    shopInfo: shops[0].info,
    autoOpenInfo: true,
  });

  const select = document.createElement('select');
  select.style.cssText = `
    margin-bottom: 10px;
    padding: 5px;
    font-size: 14px;
    border: 1px solid #ddd;
    border-radius: 4px;
    width: 100%;
    max-width: 300px;
  `;

  shops.forEach((shop, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = shop.name;
    select.appendChild(option);
  });

  select.onchange = (e) => {
    const shop = shops[e.target.value];
    if (shop.placeId) {
      map.setPlaceId(shop.placeId);
      map.update({ locationName: shop.name });
    } else if (shop.latitude && shop.longitude) {
      map.setCoordinates(shop.latitude, shop.longitude);
      map.update({
        locationName: shop.name,
        shopInfo: shop.info,
      });
    }
  };

  container.appendChild(select);
  container.appendChild(map.getElement());

  return container;
};

// Simple example with coordinates
export const SimpleCoordinates = () => {
  const container = document.createElement('div');

  const info = document.createElement('p');
  info.style.marginBottom = '10px';
  info.textContent =
    'Simple map with coordinates (no API key needed for preview):';
  container.appendChild(info);

  const map = Map({
    latitude: 48.1417262,
    longitude: 11.5609816,
    locationName: 'Munich Shop Location',
  });

  container.appendChild(map.getElement());
  return container;
};

// API key configuration example
export const ConfigurationExample = () => {
  const container = document.createElement('div');

  const info = document.createElement('div');
  info.style.cssText = `
    padding: 20px;
    background-color: #f0f0f0;
    border-radius: 8px;
    margin-bottom: 20px;
  `;
  info.innerHTML = `
    <h3>Map Configuration</h3>
    <p>To enable Google Places integration:</p>
    <ol>
      <li>Get a Google Maps API key from the <a href="https://console.cloud.google.com/" target="_blank">Google Cloud Console</a></li>
      <li>Enable both "Maps JavaScript API" and "Places API"</li>
      <li>Add your API key to <code>src/config/MapsConfig.js</code></li>
    </ol>
    <p>Without an API key, the map will show a mock view with the location information.</p>

    <h4>Current Configuration:</h4>
    <pre style="background: white; padding: 10px; border-radius: 4px;">
{
  apiKey: "${getApiKey() ? `${getApiKey().substring(0, 10)}...` : 'not set'}",
  valid: ${getApiKeyStatus().valid}
}</pre>

    <h4>Note on Place IDs:</h4>
    <p>⚠️ Old format Place IDs (with colons like "0x479e75fa2f009bf5:0xb82d27ba69195669") are no longer supported by Google.</p>
    <p>✅ Use coordinates or search for new Place IDs using the Places API.</p>
  `;

  const map = Map({
    latitude: 48.1417262,
    longitude: 11.5609816,
    locationName: 'mucHANDY Shop',
    shopInfo: {
      name: 'mucHANDY Handy Reparatur',
      address: 'Example Address, Munich',
      phone: '+49 123 456789',
      hours: 'Mon-Fri: 9AM-7PM',
      rating: 4.8,
    },
  });

  container.appendChild(info);
  container.appendChild(map.getElement());

  return container;
};
