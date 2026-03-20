"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { createSupabaseBrowserClient } from "@/lib/supabase-browser"
import { Plus, Pencil, Trash2, LogOut, X, GripVertical, Loader2, CheckCircle } from "lucide-react"
import type { Artwork } from "@/lib/types"

const CATEGORIES = ["ILLUSTRATION", "CONCEPT ART", "STORYBOARDING", "MOTION GRAPHICS", "2D ANIMATION", "3D ANIMATION"]

// ── Inline editable text ──────────────────────────────────────────────────
function EditableText({
    value, onChange, multiline = false, placeholder = "", style = {},
}: {
    value: string; onChange: (v: string) => void
    multiline?: boolean; placeholder?: string; style?: React.CSSProperties
}) {
    const Tag = multiline ? "textarea" : "input"
    return (
        <Tag
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            rows={multiline ? 3 : undefined}
            style={{
                background: "transparent",
                border: "1px dashed transparent",
                outline: "none",
                width: "100%",
                resize: multiline ? "vertical" : undefined,
                fontFamily: "inherit",
                fontSize: "inherit",
                color: "inherit",
                padding: "2px 4px",
                borderRadius: 2,
                transition: "border-color 0.15s",
                ...style,
            }}
            onFocus={e => (e.target.style.borderColor = "var(--primary)")}
            onBlur={e => (e.target.style.borderColor = "transparent")}
        />
    )
}

// ── Tag editor ────────────────────────────────────────────────────────────
function TagEditor({ tags, onChange }: { tags: string[]; onChange: (t: string[]) => void }) {
    const [input, setInput] = useState("")
    const add = () => {
        const v = input.trim()
        if (v && !tags.includes(v)) { onChange([...tags, v]); setInput("") }
    }
    return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", alignItems: "center" }}>
            {tags.map(tag => (
                <span key={tag} style={{
                    display: "inline-flex", alignItems: "center", gap: 4,
                    padding: "2px 8px",
                    border: "1px solid var(--border)",
                    fontFamily: "var(--font-geist)", fontSize: "0.7rem",
                    color: "var(--muted-foreground)",
                }}>
                    {tag}
                    <button onClick={() => onChange(tags.filter(t => t !== tag))}
                        style={{ background: "none", border: "none", color: "var(--muted-foreground)", padding: 0, lineHeight: 1 }}>
                        <X size={10} />
                    </button>
                </span>
            ))}
            <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add() } }}
                placeholder="Add tag..."
                style={{
                    background: "transparent", border: "1px dashed var(--border)",
                    padding: "2px 6px", fontSize: "0.7rem",
                    fontFamily: "var(--font-geist)", color: "var(--foreground)",
                    outline: "none", width: 80,
                }}
            />
        </div>
    )
}

// ── Process steps editor ──────────────────────────────────────────────────
function ProcessEditor({ steps, onChange }: { steps: string[]; onChange: (s: string[]) => void }) {
    const ensured = steps.length >= 3 ? steps : [...steps, ...Array(3 - steps.length).fill("")]
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {ensured.map((step, i) => (
                <div key={i} style={{ display: "flex", gap: "0.4rem", alignItems: "flex-start" }}>
                    <span style={{
                        fontFamily: "var(--font-bangers)", fontSize: "0.7rem",
                        color: "var(--primary)", marginTop: 4, minWidth: 20,
                    }}>{i + 1}.</span>
                    <textarea
                        value={step}
                        onChange={e => { const s = [...ensured]; s[i] = e.target.value; onChange(s) }}
                        placeholder={`Step ${i + 1}...`}
                        rows={2}
                        style={{
                            flex: 1, background: "var(--background)",
                            border: "1px solid var(--border)", padding: "4px 8px",
                            fontFamily: "var(--font-geist)", fontSize: "0.75rem",
                            color: "var(--foreground)", resize: "vertical", outline: "none",
                        }}
                        onFocus={e => (e.target.style.borderColor = "var(--primary)")}
                        onBlur={e => (e.target.style.borderColor = "var(--border)")}
                    />
                </div>
            ))}
        </div>
    )
}

// ── Artwork card (edit + create mode) ────────────────────────────────────
function ArtworkCard({
    artwork, onSave, onDelete, isNew = false, onCancelNew,
}: {
    artwork: Partial<Artwork>
    onSave: (data: Partial<Artwork>, imageFile?: File, videoFile?: File) => Promise<void>
    onDelete?: () => Promise<void>
    isNew?: boolean
    onCancelNew?: () => void
}) {
    const [draft, setDraft] = useState<Partial<Artwork>>({ ...artwork })
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [videoFile, setVideoFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(artwork.image_url || null)
    const [videoPreview, setVideoPreview] = useState<string | null>((artwork as any).video_url || null)
    const [saving, setSaving] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [saved, setSaved] = useState(false)
    const [dirty, setDirty] = useState(isNew)
    const fileRef = useRef<HTMLInputElement>(null)
    const videoRef = useRef<HTMLInputElement>(null)

    const set = (k: keyof Artwork) => (v: unknown) => {
        setDraft(d => ({ ...d, [k]: v }))
        setDirty(true)
    }

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0]
        if (!f) return
        setImageFile(f)
        setPreview(URL.createObjectURL(f))
        setDirty(true)
    }

    const handleVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0]
        if (!f) return
        setVideoFile(f)
        setVideoPreview(URL.createObjectURL(f))
        set("media_type")("video")
        setDirty(true)
    }

    const handleSave = async () => {
        setSaving(true)
        await onSave(draft, imageFile || undefined, videoFile || undefined)
        setSaving(false)
        setSaved(true)
        setDirty(false)
        setImageFile(null)
        setVideoFile(null)
        setTimeout(() => setSaved(false), 2000)
    }

    const handleDelete = async () => {
        if (!confirm(`Delete "${draft.title}"? This cannot be undone.`)) return
        setDeleting(true)
        await onDelete?.()
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{
                border: "3px solid var(--foreground)",
                boxShadow: "5px 5px 0 var(--foreground)",
                background: "var(--card)",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Drag handle */}
            {!isNew && (
                <div style={{
                    position: "absolute", top: 8, left: 8, zIndex: 2,
                    color: "var(--muted-foreground)", opacity: 0.4,
                }}>
                    <GripVertical size={14} />
                </div>
            )}

            {/* Image area */}
            <div
                onClick={() => fileRef.current?.click()}
                style={{
                    height: 180, background: "var(--background)",
                    borderBottom: "2px solid var(--border)",
                    position: "relative", overflow: "hidden",
                    cursor: "none", display: "flex",
                    alignItems: "center", justifyContent: "center",
                }}
            >
                {preview ? (
                    <img src={preview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                    <div style={{ textAlign: "center", color: "var(--muted-foreground)" }}>
                        <Plus size={28} style={{ margin: "0 auto 0.25rem" }} />
                        <p style={{ fontFamily: "var(--font-geist)", fontSize: "0.7rem", letterSpacing: "0.1em" }}>
                            CLICK TO ADD IMAGE
                        </p>
                    </div>
                )}
                {/* Hover overlay */}
                <div style={{
                    position: "absolute", inset: 0,
                    background: "rgba(0,0,0,0.5)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    opacity: 0, transition: "opacity 0.2s",
                }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                    onMouseLeave={e => (e.currentTarget.style.opacity = "0")}
                >
                    <p style={{ fontFamily: "var(--font-bangers)", fontSize: "0.9rem", color: "white", letterSpacing: "0.1em" }}>
                        {preview ? "CHANGE IMAGE" : "UPLOAD IMAGE"}
                    </p>
                </div>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} style={{ display: "none" }} />
            </div>

            {/* Video upload strip */}
            <div style={{
                borderTop: "2px solid var(--border)",
                padding: "0.6rem 1rem",
                display: "flex", alignItems: "center", gap: "0.75rem",
                background: "var(--background)",
            }}>
                <button
                    type="button"
                    onClick={() => videoRef.current?.click()}
                    style={{
                        display: "flex", alignItems: "center", gap: 6,
                        padding: "0.35rem 0.75rem",
                        background: videoPreview ? "color-mix(in srgb, var(--primary) 15%, transparent)" : "transparent",
                        border: "1.5px solid var(--border)",
                        color: videoPreview ? "var(--primary)" : "var(--muted-foreground)",
                        fontFamily: "var(--font-bangers)", fontSize: "0.75rem",
                        letterSpacing: "0.08em", cursor: "none",
                    }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                    </svg>
                    {videoPreview ? "VIDEO ADDED ✓" : "ADD VIDEO"}
                </button>
                {videoPreview && (
                    <button
                        type="button"
                        onClick={() => { setVideoFile(null); setVideoPreview(null); set("media_type")("image"); setDirty(true) }}
                        style={{ background: "none", border: "none", color: "var(--muted-foreground)", fontSize: "0.7rem", cursor: "none", fontFamily: "var(--font-geist)" }}
                    >
                        remove
                    </button>
                )}
                <input ref={videoRef} type="file" accept="video/*" onChange={handleVideo} style={{ display: "none" }} />
            </div>

            {/* Fields */}
            <div style={{ padding: "1rem" }}>
                {/* Title */}
                <div style={{ marginBottom: "0.5rem" }}>
                    <EditableText
                        value={draft.title || ""}
                        onChange={set("title")}
                        placeholder="ARTWORK TITLE"
                        style={{
                            fontFamily: "var(--font-bangers)",
                            fontSize: "1.3rem",
                            letterSpacing: "0.04em",
                            color: "var(--foreground)",
                        }}
                    />
                </div>

                {/* Category */}
                <div style={{ marginBottom: "0.75rem" }}>
                    <select
                        value={draft.category || ""}
                        onChange={e => set("category")(e.target.value)}
                        style={{
                            background: "var(--background)",
                            border: "1px solid var(--border)",
                            color: "var(--primary)",
                            fontFamily: "var(--font-geist)",
                            fontSize: "0.7rem",
                            letterSpacing: "0.1em",
                            padding: "3px 8px",
                            outline: "none",
                        }}
                    >
                        <option value="">SELECT CATEGORY</option>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                {/* Description */}
                <div style={{ marginBottom: "0.75rem" }}>
                    <p style={{ fontFamily: "var(--font-geist)", fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--muted-foreground)", marginBottom: "0.25rem" }}>DESCRIPTION</p>
                    <EditableText
                        value={draft.description || ""}
                        onChange={set("description")}
                        multiline
                        placeholder="Describe this artwork..."
                        style={{ fontFamily: "var(--font-geist)", fontSize: "0.8rem", color: "var(--foreground)", lineHeight: 1.5 }}
                    />
                </div>

                {/* Tags */}
                <div style={{ marginBottom: "0.75rem" }}>
                    <p style={{ fontFamily: "var(--font-geist)", fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--muted-foreground)", marginBottom: "0.25rem" }}>TAGS</p>
                    <TagEditor tags={draft.tags || []} onChange={set("tags")} />
                </div>

                {/* Process steps */}
                <div style={{ marginBottom: "1rem" }}>
                    <p style={{ fontFamily: "var(--font-geist)", fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--muted-foreground)", marginBottom: "0.4rem" }}>PROCESS STEPS</p>
                    <ProcessEditor steps={draft.process_steps || []} onChange={set("process_steps")} />
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "0.5rem", borderTop: "1px solid var(--border)", paddingTop: "0.75rem" }}>
                    {(dirty || isNew) && (
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            style={{
                                flex: 1, padding: "0.5rem",
                                background: saved ? "var(--accent)" : "var(--primary)",
                                color: "var(--primary-foreground)",
                                fontFamily: "var(--font-bangers)",
                                fontSize: "0.85rem", letterSpacing: "0.08em",
                                border: "2px solid var(--foreground)",
                                boxShadow: "2px 2px 0 var(--foreground)",
                                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                            }}
                        >
                            {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <CheckCircle size={14} /> : null}
                            {saving ? "SAVING..." : saved ? "SAVED!" : isNew ? "CREATE" : "SAVE"}
                        </button>
                    )}

                    {isNew && (
                        <button
                            onClick={onCancelNew}
                            style={{
                                padding: "0.5rem 0.75rem",
                                background: "transparent",
                                color: "var(--muted-foreground)",
                                fontFamily: "var(--font-bangers)",
                                fontSize: "0.85rem",
                                border: "2px solid var(--border)",
                            }}
                        >
                            CANCEL
                        </button>
                    )}

                    {!isNew && onDelete && (
                        <button
                            onClick={handleDelete}
                            disabled={deleting}
                            style={{
                                padding: "0.5rem 0.75rem",
                                background: "transparent",
                                color: "#ef4444",
                                border: "2px solid #ef4444",
                                display: "flex", alignItems: "center", gap: 4,
                            }}
                        >
                            {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    )
}

// ── Dashboard page ────────────────────────────────────────────────────────
export default function DashboardPage() {
    const router = useRouter()
    const supabase = createSupabaseBrowserClient()
    const [artworks, setArtworks] = useState<Artwork[]>([])
    const [loading, setLoading] = useState(true)
    const [showNew, setShowNew] = useState(false)

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!user) router.replace("/admin")
        })
        fetchArtworks()
    }, [])

    const fetchArtworks = async () => {
        setLoading(true)
        const res = await fetch("/api/artworks")
        const data = await res.json()
        setArtworks(data)
        setLoading(false)
    }

    const handleCreate = async (draft: Partial<Artwork>, imageFile?: File, videoFile?: File) => {
        const fd = new FormData()
        fd.append("title", draft.title || "Untitled")
        fd.append("category", draft.category || "")
        fd.append("description", draft.description || "")
        fd.append("tags", JSON.stringify(draft.tags || []))
        fd.append("process_steps", JSON.stringify(draft.process_steps || []))
        fd.append("order", String(artworks.length))
        if (imageFile) fd.append("image", imageFile)
        if (videoFile) fd.append("video", videoFile)

        const res = await fetch("/api/artworks", { method: "POST", body: fd })
        if (res.ok) { setShowNew(false); fetchArtworks() }
    }

    const handleUpdate = (id: string) => async (draft: Partial<Artwork>, imageFile?: File, videoFile?: File) => {
        const fd = new FormData()
        if (draft.title !== undefined) fd.append("title", draft.title)
        if (draft.category !== undefined) fd.append("category", draft.category)
        if (draft.description !== undefined) fd.append("description", draft.description || "")
        if (draft.tags !== undefined) fd.append("tags", JSON.stringify(draft.tags))
        if (draft.process_steps !== undefined) fd.append("process_steps", JSON.stringify(draft.process_steps))
        if (imageFile) fd.append("image", imageFile)
        if (videoFile) fd.append("video", videoFile)

        await fetch(`/api/artworks/${id}`, { method: "PATCH", body: fd })
        fetchArtworks()
    }

    const handleDelete = (id: string) => async () => {
        await fetch(`/api/artworks/${id}`, { method: "DELETE" })
        setArtworks(a => a.filter(x => x.id !== id))
    }

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" })
        router.push("/admin")
    }

    return (
        <main style={{ minHeight: "100vh", background: "var(--background)", padding: "2rem 1.5rem" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>

                {/* Header */}
                <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    marginBottom: "2rem", flexWrap: "wrap", gap: "1rem",
                }}>
                    <div>
                        <p style={{ fontFamily: "var(--font-geist)", fontSize: "0.65rem", letterSpacing: "0.25em", color: "var(--muted-foreground)", marginBottom: "0.25rem" }}>
                            DARK KNIGHT STUDIOS
                        </p>
                        <h1 style={{
                            fontFamily: "var(--font-bangers)", fontSize: "2.5rem",
                            color: "var(--foreground)", letterSpacing: "0.04em",
                            textShadow: "3px 3px 0 var(--primary)", lineHeight: 1,
                        }}>
                            ARTWORK <span style={{ color: "var(--primary)" }}>VAULT</span>
                        </h1>
                    </div>

                    <div style={{ display: "flex", gap: "0.75rem" }}>
                        <button
                            onClick={() => setShowNew(true)}
                            style={{
                                display: "flex", alignItems: "center", gap: 6,
                                padding: "0.6rem 1.25rem",
                                background: "var(--primary)",
                                color: "var(--primary-foreground)",
                                fontFamily: "var(--font-bangers)", fontSize: "1rem",
                                letterSpacing: "0.08em",
                                border: "2px solid var(--foreground)",
                                boxShadow: "3px 3px 0 var(--foreground)",
                            }}
                        >
                            <Plus size={16} /> NEW ARTWORK
                        </button>

                        <button
                            onClick={handleLogout}
                            style={{
                                display: "flex", alignItems: "center", gap: 6,
                                padding: "0.6rem 1rem",
                                background: "transparent",
                                color: "var(--muted-foreground)",
                                fontFamily: "var(--font-bangers)", fontSize: "0.9rem",
                                border: "2px solid var(--border)",
                            }}
                        >
                            <LogOut size={14} /> LOGOUT
                        </button>
                    </div>
                </div>

                {/* Stats bar */}
                <div style={{
                    display: "flex", gap: "1rem", marginBottom: "2rem",
                    padding: "0.75rem 1rem",
                    border: "2px solid var(--border)",
                    background: "var(--card)",
                }}>
                    {[
                        { label: "TOTAL ARTWORKS", value: artworks.length },
                        { label: "CATEGORIES", value: new Set(artworks.map(a => a.category)).size },
                        { label: "WITH IMAGES", value: artworks.filter(a => a.image_url).length },
                    ].map(stat => (
                        <div key={stat.label} style={{ marginRight: "2rem" }}>
                            <p style={{ fontFamily: "var(--font-geist)", fontSize: "0.6rem", letterSpacing: "0.15em", color: "var(--muted-foreground)", margin: 0 }}>{stat.label}</p>
                            <p style={{ fontFamily: "var(--font-bangers)", fontSize: "1.8rem", color: "var(--primary)", margin: 0, lineHeight: 1 }}>{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* New artwork card */}
                <AnimatePresence>
                    {showNew && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            style={{ marginBottom: "1.5rem", overflow: "hidden" }}
                        >
                            <p style={{ fontFamily: "var(--font-bangers)", fontSize: "0.75rem", letterSpacing: "0.2em", color: "var(--primary)", marginBottom: "0.75rem" }}>
                                ── NEW ARTWORK ──
                            </p>
                            <div style={{ maxWidth: 380 }}>
                                <ArtworkCard
                                    artwork={{ title: "", category: "", description: "", tags: [], process_steps: ["", "", ""], order: artworks.length }}
                                    onSave={handleCreate}
                                    isNew
                                    onCancelNew={() => setShowNew(false)}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Artworks grid */}
                {loading ? (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200, gap: "0.75rem" }}>
                        <Loader2 size={20} style={{ color: "var(--primary)", animation: "spin 1s linear infinite" }} />
                        <p style={{ fontFamily: "var(--font-bangers)", fontSize: "1.2rem", color: "var(--muted-foreground)", letterSpacing: "0.1em" }}>
                            LOADING VAULT...
                        </p>
                    </div>
                ) : artworks.length === 0 ? (
                    <div style={{
                        border: "3px dashed var(--border)",
                        padding: "4rem",
                        textAlign: "center",
                    }}>
                        <p style={{ fontFamily: "var(--font-bangers)", fontSize: "1.5rem", color: "var(--muted-foreground)", letterSpacing: "0.1em" }}>
                            THE VAULT IS EMPTY
                        </p>
                        <p style={{ fontFamily: "var(--font-geist)", fontSize: "0.8rem", color: "var(--muted-foreground)", marginTop: "0.5rem" }}>
                            Add your first artwork to get started
                        </p>
                    </div>
                ) : (
                    <motion.div
                        layout
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                            gap: "1.5rem",
                        }}
                    >
                        <AnimatePresence>
                            {artworks.map(artwork => (
                                <ArtworkCard
                                    key={artwork.id}
                                    artwork={artwork}
                                    onSave={handleUpdate(artwork.id)}
                                    onDelete={handleDelete(artwork.id)}
                                />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </main>
    )
}