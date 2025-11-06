import React from "react";
import { useSearchParams } from "react-router-dom";

const MemberHeader = ({ member, setShowMemberReportConfimationPopup }) => {
  const [searchParams] = useSearchParams();
  const isBuyer = searchParams.get("isBuyer");
  console.log("isBuyer >> ", isBuyer);
  return (
    <div className="w-full bg-white rounded-[18px] relative p-5">
      <div className="w-full flex items-center justify-between flex-wrap gap-y-7">
        <div className="flex items-center gap-3">
          <div className="w-[136px] h-[136px] rounded-full border border-[var(--button-bg)] p-1.5">
            {member?.profilePictureUrl ? (
              <img
                src={member?.profilePictureUrl}
                alt=""
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <img
                src={`/profile-icon.png`}
                alt=""
                className="w-full h-full rounded-full object-cover"
              />
            )}
          </div>
          <div className="">
            <p className="text-[24px] lg:text-[32px] font-semibold">
              {member?.fullName}
            </p>
            <p className=""></p>
          </div>
        </div>
        {!isBuyer && (
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => setShowMemberReportConfimationPopup(true)}
              className="button min-w-[214px]"
            >
              Report User
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberHeader;
