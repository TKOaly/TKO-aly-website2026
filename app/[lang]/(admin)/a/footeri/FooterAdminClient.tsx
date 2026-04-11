"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Fieldset from "@/components/Fieldset/Fieldset"
import Field from "@/components/Field/Field"

interface FooterLink {
  href: string
  labels: Record<string, string>
  external?: boolean
}

export default function FooterAdminClient({
  initialData,
}: {
  initialData: unknown
}) {
  const [links, setLinks] = useState<FooterLink[]>(
    (initialData as FooterLink[]) || [],
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

  const [newLink, setNewLink] = useState({
    href: "",
    fi: "",
    en: "",
    external: false,
  })

  const handleSave = async () => {
    setIsSaving(true)
    setStatus({ type: null, message: "" })

    try {
      const res = await fetch("/api/footer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: links }),
      })

      if (!res.ok) {
        throw new Error("Failed to save.")
      }

      setStatus({ type: "success", message: "Footer saved successfully!" })
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

  const handleAddLink = () => {
    if (!newLink.fi || !newLink.en || !newLink.href) return
    const link: FooterLink = {
      href: newLink.href,
      labels: {
        fi: newLink.fi,
        en: newLink.en,
      },
      external: newLink.external,
    }
    setLinks([...links, link])
    setNewLink({ href: "", fi: "", en: "", external: false })
  }

  const moveLink = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= links.length) return
    const updated = [...links]
    const temp = updated[index]
    updated[index] = updated[newIndex]
    updated[newIndex] = temp
    setLinks(updated)
  }

  const deleteLink = (index: number) => {
    const updated = links.filter((_, i) => i !== index)
    setLinks(updated)
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div>
        <Fieldset legend="Add New Footer Link">
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <Field
              required
              label="Href URL"
              id="newLinkHref"
              value={newLink.href}
              onChange={e => setNewLink({ ...newLink, href: e.target.value })}
              type="text"
            />
            <Field
              required
              label="Label FI"
              id="newLinkFi"
              value={newLink.fi}
              onChange={e => setNewLink({ ...newLink, fi: e.target.value })}
              type="text"
            />
            <Field
              required
              label="Label EN"
              id="newLinkEn"
              value={newLink.en}
              onChange={e => setNewLink({ ...newLink, en: e.target.value })}
              type="text"
            />
            <label
              style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
            >
              <input
                type="checkbox"
                checked={newLink.external}
                onChange={e =>
                  setNewLink({ ...newLink, external: e.target.checked })
                }
              />
              External Link
            </label>
            <button
              type="button"
              onClick={handleAddLink}
              style={{
                alignSelf: "flex-start",
                padding: "0.5rem 1rem",
                cursor: "pointer",
              }}
            >
              Add Footer Link
            </button>
          </div>
        </Fieldset>
      </div>

      <div>
        <h2>Footer Links</h2>
        {links.length === 0 && <p>No links yet.</p>}
        <ul style={{ listStyle: "none", padding: 0 }}>
          {links.map((link, index) => (
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
              <div>
                <strong>
                  {link.labels.fi} / {link.labels.en}
                </strong>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#666" }}>
                  <a href={link.href} target="_blank" rel="noreferrer">
                    {link.href}
                  </a>
                  {link.external && (
                    <span style={{ marginLeft: "0.5rem" }}>(External)</span>
                  )}
                </p>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => moveLink(index, -1)}
                  disabled={index === 0}
                  style={{ padding: "0.25rem 0.5rem", cursor: "pointer" }}
                >
                  Up
                </button>
                <button
                  type="button"
                  onClick={() => moveLink(index, 1)}
                  disabled={index === links.length - 1}
                  style={{ padding: "0.25rem 0.5rem", cursor: "pointer" }}
                >
                  Down
                </button>
                <button
                  type="button"
                  onClick={() => deleteLink(index)}
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
          {isSaving ? "Saving..." : "Save Footer Links"}
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
