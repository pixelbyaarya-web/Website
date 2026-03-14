"use client"

import { useEffect, useRef } from "react"

// Animates an SVG feTurbulence seed every frame to create
// authentic flickering film grain — like a scanned comic book.
export function FilmGrain() {
    const filterRef = useRef<SVGFETurbulenceElement>(null)
    const rafRef = useRef<number>(0)
    const seed = useRef(0)

    useEffect(() => {
        // Only run on non-touch, non-reduced-motion, high-end devices
        if (
            window.matchMedia("(pointer: coarse)").matches ||
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) return

        let lastFrame = 0
        const FRAME_SKIP = 8 // ~7fps grain — imperceptible difference, big CPU saving

        const tick = () => {
            // Pause when tab is not visible
            if (document.hidden) {
                rafRef.current = requestAnimationFrame(tick)
                return
            }
            lastFrame++
            if (lastFrame % FRAME_SKIP === 0) {
                seed.current = (seed.current + 1) % 200
                filterRef.current?.setAttribute("seed", String(seed.current))
            }
            rafRef.current = requestAnimationFrame(tick)
        }
        rafRef.current = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(rafRef.current)
    }, [])

    return (
        <>
            {/* SVG filter definition — hidden, referenced by the overlay div */}
            <svg
                style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
                aria-hidden="true"
            >
                <defs>
                    <filter id="film-grain" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
                        <feTurbulence
                            ref={filterRef}
                            type="fractalNoise"
                            baseFrequency="0.65"
                            numOctaves="3"
                            stitchTiles="stitch"
                            seed="0"
                            result="noise"
                        />
                        <feColorMatrix
                            type="saturate"
                            values="0"
                            in="noise"
                            result="greyNoise"
                        />
                        <feBlend
                            in="SourceGraphic"
                            in2="greyNoise"
                            mode="overlay"
                            result="blended"
                        />
                        <feComposite in="blended" in2="SourceGraphic" operator="in" />
                    </filter>
                </defs>
            </svg>

            {/* Full-screen overlay that applies the grain filter */}
            <div
                aria-hidden="true"
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 9001,        // above halftone dots (9000), below cursor (9998)
                    pointerEvents: "none",
                    opacity: 0.038,      // subtle — just enough to feel printed
                    filter: "url(#film-grain)",
                    background: "white", // the filter needs a surface to work on
                    mixBlendMode: "overlay",
                    willChange: "filter",
                }}
            />
        </>
    )
}