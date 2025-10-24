import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

const MAX_PRICE_LIMIT = 999999;

const SearchFilterBox = ({
  handleTogglePriceFilter,
  openPriceFilter,
  setOpenPriceFilter,
}) => {
  const dropdownRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || ""
  );
  const [minPrice, setMinPrice] = useState(searchParams.get("min") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max") || "");
  const [errors, setErrors] = useState({ min: "", max: "" });
  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenPriceFilter(false);
      }
    };
    if (openPriceFilter)
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openPriceFilter, setOpenPriceFilter]);

  useEffect(() => {
    setSearchValue(searchParams.get("search") || "");
    setMinPrice(searchParams.get("min") || "");
    setMaxPrice(searchParams.get("max") || "");
  }, [searchParams]);

  // Handle search typing and query update
  const handleSearchChange = (e) => {
    const value = e.target.value;
    if (value) searchParams.set("search", value);
    else searchParams.delete("search");
    setSearchParams(searchParams);
  };

  // Common number validation helper
  const isValidPrice = (value) => /^\d+(\.\d{0,2})?$/.test(value);

  const validatePrices = (min, max) => {
    const newErrors = { min: "", max: "" };
    let valid = true;

    if (min) {
      if (!isValidPrice(min))
        newErrors.min = "Invalid format (max 2 decimals).";
      else if (Number(min) < 1) newErrors.min = "Min price must be at least 1.";
      else if (Number(min) > MAX_PRICE_LIMIT)
        newErrors.min = `Less than ${MAX_PRICE_LIMIT}.`;
    }

    if (max) {
      if (!isValidPrice(max))
        newErrors.max = "Invalid format (max 2 decimals).";
      else if (Number(max) < 1) newErrors.max = "Max price must be at least 1.";
      else if (Number(max) > MAX_PRICE_LIMIT)
        newErrors.max = `Less than ${MAX_PRICE_LIMIT}.`;
    }

    if (min && max && Number(max) < Number(min))
      newErrors.max = "Max must be >= Min.";

    setErrors(newErrors);
    return valid;
  };

  // Update min & validate live
  const handleMinChange = (e) => {
    const value = e.target.value.replace(/^0+(?!\.)/, "");
    setMinPrice(value);
    validatePrices(value, maxPrice);
  };

  // Update max & validate live
  const handleMaxChange = (e) => {
    const value = e.target.value.replace(/^0+(?!\.)/, "");
    setMaxPrice(value);
    validatePrices(minPrice, value);
  };

  // Apply price filter
  const handleApplyPriceFilter = () => {
    if (errors.min || errors.max) return;
    if (minPrice) searchParams.set("min", minPrice);
    else searchParams.delete("min");
    if (maxPrice) searchParams.set("max", maxPrice);
    else searchParams.delete("max");
    setSearchParams(searchParams);
    setOpenPriceFilter(false)
  };

  // Reset price filter
  const handleResetPriceFilter = () => {
    setMinPrice("");
    setMaxPrice("");
    setErrors({ min: "", max: "" });
    searchParams.delete("min");
    searchParams.delete("max");
    setSearchParams(searchParams);
    handleTogglePriceFilter();
  };

  return (
    <div
      ref={dropdownRef}
      className="w-full max-w-[386px] flex items-center justify-between gap-2 relative"
    >
      {/* Search Input */}
      <div className="w-full max-w-[327px] h-[49px] flex items-center rounded-[19px] px-4 gap-2 productSearchInput">
        <img
          src="/search-icon.png"
          alt="search icon"
          className="w-[15px] h-[16px]"
        />
        <input
          type="text"
          placeholder="Search here"
          className="w-full border-none outline-none bg-transparent text-[15px] font-normal text-white placeholder:text-gray-300"
          value={searchValue}
          onChange={handleSearchChange}
        />
      </div>

      {/* Filter Button */}
      <div className="w-[49px]">
        <button
          type="button"
          onClick={handleTogglePriceFilter}
          className="w-[48px] h-[48px] bg-white rounded-[14px] flex items-center justify-center"
        >
          <img
            src="/filter-icon.png"
            alt="filter-icon"
            className="w-[25px] h-[15px]"
          />
        </button>
      </div>

      {/* Price Filter Dropdown */}
      {openPriceFilter && (
        <div className="absolute top-14 right-0 w-full sm:w-[400px] bg-white rounded-[16px] py-6 lg:rounded-[32px] shadow-md z-50">
          <p className="text-[24px] font-semibold leading-none px-6">Filter</p>
          <div className="w-full border my-5" />

          <div className="w-full px-6">
            <label
              htmlFor="priceRange"
              className="text-base font-medium leading-none"
            >
              Price Range
            </label>

            <div className="w-full relative mt-2">
              <div className="grid grid-cols-2 gap-4">
                {/* Min Price */}
                <div>
                  <label
                    htmlFor="min"
                    className="text-xs font-medium block mb-1"
                  >
                    Min
                  </label>
                  <input
                    type="number"
                    id="min"
                    value={minPrice}
                    onChange={handleMinChange}
                    onKeyDown={(e) => {
                      if (["e", "E", "+", "-"].includes(e.key))
                        e.preventDefault();
                    }}
                    min="1"
                    max={MAX_PRICE_LIMIT}
                    step="0.01"
                    className={`bg-[#F5F5F5] h-[49px] w-full px-4 rounded-[12px] outline-none ${
                      errors.min ? "border border-red-500" : ""
                    }`}
                  />
                  {errors.min && (
                    <p className="text-xs text-red-500 mt-1">{errors.min}</p>
                  )}
                </div>

                {/* Max Price */}
                <div>
                  <label
                    htmlFor="max"
                    className="text-xs font-medium block mb-1"
                  >
                    Max
                  </label>
                  <input
                    type="number"
                    id="max"
                    value={maxPrice}
                    onChange={handleMaxChange}
                    onKeyDown={(e) => {
                      if (["e", "E", "+", "-"].includes(e.key))
                        e.preventDefault();
                    }}
                    min="1"
                    max={MAX_PRICE_LIMIT}
                    step="0.01"
                    className={`bg-[#F5F5F5] h-[49px] w-full px-4 rounded-[12px] outline-none ${
                      errors.max ? "border border-red-500" : ""
                    }`}
                  />
                  {errors.max && (
                    <p className="text-xs text-red-500 mt-1">{errors.max}</p>
                  )}
                </div>
              </div>

              <img
                src="/filter-circle-icon.png"
                alt="filter-circle-icon"
                className="w-[28px] h-[28px] absolute top-[43%] left-1/2 -translate-x-1/2"
              />
            </div>

            <div className="w-full grid grid-cols-2 gap-3 mt-5">
              <button
                type="button"
                onClick={handleResetPriceFilter}
                className="w-full h-[49px] rounded-[12px] font-medium bg-[#E0E0E0]"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={handleApplyPriceFilter}
                className={`button ${
                  errors.min || errors.max
                    ? "opacity-60 cursor-not-allowed"
                    : ""
                }`}
                disabled={!!errors.min || !!errors.max}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilterBox;
