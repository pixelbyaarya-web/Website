"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"

export function HeroSection() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isJoker = mounted && resolvedTheme === "joker"

  return (
    <section className="relative min-h-screen bg-background overflow-hidden pt-20">
      {/* Halftone overlay */}
      <div className="absolute inset-0 halftone opacity-50" />

      {/* Main comic panel layout */}
      <div className="relative max-w-7xl mx-auto px-6 py-12 min-h-[calc(100vh-5rem)]">
        {/* Diagonal broken grid layout */}
        <div className="grid grid-cols-12 gap-4 h-full">

          {/* Large splash panel - Main feature */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="col-span-12 lg:col-span-8 row-span-2 relative"
          >
            <div className="comic-panel h-[60vh] lg:h-[70vh] bg-card relative transform lg:-rotate-1 hover:rotate-0 transition-transform duration-500">
              {/* Splash panel content - Hero Background */}
              <div className="absolute inset-0 z-0 bg-background">
                {/* Tint overlay for readability */}
                <div className="absolute inset-0 bg-background/60 pointer-events-none" />
              </div>

              {/* Diagonal stripe accent */}
              <div className="absolute top-0 right-0 w-1/3 h-full bg-border/20 clip-diagonal-bl z-10 pointer-events-none" />

              {/* Hero text */}
              <div className="relative h-full flex flex-col justify-center px-8 lg:px-16 z-20 pointer-events-none">
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="caption-box inline-block mb-6 max-w-fit"
                >
                  <span className="text-muted-foreground text-sm tracking-widest">ISSUE #001</span>
                </motion.div>

                <motion.h1
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="font-[var(--font-bangers)] text-5xl md:text-7xl lg:text-8xl comic-title text-foreground mb-6"
                >
                  GRAPHIC<br />
                  <span className="text-primary">DESIGNER</span>
                </motion.h1>

                <motion.p
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="font-[var(--font-geist)] text-lg md:text-xl text-muted-foreground max-w-md leading-relaxed"
                >
                  Creating visual stories that leap off the page. Dark aesthetics meet bold creativity.
                </motion.p>

                {/* Action buttons */}
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.6 }}
                  className="flex flex-wrap gap-4 mt-8 pointer-events-auto"
                >
                  <a
                    href="#portfolio"
                    className="px-8 py-3 bg-primary text-primary-foreground font-[var(--font-bangers)] text-lg tracking-wider transform -skew-x-6 transition-all duration-300 hover:skew-x-0 hover:scale-105 hover:glow-primary flex items-center justify-center group"
                  >
                    <span className="inline-block transform skew-x-6 group-hover:skew-x-0 transition-transform">VIEW WORK</span>
                  </a>
                  <a
                    href="#contact"
                    className="px-8 py-3 bg-transparent border-2 border-border text-foreground font-[var(--font-bangers)] text-lg tracking-wider transform skew-x-6 transition-all duration-300 hover:skew-x-0 hover:border-primary hover:text-primary hover:scale-105 hover:glow-primary group flex items-center justify-center"
                  >
                    <span className="inline-block transform -skew-x-6 group-hover:skew-x-0 transition-transform">CONTACT</span>
                  </a>
                </motion.div>
              </div>

              {/* Panel number */}
              <div className="absolute bottom-4 right-4 font-[var(--font-bangers)] text-6xl text-border/30">01</div>
            </div>
          </motion.div>

          {/* Side panels - Smaller angled panels */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
            {/* Top right panel */}
            <motion.div
              initial={{ opacity: 0, x: 50, rotate: 3 }}
              animate={{ opacity: 1, x: 0, rotate: 2 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="comic-panel h-[20vh] lg:h-[33vh] bg-card transform rotate-2 hover:rotate-0 transition-transform duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent" />
              <div className="relative h-full flex flex-col justify-center items-center p-6 text-center">
                <span className="font-[var(--font-bangers)] text-4xl lg:text-5xl text-primary">10+</span>
                <span className="font-[var(--font-geist)] text-sm text-muted-foreground mt-2">YEARS OF CHAOS</span>
              </div>
              <div className="absolute bottom-2 right-3 font-[var(--font-bangers)] text-3xl text-border/30">02</div>
            </motion.div>

            {/* Middle right panel */}
            <motion.div
              initial={{ opacity: 0, x: 50, rotate: -2 }}
              animate={{ opacity: 1, x: 0, rotate: -1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="comic-panel h-[20vh] lg:h-[33vh] bg-card transform -rotate-1 hover:rotate-0 transition-transform duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-bl from-accent/20 to-transparent" />
              <div className="relative h-full flex flex-col justify-center items-center p-6 text-center">
                <span className="font-[var(--font-bangers)] text-4xl lg:text-5xl text-accent">200+</span>
                <span className="font-[var(--font-geist)] text-sm text-muted-foreground mt-2">PROJECTS COMPLETED</span>
              </div>
              <div className="absolute bottom-2 right-3 font-[var(--font-bangers)] text-3xl text-border/30">03</div>
            </motion.div>
          </div>
        </div>

        {/* Bottom diagonal strip */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="absolute bottom-0 left-0 right-0 h-20 bg-primary/10 clip-slant-left flex items-center justify-center"
        >
          <div className="flex items-center gap-8 font-[var(--font-bangers)] text-muted-foreground tracking-widest text-sm">
            <span>BRANDING</span>
            <span className="w-2 h-2 bg-primary rotate-45" />
            <span>ILLUSTRATION</span>
            <span className="w-2 h-2 bg-accent rotate-45" />
            <span>UI DESIGN</span>
            <span className="w-2 h-2 bg-primary rotate-45" />
            <span>CONCEPT ART</span>
          </div>
        </motion.div>
      </div>

      {/* Decorative corner elements */}
      <div className="absolute top-24 left-4 w-16 h-16 border-l-4 border-t-4 border-primary/30" />
      <div className="absolute top-24 right-4 w-16 h-16 border-r-4 border-t-4 border-border/30" />
    </section>
  )
}
