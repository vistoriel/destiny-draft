import z from 'zod';

export const DraftSchema = z.object({
  title: z.string().min(2).max(64),
  master_name: z.string().min(2).max(32),
  description: z.string().max(512).optional(),
  world: z.string().max(32).optional(),
  basic_cards: z.number().min(0),
  basic_experience: z.number().min(0),
});

export type DraftInput = z.input<typeof DraftSchema>;
export type DraftOutput = z.output<typeof DraftSchema>;
