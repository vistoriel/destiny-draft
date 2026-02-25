'use client';

import { TextareaHTMLAttributes, useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface LabeledTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  containerClassName?: string;
  error?: string;
  saveStatus?: 'idle' | 'saving' | 'saved' | 'error';
}

export function LabeledTextarea({
  label,
  className,
  containerClassName,
  error,
  saveStatus = 'idle',
  ...props
}: LabeledTextareaProps) {
  const [showStatus, setShowStatus] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (saveStatus === 'saved') {
      setShowStatus(true);
      timeoutRef.current = setTimeout(() => {
        setShowStatus(false);
      }, 2000);
    } else if (saveStatus === 'idle') {
      setShowStatus(false);
    } else {
      setShowStatus(true);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [saveStatus]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const getStatusText = () => {
    if (saveStatus === 'saving') return 'saving...';
    if (saveStatus === 'saved') return '• saved';
    if (saveStatus === 'error') return '• error';
    return '';
  };

  const getStatusColor = () => {
    if (saveStatus === 'saving') return 'text-stone-400';
    if (saveStatus === 'saved') return 'text-green-600';
    if (saveStatus === 'error') return 'text-red-500';
    return '';
  };

  return (
    <div className={cn('flex flex-col items-center gap-1', containerClassName)}>
      <textarea
        className={cn(
          'block w-full h-60 leading-snug resize-none p-1.5 placeholder:text-stone-300 border-2 border-stone-900 rounded-xs cursor-text active:border-primary-900 focus:bg-primary-50 focus:outline-2 outline-primary-600 focus:z-10 outline-offset-0',
          error && 'border-red-500',
          className
        )}
        {...props}
      />
      { (label || error || showStatus) &&
        <label className={cn(
          'text-xs whitespace-nowrap text-nowrap text-ellipsis',
          error ? 'text-red-500' : 'text-stone-500'
        )}>
          {error ? error : label}
          {showStatus && (
            <span className={cn('ml-2', getStatusColor())}>
              {getStatusText()}
            </span>
          )}
        </label>
      }
    </div>
  );
}
