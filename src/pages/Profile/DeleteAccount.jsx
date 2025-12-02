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

const DeleteAccount = () => {
  const navigate = useNavigate();
  const { user } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

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
            Authorization: `Bearer ${getToken()}`,
          },
        }
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
      <h2 className="text-[24px] font-semibold leading-none">Delete Account</h2>
      <div className="w-full border my-5" />

      <div className="w-full flex items-center justify-between">
        <div className="w-full max-w-[80%]">
          <h3 className="font-medium text-lg">
            We will send 6 digits code to{" "}
            {user?.email && (
              <span className="font-semibold">
                {`${user?.email?.slice(0, 2)}********${extractEmailDomain(
                  user?.email
                )}`}{" "}
              </span>
            )}
            to confirm deletion.
          </h3>
          <p className="">
            Your data will be removed from our database permanently.
          </p>
        </div>
        <div className="">
          <button
            type="button"
            onClick={() => handleSendOtp()}
            className="button min-w-[150px]"
          >
            {loading ? <Loader /> : "Send"}
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
