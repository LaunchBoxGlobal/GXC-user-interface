import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { handleApiError } from "../../utils/handleApiError";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Loader from "../Common/Loader";
import { MdPayments } from "react-icons/md";
import ProductTypeTabs from "../../pages/ProductManagement/ProductTypeTabs";
import { useTranslation } from "react-i18next";
import i18n from "i18next";

const ProductManagementHeader = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [checkStripe, setCheckStripe] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const { t } = useTranslation("productManagement");

  const handleCheckStripeAccountStatus = async () => {
    setCheckStripe(true);
    try {
      const res = await axios.get(`${BASE_URL}/seller/stripe/return`, {
        headers: {
          "Accept-Language": i18n.language,
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (res?.data?.data?.accountStatus === "active") {
        navigate("/product-management/add-product");
      } else {
        setShowConfirmationModal((prev) => !prev);
      }
    } catch (error) {
      if (error?.status === 404) {
        setShowConfirmationModal((prev) => !prev);
        return;
      }
    } finally {
      setCheckStripe(false);
    }
  };

  const handleCreateStripeAccount = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/seller/stripe/onboarding`,
        {},
        {
          headers: {
            "Accept-Language": i18n.language,
            Authorization: `Bearer ${getToken()}`,
          },
        },
      );

      if (res?.data?.success && res?.data?.data?.url) {
        window.open(res.data.data.url, "_blank", "noopener,noreferrer");
        setShowConfirmationModal(false);
      }
    } catch (error) {
      console.error("create stripe account error >>> ", error);
      handleApiError(error, navigate);
    } finally {
      setLoading(false);
      setShowConfirmationModal(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-between flex-wrap gap-5">
      <h1 className="text-[24px] lg:text-[32px] font-semibold leading-none text-white">
        {t(`product_management`)}
      </h1>
      <div className="w-full lg:w-1/2 flex items-center justify-end gap-3">
        <ProductTypeTabs />
        <button
          type="button"
          onClick={handleCheckStripeAccountStatus}
          className="w-full bg-white text-black h-[49px] rounded-[8px] text-center font-medium max-w-[204px] flex items-center justify-center"
        >
          {checkStripe ? <Loader /> : t(`buttons.add_new_product`)}
        </button>
      </div>

      <PermissionModal
        handleCreateStripeAccount={handleCreateStripeAccount}
        loading={loading}
        showConfirmationModal={showConfirmationModal}
        setShowConfirmationModal={setShowConfirmationModal}
      />
    </div>
  );
};

export default ProductManagementHeader;

export const PermissionModal = ({
  handleCreateStripeAccount,
  loading,
  showConfirmationModal,
  setShowConfirmationModal,
}) => {
  const { t } = useTranslation("productManagement");
  return (
    showConfirmationModal && (
      <div className="w-full h-screen fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)] flex items-center justify-center px-5">
        <div className="w-full max-w-[471px] bg-white rounded-[12px] p-6 relative text-center flex flex-col items-center justify-center gap-2">
          <div className="w-[102px] h-[102px] bg-[var(--button-bg)] rounded-full flex items-center justify-center">
            <MdPayments className="text-white text-5xl" />
          </div>
          <h2 className="text-[24px] font-semibold leading-none">
            {t("stripe_required")}
          </h2>
          <p className="text-base font-normal text-[#565656]">
            {t("stripe_required_subheading")}
          </p>
          <div className="w-full grid grid-cols-2 gap-3 mt-2">
            <button
              type="button"
              onClick={() => setShowConfirmationModal((prev) => !prev)}
              className="bg-[#ECECEC] h-[48px] rounded-[12px] text-center font-medium"
            >
              {t("buttons.no")}
            </button>
            <button
              type="button"
              onClick={() => handleCreateStripeAccount()}
              className="bg-[var(--button-bg)] h-[48px] rounded-[12px] text-center font-medium text-white"
            >
              {loading ? <Loader /> : t("buttons.continue")}
            </button>
          </div>
        </div>
      </div>
    )
  );
};
