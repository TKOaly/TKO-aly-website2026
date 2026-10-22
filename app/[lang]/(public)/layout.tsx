import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"
import PublicArticleFrame from "@/components/PublicArticleFrame/PublicArticleFrame"

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
        <PublicArticleFrame>{children}</PublicArticleFrame>
      </div>
      <Footer />
    </>
  )
}
