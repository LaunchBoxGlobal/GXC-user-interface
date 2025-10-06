import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { handleApiError } from "../../utils/handleApiError";
import { useNavigate } from "react-router-dom";
import { IoChevronDown } from "react-icons/io5";
import { TiArrowSortedDown } from "react-icons/ti";

const CommunitiesDropdown = () => {
  const [communities, setCommunities] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

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
        setSelected(list[0]); // default to first community
      }
    } catch (error) {
      console.log("err while fetching my communities >> ", error);
      handleApiError(error, navigate);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchCommunities();
  }, []);

  return (
    communities.length > 0 && (
      <div className="relative" ref={dropdownRef}>
        {/* Dropdown button */}
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
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800"
                onClick={() => {
                  setSelected(c);
                  setIsOpen(false);
                }}
              >
                {c.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  );
};

export default CommunitiesDropdown;
