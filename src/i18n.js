import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import fr from "./locales/fr.json";
import en from "./locales/eng.json";

const LANG_STORAGE_KEY = "certix_lang";

function getInitialLanguage() {
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (saved === "fr" || saved === "en") return saved;
  } catch {
    // ignore storage errors
  }
  return "fr";
}

i18n.use(initReactI18next).init({
  lng: getInitialLanguage(),
  fallbackLng: "fr",
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

i18n.on("languageChanged", (lng) => {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lng);
    if (typeof document !== "undefined") {
      document.documentElement.lang = lng;
    }
  } catch {
    // ignore
  }
});

export default i18n;
