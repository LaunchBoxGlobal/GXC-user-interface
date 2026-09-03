import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import VerifyOtpForAccountDeletionModal from "./VerifyOtpForAccountDeletionModal";
import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { handleApiError } from "../../utils/handleApiError";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Common/Loader";
import { enqueueSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import i18n from "i18next";

const DeleteAccount = () => {
  const navigate = useNavigate();
  const { user } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation("settings");

  const handleCloseModal = () => {
    setShowModal((prev) => !prev);
  };

  const handleSendOtp = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/auth/request-delete-account`,
        {},
        {
          headers: {
            "Accept-Language": i18n.language,
            Authorization: `Bearer ${getToken()}`,
          },
        },
      );

      if (res?.data?.success) {
        setShowModal(true);
      }
    } catch (error) {
      // enqueueSnackbar(
      //   error?.response?.data?.message ||
      //     error?.message ||
      //     "Something went wrong. Try again."
      // );
      handleApiError(error, navigate);
    } finally {
      setLoading(false);
    }
  };

  function extractEmailDomain(email) {
    const match = email.match(/@.+$/);
    return match ? match[0] : null;
  }
  return (
    <div className="w-full relative pt-2">
      <h2 className="text-[24px] font-semibold leading-none">
        {t(`settings.deleteAccount.deleteAccount`)}
      </h2>
      <div className="w-full border my-5" />

      <div className="w-full flex items-center justify-between flex-wrap gap-5">
        <div className="w-full max-w-[80%]">
          <h3 className="font-medium text-base lg:text-lg leading-[1.3]">
            {t(`settings.deleteAccount.weWillSendCode`)}{" "}
            {user?.email && (
              <span className="font-semibold">
                {`${user?.email?.slice(0, 2)}********${extractEmailDomain(
                  user?.email,
                )}`}{" "}
              </span>
            )}
            {t(`settings.deleteAccount.confirmDeletion`)}
          </h3>
          <p className="text-sm lg:text-base mt-3">
            {t(`settings.deleteAccount.dataRemovedPermanently`)}
          </p>
        </div>
        <div className="">
          <button
            type="button"
            onClick={() => handleSendOtp()}
            className="button min-w-[150px]"
          >
            {loading ? <Loader /> : t(`settings.buttons.send`)}
          </button>
        </div>
      </div>

      <VerifyOtpForAccountDeletionModal
        showModal={showModal}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default DeleteAccount;
