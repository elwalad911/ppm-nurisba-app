"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface ConfirmSubmitButtonProps {
  confirmMessage: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  title?: string;
  children: ReactNode;
}

/**
 * Submit button that asks for native confirmation before submitting
 * the enclosing server-action form. Used for publication-state changes.
 */
export function ConfirmSubmitButton({
  confirmMessage,
  variant,
  size,
  className,
  title,
  children,
}: ConfirmSubmitButtonProps) {
  return (
    <Button
      type="submit"
      variant={variant}
      size={size}
      className={className}
      title={title}
      onClick={(e) => {
        if (!window.confirm(confirmMessage)) {
          e.preventDefault();
        }
      }}
    >
      {children}
    </Button>
  );
}
