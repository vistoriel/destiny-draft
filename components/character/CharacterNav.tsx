import { Backpack, House, NotebookText, Star, TableProperties } from "lucide-react";
import { RaisedLink } from "../ui";

export type CharacterNavProps = {
  draftId: string;
  characterId: string;
};

export function CharacterNav({ draftId, characterId }: CharacterNavProps) {
  return (
    <nav className="absolute flex flex-col gap-2 right-full -top-16.25 py-2 mr-2 bg-stone-50 shadow-lg border border-stone-200">
      <RaisedLink className="mx-2" href={`/draft/${draftId}`} title="Back to Draft">
        <House />
      </RaisedLink>
      <hr className="w-full border-t border-stone-200" />
      <RaisedLink className="mx-2" href={`/draft/${draftId}/${characterId}`} title="Details">
        <NotebookText />
      </RaisedLink>
      <RaisedLink className="mx-2" href={`/draft/${draftId}/${characterId}/specialties`} title="Specialties">
        <TableProperties />
      </RaisedLink>
      <RaisedLink className="mx-2" href={`/draft/${draftId}/${characterId}/features`} title="Features">
        <Star />
      </RaisedLink>
      <RaisedLink className="mx-2" href={`/draft/${draftId}/${characterId}/inventory`} title="Inventory">
        <Backpack />
      </RaisedLink>
    </nav>
  );
}
