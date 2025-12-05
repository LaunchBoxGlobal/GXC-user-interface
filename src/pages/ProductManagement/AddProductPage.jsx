import { useEffect, useState } from "react";
import { HiArrowLeft } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { handleApiError } from "../../utils/handleApiError";
import { useAppContext } from "../../context/AppContext";
import { useUser } from "../../context/userContext";
import AddProductForm from "./AddProductForm";

const AddProductPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const { user } = useAppContext();
  const { selectedCommunity } = useUser();

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/categories`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setCategories(res?.data?.data?.categories || []);
    } catch (error) {
      handleApiError(error, navigate);
    }
  };

  useEffect(() => {
    document.title = "Add Product - giveXchange";
    fetchCategories();
  }, []);

  return (
    <div className="w-full bg-transparent rounded-[10px] padding-x relative -top-20">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="w-full max-w-[48px] flex items-center justify-between text-sm text-white"
      >
        <HiArrowLeft />
        Back
      </button>

      <div className="w-full bg-[var(--light-bg)] rounded-[30px] relative p-4 mt-2">
        <AddProductForm
          categories={categories}
          user={user}
          selectedCommunity={selectedCommunity}
        />
      </div>
    </div>
  );
};

export default AddProductPage;
