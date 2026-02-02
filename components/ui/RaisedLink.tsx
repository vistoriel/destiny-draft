import { cn } from "@/lib/utils";
import Link from "next/link";

export function RaisedLink({ href, children, className, title }: { href: string, children?: React.ReactNode, className?: string, title?: string }) {
  return (
    <Link 
      href={href}
      title={title}
      className={cn(
        "group mt-0.5 relative bg-image-sketch font-bold rounded-md cursor-pointer border-b border-stone-900",
        className
      )}
    >
      <span className="relative -top-0.5 group-active:top-0 block uppercase bg-stone-50 p-2 rounded-md border-2 border-stone-900">
        { children }
      </span>
    </Link>
  )
}
