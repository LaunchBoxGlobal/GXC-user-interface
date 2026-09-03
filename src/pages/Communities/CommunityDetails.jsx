import React from "react";
import Loader from "../../components/Common/Loader";
import { enqueueSnackbar } from "notistack";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "i18next";

const CommunityDetails = ({
  community,
  canJoin,
  setLoading,
  loading,
  communityTitle,
  errorMessage,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation(`community`);

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
          headers: { "Accept-Language": i18n.language, Authorization: `Bearer ${getToken()}` },
        },
      );

      if (res?.data?.success) {
        // console.log("accept invitation res >>>>> ", res?.data);

        localStorage.setItem(`invite-${communityTitle}`, "accepted");
        // Cookies.set('selected-community', JSON.stringify())

        enqueueSnackbar("Welcome! You’ve joined the community 🎉", {
          variant: "success",
          autoHideDuration: 2000,
        });
        navigate(`/?community=${communityTitle}`);
      }
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
                {t(`communities.headings.community`)}:{" "}
                {community?.community?.name}
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
                `${t(`communities.buttons.joinCommunity`)}`
              ) : (
                `${t(`communities.buttons.communityDisabled`)}`
              )}
            </button>
          </div>
          {community && (
            <p className="mt-4">{community?.community?.description}</p>
          )}
          {community && (
            <p>
              {t(`communities.headings.totalMembers`)}:{" "}
              {community?.community?.memberCount}
            </p>
          )}
        </>
      ) : (
        <div className="w-full flex justify-center pt-20 text-center">
          <p className="text-center text-lg font-medium">{errorMessage}</p>
        </div>
      )}
    </div>
  );
};

export default CommunityDetails;
