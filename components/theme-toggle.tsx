"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const toggleTheme = () => {
        setTheme(resolvedTheme === "joker" ? "batman" : "joker")
    }

    // Default to batman for SSR to prevent hydration mismatch
    const activeTheme = mounted ? resolvedTheme : "batman"

    return (
        <button
            onClick={toggleTheme}
            className={`relative p-2.5 rounded-full border-2 transition-all duration-300 flex items-center justify-center overflow-hidden group
                ${activeTheme === "batman"
                    ? "bg-card border-primary/40 text-primary hover:border-primary hover:glow-primary"
                    : "bg-card border-accent/40 text-accent hover:border-accent hover:glow-accent"
                } hover:scale-110 active:scale-90`}
            aria-label="Toggle theme"
            title={activeTheme === "batman" ? "Switch to Light Theme" : "Switch to Dark Theme"}
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTheme}
                    initial={{ y: 20, opacity: 0, rotate: -45 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: -20, opacity: 0, rotate: 45 }}
                    whileHover={{ rotate: 15 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeTheme === "batman" ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                </motion.div>
            </AnimatePresence>
        </button>
    )
}

