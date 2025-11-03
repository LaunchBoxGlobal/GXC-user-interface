import React from "react";

const MemberReportConfirmationPopup = ({
  showMemberReportConfimationPopup,
  setShowMemberReportConfimationPopup,
  setOpenReportMemberModal,
}) => {
  const handleClickYes = () => {
    setShowMemberReportConfimationPopup(false);
    setOpenReportMemberModal(true);
  };
  return (
    showMemberReportConfimationPopup && (
      <div className="w-full h-screen fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)] flex items-center justify-center padding-x">
        <div className="w-full bg-white max-w-[471px] rounded-[16px] lg:rounded-[32px] p-7 flex flex-col items-center gap-4">
          <div className="w-[122px] h-[122px] rounded-full bg-[var(--button-bg)] flex items-center justify-center">
            <img
              src="/report-user-confirmation-popup-icon.png"
              alt="report-user-confirmation-popup-icon"
              className="w-[57px] h-[60px]"
            />
          </div>
          <p className="text-[24px] font-semibold leading-none">Report User</p>
          <p className="text-[#888888]">
            Are you sure you want report this user?
          </p>

          <div className="w-full grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setShowMemberReportConfimationPopup(false)}
              className="bg-[#EDEDED] w-full h-[48px] rounded-[12px] text-center font-medium"
            >
              No
            </button>
            <button
              type="button"
              onClick={() => handleClickYes()}
              className="bg-[var(--button-bg)] w-full h-[48px] rounded-[12px] text-white font-medium text-center"
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default MemberReportConfirmationPopup;
