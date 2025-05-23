// src/components/Map/Map.stories.js
import Map from './Map.js';

export default {
  title: 'Components/Map',
  component: Map,
};

export const Default = () => {
  const map = Map({
    locationName: 'New York City',
  });
  return map.getElement();
};

export const SpecificCoordinates = () => {
  const map = Map({
    latitude: 40.7128,
    longitude: -74.006,
    locationName: 'New York Financial District',
  });
  return map.getElement();
};

export const SanFrancisco = () => {
  const map = Map({
    latitude: 37.7749,
    longitude: -122.4194,
    locationName: 'San Francisco',
  });
  return map.getElement();
};

export const LosAngeles = () => {
  const map = Map({
    latitude: 34.0522,
    longitude: -118.2437,
    locationName: 'Los Angeles',
  });
  return map.getElement();
};

export const StoreLocation = () => {
  const map = Map({
    storeId: 'default',
    options: {
      zoom: 16,
    },
  });
  return map.getElement();
};

export const WithAPIKey = () => {
  // Note: This would need a real API key to work properly
  const map = Map({
    apiKey: 'dummy-key-for-storybook',
    latitude: 37.7749,
    longitude: -122.4194,
    locationName: 'San Francisco',
  });
  return map.getElement();
};

// Legacy example for backward compatibility
export const LegacyLocationProp = () => {
  const map = Map({
    latitude: 51.5074,
    longitude: -0.1278,
    location: 'London', // Using deprecated 'location' prop
  });
  return map.getElement();
};
