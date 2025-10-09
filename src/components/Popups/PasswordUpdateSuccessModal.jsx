const PasswordUpdateSuccessModal = ({ showPopup, handleTogglePopup }) => {
  return (
    showPopup && (
      <main className="w-full h-screen fixed inset-0 z-50 flex items-center justify-center px-4 bg-[rgba(0,0,0,0.4)]">
        <div className="w-full max-w-[471px] min-h-[301px] bg-[#fff] flex flex-col items-center gap-4 rounded-[18px] p-7 lg:p-10">
          <div className="w-[107px] h-[107px] bg-[var(--button-bg)] flex items-center justify-center rounded-full mx-auto">
            <img
              src="/check-icon.svg"
              alt="check-icon"
              className="w-[31px] h-[23px]"
            />
          </div>
          <h2 className="text-[24px] font-semibold leading-[1.3] text-center">
            Password Updated!
          </h2>
          <p className="text-[var(--secondary-color)] text-center leading-[1.3]">
            Your password has been reset successfully
          </p>
          <button
            type={"button"}
            onClick={() => handleTogglePopup()}
            className="w-full bg-[var(--button-bg)] text-white h-[49px] mt-2.5 rounded-[8px] text-center font-medium"
          >
            Continue
          </button>
        </div>
      </main>
    )
  );
};

export default PasswordUpdateSuccessModal;
