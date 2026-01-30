import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center rounded-lg font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20",
                destructive: "bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-600/20",
                outline: "border border-gray-700 bg-transparent hover:bg-gray-800 text-white",
                secondary: "bg-gray-800 text-white hover:bg-gray-700",
                ghost: "hover:bg-gray-800 text-gray-300",
                link: "text-blue-500 underline-offset-4 hover:underline",
                gradient: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-600/20",
            },
            size: {
                default: "h-10 px-4 py-2 text-sm",
                sm: "h-8 rounded-md px-3 text-xs",
                lg: "h-12 rounded-xl px-8 text-base",
                xl: "h-16 rounded-2xl px-10 text-lg",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
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
Button.displayName = "Button";

export { Button, buttonVariants };
