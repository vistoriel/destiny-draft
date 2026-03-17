'use client';

import { TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { FieldStatus } from '@/lib/hooks/useDraftAutosave';

interface LabeledTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  containerClassName?: string;
  error?: string;
  status?: FieldStatus;
  disabled?: boolean;
}

export function LabeledTextarea({
  label,
  className,
  containerClassName,
  status = 'idle',
  disabled = false,
  ...props
}: LabeledTextareaProps) {
  return (
    <div className={cn('flex flex-col items-center gap-1 h-full', containerClassName)}>
      <textarea
        className={cn(
          'block w-full h-full leading-snug resize-none p-1.5 placeholder:text-stone-300 border-2 border-stone-900 rounded-xs cursor-text active:border-primary-900 focus:bg-primary-50 focus:outline-2 outline-primary-600 focus:z-10 outline-offset-0 disabled:cursor-text transition-colors',
          status === 'error' && 'border-red-500',
          status === 'busy' && 'outline-2 outline-amber-600 border-amber-900 bg-amber-50',
          className
        )}
        disabled={disabled || status === 'busy'}
        {...props}
      />
      { label &&
        <label className={cn(
          'text-xs whitespace-nowrap text-nowrap text-ellipsis select-none',
          status === 'error' ? 'text-red-500' : 'text-stone-500',
          status === 'typing' && 'animate-pulse',
          status === 'busy' && 'animate-pulse'
        )}>
          { label }
        </label>
      }
    </div>
  );
}
