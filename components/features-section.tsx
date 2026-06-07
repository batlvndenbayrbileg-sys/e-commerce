"use client"

import { motion } from "framer-motion"
import { Wrench, Globe2, ShieldCheck, Clock, Truck, Award, ArrowUpRight } from "lucide-react"
import { useLanguage } from "@/context/language-context"
import { STAGGER, ITEM, HEADING } from "@/lib/motion"

export default function FeaturesSection() {
  const { t } = useLanguage()

  const features = [
    {
      icon: ShieldCheck,
      titleKey: "featOemTitle"       as const,
      descKey:  "featOemDesc"        as const,
      wide: true, accent: "blue" as const,
      stat: { label: "Parts Guaranteed", value: "100%" },
    },
    {
      icon: Globe2,
      titleKey: "featDeliveryTitle"  as const,
      descKey:  "featDeliveryDesc"   as const,
    },
    {
      icon: Clock,
      titleKey: "featSupportTitle"   as const,
      descKey:  "featSupportDesc"    as const,
    },
    {
      icon: Wrench,
      titleKey: "featServiceTitle"   as const,
      descKey:  "featServiceDesc"    as const,
      wide: true, accent: "coral" as const,
      locations: ["Ulaanbaatar", "Erdenet", "Darkhan", "Tavan Tolgoi"],
    },
    {
      icon: Truck,
      titleKey: "featFastTitle"       as const,
      descKey:  "featFastDesc"        as const,
    },
    {
      icon: Award,
      titleKey: "featExperienceTitle" as const,
      descKey:  "featExperienceDesc"  as const,
    },
  ]

  return (
    <section id="features" className="relative py-14 lg:py-20 bg-white overflow-hidden">
      {/* Subtle dot texture */}
      <div className="absolute inset-0 bg-dots opacity-25 pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 relative">

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
              {t("featuresEyebrow")}
            </span>
          </motion.div>
          <motion.h2
            variants={HEADING}
            className="font-display text-[#1A1A1A] font-medium tracking-[-0.03em] leading-[1.02]"
            style={{ fontSize: "clamp(2.25rem, 4.8vw, 3.75rem)" }}
          >
            {t("featuresHeading")}
          </motion.h2>
        </motion.div>

        {/* Bento grid — one observer on wrapper */}
        <motion.div
          variants={STAGGER}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.05 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {features.map((f) => {
            const Icon    = f.icon
            const isBlue  = f.accent === "blue"
            const isCoral = f.accent === "coral"
            const isAccent = isBlue || isCoral

            return (
              <motion.div
                key={f.titleKey}
                variants={ITEM}
                className={[
                  "relative rounded-2xl overflow-hidden group",
                  f.wide ? "md:col-span-2" : "col-span-1",
                  isBlue  ? "bg-[#007AFF] text-white glow-blue"
                          : isCoral ? "bg-[#FF6B35] text-white glow-coral"
                          : "glass-card",
                ].join(" ")}
              >
                <div className={`relative z-10 p-6 ${f.wide ? "lg:p-8" : ""} h-full flex flex-col`}>

                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${
                    isAccent ? "bg-white/15" : "bg-[#F5F4F1]"
                  }`}>
                    <Icon size={22} className={isAccent ? "text-white" : "text-[#1A1A1A]"} strokeWidth={2} />
                  </div>

                  <h3 className={`font-display font-semibold tracking-tight mb-2.5 ${f.wide ? "text-xl" : "text-base"} ${
                    isAccent ? "text-white" : "text-[#1A1A1A]"
                  }`}>
                    {t(f.titleKey)}
                  </h3>

                  <p className={`text-sm leading-relaxed flex-1 ${isAccent ? "text-white/75" : "text-[#737373]"}`}>
                    {t(f.descKey)}
                  </p>

                  {/* Location tags */}
                  {f.locations && (
                    <div className="flex flex-wrap gap-2 mt-5">
                      {f.locations.map((loc) => (
                        <span key={loc} className="text-[11px] font-medium bg-white/15 text-white px-3 py-1.5 rounded-full">
                          {loc}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Stat */}
                  {f.stat && (
                    <div className="mt-5 pt-5 border-t border-white/20">
                      <p className="text-white/55 text-xs tracking-wide mb-1">{f.stat.label}</p>
                      <p className="font-display text-white font-semibold text-3xl tabular tracking-tight">{f.stat.value}</p>
                    </div>
                  )}

                  {/* Arrow */}
                  <div className={`absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200 ${
                    isAccent ? "bg-white/10 group-hover:bg-white/20"
                             : "bg-[#F5F4F1] group-hover:bg-[#1A1A1A]"
                  }`}>
                    <ArrowUpRight size={15} className={`transition-colors duration-200 ${
                      isAccent ? "text-white" : "text-[#A3A3A3] group-hover:text-white"
                    }`} />
                  </div>
                </div>

                {/* Subtle inner light on accent cards */}
                {isAccent && (
                  <div className="absolute -bottom-12 -right-12 w-40 h-40 rounded-full blur-3xl pointer-events-none bg-white/10" />
                )}
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
