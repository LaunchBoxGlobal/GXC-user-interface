import { useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import Cookies from "js-cookie";

const settingPages = [
  {
    title: "Notification",
    url: "notifications",
  },
  {
    title: "Pyament Method",
    url: "payment-methods",
  },
  {
    title: "Change Password",
    url: "change-password",
  },
  {
    title: "Delete Account",
    url: "delete-account",
  },
  {
    title: "Terms & Conditions",
    url: "terms-and-conditions",
  },
  {
    title: "Privacy Policy",
    url: "privacy-policy",
  },
];

const SettingsLayout = ({ page }) => {
  const location = useLocation();
  const { user, setUser } = useAppContext();
  const navigate = useNavigate();
  const { settingsTab } = useParams();

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      setUser(res?.data?.data?.user);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;

        switch (status) {
          case 401:
            console.error("Unauthorized: Token expired or invalid.");
            localStorage.removeItem("token");
            navigate("/login");
            break;

          case 403:
            console.error("Forbidden: You do not have access.");
            break;

          case 404:
            console.error("Profile not found.");
            break;

          case 500:
            console.error("Server error. Please try again later.");
            break;

          default:
            console.error(
              `Unexpected error: ${status} - ${
                error.response?.data?.message || error.message
              }`
            );
        }
      } else {
        console.error("Network or unexpected error:", error);
      }
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    const deviceInfo = navigator.userAgent;
    try {
      const res = await axios.post(
        `${BASE_URL}/auth/logout`,
        {
          deviceInfo,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (res?.data?.success) {
        // console.log("Logout successful");
        Cookies.remove("userToken");
        Cookies.remove("user");
        Cookies.remove("selected-community");
        Cookies.remove("page");
        Cookies.remove("userEmail");
        Cookies.remove("isUserEmailVerified");
        Cookies.remove("userSelectedPaymentMethod");
        Cookies.remove("userSelectedDeliveryMethod");
        Cookies.remove("userSelectedDeliveryAddress");
        Cookies.remove("newDeliveryAddress");
        localStorage.removeItem("fcmToken");
        localStorage.removeItem("invitation-link");
        localStorage.removeItem("userfcmToken");
        localStorage.removeItem("userBrowserDeviceId");
        navigate("/login");
      }
    } catch (error) {
      // console.log("Logout error >>>", error?.response?.data || error.message);
    } finally {
      Cookies.remove("userToken");
      Cookies.remove("user");
      Cookies.remove("selected-community");
      Cookies.remove("page");
      Cookies.remove("userEmail");
      Cookies.remove("isUserEmailVerified");
      Cookies.remove("userSelectedPaymentMethod");
      Cookies.remove("userSelectedDeliveryMethod");
      Cookies.remove("userSelectedDeliveryAddress");
      Cookies.remove("newDeliveryAddress");
      localStorage.removeItem("fcmToken");
      localStorage.removeItem("invitation-link");
      localStorage.removeItem("userfcmToken");
      localStorage.removeItem("userBrowserDeviceId");
      navigate("/login");
    }
  };

  return (
    <div className="w-full rounded-[10px] relative">
      <div className="w-full bg-white p-5 flex items-center justify-between flex-wrap rounded-[15px] gap-5 custom-shadow">
        <div className="w-full md:max-w-[50%] flex items-start lg:items-center gap-3">
          <div className="">
            {user?.profilePictureUrl ? (
              <img
                className="w-[54px] min-w-[54px] min-h-[54px] lg:w-[116px] lg:max-w-[116px] lg:max-h-[116px] lg:h-[116px] rounded-full object-cover object-center"
                src={user?.profilePictureUrl}
                alt="user profile picture"
              />
            ) : (
              <img
                className="lg:h-[116px] min-w-[54px] h-[54px] lg:max-w-[116px] rounded-full object-cover object-center"
                src={"/profile-icon.png"}
                alt="user profile picture"
              />
            )}
          </div>
          <div className="space-y-2">
            <h2 className="text-[22px] lg:text-[32px] font-semibold leading-[1]">
              {user?.fullName}
            </h2>
            {user?.email && (
              <p className="text-sm lg:text-base font-medium text-[#565656]">
                {user?.email}
              </p>
            )}
          </div>
        </div>

        <div className="">
          <Link
            to={`/edit-profile`}
            className="button px-10  h-[58px] flex items-center justify-center"
          >
            Edit Profile
          </Link>
        </div>
      </div>

      <div className="w-full mt-5 min-h-[50vh] flex flex-col lg:flex-row items-start lg:justify-between bg-white rounded-[12px] custom-shadow">
        <div className="w-full lg:w-[25%] lg:min-h-[90vh] border-r px-8 pt-5 overflow-hidden relative">
          <div className="w-full flex items-center justify-between">
            <h2 className="text-[22px] lg:text-[28px] font-semibold">
              Settings
            </h2>
            <button
              type="button"
              onClick={() => handleLogout()}
              className={`text-sm font-medium px-4 h-[39px] lg:hidden outline-none bg-[var(--button-bg)] text-white rounded-[12px] max-w-[120px] text-center`}
            >
              Logout
            </button>
          </div>
          <ul className="w-full flex lg:flex-col mt-5 overflow-auto">
            {settingPages?.map((link, index) => {
              return (
                <li
                  className={`w-full text-black h-[50px] border-b`}
                  key={index}
                >
                  <button
                    // to={link?.url}
                    onClick={() => navigate(`/profile/${link?.url}`)}
                    className={`text-sm flex items-center gap-x-2.5 px-4 font-medium w-full h-[49px] outline-none ${
                      link?.url === settingsTab && "bg-gray-100"
                    } whitespace-nowrap`}
                  >
                    <span className="">{link?.title}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <button
            type="button"
            onClick={() => handleLogout()}
            className={`text-sm font-medium w-full h-[49px] outline-none hidden lg:block absolute bottom-5 left-8 bg-[var(--button-bg)] text-white rounded-[12px] max-w-[120px] text-center`}
          >
            Logout
          </button>
        </div>
        <div className="w-full lg:w-[72%] pt-5 pr-5 pb-5 pl-5 lg:pl-0">
          {page}
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;
