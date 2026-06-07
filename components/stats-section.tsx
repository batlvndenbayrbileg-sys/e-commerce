"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Phone } from "lucide-react"
import { useLanguage } from "@/context/language-context"
import { STAGGER, ITEM, HEADING } from "@/lib/motion"

// Counter only needs its own ref for the number animation trigger
function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref   = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  useEffect(() => {
    if (!inView) return
    const DURATION = 1800
    let start: number
    const step = (ts: number) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / DURATION, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setCount(Math.floor(eased * target))
      if (p < 1) requestAnimationFrame(step)
      else setCount(target)
    }
    requestAnimationFrame(step)
  }, [inView, target])

  return <span ref={ref} className="tabular">{count.toLocaleString()}{suffix}</span>
}

export default function StatsSection() {
  const { t } = useLanguage()

  const stats = [
    { value: 2400, suffix: "+", labelKey: "statUnitsLabel"     as const, subKey: "statUnitsSub"     as const, color: "blue" },
    { value: 15,   suffix: "+", labelKey: "statYearsLabel"     as const, subKey: "statYearsSub"     as const, color: "coral" },
    { value: 8,    suffix: "",  labelKey: "statCentersLabel"   as const, subKey: "statCentersSub"   as const, color: "blue" },
    { value: 98,   suffix: "%", labelKey: "statRetentionLabel" as const, subKey: "statRetentionSub" as const, color: "coral" },
  ]

  return (
    <section id="about" className="relative py-14 lg:py-20 bg-[#F8F9FA] grain overflow-hidden">
      {/* Subtle top border */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#E8E6E1] to-transparent" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">

        {/* Header */}
        <motion.div
          variants={STAGGER}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="max-w-2xl mb-8"
        >
          <motion.div variants={ITEM} className="flex items-center gap-3 mb-4">
            <span className="w-8 h-[2px] bg-[#007AFF]" />
            <span className="text-[#007AFF] text-[11px] font-bold tracking-[0.25em] uppercase">
              {t("statsEyebrow")}
            </span>
          </motion.div>
          <motion.h2
            variants={HEADING}
            className="font-display text-[#1A1A1A] font-medium tracking-[-0.03em] leading-[1.02]"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)" }}
          >
            {t("statsHeading")}
          </motion.h2>
        </motion.div>

        {/* Stats grid */}
        <motion.div
          variants={STAGGER}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4"
        >
          {stats.map((s) => (
            <motion.div
              key={s.labelKey}
              variants={ITEM}
              className="relative bg-white rounded-2xl p-5 lg:p-6 flex flex-col gap-2 group overflow-hidden border border-[#F0EDE8] hover:border-transparent transition-all duration-300 hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.12)]"
            >
              {/* Accent bar that expands on hover */}
              <div className={`absolute bottom-0 left-0 h-[3px] w-10 rounded-full transition-all duration-400 group-hover:w-full ${
                s.color === "blue" ? "bg-[#007AFF]" : "bg-[#FF6B35]"
              }`} />

              <p className="font-display font-medium text-[#1A1A1A] leading-none"
                 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
                <AnimatedCounter target={s.value} suffix={s.suffix} />
              </p>
              <div>
                <p className="font-semibold text-[#1A1A1A] text-sm">{t(s.labelKey)}</p>
                <p className="text-[#737373] text-sm mt-0.5">{t(s.subKey)}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA banner */}
        <motion.div
          variants={ITEM}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="relative bg-[#06060A] rounded-3xl p-8 lg:p-12 overflow-hidden"
        >
          {/* Background glows */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#007AFF]/12 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-52 h-52 bg-[#FF6B35]/10 rounded-full blur-[60px] pointer-events-none" />

          <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-lg">
              <span className="inline-flex items-center gap-2 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400/80 text-[10px] font-bold tracking-[0.25em] uppercase">Available now</span>
              </span>
              <h3 className="font-display text-white font-medium text-2xl lg:text-3xl tracking-tight mb-3">
                {t("statsCtaHeading")}
              </h3>
              <p className="text-white/50 text-sm leading-relaxed">{t("statsCtaDesc")}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                href="/products"
                className="bg-[#007AFF] text-white px-7 py-3.5 rounded-full text-sm font-semibold hover:bg-[#0066D6] transition-colors duration-200 flex items-center gap-2 group shadow-lg shadow-[#007AFF]/30"
              >
                {t("statsBrowseCatalog")}
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <a
                href="tel:+97685880999"
                className="flex items-center gap-2 border border-white/15 text-white px-7 py-3.5 rounded-full text-sm font-semibold hover:bg-white/8 hover:border-white/25 transition-all duration-200"
              >
                <Phone size={14} />
                {t("statsContactUs")}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
