import { useEffect } from "react";
import Loader from "../../components/Common/Loader";
import { useUser } from "../../context/userContext";

const SellerStripeSuccess = () => {
  const { handleCheckStripeAccountStatus } = useUser();

  useEffect(() => {
    handleCheckStripeAccountStatus();
  }, []);
  return (
    <div className="w-full h-screen bg-white">
      <div className="w-full h-screen flex flex-col gap-3 items-center justify-center fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)]">
        <Loader />
        <h2 className="text-[24px] font-semibold">Verifying</h2>
      </div>
    </div>
  );
};

export default SellerStripeSuccess;
