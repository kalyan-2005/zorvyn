import { ButtonHTMLAttributes, forwardRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = "primary", className = "", isLoading, ...props }, ref) => {
    const baseStyle = "px-4 py-2 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
    
    const variants = {
      primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/30",
      secondary: "bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700",
      danger: "bg-rose-500 text-white hover:bg-rose-600 shadow-lg shadow-rose-500/30",
      ghost: "text-slate-300 hover:text-white hover:bg-slate-800",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`${baseStyle} ${variants[variant]} ${className}`}
        {...(props as any)}
      >
        {isLoading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
          />
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
