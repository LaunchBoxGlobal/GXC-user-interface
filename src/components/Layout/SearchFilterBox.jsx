import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const SearchFilterBox = ({
  handleTogglePriceFilter,
  openPriceFilter,
  setOpenPriceFilter,
}) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const initialSearch = searchParams.get("search") || "";
  const initialMin = searchParams.get("min") || "";
  const initialMax = searchParams.get("max") || "";

  const [searchValue, setSearchValue] = useState(initialSearch);
  const [minPrice, setMinPrice] = useState(initialMin);
  const [maxPrice, setMaxPrice] = useState(initialMax);
  const [errors, setErrors] = useState({ min: "", max: "" });

  // ✅ Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenPriceFilter(false);
      }
    };

    if (openPriceFilter) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openPriceFilter, setOpenPriceFilter]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    const params = new URLSearchParams(window.location.search);
    if (value) params.set("search", value);
    else params.delete("search");

    navigate(`/?${params.toString()}`, { replace: true });
  };

  // ✅ Validation logic
  const validatePrices = () => {
    let valid = true;
    const newErrors = { min: "", max: "" };

    if (minPrice && Number(minPrice) < 1) {
      newErrors.min = "Min price must be at least 1.";
      valid = false;
    }

    if (maxPrice && minPrice && Number(maxPrice) < Number(minPrice)) {
      newErrors.max = "Max price must be greater than or equal to min price.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleApplyPriceFilter = () => {
    if (!validatePrices()) return;

    const params = new URLSearchParams(window.location.search);

    if (minPrice) params.set("min", minPrice);
    else params.delete("min");

    if (maxPrice) params.set("max", maxPrice);
    else params.delete("max");

    navigate(`/?${params.toString()}`, { replace: true });
    handleTogglePriceFilter();
  };

  const handleResetPriceFilter = () => {
    setMinPrice("");
    setMaxPrice("");
    setErrors({ min: "", max: "" });

    const params = new URLSearchParams(window.location.search);
    params.delete("min");
    params.delete("max");

    navigate(`/?${params.toString()}`, { replace: true });
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
                    onChange={(e) => setMinPrice(e.target.value)}
                    className={`bg-[#F5F5F5] h-[49px] w-full px-4 rounded-[12px] outline-none ${
                      errors.min ? "border border-red-500" : ""
                    }`}
                  />
                  {errors.min && (
                    <p className="text-xs text-red-500 mt-1">{errors.min}</p>
                  )}
                </div>

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
                    onChange={(e) => setMaxPrice(e.target.value)}
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
