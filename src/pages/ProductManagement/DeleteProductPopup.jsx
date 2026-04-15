import React, { useState } from "react";
import Loader from "../../components/Common/Loader";
import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { enqueueSnackbar } from "notistack";
import { handleApiError } from "../../utils/handleApiError";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/userContext";
import { useTranslation } from "react-i18next";
import i18n from "i18next";

const DeleteProductPopup = ({ showPopup, setShowDeletePopup, productId }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { checkIamAlreadyMember } = useUser();
  const { t } = useTranslation("productManagement");

  const handleDeleteProduct = async () => {
    if (!productId) {
      enqueueSnackbar(t("deleteProduct.errors.noProductId"), {
        variant: "error",
      });
      return;
    }

    checkIamAlreadyMember();
    setLoading(true);

    try {
      const res = await axios.post(
        `${BASE_URL}/products/${productId}/delist`,
        {},
        {
          headers: {
            "Accept-Language": i18n.language,
            Authorization: `Bearer ${getToken()}`,
          },
        },
      );

      if (res?.data?.success) {
        enqueueSnackbar(t("deleteProduct.success"), {
          variant: "success",
        });
        navigate(`/product-management`);
      }
    } catch (error) {
      console.log("delete product error >> ", error);
      handleApiError(error, navigate);
    } finally {
      setLoading(false);
    }
  };

  return (
    showPopup && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-[#fff] p-8 rounded-[32px] shadow-lg max-w-[471px] w-full text-center">
          <div className="w-[107px] h-[107px] mx-auto bg-[var(--button-bg)] flex items-center justify-center rounded-full">
            <img
              src="/delete-product-icon.png"
              alt={t("deleteProduct.alt.icon")}
              className="w-[67px] h-[57px]"
            />
          </div>

          <h2 className="text-lg lg:text-[32px] font-semibold mt-3 mb-1 leading-[1.2]">
            {t("deleteProduct.title")}
          </h2>

          <p className="mb-4">{t("deleteProduct.description")}</p>

          <div className="w-full grid grid-cols-2 gap-3 mt-1">
            <button
              onClick={() => setShowDeletePopup(false)}
              className="w-full px-4 py-3 rounded-lg bg-[#EAEAEA]"
            >
              {t("common.no")}
            </button>

            <button
              onClick={handleDeleteProduct}
              className="w-full px-4 py-3 rounded-lg bg-[var(--button-bg)] text-white"
            >
              {loading ? <Loader /> : t("common.yes")}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default DeleteProductPopup;
