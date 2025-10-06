import axios from "axios";
import { useEffect } from "react";
import { BASE_URL } from "../../data/baseUrl";
import { useAppContext } from "../../context/AppContext";
import { Link, useNavigate } from "react-router-dom";
import { getToken } from "../../utils/getToken";
import SettingsLayout from "../../components/Layout/SettingsLayout";
import ChangePasswordPage from "./ChangePasswordPage";

const ProfilePage = () => {
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

  return (
    <div className="w-full relative padding-x ">
      <div className="w-full rounded-[15px] relative -top-24 bg-[#F7F7F7] p-4">
        <SettingsLayout page={<ChangePasswordPage />} />
      </div>
    </div>
  );
};

export default ProfilePage;
