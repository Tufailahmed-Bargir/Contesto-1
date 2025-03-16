import React from "react";
import { cn } from "@/lib/utils";

interface ButtonCTAProps {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "outline" | "dark";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}

const ButtonCTA = ({
  children,
  className,
  variant = "primary",
  size = "md",
  onClick,
  ...props
}: ButtonCTAProps & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const variantClasses = {
    primary:
      "bg-aceternity-pink hover:bg-aceternity-purple text-white hover-btn",
    secondary:
      "bg-white text-gray-900 hover:bg-gray-100 border border-gray-200",
    outline:
      "bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-800",
    dark: "bg-aceternity-dark text-white hover-btn-dark",
  };

  return (
    <button
      className={cn(
        "rounded-md font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-aceternity-purple",
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default ButtonCTA;
