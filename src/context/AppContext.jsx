import { createContext, useContext, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { BASE_URL } from "../data/baseUrl";
import { getToken } from "../utils/getToken";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { handleApiError } from "../utils/handleApiError";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [communities, setCommunities] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState(
    Cookies.get("selected-community")
      ? JSON.parse(Cookies.get("selected-community"))
      : null
  );

  const [productSearchValue, setProductSearchValue] = useState(null);

  const [showEmailVerificationPopup, setShowEmailVerificationPopup] =
    useState(false);

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
        selectedCommunity,
        productSearchValue,
        setProductSearchValue,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
