import { cn } from '@/lib/utils';
import TextareaAutosize from 'react-textarea-autosize';

export type SpecialtyLevel = 'I' | 'II' | 'III';

export type SpecialtyProps = {
  level: SpecialtyLevel;
};

export function Specialty({ level }: SpecialtyProps) {
  return (
    <div className="w-full flex items-center gap-0.5">
      <div className="flex items-center">
        { (level === 'I' || level === 'III') &&
          <hr className="h-3 border border-stone-900 rounded-xs" />
        }
        { (level === 'II' || level === 'III') &&
          <div className="flex flex-col pl-0.5 justify-center gap-1">
            <hr className="h-3 border border-stone-900 rounded-xs" />
            <hr className="h-3 border border-stone-900 rounded-xs" />
          </div>
        }
      </div>
      { (level === 'I' || level === 'II')
        ? <input 
          type="text" 
          className={cn(
            'w-full text-center border-2 rounded-xs placeholder:text-stone-300 active:border-primary-900 active:scale-[98%] focus:bg-primary-50 focus:outline-2 focus-visible:outline-2 focus:border-primary-900 outline-primary-600 outline-offset-0 focus:z-10',
            level === 'I' ? 'p-0.5 font-bold' : 'p-1 font-semibold'
          )}
          placeholder={level + ' Specialty'}
        />
        : <label className="h-12 w-full flex items-center border-2 border-stone-900 rounded-xs cursor-text active:scale-[98%] active:border-primary-900 focus-within:bg-primary-50 focus-within:border-primary-900 focus-within:outline-2 outline-primary-600 focus-within:z-10 outline-offset-0">
          <TextareaAutosize
            className="block w-full px-1 py-0.5 text-center leading-tight resize-none outline-none placeholder:text-stone-300"
            maxRows={2}
            placeholder={level + ' Specialty'}
          />
        </label>
      }
      <input 
        type="checkbox"
        className="appearance-none shrink-0 w-7 h-7 border-2 border-stone-900 rounded-xs cursor-pointer relative active:scale-95 active:border-primary-900 focus-visible:outline-2 focus-visible:border-primary-900 outline-primary-600 outline-offset-0 focus-visible:z-10
          checked:after:content-['+'] checked:after:absolute checked:after:text-3xl checked:after:font-semibold checked:after:left-1/2 checked:after:top-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2"
      />
    </div>
  );
}
