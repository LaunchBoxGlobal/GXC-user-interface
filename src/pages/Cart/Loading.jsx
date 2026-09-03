import React from "react";
import Loader from "../../components/Common/Loader";

const Loading = () => {
  return (
    <div className="w-full bg-transparent rounded-[10px] padding-x relative -top-20">
      <div className="w-full bg-[var(--light-bg)] rounded-[30px] relative p-4 mt-2">
        <div className="w-full rounded-[18px] relative min-h-[60vh] bg-white flex items-center justify-center">
          <Loader />
        </div>
      </div>
    </div>
  );
};

export default Loading;
