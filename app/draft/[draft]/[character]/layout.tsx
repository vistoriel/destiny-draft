import { CharacterHeader } from "@/components/character";

export default function CharacterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <CharacterHeader className="px-12 pb-6"/>
      <div className="relative flex flex-col border-t border-stone-200">
        <aside className="absolute right-full">
          
        </aside>
        { children }
      </div>
    </>
  );
}