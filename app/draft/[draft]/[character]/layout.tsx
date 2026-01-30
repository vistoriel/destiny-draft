import { CharacterHeader } from "@/components/character";

export default function CharacterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main className="w-209 mx-auto py-12 shadow-lg border border-stone-200 flex flex-col">
        <CharacterHeader className="px-12 pb-6"/>
        <div className="relative flex flex-col border-t border-stone-200">
          <aside className="absolute right-full">
            
          </aside>
          { children }
        </div>
      </main>
    </>
  );
}