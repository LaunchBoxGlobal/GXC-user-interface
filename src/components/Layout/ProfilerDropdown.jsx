import { useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const ProfilerDropdown = ({ user }) => {
  const navigate = useNavigate();

  const toggleDropdown = () => navigate(`/profile/notifications`);

  return (
    <button type="button" onClick={toggleDropdown}>
      <div className="w-[55px] h-[55px] rounded-full overflow-hidden flex items-center justify-center hover:opacity-90 transition relative [&>*]:h-full [&>*]:w-full">
        <LazyLoadImage
          src={
            user.profilePictureUrl
              ? user.profilePictureUrl
              : "/profile-icon.png"
          }
          alt="profile picture"
          effect="blur"
          className="h-full w-full object-cover"
        />
      </div>
    </button>
  );
};

export default ProfilerDropdown;
