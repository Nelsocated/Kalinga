"use client";

import * as React from "react";
import { cn } from "@/src/lib/cn";

export const fieldStyles =
  "block w-full rounded-md border border-line bg-card px-3.5 py-2.5 text-base text-ink " +
  "transition-[border-color,box-shadow] duration-200 outline-none " +
  "placeholder:text-muted hover:border-ink-soft/40 " +
  "focus:border-ink focus:ring-2 focus:ring-ink/15 " +
  "disabled:cursor-not-allowed disabled:opacity-60 read-only:bg-ground " +
  "aria-invalid:border-reject aria-invalid:focus:ring-reject/15";

type FieldShellProps = {
  id: string;
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  labelClassName?: string;
  children: React.ReactNode;
};

/** Label above, control, then hint or error below (error wins). */
export function FieldShell({
  id,
  label,
  hint,
  error,
  required,
  className,
  labelClassName,
  children,
}: FieldShellProps) {
  const message = error || hint;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? (
        <label
          htmlFor={id}
          className={cn("text-sm font-medium text-ink", labelClassName)}
        >
          {label}
          {required ? (
            <span className="ml-0.5 text-reject-text" aria-hidden="true">
              *
            </span>
          ) : null}
        </label>
      ) : null}

      {children}

      {message ? (
        <p
          id={`${id}-desc`}
          className={cn(
            "text-xs",
            error ? "font-medium text-reject-text" : "text-muted",
          )}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> & {
  label?: string;
  error?: string;
  hint?: string;
  inputClassName?: string;
  labelClassName?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
};

export default function Input({
  label,
  error,
  hint,
  icon,
  iconPosition = "left",
  className,
  inputClassName,
  labelClassName,
  id: idProp,
  required,
  ...props
}: InputProps) {
  const autoId = React.useId();
  const id = idProp ?? autoId;

  return (
    <FieldShell
      id={id}
      label={label}
      hint={hint}
      error={error}
      required={required}
      className={className}
      labelClassName={labelClassName}
    >
      <div className="relative">
        {icon ? (
          <span
            className={cn(
              "pointer-events-none absolute top-1/2 -translate-y-1/2 text-lg text-muted",
              iconPosition === "left" ? "left-3.5" : "right-3.5",
            )}
          >
            {icon}
          </span>
        ) : null}

        <input
          id={id}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? `${id}-desc` : undefined}
          className={cn(
            fieldStyles,
            icon && iconPosition === "left" && "pl-10",
            icon && iconPosition === "right" && "pr-10",
            inputClassName,
          )}
          {...props}
        />
      </div>
    </FieldShell>
  );
}
