import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getToken } from "../../utils/getToken";
import { handleApiError } from "../../utils/handleApiError";

const MarkItemOutForDeliveryModal = ({
  showMarkItemOutForDelivery,
  setShowMarkItemOutForDelivery,
  setShowSuccessModal,
  fetchOrderDetails,
}) => {
  const [searchParams] = useSearchParams();
  const itemId = searchParams.get("itemId");
  const navigate = useNavigate();

  const markOutForDelivery = async () => {
    try {
      const response = await axios.put(
        `${BASE_URL}/order-items/${itemId}/seller-status`,
        {
          status: "out_for_delivery",
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (response?.data?.success) {
        fetchOrderDetails();
        setShowSuccessModal(true);
        setShowMarkItemOutForDelivery(false);
      }
    } catch (error) {
      handleApiError(error, navigate);
    }
  };
  return (
    showMarkItemOutForDelivery && (
      <div className="w-full h-screen fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)] flex items-center justify-center padding-x">
        <div className="w-full bg-white max-w-[471px] rounded-[32px] p-7 text-center space-y-3">
          <div className="w-[122px] h-[122px] flex items-center justify-center bg-[var(--button-bg)] rounded-full mx-auto">
            <img
              src="/out-for-delivery-popup-icon.png"
              alt="out-for-delivery-popup-icon"
              className="w-[63px] h-[43px]"
            />
          </div>
          <h4 className="text-[24px] font-semibold leading-none text-center">
            Mark out for delivery
          </h4>
          <p className="text-[#565656] text-sm leading-[1.2]">
            Are your sure you want to mark this item as out for delivery?
          </p>

          <div className="w-full grid grid-cols-2 gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowMarkItemOutForDelivery(false)}
              className="bg-[#EBEBEB] font-medium w-full h-[48px] rounded-[12px] text-center text-black"
            >
              No
            </button>
            <button
              type="button"
              onClick={() => markOutForDelivery()}
              className="bg-[var(--button-bg)] font-medium w-full h-[48px] rounded-[12px] text-center text-white"
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default MarkItemOutForDeliveryModal;
