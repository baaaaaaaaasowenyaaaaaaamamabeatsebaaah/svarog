// src/config/PhoneRepairFormConfig.js

/**
 * Default text labels for PhoneRepairForm component
 */
export const defaultLabels = {
  title: 'Reparatur anfragen',
  manufacturerStep: 'Hersteller',
  deviceStep: 'Modell',
  serviceStep: 'Service',
  manufacturerLabel: 'Hersteller:',
  deviceLabel: 'Modell:',
  serviceLabel: 'Service:',
  priceLabel: 'Preis:',
  manufacturerPlaceholder: 'Hersteller auswählen',
  devicePlaceholder: 'Zuerst Hersteller auswählen',
  servicePlaceholder: 'Zuerst Modell auswählen',
  initialPriceText: 'Bitte zuerst Hersteller, Modell und Service auswählen',
  loadingPriceText: 'Preis wird geladen...',
  priceNotAvailable: 'Preis nicht verfügbar',
  deviceLoadError: 'Fehler beim Laden der Geräte',
  actionLoadError: 'Fehler beim Laden der Services',
  priceLoadError: 'Fehler beim Laden des Preises',
};

/**
 * Default API configuration for PhoneRepairForm component
 */
export const defaultApiConfig = {
  baseUrl: '/api',
};
