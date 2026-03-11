import type { ReactNode } from "react"
import Image from "next/image"
import styles from "./ImageCard.module.css"

type ImageCardProps = {
  src: string
  alt?: string
  title: string
  children?: ReactNode
}

const ImageCard = ({ src, alt, title, children }: ImageCardProps) => {
  return (
    <div className={styles.imageCard}>
      <div className={styles.imageWrapper}>
        <Image src={src} alt={alt ?? title} fill className={styles.image} />
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        {children}
      </div>
    </div>
  )
}

export default ImageCard
