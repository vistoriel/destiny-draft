import { CharacterHeader } from "@/components/character";
import { RaisedLink } from "@/components/ui";
import { Backpack, House, NotebookText, Star, TableProperties } from "lucide-react";

export default function CharacterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <CharacterHeader className="px-12 pb-6 border-b border-stone-200"/>
      <aside className="relative">
        <nav className="absolute flex flex-col gap-2 right-full -top-16.25 py-2 mr-2 bg-stone-50 shadow-lg border border-stone-200">
          <RaisedLink className="mx-2" href="/draft/the-light-of-moroklyn" title="Back to Draft">
            <House />
          </RaisedLink>
          <hr className="w-full border-t border-stone-200" />
          <RaisedLink className="mx-2" href="/draft/the-light-of-moroklyn/orysa-krucunska" title="Details">
            <NotebookText />
          </RaisedLink>
          <RaisedLink className="mx-2" href="/draft/the-light-of-moroklyn/orysa-krucunska/specialties" title="Specialties">
            <TableProperties />
          </RaisedLink>
          <RaisedLink className="mx-2" href="/draft/the-light-of-moroklyn/orysa-krucunska/features" title="Features">
            <Star />
          </RaisedLink>
          <RaisedLink className="mx-2" href="/draft/the-light-of-moroklyn/orysa-krucunska/inventory" title="Inventory">
            <Backpack />
          </RaisedLink>
        </nav>
      </aside>
      { children }
    </>
  );
}