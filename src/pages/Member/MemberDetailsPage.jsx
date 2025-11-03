import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

const MemberDetailsPage = () => {
  const { communityId, userId } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [
    showMemberReportConfimationPopup,
    setShowMemberReportConfimationPopup,
  ] = useState(false);

  const [openReportMemberModal, setOpenReportMemberModal] = useState(false);
  const [openReportMemberSuccessModal, setOpenReportMemberSuccessModal] =
    useState(false);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/communities/${communityId}/members/${userId}/details`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      // console.log("member details >> ", response?.data);
      setMember(response?.data?.data?.member);
    } catch (error) {
      console.error("err while fetching member info >>> ", error);
      handleApiError(error, navigate);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
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

      <div className="w-full bg-[var(--light-bg)] rounded-[30px] relative p-4 mt-5 space-y-8">
        <MemberHeader
          member={member}
          setShowMemberReportConfimationPopup={
            setShowMemberReportConfimationPopup
          }
        />

        <div className="w-full max-w-[422px] h-[60px] bg-white custom-shadow rounded-[8px] grid grid-cols-2 gap-1 p-1.5">
          <button
            type="button"
            onClick={() => setActiveTab("details")}
            className={`${
              activeTab === "details" ? "bg-[var(--button-bg)] text-white" : ""
            } font-medium rounded-[8px]`}
          >
            Member Details
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("reviews")}
            className={`${
              activeTab === "reviews" ? "bg-[var(--button-bg)] text-white" : ""
            } font-medium rounded-[8px]`}
          >
            Reviews
          </button>
        </div>

        {activeTab === "details" ? (
          <MemberInfo member={member} />
        ) : (
          <MemberReviews member={member} />
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
