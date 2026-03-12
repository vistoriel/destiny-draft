'use client';

import { TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface LabeledTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  containerClassName?: string;
  error?: string;
  status?: 'idle' | 'saving' | 'saved' | 'error';
}

export function LabeledTextarea({
  label,
  className,
  containerClassName,
  status = 'idle',
  ...props
}: LabeledTextareaProps) {
  return (
    <div className={cn('flex flex-col items-center gap-1', containerClassName)}>
      <textarea
        className={cn(
          'block w-full h-60 leading-snug resize-none p-1.5 placeholder:text-stone-300 border-2 border-stone-900 rounded-xs cursor-text active:border-primary-900 focus:bg-primary-50 focus:outline-2 outline-primary-600 focus:z-10 outline-offset-0 disabled:cursor-text',
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
