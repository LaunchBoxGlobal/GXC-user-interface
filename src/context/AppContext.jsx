import { createContext, useContext, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { BASE_URL } from "../data/baseUrl";
import { getToken } from "../utils/getToken";
import { useNavigate } from "react-router-dom";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [communities, setCommunities] = useState([]);
  const [productType, setProductType] = useState("active");

  const [productSearchValue, setProductSearchValue] = useState(null);
  const [productMinValue, setProductMinValue] = useState(null);
  const [productMaxValue, setProductMaxValue] = useState(null);

  const [showEmailVerificationPopup, setShowEmailVerificationPopup] =
    useState(false);

  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

  const handleShowPaymentModal = () => {
    setShowPaymentModal((prev) => !prev);
  };

  const handleShowSuccessModal = () => {
    setShowPaymentModal(false);
    setShowSuccessModal(true);
  };

  const handleCloseSuccessModal = () => {
    setShowPaymentModal(false);
    setShowSuccessModal(false);
  };

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      setUser(res?.data?.data?.user);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;

        switch (status) {
          case 401:
            console.error("Unauthorized: Token expired or invalid.");
            localStorage.removeItem("token");
            Cookies.remove("userToken");
            Cookies.remove("user");
            navigate("/login");
            break;

          case 403:
            console.error("Forbidden: You do not have access.");
            break;

          case 404:
            console.error("Profile not found.");
            break;

          case 500:
            console.error("Server error. Please try again later.");
            break;

          default:
            console.error(
              `Unexpected error: ${status} - ${
                error.response?.data?.message || error.message
              }`
            );
        }
      } else {
        console.error("Network or unexpected error:", error);
      }
    }
  };

  const fetchNotificaiontCount = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/user/unread-notification-count`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      // console.log("notification count >>> ", res?.data);
      setUnreadNotificationCount(res?.data?.data?.unreadCount);
    } catch (error) {
      // console.log("err while fetching notification count >>> ", error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        showPaymentModal,
        handleShowPaymentModal,
        handleShowSuccessModal,
        handleCloseSuccessModal,
        showSuccessModal,
        user,
        setUser,
        fetchUserProfile,
        showEmailVerificationPopup,
        setShowEmailVerificationPopup,
        communities,
        setCommunities,
        // selectedCommunity,
        // setSelectedCommunity,
        productSearchValue,
        setProductSearchValue,
        productMinValue,
        setProductMinValue,
        productMaxValue,
        setProductMaxValue,
        productType,
        setProductType,
        fetchNotificaiontCount,
        unreadNotificationCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
