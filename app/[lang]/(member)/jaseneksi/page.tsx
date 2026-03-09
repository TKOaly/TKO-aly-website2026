import Alert from "@/components/Alert/Alert"
import Card from "@/components/Cards/Card/Card"
import Checkbox from "@/components/Checkbox/Checkbox"
import Field from "@/components/Field/Field"
import Fieldset from "@/components/Fieldset/Fieldset"
import MobileCallToActionButton from "@/components/Buttons/CallToActionButton"
import PageHeader from "@/components/PageHeader/PageHeader"
import { getAsyncTranslation } from "@/app/i18n"

import styles from "./Jaseneksi.module.css"

type Props = {
  params: Promise<{ lang: string }>
}

const MembershipPage = async ({ params }: Props) => {
  const { lang } = await params
  const { t } = await getAsyncTranslation(lang)

  return (
    <main className={styles.main}>
      <PageHeader
        title={t("jaseneksi.title")}
        description={t("jaseneksi.description")}
      />

      <Card>
        <h2 className={styles.cardTitle}>{t("jaseneksi.card.title")}</h2>
        <p className={styles.cardText}>
          {t("jaseneksi.card.1year")} <strong>4,00 EUR</strong>,{" "}
          {t("jaseneksi.card.3years")} <strong>10,00 EUR</strong>,{" "}
          {t("jaseneksi.card.5years")} <strong>15,00 EUR</strong>.
        </p>
        <Alert title="HUOM!">{t("jaseneksi.card.alert")}</Alert>
      </Card>

      {/* Form */}
      <form
        id="membership-form"
        action="#"
        method="post"
        className={styles.form}
      >
        {/* Personal details */}
        <Fieldset legend={t("jaseneksi.personal.legend")}>
          <Field
            required
            label={t("jaseneksi.personal.username.label")}
            id="username"
            name="username"
            type="text"
            placeholder={t("jaseneksi.personal.username.placeholder")}
            autoComplete="username"
          />

          <Field
            required
            label={t("jaseneksi.personal.fullname.label")}
            id="fullname"
            name="fullname"
            type="text"
            placeholder={t("jaseneksi.personal.fullname.placeholder")}
            autoComplete="name"
            hint={t("jaseneksi.personal.fullname.hint")}
          />

          <Field
            required
            label={t("jaseneksi.personal.nickname.label")}
            id="nickname"
            name="nickname"
            type="text"
            placeholder={t("jaseneksi.personal.nickname.placeholder")}
            autoComplete="given-name"
            hint={t("jaseneksi.personal.nickname.hint")}
          />

          <Field
            required
            label={t("jaseneksi.personal.email.label")}
            id="email"
            name="email"
            type="email"
            placeholder={t("jaseneksi.personal.email.placeholder")}
            autoComplete="email"
          />

          <Field
            required
            label={t("jaseneksi.personal.hometown.label")}
            id="hometown"
            name="hometown"
            type="text"
            placeholder={t("jaseneksi.personal.hometown.placeholder")}
          />

          <Field
            label={t("jaseneksi.personal.phone.label")}
            id="phone"
            name="phone"
            type="tel"
            placeholder={t("jaseneksi.personal.phone.placeholder")}
            autoComplete="tel"
          />

          <div className={styles.passwordGrid}>
            <Field
              required
              label={t("jaseneksi.personal.password.label")}
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
            />
            <Field
              required
              label={t("jaseneksi.personal.passwordConfirm.label")}
              id="password-confirm"
              name="password_confirm"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </div>
        </Fieldset>
        {/* Other details */}
        <Fieldset legend={t("jaseneksi.other.legend")}>
          <div className={styles.checkboxList}>
            <Checkbox
              id="studies"
              name="studies_helsinki"
              label={t("jaseneksi.other.studiesHelsinki")}
            />
            <div className={styles.checkboxGroup}>
              <Checkbox
                id="studies_cs"
                name="studies_cs"
                label={t("jaseneksi.other.studiesCs")}
              />
              <Alert title="HUOM!">{t("jaseneksi.other.studiesCsAlert")}</Alert>
            </div>

            <Checkbox
              id="staff"
              name="staff"
              label={t("jaseneksi.other.staff")}
            />

            <Checkbox
              id="hyy_member"
              name="hyy_member"
              label={t("jaseneksi.other.hyyMember")}
            />

            <Checkbox
              id="interested_cs"
              name="interested_cs"
              label={t("jaseneksi.other.interestedCs")}
            />
          </div>
        </Fieldset>
        {/* Privacy */}
        <Fieldset legend={t("jaseneksi.privacy.legend")}>
          <div className={styles.checkboxList}>
            <Checkbox id="accept_terms" name="accept_terms" required>
              <>
                {t("jaseneksi.privacy.acceptTermsPrefix")}{" "}
                <a className={styles.link} href="#">
                  {t("jaseneksi.privacy.termsLink")}
                </a>
              </>
            </Checkbox>

            <Checkbox id="accept_privacy" name="accept_privacy" required>
              <>
                {t("jaseneksi.privacy.acceptPrivacyPrefix")}{" "}
                <a className={styles.link} href="#">
                  {t("jaseneksi.privacy.privacyLink")}
                </a>
              </>
            </Checkbox>
          </div>
        </Fieldset>
      </form>

      <MobileCallToActionButton form="membership-form">
        {t("jaseneksi.submit")}
      </MobileCallToActionButton>
    </main>
  )
}

export default MembershipPage
