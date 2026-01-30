import { cn } from "@/lib/utils";
import { Player } from "./Player";

export function GameCharacters({ className }: { className?: string }) {
  return (
    <section className={cn('flex flex-col gap-2', className)}>
      {Array.from({ length: 4 }).map((_, positionIdx) => (
        <Player position={positionIdx + 1} key={positionIdx} />
      ))}
    </section>
  )
}
