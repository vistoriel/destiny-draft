import { DraftHeader } from "@/components/draft";
import { DraftCharacters } from "@/components/draft";

export default function DraftPage() {
  return (
    <>
      <DraftHeader className="px-12 pb-6 border-b border-stone-200" />
      <DraftCharacters className="px-12 pt-6" />
    </>
  );
}