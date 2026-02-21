// components/ui/Input.tsx
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
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  inputClassName?: string;
  search?: string;

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
  required = false,
  error,
  hint,
  className = "",
  inputClassName = "",
  search,
  onChange,
  onBlur,
}: InputProps) {
  const id = React.useId();

  const isControlled = value !== undefined;

  return (
    <div className={`space-y-1 ${className}`}>
      {label ? (
        <label htmlFor={id} className="block text-sm font-medium text-gray-900">
          {label}
          {required ? <span className="text-red-600"> </span> : null}
        </label>
      ) : null}

      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        required={required}
        value={isControlled ? value : undefined}
        defaultValue={!isControlled ? defaultValue : undefined}
        onChange={onChange}
        onBlur={onBlur}
        aria-invalid={!!error}
        aria-describedby={hint || error ? `${id}-desc` : undefined}
        className={[
          "block w-full rounded-lg border px-3 py-2 text-sm outline-none transition",
          "bg-white text-gray-900 placeholder:text-gray-600",
          "focus:ring-2 focus:ring-[#f3be0f]",
          disabled ? "opacity-60 cursor-not-allowed" : "",
          error
            ? "border-red-500 focus:ring-red-500"
            : "border-[#f3be0f] focus:border-[#f3be0f]",
          inputClassName,
        ].join(" ")}
      />

      {error ? (
        <p id={`${id}-desc`} className="text-xs text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-desc`} className="text-xs text-gray-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
