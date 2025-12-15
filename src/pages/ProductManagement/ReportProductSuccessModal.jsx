const ReportProductSuccessModal = ({
  setIsReportedSuccess,
  setIsReportModalOpen,
}) => {
  return (
    <div className="w-full min-h-screen fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center px-4 z-50">
      <div className="w-full max-w-[471px] min-h-[291px] bg-white p-5 rounded-[32px] z-50 relative">
        <div className="w-full flex items-center justify-center flex-col">
          <div className="w-[122px] h-[122px] bg-[var(--primary-color)] rounded-full flex items-center justify-center mt-4">
            <img
              src="/check-icon-white.png"
              alt="check icon"
              width={35}
              height={26}
            />
          </div>
          <h3 className="text-[24px] font-semibold leading-none mt-4">
            Report Submitted
          </h3>
          <p className="text-[#202020] leading-[1.2] text-center mt-3">
            Thank you! Your report has been <br /> successfully submitted.
          </p>
          <button
            type="button"
            className="absolute top-7 right-7 z-50"
            onClick={() => {
              setIsReportedSuccess(false);
              setIsReportModalOpen(false);
            }}
          >
            <img
              src="/close-icon.png"
              alt="close modal icon"
              width={19}
              height={19}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportProductSuccessModal;
