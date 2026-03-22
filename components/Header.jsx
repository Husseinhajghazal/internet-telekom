import React from "react";

const Header = ({ step }) => {
  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
        تقديم طلب لإنترنت تيليكوم
      </h1>
      <p className="text-gray-600 mt-2">الخطوة {step} من 6</p>
    </div>
  );
};

export default Header;
