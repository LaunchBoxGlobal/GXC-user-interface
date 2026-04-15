import i18n from "i18next";
import { useState, useEffect } from "react";

const LanguageSwitcher = () => {
  const [language, setLanguage] = useState(i18n.language || "en");

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  return (
    <div className="relative inline-block">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="
          appearance-none
          bg-white
          border border-gray-300
          text-gray-700
          py-1 lg:py-1.5 pl-1.5 lg:pl-2 pr-7 lg:pr-8
          rounded-lg
          shadow-sm
          focus:outline-none
          focus:ring-2 focus:ring-blue-950
          focus:border-blue-950
          text-sm
          cursor-pointer
        "
      >
        <option value="en">English</option>
        <option value="es">Spanish</option>
      </select>

      {/* Custom dropdown arrow */}
      <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-500">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
