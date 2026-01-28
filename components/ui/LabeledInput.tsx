import { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface LabeledInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  variant?: 'title' | 'regular';
  containerClassName?: string;
}

export function LabeledInput({
  label,
  variant = 'regular',
  className,
  containerClassName,
  ...props
}: LabeledInputProps) {
  return (
    <div className={cn('flex flex-col items-center gap-1', containerClassName)}>
      <input
        type="text"
        className={cn(
          'text-center border-b-2 border-stone-900 placeholder:text-stone-300 active:border-amber-900 focus:outline-2 focus-visible:outline-2 focus:border-amber-900 outline-amber-600 outline-offset-0 focus:z-10',
          variant === 'title' && 'text-3xl font-bold min-w-96 w-96',
          variant === 'regular' && 'min-w-20 w-20',
          className
        )}
        {...props}
      />
      <label className="text-xs text-stone-500 whitespace-nowrap text-nowrap">{label}</label>
    </div>
  );
}
