import AdminSidebar from "@/components/AdminSidebar/AdminSidebar"

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar />
      <div style={{ flex: 1, padding: "2rem" }}>{children}</div>
    </div>
  )
}
