"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Gauge, Weight, ArrowRight, ArrowUpRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "@/context/language-context"
import { STAGGER, ITEM, HEADING, FADE, useScrollReveal } from "@/lib/motion"

type Product = {
  id: number
  name: { en: string; mn: string }
  model: string
  category: { en: string; mn: string }
  brand: string
  power: string
  weight: string
  price: string
  badge?: "New" | "Best Seller"
  image: string
}

const featuredProducts: Product[] = [
  {
    id: 1,
    name: { en: "Mining Excavator", mn: "Уурхайн Экскаватор" },
    model: "CAT 390F",
    category: { en: "Excavator", mn: "Экскаватор" },
    brand: "Caterpillar",
    power: "513 HP", weight: "90,000 kg", price: "₮1,240,000",
    badge: "Best Seller", image: "/images/product-excavator.jpg",
  },
  {
    id: 11,
    name: { en: "Track-Type Tractor", mn: "Гусеньт Трактор" },
    model: "CAT D9T",
    category: { en: "Bulldozer", mn: "Бульдозер" },
    brand: "Caterpillar",
    power: "410 HP", weight: "49,200 kg", price: "₮890,000",
    badge: "New", image: "/images/product-bulldozer.jpg",
  },
  {
    id: 20,
    name: { en: "Large Wheel Loader", mn: "Том Колёст Ачигч" },
    model: "CAT 994K",
    category: { en: "Wheel Loader", mn: "Колёст Ачигч" },
    brand: "Caterpillar",
    power: "1,453 HP", weight: "202,000 kg", price: "₮4,200,000",
    badge: "New", image: "/images/product-loader-2.jpg",
  },
  {
    id: 27,
    name: { en: "Electric Drive Truck", mn: "Цахилгаан Самосвал" },
    model: "Komatsu 930E",
    category: { en: "Dump Truck", mn: "Самосвал" },
    brand: "Komatsu",
    power: "2,700 HP", weight: "240,000 kg", price: "₮5,100,000",
    badge: "Best Seller", image: "/images/product-dumptruck-2.jpg",
  },
]

// ── Product Card — pure CSS hover, no per-item motion observer ─
function ProductCard({ product }: { product: Product }) {
  const { lang, t } = useLanguage()

  const BADGE_LABELS: Record<string, string> = {
    "New":         t("badgeNew"),
    "Best Seller": t("badgeBestSeller"),
  }

  return (
    // motion.div ITEM variant inherited from parent STAGGER container
    <motion.article variants={ITEM} className="group relative glass-card rounded-2xl overflow-hidden flex flex-col">

      {/* ── Image ── */}
      <div className="relative h-64 overflow-hidden bg-[#F0EFF0]">
        <Image
          src={product.image}
          alt={`${product.name.en} — ${product.model}`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Gradient veil on hover — pure CSS, no framer-motion */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* View CTA lifts up on hover */}
        <div className="absolute bottom-4 inset-x-4 flex justify-center translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <Link
            href="/products"
            className="bg-white text-[#1A1A1A] px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-[#FF6B35] hover:text-white transition-colors duration-200 shadow-lg"
          >
            {t("previewViewDetails")}
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Badge */}
        {product.badge && (
          <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-[0.08em] uppercase ${
            product.badge === "New"
              ? "bg-[#FF6B35] text-white"
              : "bg-[#1A1A1A] text-white"
          }`}>
            {BADGE_LABELS[product.badge]}
          </div>
        )}

        {/* Wishlist */}
        <button
          type="button"
          aria-label="Save to wishlist"
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#737373] hover:text-[#FF6B35] hover:bg-white transition-colors duration-200 shadow-soft"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>

      {/* ── Body ── */}
      <div className="p-5 flex flex-col flex-1">
        {/* Meta row */}
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[10px] text-[#A3A3A3] font-semibold tracking-[0.12em] uppercase">{product.brand}</span>
          <span className="text-[10px] text-[#A3A3A3] font-medium">{product.category[lang]}</span>
        </div>

        {/* Name + link icon */}
        <div className="flex items-start justify-between gap-2 mb-4">
          <div>
            <h3 className="font-display font-semibold text-[#1A1A1A] text-base tracking-tight leading-snug">{product.name[lang]}</h3>
            <p className="text-[#007AFF] text-sm font-semibold tabular mt-0.5">{product.model}</p>
          </div>
          <div className="shrink-0 w-9 h-9 rounded-full bg-[#F5F4F1] flex items-center justify-center text-[#A3A3A3] group-hover:bg-[#007AFF] group-hover:text-white transition-colors duration-300">
            <ArrowUpRight size={15} />
          </div>
        </div>

        {/* Specs */}
        <div className="flex gap-2 mb-4">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 glass-blue rounded-lg">
            <Gauge size={13} className="text-[#007AFF] shrink-0" />
            <span className="text-[#1A1A1A] text-xs font-semibold tabular">{product.power}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 glass-coral rounded-lg">
            <Weight size={13} className="text-[#FF6B35] shrink-0" />
            <span className="text-[#1A1A1A] text-xs font-semibold tabular">{product.weight}</span>
          </div>
        </div>

        {/* Price */}
        <div className="pt-4 border-t border-[#F0EDE8] mt-auto flex items-end justify-between">
          <div>
            <p className="text-[9px] text-[#A3A3A3] font-semibold tracking-[0.15em] uppercase">{t("previewStartingFrom")}</p>
            <p className="font-display text-[#1A1A1A] font-semibold text-xl tracking-tight tabular mt-0.5">{product.price}</p>
          </div>
          <Link
            href="/products"
            className="text-[11px] text-[#007AFF] font-semibold hover:text-[#FF6B35] transition-colors"
          >
            Inquire →
          </Link>
        </div>
      </div>
    </motion.article>
  )
}

// ── Section ────────────────────────────────────────────────────
export default function ProductPreview() {
  const { t } = useLanguage()
  const [activeCategory, setActiveCategory] = useState("All")
  const header = useScrollReveal()
  const grid   = useScrollReveal()
  const footer = useScrollReveal()

  const categories = [
    { label: "All",        match: null },
    { label: "Excavators", match: "Excavator" },
    { label: "Loaders",    match: "Wheel Loader" },
    { label: "Trucks",     match: "Dump Truck" },
    { label: "Bulldozers", match: "Bulldozer" },
  ]

  const visible = featuredProducts.filter((p) => {
    if (activeCategory === "All") return true
    const cat = categories.find((c) => c.label === activeCategory)
    return cat?.match ? p.category.en === cat.match : true
  })

  return (
    <section id="products" className="relative py-14 lg:py-20 bg-[#FAF9F7] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">

        {/* ── Header ── */}
        <motion.div
          ref={header.ref}
          variants={STAGGER}
          initial="hidden"
          animate={header.animate}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-8"
        >
          <div className="max-w-xl">
            <motion.div variants={FADE ?? ITEM} className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[2px] bg-[#FF6B35]" />
              <span className="text-[#FF6B35] text-[11px] font-bold tracking-[0.25em] uppercase">
                {t("previewEyebrow")}
              </span>
            </motion.div>
            <motion.h2
              variants={HEADING}
              className="font-display text-[#1A1A1A] font-medium tracking-[-0.03em] leading-[1.02]"
              style={{ fontSize: "clamp(2.25rem, 4.8vw, 3.75rem)" }}
            >
              {t("previewHeading")}
            </motion.h2>
          </div>

          {/* Category filters */}
          <motion.div variants={ITEM} className="flex flex-wrap gap-2">
            {categories.map(({ label }) => (
              <button
                key={label}
                onClick={() => setActiveCategory(label)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  activeCategory === label
                    ? "bg-[#1A1A1A] text-white"
                    : "bg-white border border-[#E8E6E1] text-[#737373] hover:border-[#1A1A1A]/30 hover:text-[#1A1A1A]"
                }`}
              >
                {label}
              </button>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Grid — one observer on the wrapper, stagger the children ── */}
        {visible.length > 0 ? (
          <motion.div
            ref={grid.ref}
            variants={STAGGER}
            initial="hidden"
            animate={grid.animate}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {visible.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </motion.div>
        ) : (
          <div className="rounded-2xl border border-[#E8E6E1] bg-white p-14 text-center">
            <p className="text-[#737373]">No featured items in this category.</p>
            <button
              onClick={() => setActiveCategory("All")}
              className="text-[#007AFF] font-semibold text-sm mt-3 hover:underline"
            >
              Show all
            </button>
          </div>
        )}

        {/* ── CTA ── */}
        <motion.div
          ref={footer.ref}
          variants={ITEM}
          initial="hidden"
          animate={footer.animate}
          className="mt-10 flex flex-col items-center gap-2"
        >
          <Link
            href="/products"
            className="group inline-flex items-center gap-3 bg-[#1A1A1A] text-white px-9 py-4 rounded-full font-semibold text-sm hover:bg-[#FF6B35] transition-colors duration-300 btn-shine overflow-hidden"
          >
            <span className="relative z-10">{t("previewLoadMore")}</span>
            <ArrowRight size={15} className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
          <p className="text-[#A3A3A3] text-xs">{t("previewShowing")}</p>
        </motion.div>
      </div>
    </section>
  )
}
