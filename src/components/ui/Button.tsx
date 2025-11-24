import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "success" | "ghost" | "gold";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  fullWidth?: boolean;
}

/**
 * Button Component - Styled with medieval/ONUW aesthetic
 * Pill-shaped buttons with gold accents
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      fullWidth = false,
      className = "",
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    // Base styles
    const baseStyles =
      "inline-flex items-center justify-center font-semibold rounded-full transition-all duration-250 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-background-primary)] disabled:opacity-50 disabled:cursor-not-allowed";

    // Variant styles
    const variantStyles = {
      primary:
        "bg-[var(--color-background-tertiary)] hover:bg-opacity-80 text-white border border-slate-600 hover:border-slate-500 shadow-md hover:shadow-lg",
      secondary:
        "bg-slate-700 hover:bg-slate-600 text-white border border-slate-600 hover:border-slate-500",
      danger:
        "bg-red-600 hover:bg-red-700 text-white border border-red-500 shadow-md hover:shadow-lg",
      success:
        "bg-green-600 hover:bg-green-700 text-white border border-green-500 shadow-md hover:shadow-lg",
      ghost:
        "bg-transparent hover:bg-white/10 text-slate-300 hover:text-white border border-transparent",
      gold: "bg-gradient-to-r from-[var(--color-accent-amber)] to-amber-600 hover:from-amber-500 hover:to-amber-500 text-white font-bold border border-amber-500 shadow-lg hover:shadow-xl",
    };

    // Size styles
    const sizeStyles = {
      sm: "text-sm px-4 py-1.5 gap-1.5",
      md: "text-base px-6 py-2.5 gap-2",
      lg: "text-lg px-8 py-3 gap-2.5",
    };

    // Width styles
    const widthStyles = fullWidth ? "w-full" : "";

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
