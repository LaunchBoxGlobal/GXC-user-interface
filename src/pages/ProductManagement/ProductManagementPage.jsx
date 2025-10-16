import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { handleApiError } from "../../utils/handleApiError";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import ProductCard from "../../components/Common/ProductCard";
import { useAppContext } from "../../context/AppContext";

const ProductManagementPage = () => {
  const [products, setProducts] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { selectedCommunity } = useAppContext();
  const [errorMessage, setErrorMessage] = useState(null);

  const [error, setError] = useState(false);

  const fetchProducts = async () => {
    if (!selectedCommunity) {
      return;
    }
    if (selectedCommunity) {
      setLoading(true);
      try {
        const res = await axios.get(
          `${BASE_URL}/my-products?communityId=${selectedCommunity?.id}`,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );
        // console.log("product >>>> ", res?.data?.data?.products);
        setProducts(res?.data?.data?.products);
      } catch (error) {
        handleApiError(error, navigate);
        setErrorMessage(
          error?.response?.data?.message || "Something went wrong!"
        );
        setError(true);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!selectedCommunity) {
      return;
    }
    fetchProducts();
  }, []);

  return (
    <div className="w-full min-h-screen padding-x py-20">
      {products && products?.length > 0 ? (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-10 max-w-[1280px] mx-auto">
          {products?.map((product, index) => {
            return <ProductCard product={product} index={index} key={index} />;
          })}
        </div>
      ) : (
        <div className="w-full text-center">
          {error ? (
            <p className="">{errorMessage}</p>
          ) : (
            <p className="">You do not have any products</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductManagementPage;
