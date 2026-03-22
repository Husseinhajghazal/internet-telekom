import React from "react";

const ProgressBar = ({ step }) => {
  return (
    <div className="px-6 mb-6">
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-[#18a2e3] h-2 rounded-full transition-all duration-300"
          style={{ width: `${(step / 6) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
