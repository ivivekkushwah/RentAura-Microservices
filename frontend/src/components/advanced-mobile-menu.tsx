"use client"

import type React from "react"

import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Home, Users, MessageSquare, Settings, LogOut, ChevronRight, Zap } from "lucide-react"



interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  navLinks: Array<{ href: string; label: string }>
  accountLinks: Array<{ href: string; label: string }>
  isLoggedIn: boolean
  role?: string
}

export function AdvancedMobileMenu({ isOpen, onClose, navLinks, accountLinks, isLoggedIn }: MobileMenuProps) {
  const pathname = usePathname()

  const iconMap: Record<string, React.ReactNode> = {
    Dashboard: <LayoutDashboard className="w-5 h-5" />,
    "My Rooms": <Home className="w-5 h-5" />,
    Maintenance: <Zap className="w-5 h-5" />,
    Bookings: <MessageSquare className="w-5 h-5" />,
    Tenants: <Users className="w-5 h-5" />,
    Browse: <Home className="w-5 h-5" />,
    Owners: <Users className="w-5 h-5" />,
    Roommates: <Users className="w-5 h-5" />,
    Messages: <MessageSquare className="w-5 h-5" />,
    Profile: <Settings className="w-5 h-5" />,
    "My Bookings": <MessageSquare className="w-5 h-5" />,
    Favorites: <Zap className="w-5 h-5" />,
    About: <Home className="w-5 h-5" />,
    Contact: <MessageSquare className="w-5 h-5" />,
  }

  const primaryLinks = navLinks.slice(0, 3)
  const secondaryLinks = navLinks.slice(3)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring" as const, stiffness: 300, damping: 30 },
    },
  }

  const handleLinkClick = () => {
    onClose()
  }

  return (
    <>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <motion.nav
        initial={{ height: 0, opacity: 0 }}
        animate={isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="md:hidden w-full border-t border-border bg-gradient-to-b from-background via-background to-background/95 shadow-2xl overflow-hidden z-50"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isOpen ? "visible" : "hidden"}
          className="flex flex-col px-4 py-6 space-y-6"
        >
          {/* Primary Navigation Section */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Navigation</p>
            <div className="space-y-2">
              {primaryLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <motion.div key={link.href} variants={itemVariants}>
                    <Link
                      href={link.href}
                      onClick={handleLinkClick}
                      className={`group flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-300 ${
                        isActive
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-foreground hover:bg-secondary/50 hover:text-primary"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg transition-all ${
                            isActive ? "bg-primary/20" : "bg-secondary/50 group-hover:bg-primary/10"
                          }`}
                        >
                          {iconMap[link.label] || <Home className="w-5 h-5" />}
                        </div>
                        <span className="font-medium text-sm">{link.label}</span>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 transition-transform duration-300 ${isActive ? "translate-x-1" : ""}`}
                      />
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Secondary Navigation Section */}
          {secondaryLinks.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Explore</p>
              <div className="space-y-2">
                {secondaryLinks.map((link) => {
                  const isActive = pathname === link.href
                  return (
                    <motion.div key={link.href} variants={itemVariants}>
                      <Link
                        href={link.href}
                        onClick={handleLinkClick}
                        className={`group flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-300 ${
                          isActive
                            ? "bg-primary/10 text-primary font-semibold"
                            : "text-foreground hover:bg-secondary/50 hover:text-primary"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg transition-all ${
                              isActive ? "bg-primary/20" : "bg-secondary/50 group-hover:bg-primary/10"
                            }`}
                          >
                            {iconMap[link.label] || <Home className="w-5 h-5" />}
                          </div>
                          <span className="font-medium text-sm">{link.label}</span>
                        </div>
                        <ChevronRight
                          className={`w-4 h-4 transition-transform duration-300 ${isActive ? "translate-x-1" : ""}`}
                        />
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Account Section */}
          {isLoggedIn && (
            <div className="border-t border-border pt-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Account</p>
              <div className="space-y-2">
                {accountLinks.map((link) => {
                  const isActive = pathname === link.href
                  return (
                    <motion.div key={link.href} variants={itemVariants}>
                      <Link
                        href={link.href}
                        onClick={handleLinkClick}
                        className={`group flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-300 ${
                          isActive
                            ? "bg-primary/10 text-primary font-semibold"
                            : "text-foreground hover:bg-secondary/50 hover:text-primary"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg transition-all ${
                              isActive ? "bg-primary/20" : "bg-secondary/50 group-hover:bg-primary/10"
                            }`}
                          >
                            {iconMap[link.label] || <Settings className="w-5 h-5" />}
                          </div>
                          <span className="font-medium text-sm">{link.label}</span>
                        </div>
                        <ChevronRight
                          className={`w-4 h-4 transition-transform duration-300 ${isActive ? "translate-x-1" : ""}`}
                        />
                      </Link>
                    </motion.div>
                  )
                })}
              </div>

              {/* Logout Button */}
              <motion.div variants={itemVariants} className="pt-3 border-t border-border mt-4">
                <button
                  onClick={() => {
                    onClose()
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 font-medium text-sm transition-all duration-300"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </motion.div>
            </div>
          )}

          {/* Not Logged In Links */}
          {!isLoggedIn && (
            <div className="border-t border-border pt-4 space-y-2">
              <motion.div variants={itemVariants}>
                <Link
                  href="/login"
                  onClick={handleLinkClick}
                  className="block w-full px-4 py-3 rounded-lg bg-primary/10 text-primary text-center font-semibold hover:bg-primary/20 transition-all"
                >
                  Login
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link
                  href="/sign-up"
                  onClick={handleLinkClick}
                  className="block w-full px-4 py-3 rounded-lg bg-primary text-primary-foreground text-center font-semibold hover:bg-primary/90 transition-all"
                >
                  Sign Up
                </Link>
              </motion.div>
            </div>
          )}
        </motion.div>
      </motion.nav>
    </>
  )
}
