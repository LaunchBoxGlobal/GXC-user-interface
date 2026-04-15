import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// English
import enCommon from "./locales/en/enCommon.json";
import enAuth from "./locales/en/enAuth.json";
import enNavbar from "./locales/en/enNavbar.json";
import enHome from "./locales/en/enHome.json";
import enProductManagement from "./locales/en/enProductManagement.json";
import enOrderManagement from "./locales/en/enOrderManagement.json";
import enTransactionHistory from "./locales/en/enTransactionHistory.json";
import enReports from "./locales/en/enReports.json";
import enCart from "./locales/en/enCart.json";
import enSettings from "./locales/en/enSettings.json";
import enEditProfile from "./locales/en/enEditProfile.json";
import enMember from "./locales/en/enMember.json";
import enCommunity from "./locales/en/enCommunity.json";

// Spanish
import esCommon from "./locales/es/esCommon.json";
import esAuth from "./locales/es/esAuth.json";
import esNavbar from "./locales/es/esNavbar.json";
import esHome from "./locales/es/esHome.json";
import esProductManagement from "./locales/es/esProductManagement.json";
import esOrderManagement from "./locales/es/esOrderManagement.json";
import esTransactionHistory from "./locales/es/esTransactionHistory.json";
import esReports from "./locales/es/esReports.json";
import esCart from "./locales/es/esCart.json";
import esSettings from "./locales/es/esSettings.json";
import esEditProfile from "./locales/es/esEditProfile.json";
import esMember from "./locales/es/esMember.json";
import esCommunity from "./locales/es/esCommunity.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        auth: enAuth,
        common: enCommon,
        navbar: enNavbar,
        home: enHome,
        productManagement: enProductManagement,
        orderManagement: enOrderManagement,
        transactionHistory: enTransactionHistory,
        reports: enReports,
        cart: enCart,
        settings: enSettings,
        editProfile: enEditProfile,
        member: enMember,
        community: enCommunity,
      },
      es: {
        auth: esAuth,
        common: esCommon,
        navbar: esNavbar,
        home: esHome,
        productManagement: esProductManagement,
        orderManagement: esOrderManagement,
        transactionHistory: esTransactionHistory,
        reports: esReports,
        cart: esCart,
        settings: esSettings,
        editProfile: esEditProfile,
        member: esMember,
        community: esCommunity,
      },
    },
    fallbackLng: "en",
    ns: [
      "common",
      "home",
      "productManagement",
      "auth",
      "button",
      "navbar",
      "orderManagement",
      "transactionHistory",
      "reports",
      "cart",
      "settings",
      "editProfile",
      "member",
      "community",
    ],
    supportedLngs: ["en", "es"],
    defaultNS: "common",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
