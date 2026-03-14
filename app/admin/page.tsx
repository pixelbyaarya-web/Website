"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Eye, EyeOff, Lock, User } from "lucide-react"
import Link from "next/link"

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Halftone background */}
      <div className="absolute inset-0 halftone opacity-30" />
      
      {/* Animated background accents */}
      <motion.div
        animate={{
          rotate: [0, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-1/4 -left-32 w-64 h-64 bg-primary/10 blur-3xl"
      />
      <motion.div
        animate={{
          rotate: [360, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute bottom-1/4 -right-32 w-64 h-64 bg-accent/10 blur-3xl"
      />

      {/* Back to home link */}
      <Link
        href="/"
        className="absolute top-6 left-6 font-[var(--font-bangers)] text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
      >
        <span className="transform -skew-x-6 inline-block">{"<"}</span>
        BACK TO SITE
      </Link>

      {/* Login container */}
      <motion.div
        initial={{ opacity: 0, y: 50, rotate: -3 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full max-w-md"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Outer comic panel frame */}
        <div className={`comic-panel bg-card p-1 transform transition-all duration-500 ${isHovered ? 'rotate-0 glow-purple' : '-rotate-1'}`}>
          {/* Inner content */}
          <div className="bg-gotham-charcoal p-8 relative">
            {/* Caption box header */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="caption-box mb-8 transform -rotate-1"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/30 border border-primary flex items-center justify-center transform -skew-x-6">
                  <Lock className="w-5 h-5 text-primary transform skew-x-6" />
                </div>
                <div>
                  <span className="font-[var(--font-geist)] text-xs text-muted-foreground tracking-widest block">
                    RESTRICTED ACCESS
                  </span>
                  <h1 className="font-[var(--font-bangers)] text-2xl text-foreground">
                    ADMIN <span className="text-primary">PORTAL</span>
                  </h1>
                </div>
              </div>
            </motion.div>

            {/* Login form */}
            <form className="space-y-6">
              {/* Username field */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="space-y-2"
              >
                <label className="font-[var(--font-geist)] text-sm text-muted-foreground tracking-wider flex items-center gap-2">
                  <User className="w-4 h-4" />
                  IDENTITY
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-gotham-grey border-2 border-border text-foreground font-[var(--font-geist)] focus:border-primary focus:outline-none transition-all transform -skew-x-3 focus:skew-x-0"
                    placeholder="Enter username..."
                  />
                  <div className="absolute right-0 top-0 h-full w-1 bg-primary/50 transform skew-x-6" />
                </div>
              </motion.div>

              {/* Password field */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="space-y-2"
              >
                <label className="font-[var(--font-geist)] text-sm text-muted-foreground tracking-wider flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  PASSPHRASE
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full px-4 py-3 pr-12 bg-gotham-grey border-2 border-border text-foreground font-[var(--font-geist)] focus:border-primary focus:outline-none transition-all transform skew-x-3 focus:skew-x-0"
                    placeholder="Enter password..."
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  <div className="absolute left-0 top-0 h-full w-1 bg-accent/50 transform -skew-x-6" />
                </div>
              </motion.div>

              {/* Remember me & Forgot password */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="flex items-center justify-between"
              >
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="w-5 h-5 border-2 border-border bg-gotham-grey group-hover:border-primary transition-colors flex items-center justify-center">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-3 h-3 bg-primary scale-0 peer-checked:scale-100 transition-transform" />
                  </div>
                  <span className="font-[var(--font-geist)] text-sm text-muted-foreground">Remember me</span>
                </label>
                <a href="#" className="font-[var(--font-geist)] text-sm text-primary hover:text-accent transition-colors">
                  Forgot access?
                </a>
              </motion.div>

              {/* Submit button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <button
                  type="submit"
                  className="w-full py-4 bg-primary text-primary-foreground font-[var(--font-bangers)] text-xl tracking-wider transform -skew-x-6 hover:skew-x-0 transition-all glow-purple group"
                >
                  <span className="inline-block transform skew-x-6 group-hover:skew-x-0 transition-transform">
                    AUTHENTICATE
                  </span>
                </button>
              </motion.div>
            </form>

            {/* Security notice */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-8 pt-6 border-t border-border"
            >
              <p className="font-[var(--font-geist)] text-xs text-muted-foreground text-center italic">
                {"This portal is monitored. Unauthorized access attempts will be logged."}
              </p>
            </motion.div>

            {/* Decorative corner accents */}
            <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-primary/50" />
            <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-accent/50" />
            <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 border-accent/50" />
            <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-primary/50" />
          </div>
        </div>

        {/* Panel number */}
        <div className="absolute -bottom-4 -right-4 font-[var(--font-bangers)] text-6xl text-border/20">
          X
        </div>
      </motion.div>

      {/* Decorative elements */}
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l-4 border-b-4 border-primary/20" />
      <div className="absolute top-8 right-8 w-16 h-16 border-r-4 border-t-4 border-accent/20" />
    </main>
  )
}
