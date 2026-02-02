import z from "zod";

export const CreateCharacterSchema = z.object({
  character_name: z.string().min(2).max(64).optional(),
  player_name: z.string().min(2).max(32).optional(),
}).refine(data => data.character_name || data.player_name, {
  message: "Either character_name or player_name is required",
  path: ["player_name"] // path of error
});

export const CreateDraftSchema = z.object({
  draft: z.object({
    title: z.string().min(2).max(64),
    master_name: z.string().min(2).max(32),
    description: z.string().max(512).optional(),
    world: z.string().max(32).optional(),
    basic_cards: z.number().min(0).optional().default(3),
    basic_experience: z.number().min(0).optional().default(50),
  }),
  characters: z.array(CreateCharacterSchema),
});

export type CreateCharacterProps = z.infer<typeof CreateCharacterSchema>;
export type CreateDraftProps = z.infer<typeof CreateDraftSchema>;