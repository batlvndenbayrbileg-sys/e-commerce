"use client"

import { motion } from "framer-motion"
import { ArrowRight, ArrowUpRight, Play, Zap, Weight } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/context/language-context"
import SplineScene from "@/components/spline-scene"

const SPLINE_URL = "https://prod.spline.design/0HlpSxMBCmtwrOEP/scene.splinecode"

const fadeUp = (delay = 0, y = 28) => ({
  initial: { opacity: 0, y },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
})

export default function HeroSection() {
  const { t } = useLanguage()

  return (
    <section className="relative min-h-[100svh] flex flex-col bg-[#06060A] overflow-hidden">

      {/* ── Background layers — no filter/animation, zero GPU overhead ── */}
      <div className="aurora-hero" />
      <div className="absolute inset-0 bg-dots opacity-[0.06]" />

      {/* ── 3D Spline — full right-side canvas ───────────────────── */}
      <div className="absolute inset-0 lg:left-[38%] pointer-events-none select-none z-0">
        {/* Mask: fade the left edge so text reads cleanly */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#06060A] via-[#06060A]/60 to-transparent lg:via-[#06060A]/30" />
        {/* Mask: soft bottom vignette */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#06060A] via-transparent to-transparent" />
        <SplineScene
          scene={SPLINE_URL}
          className="w-full h-full"
        />
      </div>

      {/* ── Main content ─────────────────────────────────────────── */}
      <div className="relative z-10 flex-1 flex items-center pt-28 lg:pt-36 pb-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-14 w-full">
          <div className="max-w-[620px]">

            {/* Eyebrow pill */}
            <motion.div {...fadeUp(0)} className="mb-8">
              <span className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] animate-pulse" />
                <span className="text-white/55 text-[11px] font-semibold tracking-[0.25em] uppercase">
                  {t("heroEyebrow")}
                </span>
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              {...fadeUp(0.08)}
              className="font-display font-medium leading-[0.9] tracking-[-0.04em] mb-7"
              style={{ fontSize: "clamp(3.25rem, 7.5vw, 6.25rem)" }}
            >
              <span className="text-white block">{t("heroLine1")}</span>
              <span className="text-white block">{t("heroLine2")}</span>
              <span className="text-gradient-coral font-editorial italic font-normal block">
                {t("heroLine3")}
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              {...fadeUp(0.18)}
              className="text-white/50 text-lg leading-relaxed max-w-[480px] mb-10"
            >
              {t("heroDesc")}
            </motion.p>

            {/* CTAs */}
            <motion.div {...fadeUp(0.26)} className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="/products"
                className="group relative overflow-hidden bg-[#007AFF] text-white px-8 py-4 rounded-full font-semibold text-sm flex items-center justify-center gap-3 hover:bg-[#0066D6] transition-all duration-300 shadow-[0_0_32px_rgba(0,122,255,0.35)] hover:shadow-[0_0_48px_rgba(0,122,255,0.5)] btn-shine"
              >
                <span className="relative z-10">{t("heroExploreCatalog")}</span>
                <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <button className="group flex items-center justify-center gap-3 px-8 py-4 text-sm font-medium text-white/70 border border-white/12 rounded-full hover:border-white/30 hover:text-white hover:bg-white/5 transition-all duration-300 backdrop-blur-sm">
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#FF6B35] transition-all duration-300">
                  <Play size={11} fill="currentColor" className="ml-0.5" />
                </div>
                <span>{t("heroWatchVideo")}</span>
              </button>
            </motion.div>

            {/* Quick-stat glass strip */}
            <motion.div
              {...fadeUp(0.34)}
              className="inline-grid grid-cols-3 divide-x divide-white/10 rounded-2xl overflow-hidden border border-white/10 bg-white/[0.04] backdrop-blur-md mb-10"
            >
              {[
                { value: "2,400+", label: "Units Sold" },
                { value: "15 Yrs",  label: "Experience" },
                { value: "98%",     label: "Retention" },
              ].map((s) => (
                <div key={s.label} className="px-6 py-4 text-center">
                  <p className="font-display font-semibold text-white text-xl tracking-[-0.025em] tabular">
                    {s.value}
                  </p>
                  <p className="text-white/35 text-[10px] font-medium tracking-[0.15em] uppercase mt-0.5">
                    {s.label}
                  </p>
                </div>
              ))}
            </motion.div>

            {/* Featured machine glass card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.44, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-5 p-4 pr-6 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md w-fit"
            >
              {/* Green "live" dot */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400/80 text-[10px] font-semibold tracking-widest uppercase">
                  In Stock
                </span>
              </div>

              <div className="w-px h-8 bg-white/10" />

              <div>
                <p className="text-white/35 text-[10px] font-semibold tracking-[0.18em] uppercase mb-0.5">
                  {t("heroFeatured")}
                </p>
                <p className="font-display text-white font-semibold text-base tracking-[-0.02em] tabular">
                  CAT 390F Mining Excavator
                </p>
              </div>

              <div className="w-px h-8 bg-white/10" />

              <div className="flex gap-5">
                <div className="text-center">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Zap size={11} className="text-[#007AFF]" />
                    <p className="text-[10px] text-white/35 tracking-wide">{t("heroPower")}</p>
                  </div>
                  <p className="font-display text-[#007AFF] font-semibold text-sm tabular">513 HP</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Weight size={11} className="text-white/40" />
                    <p className="text-[10px] text-white/35 tracking-wide">{t("heroWeight")}</p>
                  </div>
                  <p className="font-display text-white font-semibold text-sm tabular">90T</p>
                </div>
              </div>
            </motion.div>

            {/* Side links */}
            <motion.div
              {...fadeUp(0.52)}
              className="flex gap-8 pt-8 mt-4 border-t border-white/[0.08]"
            >
              {[
                { top: "Learn Our",  bot: "Story",    href: "/about" },
                { top: "Browse Our", bot: "Catalog", href: "/products" },
              ].map(({ top, bot, href }) => (
                <Link key={href} href={href} className="group flex flex-col gap-1.5">
                  <span className="text-[10px] text-white/30 font-semibold tracking-[0.2em] uppercase leading-tight">{top}</span>
                  <span className="text-[10px] text-white/30 font-semibold tracking-[0.2em] uppercase leading-tight">{bot}</span>
                  <div className="w-8 h-8 rounded-full border border-[#FF6B35]/50 flex items-center justify-center mt-1 group-hover:bg-[#FF6B35] group-hover:border-[#FF6B35] transition-all duration-300">
                    <ArrowUpRight size={12} className="text-[#FF6B35] group-hover:text-white transition-colors" />
                  </div>
                </Link>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Scroll indicator ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <div className="w-[1px] h-10 bg-gradient-to-b from-transparent via-white/30 to-white/10 animate-pulse" />
        <span className="text-white/25 text-[9px] font-semibold tracking-[0.3em] uppercase">Scroll</span>
      </motion.div>
    </section>
  )
}
