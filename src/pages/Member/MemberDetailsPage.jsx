import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { handleApiError } from "../../utils/handleApiError";
import Loader from "../../components/Common/Loader";
import { HiArrowLeft } from "react-icons/hi";
import MemberInfo from "./MemberInfo";
import MemberReviews from "./MemberReviews";
import MemberHeader from "./MemberHeader";
import MemberReportConfirmationPopup from "./MemberReportConfirmationPopup";
import ReportMemberModal from "./ReportMemberModal";
import ReportMemberSuccessModal from "./ReportMemberSuccessModal";
import { useTranslation } from "react-i18next";
import i18n from "i18next";

const MemberDetailsPage = () => {
  const { communityId, userId } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [searchParams] = useSearchParams();
  const isOrderPlaced = searchParams.get("isOrderPlaced") || false;
  const isBuyer = searchParams.get("isBuyer");
  const { t } = useTranslation("member");

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
      const response = await axios.get(
        `${BASE_URL}/communities/${communityId}/members/${userId}/details`,
        {
          headers: { "Accept-Language": i18n.language, Authorization: `Bearer ${getToken()}` },
        },
      );
      setMember(response?.data?.data?.member);
    } catch (error) {
      console.error("Error while fetching member info >>> ", error);
      handleApiError(error, navigate);
      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load member details. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Loading UI
  if (loading) {
    return (
      <div className="w-full bg-[var(--light-bg)] rounded-[30px] p-4 mt-2">
        <div className="w-full bg-white rounded-[18px] p-5 flex justify-center min-h-[60vh] pt-32">
          <Loader />
        </div>
      </div>
    );
  }

  // Error UI
  if (error) {
    return (
      <div className="w-full bg-transparent rounded-[10px] padding-x relative -top-28">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-full max-w-[48px] flex items-center justify-between text-sm text-white"
        >
          <HiArrowLeft />
          {t(`members.buttons.back`)}
        </button>
        <div className="w-full bg-[var(--light-bg)] p-5 rounded-[30px] mt-5">
          <div className="w-full rounded-[20px] p-5 bg-white text-center min-h-[100vh] flex items-center justify-center">
            <p className="text-gray-600 font-medium text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  //  Normal UI
  return (
    <div className="w-full bg-transparent rounded-[10px] padding-x relative -top-28 min-h-[120vh]">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="w-full max-w-[48px] flex items-center justify-between text-sm text-white"
      >
        <HiArrowLeft />
        {t(`members.buttons.back`)}
      </button>

      <div className="w-full bg-[var(--light-bg)] rounded-[30px] p-4 mt-5 space-y-8">
        <MemberHeader
          member={member}
          setShowMemberReportConfimationPopup={
            setShowMemberReportConfimationPopup
          }
        />

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
                {t(`members.headings.memberDetails`)}
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
                {t(`members.headings.reviews`)}
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

export default MemberDetailsPage;
