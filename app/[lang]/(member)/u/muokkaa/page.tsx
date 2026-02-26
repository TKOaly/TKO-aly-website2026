import CallToActionButton from "@/components/Buttons/CallToActionButton"
import Checkbox from "@/components/Checkbox/Checkbox"
import Field from "@/components/Field/Field"
import FieldSelect from "@/components/FieldSelect/FieldSelect"
import Fieldset from "@/components/Fieldset/Fieldset"
import PageHeader from "@/components/PageHeader/PageHeader"
import { getAsyncTranslation } from "@/app/i18n"

import styles from "./Muokkaa.module.css"

type Props = {
  params: Promise<{ lang: string }>
}

const EditUserPage = async ({ params }: Props) => {
  const { lang } = await params
  const { t } = await getAsyncTranslation(lang)

  return (
    <main className={styles.main}>
      <PageHeader title={t("muokkaa.title")} />

      <form id="edit-user-form" className={styles.form}>
        <Fieldset legend={t("muokkaa.personal.legend")}>
          <Field
            label={t("muokkaa.personal.username")}
            id="username"
            name="username"
            type="text"
            defaultValue="boriss"
            autoComplete="username"
          />

          <Field
            label={t("muokkaa.personal.fullname.label")}
            id="fullname"
            name="fullname"
            type="text"
            defaultValue="boriss jerjomkin"
            autoComplete="name"
            hint={t("muokkaa.personal.fullname.hint")}
          />

          <Field
            label={t("muokkaa.personal.nickname.label")}
            id="nickname"
            name="nickname"
            type="text"
            defaultValue="borre"
            autoComplete="given-name"
            hint={t("muokkaa.personal.nickname.hint")}
          />

          <Field
            label={t("muokkaa.personal.email")}
            id="email"
            name="email"
            type="email"
            defaultValue="boriss.jerjomkin@helsinki.fi"
            autoComplete="email"
          />

          <Field
            label={t("muokkaa.personal.hometown")}
            id="hometown"
            name="hometown"
            type="text"
            defaultValue="helsinki"
          />

          <Field
            label={t("muokkaa.personal.phone")}
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
          />

          <FieldSelect
            label={t("muokkaa.personal.role")}
            id="role"
            name="role"
            defaultValue="user"
            disabled
          >
            <option value="user">{t("muokkaa.personal.roleUser")}</option>
          </FieldSelect>

          <FieldSelect
            label={t("muokkaa.personal.memberType")}
            id="member_type"
            name="member_type"
            defaultValue="jasen"
            disabled
          >
            <option value="jasen">
              {t("muokkaa.personal.memberTypeMember")}
            </option>
            <option value="ulkoinen-jasen">
              {t("muokkaa.personal.memberTypeExternal")}
            </option>
            <option value="ei-jasen">
              {t("muokkaa.personal.memberTypeNone")}
            </option>
          </FieldSelect>

          <Field
            label={t("muokkaa.personal.membershipStart")}
            id="membership_start"
            name="membership_start"
            type="date"
            defaultValue="2025-08-26"
            readOnly
          />

          <div className={styles.passwordGrid}>
            <Field
              label={t("muokkaa.personal.newPassword")}
              id="new_password"
              name="new_password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
            />
            <Field
              label={t("muokkaa.personal.newPasswordConfirm")}
              id="new_password_confirm"
              name="new_password_confirm"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </div>
        </Fieldset>

        <Fieldset legend={t("muokkaa.other.legend")}>
          <div className={styles.checkboxList}>
            <Checkbox
              id="studies_helsinki"
              name="studies_helsinki"
              label={t("muokkaa.other.studiesHelsinki")}
            />
            <Checkbox
              id="studies_cs"
              name="studies_cs"
              label={t("muokkaa.other.studiesCs")}
            />
            <Checkbox
              id="staff"
              name="staff"
              label={t("muokkaa.other.staff")}
            />
            <Checkbox
              id="hyy_member"
              name="hyy_member"
              label={t("muokkaa.other.hyyMember")}
            />
            <Checkbox
              id="interested_cs"
              name="interested_cs"
              label={t("muokkaa.other.interestedCs")}
            />
          </div>
        </Fieldset>

        <p className={styles.privacyNote}>
          <a className={styles.link} href="#">
            {t("muokkaa.privacyLink")}
          </a>
        </p>
      </form>

      <CallToActionButton form="edit-user-form">
        {t("muokkaa.submit")}
      </CallToActionButton>
    </main>
  )
}

export default EditUserPage
