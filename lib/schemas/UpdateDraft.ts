import z from "zod";

/**
 * Individual field schemas for updating draft fields
 * Each field is optional to support per-field autosave updates
 */
export const UpdateDraftTitleSchema = z.string().min(2).max(64);
export type UpdateDraftTitle = z.infer<typeof UpdateDraftTitleSchema>;

export const UpdateDraftMasterNameSchema = z.string().min(2).max(32);
export type UpdateDraftMasterName = z.infer<typeof UpdateDraftMasterNameSchema>;

export const UpdateDraftDescriptionSchema = z.string().max(512).nullable();
export type UpdateDraftDescription = z.infer<typeof UpdateDraftDescriptionSchema>;

export const UpdateDraftWorldSchema = z.string().max(32).nullable();
export type UpdateDraftWorld = z.infer<typeof UpdateDraftWorldSchema>;

export const UpdateDraftBasicCardsSchema = z.number().min(0);
export type UpdateDraftBasicCards = z.infer<typeof UpdateDraftBasicCardsSchema>;

export const UpdateDraftBasicExperienceSchema = z.number().min(0);
export type UpdateDraftBasicExperience = z.infer<typeof UpdateDraftBasicExperienceSchema>;

/**
 * Discriminated union for per-field validation
 * Use this for individual field updates with autosave
 *
 * Environment variable: NEXT_PUBLIC_AUTOSAVE_DELAY_MS
 * Default: 500ms
 * Used by autosave hooks to debounce individual field updates
 */
export const UpdateDraftFieldSchema = z.discriminatedUnion("field", [
  z.object({
    field: z.literal("title"),
    value: UpdateDraftTitleSchema,
  }),
  z.object({
    field: z.literal("master_name"),
    value: UpdateDraftMasterNameSchema,
  }),
  z.object({
    field: z.literal("description"),
    value: UpdateDraftDescriptionSchema,
  }),
  z.object({
    field: z.literal("world"),
    value: UpdateDraftWorldSchema,
  }),
  z.object({
    field: z.literal("basic_cards"),
    value: UpdateDraftBasicCardsSchema,
  }),
  z.object({
    field: z.literal("basic_experience"),
    value: UpdateDraftBasicExperienceSchema,
  }),
]);

export type UpdateDraftField = z.infer<typeof UpdateDraftFieldSchema>;

/**
 * Composite schema for updating all draft fields at once
 */
export const UpdateDraftSchema = z.object({
  title: UpdateDraftTitleSchema.optional(),
  master_name: UpdateDraftMasterNameSchema.optional(),
  description: UpdateDraftDescriptionSchema.optional(),
  world: UpdateDraftWorldSchema.optional(),
  basic_cards: UpdateDraftBasicCardsSchema.optional(),
  basic_experience: UpdateDraftBasicExperienceSchema.optional(),
}).refine(
  data => Object.values(data).some(val => val !== undefined),
  {
    message: "At least one field must be provided for update",
  }
);

export type UpdateDraftInput = z.input<typeof UpdateDraftSchema>;
export type UpdateDraftOutput = z.output<typeof UpdateDraftSchema>;
