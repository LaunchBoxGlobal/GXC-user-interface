import { useEffect, useState } from "react";
import CommunityList from "./CommunityList";
import ProductList from "./ProductList";
import { useAppContext } from "../../context/AppContext";
import Cookies from "js-cookie";
import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { handleApiError } from "../../utils/handleApiError";
import { useNavigate, useSearchParams } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import Loader from "../../components/Common/Loader";

const HomePage = () => {
  const { communities, productSearchValue } = useAppContext();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [community, setCommunity] = useState(
    Cookies.get("selected-community")
      ? JSON.parse(Cookies.get("selected-community"))
      : null
  );
  const [isMember, setIsMember] = useState(false);
  const [isBanned, setIsBanned] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const newCommunity = Cookies.get("selected-community");
      if (newCommunity) {
        const parsed = JSON.parse(newCommunity);
        if (parsed?.id !== community?.id) {
          setCommunity(parsed);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [community]);

  const fetchCommunityProducts = async () => {
    if (!community) return;
    try {
      setLoading(true);
      const res = await axios.get(
        `${BASE_URL}/communities/${community.id}/products${
          productSearchValue ? `?search=${productSearchValue}` : ``
        }`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      setProducts(res?.data?.data?.products || null);
      setPagination(res?.data?.data?.pagination);
    } catch (error) {
      handleApiError(error, navigate);
    } finally {
      setLoading(false);
    }
  };

  const checkJoinStatus = async () => {
    if (!community) {
      return;
    }
    try {
      const res = await axios.get(
        `${BASE_URL}/communities/${community?.slug}/my-membership`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      console.log("join status from home page >> ", res?.data);
      if (res?.data?.data?.isMember) {
        fetchCommunityProducts();
        return;
      } else if (res?.data?.data?.membership?.status == "removed") {
        enqueueSnackbar("You been removed from the community!", {
          variant: "error",
        });
        navigate("/");
        return;
      } else if (res?.data?.data?.membership?.status == "banned") {
        enqueueSnackbar("You been banned from the community!", {
          variant: "error",
        });
        navigate("/");
        return;
      }
    } catch (error) {
      console.log("err while join status from home page >>> ", error);
      handleApiError(error, navigate);
    }
  };

  useEffect(() => {
    if (community) {
      checkJoinStatus();
    }
  }, [community, productSearchValue]);

  useEffect(() => {
    document.title = "Home - GiveXChange";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (loading) {
    return (
      <div className="w-full flex justify-center pt-40 min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <main className="w-full py-20 text-center padding-x">
      {communities && communities.length > 0 ? (
        <ProductList products={products} />
      ) : (
        <div className="w-full min-h-screen">
          You have not joined any community yet.
        </div>
      )}
    </main>
  );
};

export default HomePage;
