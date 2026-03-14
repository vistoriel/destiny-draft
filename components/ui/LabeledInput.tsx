'use client';

import { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface LabeledInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  variant?: 'title' | 'regular';
  containerClassName?: string;
  status?: 'idle' | 'saving' | 'saved' | 'error';
}

export function LabeledInput({
  label,
  variant = 'regular',
  className,
  containerClassName,
  type = 'text',
  status = 'idle',
  ...props
}: LabeledInputProps) {
  return (
    <div className={cn('flex flex-col items-center gap-1', containerClassName)}>
      <input
        type={type}
        className={cn(
          'text-center border-b-2 border-stone-900 placeholder:text-stone-300 rounded-xs focus:bg-primary-50 active:border-primary-900 focus:outline-2 focus-visible:outline-2 focus:border-primary-900 outline-primary-600 outline-offset-0 focus:z-10 disabled:cursor-text',
          variant === 'title' && 'text-3xl font-bold min-w-96 w-96 h-full',
          variant === 'regular' && 'min-w-20 w-20',
          status === 'error' && 'border-red-500',
          className
        )}
        {...props}
      />
      { label &&
        <label className={cn(
          'text-xs whitespace-nowrap text-nowrap text-ellipsis select-none',
          status === 'error' ? 'text-red-500' : 'text-stone-500',
          status === 'saving' && 'animate-pulse',
          status === 'saved' && 'text-green-600'
        )}>
          { status === 'saved'
            ? <span key="saved" className='animate-in fade-in-40 duration-300'>saved</span>
            : <span key="label" className='animate-in fade-in-40 duration-300'>{ label }</span>
          }
        </label>
      }
    </div>
  );
}
