import PageHeader from "@/components/PageHeader/PageHeader"
import { getAsyncTranslation } from "@/app/i18n"
import { getSponsors } from "@/lib/sponsors"
import SponsorsAdminClient from "./SponsorsAdminClient"

const SponsorsManagementPage = async ({
  params,
}: {
  params: Promise<{ lang: string }>
}) => {
  const { lang } = await params
  const { t } = await getAsyncTranslation(lang)

  const sponsorsData = await getSponsors()

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
        title={t("admin.sponsors.title", {
          defaultValue: "Sponsors Management",
        })}
      />
      <div style={{ marginTop: "2rem" }}>
        <SponsorsAdminClient initialData={sponsorsData} />
      </div>
    </main>
  )
}

export default SponsorsManagementPage
