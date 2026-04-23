import i18next from "i18next";
import { CardElement } from "@stripe/react-stripe-js";
import { useTranslation } from "react-i18next";

const AddCardForm = ({ saveCard, setSaveCard }) => {
  const { t } = useTranslation("cart");

  return (
    <>
      <CardElement className="py-3.5 text-sm bg-[#F5F5F5] rounded-[12px] px-3" />
      <div className="w-full flex items-center gap-1 mt-1.5">
        <label class="inline-flex items-center space-x-1 cursor-pointer">
          <input
            type="checkbox"
            name="saveCard"
            id="saveCard"
            checked={saveCard}
            onChange={(e) => setSaveCard(e.target.checked)}
            class="w-3 h-3 text-green-500 bg-gray-100 border-gray-300 rounded"
          />
          <span class="text-gray-700 text-xs font-medium">
            {t(`Save Card for Future Transactions`)}
          </span>
        </label>
      </div>
    </>
  );
};

export default AddCardForm;
