import React from "react";
import ProductCard from "../../components/Common/ProductCard";
import { useSearchParams } from "react-router-dom";

const ProductList = ({ products }) => {
  const [searchParams] = useSearchParams();
  const currentCategoryId = searchParams.get("categoryId");
  return (
    <div className="w-full mt-10">
      {products && products?.length > 0 ? (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-10 max-w-[1280px] mx-auto">
          {products?.map((product, index) => {
            return <ProductCard product={product} key={index} index={index} />;
          })}
        </div>
      ) : (
        <div className="w-full text-center h-[70vh] flex items-center justify-center gap-2">
          <img src="/product-icon.png" alt="product icon" className="max-w-7" />
          <p className="text-sm font-medium text-gray-500">
            {currentCategoryId
              ? "No products found in this category!"
              : "No products found in this community!"}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductList;
