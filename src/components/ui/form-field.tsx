import { useId, type ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type FormFieldProps = {
  label: string;
  htmlFor?: string;
  className?: string;
  error?: string;
  warning?: string;
  children: ReactNode;
};

export function FormField({
  label,
  htmlFor,
  className,
  error,
  warning,
  children,
}: FormFieldProps) {
  const generatedId = useId();
  const messageId = `${generatedId}-message`;
  const hasError = Boolean(error);
  const hasWarning = Boolean(warning) && !hasError;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}
      </Label>
      {children}
      {hasError ? (
        <p
          id={messageId}
          role="alert"
          className="text-sm text-destructive"
        >
          {error}
        </p>
      ) : null}
      {hasWarning ? (
        <p id={messageId} className="text-sm text-muted-foreground">
          {warning}
        </p>
      ) : null}
    </div>
  );
}
