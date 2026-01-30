import { cn } from "@/lib/utils";

export function Player({ position, className }: { position: number, className?: string }) {
  return (
    <div 
      className={cn("w-full flex items-center gap-0.5", className)}
    >
      <div className="flex items-center">
        <hr className="h-3 border border-stone-900 rounded-xs" />
      </div>
      <input 
        type="text" 
        className="w-full text-center border-2 p-1 rounded-xs font-bold placeholder:text-stone-300 active:border-primary-900 focus:bg-primary-50 focus:outline-2 focus-visible:outline-2 focus:border-primary-900 outline-primary-600 outline-offset-0 focus:z-10"
        placeholder={`${position} Character name`}
      />
      <div className="flex items-center">
        <hr className="h-3 border border-stone-900 rounded-xs" />
      </div>
      <input 
        type="text" 
        className="w-64 text-center border-2 p-1 rounded-xs placeholder:text-stone-300 active:border-primary-900 focus:bg-primary-50 focus:outline-2 focus-visible:outline-2 focus:border-primary-900 outline-primary-600 outline-offset-0 focus:z-10"
        placeholder={`${position} Player name`}
      />
      <div className="flex items-center">
        <hr className="h-3 border border-stone-900 rounded-xs" />
      </div>
    </div>
  );
}
