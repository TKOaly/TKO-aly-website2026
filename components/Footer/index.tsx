import { getFooter } from "@/lib/footer"
import { getSponsors } from "@/lib/sponsors"
import FooterClient from "./Footer"

export default async function Footer() {
  const footerData = await getFooter()
  const sponsorsData = await getSponsors()

  return <FooterClient footerData={footerData} sponsorsData={sponsorsData} />
}
