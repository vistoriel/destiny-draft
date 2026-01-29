export function RaisedButton({ children }: { children?: React.ReactNode }) {
  return (
    <button className="group mt-0.5 relative bg-image-sketch font-bold rounded-md cursor-pointer border-b border-stone-900 hover:outline-2 focus-visible:outline-2 hover:border-primary-900 outline-primary-600">
      <span className="relative -top-0.5 active:top-0 block bg-stone-50 p-2 rounded-md border-2 border-stone-900 group-active:border-primary-900">
        { children }
      </span>
    </button>
  )
}
