// src/components/MuchandyHero/MuchandyHero.stories.js
import MuchandyHero from './MuchandyHero.js';
import { switchTheme } from '../../utils/theme.js';
import PhoneRepairFormFactory from '../../factories/PhoneRepairFormFactory.js';
import UsedPhonePriceFormFactory from '../../factories/UsedPhonePriceFormFactory.js';
import { mockPhoneRepairData } from '../../../__mocks__/phoneRepairData.js';
import { mockPhoneBuybackData } from '../../../__mocks__/phoneBuybackData.js';

export default {
  title: 'Components/MuchandyHero',
  component: MuchandyHero,
};

// Helper function to create forms with mock data
const createMockForms = (repairConfig = {}, buybackConfig = {}) => {
  // Create repair form with mock data
  const repairForm = PhoneRepairFormFactory.createWithMockData({
    mockData: mockPhoneRepairData,
    ...repairConfig,
  });

  // Create buyback form with mock data
  const buybackForm = UsedPhonePriceFormFactory.createWithMockData({
    mockData: mockPhoneBuybackData,
    ...buybackConfig,
  });

  return { repairForm, buybackForm };
};

export const Default = () => {
  const backgroundImage =
    'https://via.placeholder.com/1920x1080/1a1a1a/ffffff?text=Background+Image';

  // Create forms with mock data
  const { repairForm, buybackForm } = createMockForms(
    {
      onPriceChange: (price) => console.log('Repair price:', price),
    },
    {
      onPriceChange: (price) => console.log('Used phone price:', price),
    }
  );

  const hero = new MuchandyHero({
    backgroundImage,
    title: 'Reparatur in wenigen Klicks:',
    subtitle: 'Finden Sie Ihren Preis.',
    repairForm,
    buybackForm,
  });

  return hero.getElement();
};

export const WithSellTabDefault = () => {
  const backgroundImage = 'https://picsum.photos/1920/1080';

  const { repairForm, buybackForm } = createMockForms(
    {
      onPriceChange: (price) => console.log('Repair price:', price),
    },
    {
      onPriceChange: (price) => console.log('Used phone price:', price),
    }
  );

  const hero = new MuchandyHero({
    backgroundImage,
    defaultTab: 'sell',
    title: 'Verkaufen Sie Ihr Gerät:',
    subtitle: 'Schnell und einfach zum besten Preis.',
    repairForm,
    buybackForm,
  });

  return hero.getElement();
};

export const WithoutBackgroundImage = () => {
  const { repairForm, buybackForm } = createMockForms(
    {
      onPriceChange: (price) => console.log('Repair price:', price),
    },
    {
      onPriceChange: (price) => console.log('Used phone price:', price),
    }
  );

  const hero = new MuchandyHero({
    title: 'Reparatur in wenigen Klicks:',
    subtitle: 'Finden Sie Ihren Preis.',
    repairForm,
    buybackForm,
  });

  return hero.getElement();
};

export const WithCustomText = () => {
  const backgroundImage = 'https://picsum.photos/1920/1080';

  const { repairForm, buybackForm } = createMockForms(
    {
      onPriceChange: (price) => console.log('Repair price:', price),
    },
    {
      onPriceChange: (price) => console.log('Used phone price:', price),
    }
  );

  const hero = new MuchandyHero({
    backgroundImage,
    title: 'Ihr Smartphone-Service',
    subtitle: 'Reparatur oder Verkauf - Sie entscheiden!',
    repairForm,
    buybackForm,
  });

  return hero.getElement();
};

export const WithMuchandyTheme = () => {
  // Set the Muchandy theme
  switchTheme('muchandy');

  const backgroundImage = 'https://picsum.photos/1920/1080';

  const { repairForm, buybackForm } = createMockForms(
    {
      onPriceChange: (price) => console.log('Repair price:', price),
    },
    {
      onPriceChange: (price) => console.log('Used phone price:', price),
    }
  );

  const hero = new MuchandyHero({
    backgroundImage,
    title: 'Reparatur in wenigen Klicks:',
    subtitle: 'Finden Sie Ihren Preis.',
    repairForm,
    buybackForm,
  });

  return hero.getElement();
};

export const WithCallbacks = () => {
  const backgroundImage = 'https://picsum.photos/1920/1080';

  const container = document.createElement('div');

  // Create output area for callbacks
  const output = document.createElement('div');
  output.style.padding = '20px';
  output.style.marginTop = '20px';
  output.style.backgroundColor = '#f5f5f5';
  output.style.borderRadius = '8px';
  output.innerHTML =
    '<h3>Callback Output:</h3><p>Interact with the forms to see callbacks</p>';

  const { repairForm, buybackForm } = createMockForms(
    {
      onPriceChange: (price) => {
        const message = document.createElement('p');
        message.textContent = `Repair price selected: €${price.price}`;
        output.appendChild(message);
      },
    },
    {
      onPriceChange: (price) => {
        const message = document.createElement('p');
        message.textContent = `Used phone price selected: €${price.price}`;
        output.appendChild(message);
      },
      onSubmit: (formData) => {
        const message = document.createElement('p');
        message.style.fontWeight = 'bold';
        message.textContent = `Form submitted with data: ${JSON.stringify(formData)}`;
        output.appendChild(message);
      },
    }
  );

  const hero = new MuchandyHero({
    backgroundImage,
    title: 'Reparatur in wenigen Klicks:',
    subtitle: 'Finden Sie Ihren Preis.',
    repairForm,
    buybackForm,
  });

  container.appendChild(hero.getElement());
  container.appendChild(output);

  return container;
};

export const MinimalConfiguration = () => {
  const { repairForm, buybackForm } = createMockForms();

  const hero = new MuchandyHero({
    repairForm,
    buybackForm,
  });

  return hero.getElement();
};
