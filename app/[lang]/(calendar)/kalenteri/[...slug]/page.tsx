"use client"

import { useEffect, useState, useMemo, use } from "react"
import type { Event, ProcessedEvent, CustomField } from "../types"
import { useTranslation } from "@/app/i18n/client"
import styles from "../Kalenteri.module.css"
import CallToActionButton from "@/components/Buttons/CallToActionButton"
import Checkbox from "@/components/Checkbox/Checkbox"
import Field from "@/components/Field/Field"
import Fieldset from "@/components/Fieldset/Fieldset"
import RadioOption from "@/components/FieldRadioGroup/FieldRadioGroup"
import FieldRadioGroup from "@/components/FieldRadioGroup/FieldRadioGroup"
import Textarea from "@/components/Textarea/Textarea"

const EventRegistrationFromFields = ({
  subject,
  customFields,
}: {
  subject: "self" | "avec"
  customFields: CustomField[] | null
}) => {
  const { t } = useTranslation()
  return (
    <>
      <Fieldset legend={t(`event.registrationFrom.legend.${subject}`)}>
        <Field
          required
          label={t("event.registrationFrom.name")}
          id={`${subject}-name`}
          name={`${subject}-name`}
          type="text"
        />
        <Field
          required
          label={t("event.registrationFrom.email")}
          id={`${subject}-email`}
          name="email"
          type="email"
        />
        <Field
          required
          label={t("event.registrationFrom.phone")}
          id={`${subject}-phone`}
          name={`${subject}-phone`}
          type="tel"
        />
        {customFields &&
          customFields.map(customField => {
            switch (customField.type) {
              case "text": {
                return (
                  <Field
                    label={customField.name}
                    id={`${subject}-${customField.id}`}
                    name={`${subject}-${customField.id}`}
                    type="text"
                  />
                )
              }
              case "textarea": {
                return (
                  <Textarea
                    label={customField.name}
                    id={`${subject}-${customField.id}`}
                  />
                )
              }
              case "checkbox": {
                return (
                  <Checkbox
                    label={customField.name}
                    id={`${subject}-${customField.id}`}
                  />
                )
              }
              case "radio": {
                const options: RadioOption[] = customField.options.map((option) => {{ legend: option, value: option}})
                break (
                  <FieldRadioGroup
                    legend={customField.name}
                    name={`${subject}-${customField.id}`}
                    options={options}
                  />
                )
              }
              default: {
                return <></>
              }
            }
          })}
        <Checkbox
          id={`${subject}-name_can_be_public`}
          name={`${subject}-name_can_be_public`}
        />
        <Checkbox
          required
          id={`${subject}-accepted_privacy_policy`}
          name={`${subject}-accepted_privacy_policy`}
          label={t("event.registrationFrom.privacyPolicy")}
        />
      </Fieldset>
    </>
  )
}

const EventRegistration = ({
  event,
}: {
  event: Event
}) => {
  const [customFields, setCustomFields] = useState<CustomField[] | null>(null)
  const { t } = useTranslation()

  useEffect(() => {
    if (!event.id) return

    fetch(`/api/events/${event.id}/fields`)
      .then(r => {
        if (!r.ok) throw new Error()
        return r.json()
      })
      .then(setCustomFields)
      .catch(() => setCustomFields(null))
  }, [event])

  const updateRegistration = ({}: {}) => {}

  return (
    <>
      <form
        id={"registration"}
        action={updateRegistration}
        className={styles.form}
      >
        <EventRegistrationFromFields
          subject={"self"}
          customFields={customFields}
        />

        {event.avec && (
          <EventRegistrationFromFields
            subject={"avec"}
            customFields={customFields}
          />
        )}
      </form>

      <CallToActionButton form={"registration"}>
        {t("event.registrationFrom.submit")}
      </CallToActionButton>
    </>
  )
}
