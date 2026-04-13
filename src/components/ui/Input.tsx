"use client";

import * as React from "react";

type InputProps = {
  label?: string;
  name?: string;
  type?: React.HTMLInputTypeAttribute;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  autoComplete?: string;
  disabled?: boolean;
  readOnly?: boolean; // ✅ ADD THIS
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";

  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
};

export default function Input({
  label,
  name,
  type = "text",
  value,
  defaultValue,
  placeholder,
  autoComplete,
  disabled = false,
  readOnly = false,
  required = false,
  error,
  hint,
  icon,
  iconPosition = "left",
  inputClassName = "",
  labelClassName = "",
  onChange,
  onBlur,
}: InputProps) {
  const id = React.useId();

  const isControlled = value !== undefined;

  return (
    <div className="relative">
      {icon && iconPosition === "left" && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}

      <label htmlFor={id} className={`block mb-1 ${labelClassName}`}>
        {label}
      </label>

      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        value={isControlled ? value : undefined}
        defaultValue={!isControlled ? defaultValue : undefined}
        onChange={onChange}
        onBlur={onBlur}
        aria-invalid={!!error}
        aria-describedby={hint || error ? `${id}-desc` : undefined}
        className={[
          "block w-full rounded-[15px] border px-3 py-2 text-description outline-none transition",
          "bg-white text-gray-900 placeholder:text-gray-600",
          "focus:ring-2 focus:ring-primary",
          icon && iconPosition === "left" ? "pl-10" : "",
          icon && iconPosition === "right" ? "pr-10" : "",
          disabled ? "opacity-60 cursor-not-allowed" : "",
          error
            ? "border-red-500 focus:ring-red-500"
            : "border focus:border-primary",
          inputClassName,
        ].join(" ")}
      />

      {icon && iconPosition === "right" && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
    </div>
  );
}
