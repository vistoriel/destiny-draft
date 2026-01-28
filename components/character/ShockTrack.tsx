import { HandFist } from "lucide-react";

export function ShockTrack() {
  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center">
        <div className="w-12 h-12 flex justify-center items-center border-2 border-stone-900 rounded-xs">
          <HandFist className="text-stone-900" />
        </div>
        <hr className="border border-stone-900 w-1.5 rounded-xs"/>
        <div className="w-9 h-9 flex justify-center items-center border-2 border-stone-900 rounded-xs">1</div>
        <hr className="border border-stone-900 w-1.5 rounded-xs"/>
        <div className="w-9 h-9 flex justify-center items-center border-2 border-stone-900 rounded-xs">2</div>
        <hr className="border border-stone-900 w-1.5 rounded-xs"/>
        <div className="w-9 h-9 flex justify-center items-center border-2 border-stone-900 rounded-xs">3</div>
        <hr className="border border-stone-900 w-1.5 rounded-xs"/>
        <div className="w-9 h-9 flex justify-center items-center border-2 border-stone-900 rounded-xs">4</div>
        <hr className="border border-stone-900 w-1.5 rounded-xs"/>
        <div className="w-9 h-9 flex justify-center items-center border-2 border-stone-900 rounded-xs">5</div>
        <hr className="border border-stone-900 w-1.5 rounded-xs"/>
        <div className="w-9 h-9 flex justify-center items-center border-2 border-stone-900 rounded-xs">6</div>
        <hr className="border border-stone-900 w-1.5 rounded-xs"/>
        <div className="w-9 h-9 flex justify-center items-center border-2 border-stone-900 rounded-xs">7</div>
        <hr className="border border-stone-900 w-1.5 rounded-xs"/>
        <div className="w-9 h-9 flex justify-center items-center border-2 border-stone-900 rounded-xs">8</div>
        <hr className="border border-stone-900 w-1.5 rounded-xs"/>
        <div className="w-9 h-9 flex justify-center items-center border-2 border-stone-900 rounded-xs">9</div>
      </div>
      <div className="flex justify-center">
        <span className="text-xs text-stone-500">shock level</span>
      </div>
    </div>
  )
}
