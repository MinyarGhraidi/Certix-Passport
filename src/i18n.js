import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import fr from "./locales/fr.json";
import en from "./locales/eng.json";

i18n.use(initReactI18next).init({
  lng: "fr",
  fallbackLng: "en",
  supportedLngs: ["fr", "en"],
  resources: {
    fr: { translation: fr },
    en: { translation: en },
  },
  interpolation: {
    escapeValue: false,
  },
  returnEmptyString: false,
});

export default i18n;
