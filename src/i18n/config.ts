import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en/translation.json";
import es from "./es/translation.json";

export const resources = {
  en: {
    translation: en,
  },
  es: {
    translation: es,
  },
};
//los idiomas incluidos son inglés, español, francés, portugués, alemán, griego e italiano

i18next.use(initReactI18next).init({
  lng: "en", // if you're using a language detector, do not define the lng option
  debug: true,
  resources,
  fallbackLng: "en", // Use English as fallback language
});