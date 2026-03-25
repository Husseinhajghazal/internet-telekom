import React from "react";

const StepHeader = ({ children, title, subTitle }) => {
  return (
    <div className="text-center">
      {children}
      <h2 className="text-xl md:text-4xl font-bold text-gray-800 mb-3">{title}</h2>
      <p className="text-gray-600 md:text-lg">{subTitle}</p>
    </div>
  );
};

export default StepHeader;
