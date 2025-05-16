// src/config/UsedPhonePriceFormConfig.js

/**
 * Default text labels for UsedPhonePriceForm component
 */
export const defaultLabels = {
  title: 'Telefon verkaufen',
  manufacturerStep: 'Hersteller',
  deviceStep: 'Modell',
  conditionStep: 'Zustand',
  manufacturerLabel: 'Hersteller:',
  deviceLabel: 'Modell:',
  priceLabel: 'Ihr unverbindlicher Auszahlungspreis:',
  manufacturerPlaceholder: 'Hersteller auswählen',
  devicePlaceholder: 'Zuerst Hersteller auswählen',
  conditionPlaceholder: 'Zuerst Modell auswählen',
  initialPriceText: 'Bitte wählen Sie Hersteller, Modell und Zustand',
  loadingPriceText: 'Preis wird geladen...',
  priceNotAvailable: 'Preis nicht verfügbar',
  deviceLoadError: 'Fehler beim Laden der Geräte',
  conditionLoadError: 'Fehler beim Laden der Zustandsoptionen',
  priceLoadError: 'Fehler beim Laden des Preises',
  submitButtonText: 'Jetzt Termin vereinbaren',
  submitButtonLoadingText: 'Laden...',
  conditionLabel: 'Zustand deines Geräts', // The label above condition options
  conditionNewLabel: 'Neu', // Text for "New" condition
  conditionGoodLabel: 'Gut', // Text for "Good" condition
  conditionFairLabel: 'Akzeptabel', // Text for "Fair" condition
  conditionPoorLabel: 'Beschädigt', // Text for "Poor" condition
  conditionDescriptionNew: 'Originalverpackt, unbenutzt', // Description for new condition
};

/**
 * Default API configuration for UsedPhonePriceForm component
 */
export const defaultApiConfig = {
  baseUrl: '/api',
};

/**
 * Condition rating descriptions
 */
export const conditionDescriptions = {
  likeNew: 'Keine Kratzer, 100% funktionsfähig, alle Zubehörteile enthalten',
  good: 'Kleine Kratzer, 100% funktionsfähig',
  fair: 'Sichtbare Kratzer und Gebrauchsspuren, voll funktionsfähig',
  poor: 'Starke Kratzer und Beschädigungen, noch funktionsfähig',
};
