import React from 'react';
import { cn } from '../../utils/helpers';

export const Card = ({ children, className, ...props }) => {
  return (
    <div className={cn('bg-[#1a1a1a] rounded-[20px] transition-all duration-300 p-6', className)} {...props}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className, ...props }) => {
  return (
    <div className={cn('flex flex-col space-y-1.5 mb-4', className)} {...props}>
      {children}
    </div>
  );
};

export const CardTitle = ({ children, className, ...props }) => {
  return (
    <h3 className={cn('text-xl font-semibold leading-none tracking-tight text-white mb-2', className)} {...props}>
      {children}
    </h3>
  );
};
