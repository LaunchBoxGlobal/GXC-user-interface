const AddProductSelectCategory = ({ formik, categories }) => {
  return (
    <div className="w-full flex flex-col gap-2">
      <label htmlFor="category" className="text-sm font-medium">
        Category
      </label>
      <select
        name="category"
        id="category"
        value={formik.values.category}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className={`w-full border h-[49px] bg-[var(--secondary-bg)] px-[15px] font-normal text-[#6D6D6D] rounded-[8px] outline-none transition-all ${
          formik.touched.category && formik.errors.category
            ? "border-red-500"
            : "border-[var(--secondary-bg)]"
        }`}
      >
        <option value="">Choose a category</option>
        {categories?.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      {formik.touched.category && formik.errors.category && (
        <p className="text-red-500 text-xs">{formik.errors.category}</p>
      )}
    </div>
  );
};

export default AddProductSelectCategory;
