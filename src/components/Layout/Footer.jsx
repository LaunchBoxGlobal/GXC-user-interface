import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation("common");
  return (
    <footer className="w-full py-10 text-center bg-[#fff] padding-x">
      <div className="w-full border mb-10"></div>
      <p className="text-[#787878] text-sm font-medium">
        {t(`Copyright`)} © 2025 giveXchange
      </p>
    </footer>
  );
};

export default Footer;
