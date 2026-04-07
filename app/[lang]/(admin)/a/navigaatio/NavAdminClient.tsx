"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Fieldset from "@/components/Fieldset/Fieldset"
import Field from "@/components/Field/Field"

interface NavLink {
  href: string
  labels: Record<string, string>
  external?: boolean
}

interface NavSection {
  labels: Record<string, string>
  descriptions: Record<string, string>
  links: NavLink[]
}

export default function NavAdminClient({
  initialData,
}: {
  initialData: unknown
}) {
  const [sections, setSections] = useState<NavSection[]>(
    (initialData as NavSection[]) || [],
  )
  const [selectedSectionIndex, setSelectedSectionIndex] = useState<
    number | null
  >(null)

  const [status, setStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({
    type: null,
    message: "",
  })
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  const [newSection, setNewSection] = useState({
    fi: "",
    en: "",
    descFi: "",
    descEn: "",
  })

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
      const res = await fetch("/api/navbar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: sections }),
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

  const handleAddSection = () => {
    if (!newSection.fi || !newSection.en) return
    const newSec: NavSection = {
      labels: {
        fi: newSection.fi,
        en: newSection.en,
      },
      descriptions: {
        fi: newSection.descFi,
        en: newSection.descEn,
      },
      links: [],
    }
    setSections([...sections, newSec])
    setNewSection({ fi: "", en: "", descFi: "", descEn: "" })
  }

  const moveSection = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= sections.length) return
    const updated = [...sections]
    const temp = updated[index]
    updated[index] = updated[newIndex]
    updated[newIndex] = temp
    setSections(updated)
    if (selectedSectionIndex === index) setSelectedSectionIndex(newIndex)
    else if (selectedSectionIndex === newIndex) setSelectedSectionIndex(index)
  }

  const deleteSection = (index: number) => {
    const updated = sections.filter((_, i) => i !== index)
    setSections(updated)
    if (selectedSectionIndex === index) {
      setSelectedSectionIndex(null)
    } else if (selectedSectionIndex !== null && selectedSectionIndex > index) {
      setSelectedSectionIndex(selectedSectionIndex - 1)
    }
  }

  const handleAddLink = () => {
    if (
      selectedSectionIndex === null ||
      !newLink.fi ||
      !newLink.en ||
      !newLink.href
    )
      return
    const link: NavLink = {
      href: newLink.href,
      labels: {
        fi: newLink.fi,
        en: newLink.en,
      },
      external: newLink.external,
    }
    const updatedSections = [...sections]
    updatedSections[selectedSectionIndex].links.push(link)
    setSections(updatedSections)
    setNewLink({ href: "", fi: "", en: "", external: false })
  }

  const moveLink = (index: number, direction: -1 | 1) => {
    if (selectedSectionIndex === null) return
    const links = sections[selectedSectionIndex].links
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= links.length) return
    const updatedLinks = [...links]
    const temp = updatedLinks[index]
    updatedLinks[index] = updatedLinks[newIndex]
    updatedLinks[newIndex] = temp
    const updatedSections = [...sections]
    updatedSections[selectedSectionIndex].links = updatedLinks
    setSections(updatedSections)
  }

  const deleteLink = (index: number) => {
    if (selectedSectionIndex === null) return
    const updatedSections = [...sections]
    updatedSections[selectedSectionIndex].links = updatedSections[
      selectedSectionIndex
    ].links.filter((_, i) => i !== index)
    setSections(updatedSections)
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div>
        <Fieldset legend="Add Top Level Navigation Section">
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <Field
              required
              label="Päävalikko FI"
              id="newSectionFi"
              value={newSection.fi}
              onChange={e =>
                setNewSection({ ...newSection, fi: e.target.value })
              }
              type="text"
            />
            <Field
              required
              label="Päävalikko EN"
              id="newSectionEn"
              value={newSection.en}
              onChange={e =>
                setNewSection({ ...newSection, en: e.target.value })
              }
              type="text"
            />
            <Field
              label="Description FI"
              id="newSectionDescFi"
              value={newSection.descFi}
              onChange={e =>
                setNewSection({ ...newSection, descFi: e.target.value })
              }
              type="text"
            />
            <Field
              label="Description EN"
              id="newSectionDescEn"
              value={newSection.descEn}
              onChange={e =>
                setNewSection({ ...newSection, descEn: e.target.value })
              }
              type="text"
            />
            <button
              type="button"
              onClick={handleAddSection}
              style={{
                alignSelf: "flex-start",
                padding: "0.5rem 1rem",
                cursor: "pointer",
              }}
            >
              Add Section
            </button>
          </div>
        </Fieldset>
      </div>

      <div>
        <h2>Sections</h2>
        {sections.length === 0 && <p>No sections yet.</p>}
        <ul style={{ listStyle: "none", padding: 0 }}>
          {sections.map((section, index) => (
            <li
              key={index}
              style={{
                border: "1px solid #ccc",
                padding: "1rem",
                marginBottom: "1rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor:
                  selectedSectionIndex === index ? "#eee" : "transparent",
              }}
            >
              <div>
                <strong>
                  {section.labels.fi} / {section.labels.en}
                </strong>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#666" }}>
                  {section.descriptions?.fi} / {section.descriptions?.en}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedSectionIndex(
                      selectedSectionIndex === index ? null : index,
                    )
                  }
                  style={{
                    marginTop: "0.5rem",
                    padding: "0.25rem 0.5rem",
                    cursor: "pointer",
                  }}
                >
                  {selectedSectionIndex === index
                    ? "Close Submenu"
                    : "Edit Submenu Links"}
                </button>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => moveSection(index, -1)}
                  disabled={index === 0}
                  style={{ padding: "0.25rem 0.5rem", cursor: "pointer" }}
                >
                  Up
                </button>
                <button
                  type="button"
                  onClick={() => moveSection(index, 1)}
                  disabled={index === sections.length - 1}
                  style={{ padding: "0.25rem 0.5rem", cursor: "pointer" }}
                >
                  Down
                </button>
                <button
                  type="button"
                  onClick={() => deleteSection(index)}
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

      {selectedSectionIndex !== null && (
        <div style={{ borderLeft: "4px solid #0070f3", paddingLeft: "1rem" }}>
          <h2>
            Editing Links for &quot;{sections[selectedSectionIndex].labels.fi}
            &quot;
          </h2>

          <Fieldset legend="Add New Link">
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
                Add Link
              </button>
            </div>
          </Fieldset>

          <h3 style={{ marginTop: "2rem" }}>Links</h3>
          {sections[selectedSectionIndex].links.length === 0 && (
            <p>No links yet.</p>
          )}
          <ul style={{ listStyle: "none", padding: 0 }}>
            {sections[selectedSectionIndex].links.map((link, index) => (
              <li
                key={index}
                style={{
                  border: "1px solid #ddd",
                  padding: "0.75rem",
                  marginBottom: "0.5rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <strong>
                    {link.labels.fi} / {link.labels.en}
                  </strong>{" "}
                  -{" "}
                  <a href={link.href} target="_blank" rel="noreferrer">
                    {link.href}
                  </a>
                  {link.external && (
                    <span
                      style={{
                        marginLeft: "0.5rem",
                        fontSize: "0.8rem",
                        color: "#666",
                      }}
                    >
                      (External)
                    </span>
                  )}
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
                    disabled={
                      index === sections[selectedSectionIndex].links.length - 1
                    }
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
      )}

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
          {isSaving ? "Saving..." : "Save Overall Navigation"}
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
