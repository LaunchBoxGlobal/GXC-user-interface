import { useEffect, useRef, useState } from "react";
import { TiArrowSortedDown } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";

const EditProductSelectCategory = ({ formik, categories }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  console.log(formik.values.category);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // SELECT / UNSELECT CATEGORY
  const handleSelect = (categoryObj) => {
    const selectedIds = formik.values.category;
    const idStr = String(categoryObj.id);

    const alreadySelected = selectedIds.includes(idStr);

    if (alreadySelected) {
      // REMOVE
      formik.setFieldValue(
        "category",
        selectedIds.filter((id) => id !== idStr)
      );
      return;
    }

    // ADD
    if (selectedIds.length >= 5) return;

    formik.setFieldValue("category", [...selectedIds, idStr]);
  };

  // Remove pill
  const removePill = (idStr) => {
    formik.setFieldValue(
      "category",
      formik.values.category.filter((id) => id !== idStr)
    );
  };

  const hasError = formik.touched.category && formik.errors.category;

  return (
    <div className="w-full flex flex-col gap-2 mt-4 relative" ref={dropdownRef}>
      <label className="text-sm font-medium">Categories</label>

      {/* DROPDOWN TRIGGER */}
      <div
        onClick={() => setOpen(!open)}
        className={`w-full h-[49px] px-[15px] bg-[var(--secondary-bg)]
          rounded-[8px] flex items-center justify-between cursor-pointer border
          ${hasError ? "border-red-500" : "border-[var(--secondary-bg)]"}`}
      >
        <span className="text-gray-600">
          {formik.values.category.length > 0
            ? `${formik.values.category.length} selected`
            : "Select up to 5 categories"}
        </span>

        <TiArrowSortedDown
          className={`text-xl transition-all text-gray-500 ${
            open ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* DROPDOWN LIST */}
      {open && (
        <div
          className="mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg
          overflow-y-auto absolute z-20"
          style={{ maxHeight: "180px" }}
        >
          {categories?.map((cat) => {
            const idStr = String(cat.id);
            const isSelected = formik.values.category.includes(idStr);

            return (
              <div
                key={cat.id}
                onClick={() => handleSelect(cat)}
                className={`px-4 py-2 text-sm flex justify-between items-center cursor-pointer
                  hover:bg-gray-100 ${
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

      {/* ERRORS */}
      {hasError && (
        <p className="text-red-500 text-xs">{formik.errors.category}</p>
      )}

      {/* SELECTED CATEGORY PILLS */}
      {formik.values.category.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-1">
          {formik.values.category.map((idStr) => {
            const cat = categories?.find((c) => String(c.id) === idStr);
            if (!cat) return null;

            return (
              <div
                key={idStr}
                className="flex items-center gap-1 bg-[var(--button-bg)] text-white pl-4 pr-2.5 py-1 rounded-full text-xs"
              >
                {cat.name}
                <button
                  type="button"
                  onClick={() => removePill(idStr)}
                  className="text-white"
                >
                  <RxCross2 size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EditProductSelectCategory;
