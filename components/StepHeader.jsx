import React from "react";

const StepHeader = ({ children, title, subTitle }) => {
  return (
    <div className="text-center space-y-3">
      <div className="text-6xl mb-4">{children}</div>
      <h2 className="text-xl md:text-4xl font-bold text-gray-800">{title}</h2>
      <p className="text-gray-600 md:text-lg">{subTitle}</p>
    </div>
  );
};

export default StepHeader;
