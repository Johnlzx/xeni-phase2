'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
  className,
  hover = false,
  padding = 'md',
  children,
  ...props
}: CardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-6',
  };

  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-gray-100 shadow-sm',
        paddingClasses[padding],
        hover && 'transition-all cursor-pointer hover:shadow-md hover:border-gray-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
