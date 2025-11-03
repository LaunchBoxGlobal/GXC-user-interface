import React from "react";

const MemberInfo = ({ member }) => {
  return (
    <div className="w-full bg-white rounded-[18px] relative p-5">
      <div className="w-full rounded-[18px] p-5 lg:p-7 bg-[var(--secondary-bg)]">
        <h2 className="text-[24px] font-semibold leading-none">User Details</h2>

        <div className="w-full border my-5" />

        <div className="w-full">
          <p className="text-sm text-[#565656] font-medium">Full Name</p>
          <p className="text-base text-[#181818] font-medium">
            {member && member?.fullName}
          </p>
        </div>

        {member && member?.email && (
          <>
            <div className="w-full border my-5" />

            <div className="w-full">
              <p className="text-sm text-[#565656] font-medium">
                Email Address
              </p>
              <p className="text-base text-[#181818] font-medium">
                {member && member?.email}
              </p>
            </div>
          </>
        )}

        {member && member?.phone && (
          <>
            <div className="w-full border my-5" />

            <div className="w-full">
              <p className="text-sm text-[#565656] font-medium">
                Mobile Number
              </p>
              <p className="text-base text-[#181818] font-medium">
                {member && member?.phone}
              </p>
            </div>
          </>
        )}

        {member && member?.address && (
          <>
            <div className="w-full border my-5" />

            <div className="w-full">
              <p className="text-sm text-[#565656] font-medium">Location</p>
              <div className="w-full flex items-center gap-1 flex-wrap">
                <p className="text-base text-[#181818] font-medium">
                  {[
                    member?.address,
                    member?.city,
                    member?.state,
                    member?.zipcode,
                    member?.country,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            </div>
          </>
        )}

        {member && member?.description && (
          <>
            <div className="w-full border my-5" />

            <div className="w-full">
              <p className="text-sm text-[#565656] font-medium">Description</p>
              <p className="text-base text-[#181818] font-medium">
                {member && member?.description}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MemberInfo;
