import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import Loader from "../../components/Common/Loader";
import CommunityCard from "../../components/Common/CommunityCard";

const CommunitiesPage = () => {
  const [communities, setCommunities] = useState(null);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    checkJoinStatus();
  }, []);

  const checkJoinStatus = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/communities/my-joined`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      console.log("my joined communities >> ", res?.data);
      setCommunities(res?.data?.data?.communities);
      setPagination(res?.data?.data?.pagination);
    } catch (error) {
      console.log("my joined communities error >>>>> ", error);
      enqueueSnackbar(error?.response?.data?.message || error?.message, {
        variant: "error",
        autoHideDuration: 1500,
      });
    }
  };

  return (
    <div className="p-5 min-h-screen">
      {communities && communities.length > 0 ? (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {communities.map((community) => {
            return <CommunityCard community={community} />;
          })}
        </div>
      ) : (
        <div className="w-full flex flex-col justify-start items-center">
          <h1 className="text-gray-600">
            You have not joined any community yet.
          </h1>
        </div>
      )}
    </div>
  );
};

export default CommunitiesPage;
