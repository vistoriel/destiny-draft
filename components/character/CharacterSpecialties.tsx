"use client";
import { cn } from "@/lib/utils";
import { Specialty } from "./Specialty";

export function CharacterSpecialties({ className }: { className?: string }) {
  return (
    <section className={cn('flex flex-col gap-8', className)}>
      {Array.from({ length: 3 }).map((_, levelIdx) => (
      <div key={levelIdx} className="flex flex-col gap-0.5">
        <Specialty level="I" />
        <div className="flex gap-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="flex flex-col gap-0.5 w-full">
              <div className="flex gap-1 justify-center">
                <hr className="h-3 border border-stone-900 rounded-xs" />
              </div>
              <Specialty level="II" />
              <div className="flex gap-1 justify-center">
                <hr className="h-3 border border-stone-900 rounded-xs" />
              </div>
              <div className="flex flex-col gap-1">
                {Array.from({ length: 3 }).map((_, subIdx) => (
                  <Specialty key={subIdx} level="III" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      ))}
    </section>
  )
}
