import React from 'react';
import { cn } from '../layout/Navbar';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

export interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
        return (
            <motion.button
                whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
                whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
                ref={ref}
                disabled={disabled || isLoading}
                className={cn(
                    "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:opacity-50 disabled:pointer-events-none",
                    {
                        'bg-blue-600 text-white hover:bg-blue-700': variant === 'primary',
                        'bg-zinc-800 text-zinc-100 hover:bg-zinc-700': variant === 'secondary',
                        'border-2 border-zinc-700 bg-transparent text-zinc-100 hover:border-zinc-600 hover:bg-zinc-800': variant === 'outline',
                        'bg-red-500/10 text-red-500 hover:bg-red-500/20': variant === 'danger',
                        'h-9 px-4 text-sm': size === 'sm',
                        'h-11 px-6 text-base': size === 'md',
                        'h-14 px-8 text-lg': size === 'lg',
                    },
                    className
                )}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children as React.ReactNode}
            </motion.button>
        );
    }
);
Button.displayName = 'Button';
