"use client";

import * as React from "react";
import { cn } from "@/src/lib/cn";
import { FieldShell, fieldStyles } from "./Input";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
  hint?: string;
  textareaClassName?: string;
  labelClassName?: string;
};

export default function Textarea({
  label,
  error,
  hint,
  className,
  textareaClassName,
  labelClassName,
  id: idProp,
  required,
  rows = 4,
  ...props
}: TextareaProps) {
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
      <textarea
        id={id}
        rows={rows}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? `${id}-desc` : undefined}
        className={cn(fieldStyles, "min-h-28 resize-y", textareaClassName)}
        {...props}
      />
    </FieldShell>
  );
}
