import { getNavbar } from "@/lib/navbar"
import { hiddenRoutes } from "@/lib/featureFlags"
import type { NavSection } from "./Navbar"
import Navbar from "./Navbar"

const NavbarContainer = async () => {
  const hidden = hiddenRoutes()
  const sections: NavSection[] = await getNavbar()
  const items = sections.map(section => ({
    ...section,
    links: section.links.filter(link => !hidden.includes(link.href)),
  }))
  return <Navbar items={items} disabledRoutes={hidden} />
}

export default NavbarContainer
