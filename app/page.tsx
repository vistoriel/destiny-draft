"use client";

import { CreateDraftForm } from "@/components/draft";
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
        <CreateDraftForm />
      </main>
    </>
  );
}
