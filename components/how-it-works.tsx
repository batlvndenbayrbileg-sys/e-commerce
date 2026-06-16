"use client"

import { motion } from "framer-motion"
import { Search, MessageSquare, Wrench, Truck } from "lucide-react"
import { STAGGER, ITEM, HEADING, useScrollReveal } from "@/lib/motion"

const STEPS = [
  {
    n: "01", icon: Search,
    title: "Browse the catalog",
    desc: "Explore 50+ machines filtered by brand, category, and use case.",
    accent: "blue" as const,
  },
  {
    n: "02", icon: MessageSquare,
    title: "Request a quote",
    desc: "Tell us your project. We respond within 24 hours with options and pricing.",
    accent: "coral" as const,
  },
  {
    n: "03", icon: Wrench,
    title: "On-site demo",
    desc: "Free demonstration anywhere in Mongolia — try before you commit.",
    accent: "blue" as const,
  },
  {
    n: "04", icon: Truck,
    title: "Delivery & support",
    desc: "Nationwide delivery, operator training, and 24/7 service for life.",
    accent: "coral" as const,
  },
]

export default function HowItWorks() {
  const header = useScrollReveal()
  const steps  = useScrollReveal()

  return (
    <section className="relative py-14 lg:py-20 bg-[#FAF9F7] overflow-hidden">
      <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none" />

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-8">

        {/* Header */}
        <motion.div
          ref={header.ref}
          variants={STAGGER}
          initial="hidden"
          animate={header.animate}
          className="max-w-2xl mb-8"
        >
          <motion.div variants={ITEM} className="flex items-center gap-3 mb-4">
            <span className="w-8 h-[2px] bg-[#FF6B35]" />
            <span className="text-[#FF6B35] text-[11px] font-bold tracking-[0.25em] uppercase">
              How it works
            </span>
          </motion.div>
          <motion.h2
            variants={HEADING}
            className="font-display text-[#1A1A1A] font-medium tracking-[-0.03em] leading-[1.02]"
            style={{ fontSize: "clamp(2.25rem, 4.6vw, 3.5rem)" }}
          >
            From browse to delivery —{" "}
            <span className="font-editorial italic text-gradient-coral font-normal">simple.</span>
          </motion.h2>
          <motion.p variants={ITEM} className="text-[#737373] text-lg mt-5 max-w-xl leading-relaxed">
            A no-pressure process built for serious operators. Every step is
            handled by a dedicated specialist — not a call centre.
          </motion.p>
        </motion.div>

        {/* Steps */}
        <motion.div
          ref={steps.ref}
          variants={STAGGER}
          initial="hidden"
          animate={steps.animate}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {STEPS.map((step, i) => {
            const Icon      = step.icon
            const isBlue    = step.accent === "blue"
            const iconBg    = isBlue ? "bg-[#007AFF]/10 border-[#007AFF]/15"
                                     : "bg-[#FF6B35]/10 border-[#FF6B35]/15"
            const iconColor = isBlue ? "text-[#007AFF]" : "text-[#FF6B35]"

            return (
              <motion.div
                key={step.n}
                variants={ITEM}
                className="bg-white rounded-2xl p-6 flex flex-col border border-[#F0EDE8] hover:border-[#007AFF]/20 hover:shadow-[0_8px_32px_-8px_rgba(0,122,255,0.12)] transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-11 h-11 rounded-xl border flex items-center justify-center ${iconBg}`}>
                    <Icon size={19} className={iconColor} strokeWidth={2.2} />
                  </div>
                  <span className="font-display text-[#1A1A1A]/12 font-bold text-3xl tabular">
                    {step.n}
                  </span>
                </div>

                <h3 className="font-display text-[#1A1A1A] font-semibold text-base tracking-tight leading-snug mb-2">
                  {step.title}
                </h3>
                <p className="text-[#737373] text-sm leading-relaxed flex-1">
                  {step.desc}
                </p>

                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block mt-5 w-full h-px bg-gradient-to-r from-[#E8E6E1] to-transparent" />
                )}
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
