import { useCallback, useEffect, useState } from "react";
import ProductList from "./ProductList";
import { useAppContext } from "../../context/AppContext";
import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { handleApiError } from "../../utils/handleApiError";
import { useNavigate, useSearchParams } from "react-router-dom";
import Loader from "../../components/Common/Loader";
import { useUser } from "../../context/userContext";
import { enqueueSnackbar } from "notistack";
import Categories from "./Categories";
import {
  listenForMessages,
  requestNotificationPermission,
} from "../../notifications";
import Pagination from "../../components/Forms/Pagination";

const HomePage = () => {
  const { productSearchValue, fetchNotificaiontCount } = useAppContext();
  const {
    selectedCommunity,
    communities,
    checkIamAlreadyMember,
    fetchCommunities,
  } = useUser();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [categories, setCategories] = useState(null);

  const [searchParams] = useSearchParams();
  const min = searchParams.get("min") || "";
  const max = searchParams.get("max") || "";
  const categoryId = searchParams.get("categoryId") || "";
  const page = Number(searchParams.get("page")) || 1;

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/categories`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      // console.log("res >> ", res?.data?.data?.categories);
      setCategories(res?.data?.data?.categories);
    } catch (error) {
      console.log("err while fetching categories >>> ", error);
    }
  };

  // Fetch community products
  const fetchCommunityProducts = useCallback(async () => {
    if (!selectedCommunity) return;
    checkIamAlreadyMember();

    const params = new URLSearchParams();
    if (productSearchValue) params.set("search", productSearchValue);
    if (min) params.set("minPrice", min);
    if (max) params.set("maxPrice", max);
    if (categoryId) params.set("categoryId", categoryId);
    params.set("page", page);
    params.set("limit", 12);

    try {
      setLoading(true);
      const url = `${BASE_URL}/communities/${
        selectedCommunity.id
      }/products?status=active&${params.toString()}`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      setProducts(res?.data?.data?.products || []);
      setPagination(res?.data?.data?.pagination || null);
    } catch (error) {
      if (error?.status === 403) {
        enqueueSnackbar(
          error?.response?.data?.message ||
            error?.message ||
            "Something went wrong.",
          {
            variant: `error`,
          }
        );
        navigate(`/`);
        return;
      }
      // enqueueSnackbar()
      // handleApiError(error, navigate);
    } finally {
      setLoading(false);
    }
  }, [selectedCommunity?.id, productSearchValue, min, max, page, categoryId]);

  useEffect(() => {
    fetchCommunityProducts();
  }, [fetchCommunityProducts]);

  useEffect(() => {
    document.title = "Home - giveXchange";
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchCategories();
    fetchCommunities();
    fetchNotificaiontCount();
  }, []);

  return (
    <main className="w-full py-16 min-h-screen text-center padding-x">
      {communities && communities?.length > 0 && <Categories />}
      {loading ? (
        <div className="w-full flex justify-center pt-40 min-h-screen">
          <Loader />
        </div>
      ) : (
        <>
          {communities?.length > 0 ? (
            <>
              <ProductList products={products} pagination={pagination} />

              {/* Pagination */}
              <Pagination pagination={pagination} page={page} />
            </>
          ) : (
            <div className="w-full text-center h-[70vh] flex items-center justify-center gap-2">
              {/* public/community-icon.png */}
              <img
                src="/community-icon.png"
                alt="community-icon"
                className="max-w-7"
              />
              <p className="text-sm text-gray-500 font-medium">
                You have not joined any community yet.
              </p>
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default HomePage;
