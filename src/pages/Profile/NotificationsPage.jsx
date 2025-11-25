import { useAppContext } from "../../context/AppContext";
import { BASE_URL } from "../../data/baseUrl";
import axios from "axios";
import { getToken } from "../../utils/getToken";
import { enqueueSnackbar } from "notistack";
import { handleApiError } from "../../utils/handleApiError";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const NotificationsPage = () => {
  const { user, fetchUserProfile } = useAppContext();
  const navigate = useNavigate();

  const [updatingField, setUpdatingField] = useState(null);

  const url = `${BASE_URL}/auth/profile`;

  const handleToggle = async (field) => {
    if (!user) return;

    const currentValue = !!user[field]; // ensure boolean
    const nextValue = !currentValue;

    try {
      setUpdatingField(field);

      await axios.put(
        url,
        { [field]: nextValue },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      // Re-fetch latest user profile so state stays in sync
      await fetchUserProfile();

      enqueueSnackbar("Preferences updated successfully!", {
        variant: "success",
      });
    } catch (error) {
      enqueueSnackbar(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong. Try again.",
        { variant: "error" }
      );
      handleApiError(error, navigate);
    } finally {
      setUpdatingField(null);
    }
  };

  const prodAlert = !!user?.prodAlert;
  const orderAlert = !!user?.orderNotify;

  return (
    <div className="w-full relative pt-2">
      <h2 className="text-[24px] font-semibold leading-none">Notifications</h2>
      <div className="w-full border my-5" />

      <div className="w-full space-y-4">
        {/* Product Alerts */}
        <div className="w-full bg-[#F5F5F5] rounded-[12px] p-5 flex items-center justify-between">
          <div className="w-full max-w-[80%]">
            <h3 className="font-semibold text-lg">New Product Alerts</h3>
            <p>
              Receive instant alerts for newly listed products matching your
              interests.
            </p>
          </div>

          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={prodAlert}
              disabled={updatingField === "prodAlert"}
              onChange={() => handleToggle("prodAlert")}
              className="sr-only peer"
            />

            <div
              className="relative w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full 
                peer peer-checked:bg-[var(--button-bg)]
                after:content-[''] after:absolute after:top-[2px] after:start-[2px] 
                after:bg-white after:border-gray-300 after:border after:rounded-full 
                after:h-5 after:w-5 after:transition-all
                peer-checked:after:translate-x-full"
            />
          </label>
        </div>

        {/* Order Alerts */}
        <div className="w-full bg-[#F5F5F5] rounded-[12px] p-5 flex items-center justify-between">
          <div className="w-full max-w-[80%]">
            <h3 className="font-semibold text-lg">Order Updates</h3>
            <p>
              Stay informed about order confirmations, shipments, and
              deliveries.
            </p>
          </div>

          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={orderAlert}
              disabled={updatingField === "orderAlert"}
              onChange={() => handleToggle("orderAlert")}
              className="sr-only peer"
            />

            <div
              className="relative w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full 
                peer peer-checked:bg-[var(--button-bg)]
                after:content-[''] after:absolute after:top-[2px] after:start-[2px] 
                after:bg-white after:border-gray-300 after:border after:rounded-full 
                after:h-5 after:w-5 after:transition-all
                peer-checked:after:translate-x-full"
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
