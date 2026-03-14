"use client"

import { useEffect, useRef, useState } from "react"

const TRAIL_LENGTH = 6

export function ComicCursor() {
    const cursorRef = useRef<HTMLDivElement>(null)
    const trailRefs = useRef<(HTMLDivElement | null)[]>([])
    const posHistory = useRef<{ x: number; y: number }[]>([])
    const mouse = useRef({ x: -200, y: -200 })
    const raf = useRef<number>(0)
    const [visible, setVisible] = useState(false)
    const [clicking, setClicking] = useState(false)
    const [hovering, setHovering] = useState(false)

    useEffect(() => {
        // Hide on touch devices
        if (window.matchMedia("(pointer: coarse)").matches) return

        setVisible(true)

        const onMove = (e: MouseEvent) => {
            mouse.current = { x: e.clientX, y: e.clientY }

            // Detect hovering over interactive elements
            const el = document.elementFromPoint(e.clientX, e.clientY)
            const isHover = !!el?.closest("a, button, [role=button], [onClick], input, textarea, select, label")
            setHovering(isHover)
        }

        const onDown = () => setClicking(true)
        const onUp = () => setClicking(false)

        window.addEventListener("mousemove", onMove)
        window.addEventListener("mousedown", onDown)
        window.addEventListener("mouseup", onUp)

        const tick = () => {
            // Skip rendering when tab is hidden
            if (document.hidden) {
                raf.current = requestAnimationFrame(tick)
                return
            }

            const { x, y } = mouse.current

            // Move main cursor
            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate(${x}px, ${y}px)`
            }

            // Update trail history
            posHistory.current.push({ x, y })
            if (posHistory.current.length > TRAIL_LENGTH) {
                posHistory.current.shift()
            }

            // Move trail dots
            trailRefs.current.forEach((el, i) => {
                if (!el) return
                const pos = posHistory.current[posHistory.current.length - 1 - i]
                if (!pos) return
                const opacity = (1 - i / TRAIL_LENGTH) * 0.5
                const scale = (1 - i / TRAIL_LENGTH) * 0.6
                el.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%) scale(${scale})`
                el.style.opacity = String(opacity)
            })

            raf.current = requestAnimationFrame(tick)
        }
        raf.current = requestAnimationFrame(tick)

        return () => {
            window.removeEventListener("mousemove", onMove)
            window.removeEventListener("mousedown", onDown)
            window.removeEventListener("mouseup", onUp)
            cancelAnimationFrame(raf.current)
        }
    }, [])

    if (!visible) return null

    return (
        <>
            {/* Ink trail dots */}
            {Array.from({ length: TRAIL_LENGTH }).map((_, i) => (
                <div
                    key={i}
                    ref={el => { trailRefs.current[i] = el }}
                    style={{
                        position: "fixed",
                        top: 0, left: 0,
                        width: clicking ? 10 : 7,
                        height: clicking ? 10 : 7,
                        borderRadius: "50%",
                        background: "var(--primary)",
                        pointerEvents: "none",
                        zIndex: 9998,
                        opacity: 0,
                        willChange: "transform",
                        // Slightly irregular shape for ink feel
                        clipPath: i % 3 === 0
                            ? "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)"
                            : "circle(50%)",
                    }}
                />
            ))}

            {/* Main cursor */}
            <div
                ref={cursorRef}
                style={{
                    position: "fixed",
                    top: 0, left: 0,
                    pointerEvents: "none",
                    zIndex: 9999,
                    willChange: "transform",
                    // Offset so tip of nib is at cursor position
                    marginLeft: -4,
                    marginTop: -4,
                }}
            >
                {/* Ink pen nib SVG */}
                <svg
                    width={hovering ? 28 : 22}
                    height={hovering ? 28 : 22}
                    viewBox="0 0 24 24"
                    style={{
                        transform: `rotate(${clicking ? -10 : 0}deg) scale(${clicking ? 0.85 : 1})`,
                        transition: "transform 0.1s ease, width 0.15s ease, height 0.15s ease",
                        filter: "drop-shadow(0 0 4px var(--primary))",
                    }}
                >
                    {/* Pen body */}
                    <path
                        d="M4 20 L10 10 L14 6 L18 2 L22 6 L18 10 L14 14 L4 20 Z"
                        fill="var(--foreground)"
                        stroke="var(--primary)"
                        strokeWidth="0.8"
                    />
                    {/* Nib shine */}
                    <path
                        d="M18 2 L22 6 L20 8 L16 4 Z"
                        fill="var(--primary)"
                        opacity="0.8"
                    />
                    {/* Ink drop at tip */}
                    <circle
                        cx="4" cy="20" r={clicking ? 2.5 : 1.5}
                        fill="var(--primary)"
                        style={{ transition: "r 0.1s ease" }}
                    />
                    {/* Pen clip detail */}
                    <line x1="14" y1="6" x2="17" y2="9" stroke="var(--primary)" strokeWidth="0.8" opacity="0.6" />
                </svg>

                {/* Click splat */}
                {clicking && (
                    <div style={{
                        position: "absolute",
                        top: -4, left: -4,
                        width: 12, height: 12,
                        borderRadius: "50%",
                        background: "var(--primary)",
                        opacity: 0.4,
                        animation: "ping 0.3s ease-out forwards",
                    }} />
                )}
            </div>
        </>
    )
}