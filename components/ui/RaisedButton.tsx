import { cn } from "@/lib/utils";

export function RaisedButton({ children, className }: { children?: React.ReactNode, className?: string }) {
  return (
    <button className={cn(
      "group mt-0.5 relative bg-image-sketch font-bold rounded-md cursor-pointer border-b border-stone-900",
      className
    )}>
      <span className="relative -top-0.5 active:top-0 block uppercase bg-stone-50 p-2 rounded-md border-2 border-stone-900">
        { children }
      </span>
    </button>
  )
}
