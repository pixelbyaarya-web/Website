"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ExternalLink, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import type { Artwork } from "@/lib/types"

// Explicit type used by the UI — shared between modal, card, and section
export interface PortfolioItem {
  id: string | number
  title: string
  category: string
  description: string
  process: string[]
  tags: string[]
  color: "primary" | "accent"
  image_url: string | null
  video_url: string | null
  media_type: "image" | "video"
}

// Map Artwork from DB to PortfolioItem
function mapArtwork(a: Artwork): PortfolioItem {
  return {
    id: a.id,
    title: a.title || "UNTITLED",
    category: a.category || "MISC",
    description: a.description || "",
    process: a.process_steps?.filter(Boolean) || [],
    tags: a.tags || [],
    color: (["BRAND IDENTITY", "BOOK DESIGN", "UI/UX DESIGN"].includes(a.category) ? "primary" : "accent") as "primary" | "accent",
    image_url: a.image_url ?? null,
    video_url: a.video_url ?? null,
    media_type: a.media_type ?? "image",
  }
}

const portfolioItems_PLACEHOLDER: PortfolioItem[] = [
  {
    id: 1,
    title: "SHADOW PROTOCOL",
    category: "BRAND IDENTITY",
    description: "A dark corporate identity for a cybersecurity firm. Bold typography meets sinister elegance.",
    process: ["Initial sketches exploring the duality of protection and threat", "Typography exploration — 40+ typeface combinations tested", "Final system: modular logo, dark palette, tactile materials"],
    tags: ["Branding", "Typography", "Print"],
    color: "primary",
    image_url: null,
    video_url: null,
    media_type: "image" as const,
  },
  {
    id: 2,
    title: "NEON REQUIEM",
    category: "ILLUSTRATION",
    description: "Digital illustration series exploring the duality of light and darkness in urban landscapes.",
    process: ["Mood boarding from film noir photography and neon signage", "Sketching the light/dark tension in rough thumbnail form", "Final renders with custom brush textures and halftone overlays"],
    tags: ["Illustration", "Digital", "Series"],
    color: "accent",
    image_url: null,
    video_url: null,
    media_type: "image" as const,
  },
  {
    id: 3,
    title: "ARKHAM CHRONICLES",
    category: "BOOK DESIGN",
    description: "Cover design and interior layouts for a graphic novel anthology.",
    process: ["Research into classic EC Comics and 70s horror anthology aesthetics", "Grid system designed for maximum dramatic tension between panels", "Cover composition balancing dread and intrigue"],
    tags: ["Editorial", "Book Design", "Illustration"],
    color: "primary",
    image_url: null,
    video_url: null,
    media_type: "image" as const,
  },
  {
    id: 4,
    title: "GOTHAM NIGHTS",
    category: "POSTER SERIES",
    description: "Limited edition poster collection inspired by film noir aesthetics.",
    process: ["Studied Saul Bass and vintage film poster composition", "Screen-printing simulation with deliberate misregistration", "Edition of 50 — all sold out within 48 hours"],
    tags: ["Poster", "Print", "Series"],
    color: "accent",
    image_url: null,
    video_url: null,
    media_type: "image" as const,
  },
  {
    id: 5,
    title: "VENDETTA",
    category: "UI/UX DESIGN",
    description: "Dark mode interface design for a music streaming application.",
    process: ["User flows built around emotional state, not genre", "Component library of 80+ dark-mode optimised elements", "Prototype tested with 200+ musicians"],
    tags: ["UI/UX", "App Design", "Dark Mode"],
    color: "primary",
    image_url: null,
    video_url: null,
    media_type: "image" as const,
  },
  {
    id: 6,
    title: "CHAOS THEORY",
    category: "CONCEPT ART",
    description: "Environmental concept art for an unreleased video game project.",
    process: ["World-building document: 12,000 words of lore developed first", "30 environment thumbnails before committing to final 8", "Each piece hand-textured with ink washes scanned at 1200dpi"],
    tags: ["Concept Art", "Game", "Environment"],
    color: "accent",
    image_url: null,
    video_url: null,
    media_type: "image" as const,
  },
]

const panelConfigs = [
  "col-span-12 md:col-span-7 row-span-2 -rotate-1",
  "col-span-12 md:col-span-5 row-span-1 rotate-1",
  "col-span-12 md:col-span-5 row-span-1 -rotate-2",
  "col-span-12 md:col-span-7 row-span-2 rotate-1",
  "col-span-12 md:col-span-6 row-span-1 -rotate-1",
  "col-span-12 md:col-span-6 row-span-1 rotate-2",
]

function PortfolioModal({ item, onClose }: { item: PortfolioItem; onClose: () => void }) {
  const [processStep, setProcessStep] = useState(0)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-8"
      style={{ background: "rgba(0,0,0,0.92)", paddingTop: "5rem" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85, rotate: -3, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        exit={{ scale: 0.85, rotate: 3, opacity: 0 }}
        transition={{ type: "spring", damping: 22, stiffness: 280 }}
        onClick={e => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 900,
          maxHeight: "82vh",
          overflowY: "auto",
          background: "var(--card)",
          border: "4px solid var(--foreground)",
          boxShadow: "8px 8px 0 var(--primary)",
          position: "relative",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 16, right: 16, zIndex: 10,
            width: 36, height: 36,
            background: "var(--primary)",
            border: "2px solid var(--foreground)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "none",
          }}
        >
          <X size={18} style={{ color: "var(--primary-foreground)" }} />
        </button>

        <div style={{ padding: "2rem" }}>
          {/* Header */}
          <div style={{ marginBottom: "1.5rem" }}>
            <span style={{
              display: "inline-block",
              padding: "2px 12px",
              border: `1px solid var(--${item.color})`,
              background: `color-mix(in oklch, var(--${item.color}) 15%, transparent)`,
              fontFamily: "var(--font-geist)",
              fontSize: 11,
              letterSpacing: "0.2em",
              color: `var(--${item.color})`,
              transform: "skewX(-6deg)",
              marginBottom: "0.75rem",
            }}>
              <span style={{ display: "inline-block", transform: "skewX(6deg)" }}>{item.category}</span>
            </span>

            <h2 style={{
              fontFamily: "var(--font-bangers)",
              fontSize: "clamp(2.5rem, 6vw, 4rem)",
              lineHeight: 1,
              color: "var(--foreground)",
              letterSpacing: "0.04em",
              textShadow: `3px 3px 0 var(--${item.color})`,
            }}>
              {item.title}
            </h2>
          </div>

          {/* Artwork image / placeholder */}
          <div style={{
            aspectRatio: "16/7",
            background: "var(--background)",
            border: "3px solid var(--border)",
            marginBottom: "1.5rem",
            position: "relative",
            overflow: "hidden",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {item.media_type === "video" && item.video_url ? (
              <video
                src={item.video_url}
                controls
                playsInline
                style={{ width: "100%", height: "100%", objectFit: "contain", background: "#000" }}
              />
            ) : item.image_url ? (
              <img
                src={item.image_url}
                alt={item.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <>
                <div style={{
                  position: "absolute", inset: 0,
                  backgroundImage: `radial-gradient(circle, var(--${item.color}) 1.5px, transparent 1.5px)`,
                  backgroundSize: "20px 20px",
                  opacity: 0.15,
                }} />
                <span style={{
                  fontFamily: "var(--font-bangers)",
                  fontSize: "1.5rem",
                  color: "var(--muted-foreground)",
                  opacity: 0.4,
                  letterSpacing: "0.15em",
                }}>
                  ARTWORK
                </span>
              </>
            )}
            {/* Panel number */}
            <span style={{
              position: "absolute", bottom: 8, right: 16,
              fontFamily: "var(--font-bangers)", fontSize: "5rem",
              color: "var(--border)", opacity: 0.25,
            }}>
              {String(item.title).slice(0, 2).toUpperCase()}
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            {/* Description */}
            <div>
              <div style={{
                borderLeft: `3px solid var(--${item.color})`,
                paddingLeft: "1rem",
                marginBottom: "1.5rem",
              }}>
                <p style={{ fontFamily: "var(--font-geist)", color: "var(--muted-foreground)", lineHeight: 1.7 }}>
                  {item.description}
                </p>
              </div>

              {/* Tags */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {item.tags.map(tag => (
                  <span key={tag} style={{
                    padding: "2px 10px",
                    border: "1px solid var(--border)",
                    fontFamily: "var(--font-geist)",
                    fontSize: 11,
                    color: "var(--muted-foreground)",
                    letterSpacing: "0.1em",
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Process strip — like comic panels */}
            <div>
              <p style={{
                fontFamily: "var(--font-bangers)",
                fontSize: "0.85rem",
                letterSpacing: "0.15em",
                color: "var(--muted-foreground)",
                marginBottom: "0.75rem",
              }}>
                THE PROCESS
              </p>

              {/* Step panels */}
              <div style={{ position: "relative" }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={processStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      background: "var(--background)",
                      border: "2px solid var(--border)",
                      padding: "1rem",
                      minHeight: 80,
                      boxShadow: "3px 3px 0 var(--border)",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <span style={{
                      display: "block",
                      fontFamily: "var(--font-bangers)",
                      fontSize: "0.75rem",
                      color: `var(--${item.color})`,
                      letterSpacing: "0.1em",
                      marginBottom: "0.4rem",
                    }}>
                      STEP {processStep + 1} / {item.process.length}
                    </span>
                    <p style={{
                      fontFamily: "var(--font-geist)",
                      fontSize: "0.875rem",
                      color: "var(--foreground)",
                      lineHeight: 1.6,
                    }}>
                      {item.process[processStep]}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={() => setProcessStep(s => Math.max(0, s - 1))}
                    disabled={processStep === 0}
                    style={{
                      flex: 1, padding: "6px",
                      border: "2px solid var(--border)",
                      background: processStep === 0 ? "transparent" : "var(--card)",
                      color: "var(--foreground)",
                      cursor: processStep === 0 ? "default" : "none",
                      opacity: processStep === 0 ? 0.3 : 1,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {item.process.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setProcessStep(i)}
                      style={{
                        width: 28, height: 28,
                        border: "2px solid var(--border)",
                        background: i === processStep ? `var(--${item.color})` : "transparent",
                        cursor: "none",
                        fontFamily: "var(--font-bangers)",
                        fontSize: 11,
                        color: i === processStep ? "var(--primary-foreground)" : "var(--muted-foreground)",
                      }}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setProcessStep(s => Math.min(item.process.length - 1, s + 1))}
                    disabled={processStep === item.process.length - 1}
                    style={{
                      flex: 1, padding: "6px",
                      border: "2px solid var(--border)",
                      background: processStep === item.process.length - 1 ? "transparent" : "var(--card)",
                      color: "var(--foreground)",
                      cursor: processStep === item.process.length - 1 ? "default" : "none",
                      opacity: processStep === item.process.length - 1 ? 0.3 : 1,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Panel border draw-on effect via SVG stroke animation
function DrawBorder({ active }: { active: boolean }) {
  return (
    <svg
      style={{
        position: "absolute", inset: -3,
        width: "calc(100% + 6px)", height: "calc(100% + 6px)",
        pointerEvents: "none", zIndex: 5, overflow: "visible",
      }}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <rect
        x="1" y="1" width="98" height="98"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="2.5"
        strokeDasharray="400"
        strokeDashoffset={active ? 0 : 400}
        style={{
          transition: active
            ? "stroke-dashoffset 0.5s cubic-bezier(0.22,1,0.36,1)"
            : "stroke-dashoffset 0.3s ease-in",
          vectorEffect: "non-scaling-stroke",
        }}
      />
      {/* Corner brackets that pop in */}
      {active && [
        "M 3,10 L 3,3 L 10,3",
        "M 90,3 L 97,3 L 97,10",
        "M 97,90 L 97,97 L 90,97",
        "M 10,97 L 3,97 L 3,90",
      ].map((d, i) => (
        <motion.path
          key={i}
          d={d}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="3"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ delay: 0.3 + i * 0.05, duration: 0.2 }}
          style={{ vectorEffect: "non-scaling-stroke" }}
        />
      ))}
    </svg>
  )
}

export function PortfolioSection() {
  const [rawArtworks, setRawArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null)
  const [hoveredId, setHoveredId] = useState<string | number | null>(null)

  useEffect(() => {
    fetch("/api/artworks")
      .then(r => r.json())
      .then(data => {
        setRawArtworks(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const portfolioItems = rawArtworks.length > 0
    ? rawArtworks.map(mapArtwork)
    : portfolioItems_PLACEHOLDER

  return (
    <section id="portfolio" className="relative py-24 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-6"
        >
          <div className="w-24 h-1 bg-border" />
          <h2 className="font-[var(--font-bangers)] text-5xl md:text-6xl comic-title text-foreground">
            THE <span className="text-primary">GALLERY</span>
          </h2>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="caption-box inline-block mt-6 max-w-lg"
        >
          <span className="font-[var(--font-geist)] text-muted-foreground italic">
            A curated collection of visual narratives, each telling its own dark tale...
          </span>
        </motion.p>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-12 gap-4 auto-rows-[200px] md:auto-rows-[250px]">
          {portfolioItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 50, rotate: index % 2 === 0 ? -5 : 5 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className={`${panelConfigs[index]} cursor-pointer group relative`}
              onClick={() => setSelectedItem(item)}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Draw-on border */}
              <DrawBorder active={hoveredId === item.id} />

              <div className="comic-panel h-full bg-card relative overflow-hidden">
                {/* Artwork media — video thumbnail or image */}
                {item.media_type === "video" && item.video_url ? (
                  <>
                    <video
                      src={item.video_url}
                      muted playsInline preload="metadata"
                      style={{
                        position: "absolute", inset: 0,
                        width: "100%", height: "100%",
                        objectFit: "cover", opacity: 0.45,
                        transition: "opacity 0.3s",
                        pointerEvents: "none",
                      }}
                    />
                    {/* Play badge */}
                    <div style={{
                      position: "absolute", top: "50%", left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: 44, height: 44,
                      background: "rgba(0,0,0,0.7)",
                      border: "2px solid var(--primary)",
                      borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      zIndex: 3, pointerEvents: "none",
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--primary)">
                        <polygon points="5,3 19,12 5,21" />
                      </svg>
                    </div>
                  </>
                ) : item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    style={{
                      position: "absolute", inset: 0,
                      width: "100%", height: "100%",
                      objectFit: "cover", opacity: 0.45,
                      transition: "opacity 0.3s",
                    }}
                    className="group-hover:opacity-70"
                  />
                ) : null}
                <div className={`absolute inset-0 bg-gradient-to-br transition-opacity duration-500 ${item.color === "primary" ? "from-primary/20 via-transparent to-background" : "from-accent/20 via-transparent to-background"}`} />
                <div className={`absolute top-0 right-0 w-1/2 h-full ${item.color === "primary" ? "bg-border/20" : "bg-border/10"} clip-diagonal-bl transform group-hover:translate-x-4 transition-transform duration-700`} />

                <div className="relative h-full flex flex-col justify-end p-6">
                  <div className={`absolute top-4 left-4 px-3 py-1 opacity-80 group-hover:opacity-100 ${item.color === "primary" ? "bg-primary/20 border-primary/50" : "bg-accent/20 border-accent/50"} border text-xs font-[var(--font-geist)] tracking-wider transform -skew-x-6 transition-[color,border-color,background-color,opacity] duration-200`}>
                    <span className={`inline-block skew-x-6 ${item.color === "primary" ? "text-primary" : "text-accent"}`}>{item.category}</span>
                  </div>

                  <h3 className="font-[var(--font-bangers)] text-2xl md:text-3xl text-foreground mb-2 transform group-hover:translate-x-2 transition-transform duration-500">
                    {item.title}
                  </h3>

                  <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-[color,border-color,background-color,opacity] duration-300">
                    <div className="caption-box">
                      <p className="font-[var(--font-geist)] text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-2 right-4 font-[var(--font-bangers)] text-4xl text-border/20 group-hover:text-primary/20 transition-colors duration-500">
                  {String(index + 1).padStart(2, "0")}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedItem && <PortfolioModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
      </AnimatePresence>

      <div className="absolute bottom-0 left-0 w-full h-1 bg-border/30" />
    </section>
  )
}