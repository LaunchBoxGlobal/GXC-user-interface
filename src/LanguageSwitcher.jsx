import i18n from "i18next";
import { useState, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import axios from "axios";
import { BASE_URL } from "./data/baseUrl";
import { getToken } from "./utils/getToken";
import { handleApiError } from "./utils/handleApiError";
import { useNavigate } from "react-router-dom";

const LanguageSwitcher = ({ className, isScrolled }) => {
  const [language, setLanguage] = useState(i18n.language || "en");
  const navigate = useNavigate();

  useEffect(() => {
    i18n.changeLanguage(language);

    const updateLanguage = async () => {
      const token = getToken();
      if (!token) return;

      try {
        await axios.patch(
          `${BASE_URL}/user/update-preferred-language`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Accept-Language": language,
            },
          },
        );
      } catch (error) {
        handleApiError(error, navigate);
      }
    };

    updateLanguage();
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
