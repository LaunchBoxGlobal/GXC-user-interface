import { useEffect, useState, useCallback } from "react";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { handleApiError } from "../../utils/handleApiError";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import ProductCard from "./ProductCard";
import { useUser } from "../../context/userContext";
import Loader from "../../components/Common/Loader";
import Categories from "../Home/Categories";
import { useAppContext } from "../../context/AppContext";
import Pagination from "../../components/Forms/Pagination";

const ProductManagementPage = () => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const { selectedCommunity, checkIamAlreadyMember, communities } = useUser();
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("categoryId") || "";

  const page = Number(searchParams.get("page")) || 1;
  const limit = 12;
  const { productType, fetchNotificaiontCount } = useAppContext();

  const fetchProducts = useCallback(async () => {
    if (!selectedCommunity) return;
    checkIamAlreadyMember();
    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/my-products?status=${productType}&communityId=${
          selectedCommunity?.id
        }&page=${page}&limit=${limit}${
          categoryId ? `&categoryId=${categoryId}` : ""
        }`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      const data = res?.data?.data || {};
      setProducts(data.products || []);
      setPagination(data.pagination || null);
      setError(false);
    } catch (error) {
      handleApiError(error, navigate);
      setErrorMessage(
        error?.response?.data?.message || "Something went wrong!"
      );
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [selectedCommunity?.id, page, categoryId, productType]);

  useEffect(() => {
    document.title = "Product Management - giveXchange";
    fetchProducts();
    fetchNotificaiontCount();
  }, [fetchProducts, categoryId]);

  return (
    <div className="w-full min-h-screen padding-x py-16">
      {communities && communities?.length > 0 && <Categories />}
      {/* <ProductTypeTabs /> */}
      {loading ? (
        <div className="w-full flex justify-center pt-48 min-h-[100vh]">
          <Loader />
        </div>
      ) : (
        <>
          {products && products.length > 0 ? (
            <>
              {/* Product Grid */}
              <div className="w-full mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-10 min-h-screen max-w-[1280px] mx-auto">
                {products.map((product, index) => (
                  <ProductCard product={product} index={index} key={index} />
                ))}
              </div>

              {/* Pagination */}
              <Pagination pagination={pagination} page={page} />
            </>
          ) : (
            <div className="w-full text-center">
              {error ? (
                <p>{errorMessage}</p>
              ) : (
                <div className="w-full text-center h-[70vh] flex items-center justify-center gap-2">
                  <img
                    src="/product-icon.png"
                    alt="product icon"
                    className="max-w-7"
                  />
                  <p className="text-sm font-medium text-gray-500">
                    You have not added any products yet.
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductManagementPage;
