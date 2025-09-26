import React from "react";

const AuthLayout = ({ children }) => {
  return (
    <main className="w-full min-h-screen relative grid grid-cols-1 lg:grid-cols-2 p-4">
      <div className="w-full h-full bg-gray-100 rounded-[8px] hidden lg:block"></div>
      <div className="w-full h-full py-12 flex items-center justify-center">
        {children}
      </div>
    </main>
  );
};

export default AuthLayout;
