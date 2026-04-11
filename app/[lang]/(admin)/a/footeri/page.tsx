import PageHeader from "@/components/PageHeader/PageHeader"
import { getAsyncTranslation } from "@/app/i18n"
import { getFooter } from "@/lib/footer"
import FooterAdminClient from "./FooterAdminClient"

const FooterManagementPage = async ({
  params,
}: {
  params: Promise<{ lang: string }>
}) => {
  const { lang } = await params
  const { t } = await getAsyncTranslation(lang)

  const footerData = await getFooter()

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        maxWidth: "800px",
        margin: "0 auto",
        padding: "2rem",
      }}
    >
      <PageHeader
        title={t("admin.footer.title", {
          defaultValue: "Footer Management",
        })}
      />
      <div style={{ marginTop: "2rem" }}>
        <FooterAdminClient initialData={footerData} />
      </div>
    </main>
  )
}

export default FooterManagementPage
