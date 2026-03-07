"use client";

import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  loading?: boolean;
  disabled?: boolean;
  className?: string;
};

export default function Button({
  children,
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
        w-full
        py-2 px-4
        rounded-lg
        font-medium
        transition
        border
        border-[#f3be0f]
        bg-yellow text-black
        hover:bg-[#f3be0f]
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${className}
      `}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}
