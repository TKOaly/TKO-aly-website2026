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

export const TRANSLATION_INPUT_LANGUAGES = [
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
  const hasError = (langIndex: number) =>
    !!get(errors, `${name}.${langIndex}.${field}`)

  return (
    <div>
      <LanguageTabs active={active} onChange={setActive} hasError={hasError} />

      {TRANSLATION_INPUT_LANGUAGES.map((lang, i) => (
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
                {!!fieldState.error?.message && (
                  <Alert>{t(fieldState.error.message)}</Alert>
                )}
              </>
            )}
          />
        </div>
      ))}
    </div>
  )
}

type LanguageTabsProps = {
  active: number
  onChange: (index: number) => void
  hasError?: (index: number) => boolean
}

export const LanguageTabs = ({
  active,
  onChange,
  hasError,
}: LanguageTabsProps) => {
  const { t } = useTranslation()

  return (
    <div role="tablist">
      {TRANSLATION_INPUT_LANGUAGES.map((lang, i) => (
        <button
          key={lang.code}
          type="button"
          role="tab"
          aria-selected={active === i}
          onClick={() => onChange(i)}
        >
          {t(`luoTapahtuma.language.${lang.label}`)}
          {hasError?.(i) ? " ⚠" : ""}
        </button>
      ))}
    </div>
  )
}
