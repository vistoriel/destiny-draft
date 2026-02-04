import { cn } from "@/lib/utils";
import { Player } from "./Player";
import { UseFormRegister, UseFieldArrayReturn } from "react-hook-form";
import { CreateDraftInput } from "@/lib/schemas";
import { AddPlayerButton } from "./AddPlayerButton";

interface DraftPlayersProps {
  className?: string;
  register?: UseFormRegister<CreateDraftInput>;
  fieldArray?: UseFieldArrayReturn<CreateDraftInput, "characters">;
}

export function DraftPlayers({ className, register, fieldArray }: DraftPlayersProps) {
  const canRemove = (fieldArray?.fields.length ?? 0) > 1;
  const canAdd = (fieldArray?.fields.length ?? 0) < 16;

  const handleAdd = () => {
    if (canAdd && fieldArray) {
      fieldArray.append({ name: undefined, player_name: undefined });
    }
  };

  const handleRemove = (index: number) => {
    if (canRemove && fieldArray) {
      fieldArray.remove(index);
    }
  };

  return (
    <section className={cn('flex flex-col gap-2', className)}>
      {fieldArray?.fields.map((field, index) => (
        <Player
          key={field.id}
          index={index}
          register={register}
          canBeRemoved={canRemove}
          handleRemove={handleRemove}
        />
      ))}
      { canAdd && <AddPlayerButton onClick={handleAdd} /> }
    </section>
  )
}
