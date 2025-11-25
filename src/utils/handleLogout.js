import Cookies from "js-cookie";

export const handleLogout = () => {
  Cookies.remove("userToken");
  Cookies.remove("user");
  Cookies.remove("selected-community");
  Cookies.remove("page");
  Cookies.remove("userEmail");
  Cookies.remove("isUserEmailVerified");
  Cookies.remove("userSelectedPaymentMethod");
  Cookies.remove("userSelectedDeliveryMethod");
  Cookies.remove("userSelectedDeliveryAddress");
  Cookies.remove("newDeliveryAddress");
};
