"use client"

import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

type PageTurnContextType = { turnTo: (elementId: string, originX?: number, originY?: number) => void }
const PageTurnContext = createContext<PageTurnContextType | null>(null)

export function usePageTurn() {
    const ctx = useContext(PageTurnContext)
    if (!ctx) throw new Error("usePageTurn must be used within PageTurnProvider")
    return ctx
}

// Ink splat SVG paths — irregular blob shapes that look hand-inked
const SPLAT_PATHS = [
    "M 50,5 C 65,0 85,8 92,22 C 100,38 98,55 88,67 C 78,80 60,88 45,90 C 28,92 10,85 4,70 C -3,55 2,35 12,22 C 22,8 35,10 50,5 Z",
    "M 50,2 C 70,-2 95,10 98,30 C 102,52 90,72 72,83 C 54,94 28,96 12,82 C -4,68 -2,44 8,26 C 18,8 30,6 50,2 Z",
    "M 48,3 C 62,-3 88,5 96,22 C 105,42 95,68 78,80 C 60,93 32,95 16,80 C 0,65 -2,40 10,22 C 20,5 34,9 48,3 Z",
    "M 52,4 C 68,0 90,12 95,28 C 101,46 94,66 80,78 C 65,90 42,94 24,84 C 6,74 -1,52 5,32 C 11,12 36,8 52,4 Z",
]

// Ink drip paths along the edges of the splat
const DRIP_OFFSETS = [
    { cx: 70, cy: 88, r: 6 },
    { cx: 28, cy: 85, r: 4 },
    { cx: 82, cy: 60, r: 5 },
    { cx: 15, cy: 55, r: 3 },
    { cx: 55, cy: 92, r: 4 },
    { cx: 40, cy: 6, r: 3 },
    { cx: 88, cy: 35, r: 4 },
]

function pickRandom<T>(arr: T[]) { return arr[Math.floor(Math.random() * arr.length)] }

type SplatState = {
    x: number        // origin x (px)
    y: number        // origin y (px)
    path: string     // which blob shape
    phase: "in" | "out" | "idle"
}

const THEME_COLORS = {
    batman: { fill: "#0d0d0d", accent: "#c8a96e", text: "#c8a96e" },
    joker: { fill: "#1a0030", accent: "#a855f7", text: "#f0e6ff" },
}

export function PageTurnProvider({ children }: { children: React.ReactNode }) {
    const [splat, setSplat] = useState<SplatState>({ x: 0, y: 0, path: SPLAT_PATHS[0], phase: "idle" })
    const pendingScroll = useRef<() => void>(() => { })
    const isRunning = useRef(false)

    const turnTo = useCallback((elementId: string, originX?: number, originY?: number) => {
        if (isRunning.current) return
        isRunning.current = true

        const targetId = elementId.replace("#", "")
        const isTop = targetId === "top" || targetId === ""
        const element = isTop ? null : document.getElementById(targetId)
        if (!element && !isTop) { isRunning.current = false; return }

        pendingScroll.current = () => {
            if (isTop) { window.scrollTo({ top: 0, behavior: "instant" }); window.history.pushState(null, "", window.location.pathname) }
            else if (element) { element.scrollIntoView({ behavior: "instant" }); window.history.pushState(null, "", `#${targetId}`) }
        }

        const x = originX ?? window.innerWidth / 2
        const y = originY ?? window.innerHeight / 2

        setSplat({ x, y, path: pickRandom(SPLAT_PATHS), phase: "in" })
    }, [])

    // When splat finishes expanding → scroll → then retract
    const onInComplete = useCallback(() => {
        pendingScroll.current()
        setSplat(s => ({ ...s, phase: "out" }))
    }, [])

    const onOutComplete = useCallback(() => {
        setSplat(s => ({ ...s, phase: "idle" }))
        isRunning.current = false
    }, [])

    const theme = typeof document !== "undefined"
        ? (document.documentElement.getAttribute("data-theme") === "joker" ? "joker" : "batman")
        : "batman"
    const colors = THEME_COLORS[theme]

    // The splat needs to cover the full screen from the click origin.
    // We compute the max distance from the origin to any corner of the viewport.
    const maxDist = typeof window !== "undefined"
        ? Math.sqrt(Math.max(splat.x, window.innerWidth - splat.x) ** 2 + Math.max(splat.y, window.innerHeight - splat.y) ** 2)
        : 1200
    // Scale factor: the SVG viewBox is 100x100, so scale = maxDist / 50 * 1.3 (a little extra)
    const fullScale = (maxDist / 50) * 1.35

    return (
        <PageTurnContext.Provider value={{ turnTo }}>
            {children}

            <AnimatePresence>
                {splat.phase !== "idle" && (
                    <motion.div
                        key="splat-overlay"
                        style={{
                            position: "fixed",
                            inset: 0,
                            zIndex: 200,
                            pointerEvents: splat.phase === "in" ? "auto" : "none",
                            overflow: "hidden",
                        }}
                    >
                        {/* SVG splat blob, origin at click point */}
                        <motion.svg
                            viewBox="0 0 100 100"
                            style={{
                                position: "absolute",
                                // Centre the 100x100 viewBox on the click origin
                                left: splat.x - 50,
                                top: splat.y - 50,
                                width: 100,
                                height: 100,
                                overflow: "visible",
                                transformOrigin: "50px 50px",
                            }}
                            initial={{ scale: 0, rotate: Math.random() * 30 - 15 }}
                            animate={splat.phase === "in"
                                ? { scale: fullScale, rotate: Math.random() * 10 - 5, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }
                                : { scale: 0, rotate: 0, transition: { duration: 0.45, ease: [0.55, 0, 0.78, 0] } }
                            }
                            onAnimationComplete={splat.phase === "in" ? onInComplete : onOutComplete}
                        >
                            {/* Main blob */}
                            <motion.path
                                d={splat.path}
                                fill={colors.fill}
                            />

                            {/* Ink drips / secondary blobs */}
                            {DRIP_OFFSETS.map((d, i) => (
                                <motion.circle
                                    key={i}
                                    cx={d.cx} cy={d.cy} r={d.r}
                                    fill={colors.fill}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={splat.phase === "in"
                                        ? { opacity: 1, scale: 1, transition: { delay: 0.08 + i * 0.03, duration: 0.2 } }
                                        : { opacity: 0, scale: 0, transition: { duration: 0.1 } }
                                    }
                                    style={{ transformOrigin: `${d.cx}px ${d.cy}px` }}
                                />
                            ))}

                            {/* Halftone dot ring — gives it a printed comic feel */}
                            {Array.from({ length: 20 }).map((_, i) => {
                                const angle = (i / 20) * Math.PI * 2
                                const dist = 58
                                const cx = 50 + Math.cos(angle) * dist
                                const cy = 50 + Math.sin(angle) * dist
                                const r = 2 + Math.sin(i * 1.3) * 1.2
                                return (
                                    <motion.circle
                                        key={`dot-${i}`}
                                        cx={cx} cy={cy} r={r}
                                        fill={colors.accent}
                                        initial={{ opacity: 0 }}
                                        animate={splat.phase === "in"
                                            ? { opacity: 0.6, transition: { delay: 0.15 + i * 0.01 } }
                                            : { opacity: 0, transition: { duration: 0.1 } }
                                        }
                                    />
                                )
                            })}
                        </motion.svg>

                        {/* Speed lines radiating from origin — only visible when fully expanded */}
                        <AnimatePresence>
                            {splat.phase === "out" && (
                                <motion.svg
                                    key="speedlines"
                                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0 }}
                                >
                                    {/* intentionally empty — kept for future */}
                                </motion.svg>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>
        </PageTurnContext.Provider>
    )
}