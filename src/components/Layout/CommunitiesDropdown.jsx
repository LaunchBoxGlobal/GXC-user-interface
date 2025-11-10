import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { handleApiError } from "../../utils/handleApiError";
import { TiArrowSortedDown } from "react-icons/ti";
import { useAppContext } from "../../context/AppContext";
import Cookies from "js-cookie";
import { useCart } from "../../context/cartContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import SearchFilterBox from "./SearchFilterBox";
import { useUser } from "../../context/userContext";

const CommunitiesDropdown = () => {
  const { setProductSearchValue } = useAppContext();

  const {
    setSelectedCommunity,
    selectedCommunity,
    communities,
    setCommunities,
  } = useUser();

  const { fetchCartCount } = useCart();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [searchParams] = useSearchParams();

  const communityFromQuery = searchParams.get("community");
  const searchFromQuery = searchParams.get("search") || "";

  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [searchValue, setSearchValue] = useState(searchFromQuery);
  const [searchCommunityValue, setSearchCommunityValue] = useState("");
  const [filteredCommunities, setFilteredCommunities] = useState([]);

  const [openPriceFilter, setOpenPriceFilter] = useState(false);
  const handleTogglePriceFilter = () => setOpenPriceFilter((prev) => !prev);

  // 1️⃣ Keep fetchCommunities focused only on data fetching
  // const fetchCommunities = async () => {
  //   try {
  //     const res = await axios.get(
  //       `${BASE_URL}/communities/my-joined${
  //         searchCommunityValue ? `?search=${searchCommunityValue}` : ""
  //       }`,
  //       {
  //         headers: { Authorization: `Bearer ${getToken()}` },
  //       }
  //     );

  //     if (
  //       res?.data?.data?.communities?.length == 0 ||
  //       res?.data?.data?.communities == null
  //     ) {
  //       Cookies.remove("selected-community");
  //     }
  //     const list = res?.data?.data?.communities || [];
  //     setCommunities(list);
  //     setFilteredCommunities(list);
  //     fetchCartCount();
  //   } catch (error) {
  //     handleApiError(error, navigate);
  //   }
  // };
  const fetchCommunities = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/communities/my-joined${
          searchCommunityValue ? `?search=${searchCommunityValue}` : ""
        }`,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );

      const list = res?.data?.data?.communities || [];

      if (!list.length) {
        Cookies.remove("selected-community");
      }

      setCommunities(list);
      setFilteredCommunities(list);

      fetchCartCount?.(); // optional, safe call if function exists
    } catch (error) {
      handleApiError(error, navigate);
    }
  };

  // 2️⃣ Separate effect to handle selection logic
  useEffect(() => {
    if (!communities.length || searchCommunityValue) return;

    const cookieCommunity = Cookies.get("selected-community")
      ? JSON.parse(Cookies.get("selected-community"))
      : null;

    const matched =
      communityFromQuery &&
      communities.find(
        (c) =>
          c.slug?.toLowerCase() === communityFromQuery.toLowerCase() ||
          c.name?.toLowerCase() === communityFromQuery.toLowerCase()
      );

    let selectedC = null;

    // 🥇 Priority: query param
    if (matched) {
      selectedC = matched;
    }
    // 🥈 Then cookie (if still valid)
    else if (
      cookieCommunity &&
      communities.some((c) => c.id === cookieCommunity.id)
    ) {
      selectedC = cookieCommunity;
    }
    // 🥉 Then previous selected (if still valid)
    else if (selected && communities.some((c) => c.id === selected.id)) {
      selectedC = selected;
    }
    // 🏁 Fallback
    else {
      selectedC = communities[0];
    }

    // ✅ Only update if actually change
    if (!selectedCommunity || selectedCommunity.id !== selectedC.id) {
      setSelected(selectedC);
      setSelectedCommunity(selectedC);
      Cookies.set("selected-community", JSON.stringify(selectedC));

      const params = new URLSearchParams(window.location.search);
      params.set("community", selectedC.slug);
      navigate({
        pathname: "/",
        search: `?${params.toString()}`,
      });
    }
  }, [communities, communityFromQuery, searchCommunityValue]);

  useEffect(() => {
    fetchCommunities();
  }, [communityFromQuery, searchCommunityValue]);

  useEffect(() => {
    setProductSearchValue(searchFromQuery);
  }, [searchFromQuery]);

  useEffect(() => {
    if (selectedCommunity) setSelected(selectedCommunity);
  }, [selectedCommunity]);

  const handleCommunitySearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchCommunityValue(value);

    if (!value) {
      // reset list when cleared
      setFilteredCommunities(communities);
    } else {
      const filtered = communities.filter((c) =>
        c.name.toLowerCase().includes(value)
      );
      setFilteredCommunities(filtered);
    }
  };

  const handleSelect = (c) => {
    setSelected(c);
    setIsOpen(false);
    Cookies.set("selected-community", JSON.stringify(c));
    setSelectedCommunity(c);

    navigate(
      `/?community=${c.slug}${searchValue ? `&search=${searchValue}` : ""}`,
      { replace: true }
    );
  };

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full relative flex flex-col md:flex-row gap-y-5 items-center justify-between gap-2">
      {/* Dropdown */}
      <div className="relative w-full max-w-[471px]" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => {
            // e.stopPropagation();
            setIsOpen((prev) => !prev);
          }}
          className="flex items-center gap-4 bg-transparent text-white font-semibold text-[24px] lg:text-[32px] leading-none outline-none"
        >
          {selectedCommunity ? selectedCommunity.name : "Select Community"}
          <TiArrowSortedDown
            className={`transition-transform leading-none ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown list */}
        {isOpen && (
          <ul className="absolute mt-2 bg-white rounded-[16px] lg:rounded-[32px] shadow-lg border border-gray-200 z-50 w-full max-w-[471px] pt-6 px-6 pb-2">
            {/* Search inside dropdown */}
            <div className="w-full h-[49px] flex items-center rounded-[19px] px-4 gap-2 bg-white custom-shadow mb-2">
              <img
                src="/gray-search-icon.png"
                alt="search icon"
                className="min-w-[17px] h-[16px]"
              />
              <input
                type="text"
                placeholder="Search community"
                className="w-full border-none outline-none bg-transparent text-[15px] font-normal text-[#787878] placeholder:text-[#787878]"
                value={searchCommunityValue}
                onChange={handleCommunitySearch}
              />
            </div>

            {/* List communities */}
            {filteredCommunities.length > 0 ? (
              filteredCommunities.map((c) => (
                <li
                  key={c.id}
                  className="cursor-pointer text-gray-800 py-3 w-full flex items-center justify-between gap-3 border-b last:border-0"
                  onClick={() => handleSelect(c)}
                >
                  <label
                    htmlFor={`community-${c.id}`}
                    className="w-full max-w-[80%] break-words cursor-pointer"
                  >
                    {c.name}
                  </label>
                  <input
                    type="radio"
                    name="community"
                    id={`community-${c.id}`}
                    checked={selected?.id === c.id}
                    readOnly
                    className="w-[17px] h-[17px]"
                  />
                </li>
              ))
            ) : (
              <p className="text-gray-500 text-sm text-center py-3">
                Community not found
              </p>
            )}
          </ul>
        )}
      </div>

      {/* Search + Price Filters */}
      <SearchFilterBox
        handleTogglePriceFilter={handleTogglePriceFilter}
        openPriceFilter={openPriceFilter}
        setOpenPriceFilter={setOpenPriceFilter}
      />
    </div>
  );
};

export default CommunitiesDropdown;
