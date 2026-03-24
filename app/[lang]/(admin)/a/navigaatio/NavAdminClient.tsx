"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function NavAdminClient({
  initialData,
}: {
  initialData: unknown
}) {
  const [value, setValue] = useState(JSON.stringify(initialData, null, 2))
  const [status, setStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({
    type: null,
    message: "",
  })
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  const handleSave = async () => {
    setIsSaving(true)
    setStatus({ type: null, message: "" })

    let parsedData
    try {
      parsedData = JSON.parse(value)
    } catch (err) {
      setStatus({
        type: "error",
        message: (err as Error).message || "Invalid JSON format",
      })
      setIsSaving(false)
      return
    }

    try {
      const res = await fetch("/api/navbar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: parsedData }),
      })

      if (!res.ok) {
        throw new Error("Failed to save.")
      }

      setStatus({ type: "success", message: "Navigation saved successfully!" })
      router.refresh()
    } catch (err: unknown) {
      setStatus({
        type: "error",
        message: (err as Error).message || "An error occurred while saving.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <textarea
        value={value}
        onChange={e => setValue(e.target.value)}
        rows={25}
        style={{
          width: "100%",
          fontFamily: "monospace",
          padding: "1rem",
        }}
      />
      <div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          style={{
            padding: "0.5rem 1rem",
            cursor: isSaving ? "not-allowed" : "pointer",
          }}
        >
          {isSaving ? "Saving..." : "Save Navigation"}
        </button>
      </div>
      {status.type && (
        <div
          style={{
            padding: "1rem",
            color: status.type === "success" ? "green" : "red",
            border: `1px solid ${status.type === "success" ? "green" : "red"}`,
            borderRadius: "4px",
          }}
        >
          {status.message}
        </div>
      )}
    </div>
  )
}
