import i18n from "i18next";
import { useState, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";

const LanguageSwitcher = ({ className, isScrolled }) => {
  const [language, setLanguage] = useState(i18n.language || "en");

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  return (
    <div className="relative inline-block">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className={className}
      >
        <option value="en" className="text-black">
          English
        </option>
        <option value="es" className="text-black">
          Spanish
        </option>
      </select>

      <IoIosArrowDown
        className={`pointer-events-none absolute top-1/2 -translate-y-1/2 right-2 ${isScrolled ? "text-gray-400" : "text-gray-100"} `}
      />
    </div>
  );
};

export default LanguageSwitcher;
