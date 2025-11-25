import { useEffect, useRef, useState } from "react";
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

      const data = res.data?.data?.notifications || [];

      console.log(res?.data?.data?.notifications);

      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.read).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = () => {
    const newState = !open;
    setOpen(newState);

    if (newState) {
      fetchNotifications();
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);

    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const formatDateTime = (isoString) => {
    if (!isoString) return "";

    const date = new Date(isoString);

    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short", // "Jan", "Feb", ...
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
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

        {/* {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-medium px-1.5 py-0.5 rounded-full">
            {unreadCount}
          </span>
        )} */}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-60 lg:w-96 bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden z-50">
          <div className="p-3 border-b bg-white text-gray-700 font-semibold text-start">
            Notifications
          </div>

          {loading ? (
            <div className="p-4 text-center text-gray-500 text-sm min-h-[320px] flex items-center justify-center">
              <Loader />
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm min-h-[320px] flex items-center justify-center">
              No notifications
            </div>
          ) : (
            <ul className="max-h-96 overflow-y-auto">
              {notifications?.map((notif, index) => (
                <li
                  key={index}
                  className={`p-3 text-start border-b cursor-pointer hover:bg-gray-100 ${
                    !notif.is_read ? "bg-gray-50 font-medium" : "bg-white"
                  }`}
                >
                  <p className="text-xs">{notif.body}</p>
                  <span className="block text-xs text-gray-400 mt-1">
                    {formatDateTime(notif?.created_at) || "Just now"}
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
