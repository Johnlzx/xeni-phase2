'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  leftIcon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  error?: string;
}

export function Select({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  leftIcon,
  disabled = false,
  className,
  error,
}: SelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn('relative', className)} ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'w-full flex items-center gap-2 px-3 py-2.5 bg-white border rounded-lg text-left transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-[#0E4369]/20 focus:border-[#0E4369]',
          disabled && 'opacity-50 cursor-not-allowed bg-gray-50',
          error ? 'border-red-300' : 'border-gray-200 hover:border-gray-300'
        )}
      >
        {leftIcon && <span className="text-gray-400 shrink-0">{leftIcon}</span>}
        <span className={cn('flex-1 text-sm truncate', !selectedOption && 'text-gray-400')}>
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-gray-400 transition-transform shrink-0',
            isOpen && 'transform rotate-180'
          )}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange?.(option.value);
                setIsOpen(false);
              }}
              className={cn(
                'w-full px-3 py-2.5 text-left hover:bg-gray-50 transition-colors',
                option.value === value && 'bg-gray-50'
              )}
            >
              <div className="text-sm font-medium text-gray-900">{option.label}</div>
              {option.description && (
                <div className="text-xs text-gray-500 mt-0.5">{option.description}</div>
              )}
            </button>
          ))}
        </div>
      )}

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
