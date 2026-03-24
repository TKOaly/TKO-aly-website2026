import { getNavbar } from "@/lib/navbar"
import Navbar from "./Navbar"

const NavbarContainer = async () => {
  const items = await getNavbar()
  return <Navbar items={items} />
}

export default NavbarContainer
