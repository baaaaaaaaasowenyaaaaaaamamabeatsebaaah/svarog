// src/components/MuchandyHero/MuchandyHero.stories.js
import MuchandyHero from './MuchandyHero.js';
import PhoneRepairForm from '../PhoneRepairForm/PhoneRepairForm.js';
import UsedPhonePriceForm from '../UsedPhonePriceForm/UsedPhonePriceForm.js';
import { mockPhoneRepairApi } from '../../../__mocks__/phoneRepairData.js';
import { mockPhoneBuybackApi } from '../../../__mocks__/phoneBuybackData.js';

import muchandyHeroBg from '../../../.storybook/assets/muchandy-hero-bg.png';

export default {
  title: 'Components/MuchandyHero',
  component: MuchandyHero,
};

// Create a simple mock service for each form
const createMockRepairService = () => {
  return {
    fetchManufacturers: mockPhoneRepairApi.fetchManufacturers,
    fetchDevices: mockPhoneRepairApi.fetchDevices,
    fetchActions: mockPhoneRepairApi.fetchActions,
    fetchPrice: mockPhoneRepairApi.fetchPrice,
  };
};

const createMockBuybackService = () => {
  return {
    fetchManufacturers: mockPhoneBuybackApi.fetchManufacturers,
    fetchDevices: mockPhoneBuybackApi.fetchDevices,
    fetchConditions: mockPhoneBuybackApi.fetchConditions,
    fetchPrice: mockPhoneBuybackApi.fetchPrice,
  };
};

// Create forms directly without factories
const createForms = () => {
  // Create services
  const repairService = createMockRepairService();
  const buybackService = createMockBuybackService();

  // Create forms
  const repairForm = new PhoneRepairForm({
    apiOptions: { service: repairService },
    onPriceChange: (price) => console.log('Repair price:', price),
  });

  const buybackForm = new UsedPhonePriceForm({
    service: buybackService,
    onPriceChange: (price) => console.log('Used phone price:', price),
  });

  return { repairForm, buybackForm };
};

// Simple story with default options
export const Default = () => {
  const { repairForm, buybackForm } = createForms();

  const hero = new MuchandyHero({
    backgroundImage: muchandyHeroBg,
    title: 'Finden Sie Ihren Preis:',
    subtitle: 'Jetzt Preis berechnen.',
    repairForm,
    buybackForm,
  });

  return hero.getElement();
};

// Story with sell tab active by default
export const WithSellTabDefault = () => {
  const { repairForm, buybackForm } = createForms();

  const hero = new MuchandyHero({
    backgroundImage: muchandyHeroBg,
    defaultTab: 'sell',
    title: 'Verkaufen Sie Ihr Gerät:',
    subtitle: 'Schnell und einfach zum besten Preis.',
    repairForm,
    buybackForm,
  });

  return hero.getElement();
};

// Story with custom background
export const WithCustomBackground = () => {
  const { repairForm, buybackForm } = createForms();

  const hero = new MuchandyHero({
    backgroundImage: muchandyHeroBg,
    title: 'Ihr Smartphone-Service',
    subtitle: 'Reparatur oder Verkauf - Sie entscheiden!',
    repairForm,
    buybackForm,
  });

  return hero.getElement();
};
