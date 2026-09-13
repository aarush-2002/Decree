import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils'; // Make sure you have this utility, or just use template literals

const buttonVariants = cva(
  // BASE STYLES: Fixes sizing, animations, and hover
  "inline-flex items-center justify-center font-black font-display uppercase tracking-wide transition-all duration-300 ease-in-out border-2 border-black focus:outline-none disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-[#F59E0B] text-black hover:bg-[#D97706] hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#000000]", // Better Amber, smooth hover
        outline: "bg-transparent text-black border-2 border-black hover:bg-black hover:text-white hover:-translate-y-1",
        ghost: "border-transparent hover:bg-gray-200",
        destructive: "bg-red-600 text-white hover:bg-red-700",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-base",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface BrutalButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const BrutalButton = forwardRef<HTMLButtonElement, BrutalButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
BrutalButton.displayName = "BrutalButton";

export { BrutalButton, buttonVariants };
