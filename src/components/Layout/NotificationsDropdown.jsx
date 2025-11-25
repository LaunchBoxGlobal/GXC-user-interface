import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import Loader from "../Common/Loader";

const NotificationsDropdown = ({ isScrolled }) => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  // ----------------- Fetch Notifications -----------------
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/user/get-notifications?limit=1000`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const data = res.data?.notifications || [];

      console.log(res?.data);

      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.read).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // ----------------- Open Dropdown + Fetch -----------------
  const toggleDropdown = () => {
    const newState = !open;
    setOpen(newState);

    if (newState) {
      fetchNotifications();
    }
  };

  // ----------------- Close on outside click -----------------
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);

    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Button */}
      <button type="button" onClick={toggleDropdown} className="relative">
        <img
          src={
            isScrolled
              ? "/notification-icon.png"
              : "/notification-white-icon.svg"
          }
          alt="notification icon"
          className="min-w-[21px] h-[21px] relative top-1"
        />

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-medium px-1.5 py-0.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div className="absolute right-0 mt-3 w-72 bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden z-50">
          <div className="p-3 border-b bg-white text-gray-700 font-semibold text-start">
            Notifications
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="p-4 text-center text-gray-500 text-sm min-h-[320px] flex items-center justify-center">
              <Loader />
            </div>
          ) : notifications.length === 0 ? (
            // Empty State
            <div className="p-4 text-center text-gray-500 text-sm min-h-[320px] flex items-center justify-center">
              No notifications
            </div>
          ) : (
            // Notifications List
            <ul className="max-h-64 overflow-y-auto">
              {notifications?.map((notif, index) => (
                <li
                  key={index}
                  className={`p-3 text-sm border-b cursor-pointer hover:bg-gray-100 ${
                    !notif.read ? "bg-gray-50 font-medium" : "bg-white"
                  }`}
                >
                  <p>{notif.message}</p>
                  <span className="block text-xs text-gray-400 mt-1">
                    {notif?.createdAt || "Just now"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;
