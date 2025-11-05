import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { handleApiError } from "../../utils/handleApiError";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import Loader from "../Common/Loader";

const ProductManagementHeader = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCheckStripeAccountStatus = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/seller/stripe/return`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      // console.log("stripe status >>> ", res?.data);
      // return;
      if (res?.data?.success) {
        navigate("/product-management/add-product");
      } else {
        handleCreateStripeAccount();
      }
    } catch (error) {
      if (error?.status === 404) {
        enqueueSnackbar("Please create your stripe account!", {
          variant: "error",
        });
        handleCreateStripeAccount();
        return;
      }
      console.log("handleCheckStripeAccountStatus error >>> ", error);
      handleApiError(error, navigate);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStripeAccount = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/seller/stripe/onboarding`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      console.log("onboarding res >>> ", res?.data);
      if (res?.data?.success && res?.data?.data?.url) {
        window.open(res.data.data.url, "_blank", "noopener,noreferrer");
      }
      // handleCheckStripeAccountStatus();

      //   console.log("create stripe account >>> ", res?.data);
    } catch (error) {
      console.error("create stripe account error >>> ", error);
      handleApiError(error, navigate);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckStripeStatus = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/seller/stripe/status`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const data = res?.data?.data;
      console.log("seller stripe status >>> ", res?.data?.data);
      if (!data?.hasStripeAccount) {
        handleCreateStripeAccount();
        return;
      } else {
        navigate("/product-management/add-product");
      }
    } catch (error) {
      handleApiError(error, navigate);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-between flex-wrap gap-5">
      <h1 className="text-[24px] lg:text-[32px] font-semibold leading-none text-white">
        Product Management
      </h1>
      <button
        type="button"
        onClick={handleCheckStripeAccountStatus}
        className="button max-w-[214px] h-[58px] flex items-center justify-center"
      >
        {loading ? <Loader /> : "Add New Product"}
      </button>
      {/* <Link
        to={`/product-management/add-product`}
        className="button max-w-[214px] h-[58px] flex items-center justify-center"
      >
        Add New Product
      </Link> */}
    </div>
  );
};

export default ProductManagementHeader;
