import { useAppContext } from "../../context/AppContext";

const ProductTypeTabs = () => {
  const { productType, setProductType } = useAppContext();
  return (
    // <div className="w-full flex items-center justify-end mt-10">
    <div className="w-full max-w-[210px] rounded-[9px] h-[49px] grid grid-cols-2 bg-white custom-shadow p-1">
      <button
        type="button"
        onClick={() => setProductType("active")}
        className={`w-full h-full ${
          productType === "active"
            ? "bg-[var(--button-bg)] text-white"
            : "bg-white text-[var(--button-bg)]"
        } font-medium text-sm rounded-[9px]`}
      >
        Active
      </button>
      <button
        type="button"
        onClick={() => setProductType("sold")}
        className={`w-full h-full ${
          productType === "sold"
            ? "bg-[var(--button-bg)] text-white"
            : "bg-white text-[var(--button-bg)]"
        } font-medium text-sm rounded-[9px]`}
      >
        Sold
      </button>
    </div>
    // </div>
  );
};

export default ProductTypeTabs;
