import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { BASE_URL } from "../data/baseUrl";
import { enqueueSnackbar } from "notistack";
import { getToken } from "../utils/getToken";
import { handleApiError } from "../utils/handleApiError";
import { useNavigate } from "react-router-dom";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const [selectedCommunity, setSelectedCommunity] = useState(
    Cookies.get("selected-community")
      ? JSON.parse(Cookies.get("selected-community"))
      : null
  );

  const fetchCartCount = async () => {
    const community = Cookies.get("selected-community")
      ? JSON.parse(Cookies.get("selected-community"))
      : null;
    setSelectedCommunity(community);
    if (!community) {
      return;
    }
    try {
      const res = await axios.get(
        `${BASE_URL}/communities/${community?.id}/cart/count`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      setCartCount(res?.data?.data?.count);
    } catch (error) {
      // handleApiError(error, navigate);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, []);

  return (
    <CartContext.Provider
      value={{ cartCount, setCartCount, fetchCartCount, selectedCommunity }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
