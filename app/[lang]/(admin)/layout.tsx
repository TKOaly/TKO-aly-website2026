import AdminSidebar from "@/components/AdminSidebar/AdminSidebar"
import Navbar from "@/components/Navbar"

import styles from "./admin.module.css"

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Navbar />
      <div
        className={styles.admin}
        style={{ display: "flex", minHeight: "100vh" }}
      >
        <AdminSidebar />
        <div style={{ flex: 1, padding: "2rem" }}>{children}</div>
      </div>
    </>
  )
}
