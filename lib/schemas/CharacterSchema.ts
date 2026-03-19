import z from 'zod';

export const CharacterSchema = z.object({
  name: z.string().max(64).nullable(),
  player_name: z.string().max(32).nullable(),
  physical_damage: z.number().min(0),
  mental_damage: z.number().min(0),
  shock_level: z.number().min(0).max(9),
  role: z.string().max(32).nullable(),
  sign: z.string().max(32).nullable(),
  extra_cards: z.number().min(0),
  extra_experience: z.number().min(0),
});

export type CharacterInput = z.input<typeof CharacterSchema>;
export type CharacterOutput = z.output<typeof CharacterSchema>;
