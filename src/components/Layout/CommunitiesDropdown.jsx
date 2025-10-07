import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { handleApiError } from "../../utils/handleApiError";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { TiArrowSortedDown } from "react-icons/ti";

const CommunitiesDropdown = () => {
  const [communities, setCommunities] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const communityFromQuery = searchParams.get("community");
  const [selected, setSelected] = useState(null);

  // 🔹 Fetch joined communities
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
        // Try matching community from query param
        const matched =
          communityFromQuery &&
          list.find(
            (c) =>
              c.slug?.toLowerCase() === communityFromQuery.toLowerCase() ||
              c.name?.toLowerCase() === communityFromQuery.toLowerCase()
          );

        // Set matched one or fallback to first
        setSelected(matched || list[0]);

        // If no match found and no param — set param to first one
        if (!communityFromQuery && list[0]) {
          navigate(`/?community=${list[0].slug}`, { replace: true });
        }
      }
    } catch (error) {
      console.log("err while fetching my communities >> ", error);
      handleApiError(error, navigate);
    }
  };

  // 🔹 Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔹 Fetch communities when component mounts or query changes
  useEffect(() => {
    fetchCommunities();
  }, [communityFromQuery]);

  // 🔹 Handle selecting a new community
  const handleSelect = (c) => {
    setSelected(c);
    setIsOpen(false);
    navigate(`/?community=${c.slug}`, { replace: true });
  };

  console.log(selected);

  return (
    communities.length > 0 && (
      <div className="w-full relative flex items-center justify-between gap-2">
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="flex items-center gap-4 bg-transparent text-white font-semibold text-[32px] leading-none outline-none"
          >
            {selected ? selected.name : "Select Community"}
            <TiArrowSortedDown
              className={`transition-transform leading-none ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown list */}
          {isOpen && (
            <ul className="absolute mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              {communities.map((c) => (
                <li
                  key={c.id}
                  className={`px-4 py-2 cursor-pointer text-gray-800 hover:bg-gray-100 ${
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
        <Link
          to={`/products/add-product?community=${selected?.slug}`}
          className={`w-[130px] lg:w-[214px] h-[58px] bg-white flex items-center justify-center text-sm lg:text-lg font-medium rounded-[12px] text-[var(--button-bg)]`}
        >
          Add Product
        </Link>
      </div>
    )
  );
};

export default CommunitiesDropdown;
