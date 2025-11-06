import { useNavigate, useSearchParams } from "react-router-dom";

const Categories = ({ categories }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentCategoryId = searchParams.get("categoryId");

  const handleCategoryClick = (c) => {
    const params = new URLSearchParams(searchParams);
    params.set("category", c.name);
    params.set("categoryId", c.id);
    navigate(`?${params.toString()}`);
  };

  return (
    <div className="w-full flex items-center justify-start gap-3 flex-wrap">
      <button
        type="button"
        onClick={() => {
          const params = new URLSearchParams(searchParams);
          params.delete("category");
          params.delete("categoryId");
          navigate(`?${params.toString()}`);
        }}
        className={`border border-[var(--button-bg)] px-5 py-1 text-sm font-medium rounded-3xl ${
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
          className={`border border-[var(--button-bg)] px-5 py-1 text-sm font-medium rounded-3xl ${
            currentCategoryId === String(c.id)
              ? "bg-[var(--button-bg)] text-white"
              : "bg-white text-[var(--button-bg)]"
          }`}
        >
          {c?.name}
        </button>
      ))}
    </div>
  );
};

export default Categories;
