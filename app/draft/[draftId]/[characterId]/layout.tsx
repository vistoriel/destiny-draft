import { CharacterHeader } from "@/components/character";
import { CharacterNav } from "@/components/character/CharacterNav";

export type CharacterLayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{
    draftId: string;
    characterId: string;
  }>;
}>;

export default async function CharacterLayout({ children, params }: CharacterLayoutProps) {
  const { draftId, characterId } = await params;

  return (
    <>
      <CharacterHeader className="px-12 pb-6 border-b border-stone-200"/>
      <aside className="relative">
        <CharacterNav draftId={draftId} characterId={characterId} />
      </aside>
      { children }
    </>
  );
}