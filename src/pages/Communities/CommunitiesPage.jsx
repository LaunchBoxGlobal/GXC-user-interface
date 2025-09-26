import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CommunitiesPage = () => {
  const { communityTitle } = useParams();

  const [showPopup, setShowPopup] = useState(false);
  const [hasAccepted, setHasAccepted] = useState(false);

  useEffect(() => {
    const key = `invite-${communityTitle}`;
    const alreadyAccepted = localStorage.getItem(key);

    if (alreadyAccepted) {
      setHasAccepted(true);
      setShowPopup(false);
    } else {
      setShowPopup(true);
    }
  }, [communityTitle]);

  const handleAccept = () => {
    const key = `invite-${communityTitle}`;
    localStorage.setItem(key, "accepted");

    setHasAccepted(true);
    setShowPopup(false);
  };
  return (
    <div className="p-5">
      {/* Popup Modal */}
      {showPopup && !hasAccepted && (
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
                onClick={handleAccept}
                className="w-full px-4 py-3 rounded-lg bg-[#4E9D4B] text-white"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Community Details */}
      {hasAccepted ? (
        <div className="w-full padding-x min-h-screen">
          <h1 className="text-2xl font-bold">Welcome to {communityTitle} 🎉</h1>
          <p>Here are the details of the community...</p>
        </div>
      ) : (
        !showPopup && (
          <div>
            <h1 className="text-2xl font-bold">Community: {communityTitle}</h1>
            <p>General community details.</p>
          </div>
        )
      )}
    </div>
  );
};

export default CommunitiesPage;
