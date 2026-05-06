import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import yaml from 'js-yaml';

import deRaw from './locales/de.yaml?raw';
import enRaw from './locales/en.yaml?raw';

const resources = {
  de: { translation: yaml.load(deRaw) },
  en: { translation: yaml.load(enRaw) },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'de',
  fallbackLng: 'de',
  interpolation: { escapeValue: false },
});

export default i18n;
