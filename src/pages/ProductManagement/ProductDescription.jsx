import { useTranslation } from "react-i18next";

const ProductDescription = ({ description }) => {
  const { t } = useTranslation("productManagement");
  return (
    <>
      <div className="w-full border my-5" />
      <div className="w-full space-y-3 overflow-hidden">
        <p className="text-sm font-semibold">{t(`description`)}</p>
        {description && (
          <p className="text-sm font-normal leading-[1.3] break-words">
            {description}
          </p>
        )}
      </div>
    </>
  );
};

export default ProductDescription;
