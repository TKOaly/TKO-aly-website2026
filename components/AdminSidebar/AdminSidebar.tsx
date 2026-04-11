"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function AdminSidebar() {
  const pathname = usePathname()

  const navItems = [
    { href: "/a/navigaatio", label: "Navigation" },
    { href: "/a/footeri", label: "Footer" },
    { href: "/a/sponsorit", label: "Sponsors" },
    { href: "/a/tapahtumat", label: "Events" },
  ]

  // Assuming pathname looks like "/fi/a/navigaatio" or "/en/a/navigaatio"
  // We can extract the language prefix.
  const pathParts = pathname.split("/")
  const langPrefix =
    pathParts[1] && pathParts[1] !== "a" ? `/${pathParts[1]}` : ""

  return (
    <aside
      style={{
        width: "250px",
        minWidth: "250px",
        borderRight: "1px solid #eaeaea",
        padding: "2rem 1rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      <h3 style={{ margin: "0 0 1rem 0.5rem", color: "#666" }}>Admin Menu</h3>
      <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        {navItems.map(item => {
          const href = `${langPrefix}${item.href}`
          const isActive = pathname.startsWith(href)
          return (
            <Link
              key={item.href}
              href={href}
              style={{
                padding: "0.5rem",
                borderRadius: "4px",
                textDecoration: "none",
                fontWeight: isActive ? "bold" : "normal",
                backgroundColor: isActive ? "#f0f0f0" : "transparent",
                color: isActive ? "#000" : "#444",
              }}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
