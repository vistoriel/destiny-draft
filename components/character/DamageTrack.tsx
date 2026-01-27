export function DamageTrack() {
  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center">
        <div className="w-9 h-9 flex justify-center items-center border-2 border-stone-900">MD</div>
        <div className="w-9 h-9 flex justify-center items-center border-2 border-stone-900">I</div>
        <div className="w-9 h-9 flex justify-center items-center border-2 border-stone-900">II</div>
        <div className="w-9 h-9 flex justify-center items-center border-2 border-stone-900">III</div>
        <div className="w-9 h-9 flex justify-center items-center border-2 border-stone-900">IV</div>
        <div className="w-12 h-12 flex justify-center items-center border-2 border-stone-900">D</div>
        <div className="w-9 h-9 flex justify-center items-center border-2 border-stone-900">IV</div>
        <div className="w-9 h-9 flex justify-center items-center border-2 border-stone-900">III</div>
        <div className="w-9 h-9 flex justify-center items-center border-2 border-stone-900">II</div>
        <div className="w-9 h-9 flex justify-center items-center border-2 border-stone-900">I</div>
        <div className="w-9 h-9 flex justify-center items-center border-2 border-stone-900">MD</div>
      </div>
      <div className="flex justify-between">
        <span className="text-xs text-stone-500">mental damage</span>
        <span className="text-xs text-stone-500">physical damage</span>
      </div>
    </div>
  )
}
