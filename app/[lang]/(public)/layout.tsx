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
      <div className={styles.layoutWrapper}>{children}</div>
      <Footer />
    </>
  )
}
