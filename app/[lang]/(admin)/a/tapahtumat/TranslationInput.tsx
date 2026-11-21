"use client"

import Alert from "@/components/Alert/Alert"
import { useState, type ReactNode } from "react"
import {
  Controller,
  get,
  useFormContext,
  type ControllerRenderProps,
  type FieldValues,
} from "react-hook-form"
import { useTranslation } from "@/app/i18n/client"

const LANGUAGES = [
  { code: "fi", label: "finnish" },
  { code: "en", label: "english" },
] as const

type TranslationInputProps = {
  name: string
  field: string
  render: (props: ControllerRenderProps<FieldValues, string>) => ReactNode
}

export function TranslationInput({
  name,
  field,
  render,
}: TranslationInputProps) {
  const { t } = useTranslation()
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext()
  const [active, setActive] = useState(0)

  return (
    <div>
      <div role="tablist">
        {LANGUAGES.map((lang, i) => {
          const hasError = !!get(errors, `${name}.${i}.${field}`)
          return (
            <button
              key={lang.code}
              type="button"
              role="tab"
              aria-selected={active === i}
              onClick={() => setActive(i)}
            >
              {t(`luoTapahtuma.language.${lang.label}`)}
              {hasError ? " ⚠" : ""}
            </button>
          )
        })}
      </div>

      {LANGUAGES.map((lang, i) => (
        <div key={lang.code} hidden={active !== i}>
          <input
            type="hidden"
            defaultValue={lang.code}
            {...register(`${name}.${i}.locale`)}
          />
          <Controller
            control={control}
            name={`${name}.${i}.${field}`}
            render={({ field: f, fieldState }) => (
              <>
                {render(f)}
                {fieldState.error && <Alert>{fieldState.error.message}</Alert>}
              </>
            )}
          />
        </div>
      ))}
    </div>
  )
}
