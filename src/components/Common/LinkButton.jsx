import React from "react";
import { Link } from "react-router-dom";

const LinkButton = ({ path, title }) => {
  return (
    <Link
      to={path}
      className="w-full bg-[var(--button-bg)] text-white h-[49px] py-[14px] font-medium text-center rounded-[8px]"
    >
      {title}
    </Link>
  );
};

export default LinkButton;
