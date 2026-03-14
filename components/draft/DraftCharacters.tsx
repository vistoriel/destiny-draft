import { cn } from "@/lib/utils";
import { CharacterPlaceholder } from "../character/CharacterPlaceholder";
import { Character, CharacterItem } from "../character/Character";
import Link from "next/link";
import { useIdentityContext } from "./IdentityContext";

interface DraftCharactersProps {
  className?: string;
  characters: CharacterItem[];
}

export function DraftCharacters({ className, characters }: DraftCharactersProps) {
  const { userType } = useIdentityContext();
  return (
    <section className={cn('flex flex-col gap-5', className)}>
      <header className="flex gap-1 items-center">
        <div className="w-full flex gap-0.5 items-center">
          <div className="flex items-center">
            <hr className="h-3 border border-stone-900 rounded-xs" />
          </div>
          <hr className="w-full border border-dashed border-stone-900 rounded-xs" />
        </div>
        <h2 className="uppercase mr-1 font-bold text-2xl text-stone-900 whitespace-nowrap text-nowrap">
          Characters
        </h2>
        <div className="w-full flex gap-0.5 items-center">
          <hr className="w-full border border-dashed border-stone-900 rounded-xs" />
          <div className="flex items-center">
            <hr className="h-3 border border-stone-900 rounded-xs" />
          </div>
        </div>
      </header>
      <div className="grid grid-cols-4 gap-4">
        { characters.map((character) => (
          userType.type === 'player' && userType.character_id !== character.id
            ? <Character key={character.id} character={character} className="opacity-50 cursor-not-allowed" />
            : <Link
              key={character.id}
              href={`/draft/${character.draft_id}/${character.id}`}
              className="rounded-xs hover:scale-105 focus:scale-105 active:scale-100 focus:outline-2 outline-primary-600 outline-offset-0 focus:z-10 cursor-pointer transition-transform"
            >
              <Character character={character} />
            </Link>
        ))}
        { Array.from(
          { length: userType.type === 'master' ? 4 - characters.length % 4 : (4 - characters.length % 4) % 4 }, 
          (_, index) => (
            <CharacterPlaceholder key={index} />
          )
        )}
      </div>
    </section>
  )
}
