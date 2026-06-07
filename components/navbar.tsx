"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Menu, X, ChevronDown, Phone, ArrowRight,
  Shovel, Truck, Loader, Construction, ChevronRight, Heart
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useLanguage } from "@/context/language-context"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const pathname = usePathname()
  const router = useRouter()
  const { lang, setLang, t } = useLanguage()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isActive = (href: string) => pathname === href

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#")) return
    e.preventDefault()
    const sectionId = href.slice(1)
    if (pathname === "/") {
      const el = document.getElementById(sectionId)
      if (el) {
        const offset = 100
        const top = el.getBoundingClientRect().top + window.scrollY - offset
        window.scrollTo({ top, behavior: "smooth" })
      }
    } else {
      router.push(`/${href}`)
    }
  }

  const handleMobileNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setMobileOpen(false)
    handleNavClick(e, href)
  }

  const categories = [
    { labelKey: "navCatExcavator" as const, descKey: "navCatExcavatorDesc" as const, href: "/products?category=Excavator", icon: Shovel },
    { labelKey: "navCatBulldozer" as const, descKey: "navCatBulldozerDesc" as const, href: "/products?category=Bulldozer", icon: Construction },
    { labelKey: "navCatLoader" as const, descKey: "navCatLoaderDesc" as const, href: "/products?category=Wheel+Loader", icon: Loader },
    { labelKey: "navCatTruck" as const, descKey: "navCatTruckDesc" as const, href: "/products?category=Dump+Truck", icon: Truck },
  ]

  const navLinks = [
    { labelKey: "navProducts" as const, href: "/products", hasDropdown: true },
    { labelKey: "navServices" as const, href: "#features" },
    { labelKey: "navAbout" as const, href: "#about" },
    { labelKey: "navContact" as const, href: "#contact" },
  ]

  return (
    <>
      {/* Announcement bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black text-white text-center py-2 text-[11px] tracking-wide font-medium">
        <span className="text-white/60">{t("announcementText")}</span>
        {" "}
        <a href="tel:+97685880999" className="text-[#FF9500] hover:text-[#E68600] transition-colors font-semibold">
          {t("announcementCall")}
        </a>
        {" "}
        <span className="text-white/60">{t("announcementSchedule")}</span>
      </div>

      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-7 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/90 backdrop-blur-xl border-b border-black/[0.06] shadow-[0_1px_0_0_rgba(0,0,0,0.04),0_8px_32px_rgba(0,0,0,0.06)]"
            : "bg-transparent border-b border-white/[0.06]"
        }`}
      >
        {scrolled && (
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#007AFF]/60 to-transparent" />
        )}

        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-[68px]">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="relative w-9 h-9 bg-[#007AFF] rounded-lg flex items-center justify-center overflow-hidden group-hover:bg-[#FF9500] transition-all duration-300 shadow-sm">
                <span className="font-black text-white text-[13px] tracking-widest transition-colors duration-300">HF</span>
              </div>
              <div className="hidden sm:flex flex-col leading-none">
                <span className={`font-bold text-[15px] tracking-tight transition-colors duration-300 ${scrolled ? "text-black" : "text-white"}`}>HeavyForce</span>
                <span className={`text-[9px] tracking-[0.18em] uppercase font-medium mt-0.5 transition-colors duration-300 ${scrolled ? "text-[#737373]" : "text-white/40"}`}>Mongolia</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center">
              {navLinks.map((link) =>
                link.hasDropdown ? (
                  <div
                    key={link.labelKey}
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(link.labelKey)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button
                      className={`flex items-center gap-1.5 px-5 py-2 text-[13px] font-medium transition-colors relative ${
                        isActive(link.href!)
                          ? scrolled ? "text-black" : "text-white"
                          : scrolled ? "text-[#737373] hover:text-black" : "text-white/60 hover:text-white"
                      }`}
                    >
                      {t(link.labelKey)}
                      <ChevronDown
                        size={13}
                        className={`transition-transform duration-200 ${activeDropdown === link.labelKey ? "rotate-180" : ""}`}
                      />
                      {isActive(link.href!) && (
                        <motion.span layoutId="nav-underline" className="absolute bottom-0 left-5 right-5 h-[2px] bg-[#007AFF] rounded-full" />
                      )}
                    </button>

                    <AnimatePresence>
                      {activeDropdown === link.labelKey && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.97 }}
                          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[340px] bg-white rounded-2xl border border-black/[0.06] shadow-premium-hover overflow-hidden"
                        >
                          <div className="px-4 pt-4 pb-2">
                            <p className="text-[10px] text-muted-foreground font-semibold tracking-[0.15em] uppercase mb-3">{t("navBrowseCategory")}</p>
                            <div className="grid grid-cols-2 gap-1.5">
                              {categories.map(({ labelKey, descKey, href, icon: Icon }) => (
                                <Link
                                  key={labelKey}
                                  href={href}
                                  className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-black/[0.03] transition-colors group/item"
                                >
                                  <div className="w-7 h-7 bg-black/[0.04] rounded-lg flex items-center justify-center shrink-0 group-hover/item:bg-[#007AFF]/10 transition-colors mt-0.5">
                                    <Icon size={13} className="text-muted-foreground group-hover/item:text-[#007AFF] transition-colors" />
                                  </div>
                                  <div>
                                    <p className="text-[13px] font-medium text-black leading-tight">{t(labelKey)}</p>
                                    <p className="text-[11px] text-muted-foreground mt-0.5">{t(descKey)}</p>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                          <div className="border-t border-black/[0.05] mx-4 mb-3 mt-2" />
                          <Link
                            href="/products"
                            className="flex items-center justify-between mx-4 mb-4 px-3 py-2.5 bg-[#007AFF] text-white rounded-xl text-[12px] font-medium hover:bg-[#0066D6] transition-all duration-200"
                          >
                            <span>{t("navViewAll")}</span>
                            <ArrowRight size={13} />
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <a
                    key={link.labelKey}
                    href={pathname === "/" ? link.href : `/${link.href}`}
                    onClick={(e) => handleNavClick(e, link.href!)}
                    className={`px-5 py-2 text-[13px] font-medium transition-colors relative ${scrolled ? "text-[#737373] hover:text-black" : "text-white/60 hover:text-white"}`}
                  >
                    {t(link.labelKey)}
                  </a>
                )
              )}
            </nav>

            {/* Right CTAs */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Language Toggle */}
              <div className="flex items-center rounded-full border border-black/10 overflow-hidden h-8">
                <button
                  onClick={() => setLang("mn")}
                  className={`px-3 h-full text-[11px] font-semibold tracking-wide transition-all duration-200 ${
                    lang === "mn" ? "bg-black text-white" : "text-muted-foreground hover:text-black"
                  }`}
                >
                  МН
                </button>
                <button
                  onClick={() => setLang("en")}
                  className={`px-3 h-full text-[11px] font-semibold tracking-wide transition-all duration-200 ${
                    lang === "en" ? "bg-black text-white" : "text-muted-foreground hover:text-black"
                  }`}
                >
                  EN
                </button>
              </div>

              <button
                type="button"
                aria-label="Wishlist"
                className={`relative w-9 h-9 rounded-full border flex items-center justify-center transition-colors ${scrolled ? "border-black/10 text-[#1A1A1A] hover:text-[#FF6B35] bg-white" : "border-white/15 text-white/60 hover:text-white bg-white/5"}`}
              >
                <Heart size={15} strokeWidth={2.2} />
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#FF6B35] text-white text-[9px] font-bold flex items-center justify-center">0</span>
              </button>

              <a
                href="tel:+97685880999"
                className={`flex items-center gap-2 px-4 py-2 rounded-full border text-[13px] font-medium transition-all duration-200 ${scrolled ? "border-black/10 text-black hover:border-black/30 bg-white" : "border-white/15 text-white/70 hover:text-white bg-white/5"}`}
              >
                <Phone size={13} className="text-[#007AFF]" strokeWidth={2.5} />
                8588-0999
              </a>
              <Link
                href="/products"
                className="flex items-center gap-1.5 bg-[#007AFF] text-white px-5 py-2 rounded-full text-[13px] font-semibold hover:bg-[#0066D6] transition-all duration-300 group shadow-lg shadow-[#007AFF]/30"
              >
                {t("navCatalog")}
                <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Mobile: lang toggle + burger */}
            <div className="lg:hidden flex items-center gap-2">
              <div className="flex items-center rounded-full border border-black/10 overflow-hidden h-8">
                <button
                  onClick={() => setLang("mn")}
                  className={`px-3 h-full text-[11px] font-semibold tracking-wide transition-all duration-200 ${
                    lang === "mn" ? "bg-black text-white" : "text-muted-foreground hover:text-black"
                  }`}
                >
                  МН
                </button>
                <button
                  onClick={() => setLang("en")}
                  className={`px-3 h-full text-[11px] font-semibold tracking-wide transition-all duration-200 ${
                    lang === "en" ? "bg-black text-white" : "text-muted-foreground hover:text-black"
                  }`}
                >
                  EN
                </button>
              </div>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="text-black p-2 hover:bg-black/5 rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait">
                  {mobileOpen ? (
                    <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <X size={22} />
                    </motion.div>
                  ) : (
                    <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <Menu size={22} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-white flex flex-col pt-28 px-6 pb-8"
          >
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#007AFF] to-transparent" />

            <nav className="flex flex-col flex-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.labelKey}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 + 0.05, ease: [0.22, 1, 0.36, 1] }}
                  className="border-b border-black/[0.06]"
                >
                  {link.hasDropdown ? (
                    <Link
                      href="/products"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between py-5 text-2xl font-semibold tracking-tight text-black"
                    >
                      {t(link.labelKey)}
                      <ChevronRight size={20} className="text-muted-foreground" />
                    </Link>
                  ) : (
                    <a
                      href={pathname === "/" ? link.href : `/${link.href}`}
                      onClick={(e) => handleMobileNavClick(e, link.href!)}
                      className="flex items-center justify-between py-5 text-2xl font-semibold tracking-tight text-black"
                    >
                      {t(link.labelKey)}
                      <ChevronRight size={20} className="text-muted-foreground" />
                    </a>
                  )}
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col gap-3 pt-6"
            >
              <a
                href="tel:+97685880999"
                className="flex items-center justify-center gap-2.5 border border-black/10 rounded-2xl py-3.5 text-sm font-medium text-black hover:border-black/30 transition-colors"
              >
                <Phone size={15} className="text-[#007AFF]" strokeWidth={2.5} />
                {t("navCallBtn")}
              </a>
              <Link
                href="/products"
                onClick={() => setMobileOpen(false)}
                className="bg-[#007AFF] text-white rounded-2xl py-3.5 text-center text-sm font-semibold hover:bg-[#FF9500] transition-all duration-300 shadow-lg shadow-[#007AFF]/25"
              >
                {t("navViewCatalog")}
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
