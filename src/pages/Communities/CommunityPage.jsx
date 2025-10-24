import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import Loader from "../../components/Common/Loader";
import CommunityDetails from "./CommunityDetails";
import { useAppContext } from "../../context/AppContext";
import { handleApiError } from "../../utils/handleApiError";
import Cookies from "js-cookie";
import { useUser } from "../../context/userContext";

const CommunityPage = () => {
  const { communityTitle } = useParams();
  const [showPopup, setShowPopup] = useState(false);
  const [canJoin, setCanJoin] = useState(null);
  const [fetchingCommunity, setFetchingCommunity] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alreadyMember, setAlreadyMember] = useState(false);
  const [community, setCommunity] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const { user } = useAppContext();
  const [notFound, setNotFound] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const navigate = useNavigate();
  const { fetchCommunities } = useUser();
  const [initialized, setInitialized] = useState(false);

  const fetchCommunityDetails = async () => {
    setFetchingCommunity(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/communities/${communityTitle}/details`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      // console.log("communityDetails >>> ", res?.data);
      setCommunity(res?.data?.data || null);
    } catch (error) {
      console.error(
        "fetchCommunityDetails error:",
        error?.response?.status,
        error?.message
      );
      if (error?.response?.status === 404) {
        setNotFound(true);
      } else if (error?.response?.status === 401) {
        // token problem — optional: clear and redirect to login
        Cookies.remove("userToken");
        Cookies.remove("user");
        navigate("/login");
      } else {
        // other errors: show message or ignore for now
        handleApiError(error, navigate);
      }
    } finally {
      setFetchingCommunity(false);
    }
  };

  // Check current membership (defensive)
  const checkIamAlreadyMember = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/communities/${communityTitle}/my-membership`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      const data = res?.data?.data || {};
      // Coerce to boolean
      const isMember = !!data?.isMember;
      setAlreadyMember(isMember);

      // membership may be null — guard it
      if (data?.membership?.status === "banned") {
        setBlocked(data.membership.status);
      } else if (data?.membership?.status === "removed") {
        setBlocked(data.membership.status);
      } else {
        setBlocked(false);
      }

      return isMember;
    } catch (error) {
      console.error(
        "membership error >>>>> ",
        error?.response?.status,
        error?.message
      );
      // If unauthorized, force re-login
      if (error?.response?.status === 401) {
        Cookies.remove("userToken");
        Cookies.remove("user");
        navigate("/login");
        return false;
      }

      // If 404 or other, treat as "not member" (do NOT redirect)
      if (error?.response?.status === 404) {
        return false;
      }

      // For other errors, log and treat as not member
      return false;
    }
  };

  // Check if community allows joining
  const checkJoinStatus = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/communities/join-status/${communityTitle}`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      const data = res?.data?.data || {};
      const canJoinStatus = !!data?.canJoin;
      setCanJoin(canJoinStatus);

      return canJoinStatus;
    } catch (error) {
      console.error(
        "join-status error >>>>> ",
        error?.response?.status,
        error?.message
      );
      // If status check fails, assume cannot join
      setCanJoin(false);
      return false;
    }
  };

  // Accept invite
  const handleAcceptInvite = async () => {
    if (!canJoin) {
      enqueueSnackbar("Community is not accepting new members anymore!", {
        variant: "info",
        autoHideDuration: 1500,
      });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/communities/${communityTitle}/join`,
        { slug: communityTitle },
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      const membership = res?.data?.data?.membership;
      if (!membership) {
        throw new Error("Failed to get joined community data");
      }

      const communitiesRes = await axios.get(
        `${BASE_URL}/communities/my-joined`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      const allCommunities = communitiesRes?.data?.data?.communities || [];

      // ✅ Find the exact joined community by ID
      const joinedCommunity = allCommunities.find(
        (c) => c.id === membership.communityId
      );

      if (joinedCommunity) {
        // ✅ Save selected community in cookie
        Cookies.set("selected-community", JSON.stringify(joinedCommunity));

        enqueueSnackbar(
          `Welcome! You’ve joined the community "${joinedCommunity.name}" 🎉`,
          { variant: "success", autoHideDuration: 2000 }
        );

        // ✅ Navigate to home with community param
        navigate(`/?community=${joinedCommunity.slug}`, { replace: true });
      } else {
        enqueueSnackbar("Joined community not found in your list!", {
          variant: "warning",
        });
      }

      setShowPopup(false);
    } catch (error) {
      console.error(
        "accept invitation error >>>>> ",
        error?.response?.status,
        error?.message
      );
      if (error?.response?.status === 401) {
        Cookies.remove("userToken");
        Cookies.remove("user");
        navigate("/login");
      } else {
        enqueueSnackbar(error?.response?.data?.message || error?.message, {
          variant: "error",
          autoHideDuration: 2000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || initialized) return;
    setInitialized(true);

    const initCommunityPage = async () => {
      await fetchCommunityDetails();

      const isMember = await checkIamAlreadyMember();

      if (isMember) {
        navigate(`/?community=${communityTitle}`);
        setInitializing(false);
        return;
      }

      const canJoinStatus = await checkJoinStatus();

      if (!isMember && canJoinStatus) {
        setShowPopup(true);
      } else if (isMember) {
        navigate(`/?community=${communityTitle}`);
      }
      setShowPopup(canJoinStatus);

      setInitializing(false);
    };

    initCommunityPage();
  }, [communityTitle, user]);

  const handleCancelInvitation = () => {
    setShowPopup(false);
    navigate("/");
  };

  // Render states
  if (initializing || fetchingCommunity) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (notFound && !fetchingCommunity) {
    return (
      <div className="min-h-screen flex items-start justify-center text-center padding-x pt-20">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Community Not Found
          </h2>
          <p className="text-gray-600">
            The community you’re trying to access doesn’t exist or has been
            removed.
          </p>
        </div>
      </div>
    );
  }

  if (blocked && blocked === "banned") {
    return (
      <div className="w-full text-center h-screen py-80">
        <p>You’ve been blocked from this community.</p>
      </div>
    );
  }

  return (
    <div className="p-5 min-h-screen">
      {showPopup && canJoin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#fff] p-8 rounded-[32px] shadow-lg max-w-[471px] w-full text-center">
            <img
              src="/invitation-popup-icon.png"
              alt="invitation-popup-icon"
              className="w-[107px] h-[107px] mx-auto"
            />
            <h2 className="text-lg lg:text-[32px] font-semibold my-4 leading-[1.2]">
              You’ve Been Invited to Join a Community!
            </h2>
            {community?.owner?.fullName && (
              <p className="mb-4">
                <span className="font-medium">{community.owner.fullName}</span>{" "}
                has invited you to join this community. Would you like to
                accept?
              </p>
            )}
            <div className="w-full grid grid-cols-2 gap-3">
              <button
                onClick={handleCancelInvitation}
                className="w-full px-4 py-3 rounded-lg bg-[#EAEAEA]"
              >
                Cancel
              </button>
              <button
                onClick={handleAcceptInvite}
                className="w-full px-4 py-3 rounded-lg bg-[#4E9D4B] text-white"
              >
                {loading ? <Loader /> : "Accept"}
              </button>
            </div>
          </div>
        </div>
      )}

      {!showPopup && (
        <CommunityDetails
          community={community}
          canJoin={canJoin}
          loading={loading}
          setLoading={setLoading}
          communityTitle={communityTitle}
        />
      )}
    </div>
  );
};

export default CommunityPage;
