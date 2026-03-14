"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import Link from "next/link"

// Ink splat SVG paths
const SPLAT_PATHS = [
    "M 50,5 C 65,0 85,8 92,22 C 100,38 98,55 88,67 C 78,80 60,88 45,90 C 28,92 10,85 4,70 C -3,55 2,35 12,22 C 22,8 35,10 50,5 Z",
    "M 50,2 C 70,-2 95,10 98,30 C 102,52 90,72 72,83 C 54,94 28,96 12,82 C -4,68 -2,44 8,26 C 18,8 30,6 50,2 Z",
]

const COMIC_PANELS = [
    { text: "Our hero takes a wrong turn...", sub: "PAGE NOT FOUND", rotate: -2 },
    { text: "Into the void of Gotham's streets...", sub: "ERROR 404", rotate: 1 },
    { text: "Even Batman gets lost sometimes.", sub: "...SOMETIMES.", rotate: -1 },
]

export default function NotFound() {
    const [mounted, setMounted] = useState(false)
    const [splatVisible, setSplatVisible] = useState(false)
    const [currentSplat, setCurrentSplat] = useState(0)
    const [glitching, setGlitching] = useState(false)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        setMounted(true)
        setTimeout(() => setSplatVisible(true), 100)

        intervalRef.current = setInterval(() => {
            setGlitching(true)
            setTimeout(() => setGlitching(false), 150)
        }, 2800)

        const splatCycle = setInterval(() => {
            setCurrentSplat(s => (s + 1) % SPLAT_PATHS.length)
        }, 3000)

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
            clearInterval(splatCycle)
        }
    }, [])

    // Don't render anything on the server — avoids all hydration mismatches
    if (!mounted) return null

    return (
        <div style={{
            minHeight: "100vh",
            background: "var(--background)",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
        }}>
            {/* Halftone background */}
            <div className="absolute inset-0 halftone opacity-25" />

            {/* Speed lines radiating from center */}
            <svg style={{
                position: "absolute", inset: 0,
                width: "100%", height: "100%",
                opacity: 0.04, pointerEvents: "none",
            }}>
                {Array.from({ length: 36 }).map((_, i) => {
                    const angle = (i / 36) * Math.PI * 2
                    return (
                        <line key={i}
                            x1="50%" y1="50%"
                            x2={`${50 + Math.cos(angle) * 120}%`}
                            y2={`${50 + Math.sin(angle) * 120}%`}
                            stroke="var(--foreground)" strokeWidth="1"
                        />
                    )
                })}
            </svg>

            {/* Ink splat behind 404 */}
            <motion.svg
                viewBox="0 0 100 100"
                style={{
                    position: "absolute",
                    width: "min(70vw, 500px)",
                    height: "min(70vw, 500px)",
                    top: "50%", left: "50%",
                    marginLeft: "min(-35vw, -250px)",
                    marginTop: "min(-35vw, -250px)",
                    opacity: 0.12,
                    overflow: "visible",
                }}
                animate={{ rotate: [0, 3, -2, 1, 0], scale: [1, 1.02, 0.99, 1] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
                <motion.path
                    d={SPLAT_PATHS[currentSplat]}
                    fill="var(--primary)"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                    style={{ transformOrigin: "50px 50px" }}
                />
            </motion.svg>

            {/* Main content */}
            <div style={{ position: "relative", zIndex: 10, textAlign: "center", maxWidth: 700, width: "100%" }}>

                {/* Issue label */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    style={{
                        fontFamily: "var(--font-geist)",
                        fontSize: "0.7rem",
                        letterSpacing: "0.3em",
                        color: "var(--muted-foreground)",
                        marginBottom: "1.5rem",
                    }}
                >
                    DARK KNIGHT STUDIOS — ISSUE #404
                </motion.div>

                {/* Giant 404 with glitch */}
                <motion.div
                    initial={{ scale: 0.5, rotate: -10, opacity: 0 }}
                    animate={{ scale: 1, rotate: -3, opacity: 1 }}
                    transition={{ delay: 0.1, type: "spring", damping: 14, stiffness: 180 }}
                    style={{
                        position: "relative",
                        display: "inline-block",
                        border: "4px solid var(--foreground)",
                        boxShadow: "8px 8px 0 var(--foreground)",
                        background: "var(--card)",
                        padding: "1rem 2.5rem",
                        marginBottom: "2rem",
                    }}
                >
                    {/* Halftone inside panel */}
                    <div style={{
                        position: "absolute", inset: 0,
                        backgroundImage: `radial-gradient(circle, var(--primary) 1.5px, transparent 1.5px)`,
                        backgroundSize: "18px 18px",
                        opacity: 0.12,
                        pointerEvents: "none",
                    }} />

                    <div
                        style={{
                            fontFamily: "var(--font-bangers)",
                            fontSize: "clamp(5rem, 22vw, 12rem)",
                            lineHeight: 0.9,
                            letterSpacing: "0.04em",
                            color: glitching ? "var(--primary)" : "var(--foreground)",
                            textShadow: glitching
                                ? `4px 0 var(--accent), -4px 0 var(--primary), 0 4px 0 var(--foreground)`
                                : `5px 5px 0 var(--primary), 10px 10px 0 rgba(0,0,0,0.3)`,
                            transform: glitching ? "translateX(3px) skewX(-3deg)" : "none",
                            transition: "color 0.05s, text-shadow 0.05s, transform 0.05s",
                            position: "relative",
                            userSelect: "none",
                        }}
                    >
                        404
                    </div>

                    {/* BAM! badge */}
                    <motion.div
                        initial={{ scale: 0, rotate: 20 }}
                        animate={{ scale: 1, rotate: 15 }}
                        transition={{ delay: 0.5, type: "spring", bounce: 0.6 }}
                        style={{
                            position: "absolute",
                            top: -20, right: -20,
                            background: "var(--primary)",
                            border: "3px solid var(--foreground)",
                            boxShadow: "3px 3px 0 var(--foreground)",
                            padding: "0.2rem 0.7rem",
                            fontFamily: "var(--font-bangers)",
                            fontSize: "1.4rem",
                            color: "var(--primary-foreground)",
                            letterSpacing: "0.05em",
                            zIndex: 2,
                        }}
                    >
                        LOST!
                    </motion.div>
                </motion.div>

                {/* Comic panels strip */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    style={{
                        display: "flex",
                        gap: "0.4rem",
                        marginBottom: "2.5rem",
                        justifyContent: "center",
                    }}
                >
                    {COMIC_PANELS.map((panel, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20, rotate: panel.rotate * 2 }}
                            animate={{ opacity: 1, y: 0, rotate: panel.rotate }}
                            transition={{ delay: 0.5 + i * 0.12, duration: 0.4, type: "spring", bounce: 0.3 }}
                            style={{
                                flex: i === 1 ? 1.3 : 1,
                                border: "3px solid var(--foreground)",
                                boxShadow: "3px 3px 0 var(--foreground)",
                                background: "var(--card)",
                                overflow: "hidden",
                                position: "relative",
                            }}
                        >
                            {/* Panel art area */}
                            <div style={{
                                height: 80,
                                background: "var(--background)",
                                borderBottom: "2px solid var(--border)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                position: "relative", overflow: "hidden",
                            }}>
                                <div style={{
                                    position: "absolute", inset: 0,
                                    backgroundImage: `radial-gradient(circle, var(--primary) 1px, transparent 1px)`,
                                    backgroundSize: "10px 10px",
                                    opacity: 0.1,
                                }} />
                                {/* Simple icon per panel */}
                                {i === 0 && (
                                    <svg viewBox="0 0 40 40" style={{ width: 36, height: 36, color: "var(--primary)" }}>
                                        <path d="M20 5 L35 30 L5 30 Z" fill="none" stroke="currentColor" strokeWidth="2" />
                                        <line x1="20" y1="14" x2="20" y2="22" stroke="currentColor" strokeWidth="2" />
                                        <circle cx="20" cy="26" r="1.5" fill="currentColor" />
                                    </svg>
                                )}
                                {i === 1 && (
                                    <svg viewBox="0 0 40 40" style={{ width: 36, height: 36, color: "var(--primary)" }}>
                                        <circle cx="20" cy="20" r="14" fill="none" stroke="currentColor" strokeWidth="2" />
                                        <path d="M14 14 L26 26 M26 14 L14 26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                                    </svg>
                                )}
                                {i === 2 && (
                                    <svg viewBox="0 0 40 40" style={{ width: 36, height: 36, color: "var(--primary)" }}>
                                        <path d="M8 28 Q20 10 32 28" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                                        <circle cx="14" cy="18" r="3" fill="currentColor" />
                                        <circle cx="26" cy="18" r="3" fill="currentColor" />
                                    </svg>
                                )}
                            </div>
                            {/* Caption */}
                            <div style={{ padding: "0.4rem 0.6rem" }}>
                                <p style={{
                                    fontFamily: "var(--font-geist)",
                                    fontSize: "clamp(0.6rem, 1.5vw, 0.72rem)",
                                    color: "var(--foreground)",
                                    margin: 0,
                                    fontStyle: "italic",
                                    lineHeight: 1.3,
                                }}>
                                    {panel.text}
                                </p>
                                <p style={{
                                    fontFamily: "var(--font-bangers)",
                                    fontSize: "clamp(0.55rem, 1.2vw, 0.65rem)",
                                    color: "var(--primary)",
                                    margin: "0.2rem 0 0",
                                    letterSpacing: "0.1em",
                                }}>
                                    {panel.sub}
                                </p>
                            </div>
                            {/* Panel number */}
                            <span style={{
                                position: "absolute", top: 3, right: 6,
                                fontFamily: "var(--font-bangers)",
                                fontSize: "1.2rem",
                                color: "var(--border)",
                                opacity: 0.4,
                            }}>
                                {String(i + 1).padStart(2, "0")}
                            </span>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Speech bubble */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8, type: "spring", bounce: 0.4 }}
                    style={{ marginBottom: "2rem", display: "inline-block" }}
                >
                    <div className="speech-bubble" style={{ maxWidth: 420, margin: "0 auto" }}>
                        <p style={{ fontFamily: "var(--font-geist)", margin: 0, lineHeight: 1.6 }}>
                            {`The page you're looking for has vanished into Gotham's shadows. Even the world's greatest detective couldn't find it.`}
                        </p>
                    </div>
                </motion.div>

                {/* CTA buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.4 }}
                    style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}
                >
                    <Link href="/" style={{
                        padding: "0.875rem 2rem",
                        background: "var(--primary)",
                        color: "var(--primary-foreground)",
                        fontFamily: "var(--font-bangers)",
                        fontSize: "1.1rem",
                        letterSpacing: "0.1em",
                        transform: "skewX(-6deg)",
                        display: "inline-block",
                        border: "2px solid var(--foreground)",
                        boxShadow: "4px 4px 0 var(--foreground)",
                        textDecoration: "none",
                        transition: "transform 0.2s, box-shadow 0.2s",
                    }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.transform = "skewX(0deg) translateY(-2px)"
                                ; (e.currentTarget as HTMLElement).style.boxShadow = "6px 6px 0 var(--foreground)"
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.transform = "skewX(-6deg)"
                                ; (e.currentTarget as HTMLElement).style.boxShadow = "4px 4px 0 var(--foreground)"
                        }}
                    >
                        <span style={{ display: "inline-block", transform: "skewX(6deg)" }}>
                            ← BACK TO BASE
                        </span>
                    </Link>

                    <Link href="/#portfolio" style={{
                        padding: "0.875rem 2rem",
                        background: "transparent",
                        color: "var(--foreground)",
                        fontFamily: "var(--font-bangers)",
                        fontSize: "1.1rem",
                        letterSpacing: "0.1em",
                        transform: "skewX(6deg)",
                        display: "inline-block",
                        border: "2px solid var(--border)",
                        boxShadow: "4px 4px 0 var(--border)",
                        textDecoration: "none",
                        transition: "transform 0.2s, border-color 0.2s, color 0.2s",
                    }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.transform = "skewX(0deg) translateY(-2px)"
                                ; (e.currentTarget as HTMLElement).style.borderColor = "var(--primary)"
                                ; (e.currentTarget as HTMLElement).style.color = "var(--primary)"
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.transform = "skewX(6deg)"
                                ; (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"
                                ; (e.currentTarget as HTMLElement).style.color = "var(--foreground)"
                        }}
                    >
                        <span style={{ display: "inline-block", transform: "skewX(-6deg)" }}>
                            VIEW WORK →
                        </span>
                    </Link>
                </motion.div>

            </div>

            {/* Corner decorations */}
            <div style={{ position: "absolute", top: 24, left: 24, width: 48, height: 48, borderLeft: "3px solid var(--primary)", borderTop: "3px solid var(--primary)", opacity: 0.4 }} />
            <div style={{ position: "absolute", top: 24, right: 24, width: 48, height: 48, borderRight: "3px solid var(--border)", borderTop: "3px solid var(--border)", opacity: 0.4 }} />
            <div style={{ position: "absolute", bottom: 24, left: 24, width: 48, height: 48, borderLeft: "3px solid var(--border)", borderBottom: "3px solid var(--border)", opacity: 0.4 }} />
            <div style={{ position: "absolute", bottom: 24, right: 24, width: 48, height: 48, borderRight: "3px solid var(--primary)", borderBottom: "3px solid var(--primary)", opacity: 0.4 }} />
        </div>
    )
}