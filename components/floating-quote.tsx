"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, ChevronRight, Phone } from "lucide-react"
import { useLanguage } from "@/context/language-context"

export default function FloatingQuote() {
  const [open, setOpen] = useState(false)
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { t } = useLanguage()

  useEffect(() => {
    const button = buttonRef.current
    if (!button || open) return
    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      setMousePosition({ x: (e.clientX - centerX) * 0.15, y: (e.clientY - centerY) * 0.15 })
    }
    const handleMouseLeave = () => setMousePosition({ x: 0, y: 0 })
    button.addEventListener("mousemove", handleMouseMove)
    button.addEventListener("mouseleave", handleMouseLeave)
    return () => {
      button.removeEventListener("mousemove", handleMouseMove)
      button.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [open])

  const faqs = [
    { q: t("faq1Q"), a: t("faq1A") },
    { q: t("faq2Q"), a: t("faq2A") },
    { q: t("faq3Q"), a: t("faq3A") },
    { q: t("faq4Q"), a: t("faq4A") },
    { q: t("faq5Q"), a: t("faq5A") },
    { q: t("faq6Q"), a: t("faq6A") },
    { q: t("faq7Q"), a: t("faq7A") },
    { q: t("faq8Q"), a: t("faq8A") },
  ]

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            ref={buttonRef}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, x: mousePosition.x, y: mousePosition.y }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#007AFF] text-white rounded-full shadow-lg shadow-[#007AFF]/30 flex items-center justify-center hover:bg-[#FF9500] hover:shadow-[#FF9500]/30 transition-all duration-300"
            aria-label={t("faqTitle")}
          >
            <MessageCircle size={22} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="fixed bottom-6 right-6 z-50 w-[calc(100vw-3rem)] max-w-md bg-white rounded-2xl shadow-premium-hover overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="flex items-center justify-between p-5 border-b border-black/5 shrink-0">
                <div>
                  <h3 className="font-semibold text-black">{t("faqTitle")}</h3>
                  <p className="text-sm text-muted-foreground">{t("faqSubtitle")}</p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-muted-foreground hover:bg-black/10 hover:text-black transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {faqs.map((faq, index) => (
                  <div key={index} className="border border-black/5 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                      className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-[#F8F9FA] transition-colors"
                    >
                      <span className="text-sm font-medium text-black pr-4">{faq.q}</span>
                      <motion.div
                        animate={{ rotate: expandedIndex === index ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="shrink-0"
                      >
                        <ChevronRight size={16} className="text-muted-foreground" />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {expandedIndex === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">{faq.a}</div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-black/5 shrink-0 bg-[#F8F9FA]">
                <p className="text-xs text-muted-foreground text-center mb-3">{t("faqContactPrompt")}</p>
                <a
                  href="tel:+97685880999"
                  className="w-full bg-[#007AFF] text-white py-3 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-[#FF9500] transition-all duration-300 shadow-lg shadow-[#007AFF]/25"
                >
                  <Phone size={16} />
                  {t("faqCallBtn")}
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
