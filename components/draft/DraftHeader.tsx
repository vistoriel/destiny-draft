"use client";
import Image from "next/image";
import { LabeledInput, LabeledTextarea } from "../ui";
import { cn } from "@/lib/utils";
import { UseFormRegister, FieldValues, Path } from "react-hook-form";

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface DraftHeaderProps<T extends FieldValues> {
  className?: string;
  register: UseFormRegister<T>;
  isMaster?: boolean;
  saveStatuses?: {
    [key: string]: SaveStatus;
  };
  fieldPrefix?: string;
}

export function DraftHeader<T extends FieldValues>({ 
  className, 
  register,
  isMaster = true,
  saveStatuses = {},
  fieldPrefix = '',
}: DraftHeaderProps<T>) {
  const getFieldName = (field: string): Path<T> => 
    (fieldPrefix ? `${fieldPrefix}.${field}` : field) as Path<T>;

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
              disabled={!isMaster}
              saveStatus={saveStatuses?.world || 'idle'}
              {...register(getFieldName("world"))}
            />
            <div className="flex items-end gap-4 w-54.5">
              <LabeledInput 
                className="w-full" 
                label="basic cards" 
                placeholder="3" 
                type="number"
                disabled={!isMaster}
                saveStatus={saveStatuses?.basic_cards || 'idle'}
                {...register(getFieldName("basic_cards"), { valueAsNumber: true })}
              />
              <LabeledInput 
                className="w-full" 
                label="basic experience"
                type="number"
                disabled={!isMaster}
                saveStatus={saveStatuses?.basic_experience || 'idle'}
                {...register(getFieldName("basic_experience"), { valueAsNumber: true })}
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
              disabled={!isMaster}
              saveStatus={saveStatuses?.title || 'idle'}
              {...register(getFieldName("title"))}
            />
            <LabeledInput 
              label="game master" 
              className="w-26" 
              placeholder="Sviatoslav"
              disabled={!isMaster}
              saveStatus={saveStatuses?.master_name || 'idle'}
              {...register(getFieldName("master_name"))}
            />
          </div>
          <LabeledTextarea
            placeholder="The game's short description..."
            label="game's description"
            disabled={!isMaster}
            saveStatus={saveStatuses?.description || 'idle'}
            {...register(getFieldName("description"))}
          />
        </div>
      </div>
    </header>
  )
}
