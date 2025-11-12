import React, { useEffect, useState, useCallback } from "react";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { handleApiError } from "../../utils/handleApiError";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import ProductCard from "../../components/Common/ProductCard";
import { useUser } from "../../context/userContext";
import Loader from "../../components/Common/Loader";
import Categories from "../Home/Categories";

const ProductManagementPage = () => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const { selectedCommunity, checkIamAlreadyMember } = useUser();
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("categoryId") || "";

  const page = Number(searchParams.get("page")) || 1;
  const limit = 12;

  const fetchProducts = useCallback(async () => {
    if (!selectedCommunity) return;
    checkIamAlreadyMember();
    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/my-products?status=active&communityId=${
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
  }, [selectedCommunity?.id, page, categoryId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts, categoryId]);

  // Handle pagination click
  const handlePageChange = (newPage) => {
    if (!pagination || newPage < 1 || newPage > pagination.totalPages) return;
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage);
    navigate(`?${params.toString()}`);
  };

  // Render numbered page buttons
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
      <div className="w-full flex justify-center pt-80 min-h-[100vh]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen padding-x py-16">
      <Categories />
      {products && products.length > 0 ? (
        <>
          {/* Product Grid */}
          <div className="w-full mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-10 min-h-screen max-w-[1280px] mx-auto">
            {products.map((product, index) => (
              <ProductCard product={product} index={index} key={index} />
            ))}
          </div>

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
    </div>
  );
};

export default ProductManagementPage;
