import z from "zod";

const emptyStringToUndefined = z.literal("").transform(() => undefined);

export const CreateCharacterSchema = z.object({
  name: z.union([emptyStringToUndefined, z.string().min(2).max(64)]).optional(),
  player_name: z.union([emptyStringToUndefined, z.string().min(2).max(32)]).optional(),
}).refine(data => data.name || data.player_name, {
  message: "Either name or player_name is required",
  path: ["player_name"]
});

export const CreateDraftSchema = z.object({
  draft: z.object({
    title: z.string().min(2).max(64),
    master_name: z.string().min(2).max(32),
    description: z.string().max(512).optional(),
    world: z.string().max(32).optional(),
    basic_cards: z.number().min(0),
    basic_experience: z.number().min(0),
  }),
  characters: z.array(CreateCharacterSchema),
});

export type CreateCharacterProps = z.infer<typeof CreateCharacterSchema>;
export type CreateDraftProps = z.infer<typeof CreateDraftSchema>;

export type CreateCharacterInput = z.input<typeof CreateCharacterSchema>;
export type CreateDraftInput = z.input<typeof CreateDraftSchema>;

export type CreateCharacterOutput = z.output<typeof CreateCharacterSchema>;
export type CreateDraftOutput = z.output<typeof CreateDraftSchema>;
