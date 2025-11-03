const ReportSuccessPopup = ({ isReportSubmitted, setIsReportSubmitted }) => {
  const handleClickYes = () => {
    setIsReportSubmitted(false);
  };
  return (
    isReportSubmitted && (
      <div
        onClick={handleClickYes}
        className="w-full h-screen fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)] flex items-center justify-center padding-x"
      >
        <div className="w-full bg-white max-w-[471px] rounded-[16px] lg:rounded-[32px] p-7 lg:py-9 flex flex-col items-center gap-4 text-center">
          <div className="w-[122px] h-[122px] rounded-full bg-[var(--button-bg)] flex items-center justify-center">
            <img
              src="/check-icon-white.png"
              alt="/check-icon-white.png"
              className="w-[39px] h-[30px]"
            />
          </div>
          <p className="text-[24px] font-semibold leading-none">
            Report Submitted
          </p>
          <p className="text-[#888888]">
            Your report has been submitted successfully. Our team will review it
            and respond accordingly.
          </p>
        </div>
      </div>
    )
  );
};

export default ReportSuccessPopup;
