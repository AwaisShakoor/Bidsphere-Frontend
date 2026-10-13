"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type FieldProps = React.ComponentProps<typeof Input> & {
  label: string;
  error?: { message?: string };
};

function Field({
  label,
  error,
  className,
  id,
  name,
  type,
  ...props
}: FieldProps) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";
  const fieldId = id ?? name;

  return (
    <div className="space-y-1.5 text-left">
      <Label htmlFor={fieldId}>{label}</Label>
      <div className="relative">
        <Input
          id={fieldId}
          name={name}
          type={isPassword && visible ? "text" : type}
          aria-invalid={!!error}
          className={cn("h-11 px-3.5 text-sm", isPassword && "pr-10", className)}
          {...props}
        />
        {isPassword ? (
          <button
            type="button"
            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => setVisible((current) => !current)}
            aria-label={visible ? "Hide password" : "Show password"}
          >
            {visible ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        ) : null}
      </div>
      {error?.message ? (
        <p className="text-sm text-destructive">{error.message}</p>
      ) : null}
    </div>
  );
}

export { Field };
