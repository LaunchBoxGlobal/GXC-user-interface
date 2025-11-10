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

const HomePage = () => {
  const { productSearchValue } = useAppContext();
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
    document.title = "Home - GiveXChange";
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchCategories();
    fetchCommunities();
  }, []);

  const handlePageChange = (newPage) => {
    if (!pagination || newPage < 1 || newPage > pagination.totalPages) return;
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage);
    navigate(`?${params.toString()}`);
  };

  const renderPageNumbers = () => {
    if (!pagination) return null;
    const { totalPages } = pagination;
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <li key={i}>
          <button
            onClick={() => handlePageChange(i)}
            aria-current={i === page ? "page" : undefined}
            className={`flex items-center justify-center px-4 h-10 leading-tight font-medium rounded-[12px] ${
              i === page
                ? "text-white bg-[var(--button-bg)] font-medium"
                : "text-gray-600 hover:bg-[var(--button-bg)] hover:text-white"
            }`}
          >
            {i}
          </button>
        </li>
      );
    }
    return pages;
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center pt-40 min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <main className="w-full py-16 min-h-screen text-center padding-x">
      {categories?.length > 0 && <Categories categories={categories} />}
      {communities?.length > 0 ? (
        <>
          <ProductList products={products} pagination={pagination} />

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <nav
              aria-label="Page navigation"
              className="flex justify-end w-full mt-10"
            >
              <ul className="inline-flex items-center gap-2 px-2 -space-x-px text-base h-[58px] bg-[#E6E6E6BD] rounded-[12px]">
                {/* Previous Button */}
                <li>
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1}
                    className={`flex items-center justify-center px-4 h-10 ms-0 leading-tight font-medium rounded-[12px] ${
                      page <= 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-600 hover:bg-[var(--button-bg)] hover:text-white"
                    }`}
                  >
                    Previous
                  </button>
                </li>

                {/* Page Numbers */}
                {renderPageNumbers()}

                {/* Next Button */}
                <li>
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= pagination.totalPages}
                    className={`flex items-center justify-center px-4 h-10 leading-tight font-medium rounded-[12px] ${
                      page >= pagination.totalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-600 hover:bg-[var(--button-bg)] hover:text-white"
                    }`}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
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
    </main>
  );
};

export default HomePage;
