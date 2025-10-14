import { useEffect, useRef, useState } from "react";
import Gallery from "./Gallery";
import { useNavigate, useSearchParams } from "react-router-dom";
import { HiArrowLeft, HiOutlineDotsVertical } from "react-icons/hi";
import { BiSolidPencil } from "react-icons/bi";
import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { handleApiError } from "../../utils/handleApiError";
import { useAppContext } from "../../context/AppContext";
import Loader from "../../components/Common/Loader";
import DeleteProductPopup from "./DeleteProductPopup";

const ProductDetailsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("productId");
  const [productDetails, setProductDetails] = useState(null);
  const { user } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  // Dropdown open/close state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Toggle dropdown open/close
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      setProductDetails(res?.data?.data?.product);
    } catch (error) {
      handleApiError(error, navigate);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = productDetails
      ? productDetails?.title
      : "Product Details - GiveXChange";
    fetchProductDetails();
  }, []);

  const handleEdit = () => {
    // Example: navigate to edit page
    navigate(`/edit-product?productId=${productId}`);
    setIsDropdownOpen(false);
  };

  return (
    <div className="w-full bg-transparent rounded-[10px] padding-x relative -top-20">
      <button
        type="button"
        onClick={() => navigate(`/product-management`)}
        className="w-full max-w-[48px] flex items-center justify-between text-sm text-white"
      >
        <HiArrowLeft />
        Back
      </button>

      {loading ? (
        <div className="w-full bg-[var(--light-bg)] rounded-[30px] relative p-4 mt-2">
          <div className="w-full bg-white rounded-[18px] relative p-5 flex justify-center min-h-[60vh] pt-32">
            <Loader />
          </div>
        </div>
      ) : (
        <div className="w-full bg-[var(--light-bg)] rounded-[30px] relative p-4 mt-2">
          <div className="w-full bg-white rounded-[18px] relative p-5">
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-14">
              <div className="w-full">
                <Gallery />
              </div>

              <div className="w-full pt-3">
                <div className="w-full flex items-start justify-between gap-4 relative">
                  <div className="space-y-2">
                    {productDetails?.title && (
                      <p className="font-semibold text-[20px] leading-none tracking-tight">
                        {productDetails?.title}
                      </p>
                    )}
                    {productDetails?.deliveryMethod && (
                      <p className="font-medium text-[#6D6D6D] text-xs">
                        {productDetails?.deliveryMethod === "pickup"
                          ? "Pickup"
                          : productDetails?.deliveryMethod === "delivery"
                          ? "Delivery"
                          : "Pickup/Delivery"}
                      </p>
                    )}
                  </div>

                  {/* Dropdown toggle and menu */}
                  {productDetails?.seller?.id === user?.id && (
                    <div className="relative" ref={dropdownRef}>
                      <button type="button" onClick={toggleDropdown}>
                        <HiOutlineDotsVertical className="text-xl" />
                      </button>

                      {isDropdownOpen && (
                        <div className="w-[147px] h-[80px] bg-white rounded-[8px] flex flex-col items-start justify-evenly custom-shadow absolute top-7 right-0 z-10">
                          <button
                            type="button"
                            onClick={handleEdit}
                            className="flex items-center gap-2 px-5 hover:bg-gray-100 w-full py-2 rounded-t-[8px]"
                          >
                            <BiSolidPencil className="text-lg text-[var(--button-bg)]" />
                            <span className="text-base leading-none">Edit</span>
                          </button>
                          <div className="w-full border" />
                          <button
                            type="button"
                            onClick={() => setShowDeletePopup(true)}
                            className="flex items-center gap-2 px-5 hover:bg-gray-100 w-full py-2 rounded-b-[8px]"
                          >
                            <img
                              src="/trash-icon-red.png"
                              alt="trash-icon-red"
                              className="w-[13px] h-[16px]"
                            />
                            <span className="text-base leading-none text-red-500">
                              Delete
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="w-full border my-5" />

                <div className="w-full space-y-3">
                  <p className="text-sm font-semibold">Description</p>
                  {productDetails?.description && (
                    <p className="text-sm font-normal leading-[1.3]">
                      {productDetails?.description}
                    </p>
                  )}
                </div>

                {productDetails?.price && (
                  <>
                    <div className="w-full border my-5" />
                    <div className="w-full">
                      <p className="text-sm font-medium text-[#6D6D6D]">
                        Price
                      </p>
                      <p className="text-[24px] font-semibold text-[var(--button-bg)] leading-[1.3]">
                        ${productDetails?.price}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <DeleteProductPopup
        showPopup={showDeletePopup}
        setShowDeletePopup={setShowDeletePopup}
        productId={productDetails?.id}
      />
    </div>
  );
};

export default ProductDetailsPage;
