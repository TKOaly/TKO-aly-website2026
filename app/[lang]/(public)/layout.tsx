import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"
import TableOfContents from "@/components/TableOfContents/TableOfContents"

import styles from "./layout.module.css"

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Navbar />
      <div className={styles.layoutWrapper}>
        <TableOfContents />
        <main id="main-content" className={styles.main}>
          {children}
        </main>
      </div>
      <Footer />
    </>
  )
}
