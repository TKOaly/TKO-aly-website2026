import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"

import styles from "./layout.module.css"

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Navbar />
      <main className={styles.main}>{children}</main>
      <Footer />
    </>
  )
}
