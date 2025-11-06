import axios from "axios";
import { useState } from "react";
import { BASE_URL } from "../../data/baseUrl";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getToken } from "../../utils/getToken";
import { handleApiError } from "../../utils/handleApiError";
import Loader from "../../components/Common/Loader";

const SellerConfirmationMarkItemReadForPickup = ({
  showMarkItemReasyForPickupConfirmationModal,
  setShowMarkItemReasyForPickupConfirmationModal,
  fetchOrderDetails,
}) => {
  const [isMarked, setIsMarked] = useState(false);
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const itemId = searchParams.get("itemId");

  const handleMarkReadyForPickup = async () => {
    try {
      setLoading(true);
      const response = await axios.put(
        `${BASE_URL}/order-items/${itemId}/seller-status`,
        { status: "ready_for_pickup" },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      if (response?.data?.success) {
        setIsMarked(true);
        fetchOrderDetails();
      }
    } catch (error) {
      console.error("err while marking pickup item ready >>>> ", error);
      handleApiError(error, navigate);
    } finally {
      setLoading(false);
    }
  };
  return (
    showMarkItemReasyForPickupConfirmationModal && (
      <div className="w-full h-screen fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)] flex items-center justify-center padding-x">
        <div className="w-full bg-white max-w-[471px] rounded-[32px] p-7 text-center space-y-3">
          <div className="w-[122px] h-[122px] flex items-center justify-center bg-[var(--button-bg)] rounded-full mx-auto">
            <img
              src="/marke-item-ready-for-pickup-modal-icon.png"
              alt="marke-item-ready-for-pickup-modal-icon"
              className="w-[66px] h-[55px]"
            />
          </div>
          <h4 className="text-[24px] font-semibold leading-none text-center">
            {isMarked ? "marked as ready for pickup" : "Mark ready for pickup"}
          </h4>
          <p className="text-[#565656] text-sm leading-[1.2]">
            {isMarked
              ? "You've successfully marked this item as ready for pickup."
              : "Are your sure you want to mark this item as ready for pickup?"}
          </p>

          <div className="w-full pt-2">
            {isMarked ? (
              <button
                type="button"
                onClick={() => {
                  setShowMarkItemReasyForPickupConfirmationModal(false);
                  setIsMarked(false);
                }}
                className="button"
              >
                OK
              </button>
            ) : (
              <div className="w-full grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setShowMarkItemReasyForPickupConfirmationModal(false)
                  }
                  className="bg-[#EBEBEB] font-medium w-full h-[48px] rounded-[12px] text-center text-black"
                >
                  No
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleMarkReadyForPickup();
                  }}
                  disabled={loading}
                  className="bg-[var(--button-bg)] font-medium w-full h-[48px] rounded-[12px] text-center text-white"
                >
                  {loading ? <Loader /> : "Yes"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default SellerConfirmationMarkItemReadForPickup;
