import Image from "next/image";
import { LabeledInput } from "../ui";
import { DamageTrack } from "./DamageTrack";
import { ShockTrack } from "./ShockTrack";
import { cn } from "@/lib/utils";

export function CharacterHeader({ className }: { className?: string }) {
  return (
    <header className={cn('flex flex-col gap-4', className)}>
      <div className="flex gap-4">
        <Image 
          className="border-2 border-stone-900 w-54.5 h-54.5 object-cover"
          src="/character-image.png"
          width={428} 
          height={428}
          alt="Character Image"
        />
        <div className="flex flex-col gap-4">
          <div className="flex items-end gap-4">
            <LabeledInput variant="title" label="character's name" placeholder="Unknown Character" defaultValue={'Orysá Krucynsíka'} />
            <LabeledInput label="player's name" className="w-26" placeholder="Player" defaultValue={'Ruby'} />
          </div>
          <DamageTrack/>
          <ShockTrack/>
        </div>
      </div>
      <div className="flex items-end gap-4">
        <LabeledInput label="role" className="w-54.5" containerClassName="mr-auto" placeholder="Mystic" />
        <LabeledInput label="sign" placeholder="Gemini" />
        <LabeledInput label="cards" placeholder="3" />
        <LabeledInput label="experience" defaultValue={'38 / 50'} />
      </div>
    </header>
  )
}