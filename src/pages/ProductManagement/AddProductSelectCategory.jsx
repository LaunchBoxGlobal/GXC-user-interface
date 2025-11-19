import { useEffect, useRef, useState } from "react";
import { TiArrowSortedDown } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";

const AddProductSelectCategory = ({ formik, categories }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (id) => {
    const alreadySelected = formik.values.category.includes(id);

    if (alreadySelected) {
      formik.setFieldValue(
        "category",
        formik.values.category.filter((cat) => cat !== id)
      );
    } else {
      if (formik.values.category.length >= 5) return;

      formik.setFieldValue("category", [...formik.values.category, id]);
    }
  };

  const hasError = formik.touched.category && formik.errors.category;

  return (
    <div className="w-full flex flex-col gap-2 relative" ref={dropdownRef}>
      <label className="text-sm font-medium">Categories</label>

      {/* Select Box */}
      <div
        onClick={() => setOpen(!open)}
        className={`w-full h-[49px] px-[15px] bg-[var(--secondary-bg)] rounded-[8px] 
          flex items-center justify-between cursor-pointer border 
          ${hasError ? "border-red-500" : "border-[var(--secondary-bg)]"}
        `}
      >
        <span className="text-gray-400">Select up to 5 categories</span>
        <TiArrowSortedDown
          className={`text-xl transition-all text-gray-500 ${
            open ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Dropdown List */}
      {open && (
        <div
          className="mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-y-auto absolute top-20 right-0 z-20"
          style={{ maxHeight: "180px" }}
        >
          {categories.map((cat) => {
            const isSelected = formik.values.category.includes(cat.id);

            return (
              <div
                key={cat.id}
                onClick={() => handleSelect(cat.id)}
                className={`px-4 py-2 text-sm flex justify-between items-center 
                  cursor-pointer hover:bg-gray-100 ${
                    isSelected ? "bg-gray-100 font-medium" : ""
                  }`}
              >
                {cat.name}
                {isSelected && <span className="text-green-600">✓</span>}
              </div>
            );
          })}
        </div>
      )}

      {hasError && (
        <p className="text-red-500 text-xs">{formik.errors.category}</p>
      )}
    </div>
  );
};

export default AddProductSelectCategory;
