import i18n from "i18next";

const LanguageSwitcher = ({ isScrolled }) => {
  return (
    <div className="flex items-center">
      <button
        onClick={() => i18n.changeLanguage("en")}
        className={`text-base ${isScrolled ? "text-black" : "text-white"}`}
      >
        En
      </button>
      <span className={`text-base ${isScrolled ? "text-black" : "text-white"}`}>
        /
      </span>
      <button
        onClick={() => i18n.changeLanguage("es")}
        className={`text-base ${isScrolled ? "text-black" : "text-white"}`}
      >
        Es
      </button>
    </div>
  );
};

export default LanguageSwitcher;
