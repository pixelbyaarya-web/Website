"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    if (res.ok) {
      router.push("/admin/dashboard")
    } else {
      const data = await res.json()
      setError(data.error || "Login failed")
    }
    setLoading(false)
  }

  return (
    <main style={{
      minHeight: "100vh",
      background: "var(--background)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1.5rem",
      position: "relative",
      overflow: "hidden",
    }}>
      <div className="absolute inset-0 halftone opacity-20" />

      {/* Rotating starburst */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute", width: 600, height: 600,
          opacity: 0.04, pointerEvents: "none",
        }}
      >
        <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", fill: "var(--primary)" }}>
          <path d="M50 0L55 35L90 20L65 45L100 50L65 55L90 80L55 65L50 100L45 65L10 80L35 55L0 50L35 45L10 20L45 35Z" />
        </svg>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30, rotate: -2 }}
        animate={{ opacity: 1, y: 0, rotate: -1 }}
        transition={{ type: "spring", damping: 20 }}
        style={{ position: "relative", width: "100%", maxWidth: 420 }}
      >
        {/* Back button */}
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <a href="/" style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontFamily: "var(--font-bangers)",
            fontSize: "0.85rem",
            letterSpacing: "0.1em",
            color: "var(--muted-foreground)",
            textDecoration: "none",
            transition: "color 0.15s",
          }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--primary)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--muted-foreground)")}
          >
            ← BACK TO SITE
          </a>
        </div>

        {/* Issue label */}
        <p style={{
          fontFamily: "var(--font-geist)",
          fontSize: "0.65rem",
          letterSpacing: "0.3em",
          color: "var(--muted-foreground)",
          textAlign: "center",
          marginBottom: "1rem",
          textTransform: "uppercase",
        }}>
          PIXEL BY AARYA — ADMIN ACCESS
        </p>

        <div style={{
          border: "4px solid var(--foreground)",
          boxShadow: "8px 8px 0 var(--foreground)",
          background: "var(--card)",
          padding: "2.5rem",
          position: "relative",
        }}>
          {/* BAM badge */}
          <motion.div
            initial={{ scale: 0, rotate: 20 }}
            animate={{ scale: 1, rotate: 15 }}
            transition={{ delay: 0.3, type: "spring", bounce: 0.5 }}
            style={{
              position: "absolute", top: -16, right: -12,
              background: "var(--primary)",
              border: "3px solid var(--foreground)",
              boxShadow: "3px 3px 0 var(--foreground)",
              padding: "0.15rem 0.6rem",
              fontFamily: "var(--font-bangers)",
              fontSize: "1.1rem",
              color: "var(--primary-foreground)",
              letterSpacing: "0.05em",
            }}
          >
            CLASSIFIED
          </motion.div>

          <h1 style={{
            fontFamily: "var(--font-bangers)",
            fontSize: "2.8rem",
            color: "var(--foreground)",
            letterSpacing: "0.04em",
            textShadow: "3px 3px 0 var(--primary)",
            marginBottom: "0.25rem",
            lineHeight: 1,
          }}>
            ACCESS<br />
            <span style={{ color: "var(--primary)" }}>GRANTED?</span>
          </h1>
          <p style={{
            fontFamily: "var(--font-geist)",
            fontSize: "0.8rem",
            color: "var(--muted-foreground)",
            marginBottom: "2rem",
            fontStyle: "italic",
          }}>
            Identify yourself, vigilante.
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* Email */}
            <div>
              <label style={{
                display: "block",
                fontFamily: "var(--font-geist)",
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                color: "var(--muted-foreground)",
                marginBottom: "0.4rem",
              }}>
                EMAIL
              </label>
              <div style={{ position: "relative" }}>
                <Mail size={14} style={{
                  position: "absolute", left: 12, top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--muted-foreground)",
                }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem 0.75rem 2.25rem",
                    background: "var(--background)",
                    border: "2px solid var(--border)",
                    color: "var(--foreground)",
                    fontFamily: "var(--font-geist)",
                    fontSize: "0.9rem",
                    outline: "none",
                  }}
                  onFocus={e => e.target.style.borderColor = "var(--primary)"}
                  onBlur={e => e.target.style.borderColor = "var(--border)"}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{
                display: "block",
                fontFamily: "var(--font-geist)",
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                color: "var(--muted-foreground)",
                marginBottom: "0.4rem",
              }}>
                PASSWORD
              </label>
              <div style={{ position: "relative" }}>
                <Lock size={14} style={{
                  position: "absolute", left: 12, top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--muted-foreground)",
                }} />
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={{
                    width: "100%",
                    padding: "0.75rem 2.5rem 0.75rem 2.25rem",
                    background: "var(--background)",
                    border: "2px solid var(--border)",
                    color: "var(--foreground)",
                    fontFamily: "var(--font-geist)",
                    fontSize: "0.9rem",
                    outline: "none",
                  }}
                  onFocus={e => e.target.style.borderColor = "var(--primary)"}
                  onBlur={e => e.target.style.borderColor = "var(--border)"}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  style={{
                    position: "absolute", right: 10, top: "50%",
                    transform: "translateY(-50%)",
                    background: "none", border: "none",
                    color: "var(--muted-foreground)",
                    padding: 4,
                  }}
                >
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                style={{
                  display: "flex", alignItems: "center", gap: "0.5rem",
                  padding: "0.6rem 0.75rem",
                  border: "2px solid var(--destructive, #ef4444)",
                  background: "color-mix(in srgb, #ef4444 10%, transparent)",
                  fontFamily: "var(--font-geist)",
                  fontSize: "0.8rem",
                  color: "#ef4444",
                }}
              >
                <AlertCircle size={14} />
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "0.875rem",
                background: loading ? "var(--muted)" : "var(--primary)",
                color: "var(--primary-foreground)",
                fontFamily: "var(--font-bangers)",
                fontSize: "1.2rem",
                letterSpacing: "0.1em",
                border: "2px solid var(--foreground)",
                boxShadow: loading ? "none" : "4px 4px 0 var(--foreground)",
                transform: "skewX(-4deg)",
                cursor: loading ? "wait" : "none",
                transition: "all 0.15s",
                marginTop: "0.5rem",
              }}
            >
              <span style={{ display: "inline-block", transform: "skewX(4deg)" }}>
                {loading ? "VERIFYING..." : "ENTER THE BAT-CAVE"}
              </span>
            </button>
          </form>
        </div>
      </motion.div>
    </main>
  )
}