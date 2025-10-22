import React from "react";
import ProductCard from "../../components/Common/ProductCard";

const ProductList = ({ products }) => {
  return (
    <div className="w-full">
      {products && products?.length > 0 ? (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-10 max-w-[1280px] mx-auto">
          {products?.map((product, index) => {
            return <ProductCard product={product} key={index} index={index} />;
          })}
        </div>
      ) : (
        <div className="w-full min-h-screen">
          No products found in this community!
        </div>
      )}
    </div>
  );
};

export default ProductList;
