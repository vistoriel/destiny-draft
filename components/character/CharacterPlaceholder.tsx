import { cn } from "@/lib/utils";

export type CharacterPlaceholderProps = {
  className?: string;
}

export function CharacterPlaceholder({ className }: CharacterPlaceholderProps) {
  return (
    <article className={cn(
      "flex flex-col items-center rounded-xs transition-transform",
      className
    )}>
      <div className="border-2 border-stone-200 w-full aspect-square rounded-xs" />
      <div className="box-content h-6 mt-2 mb-6 border-b-2 border-stone-200 w-full rounded-xs" />
    </article>
  );
}
