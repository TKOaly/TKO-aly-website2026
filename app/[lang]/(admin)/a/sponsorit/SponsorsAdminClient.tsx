"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Fieldset from "@/components/Fieldset/Fieldset"
import Field from "@/components/Field/Field"

interface Sponsor {
  href: string
  alt: string
  src: string
}

export default function SponsorsAdminClient({
  initialData,
}: {
  initialData: unknown
}) {
  const [sponsors, setSponsors] = useState<Sponsor[]>(
    (initialData as Sponsor[]) || [],
  )

  const [status, setStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({
    type: null,
    message: "",
  })
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  const [newSponsor, setNewSponsor] = useState({
    href: "",
    alt: "",
    src: "",
  })

  const handleSave = async () => {
    setIsSaving(true)
    setStatus({ type: null, message: "" })

    try {
      const res = await fetch("/api/sponsors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: sponsors }),
      })

      if (!res.ok) {
        throw new Error("Failed to save.")
      }

      setStatus({ type: "success", message: "Sponsors saved successfully!" })
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

  const handleAddSponsor = () => {
    if (!newSponsor.href || !newSponsor.alt || !newSponsor.src) return
    const sponsor: Sponsor = {
      href: newSponsor.href,
      alt: newSponsor.alt,
      src: newSponsor.src,
    }
    setSponsors([...sponsors, sponsor])
    setNewSponsor({ href: "", alt: "", src: "" })
  }

  const moveSponsor = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= sponsors.length) return
    const updated = [...sponsors]
    const temp = updated[index]
    updated[index] = updated[newIndex]
    updated[newIndex] = temp
    setSponsors(updated)
  }

  const deleteSponsor = (index: number) => {
    const updated = sponsors.filter((_, i) => i !== index)
    setSponsors(updated)
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div>
        <Fieldset legend="Add New Sponsor">
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <Field
              required
              label="Sponsor Name (Alt text)"
              id="newSponsorAlt"
              value={newSponsor.alt}
              onChange={e =>
                setNewSponsor({ ...newSponsor, alt: e.target.value })
              }
              type="text"
            />
            <Field
              required
              label="Company Website URL"
              id="newSponsorHref"
              value={newSponsor.href}
              onChange={e =>
                setNewSponsor({ ...newSponsor, href: e.target.value })
              }
              type="text"
            />
            <Field
              required
              label="Logo Image URL (src)"
              id="newSponsorSrc"
              value={newSponsor.src}
              onChange={e =>
                setNewSponsor({ ...newSponsor, src: e.target.value })
              }
              type="text"
            />
            <button
              type="button"
              onClick={handleAddSponsor}
              style={{
                alignSelf: "flex-start",
                padding: "0.5rem 1rem",
                cursor: "pointer",
              }}
            >
              Add Sponsor
            </button>
          </div>
        </Fieldset>
      </div>

      <div>
        <h2>Sponsors List</h2>
        {sponsors.length === 0 && <p>No sponsors yet.</p>}
        <ul style={{ listStyle: "none", padding: 0 }}>
          {sponsors.map((sponsor, index) => (
            <li
              key={index}
              style={{
                border: "1px solid #ccc",
                padding: "1rem",
                marginBottom: "1rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{ display: "flex", gap: "1rem", alignItems: "center" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={sponsor.src}
                  alt={sponsor.alt}
                  style={{
                    height: "40px",
                    width: "auto",
                    objectFit: "contain",
                  }}
                />
                <div>
                  <strong>{sponsor.alt}</strong>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "#666" }}>
                    <a href={sponsor.href} target="_blank" rel="noreferrer">
                      {sponsor.href}
                    </a>
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => moveSponsor(index, -1)}
                  disabled={index === 0}
                  style={{ padding: "0.25rem 0.5rem", cursor: "pointer" }}
                >
                  Up
                </button>
                <button
                  type="button"
                  onClick={() => moveSponsor(index, 1)}
                  disabled={index === sponsors.length - 1}
                  style={{ padding: "0.25rem 0.5rem", cursor: "pointer" }}
                >
                  Down
                </button>
                <button
                  type="button"
                  onClick={() => deleteSponsor(index)}
                  style={{
                    padding: "0.25rem 0.5rem",
                    cursor: "pointer",
                    color: "red",
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div
        style={{
          marginTop: "2rem",
          borderTop: "1px solid #ccc",
          paddingTop: "1rem",
        }}
      >
        <button
          onClick={handleSave}
          disabled={isSaving}
          style={{
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            cursor: isSaving ? "not-allowed" : "pointer",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          {isSaving ? "Saving..." : "Save Sponsors"}
        </button>
      </div>

      {status.type && (
        <div
          style={{
            marginTop: "1rem",
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
