"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ThemeToggle } from "./theme-toggle"
import { usePageTurn } from "./page-turn-provider"

export function Navbar() {
  const { turnTo } = usePageTurn()

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b-2 border-border"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        {/* Logo */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            turnTo('top', e.clientX, e.clientY);
          }}
          className="group flex items-center gap-3 shrink-0 cursor-pointer"
        >
          <div className="w-10 h-10 bg-card border-2 border-border flex items-center justify-center transform -skew-x-6 group-hover:border-primary transition-colors">
            <span className="font-[var(--font-bangers)] text-xl text-primary transform skew-x-6">AN</span>
          </div>
          <span className="hidden sm:inline-block font-[var(--font-bangers)] text-xl tracking-wider text-foreground group-hover:text-primary transition-colors">
            PIXEL BY AARYA
          </span>
        </a>

        {/* Navigation Links - Center */}
        <div className="hidden md:flex items-center gap-8 flex-1 justify-center">
          {[
            { label: "WORK", href: "#portfolio" },
            { label: "ABOUT", href: "#about" },
            { label: "CONTACT", href: "#contact" },
          ].map((link, index) => (
            <motion.div
              key={link.label}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index + 0.3 }}
            >
              <a
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  turnTo(link.href.replace('#', ''), e.clientX, e.clientY);
                }}
                className="relative font-[var(--font-bangers)] text-lg tracking-wider text-muted-foreground hover:text-foreground transition-colors group cursor-pointer"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </a>
            </motion.div>
          ))}
        </div>

        {/* Right side - Theme Toggle & Admin */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="/admin"
            className="hidden sm:inline-block px-4 py-2 bg-card border-2 border-border text-sm font-medium text-muted-foreground hover:border-primary hover:text-primary transition-all transform hover:skew-x-3"
          >
            ADMIN
          </Link>
        </div>
      </div>
    </motion.nav>
  )
}