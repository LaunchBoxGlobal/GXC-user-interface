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

const ProductDetailsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("productId");
  const { user } = useAppContext();
  const { fetchCartCount } = useCart();
  const { selectedCommunity } = useUser();

  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [addProductInCart, setAddProductInCart] = useState(false);
  const [deliveryType, setDeliveryType] = useState(null);

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/products/${productId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
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

  if (loading) {
    return (
      <div className="w-full bg-[var(--light-bg)] rounded-[30px] relative p-4 mt-2">
        <div className="w-full bg-white rounded-[18px] relative p-5 flex justify-center min-h-[60vh] pt-32">
          <Loader />
        </div>
      </div>
    );
  }

  if (productDetails?.status !== "active") {
    navigate(-1);
    return;
  }

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
    </div>
  );
};

export default ProductDetailsPage;
