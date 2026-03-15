"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, MapPin, Send, CheckCircle } from "lucide-react"

// Ink border input — SVG border draws on focus
function InkInput({
  label, type = "text", placeholder, rows, value, onChange, name,
}: {
  label: string
  type?: string
  placeholder: string
  rows?: number
  value: string
  onChange: (v: string) => void
  name: string
}) {
  const [focused, setFocused] = useState(false)
  const Tag = rows ? "textarea" : "input"

  return (
    <div style={{ position: "relative" }}>
      <label style={{
        display: "block",
        fontFamily: "var(--font-geist)",
        fontSize: "0.72rem",
        letterSpacing: "0.18em",
        color: focused ? "var(--primary)" : "var(--muted-foreground)",
        marginBottom: "0.4rem",
        transition: "color 0.2s",
      }}>
        {label}
      </label>

      <div style={{ position: "relative" }}>
        {/* SVG ink border */}
        <svg
          style={{
            position: "absolute", inset: -1,
            width: "calc(100% + 2px)", height: "calc(100% + 2px)",
            pointerEvents: "none", overflow: "visible", zIndex: 2,
          }}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <rect
            x="0.5" y="0.5" width="99" height="99"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="2"
            strokeDasharray="400"
            strokeDashoffset={focused ? 0 : 400}
            style={{
              transition: focused
                ? "stroke-dashoffset 0.45s cubic-bezier(0.22,1,0.36,1)"
                : "stroke-dashoffset 0.25s ease-in",
              vectorEffect: "non-scaling-stroke",
            }}
          />
        </svg>

        <Tag
          {...(rows ? { rows } : { type })}
          name={name}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          style={{
            width: "100%",
            padding: "0.75rem 1rem",
            background: "var(--background)",
            border: "2px solid var(--border)",
            color: "var(--foreground)",
            fontFamily: "var(--font-geist)",
            fontSize: "0.9rem",
            outline: "none",
            resize: rows ? "none" : undefined,
            display: "block",
            transition: "border-color 0.2s",
            borderColor: focused ? "transparent" : undefined,
          }}
        />
      </div>
    </div>
  )
}

export function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState("")
  const btnRef = useRef<HTMLButtonElement>(null)

  const set = (k: keyof typeof form) => (v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (sending || submitted) return
    setError("")
    setSending(true)

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      setSubmitted(true)
    } else {
      const data = await res.json()
      setError(data.error || "Something went wrong. Please try again.")
    }
    setSending(false)
  }

  return (
    <section id="contact" className="relative py-24 bg-background overflow-hidden">
      <div className="absolute inset-0 clip-slant-right bg-border/5" />

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
            CHAPTER THREE
          </span>
          <h2 className="font-[var(--font-bangers)] text-5xl md:text-7xl comic-title text-foreground">
            SEND A <span className="text-primary">SIGNAL</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-12 gap-8">
          {/* Left — info panels */}
          <div className="col-span-12 lg:col-span-5 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -50, rotate: -2 }}
              whileInView={{ opacity: 1, x: 0, rotate: -1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="comic-panel bg-card p-6 transform -rotate-1 hover:rotate-0 transition-transform duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/20 border border-primary/50 flex items-center justify-center transform -skew-x-6">
                  <Mail className="w-5 h-5 text-primary transform skew-x-6" />
                </div>
                <div>
                  <h3 className="font-[var(--font-bangers)] text-xl text-foreground mb-1">DIRECT LINE</h3>
                  <p className="font-[var(--font-geist)] text-muted-foreground">hello@darkknight.studio</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -50, rotate: 2 }}
              whileInView={{ opacity: 1, x: 0, rotate: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="comic-panel bg-card p-6 transform rotate-1 hover:rotate-0 transition-transform duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-card border border-border flex items-center justify-center transform skew-x-6 transition-all">
                  <MapPin className="w-5 h-5 text-accent transform -skew-x-6" />
                </div>
                <div>
                  <h3 className="font-[var(--font-bangers)] text-xl text-foreground mb-1">LOCATION</h3>
                  <p className="font-[var(--font-geist)] text-muted-foreground">Gotham City, USA</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="speech-bubble">
                <p className="font-[var(--font-geist)] text-base">
                  {"Ready to bring your darkest creative visions to life? Let's talk."}
                </p>
              </div>
            </motion.div>

            {/* Response time panel */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              style={{
                border: "2px solid var(--border)",
                padding: "1rem 1.25rem",
                background: "var(--card)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 2,
                background: "linear-gradient(90deg, var(--primary), var(--accent))",
              }} />
              <p style={{ fontFamily: "var(--font-bangers)", fontSize: "0.8rem", letterSpacing: "0.15em", color: "var(--muted-foreground)", margin: "0 0 0.25rem" }}>
                RESPONSE TIME
              </p>
              <p style={{ fontFamily: "var(--font-bangers)", fontSize: "1.4rem", color: "var(--primary)", margin: 0 }}>
                WITHIN 24 HOURS
              </p>
            </motion.div>
          </div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotate: 2 }}
            whileInView={{ opacity: 1, x: 0, rotate: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="col-span-12 lg:col-span-7"
          >
            <div className="comic-panel bg-card p-6 md:p-8 transform rotate-1 hover:rotate-0 transition-transform duration-500">
              <h3 className="font-[var(--font-bangers)] text-3xl text-foreground mb-6">
                DROP A <span className="text-accent">MESSAGE</span>
              </h3>

              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -20 }}
                    onSubmit={handleSubmit}
                    style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
                  >
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}
                      className="grid-cols-1 sm:grid-cols-2">
                      <InkInput label="NAME" placeholder="Your alias..." value={form.name} onChange={set("name")} name="name" />
                      <InkInput label="EMAIL" type="email" placeholder="Your signal..." value={form.email} onChange={set("email")} name="email" />
                    </div>
                    <InkInput label="SUBJECT" placeholder="Mission briefing..." value={form.subject} onChange={set("subject")} name="subject" />
                    <InkInput label="MESSAGE" placeholder="Describe your vision..." rows={5} value={form.message} onChange={set("message")} name="message" />

                    {error && (
                      <div style={{
                        padding: "0.6rem 0.75rem",
                        border: "2px solid #ef4444",
                        background: "color-mix(in srgb, #ef4444 10%, transparent)",
                        fontFamily: "var(--font-geist)",
                        fontSize: "0.8rem",
                        color: "#ef4444",
                      }}>
                        {error}
                      </div>
                    )}

                    <button
                      ref={btnRef}
                      type="submit"
                      disabled={sending}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem",
                        padding: "1rem 2rem",
                        background: sending ? "var(--muted)" : "var(--primary)",
                        color: "var(--primary-foreground)",
                        fontFamily: "var(--font-bangers)",
                        fontSize: "1.2rem",
                        letterSpacing: "0.1em",
                        border: "none",
                        cursor: sending ? "wait" : "none",
                        transform: "skewX(-6deg)",
                        transition: "all 0.2s",
                        boxShadow: sending ? "none" : "4px 4px 0 var(--foreground)",
                        alignSelf: "flex-start",
                      }}
                    >
                      <span style={{ display: "inline-block", transform: "skewX(6deg)" }}>
                        {sending ? "TRANSMITTING..." : "TRANSMIT"}
                      </span>
                      {!sending && <Send size={18} style={{ transform: "skewX(6deg)" }} />}
                      {sending && (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                          style={{
                            width: 18, height: 18,
                            border: "2px solid var(--primary-foreground)",
                            borderTopColor: "transparent",
                            borderRadius: "50%",
                            transform: "skewX(6deg)",
                          }}
                        />
                      )}
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ type: "spring", bounce: 0.4 }}
                    style={{
                      display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center",
                      gap: "1rem",
                      padding: "3rem 1rem",
                      textAlign: "center",
                      border: "3px solid var(--primary)",
                      boxShadow: "6px 6px 0 var(--primary)",
                    }}
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.1, type: "spring", bounce: 0.5 }}
                    >
                      <CheckCircle size={48} style={{ color: "var(--primary)" }} />
                    </motion.div>
                    <h4 style={{ fontFamily: "var(--font-bangers)", fontSize: "2rem", letterSpacing: "0.06em", color: "var(--foreground)", margin: 0 }}>
                      SIGNAL RECEIVED!
                    </h4>
                    <p style={{ fontFamily: "var(--font-geist)", color: "var(--muted-foreground)", margin: 0 }}>
                      I'll be in touch within 24 hours.
                    </p>
                    {/* Halftone burst */}
                    <div style={{
                      position: "absolute", inset: 0, pointerEvents: "none",
                      backgroundImage: `radial-gradient(circle, var(--primary) 1.5px, transparent 1.5px)`,
                      backgroundSize: "18px 18px",
                      opacity: 0.08,
                    }} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-24 border-t border-border"
      >
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-[var(--font-geist)] text-sm text-muted-foreground">
            © 2026 Dark Knight Studios. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["TWITTER", "DRIBBBLE", "BEHANCE"].map(social => (
              <a key={social} href="#" className="font-[var(--font-bangers)] text-sm text-muted-foreground hover:text-primary transition-colors">
                {social}
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}