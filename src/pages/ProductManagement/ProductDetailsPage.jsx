import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { handleApiError } from "../../utils/handleApiError";
import { useAppContext } from "../../context/AppContext";
import { useCart } from "../../context/cartContext";
import Loader from "../../components/Common/Loader";
import DeleteProductPopup from "./DeleteProductPopup";
import Gallery from "./Gallery";
import ProductHeader from "./ProductHeader";
import ProductDescription from "./ProductDescription";
import ProductSellerInfo from "./ProductSellerInfo";
import ProductBuySection from "./ProductBuySection";
import { HiArrowLeft } from "react-icons/hi";
import { useUser } from "../../context/userContext";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { MdOutlineReport } from "react-icons/md";
import ReportProductModal from "./ReportProductModal";
import ReportProductSuccessModal from "./ReportProductSuccessModal";

const ProductDetailsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("productId");
  const { user } = useAppContext();
  const { fetchCartCount } = useCart();
  const { selectedCommunity, checkIamAlreadyMember } = useUser();

  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [addProductInCart, setAddProductInCart] = useState(false);
  const [deliveryType, setDeliveryType] = useState(null);
  const [isError, setError] = useState(null);

  const [openReportDropdown, setOpenReportDropdown] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isReportedSuccess, setIsReportedSuccess] = useState(false);

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/products/${productId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setProductDetails(res?.data?.data?.product);
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong."
      );
      handleApiError(error, navigate);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = productDetails
      ? productDetails?.title
      : "Product Details - giveXchange";
    checkIamAlreadyMember();
    fetchProductDetails();
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-transparent rounded-[10px] padding-x relative -top-28">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-full max-w-[48px] flex items-center justify-between text-sm text-white"
        >
          <HiArrowLeft />
          Back
        </button>

        <div className="w-full bg-[var(--light-bg)] rounded-[30px] relative p-4 mt-5">
          <div className="w-full bg-white rounded-[18px] relative p-5 flex justify-center min-h-[80vh] items-center">
            <Loader />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full bg-transparent rounded-[10px] padding-x relative -top-28">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-full max-w-[48px] flex items-center justify-between text-sm text-white"
        >
          <HiArrowLeft />
          Back
        </button>

        <div className="w-full bg-[var(--light-bg)] rounded-[30px] relative p-4 mt-5">
          <div className="w-full bg-white rounded-[18px] relative p-5 flex justify-center min-h-[80vh] items-center">
            <p className="text-sm font-medium text-gray-500">
              {isError}{" "}
              {/* <button
                type="button"
                onClick={() => fetchProductDetails()}
                className="underline text-blue-500"
              >
                Try again
              </button> */}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-transparent rounded-[10px] padding-x relative -top-28">
      <div className="w-full flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-full max-w-[48px] flex items-center justify-between text-sm text-white"
        >
          <HiArrowLeft />
          Back
        </button>
        {productDetails?.seller?.id !== user?.id && (
          <div className="relative z-50">
            <button
              type="button"
              onClick={() => setOpenReportDropdown((prev) => !prev)}
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-lg text-black"
            >
              <HiOutlineDotsVertical />
            </button>
            {openReportDropdown && (
              <div className="w-40 bg-white rounded-lg p-1 h-10 absolute top-9 right-0 z-50 custom-shadow">
                <button
                  type="button"
                  onClick={() => {
                    setIsReportModalOpen((prev) => !prev);
                    setOpenReportDropdown(false);
                  }}
                  className="flex items-center gap-1 h-full w-full bg-gray-100 px-2 rounded-lg"
                >
                  <MdOutlineReport className="text-xl text-gray-600" />
                  <span className="text-sm font-medium text-gray-600">
                    Report
                  </span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="w-full bg-[var(--light-bg)] rounded-[30px] relative p-4 mt-5">
        <div className="w-full bg-white rounded-[18px] relative p-5 min-h-[50vh]">
          <div className="w-full flex items-start justify-between flex-wrap gap-y-7">
            <div className="w-full lg:max-w-[44%]">
              <Gallery images={productDetails?.images} />
            </div>

            <div className="w-full lg:max-w-[53%]">
              <div className="w-full pt-3">
                <ProductHeader
                  productDetails={productDetails}
                  user={user}
                  setShowDeletePopup={setShowDeletePopup}
                  navigate={navigate}
                />

                <ProductDescription description={productDetails?.description} />

                {productDetails?.seller?.id === user?.id ? (
                  <ProductSellerInfo productDetails={productDetails} />
                ) : (
                  <ProductBuySection
                    productDetails={productDetails}
                    deliveryType={deliveryType}
                    setDeliveryType={setDeliveryType}
                    addProductInCart={addProductInCart}
                    setAddProductInCart={setAddProductInCart}
                    selectedCommunity={selectedCommunity}
                    fetchCartCount={fetchCartCount}
                    navigate={navigate}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <DeleteProductPopup
        showPopup={showDeletePopup}
        setShowDeletePopup={setShowDeletePopup}
        productId={productDetails?.id}
      />

      {/* report product modal */}
      {isReportModalOpen && (
        <ReportProductModal
          setIsReportModalOpen={setIsReportModalOpen}
          setIsReportedSuccess={setIsReportedSuccess}
        />
      )}

      {isReportedSuccess && (
        <ReportProductSuccessModal
          setIsReportedSuccess={setIsReportedSuccess}
          setIsReportModalOpen={setIsReportModalOpen}
        />
      )}
    </div>
  );
};

export default ProductDetailsPage;
