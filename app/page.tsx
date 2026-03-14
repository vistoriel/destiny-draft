"use client";

import { DraftHeader, DraftPlayers, CreateDraftForm } from "@/components/draft";
import { RaisedButton } from "@/components/ui/RaisedButton";
import { ChevronDown, Guitar, PenTool, Swords } from "lucide-react";

export default function Home() {
  return (
    <>
      <div className="mx-auto mt-36 mb-6 flex flex-col items-center gap-6 text-center">
        <div className="flex gap-4 text-stone-900">
          <PenTool size={48} />
          <Swords size={48} />
          <Guitar size={48} />
        </div>
        <h1 className="text-5xl font-bold text-stone-900">
          Here&apos;s the beginning <br />
          of your journey with Destiny
        </h1>
        <p className="w-180 text-stone-700">
          No more wrestling with spreadsheets or scribbling on napkins. We make setting up your next campaign a breeze! Just create a game, send a link to your friends, and watch as your ragtag group of adventurers comes to life.
        </p>
        <ChevronDown size={32} className="text-stone-300"/> 
      </div>
      <main className="w-209 mx-auto bg-background py-12 shadow-lg border border-stone-200 flex flex-col">
        <CreateDraftForm>
          {(form, fieldArray) => (
            <>
              <DraftHeader className="px-12" register={form.register} fieldPrefix="draft" isMaster/>
              <DraftPlayers className="px-12 pt-6" register={form.register} fieldArray={fieldArray} />
              <footer className="flex justify-center items-center gap-1 px-12 pt-8">
                <div className="flex items-center">
                  <hr className="h-3 border border-stone-900 rounded-xs" />
                </div>
                <hr className="w-full border border-dashed border-stone-900 rounded-xs" />
                <RaisedButton className="shrink-0" type="submit">
                  Create a Draft
                </RaisedButton>
                <hr className="w-full border border-dashed border-stone-900 rounded-xs" />
                <div className="flex items-center">
                  <hr className="h-3 border border-stone-900 rounded-xs" />
                </div>
              </footer>
            </>
          )}
        </CreateDraftForm>
      </main>
    </>
  );
}
