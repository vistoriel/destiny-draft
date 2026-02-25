"use client";
import Image from "next/image";
import { LabeledInput, LabeledTextarea } from "../ui";
import { cn } from "@/lib/utils";
import { UseFormRegister } from "react-hook-form";
import { CreateDraftInput } from "@/lib/schemas";

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface DraftHeaderProps {
  className?: string;
  // Create mode props
  register?: UseFormRegister<CreateDraftInput>;
  // Update mode props
  mode?: 'create' | 'update';
  draft?: {
    title: string;
    master_name: string;
    description: string | null;
    world: string | null;
    basic_cards: number;
    basic_experience: number;
  };
  isMaster?: boolean;
  saveStatuses?: {
    [key: string]: SaveStatus;
  };
  onFieldChange?: (fieldName: string, value: string | number) => void;
}

export function DraftHeader({ 
  className, 
  register, 
  mode = 'create',
  draft,
  isMaster = false,
  saveStatuses = {},
  onFieldChange
}: DraftHeaderProps) {
  const isUpdateMode = mode === 'update';

  const handleInputChange = (fieldName: string, value: string | number) => {
    if (onFieldChange) {
      onFieldChange(fieldName, value);
    }
  };

  const handleNumberChange = (fieldName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.valueAsNumber;
    handleInputChange(fieldName, value);
  };

  const handleTextChange = (fieldName: string, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    handleInputChange(fieldName, value);
  };

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
            {isUpdateMode ? (
              <LabeledInput 
                label="world" 
                className="w-54.5" 
                placeholder="The World after Lemmarch"
                value={draft?.world || ''}
                onChange={(e) => handleTextChange('world', e)}
                disabled={!isMaster}
                saveStatus={saveStatuses?.world || 'idle'}
              />
            ) : (
              <LabeledInput 
                label="world" 
                className="w-54.5" 
                placeholder="The World after Lemmarch" 
                {...(register && register("draft.world"))}
              />
            )}
            <div className="flex items-end gap-4 w-54.5">
              {isUpdateMode ? (
                <>
                  <LabeledInput 
                    className="w-full" 
                    label="basic cards" 
                    placeholder="3" 
                    type="number"
                    value={draft?.basic_cards || 0}
                    onChange={(e) => handleNumberChange('basic_cards', e)}
                    disabled={!isMaster}
                    saveStatus={saveStatuses?.basic_cards || 'idle'}
                  />
                  <LabeledInput 
                    className="w-full" 
                    label="basic experience"
                    type="number"
                    value={draft?.basic_experience || 0}
                    onChange={(e) => handleNumberChange('basic_experience', e)}
                    disabled={!isMaster}
                    saveStatus={saveStatuses?.basic_experience || 'idle'}
                  />
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-end gap-4">
            {isUpdateMode ? (
              <>
                <LabeledInput 
                  variant="title" 
                  label="game's name" 
                  placeholder="The Light of Moroklyn"
                  value={draft?.title || ''}
                  onChange={(e) => handleTextChange('title', e)}
                  disabled={!isMaster}
                  saveStatus={saveStatuses?.title || 'idle'}
                />
                <LabeledInput 
                  label="game master" 
                  className="w-26" 
                  placeholder="Sviatoslav"
                  value={draft?.master_name || ''}
                  onChange={(e) => handleTextChange('master_name', e)}
                  disabled={!isMaster}
                  saveStatus={saveStatuses?.master_name || 'idle'}
                />
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
          {isUpdateMode ? (
            <LabeledTextarea
              placeholder="The game's short description..."
              value={draft?.description || ''}
              onChange={(e) => handleTextChange('description', e)}
              disabled={!isMaster}
              label="game's description"
              saveStatus={saveStatuses?.description || 'idle'}
            />
          ) : (
            <LabeledTextarea
              placeholder="The game's short description..."
              label="game's description"
              {...(register && register("draft.description"))}
            />
          )}
        </div>
      </div>
    </header>
  )
}
