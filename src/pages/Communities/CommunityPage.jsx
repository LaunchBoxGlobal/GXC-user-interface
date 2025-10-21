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

  // ✅ Fetch community details
  const fetchCommunityDetails = async () => {
    setFetchingCommunity(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/communities/${communityTitle}/details`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      setCommunity(res?.data?.data);
    } catch (error) {
      console.log(error);
      if (error?.response?.status === 404) {
        setNotFound(true);
      }
    } finally {
      setFetchingCommunity(false);
    }
  };

  // ✅ Check current membership
  const checkIamAlreadyMember = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/communities/${communityTitle}/my-membership`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      const isMember = res?.data?.data?.isMember;
      setAlreadyMember(isMember);

      const status = res?.data?.data?.membership?.status;
      setBlocked(status);

      return isMember;
    } catch (error) {
      console.log("membership error >>>>> ", error);
      handleApiError(error, navigate);
      return false;
    }
  };

  // ✅ Check if community allows joining
  const checkJoinStatus = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/communities/join-status/${communityTitle}`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      const canJoinStatus = res?.data?.data?.canJoin;
      setCanJoin(canJoinStatus);

      if (canJoinStatus) {
        setShowPopup(true);
      }
    } catch (error) {
      console.log("join-status error >>>>> ", error);
      setCanJoin(false);
    }
  };

  // ✅ Handle invite acceptance
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

      enqueueSnackbar("Welcome! You’ve joined the community 🎉", {
        variant: "success",
        autoHideDuration: 2000,
      });

      setShowPopup(false);
      navigate(`/?community=${communityTitle}`);
    } catch (error) {
      console.log("accept invitation error >>>>> ", error);
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

  // ✅ Init page logic
  useEffect(() => {
    if (!user) return; // wait until user context is ready

    const initCommunityPage = async () => {
      const isMember = await checkIamAlreadyMember();

      if (isMember) {
        await fetchCommunityDetails();
        navigate(`/?community=${communityTitle}`);
        setInitializing(false);
        return;
      }

      await checkJoinStatus();
      await fetchCommunityDetails();
      setInitializing(false);
    };

    initCommunityPage();
  }, [communityTitle, user]);

  const handleCancelInvitation = () => {
    setShowPopup(false);
    navigate("/");
  };

  // ✅ Render states
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
      <div className="w-full text-center h-screen py-40">
        <p>You’ve been blocked from this community.</p>
      </div>
    );
  }

  // ✅ Main Render
  return (
    <div className="p-5 min-h-screen">
      {/* Invitation Popup */}
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

      {/* Community Details */}
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
