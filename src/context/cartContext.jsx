import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { BASE_URL } from "../data/baseUrl";
import { enqueueSnackbar } from "notistack";
import { getToken } from "../utils/getToken";
import { handleApiError } from "../utils/handleApiError";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [selectedCommunity, setSelectedCommunity] = useState(
    Cookies.get("selected-community")
      ? JSON.parse(Cookies.get("selected-community"))
      : null
  );

  const fetchCartCount = async () => {
    if (!selectedCommunity) {
      enqueueSnackbar(`Community ID not found!`, {
        variant: "error",
      });
      return;
    }
    try {
      const res = await axios.get(
        `${BASE_URL}/communities/${selectedCommunity?.id}/cart/count`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      // console.log("cart count >>> ", res?.data);
      setCartCount(res?.data?.data?.count);
    } catch (error) {
      // console.log("err while cart count >>> ", error);
      handleApiError(error, navigate);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, setCartCount, fetchCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
