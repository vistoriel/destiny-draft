'use client';
import { cn } from "@/lib/utils";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";

export function CharacterDetails({ className }: { className?: string }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p></p>',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'block w-full px-2 py-1.5 text-sm focus:outline-none min-h-56',
      },
    },
  });

  return (
    <section className={cn('flex gap-4', className)}>
      <div className="w-full h-fit border-2 border-stone-900">
        <input 
          type="text" 
          className="w-full p-0.5 text-center font-bold border-b-2 border-stone-900"
          placeholder="Section name"
          defaultValue={'Details'}
        />
        <EditorContent editor={editor} />
      </div>
      <div className="w-56 min-h-56 shrink-0 border-2 border-stone-900">
        <h2 className="w-full p-0.5 text-center font-bold border-b-2 border-stone-900">
          Inventory
        </h2>
      </div>
    </section>
  )
}
