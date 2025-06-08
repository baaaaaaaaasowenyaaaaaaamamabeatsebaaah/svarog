// src/config/maps.config.js
// Production config - verwendet Environment Variables
// Safe für Git Repository

export const mapsConfig = {
  apiKey: process.env.GOOGLE_MAPS_API_KEY || '',
  isDevelopment: process.env.NODE_ENV !== 'production',
};
