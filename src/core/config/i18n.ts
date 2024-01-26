import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-xhr-backend";
import { initReactI18next } from "react-i18next";
import en from "../../locales/en.json";
import ja from "../../locales/jp.json";

const resources = {
  en: {
    translation: en,
  },
  ja: {
    translation: ja,
  },
  // Add other languages if you have more i18n resource files
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    // backend: {
    //   loadPath: `${process.env.PUBLIC_URL}/locales/{{lng}}/translation.json`,
    // },
    resources,
    // lng: 'en',
    lng: "ja",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    supportedLngs: ["en", "ja"],
  });

export default i18n;
