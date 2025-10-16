import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { handleApiError } from "../../utils/handleApiError";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { TiArrowSortedDown } from "react-icons/ti";
import { useAppContext } from "../../context/AppContext";
import Cookies from "js-cookie";

const CommunitiesDropdown = () => {
  const {
    communities,
    setCommunities,
    setProductSearchValue,
    selectedCommunity,
  } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const communityFromQuery = searchParams.get("community");
  const searchFromQuery = searchParams.get("search") || "";

  const [selected, setSelected] = useState(null);
  const [searchValue, setSearchValue] = useState(searchFromQuery);
  setProductSearchValue(searchFromQuery);

  const fetchCommunities = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/communities/my-joined`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const list = res?.data?.data?.communities || [];
      setCommunities(list);

      if (list.length > 0) {
        const matched =
          communityFromQuery &&
          list.find(
            (c) =>
              c.slug?.toLowerCase() === communityFromQuery.toLowerCase() ||
              c.name?.toLowerCase() === communityFromQuery.toLowerCase()
          );

        const selectedCommunity = matched || list[0];
        setSelected(selectedCommunity);

        Cookies.set("selected-community", JSON.stringify(selectedCommunity));

        if (!communityFromQuery) {
          setTimeout(() => {
            navigate(`/?community=${selectedCommunity.slug}`, {
              replace: true,
            });
          }, 50);
        }
      }
    } catch (error) {
      console.log("Error fetching communities:", error);
      handleApiError(error, navigate);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, [communityFromQuery]);

  // ✅ Handle selecting community
  const handleSelect = (c) => {
    setSelected(c);
    setIsOpen(false);
    Cookies.set("selected-community", JSON.stringify(c));
    navigate(
      `/?community=${c.slug}${searchValue ? `&search=${searchValue}` : ""}`,
      { replace: true }
    );
  };

  // ✅ Handle search input changes
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    // Update query params dynamically
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    navigate(`/?${params.toString()}`, { replace: true });
  };

  return (
    communities.length > 0 && (
      <div className="w-full relative flex flex-col md:flex-row gap-y-5 items-center justify-between gap-2">
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="flex items-center gap-4 bg-transparent text-white font-semibold text-[24px] lg:text-[32px] leading-none outline-none"
          >
            {selected ? selected.name : "Select Community"}
            <TiArrowSortedDown
              className={`transition-transform leading-none ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isOpen && (
            <ul className="absolute mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              {communities.map((c) => (
                <li
                  key={c.id}
                  className={`px-4 py-2 cursor-pointer text-gray-800 hover:bg-gray-100 rounded-lg ${
                    selected?.id === c.id ? "bg-gray-100 font-semibold" : ""
                  }`}
                  onClick={() => handleSelect(c)}
                >
                  {c.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ✅ Search Input */}
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
      </div>
    )
  );
};

export default CommunitiesDropdown;
