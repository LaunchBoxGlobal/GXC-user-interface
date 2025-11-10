import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdKeyboardArrowRight } from "react-icons/md";

const ProfilerDropdown = ({ user }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("notifications");

  //   const toggleDropdown = () => setOpen((prev) => !prev);
  const toggleDropdown = () => navigate(`/profile/notifications`);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <button type="button" onClick={toggleDropdown}>
      <div className="w-[55px] h-[55px] rounded-full overflow-hidden flex items-center justify-center hover:opacity-90 transition">
        <img
          src={
            user.profilePictureUrl
              ? user.profilePictureUrl
              : "/profile-icon.png"
          }
          alt="profile"
          className="w-full h-full object-cover"
        />
      </div>
    </button>
    // <div className="relative" ref={dropdownRef}>

    //   {open && (
    //     <div
    //       onClick={toggleDropdown}
    //       className="absolute right-0 mt-3 w-[220px] bg-white rounded-2xl p-4 custom-shadow z-[9999] animate-fadeIn"
    //     >
    //       <Link to={`/profile?tab=${activeTab}`}>
    //         <div className="border-gray-100 flex items-center gap-2">
    //           <img
    //             src={
    //               user?.profilePictureUrl
    //                 ? user.profilePictureUrl
    //                 : "/profile-icon.png"
    //             }
    //             alt="profile"
    //             className="w-10 h-10 object-cover"
    //           />
    //           <p className="text-sm font-semibold text-gray-800">
    //             {user?.fullName || "User Name"}
    //           </p>
    //         </div>
    //       </Link>

    //       <div className="w-full border my-3" />

    //       <ul className="text-sm text-gray-800">
    //         <li>
    //           <Link
    //             to="/settings"
    //             className="flex items-center gap-2 justify-between"
    //           >
    //             Settings
    //             <MdKeyboardArrowRight className="text-xl text-[var(--button-bg)]" />
    //           </Link>
    //         </li>
    //         <div className="w-full border my-3" />
    //         <li>
    //           <Link
    //             to="/privacy-policy"
    //             className="flex items-center gap-2 justify-between"
    //           >
    //             Profile
    //             <MdKeyboardArrowRight className="text-xl text-[var(--button-bg)]" />
    //           </Link>
    //         </li>
    //         <div className="w-full border my-3" />
    //         <li>
    //           <Link
    //             to="/terms-and-conditions"
    //             className="flex items-center gap-2 justify-between"
    //           >
    //             Terms & Conditions
    //             <MdKeyboardArrowRight className="text-xl text-[var(--button-bg)]" />
    //           </Link>
    //         </li>
    //         <div className="w-full border my-3" />
    //         <li>
    //           <button
    //             onClick={handleLogout}
    //             className="flex items-center gap-2 w-full text-left"
    //           >
    //             Logout
    //           </button>
    //         </li>
    //       </ul>
    //     </div>
    //   )}
    // </div>
  );
};

export default ProfilerDropdown;
