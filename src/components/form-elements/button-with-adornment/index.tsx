"use client";

import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface ButtonWithAdornmentProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  label?: string | ReactNode;
  size?: "sm" | "default" | "lg" | "icon";
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "primary"
    | "darkDefault"
    | "print";
}

export default function ButtonWithAdornment({
  size = "default",
  startAdornment,
  endAdornment,
  label,
  children,
  className,
  variant = "default",
  ...props
}: ButtonWithAdornmentProps) {
  return (
    <Button
      variant={variant}
      className={`inline-flex items-center ${className || ""}`}
      size={size}
      {...props}
    >
      {startAdornment && <span className="mr-2">{startAdornment}</span>}
      {label || children}
      {endAdornment && <span className="ml-2">{endAdornment}</span>}
    </Button>
  );
}
