import { z } from "zod"

export const EventTranslationSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  locale: z.string().min(1),
})

export const EventTypeTranslationSchema = z.object({
  locale: z.string().min(1),
  event_type: z.string().min(1),
})

export const EventTypeSchema = z.object({
  id: z.number().int().optional(),
  implicit_alcohol_meter: z.number().optional(),
  translations: z.array(EventTypeTranslationSchema),
})

export const LocationTranslationSchema = z.object({
  locale: z.string().min(1),
  location: z.string().min(1),
})

export const LocationSchema = z.object({
  id: z.number().int().optional(),
  map_link: z.url().optional().or(z.literal("")),
  translations: z.array(LocationTranslationSchema),
})

export const CustomFieldTranslationSchema = z.object({
  locale: z.string().min(1),
  name: z.string().min(1),
  options: z.array(z.string()).optional(),
})

export const CustomFieldSchema = z
  .object({
    type: z.enum(["textarea", "radio", "checkbox", "text", ""]).optional(),
    required: z.boolean().optional(),
    translations: z.array(CustomFieldTranslationSchema).optional(),
  })
  .superRefine((field, ctx) => {
    if (field.type === "radio") {
      const translations = field.translations ?? []
      translations.forEach((tr, i) => {
        if (!tr.options?.length) {
          ctx.addIssue({
            code: "custom",
            path: ["translations", i, "options"],
            message: "luoTapahtuma.error.optionsRequired",
          })
        }
      })
    }
  })

export const RegistrationQuotaTranslationSchema = z.object({
  locale: z.string().min(1),
  quota_name: z.string().min(1),
})

export const RegistrationQuotaSchema = z
  .object({
    max_participants: z.number().int().nonnegative().optional(),
    registration_starts: z.coerce.date().optional(),
    registration_ends: z.coerce.date().optional(),
    translations: z.array(RegistrationQuotaTranslationSchema).optional(),
    membership_required: z.boolean().optional(),
    outsiders_allowed: z.boolean().optional(),
    avec_can_attend: z.boolean().optional(),
    hidden: z.boolean().optional(),
    is_main_quota: z.boolean().optional(),
    cancellation_starts: z.coerce.date().optional(),
    cancellation_ends: z.coerce.date().optional(),
    fields: z.array(CustomFieldSchema).optional(),
    price: z.string().optional(),
  })
  .superRefine((q, ctx) => {
    if (
      q.registration_starts &&
      q.registration_ends &&
      q.registration_ends < q.registration_starts
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["registration_ends"],
        message: "luoTapahtuma.error.registrationEndsBeforeStarts",
      })
    }
    if (
      q.cancellation_starts &&
      q.cancellation_ends &&
      q.cancellation_ends < q.cancellation_starts
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["cancellation_ends"],
        message: "luoTapahtuma.error.registrationStartsAfterEnd",
      })
    }
  })

export const EventSchema = z.object({
  id: z.number().int(),
  user_id: z.number().int(),
  starts: z.coerce.date(),
  alcohol_meter: z.number().optional(),
  responsible: z.string().optional(),
  show_responsible: z.boolean().optional(),
  weekly_event: z.boolean().optional(),
  weekly_event_end_time: z.coerce.date().optional(),
  template: z.boolean().optional(),
  translations: z.array(EventTranslationSchema),
  location: LocationSchema,
  eventType: EventTypeSchema,
  fields: z.array(CustomFieldSchema),
  registrationQuotas: z.array(RegistrationQuotaSchema),
})

export const EventFormValuesSchema = EventSchema.omit({
  id: true,
  user_id: true,
  starts: true,
}).extend({
  date: z.string(),
  time: z.string(),
})

export type EventType = z.infer<typeof EventTypeSchema>
export type Location = z.infer<typeof LocationSchema>
export type CustomField = z.infer<typeof CustomFieldSchema>
export type RegistrationQuota = z.infer<typeof RegistrationQuotaSchema>
export type Event = z.infer<typeof EventSchema>
export type EventFormInput = z.input<typeof EventFormValuesSchema>
export type EventFormOutput = z.output<typeof EventFormValuesSchema>
