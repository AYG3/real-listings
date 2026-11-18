"use client";

import { useId } from "react";
import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/cn";

const controlBase =
  "w-full rounded-control border bg-white px-3 text-sm text-ink-900 placeholder:text-muted-500/70 transition-colors focus:border-forest-700 focus:outline-none disabled:bg-ivory-100 disabled:text-muted-500";

type FieldMeta = {
  label: string;
  hint?: string;
  error?: string;
  containerClassName?: string;
};

function describedBy(id: string, hint?: string, error?: string) {
  const ids = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(
    Boolean,
  );
  return ids.length > 0 ? ids.join(" ") : undefined;
}

function FieldWrapper({
  id,
  label,
  hint,
  error,
  containerClassName,
  children,
}: FieldMeta & { id: string; children: ReactNode }) {
  return (
    <div className={cn("mb-5", containerClassName)}>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-semibold text-ink-900"
      >
        {label}
      </label>
      {children}
      {hint && !error ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted-500">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs font-medium text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & FieldMeta;

export function Input({
  label,
  hint,
  error,
  containerClassName,
  className,
  id,
  ...props
}: InputProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  return (
    <FieldWrapper
      id={fieldId}
      label={label}
      hint={hint}
      error={error}
      containerClassName={containerClassName}
    >
      <input
        id={fieldId}
        className={cn(
          controlBase,
          "h-11",
          error
            ? "border-danger"
            : "border-ink-900/15",
          className,
        )}
        aria-describedby={describedBy(fieldId, hint, error)}
        aria-invalid={error ? true : undefined}
        {...props}
      />
    </FieldWrapper>
  );
}

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & FieldMeta;

export function Textarea({
  label,
  hint,
  error,
  containerClassName,
  className,
  id,
  rows = 4,
  ...props
}: TextareaProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  return (
    <FieldWrapper
      id={fieldId}
      label={label}
      hint={hint}
      error={error}
      containerClassName={containerClassName}
    >
      <textarea
        id={fieldId}
        rows={rows}
        className={cn(
          controlBase,
          "py-2.5",
          error ? "border-danger" : "border-ink-900/15",
          className,
        )}
        aria-describedby={describedBy(fieldId, hint, error)}
        aria-invalid={error ? true : undefined}
        {...props}
      />
    </FieldWrapper>
  );
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> &
  FieldMeta & { children: ReactNode };

export function Select({
  label,
  hint,
  error,
  containerClassName,
  className,
  id,
  children,
  ...props
}: SelectProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  return (
    <FieldWrapper
      id={fieldId}
      label={label}
      hint={hint}
      error={error}
      containerClassName={containerClassName}
    >
      <select
        id={fieldId}
        className={cn(
          controlBase,
          "h-11",
          error ? "border-danger" : "border-ink-900/15",
          className,
        )}
        aria-describedby={describedBy(fieldId, hint, error)}
        aria-invalid={error ? true : undefined}
        {...props}
      >
        {children}
      </select>
    </FieldWrapper>
  );
}
