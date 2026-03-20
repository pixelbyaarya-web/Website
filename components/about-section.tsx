"use client"

import { useRef, useEffect, useState } from "react"
import { motion } from "framer-motion"

const timelineEvents = [
  {
    year: "2012",
    title: "THE SPARK",
    caption: "Started sketching in the margins of old newspapers—never really cared what the headlines said after that.",
    panel: "01",
    wide: true,
  },
  {
    year: "2017",
    title: "GOES DARK",
    caption: "Got into comics and fell down the rabbit hole of superhero lore—never really came back out.",
    panel: "02",
    wide: false,
  },
  {
    year: "2023",
    title: "STUDIO BORN",
    caption: "Took a Gulzar poem and gave it motion—somewhere between frames, it stopped being just words.",
    panel: "03",
    wide: true,
  },
  {
    year: "2025",
    title: "PROJECTS",
    caption: "Wrapped one motion graphics projects in Clip Studio Paint & Adobe After Effects—already halfway to the third.",
    panel: "04",
    wide: false,
  },
  {
    year: "NOW",
    title: "STILL HUNGRY",
    caption: "Building stranger, bolder, darker work. Looking for the next story worth telling.",
    panel: "05",
    wide: false,
  },
]

function TimelinePanel({
  event,
  index,
}: {
  event: typeof timelineEvents[0]
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.25 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const fromX = index % 2 === 0 ? -40 : 40

  return (
    <div
      ref={ref}
      className="relative flex-shrink-0 w-56 md:w-72"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateX(0) rotate(0deg)"
          : `translateX(${fromX}px) rotate(${index % 2 === 0 ? -4 : 4}deg)`,
        transition: `opacity 0.45s ease ${index * 0.06}s, transform 0.45s cubic-bezier(0.22,1,0.36,1) ${index * 0.06}s`,
      }}
    >
      {/* Year label above */}
      <div style={{
        fontFamily: "var(--font-bangers)",
        fontSize: "0.75rem",
        letterSpacing: "0.2em",
        color: "var(--primary)",
        marginBottom: "0.5rem",
        paddingLeft: "0.25rem",
      }}>
        {event.year}
      </div>

      {/* Panel */}
      <div style={{
        border: "3px solid var(--foreground)",
        boxShadow: "5px 5px 0 var(--foreground)",
        background: "var(--card)",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Artwork placeholder */}
        <div style={{
          height: 150,
          background: "var(--background)",
          position: "relative",
          overflow: "hidden",
          borderBottom: "2px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {/* Halftone */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: `radial-gradient(circle, var(--primary) 1.5px, transparent 1.5px)`,
            backgroundSize: "16px 16px",
            opacity: 0.12,
          }} />
          {/* Speed lines */}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.06 }}>
            {Array.from({ length: 16 }).map((_, i) => {
              const a = (i / 16) * Math.PI * 2
              return <line key={i} x1="50%" y1="50%"
                x2={`${50 + Math.cos(a) * 100}%`} y2={`${50 + Math.sin(a) * 100}%`}
                stroke="var(--foreground)" strokeWidth="1" />
            })}
          </svg>
          <span style={{
            fontFamily: "var(--font-bangers)",
            fontSize: "4rem",
            color: "var(--border)",
            opacity: 0.3,
            letterSpacing: "0.05em",
          }}>
            {event.year}
          </span>
        </div>

        {/* Caption area */}
        <div style={{ padding: "0.875rem 1rem" }}>
          <div style={{
            fontFamily: "var(--font-bangers)",
            fontSize: "1.1rem",
            letterSpacing: "0.06em",
            color: "var(--foreground)",
            marginBottom: "0.4rem",
          }}>
            {event.title}
          </div>
          <p style={{
            fontFamily: "var(--font-geist)",
            fontSize: "0.8rem",
            color: "var(--muted-foreground)",
            lineHeight: 1.55,
            fontStyle: "italic",
          }}>
            {event.caption}
          </p>
        </div>

        {/* Panel number */}
        <span style={{
          position: "absolute", bottom: 6, right: 10,
          fontFamily: "var(--font-bangers)", fontSize: "2.5rem",
          color: "var(--border)", opacity: 0.2,
        }}>
          {event.panel}
        </span>
      </div>

      {/* Connector dot on the timeline rail */}
      <div style={{
        position: "absolute",
        bottom: -28,
        left: "50%",
        transform: "translateX(-50%)",
        width: 12, height: 12,
        background: "var(--primary)",
        border: "2px solid var(--foreground)",
        rotate: "45deg",
      }} />
    </div>
  )
}

export function AboutSection() {
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <section id="about" className="relative py-24 bg-background overflow-hidden">
      <div className="absolute inset-0 halftone opacity-30" />

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="font-[var(--font-geist)] text-sm text-muted-foreground tracking-[0.3em] block mb-4">
            CHAPTER TWO
          </span>
          <h2 className="font-[var(--font-bangers)] text-5xl md:text-7xl comic-title text-foreground">
            THE <span className="text-accent">ORIGIN</span> STORY
          </h2>
        </motion.div>

        {/* Character intro */}
        <div className="grid grid-cols-12 gap-6 items-start mb-24">
          <motion.div
            initial={{ opacity: 0, x: -50, rotate: -3 }}
            whileInView={{ opacity: 1, x: 0, rotate: -2 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="col-span-12 lg:col-span-5"
          >
            <div className="comic-panel bg-card p-6 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="aspect-[3/4] bg-gotham-grey border-4 border-border mb-6 relative overflow-hidden group/portrait">
                <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.5 }} className="absolute inset-0">
                  <div className="absolute inset-0 bg-gradient-to-t from-gotham-black via-transparent to-transparent z-10" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-[var(--font-bangers)] text-3xl text-muted-foreground/30">PORTRAIT</span>
                  </div>
                  <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/20 clip-diagonal-bl" />
                </motion.div>
              </div>
              <div className="space-y-3">
                {[
                  { label: "ALIAS", value: "THE STORYTELLER", color: "text-primary" },
                  { label: "CLASS", value: "VISUAL ARTIST", color: "text-foreground" },
                  { label: "POWERS", value: "CREATIVITY LV.99", color: "text-accent" },
                ].map(row => (
                  <div key={row.label} className="flex justify-between items-center border-b border-border pb-2">
                    <span className="font-[var(--font-geist)] text-sm text-muted-foreground">{row.label}</span>
                    <span className={`font-[var(--font-bangers)] text-lg ${row.color}`}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="col-span-12 lg:col-span-7 space-y-6">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.5 }}>
              <div className="speech-bubble max-w-xl ml-auto">
                <p className="font-[var(--font-geist)] text-base leading-relaxed">
                  {"They say every great villain has an origin story. Well, I'm not a villain—I'm just someone who fell in love with the stylus."}
                </p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.6 }} className="caption-box transform rotate-1">
              <p className="font-[var(--font-geist)] text-muted-foreground leading-relaxed">
                With over 3 years of experience in the dark arts of graphic design, I specialize in creating visual narratives that command attention. My work lives in the space between chaos and order.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30, rotate: 2 }} whileInView={{ opacity: 1, y: 0, rotate: 1 }} viewport={{ once: true }} transition={{ delay: 0.5, duration: 0.6 }} className="comic-panel bg-card p-6 transform rotate-1 hover:rotate-0 transition-transform duration-300">
              <h3 className="font-[var(--font-bangers)] text-2xl text-foreground mb-4">ABILITIES <span className="text-primary">&</span> SKILLS</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { skill: "AutoDesk Maya", level: 80 },
                  { skill: "Illustration", level: 90 },
                  { skill: "Adobe Creative Suite", level: 93 },
                  { skill: "Motion Graphics", level: 85 },
                  { skill: "Blender", level: 50 },
                  { skill: "Concept Art", level: 88 },
                ].map((item, index) => (
                  <div key={item.skill} className="space-y-1">
                    <div className="flex justify-between">
                      <span className="font-[var(--font-geist)] text-sm text-muted-foreground">{item.skill}</span>
                      <span className="font-[var(--font-bangers)] text-sm text-primary">{item.level}%</span>
                    </div>
                    <div className="h-2 bg-gotham-grey overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.level}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 + index * 0.1, duration: 0.8 }}
                        className={`h-full ${index % 2 === 0 ? "bg-primary" : "bg-accent"}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── TIMELINE ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-1 bg-primary" />
            <span className="font-[var(--font-bangers)] text-2xl text-foreground tracking-wider">
              THE <span className="text-primary">STORY SO FAR</span>
            </span>
          </div>
          <p style={{ fontFamily: "var(--font-geist)", fontSize: "0.8rem", color: "var(--muted-foreground)", letterSpacing: "0.1em" }}>
            SCROLL HORIZONTALLY →
          </p>
        </motion.div>

        {/* Horizontal scroll strip */}
        <div
          ref={scrollRef}
          style={{
            overflowX: "auto",
            overflowY: "visible",
            paddingBottom: "3rem",
            paddingTop: "0.5rem",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          className="hide-scrollbar"
        >
          <div style={{
            display: "flex",
            gap: "2.5rem",
            alignItems: "flex-start",
            width: "max-content",
            paddingBottom: "2rem",
            paddingLeft: "0.5rem",
            paddingRight: "3rem",
            position: "relative",
          }}>
            {/* Timeline rail */}
            <div style={{
              position: "absolute",
              bottom: "1.5rem",
              left: 0, right: 0,
              height: 3,
              background: "var(--border)",
            }} />
            {/* Rail accent */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              style={{
                position: "absolute",
                bottom: "1.5rem",
                left: 0, right: 0,
                height: 3,
                background: "var(--primary)",
                transformOrigin: "left",
              }}
            />

            {timelineEvents.map((event, i) => (
              <TimelinePanel key={event.year} event={event} index={i} />
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-8 w-20 h-20 border-l-4 border-b-4 border-accent/30" />
      <div className="absolute top-8 right-8 w-20 h-20 border-r-4 border-t-4 border-primary/30" />
    </section>
  )
}