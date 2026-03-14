"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"

// Comic strip panels — each has a small illustration description + caption
const BATMAN_PANELS = [
    {
        id: 1,
        caption: "A city drowning in grey...",
        sub: "...needed someone to make it beautiful.",
        icon: (
            <svg viewBox="0 0 80 80" style={{ width: 64, height: 64 }}>
                {/* City skyline */}
                <rect x="5" y="45" width="12" height="30" fill="none" stroke="currentColor" strokeWidth="2" />
                <rect x="20" y="30" width="10" height="45" fill="none" stroke="currentColor" strokeWidth="2" />
                <rect x="33" y="38" width="14" height="37" fill="none" stroke="currentColor" strokeWidth="2" />
                <rect x="50" y="25" width="10" height="50" fill="none" stroke="currentColor" strokeWidth="2" />
                <rect x="63" y="42" width="12" height="33" fill="none" stroke="currentColor" strokeWidth="2" />
                {/* Moon */}
                <circle cx="40" cy="15" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
                {/* Bat signal */}
                <path d="M36 15 C36 15 38 11 40 11 C42 11 44 15 44 15" fill="currentColor" />
            </svg>
        ),
    },
    {
        id: 2,
        caption: "Armed with only a stylus...",
        sub: "...and an unhealthy obsession with kerning.",
        icon: (
            <svg viewBox="0 0 80 80" style={{ width: 64, height: 64 }}>
                {/* Pen/stylus */}
                <path d="M20 60 L55 25 L62 18 L70 22 L66 30 L31 65 Z" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M62 18 L70 22 L68 26 L60 22 Z" fill="currentColor" />
                <path d="M20 60 L16 68 L24 64 Z" fill="currentColor" />
                {/* Ink drops */}
                <circle cx="12" cy="72" r="3" fill="currentColor" opacity="0.6" />
                <circle cx="8" cy="65" r="2" fill="currentColor" opacity="0.4" />
                <circle cx="18" cy="70" r="1.5" fill="currentColor" opacity="0.3" />
            </svg>
        ),
    },
    {
        id: 3,
        caption: "Darkness became a canvas.",
        sub: "Every shadow, a design opportunity.",
        icon: (
            <svg viewBox="0 0 80 80" style={{ width: 64, height: 64 }}>
                {/* Abstract design mark */}
                <rect x="15" y="15" width="50" height="50" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M15 15 L40 40 L65 15" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M15 65 L40 40 L65 65" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="40" cy="40" r="8" fill="currentColor" opacity="0.3" />
                <circle cx="40" cy="40" r="4" fill="currentColor" />
            </svg>
        ),
    },
    {
        id: 4,
        caption: "Dark Knight Studios.",
        sub: "Enter.",
        icon: (
            <svg viewBox="0 0 80 80" style={{ width: 64, height: 64 }}>
                {/* DK monogram */}
                <text x="10" y="58" fontFamily="serif" fontSize="52" fontWeight="bold"
                    fill="none" stroke="currentColor" strokeWidth="1.5" letterSpacing="-4">DK</text>
                {/* Underline accent */}
                <line x1="10" y1="65" x2="70" y2="65" stroke="currentColor" strokeWidth="3" />
            </svg>
        ),
    },
]

const JOKER_PANELS = [
    {
        id: 1,
        caption: "They said 'follow the rules'...",
        sub: "...so I redesigned them.",
        icon: (
            <svg viewBox="0 0 80 80" style={{ width: 64, height: 64 }}>
                <path d="M20 55 Q40 25 60 55" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <circle cx="28" cy="35" r="5" fill="currentColor" />
                <circle cx="52" cy="35" r="5" fill="currentColor" />
                <path d="M15 20 Q40 5 65 20" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4,3" />
            </svg>
        ),
    },
    {
        id: 2,
        caption: "Chaos is just order...",
        sub: "...that hasn't been designed yet.",
        icon: (
            <svg viewBox="0 0 80 80" style={{ width: 64, height: 64 }}>
                <path d="M10 40 Q25 10 40 40 Q55 70 70 40" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="10" cy="40" r="4" fill="currentColor" />
                <circle cx="40" cy="40" r="4" fill="currentColor" />
                <circle cx="70" cy="40" r="4" fill="currentColor" />
                <path d="M25 20 L30 30 L20 30 Z" fill="currentColor" />
                <path d="M55 60 L60 50 L50 50 Z" fill="currentColor" />
            </svg>
        ),
    },
    {
        id: 3,
        caption: "Purple. Green. Madness.",
        sub: "The only colour palette that matters.",
        icon: (
            <svg viewBox="0 0 80 80" style={{ width: 64, height: 64 }}>
                <circle cx="40" cy="40" r="28" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M40 12 L40 68 M12 40 L68 40" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3,4" />
                <circle cx="40" cy="40" r="10" fill="currentColor" opacity="0.4" />
                <circle cx="40" cy="40" r="4" fill="currentColor" />
                <circle cx="62" cy="22" r="5" fill="currentColor" opacity="0.6" />
                <circle cx="18" cy="58" r="5" fill="currentColor" opacity="0.6" />
            </svg>
        ),
    },
    {
        id: 4,
        caption: "Why so serious?",
        sub: "Good design should make you feel something.",
        icon: (
            <svg viewBox="0 0 80 80" style={{ width: 64, height: 64 }}>
                <text x="8" y="58" fontFamily="serif" fontSize="52" fontWeight="bold"
                    fill="none" stroke="currentColor" strokeWidth="1.5" letterSpacing="-4">DK</text>
                <path d="M10 68 Q40 60 70 68" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
        ),
    },
]

export function LoadingScreen() {
    const [isLoading, setIsLoading] = useState(true)
    const [currentPanel, setCurrentPanel] = useState(0)
    const [mounted, setMounted] = useState(false)
    const { resolvedTheme } = useTheme()

    useEffect(() => {
        setMounted(true)
        // Advance panels: 4 panels × ~650ms = ~2.6s + exit
        const panelTimer = setInterval(() => {
            setCurrentPanel(p => {
                if (p >= 3) { clearInterval(panelTimer); return p }
                return p + 1
            })
        }, 680)

        const exitTimer = setTimeout(() => setIsLoading(false), 3200)

        return () => { clearInterval(panelTimer); clearTimeout(exitTimer) }
    }, [])

    if (!mounted) return null

    const isJoker = resolvedTheme === "joker"
    const panels = isJoker ? JOKER_PANELS : BATMAN_PANELS

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    key="loading"
                    initial={{ opacity: 1 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
                    style={{
                        position: "fixed", inset: 0, zIndex: 9000,
                        background: "var(--background)",
                        display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center",
                        overflow: "hidden",
                    }}
                >
                    {/* Halftone bg */}
                    <div className="absolute inset-0 halftone opacity-20" />

                    {/* Page label */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        style={{
                            fontFamily: "var(--font-geist)",
                            fontSize: "0.7rem",
                            letterSpacing: "0.3em",
                            color: "var(--muted-foreground)",
                            marginBottom: "1.5rem",
                            textTransform: "uppercase",
                        }}
                    >
                        {isJoker ? "ISSUE #001 — THE JESTER EDITION" : "ISSUE #001 — DARK KNIGHT STUDIOS"}
                    </motion.div>

                    {/* Comic strip — 4 panels in a row */}
                    <div style={{
                        display: "flex",
                        gap: "0.375rem",
                        maxWidth: "min(92vw, 820px)",
                        width: "100%",
                        height: "clamp(180px, 35vh, 280px)",
                    }}>
                        {panels.map((panel, i) => (
                            <motion.div
                                key={panel.id}
                                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                                animate={i <= currentPanel
                                    ? { opacity: 1, y: 0, scale: 1 }
                                    : { opacity: 0, y: 30, scale: 0.9 }
                                }
                                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                style={{
                                    flex: i === 2 ? 1.4 : 1,   // middle panel wider, like a hero panel
                                    border: "3px solid var(--foreground)",
                                    boxShadow: i <= currentPanel ? "4px 4px 0 var(--foreground)" : "none",
                                    background: "var(--card)",
                                    position: "relative",
                                    overflow: "hidden",
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                {/* Halftone inside panel */}
                                <div style={{
                                    position: "absolute", inset: 0,
                                    backgroundImage: `radial-gradient(circle, var(--primary) 1px, transparent 1px)`,
                                    backgroundSize: "12px 12px",
                                    opacity: 0.08,
                                    pointerEvents: "none",
                                }} />

                                {/* Icon area */}
                                <div style={{
                                    flex: 1,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    color: "var(--primary)",
                                    padding: "0.75rem",
                                }}>
                                    {i <= currentPanel && (
                                        <motion.div
                                            initial={{ scale: 0, rotate: -15 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{ delay: 0.15, type: "spring", bounce: 0.4 }}
                                        >
                                            {panel.icon}
                                        </motion.div>
                                    )}
                                </div>

                                {/* Caption strip */}
                                {i <= currentPanel && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.25 }}
                                        style={{
                                            borderTop: "2px solid var(--border)",
                                            padding: "0.4rem 0.6rem",
                                            background: "var(--background)",
                                        }}
                                    >
                                        <p style={{
                                            fontFamily: "var(--font-geist)",
                                            fontSize: "clamp(0.6rem, 1.2vw, 0.72rem)",
                                            color: "var(--foreground)",
                                            margin: 0,
                                            lineHeight: 1.3,
                                            fontStyle: "italic",
                                        }}>
                                            {panel.caption}
                                        </p>
                                        <p style={{
                                            fontFamily: "var(--font-geist)",
                                            fontSize: "clamp(0.55rem, 1vw, 0.65rem)",
                                            color: "var(--muted-foreground)",
                                            margin: 0,
                                            lineHeight: 1.3,
                                        }}>
                                            {panel.sub}
                                        </p>
                                    </motion.div>
                                )}

                                {/* Panel number */}
                                <span style={{
                                    position: "absolute", top: 4, right: 6,
                                    fontFamily: "var(--font-bangers)",
                                    fontSize: "1.5rem",
                                    color: "var(--border)",
                                    opacity: 0.4,
                                    lineHeight: 1,
                                }}>
                                    {String(panel.id).padStart(2, "0")}
                                </span>
                            </motion.div>
                        ))}
                    </div>

                    {/* Progress bar */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        style={{
                            marginTop: "2rem",
                            width: "clamp(200px, 40vw, 320px)",
                            height: 6,
                            background: "var(--muted)",
                            border: "2px solid var(--border)",
                            overflow: "hidden",
                            position: "relative",
                        }}
                    >
                        <motion.div
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 3, ease: "linear" }}
                            style={{ height: "100%", background: "var(--primary)" }}
                        />
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        style={{
                            marginTop: "0.75rem",
                            fontFamily: "var(--font-geist-mono)",
                            fontSize: "0.65rem",
                            letterSpacing: "0.2em",
                            color: "var(--muted-foreground)",
                            textTransform: "uppercase",
                        }}
                    >
                        {isJoker ? "Why so serious..." : "I am the night..."}
                    </motion.p>
                </motion.div>
            )}
        </AnimatePresence>
    )
}