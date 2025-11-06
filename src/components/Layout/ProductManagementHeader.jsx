import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { handleApiError } from "../../utils/handleApiError";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import Loader from "../Common/Loader";
import { MdPayments } from "react-icons/md";

const ProductManagementHeader = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [checkStripe, setCheckStripe] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const handleCheckStripeAccountStatus = async () => {
    setCheckStripe(true);
    try {
      const res = await axios.get(`${BASE_URL}/seller/stripe/return`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      // console.log("stripe status >>> ", res?.data);
      // return;
      if (res?.data?.success) {
        navigate("/product-management/add-product");
      } else {
        setShowConfirmationModal((prev) => !prev);
      }
    } catch (error) {
      if (error?.status === 404) {
        setShowConfirmationModal((prev) => !prev);
        return;
      }
      console.log("handleCheckStripeAccountStatus error >>> ", error);
      handleApiError(error, navigate);
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
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      // console.log("onboarding res >>> ", res?.data);
      if (res?.data?.success && res?.data?.data?.url) {
        window.open(res.data.data.url, "_blank", "noopener,noreferrer");
        setShowConfirmationModal(false);
      }
      // handleCheckStripeAccountStatus();

      //   console.log("create stripe account >>> ", res?.data);
    } catch (error) {
      console.error("create stripe account error >>> ", error);
      handleApiError(error, navigate);
    } finally {
      setLoading(false);
      setShowConfirmationModal(false);
    }
  };

  const handleCheckStripeStatus = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/seller/stripe/status`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const data = res?.data?.data;
      console.log("seller stripe status >>> ", res?.data?.data);
      if (!data?.hasStripeAccount) {
        handleCreateStripeAccount();
        return;
      } else {
        navigate("/product-management/add-product");
      }
    } catch (error) {
      handleApiError(error, navigate);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-between flex-wrap gap-5">
      <h1 className="text-[24px] lg:text-[32px] font-semibold leading-none text-white">
        Product Management
      </h1>
      <button
        type="button"
        onClick={handleCheckStripeAccountStatus}
        className="button max-w-[214px] h-[58px] flex items-center justify-center"
      >
        {checkStripe ? <Loader /> : "Add New Product"}
      </button>

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
  return (
    showConfirmationModal && (
      <div className="w-full h-screen fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)] flex items-center justify-center px-5">
        <div className="w-full max-w-[471px] bg-white rounded-[12px] p-6 relative text-center flex flex-col items-center justify-center gap-2">
          <div className="w-[102px] h-[102px] bg-[var(--button-bg)] rounded-full flex items-center justify-center">
            <MdPayments className="text-white text-5xl" />
          </div>
          <h2 className="text-[24px] font-semibold leading-none">
            Stripe Account Required
          </h2>
          <p className="text-base font-normal text-[#565656]">
            You need to create a stripe account to continue.
          </p>
          <div className="w-full grid grid-cols-2 gap-3 mt-2">
            <button
              type="button"
              onClick={() => setShowConfirmationModal((prev) => !prev)}
              className="bg-[#ECECEC] h-[48px] rounded-[12px] text-center font-medium"
            >
              No
            </button>
            <button
              type="button"
              onClick={() => handleCreateStripeAccount()}
              className="bg-[var(--button-bg)] h-[48px] rounded-[12px] text-center font-medium text-white"
            >
              {loading ? <Loader /> : "Continue"}
            </button>
          </div>
        </div>
      </div>
    )
  );
};
