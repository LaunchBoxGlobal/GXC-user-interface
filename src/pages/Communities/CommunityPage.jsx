import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import Loader from "../../components/Common/Loader";
import CommunityDetails from "./CommunityDetails";
import { useAppContext } from "../../context/AppContext";

const CommunityPage = () => {
  const { communityTitle } = useParams();
  const [showPopup, setShowPopup] = useState(false);
  const [hasAccepted, setHasAccepted] = useState(false);
  const [canJoin, setCanJoin] = useState(null);
  const [fetchingCommunity, setFetchingCommunity] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alreadyMember, setAlreadyMember] = useState(null);
  const [community, setCommunity] = useState(null);
  const { user } = useAppContext();

  const fetchCommunityDetails = async () => {
    setFetchingCommunity(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/communities/${communityTitle}/details`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      setCommunity(res?.data?.data);
    } catch (error) {
      console.log(error);
      handleApiError(error, navigate);
    } finally {
      setFetchingCommunity(false);
    }
  };

  useEffect(() => {
    const initCommunityPage = async () => {
      const key = `invite-${communityTitle} ${user?.id}`;
      const alreadyAccepted = localStorage.getItem(key);
      if (alreadyAccepted) setHasAccepted(true);

      // 🔹 2. Check membership
      const isMember = await checkIamAlreadyMember();
      if (isMember) {
        setAlreadyMember(true);
        // fetch details after membership is confirmed
        await fetchCommunityDetails();
        return;
      }

      // 🔹 3. Not a member → check join status
      await checkJoinStatus();

      // 🔹 4. Finally fetch community details
      await fetchCommunityDetails();
    };

    initCommunityPage();
  }, [communityTitle]);

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
      return isMember;
    } catch (error) {
      console.log("membership error >>>>> ", error);
      enqueueSnackbar(error?.response?.data?.message || error?.message, {
        variant: "error",
        autoHideDuration: 1500,
      });
      return false;
    }
  };

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

      // Show popup only if not accepted yet and joinable
      if (
        !localStorage.getItem(`invite-${communityTitle} ${user?.id}}`) &&
        canJoinStatus
      ) {
        setShowPopup(true);
      }
    } catch (error) {
      console.log("join-status error >>>>> ", error);
      enqueueSnackbar(error?.response?.data?.message || error?.message, {
        variant: "error",
        autoHideDuration: 1500,
      });
      setCanJoin(false);
    }
  };

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

      console.log("accept invitation res >>>>> ", res?.data);

      localStorage.setItem(`invite-${communityTitle} ${user?.id}`, "accepted");
      setHasAccepted(true);
      setShowPopup(false);

      enqueueSnackbar("Welcome! You’ve joined the community 🎉", {
        variant: "success",
        autoHideDuration: 2000,
      });
    } catch (error) {
      console.log("accept invitation error >>>>> ", error);
      enqueueSnackbar(error?.response?.data?.message || error?.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 min-h-screen">
      {/* Popup Modal */}
      {showPopup && !hasAccepted && canJoin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#D0E3D0] p-8 rounded-[32px] shadow-lg max-w-[471px] w-full text-center">
            <img
              src="/invitation-popup-icon.png"
              alt="invitation-popup-icon"
              className="w-[107px] h-[107px] mx-auto"
            />
            <h2 className="text-lg lg:text-[32px] font-semibold my-4 leading-[1.2]">
              You’ve Been Invited to Join a Community!
            </h2>
            <p className="mb-4">
              You’ve been invited to join this community. Would you like to
              accept?
            </p>
            <div className="w-full grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowPopup(false)}
                className="w-full px-4 py-3 rounded-lg bg-white"
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
      {alreadyMember ? (
        <div className="w-full padding-x min-h-screen">
          <h1 className="text-2xl font-bold">
            Welcome back to {communityTitle} 🎉
          </h1>
          <p>You are already a member of this community.</p>
        </div>
      ) : hasAccepted ? (
        <div className="w-full padding-x min-h-screen">
          <h1 className="text-2xl font-bold">Welcome to {communityTitle} 🎉</h1>
          <p>Here are the details of the community...</p>
        </div>
      ) : canJoin === false ? (
        <div className="w-full padding-x min-h-screen">
          <CommunityDetails
            community={community}
            canJoin={canJoin}
            loading={loading}
            setLoading={setLoading}
            communityTitle={communityTitle}
          />
        </div>
      ) : (
        !showPopup && (
          <CommunityDetails
            community={community}
            canJoin={canJoin}
            loading={loading}
            setLoading={setLoading}
            communityTitle={communityTitle}
          />
        )
      )}
    </div>
  );
};

export default CommunityPage;
