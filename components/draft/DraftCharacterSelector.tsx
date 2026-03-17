'use client';

import { cn } from "@/lib/utils";
import { Character, CharacterItem } from "../character/Character";
import { CharacterPlaceholder } from "../character/CharacterPlaceholder";
import { selectCharacter } from "@/app/actions/select-character";

interface DraftCharacterSelectorProps {
  className?: string;
  characters: CharacterItem[];
}

export function DraftCharacterSelector({ className, characters }: DraftCharacterSelectorProps) {
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
          Select your character
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
          <button
            key={character.id}
            onClick={async () => await selectCharacter({ characterId: character.id })}
            disabled={character.is_claimed}
            className="rounded-xs not-disabled:hover:scale-105 focus:scale-105 active:scale-100 focus:outline-2 outline-primary-600 outline-offset-0 focus:z-10 cursor-pointer transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Character character={character} />
          </button>
        ))}
        { Array.from({ length: (4 - characters.length % 4) % 4 }, (_, index) => (
          <CharacterPlaceholder key={index} />
        ))}
      </div>
    </section>
  )
}
