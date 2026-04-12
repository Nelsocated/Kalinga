"use client";

import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  loading?: boolean;
  disabled?: boolean;
  className?: string;
};

export default function Button({
  children,
  icon,
  onClick,
  type = "button",
  loading = false,
  disabled = false,
  className = "",
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`
        w-auto
        py-2 px-4
        rounded-[15px]
        font-semibold
        transition
        border
        text-description
        bg-background text-black
        hover:bg-primary
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${className}
      `}
    >
      <div className="flex items-center gap-1">
        {icon}
        {loading ? "Loading..." : children}
      </div>
    </button>
  );
}
