import { useNavigate, useSearchParams } from "react-router-dom";
import { useRef, memo, useState, useEffect } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";

const Categories = memo(() => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentCategoryId = searchParams.get("categoryId");
  const scrollRef = useRef(null);
  const [categories, setCategories] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/categories`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      // console.log("res >> ", res?.data?.data?.categories);
      setCategories(res?.data?.data?.categories);
    } catch (error) {
      console.log("err while fetching categories >>> ", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryClick = (c) => {
    const params = new URLSearchParams(searchParams);
    params.set("category", c.name);
    params.set("categoryId", c.id);
    navigate(`?${params.toString()}`);
  };

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const scrollAmount = clientWidth * 0.6;
    scrollRef.current.scrollTo({
      left:
        direction === "left"
          ? scrollLeft - scrollAmount
          : scrollLeft + scrollAmount,
      behavior: "smooth",
    });
  };

  if (categories && categories?.length < 1) return;

  return (
    <div className="relative w-full flex items-center">
      {/* Left Button */}
      <div className="bg-white z-20 absolute left-0 lg:-top-0.5">
        <button
          onClick={() => scroll("left")}
          className=" z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition"
        >
          <IoChevronBack className="text-[var(--button-bg)]" size={16} />
        </button>
      </div>

      <div
        ref={scrollRef}
        className="w-full overflow-x-auto no-scrollbar flex items-center gap-1.5 lg:gap-3 scroll-smooth px-10 categories-container"
      >
        <button
          type="button"
          onClick={() => {
            const params = new URLSearchParams(searchParams);
            params.delete("category");
            params.delete("categoryId");
            navigate(`?${params.toString()}`);
          }}
          className={`border border-[var(--button-bg)] px-5 py-1 text-sm font-medium rounded-3xl shrink-0 ${
            !currentCategoryId
              ? "bg-[var(--button-bg)] text-white"
              : "bg-white text-[var(--button-bg)]"
          }`}
        >
          All
        </button>

        {categories?.map((c) => (
          <button
            key={c?.id}
            type="button"
            onClick={() => handleCategoryClick(c)}
            className={`border border-[var(--button-bg)] px-5 py-1 text-xs lg:text-sm font-medium rounded-3xl shrink-0 ${
              currentCategoryId === String(c.id)
                ? "bg-[var(--button-bg)] text-white"
                : "bg-white text-[var(--button-bg)]"
            }`}
          >
            {c?.name}
          </button>
        ))}
      </div>

      {/* Right Button */}
      <div className="bg-white absolute right-0 lg:-top-0.5 z-20">
        <button
          onClick={() => scroll("right")}
          className=" z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition"
        >
          <IoChevronForward className="text-[var(--button-bg)]" size={16} />
        </button>
      </div>
    </div>
  );
});

export default Categories;
