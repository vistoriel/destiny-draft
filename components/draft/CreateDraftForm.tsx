"use client";

import { useForm, UseFormReturn, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateDraftSchema, CreateDraftProps, CreateDraftInput } from "@/lib/schemas";
import { createDraft } from "@/app/actions/create-draft";

interface CreateDraftFormProps {
  children: (form: UseFormReturn<CreateDraftInput>, fieldArray: ReturnType<typeof useFieldArray<CreateDraftInput, "characters">>) => React.ReactNode;
}

export function CreateDraftForm({ children }: CreateDraftFormProps) {
  const form = useForm<CreateDraftInput>({
    resolver: zodResolver(CreateDraftSchema),
    defaultValues: {
      draft: {
        title: undefined,
        master_name: undefined,
        description: undefined,
        world: undefined,
        basic_cards: 3,
        basic_experience: 50,
      },
      characters: [
        { name: undefined, player_name: undefined },
        { name: undefined, player_name: undefined },
        { name: undefined, player_name: undefined },
        { name: undefined, player_name: undefined },
      ],
    },
  });

  const fieldArray = useFieldArray({
    control: form.control,
    name: "characters",
  });

  const onSubmit = async (data: CreateDraftInput) => {
    // Filter out empty characters
    const filteredData = {
      ...data,
      characters: data.characters.filter(c => c.name || c.player_name),
    };
    await createDraft(filteredData as CreateDraftProps);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {children(form, fieldArray)}
    </form>
  );
}
