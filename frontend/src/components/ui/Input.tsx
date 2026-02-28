import React from 'react';
import { cn } from '../layout/Navbar';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type = 'text', label, error, ...props }, ref) => {
        return (
            <div className="flex flex-col gap-1.5 w-full">
                {label && <label className="text-sm font-medium text-zinc-300">{label}</label>}
                <div className="relative">
                    <input
                        type={type}
                        className={cn(
                            "flex h-11 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
                            error && "border-red-500 focus:ring-red-500/50",
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                </div>
                {error && <p className="text-xs text-red-500">{error}</p>}
            </div>
        );
    }
);
Input.displayName = 'Input';
