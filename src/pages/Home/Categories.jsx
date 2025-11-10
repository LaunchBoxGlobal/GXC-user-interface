import { useNavigate, useSearchParams } from "react-router-dom";
import { useRef, memo } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

const Categories = memo(({ categories }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentCategoryId = searchParams.get("categoryId");
  const scrollRef = useRef(null);

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

  return (
    <div className="relative w-full flex items-center">
      {/* Left Button */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 lg:-top-0.5 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition"
      >
        <IoChevronBack className="text-[var(--button-bg)]" size={16} />
      </button>

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
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 lg:-top-0.5 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition"
      >
        <IoChevronForward className="text-[var(--button-bg)]" size={16} />
      </button>
    </div>
  );
});

export default Categories;
