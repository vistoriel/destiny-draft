import { cn } from "@/lib/utils";

function ExperienceNode({ 
  level, 
  className,
  placeholder 
}: { 
  level: 1 | 2 | 3; 
  className?: string;
  placeholder?: string;
}) {
  return (
    <div className={cn("flex w-full relative group", className)}>
       {/* Level Bars - "II" etc visual */}
      <div className="flex shrink-0 gap-0.5 mr-1 items-stretch py-0.5">
        {Array.from({ length: level }).map((_, i) => (
          <div key={i} className="w-0.75 bg-stone-900 h-full" />
        ))}
      </div>
      
      {/* Input Field */}
      <input 
        type="text" 
        className="flex-1 w-full h-10 border-2 border-stone-900 bg-transparent px-2 text-center font-bold text-stone-900 placeholder:text-stone-400/50 placeholder:font-normal focus:outline-none focus:bg-stone-50"
        placeholder={placeholder}
      />

      {/* Checkbox */}
      <div className="relative w-10 h-10 ml-1 border-2 border-stone-900 shrink-0 flex items-center justify-center cursor-pointer hover:bg-stone-50 transition-colors">
        <input 
          type="checkbox"
          className="peer appearance-none absolute inset-0 w-full h-full cursor-pointer z-10"
        />
        {/* Custom Check Indicator */}
        <span className="text-2xl font-bold leading-none hidden peer-checked:block pointer-events-none select-none pb-1">
          +
        </span>
      </div>
    </div>
  );
}

export function GeminiCharacterExperiences({ className }: { className?: string }) {
  return (
    <section className={cn('flex flex-col items-center w-full', className)}>
      {/* Level 1 (Root) */}
      <div className="w-full max-w-lg z-10">
         <ExperienceNode level={1} placeholder="I Experience" />
      </div>
      
      {/* Tree Connectors Area */}
      {/* This area connects the bottom of L1 to the tops of L2s */}
      <div className="w-full relative h-6">
        {/* Vertical Line from Root Component Center Down */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-full bg-stone-900" />
        
        {/* Horizontal Bar connecting the centers of the outer columns */}
        {/* We position this at the bottom of this spacer, aligning with the start of the L2 vertical drops */}
        <div className="absolute bottom-0 left-[16.66%] right-[16.66%] h-0.5 bg-stone-900" />
      </div>

      {/* Level 2 Columns */}
      <div className="grid grid-cols-3 gap-4 w-full">
         {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center relative">
               {/* Connector Line from the Horizontal Bar (Top) to the Node */}
               <div className="w-0.5 h-4 bg-stone-900" /> 
               
               {/* L2 Node */}
               <ExperienceNode level={2} placeholder="II Experience" className="mb-0" />
               
               {/* Vertical Connector to Children */}
               <div className="w-0.5 h-4 bg-stone-900" />

               {/* L3 Nodes Stack */}
               <div className="flex flex-col gap-2 w-full">
                  <ExperienceNode level={3} placeholder="III Experience" />
                  <ExperienceNode level={3} placeholder="III Experience" />
                  <ExperienceNode level={3} placeholder="III Experience" />
               </div>
            </div>
         ))}
      </div>
    </section>
  )
}
