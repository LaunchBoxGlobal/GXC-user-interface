import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import VerifyOtpForAccountDeletionModal from "./VerifyOtpForAccountDeletionModal";

const DeleteAccount = () => {
  const { user } = useAppContext();
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => {
    setShowModal((prev) => !prev);
  };
  return (
    <div className="w-full relative pt-2">
      <h2 className="text-[24px] font-semibold leading-none">Delete Account</h2>
      <div className="w-full border my-5" />

      <div className="w-full flex items-center justify-between">
        <div className="w-full max-w-[80%]">
          <h3 className="font-semibold text-lg">
            We will send 6 digits code to {user?.email}
          </h3>
          <p className="">
            Your data will be removed from our database permanently.
          </p>
        </div>
        <div className="">
          <button
            type="button"
            onClick={() => handleCloseModal()}
            className="button min-w-[150px]"
          >
            Send
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
