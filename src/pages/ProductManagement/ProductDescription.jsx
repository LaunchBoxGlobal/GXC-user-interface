import React from "react";

const ProductDescription = ({ description }) => (
  <>
    <div className="w-full border my-5" />
    <div className="w-full space-y-3">
      <p className="text-sm font-semibold">Description</p>
      {description && (
        <p className="text-sm font-normal leading-[1.3]">{description}</p>
      )}
    </div>
  </>
);

export default ProductDescription;
