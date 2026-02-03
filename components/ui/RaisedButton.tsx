import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

export function RaisedButton({ 
  children, 
  className, 
  title,
  disabled,
  onClick,
  ...props 
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button 
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "group mt-0.5 relative bg-image-sketch font-bold rounded-md border-b border-stone-900",
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
        className
      )}
      {...props}
    >
      <span className={cn(
        "relative -top-0.5 block uppercase bg-stone-50 p-2 rounded-md border-2 border-stone-900",
        !disabled && "group-active:top-0"
      )}>
        { children }
      </span>
    </button>
  )
}
