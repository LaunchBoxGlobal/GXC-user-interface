import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { BASE_URL } from "../data/baseUrl";
import { getToken } from "../utils/getToken";
import { handleApiError } from "../utils/handleApiError";
import { useNavigate, useSearchParams } from "react-router-dom";
import { enqueueSnackbar } from "notistack";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [isBlocked, setIsBlocked] = useState(false);
  const [checking, setChecking] = useState(false);
  const [communities, setCommunities] = useState([]);
  const [selected, setSelected] = useState(null);
  const [selectedCommunity, setSelectedCommunity] = useState(
    Cookies.get("selected-community")
      ? JSON.parse(Cookies.get("selected-community"))
      : null
  );

  const communityFromQuery = searchParams.get("community");

  /** 🧩 Fetch user’s joined communities */
  const fetchCommunities = async () => {
    const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;
    const token = getToken();
    if (!user) return;
    if (!token) return;
    try {
      const res = await axios.get(`${BASE_URL}/communities/my-joined`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      const list = res?.data?.data?.communities || [];
      setCommunities(list);

      if (list.length === 0) {
        Cookies.remove("selected-community");
        setSelected(null);
        navigate({
          pathname: "/",
          search: window?.location?.search || "",
        });
        return;
      }

      // ✅ Get selected community from cookie (if available)
      const cookieCommunity = Cookies.get("selected-community")
        ? JSON.parse(Cookies.get("selected-community"))
        : null;

      // ✅ Try to match query community if exists
      const matched =
        communityFromQuery &&
        list.find(
          (c) =>
            c.slug?.toLowerCase() === communityFromQuery.toLowerCase() ||
            c.name?.toLowerCase() === communityFromQuery.toLowerCase()
        );

      // ✅ Determine final selected community
      let selectedCommunity = matched || cookieCommunity || list[0];

      // ✅ If cookie exists but user no longer in it → fallback
      if (cookieCommunity && !list.find((c) => c.id === cookieCommunity.id)) {
        selectedCommunity = list[0];
      }

      // ✅ Update state + cookies
      setSelected(selectedCommunity);
      Cookies.set("selected-community", JSON.stringify(selectedCommunity));

      setSelectedCommunity(selectedCommunity);
    } catch (error) {
      console.error("Error fetching communities:", error);
      handleApiError(error, navigate);
    }
  };

  /** 🧩 Check if user is still a member of selected community */
  const checkIamAlreadyMember = async () => {
    const community = Cookies.get("selected-community")
      ? JSON.parse(Cookies.get("selected-community"))
      : null;
    const token = getToken();

    if (!community) return;
    if (!token) return;

    try {
      setChecking(true);
      const res = await axios.get(
        `${BASE_URL}/communities/${community.slug}/my-membership`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      const membership = res?.data?.data?.membership;
      const status = membership?.status;

      if (status === "removed") {
        enqueueSnackbar("You’ve been removed from this community.", {
          variant: "error",
          autoHideDuration: 3000,
        });

        fetchCommunities();
        navigate(`/`);
      } else if (status === "banned") {
        enqueueSnackbar("You've been blocked from this community.", {
          variant: "error",
          autoHideDuration: 3000,
        });

        fetchCommunities();
        navigate(`/`);
      } else {
        setIsBlocked(false);
      }
      setIsBlocked(false);
    } catch (error) {
      console.log("checkIamAlreadyMember error >>> ", error);
      // handleApiError(error, navigate);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    // fetchCommunities();
    const init = async () => {
      await fetchCommunities();
      await checkIamAlreadyMember();
    };
    init();

    // const interval = setInterval(checkIamAlreadyMember, 30000);
    // return () => clearInterval(interval);
  }, []);

  return (
    <UserContext.Provider
      value={{
        isBlocked,
        checking,
        communities,
        selected,
        fetchCommunities,
        checkIamAlreadyMember,
        selectedCommunity,
        setSelectedCommunity,
        setCommunities,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
