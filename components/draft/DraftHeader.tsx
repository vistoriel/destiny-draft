"use client";
import Image from "next/image";
import { LabeledInput } from "../ui";
import { cn } from "@/lib/utils";
import { UseFormRegister } from "react-hook-form";
import { CreateDraftInput } from "@/lib/schemas";

interface DraftHeaderProps {
  className?: string;
  register?: UseFormRegister<CreateDraftInput>;
}

export function DraftHeader({ className, register }: DraftHeaderProps) {
  return (
    <header className={cn('flex flex-col gap-4', className)}>
      <div className="flex gap-4">
        <div className="flex flex-col gap-4">
          <Image 
            className="border-2 border-stone-900 w-54.5 h-54.5 object-cover rounded-xs"
            src="/game-image.jpeg"
            width={428} 
            height={428}
            alt="Character Image"
          />
          <div className="flex flex-col gap-2">
            <LabeledInput 
              label="world" 
              className="w-54.5" 
              placeholder="The World after Lemmarch" 
              {...(register && register("draft.world"))}
            />
            <div className="flex items-end gap-4 w-54.5">
              <LabeledInput 
                className="w-full" 
                label="basic cards" 
                placeholder="3" 
                type="number"
                {...(register && register("draft.basic_cards", { valueAsNumber: true }))}
              />
              <LabeledInput 
                className="w-full" 
                label="basic experience"
                type="number"
                {...(register && register("draft.basic_experience", { valueAsNumber: true }))}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-end gap-4">
            <LabeledInput 
              variant="title" 
              label="game's name" 
              placeholder="The Light of Moroklyn"
              {...(register && register("draft.title"))}
            />
            <LabeledInput 
              label="game master" 
              className="w-26" 
              placeholder="Sviatoslav"
              {...(register && register("draft.master_name"))}
            />
          </div>
          <div className="flex flex-col gap-1 items-center">
            <textarea
              className="block w-full h-60 leading-snug resize-none p-1.5 placeholder:text-stone-300 border-2 border-stone-900 rounded-xs cursor-text active:border-primary-900 focus:bg-primary-50 focus:outline-2 outline-primary-600 focus:z-10 outline-offset-0"
              placeholder="The game's short description..."
              {...(register && register("draft.description"))}
            />
            <label className="text-xs text-stone-500 whitespace-nowrap text-nowrap">game&apos;s description</label>
          </div>
        </div>
      </div>
    </header>
  )
}
