"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type FieldProps = React.ComponentProps<typeof Input> & {
  label: string;
  error?: { message?: string };
  prefix?: string;
};

function Field({
  label,
  error,
  className,
  id,
  name,
  type,
  prefix,
  ...props
}: FieldProps) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";
  const fieldId = id ?? name;

  return (
    <div className="space-y-1.5 text-left">
      <Label htmlFor={fieldId}>{label}</Label>
      <div className="relative">
        {prefix ? (
          <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-sm font-medium text-muted-foreground">
            {prefix}
          </span>
        ) : null}
        <Input
          id={fieldId}
          name={name}
          type={isPassword && visible ? "text" : type}
          aria-invalid={!!error}
          className={cn(
            "h-11 px-3.5 text-sm",
            prefix && "pl-8",
            isPassword && "pr-10",
            className,
          )}
          {...props}
        />
        {isPassword ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className="absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => setVisible((current) => !current)}
            aria-label={visible ? "Hide password" : "Show password"}
          >
            {visible ? <EyeOff /> : <Eye />}
          </Button>
        ) : null}
      </div>
      {error?.message ? (
        <p className="text-sm text-destructive">{error.message}</p>
      ) : null}
    </div>
  );
}

export { Field };
