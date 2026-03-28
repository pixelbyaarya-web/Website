"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { usePageTurn } from "./page-turn-provider"

export function Navbar() {
  const { turnTo } = usePageTurn()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navLinks = [
    { label: "WORK", href: "#portfolio" },
    { label: "ABOUT", href: "#about" },
    { label: "CONTACT", href: "#contact" },
  ]

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    turnTo(href.replace('#', ''), e.clientX, e.clientY);
  };

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

        {/* Navigation Links - Center (Desktop) */}
        <div className="hidden md:flex items-center gap-8 flex-1 justify-center">
          {navLinks.map((link, index) => (
            <motion.div
              key={link.label}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index + 0.3 }}
            >
              <a
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="relative font-[var(--font-bangers)] text-lg tracking-wider text-muted-foreground hover:text-foreground transition-colors group cursor-pointer"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </a>
            </motion.div>
          ))}
        </div>

        {/* Right side - Theme Toggle & Hamburger */}
        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
          <Link
            href="/admin"
            className="hidden lg:inline-block px-4 py-2 bg-card border-2 border-border text-sm font-medium text-muted-foreground hover:border-primary hover:text-primary transition-all transform hover:skew-x-3"
          >
            ADMIN
          </Link>

          {/* Hamburger Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex md:hidden w-10 h-10 items-center justify-center border-2 border-border hover:border-primary hover:text-primary transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
            className="md:hidden border-t-2 border-border bg-background overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="font-[var(--font-bangers)] text-2xl tracking-widest text-foreground hover:text-primary transition-colors py-2 border-b border-border/50 last:border-0"
                >
                  {link.label}
                </a>
              ))}
              <Link
                href="/admin"
                onClick={() => setIsMenuOpen(false)}
                className="inline-block mt-4 px-6 py-3 bg-card border-2 border-border text-center font-[var(--font-bangers)] text-lg text-primary tracking-widest hover:border-primary transition-all"
              >
                ADMIN ACCESS
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}