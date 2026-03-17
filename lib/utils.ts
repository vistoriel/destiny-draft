import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getChangedFields<T extends Record<string, unknown>>(newRow: T, oldRow: Partial<T>): Partial<T> {
  const changes: Partial<T> = {};
  for (const key in newRow) {
    if (newRow[key] !== oldRow[key]) {
      changes[key] = newRow[key];
    }
  }
  return changes;
}
