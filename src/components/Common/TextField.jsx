const TextField = ({
  name,
  value,
  onChange,
  onBlur,
  type = "text",
  placeholder,
  error,
  touched,
  label,
  disabled,
}) => {
  const showError = touched && error;

  return (
    <div className="w-full flex flex-col gap-1">
      {label && (
        <label htmlFor={name} className="text-sm font-medium">
          {label}
        </label>
      )}

      <input
        type={type}
        id={name}
        name={name}
        autoComplete="off"
        disabled={disabled}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full border h-[49px] bg-[var(--secondary-bg)] px-[15px] py-[14px] font-normal text-[#6D6D6D] rounded-[8px] outline-none transition-all
          ${showError ? "border-red-500" : "border-[var(--secondary-bg)]"}
        `}
      />

      {showError && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};

export default TextField;
