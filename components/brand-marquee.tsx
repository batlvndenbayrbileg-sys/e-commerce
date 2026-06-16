"use client"

import { motion } from "framer-motion"

const BRANDS = [
  "Caterpillar",
  "Komatsu",
  "Liebherr",
  "SANY",
  "Volvo",
  "Hitachi",
  "BELAZ",
  "XCMG",
  "Shantui",
]

export default function BrandMarquee() {
  // Duplicate list for seamless loop
  const loop = [...BRANDS, ...BRANDS]

  return (
    <section
      aria-label="Trusted manufacturers"
      className="relative py-8 lg:py-10 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #06060A 0%, #0e0e14 40%, #FAF9F7 100%)",
      }}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        <div className="flex flex-col items-center mb-8">
          <span className="text-[10px] text-white/30 font-semibold tracking-[0.3em] uppercase">
            Trusted partners
          </span>
          <p className="text-white/20 text-sm mt-2">
            Authorized dealer for the world's leading manufacturers
          </p>
        </div>
      </div>

      {/* Edge fades */}
      <div className="pointer-events-none absolute top-0 left-0 h-full w-32 z-10 bg-gradient-to-r from-[#0e0e14] to-transparent" />
      <div className="pointer-events-none absolute top-0 right-0 h-full w-32 z-10 bg-gradient-to-l from-[#0e0e14] to-transparent" />

      <div className="relative overflow-hidden">
        <motion.div
          className="flex gap-12 whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 36,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {loop.map((brand, i) => (
            <span
              key={`${brand}-${i}`}
              className="font-display text-white/20 hover:text-white/60 transition-colors duration-300 tracking-tight font-semibold text-3xl lg:text-4xl shrink-0"
            >
              {brand}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
