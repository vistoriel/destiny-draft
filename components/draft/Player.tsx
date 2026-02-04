import { CreateDraftInput } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { Minus } from "lucide-react";
import { UseFormRegister } from "react-hook-form";

interface PlayerProps {
  index: number;
  className?: string;
  canBeRemoved?: boolean;
  handleRemove?: (index: number) => void;
  register?: UseFormRegister<CreateDraftInput>;
}

export function Player({ index, className, canBeRemoved, handleRemove, register }: PlayerProps) {
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
        placeholder={`${index + 1} Character name`}
        {...(register && register(`characters.${index}.name` as const))}
      />
      <div className="flex items-center">
        <hr className="h-3 border border-stone-900 rounded-xs" />
      </div>
      <input 
        type="text" 
        className="w-64 text-center border-2 p-1 rounded-xs placeholder:text-stone-300 active:border-primary-900 focus:bg-primary-50 focus:outline-2 focus-visible:outline-2 focus:border-primary-900 outline-primary-600 outline-offset-0 focus:z-10"
        placeholder={`${index + 1} Player name`}
        {...(register && register(`characters.${index}.player_name` as const))}
      />
      <div className="flex items-center">
        <hr className="h-3 border border-stone-900 rounded-xs" />
      </div>
      <button
        type="button"
        onClick={() => handleRemove && handleRemove(index)}
        disabled={!canBeRemoved}
        className={cn(
          "p-1 border-2 border-stone-900 rounded-xs active:border-primary-900 focus:bg-primary-50 focus:outline-2 focus-visible:outline-2 focus:border-primary-900 outline-primary-600 outline-offset-0 focus:z-10",
          canBeRemoved ? "cursor-pointer" : "cursor-not-allowed"
        )}
        title="Remove character"
      >
        <Minus size={16} />
      </button>
      <div className="flex items-center">
        <hr className="h-3 border border-stone-900 rounded-xs" />
      </div>
    </div>
  );
}
