import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { BASE_URL } from "../data/baseUrl";
import { enqueueSnackbar } from "notistack";
import { getToken } from "../utils/getToken";
import { handleApiError } from "../utils/handleApiError";
import { useNavigate } from "react-router-dom";
import { useUser } from "./userContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const [selectedCommunity, setSelectedCommunity] = useState(
    Cookies.get("selected-community")
      ? JSON.parse(Cookies.get("selected-community"))
      : null
  );
  // const { setSelectedCommunity } = useUser();
  const [cartProducts, setCartProducts] = useState(null);
  const [cartDetails, setCartDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const fetchCartProducts = async () => {
    if (!selectedCommunity) {
      // enqueueSnackbar(`Community ID not found!`, { variant: "error" });
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(
        `${BASE_URL}/communities/${selectedCommunity?.id}/cart`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      setCartProducts(res?.data?.data?.items);
      setCartDetails(res?.data?.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
      const message =
        error?.response?.data?.message ||
        "Failed to load cart items. Please try again later.";
      setError(message);
      handleApiError(error, navigate);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartCount();
    fetchCartProducts();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartCount,
        setCartCount,
        fetchCartCount,
        // selectedCommunity,
        loading,
        setLoading,
        setError,
        error,
        fetchCartProducts,
        cartProducts,
        cartDetails,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
