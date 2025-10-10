import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import Cookies from "js-cookie";

const settingPages = [
  {
    title: "Notification",
    url: "/profile",
  },
  {
    title: "Pyament Method",
    url: "/profile",
  },
  {
    title: "Change Password",
    url: "/profile",
  },
  {
    title: "Delete Account",
    url: "/profile",
  },
  {
    title: "Terms & Conditions",
    url: "/profile",
  },
  {
    title: "Privacy Policy",
    url: "/profile",
  },
];

const SettingsLayout = ({ page }) => {
  const location = useLocation();
  const { user, setUser } = useAppContext();
  const navigate = useNavigate();

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
    try {
      const res = await axios.post(
        `${BASE_URL}/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      if (res?.data?.success) {
        console.log("Logout successful");
      }
    } catch (error) {
      console.log("Logout error >>>", error?.response?.data || error.message);
    } finally {
      Cookies.remove("userToken");
      Cookies.remove("user");
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
                class="lg:h-[116px] min-w-[54px] h-[54px] lg:max-w-[116px] rounded-full object-cover object-center"
                src={user?.profilePictureUrl}
                alt="user profile picture"
              />
            ) : (
              <img
                class="lg:h-[116px] min-w-[54px] h-[54px] lg:max-w-[116px] rounded-full object-cover object-center"
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
        <div className="w-full lg:w-[25%] lg:min-h-[70vh] border-r px-8 pt-5 overflow-hidden">
          <h2 className="text-[28px] font-semibold">Settings</h2>
          <ul className="w-full flex lg:flex-col mt-5 overflow-auto">
            {settingPages?.map((link, index) => {
              return (
                <li
                  className={`w-full text-black h-[50px] border-b`}
                  key={index}
                >
                  <Link
                    to={link?.url}
                    className={`text-sm flex items-center gap-x-2.5 px-4 font-medium w-full h-[49px] outline-none ${
                      link?.title === "Change Password" && "bg-gray-100"
                    } whitespace-nowrap`}
                  >
                    <span className="">{link?.title}</span>
                  </Link>
                </li>
              );
            })}

            <button
              type="button"
              onClick={() => handleLogout()}
              className={`text-sm flex items-center gap-x-2.5 px-4 font-medium w-full h-[49px] outline-none hover:bg-gray-100 transition-all duration-300`}
            >
              Logout
            </button>
          </ul>
        </div>
        <div className="w-full lg:w-[72%] pt-5 pr-5 pb-5 pl-5 lg:pl-0">
          {page}
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;
