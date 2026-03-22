import React from "react";

const Button = ({
  variant = "primary",
  size = "medium",
  children,
  onClick,
  className = "",
  type = "button",
  ...props
}) => {
  const baseClasses =
    "cursor-pointer font-bold transition-all duration-300 rounded-xl";

  const variants = {
    primary:
      "bg-linear-to-r from-[#18a2e3] to-[#0d8bc9] text-white shadow-lg hover:shadow-xl",
    secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300",
    icon: "p-2 text-gray-600 hover:bg-gray-100 rounded-xl",
  };

  const sizes = {
    small: "px-4 py-2 text-sm",
    medium: "px-6 py-3",
    large: "px-8 py-3",
    xl: "px-8 lg:px-10 py-2 md:py-3 text-lg",
    icon: "p-2",
  };

  const classes =
    `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`.trim();

  return (
    <button type={type} onClick={onClick} className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;
