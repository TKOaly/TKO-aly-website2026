import { z } from "zod"

export const eventTranslationSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  locale: z.string().min(1),
})

export const eventTypeTranslationSchema = z.object({
  locale: z.string().min(1),
  event_type: z.string().min(1),
})

export const eventTypeSchema = z.object({
  id: z.number().int().optional(),
  implicit_alcohol_meter: z.number().optional(),
  translations: z.array(eventTypeTranslationSchema),
})

export const locationTranslationSchema = z.object({
  locale: z.string().min(1),
  location: z.string().min(1),
})

export const locationSchema = z.object({
  id: z.number().int().optional(),
  map_link: z.url().optional().or(z.literal("")),
  translations: z.array(locationTranslationSchema),
})

export const customFieldTranslationSchema = z.object({
  locale: z.string().min(1),
  name: z.string().min(1),
  options: z.array(z.string()).optional(),
})

export const customFieldSchema = z
  .object({
    type: z.enum(["textarea", "radio", "checkbox", "text", ""]).optional(),
    required: z.boolean().optional(),
    translations: z.array(customFieldTranslationSchema).optional(),
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

export const registrationQuotaTranslationSchema = z.object({
  locale: z.string().min(1),
  quota_name: z.string().min(1),
})

export const registrationQuotaSchema = z
  .object({
    max_participants: z.number().int().nonnegative().optional(),
    registration_starts: z.coerce.date().optional(),
    registration_ends: z.coerce.date().optional(),
    translations: z.array(registrationQuotaTranslationSchema).optional(),
    membership_required: z.boolean().optional(),
    outsiders_allowed: z.boolean().optional(),
    avec_can_attend: z.boolean().optional(),
    hidden: z.boolean().optional(),
    is_main_quota: z.boolean().optional(),
    cancellation_starts: z.coerce.date().optional(),
    cancellation_ends: z.coerce.date().optional(),
    fields: z.array(customFieldSchema).optional(),
    isPaid: z.string().optional(),
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
    if (q.isPaid == "paid" && !!q.price) {
      ctx.addIssue({
        code: "custom",
        path: ["price"],
        message: "luoTapahtuma.error.required",
      })
    }
  })

export const eventSchema = z.object({
  id: z.number().int().optional(),
  user_id: z.number().int(),
  starts: z.coerce.date(),
  alcohol_meter: z.number().optional(),
  responsible: z.string().optional(),
  show_responsible: z.boolean().optional(),
  weekly_event: z.boolean().optional(),
  weekly_event_end_time: z.coerce.date().optional(),
  template: z.boolean().optional(),
  translations: z.array(eventTranslationSchema),
  location: locationSchema,
  eventType: eventTypeSchema,
  fields: z.array(customFieldSchema),
  registrationQuotas: z.array(registrationQuotaSchema),
})

export const eventsSchema = z.array(eventSchema)

export const eventFormValuesSchema = eventSchema
  .omit({
    id: true,
    user_id: true,
    starts: true,
  })
  .extend({
    date: z.string(),
    time: z.string(),
    isRegistration: z.string(),
  })
  .superRefine((q, ctx) => {
    if (q.isRegistration == "yes" && q.registrationQuotas.length == 0) {
      ctx.addIssue({
        code: "custom",
        path: ["isRegistration"],
        message: "luoTapahtuma.error.oneRegistrationQuotaRequired",
      })
    }
  })

const editEventSchema = z.object({
  id: z.number(),
  name: z.string().nullable(),
  starts: z.string().nullable(),
  location: z.string().nullable(),
  category: z.string().nullable(),
})

export const editEventsSchema = z.array(editEventSchema)

export type EventType = z.infer<typeof eventTypeSchema>
export type Location = z.infer<typeof locationSchema>
export type CustomField = z.infer<typeof customFieldSchema>
export type RegistrationQuota = z.infer<typeof registrationQuotaSchema>
export type Event = z.infer<typeof eventSchema>
export type EventFormInput = z.input<typeof eventFormValuesSchema>
export type EventFormValues = z.infer<typeof eventFormValuesSchema>
export type EditEvent = z.infer<typeof editEventSchema>
