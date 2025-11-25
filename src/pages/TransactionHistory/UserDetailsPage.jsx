import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { handleApiError } from "../../utils/handleApiError";
import Loader from "../../components/Common/Loader";
import { HiArrowLeft } from "react-icons/hi";
import MemberInfo from "../Member/MemberInfo";
import MemberReviews from "../Member/MemberReviews";
import MemberHeader from "../Member/MemberHeader";
import MemberReportConfirmationPopup from "../Member/MemberReportConfirmationPopup";
import ReportMemberModal from "../Member/ReportMemberModal";
import ReportMemberSuccessModal from "../Member/ReportMemberSuccessModal";

const UserDetailsPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [searchParams] = useSearchParams();
  const isOrderPlaced = searchParams.get("isOrderPlaced") || false;
  const isBuyer = searchParams.get("isBuyer");

  const [
    showMemberReportConfimationPopup,
    setShowMemberReportConfimationPopup,
  ] = useState(false);

  const [openReportMemberModal, setOpenReportMemberModal] = useState(false);
  const [openReportMemberSuccessModal, setOpenReportMemberSuccessModal] =
    useState(false);

  const fetchUserProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${BASE_URL}/users/${userId}/profile`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setMember(response?.data?.data?.user);
    } catch (error) {
      console.error("Error while fetching member info >>> ", error);
      handleApiError(error, navigate);
      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load member details. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // 🧠 1. Loading UI
  if (loading) {
    return (
      <div className="w-full bg-[var(--light-bg)] rounded-[30px] p-4 mt-2">
        <div className="w-full bg-white rounded-[18px] p-5 flex justify-center min-h-[60vh] pt-32">
          <Loader />
        </div>
      </div>
    );
  }

  // ❌ 2. Error UI
  if (error) {
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
        <div className="w-full bg-[var(--light-bg)] p-5 rounded-[30px] mt-5">
          <div className="w-full rounded-[20px] p-5 bg-white text-center min-h-[100vh] flex items-center justify-center">
            <p className="text-gray-600 font-medium text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // ✅ 3. Normal UI
  return (
    <div className="w-full bg-transparent rounded-[10px] padding-x relative -top-28 min-h-[120vh]">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="w-full max-w-[48px] flex items-center justify-between text-sm text-white"
      >
        <HiArrowLeft />
        Back
      </button>

      <div className="w-full bg-[var(--light-bg)] rounded-[30px] p-4 mt-5 space-y-8">
        <div className="w-full bg-white rounded-[18px] relative p-5">
          <div className="w-full flex items-center justify-between flex-wrap gap-y-7">
            <div className="flex items-center gap-3">
              <div className="w-[136px] h-[136px] rounded-full border border-[var(--button-bg)] p-1.5">
                {member?.profilePictureUrl ? (
                  <img
                    src={member?.profilePictureUrl}
                    alt=""
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <img
                    src={`/profile-icon.png`}
                    alt=""
                    className="w-full h-full rounded-full object-cover"
                  />
                )}
              </div>
              <div className="">
                <p className="text-[24px] lg:text-[32px] font-semibold">
                  {member?.fullName}
                </p>
                <p className=""></p>
              </div>
            </div>
            {!isBuyer && isOrderPlaced === "true" && (
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setShowMemberReportConfimationPopup(true)}
                  className="button min-w-[214px]"
                >
                  Report User
                </button>
              </div>
            )}
          </div>
        </div>

        {isOrderPlaced === "true" ? (
          <>
            {/* Tabs (only if order is placed) */}
            <div className="w-full max-w-[422px] h-[60px] bg-white custom-shadow rounded-[8px] grid grid-cols-2 gap-1 p-1.5">
              <button
                type="button"
                onClick={() => setActiveTab("details")}
                className={`${
                  activeTab === "details"
                    ? "bg-[var(--button-bg)] text-white"
                    : ""
                } font-medium rounded-[8px]`}
              >
                Member Details
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("reviews")}
                className={`${
                  activeTab === "reviews"
                    ? "bg-[var(--button-bg)] text-white"
                    : ""
                } font-medium rounded-[8px]`}
              >
                Reviews
              </button>
            </div>

            {/* Conditional content */}
            {activeTab === "details" ? (
              <MemberInfo member={member} />
            ) : (
              <MemberReviews member={member} />
            )}
          </>
        ) : (
          <>
            {isOrderPlaced && isOrderPlaced === "false" && (
              <MemberReviews member={member} />
            )}
            {isBuyer && <MemberInfo member={member} />}
          </>
        )}
      </div>

      <MemberReportConfirmationPopup
        showMemberReportConfimationPopup={showMemberReportConfimationPopup}
        setShowMemberReportConfimationPopup={
          setShowMemberReportConfimationPopup
        }
        setOpenReportMemberModal={setOpenReportMemberModal}
      />

      <ReportMemberModal
        openReportMemberModal={openReportMemberModal}
        setOpenReportMemberModal={setOpenReportMemberModal}
        setOpenReportMemberSuccessModal={setOpenReportMemberSuccessModal}
      />

      <ReportMemberSuccessModal
        openReportMemberSuccessModal={openReportMemberSuccessModal}
        setOpenReportMemberSuccessModal={setOpenReportMemberSuccessModal}
      />
    </div>
  );
};

export default UserDetailsPage;
