import PageHeader from "@/components/PageHeader/PageHeader"
import { getAsyncTranslation } from "@/app/i18n"
import { getNavbar } from "@/lib/navbar"
import NavAdminClient from "./NavAdminClient"

const NavigationManagementPage = async ({
  params,
}: {
  params: Promise<{ lang: string }>
}) => {
  const { lang } = await params
  const { t } = await getAsyncTranslation(lang)

  const navbarData = await getNavbar()

  return (
    <main style={{ padding: "2rem" }}>
      <PageHeader
        title={t("admin.navigation.title", {
          defaultValue: "Navigation Management",
        })}
      />
      <div style={{ marginTop: "2rem" }}>
        <NavAdminClient initialData={navbarData} />
      </div>
    </main>
  )
}

export default NavigationManagementPage
