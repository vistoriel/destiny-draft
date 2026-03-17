"use client";
import Image from "next/image";
import { LabeledInput, LabeledTextarea } from "../ui";
import { cn } from "@/lib/utils";
import { UseFormRegister, FieldValues, Path } from "react-hook-form";
import { DraftRow } from "@/lib/supabase/rows";
import { FieldStatus } from "@/hooks";

interface DraftHeaderProps<T extends FieldValues> {
  className?: string;
  register: UseFormRegister<T>;
  fieldStatuses?: {
    [key: string]: FieldStatus;
  };
  fieldPrefix?: string;
  initialDraft?: DraftRow;
  isMaster?: boolean;
}

export function DraftHeader<T extends FieldValues>({ 
  className, 
  register,
  initialDraft,
  fieldStatuses = {},
  fieldPrefix = '',
  isMaster = false,
}: DraftHeaderProps<T>) {
  const getFieldName = (field: string): Path<T> => 
    (fieldPrefix ? `${fieldPrefix}.${field}` : field) as Path<T>;

  return (
    <header className={cn('flex flex-col gap-4', className)}>
      <div className="flex gap-4">
        <div className="flex flex-col gap-4">
          <Image 
            className="border-2 border-stone-900 bg-stone-800 w-54.5 h-54.5 object-cover rounded-xs"
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
              status={fieldStatuses?.world || 'idle'}
              defaultValue={initialDraft?.world ?? ''}
              {...register(getFieldName("world"))}
            />
            <div className="flex items-end gap-4 w-54.5">
              <LabeledInput 
                className="w-full" 
                label="basic cards" 
                placeholder="3" 
                type="number"
                disabled={!isMaster}
                status={fieldStatuses?.basic_cards || 'idle'}
                defaultValue={initialDraft?.basic_cards ?? 0}
                {...register(getFieldName("basic_cards"), { valueAsNumber: true })}
              />
              <LabeledInput 
                className="w-full" 
                label="basic experience"
                type="number"
                disabled={!isMaster}
                status={fieldStatuses?.basic_experience || 'idle'}
                defaultValue={initialDraft?.basic_experience ?? 0}
                {...register(getFieldName("basic_experience"), { valueAsNumber: true })}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-end gap-4">
            <LabeledInput 
              variant="title" 
              label="title" 
              placeholder="The Light of Moroklyn"
              disabled={!isMaster}
              status={fieldStatuses?.title || 'idle'}
              defaultValue={initialDraft?.title ?? ''}
              {...register(getFieldName("title"))}
            />
            <LabeledInput 
              label="game master" 
              className="w-26" 
              placeholder="Marie"
              disabled={!isMaster}
              status={fieldStatuses?.master_name || 'idle'}
              defaultValue={initialDraft?.master_name ?? ''}
              {...register(getFieldName("master_name"))}
            />
          </div>
          <LabeledTextarea
            placeholder="The game's short description..."
            label="description"
            disabled={!isMaster}
            status={fieldStatuses?.description || 'idle'}
            defaultValue={initialDraft?.description ?? ''}
            {...register(getFieldName("description"))}
          />
        </div>
      </div>
    </header>
  )
}
