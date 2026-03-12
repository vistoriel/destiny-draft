import { Database } from "@/lib/supabase/database.types";
import { cn } from "@/lib/utils";
import Image from "next/image";

export type CharacterItem = Database['public']['Tables']['characters']['Row'];

export type CharacterProps = {
  className?: string;
  character: CharacterItem;
}
export function Character({ className, character }: CharacterProps) {
  return (
    <article className={cn(
      "flex flex-col items-center rounded-xs",
      className
    )}>
      <Image 
        className="border-2 border-stone-900 w-full aspect-square object-cover rounded-xs"
        src="/character-image.png"
        width={428} 
        height={428}
        alt="Character Image"
      />
      <h3 className="box-content text-stone-900 font-bold mt-2 border-b-2 border-stone-900 w-full text-center rounded-xs min-h-6 text-nowrap whitespace-nowrap text-ellipsis overflow-hidden">
        { character.name ?? 'unknown character' }
      </h3>
      <h4 className="text-stone-500 text-sm mt-1 rounded-xs w-full text-center min-h-5 text-nowrap whitespace-nowrap text-ellipsis overflow-hidden">
        { character.player_name ?? 'unknown player' }
      </h4>
    </article>
  );
}