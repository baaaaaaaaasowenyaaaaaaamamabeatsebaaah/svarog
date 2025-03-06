import Map from './Map.js';

export default {
  title: 'Components/Map',
  component: Map,
};

export const Default = () => {
  return new Map({
    location: 'New York City',
  });
};

export const SpecificCoordinates = () => {
  return new Map({
    latitude: 40.7128,
    longitude: -74.006,
    location: 'New York Financial District',
  });
};

export const SanFrancisco = () => {
  return new Map({
    latitude: 37.7749,
    longitude: -122.4194,
    location: 'San Francisco',
  });
};

export const LosAngeles = () => {
  return new Map({
    latitude: 34.0522,
    longitude: -118.2437,
    location: 'Los Angeles',
  });
};

export const StoreLocation = () => {
  return new Map({
    storeId: 'default',
    options: {
      zoom: 16,
    },
  });
};
