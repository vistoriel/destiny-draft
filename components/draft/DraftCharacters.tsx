import { cn } from "@/lib/utils";
import { UserPlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface DraftCharactersProps {
  className?: string;
}

export function DraftCharacters({ className }: DraftCharactersProps) {
  return (
    <section className={cn('flex flex-col gap-5', className)}>
      <header className="flex gap-1 items-center">
        <h2 className="uppercase mr-1 font-bold text-2xl text-stone-900 whitespace-nowrap text-nowrap">
          Characters
        </h2>
        {/* <div className="w-full flex gap-0.5 items-center">
          <div className="flex items-center">
            <hr className="h-3 border border-stone-900 rounded-xs" />
          </div>
          <hr className="w-full border border-dashed border-stone-900 rounded-xs" />
        </div> */}
        <div className="w-full flex gap-0.5 items-center">
          <hr className="w-full border border-dashed border-stone-900 rounded-xs" />
          <div className="flex items-center">
            <hr className="h-3 border border-stone-900 rounded-xs" />
          </div>
        </div>
        <nav>
          <button
            type="button"
            disabled={!true}
            className={cn(
              "p-1 border-2 border-stone-900 rounded-xs hover:scale-110 focus:scale-110 active:scale-100 focus:outline-2 outline-primary-600 outline-offset-0 focus:z-10 transition-transform",
              true ? "cursor-pointer" : "cursor-not-allowed"
            )}
            title="Add character"
          >
            <UserPlus size={16} />
          </button>
        </nav>
        <div className="flex items-center">
          <hr className="h-3 border border-stone-900 rounded-xs" />
        </div>
      </header>
      <div className="grid grid-cols-4 gap-4">
        { Array.from({ length: 4 }).map((_, index) => (
          <Link key={index} href="#" className="flex flex-col items-center hover:scale-105 focus:scale-105 active:scale-100 focus:outline-2 outline-primary-600 outline-offset-0 focus:z-10 rounded-xs transition-transform">
            <Image 
              className="border-2 border-stone-900 w-full aspect-square object-cover rounded-xs"
              src="/character-image.png"
              width={428} 
              height={428}
              alt="Character Image"
            />
            <h3 className="text-stone-900 font-bold mt-2 border-b-2 border-stone-900 w-full text-center rounded-xs">Orysá Krucynsíka</h3>
            <span className="text-stone-500 text-sm mt-1">Ruby</span>
          </Link>
        ))}
        {/* <button className="flex flex-col items-center hover:scale-105 focus:scale-105 active:scale-100 focus:outline-2 outline-primary-600 outline-offset-0 focus:z-10 rounded-xs transition-transform cursor-pointer">
          <div className="border-2 border-stone-900 w-full aspect-square object-cover rounded-xs">

          </div>
          <h3 className="text-stone-900 font-bold mt-2 border-b-2 border-stone-900 w-full text-center rounded-xs">Orysá Krucynsíka</h3>
          <span className="text-stone-500 text-sm mt-1">Ruby</span>
        </button> */}
      </div>
    </section>
  )
}
