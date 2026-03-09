"use client"

import { useEffect, useRef, useState } from "react"
import type { Typography } from "./types"

const CYCLES_PER_LETTER = 2
const SHUFFLE_TIME = 50
const CHARS = "!@#$%^&*():{};|,.<>/?01"

interface Props {
  type?: Typography
  /** The text to display and scramble. Must be a plain string. */
  children: string
  /** When true the scramble animation plays; resolves back to children when false. */
  active?: boolean
  className?: string
}

const MatrixText = ({
  type = "span",
  children,
  active = false,
  className,
}: Props) => {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [text, setText] = useState(children)

  const Component = type

  useEffect(() => {
    if (active) {
      let pos = 0
      intervalRef.current = setInterval(() => {
        const scrambled = children
          .split("")
          .map((char, index) => {
            if (char === " ") return " "
            if (pos / CYCLES_PER_LETTER > index) return char
            return CHARS[Math.floor(Math.random() * CHARS.length)]
          })
          .join("")
        setText(scrambled)
        pos++
        if (pos >= children.length * CYCLES_PER_LETTER) {
          clearInterval(intervalRef.current ?? undefined)
          setText(children)
        }
      }, SHUFFLE_TIME)
    } else {
      clearInterval(intervalRef.current ?? undefined)
      setText(children)
    }

    return () => {
      clearInterval(intervalRef.current ?? undefined)
    }
  }, [active, children])

  return <Component className={className}>{text}</Component>
}

export default MatrixText
