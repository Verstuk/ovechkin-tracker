"use client"

import type React from "react"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { activateTab } from "./simple-tabs"

export default function MainNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { name: "HOME", href: "#" },
    { name: "ABOUT", href: "#stats-section" },
    { name: "STATS", href: "#stats-section" },
    { name: "MILESTONES", href: "#tabs-section", tabId: "milestones" },
    { name: "GALLERY", href: "#tabs-section", tabId: "gallery" },
    { name: "CONTACT", href: "#footer-section" },
  ]

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: (typeof navItems)[0]) => {
    e.preventDefault()
    setIsMenuOpen(false)

    // Найти элемент по ID и прокрутить к нему
    const element = document.querySelector(item.href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })

      // Если есть tabId, активировать соответствующую вкладку
      if (item.tabId) {
        setTimeout(() => {
          activateTab(item.tabId)
        }, 500) // Небольшая задержка для завершения прокрутки
      }
    }
  }

  return (
    <motion.nav
      className="bg-navy-950 border-b border-navy-700 sticky top-0 z-50"
      initial={{ y: 0, opacity: 1 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <motion.div className="flex items-center" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <div className="bg-accent-red w-10 h-10 flex items-center justify-center mr-3 box-glow">
              <span className="text-xl font-bold font-anton heading-loading-fix">8</span>
            </div>
            <span className="text-xl font-bold tracking-tight font-anton heading-loading-fix">OVI TRACKER</span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                className="text-sm text-gray-300 hover:text-white transition-colors font-squada heading-loading-fix"
                onClick={(e) => handleNavClick(e, item)}
                whileHover={{ scale: 1.1, color: "#ffffff" }}
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {item.name}
              </motion.a>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-300">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.div
          className="md:hidden bg-navy-800 border-t border-navy-700"
          initial={{ opacity: 1, height: "auto" }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
        >
          <div className="container mx-auto px-4 py-3">
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                className="block py-2 text-gray-300 hover:text-white transition-colors font-squada heading-loading-fix"
                onClick={(e) => handleNavClick(e, item)}
                initial={{ opacity: 1, x: 0 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                {item.name}
              </motion.a>
            ))}
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}
