import i18next from "i18next";

import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";

// "Inline" English and Arabic translations.

// We can localize to any language and any number of languages.
const url = process.env.REACT_APP_VELANKANI_API_URL;

i18next

  .use(initReactI18next)

  .use(HttpApi) // Registering the back-end plugin

  .init({
    defaultNS: "translation",
    lng: "en",

    supportedLngs: ["en", "ko"],

    fallbackLng: "en",

    debug: true,

    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: (lng, ns) => {
        return `${url}api/v1/content/${lng}/${ns}`;
      },
      crossDomain: true,
    },
  });

export default i18next;
