import Cookies from "js-cookie";
import { enqueueSnackbar } from "notistack";
import { shouldShowError, markErrorShown } from "./apiErrorManager";

export const handleApiError = (error, navigate) => {
  if (error?.response) {
    const status = error.response.status;

    // ----------------- 400 -----------------
    if (status === 400) {
      enqueueSnackbar(
        error?.message ||
          error?.response?.data?.message ||
          "Invalid request. Please check your input.",
        { variant: "error" }
      );
      return;
    }
    // ----------------- 401 -----------------
    if (status === 401) {
      if (shouldShowError("suspended401")) {
        markErrorShown("suspended401");

        enqueueSnackbar(
          error?.response?.data?.message ||
            error?.message ||
            "Your session has expired. Please log in again.",
          { variant: "error" }
        );

        Cookies.remove("token");
        Cookies.remove("user");
        Cookies.remove("userToken");
        localStorage.removeItem("token");
        localStorage.removeItem("userToken");

        navigate("/login");
      }
      return;
    }

    // ----------------- 403 -----------------
    if (status === 403) {
      if (shouldShowError("forbidden403")) {
        markErrorShown("forbidden403");

        enqueueSnackbar(
          error?.response?.data?.message ||
            error?.message ||
            "Access denied. Please contact support.",
          { variant: "error" }
        );
      }
      return;
    }

    // ----------------- 500+ -----------------
    if (status >= 500) {
      if (shouldShowError("server500")) {
        markErrorShown("server500");

        console.error("Server error:", error?.response?.data?.message);

        enqueueSnackbar(
          error?.response?.data?.message ||
            error?.message ||
            "Something went wrong on our end. Please try again later.",
          { variant: "error" }
        );
      }
      return;
    }

    // ----------------- OTHER 4xx ERRORS -----------------
    if (shouldShowError("otherErrors")) {
      markErrorShown("otherErrors");

      console.error("API error:", error?.response?.data?.message);
      enqueueSnackbar(
        error?.response?.data?.message ||
          error?.message ||
          "An error occurred.",
        { variant: "error" }
      );
    }

    return;
  }

  // ----------------- NO SERVER RESPONSE -----------------
  if (error?.request) {
    if (shouldShowError("networkError")) {
      markErrorShown("networkError");

      console.error("No response from server:", error.request);
      enqueueSnackbar(
        "Unable to connect to the server. Please check your internet.",
        { variant: "error" }
      );
    }
    return;
  }

  // ----------------- UNKNOWN ERRORS -----------------
  if (shouldShowError("unknownError")) {
    markErrorShown("unknownError");

    console.error("Error:", error?.message);
    enqueueSnackbar(
      error?.message ||
        error?.response?.data?.message ||
        "Unexpected error occurred. Please try again.",
      { variant: "error" }
    );
  }
};
