import React from "react";
import Loader from "../../components/Common/Loader";
import { enqueueSnackbar } from "notistack";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CommunityDetails = ({
  community,
  canJoin,
  setLoading,
  loading,
  communityTitle,
}) => {
  const navigate = useNavigate();

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

      localStorage.setItem(`invite-${communityTitle}`, "accepted");

      enqueueSnackbar("Welcome! You’ve joined the community 🎉", {
        variant: "success",
        autoHideDuration: 2000,
      });
      navigate(`/?community=${communityTitle}`);
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
    <div className="w-full padding-x min-h-screen">
      {canJoin ? (
        <>
          <div className="w-full flex items-center justify-between">
            {community && (
              <h1 className="text-2xl font-bold">
                Community: {community?.community?.name}
              </h1>
            )}

            <button
              onClick={handleAcceptInvite}
              disabled={!!community}
              className="w-full px-4 py-3 rounded-lg bg-[#4E9D4B] text-white max-w-[170px] disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader />
              ) : canJoin ? (
                "Join Community"
              ) : (
                "Community is diabled by the owner"
              )}
            </button>
          </div>
          {community && (
            <p className="mt-4">{community?.community?.description}</p>
          )}
          {community && (
            <p>Total Member: {community?.community?.memberCount}</p>
          )}
        </>
      ) : (
        <div className="w-full flex justify-center pt-20 text-center">
          <p className="text-center text-lg font-medium">
            Community joining is currently disabled
          </p>
        </div>
      )}
    </div>
  );
};

export default CommunityDetails;
