import React from "react";

const Button = ({
  variant = "primary",
  size = "medium",
  children,
  onClick,
  className = "",
  type = "button",
  glass = false,
  neumorph = false,
  ...props
}) => {
  const baseClasses =
    "relative cursor-pointer font-bold transition-all duration-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 overflow-hidden group";

  const variants = {
    primary: glass
      ? "glass-strong text-white hover:text-white focus:ring-[#f36802] hover-lift"
      : neumorph
        ? "neumorph text-gray-800 hover:text-gray-900 focus:ring-[#f36802] hover-lift"
        : "bg-gradient-to-r from-[#f36802] to-[#ffb245] text-white shadow-lg hover:shadow-xl hover-lift focus:ring-[#f36802]",
    secondary: glass
      ? "glass-strong text-white hover:text-white focus:ring-[#18a2e3] hover-lift"
      : neumorph
        ? "neumorph text-gray-800 hover:text-gray-900 focus:ring-[#18a2e3] hover-lift"
        : "bg-gradient-to-r from-[#18a2e3] to-[#5898b7] text-white shadow-lg hover:shadow-xl hover-lift focus:ring-[#18a2e3]",
    whatsapp:
      "bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white shadow-lg hover:shadow-xl hover-lift focus:ring-[#075E54]",
    icon: "p-2 text-gray-600 hover:bg-gray-100 rounded-xl hover-rotate neumorph-inset",
    ghost:
      "bg-transparent text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300 neumorph",
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
      {/* Shimmer effect for primary buttons */}
      {variant === "primary" && !glass && !neumorph && (
        <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}

      {/* Pulse glow for glass buttons */}
      {glass && (
        <div className="absolute inset-0 animate-pulse-glow opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}

      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
};

export default Button;
