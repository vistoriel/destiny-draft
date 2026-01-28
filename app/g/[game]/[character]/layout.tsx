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
      <footer className="px-12 flex flex-col items-center gap-2 mt-6 mb-12">
        <span className="block text-xs text-stone-400">
          Destiny Draft · 2026 · Made with &lt;3 by <a className="text-amber-500 underline" href="https://github.com/vistoriel" target="_blank" rel="noopener noreferrer">vistoriel</a>
        </span>
      </footer>
    </>
  );
}