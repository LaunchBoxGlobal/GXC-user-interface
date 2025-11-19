import Cookies from "js-cookie";
import { enqueueSnackbar } from "notistack";

export const handleApiError = (error, navigate) => {
  if (error?.response) {
    const status = error.response.status;

    if (status === 401) {
      enqueueSnackbar(
        error?.response?.data?.message ||
          error?.message ||
          "Your session has expired. Please log in again.",
        {
          variant: "error",
        }
      );
      Cookies.remove("token");
      Cookies.remove("user");
      Cookies.remove("userToken");
      localStorage.removeItem("token");
      localStorage.removeItem("userToken");
      navigate("/login");
      return;
    } else if (status === 403) {
      enqueueSnackbar(
        error?.response?.data?.message ||
          error?.message ||
          "Access denied. Please contact support.",
        {
          variant: "error",
        }
      );
    } else if (status >= 500) {
      console.error("Server error:", error?.response?.data?.message);
      enqueueSnackbar(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong on our end. Please try again later.",
        {
          variant: "error",
        }
      );
    } else {
      console.error("API error:", error.response.data?.message);
      enqueueSnackbar(
        error.response.data?.message || error?.message || "An error occurred.",
        {
          variant: "error",
        }
      );
    }
  } else if (error?.request) {
    console.error("No response from server:", error.request);
    enqueueSnackbar(
      "Unable to connect to the server. Please check your internet.",
      {
        variant: "error",
      }
    );
  } else {
    console.error("Error:", error.message);
    enqueueSnackbar(
      error?.message ||
        error?.response?.data?.message ||
        "Unexpected error occurred. Please try again.",
      {
        variant: "error",
      }
    );
  }
};
