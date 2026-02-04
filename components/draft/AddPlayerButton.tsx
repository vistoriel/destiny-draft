import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { ButtonHTMLAttributes } from "react";

export function AddPlayerButton({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn("w-full flex items-center gap-0.5 cursor-pointer", className)}
      {...props}
    >
      <div className="flex items-center">
        <hr className="h-3 border border-stone-900 rounded-xs" />
      </div>
      <div className="w-full text-center border-2 p-1 rounded-xs font-bold placeholder:text-stone-300 active:border-primary-900 focus:bg-primary-50 focus:outline-2 focus-visible:outline-2 focus:border-primary-900 outline-primary-600 outline-offset-0 focus:z-10">
        Add Character
      </div>
      <div className="flex items-center">
        <hr className="h-3 border border-stone-900 rounded-xs" />
      </div>
      <div
        className="p-1 border-2 border-stone-900 rounded-xs"
      >
        <Plus size={16} />
      </div>
      <div className="flex items-center">
        <hr className="h-3 border border-stone-900 rounded-xs" />
      </div>
    </button>
  );
}
