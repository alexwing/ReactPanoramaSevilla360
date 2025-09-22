import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en/translation.json";
import es from "./es/translation.json";
import { getLang } from "../lib/Utils";

export const resources = {
  en: {
    translation: en,
  },
  es: {
    translation: es,
  },
};
//los idiomas incluidos son inglés, español

i18next.use(initReactI18next).init({
  lng: getLang(), // use the saved or detected language
  debug: true,
  resources,
  fallbackLng: "en", // Use English as fallback language
});
