import { forwardRef } from "react";
import type { HTMLAttributes } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "village" | "werewolf" | "solo" | "glass";
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
}

/**
 * Card Component - Atmospheric container with team-specific variants
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "default",
      padding = "md",
      hover = false,
      className = "",
      children,
      ...props
    },
    ref,
  ) => {
    // Base styles
    const baseStyles = "rounded-xl transition-all duration-250 border";

    // Variant styles
    const variantStyles = {
      default:
        "bg-[var(--color-background-secondary)] border-slate-700 shadow-lg",
      village: "bg-blue-900/20 border-blue-700/50 shadow-lg shadow-blue-900/20",
      werewolf: "bg-red-900/20 border-red-700/50 shadow-lg shadow-red-900/20",
      solo: "bg-purple-900/20 border-purple-700/50 shadow-lg shadow-purple-900/20",
      glass: "bg-white/5 backdrop-blur-sm border-white/10 shadow-xl",
    };

    // Padding styles
    const paddingStyles = {
      none: "",
      sm: "p-3",
      md: "p-4",
      lg: "p-6",
    };

    // Hover styles
    const hoverStyles = hover
      ? "hover:shadow-xl hover:border-opacity-80 cursor-pointer hover:-translate-y-0.5"
      : "";

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${hoverStyles} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";
