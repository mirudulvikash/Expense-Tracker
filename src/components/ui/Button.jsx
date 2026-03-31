import React from 'react';
import { cn } from '../../utils/helpers';

export const Button = React.forwardRef(({ className, variant = 'primary', size = 'md', ...props }, ref) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';
  
  const variants = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-md',
    secondary: 'bg-slate-700 text-slate-100 hover:bg-slate-600',
    danger: 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20',
    ghost: 'hover:bg-slate-800 text-slate-300 hover:text-white',
  };

  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 py-2 px-4',
    lg: 'h-11 px-8 text-lg',
    icon: 'h-10 w-10',
  };

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    />
  );
});

Button.displayName = 'Button';
