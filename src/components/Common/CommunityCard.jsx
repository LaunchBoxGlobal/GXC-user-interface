import { HiOutlineDotsVertical } from "react-icons/hi";
import { Link } from "react-router-dom";

const CommunityCard = () => {
  return (
    <Link to={`/community/45u98965`}>
      <div className="w-full bg-white p-5 rounded-[20px] overflow-hidden">
        <div className="w-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div>
              <img
                src="/stats-card-icon-placeholder.png"
                alt="community image placeholder"
                className="w-[67px] h-[67px]"
              />
            </div>
            <div className="space-y-3">
              <p className="text-lg font-semibold leading-none">Community 01</p>
              <p className="text-sm text-[#717182] leading-none">Owner</p>
            </div>
          </div>
          <div>
            <button type="button">
              <HiOutlineDotsVertical className="text-2xl" />
            </button>
          </div>
        </div>

        <div className="w-full my-4 overflow-hidden">
          <p className="text-sm leading-[1.2] text-[var(--secondary-color)]">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. In
            consequatur architecto placeat nesciunt possimus similique ratione
            blanditiis rerum, optio repellat.
          </p>
        </div>

        <div className="w-full flex items-center justify-between">
          <p className="text-sm font-normal text-[#202020]">Members</p>
          <p className="text-sm font-semibold text-[#202020]">1250</p>
        </div>

        <div className="w-full border my-3" />

        <div className="w-full flex items-center justify-between">
          <p className="text-sm font-normal text-[#202020]">Total Products</p>
          <p className="text-sm font-semibold text-[#202020]">150</p>
        </div>
      </div>
    </Link>
  );
};

export default CommunityCard;
