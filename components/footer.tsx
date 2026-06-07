"use client"

import { motion } from "framer-motion"
import { Phone, Mail, MapPin, ArrowUpRight, ArrowRight, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useLanguage } from "@/context/language-context"

const brands = ["Caterpillar", "Komatsu", "Liebherr", "SANY", "Volvo", "BELAZ"]

export default function Footer() {
  const [submitted, setSubmitted] = useState(false)
  const [email, setEmail] = useState("")
  const { t } = useLanguage()

  const productLinks = [
    { labelKey: "footerExcavators" as const, href: "/products?category=Excavator" },
    { labelKey: "footerBulldozers" as const, href: "/products?category=Bulldozer" },
    { labelKey: "footerWheelLoaders" as const, href: "/products?category=Wheel+Loader" },
    { labelKey: "footerDumpTrucks" as const, href: "/products?category=Dump+Truck" },
    { labelKey: "footerCranes" as const, href: "/products?category=Crane" },
    { labelKey: "footerAllEquipment" as const, href: "/products" },
  ]

  const companyLinks = [
    { labelKey: "footerAboutUs" as const, href: "#about" },
    { labelKey: "footerServices" as const, href: "#features" },
    { labelKey: "footerAfterSales" as const, href: "#features" },
    { labelKey: "footerSpareParts" as const, href: "#features" },
    { labelKey: "footerContact" as const, href: "#contact" },
  ]

  const trustItems = [
    { key: "footerTrust1" as const },
    { key: "footerTrust2" as const },
    { key: "footerTrust3" as const },
    { key: "footerTrust4" as const },
  ]

  return (
    <footer id="contact" className="bg-black text-white overflow-hidden">

      {/* CTA Band */}
      <div className="relative border-b border-white/[0.07] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(245,189,2,0.07),transparent)]" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20 relative">
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-10">
            <div className="max-w-xl">
              <p className="text-[11px] text-[#007AFF] font-semibold tracking-[0.2em] uppercase mb-3">{t("footerCtaEyebrow")}</p>
              <h2 className="text-3xl lg:text-4xl font-bold tracking-tighter text-white leading-tight">
                {t("footerCtaHeading1")}<br />
                <span className="text-[#FF9500]">{t("footerCtaHeading2")}</span> {t("footerCtaHeading3")}
              </h2>
              <p className="text-white/50 text-sm mt-4 leading-relaxed">{t("footerCtaDesc")}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <a href="tel:+97685880999" className="flex items-center gap-2.5 bg-[#FF9500] text-white px-6 py-3.5 rounded-full font-semibold text-sm hover:bg-[#E68600] transition-colors shadow-lg shadow-[#FF9500]/25">
                <Phone size={15} strokeWidth={2.5} />
                {t("footerCallBtn")}
              </a>
              <a href="mailto:sales@heavyforce.mn" className="flex items-center gap-2.5 bg-white/[0.06] border border-white/10 text-white px-6 py-3.5 rounded-full font-medium text-sm hover:bg-white/10 hover:border-white/20 transition-all">
                <Mail size={15} />
                {t("footerEmailBtn")}
              </a>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 mt-10 pt-8 border-t border-white/[0.06]">
            {trustItems.map(({ key }) => (
              <div key={key} className="flex items-center gap-2 text-white/50 text-sm">
                <CheckCircle size={14} className="text-[#007AFF] shrink-0" />
                {t(key)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14 lg:py-18">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

          {/* Brand column */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-4 flex flex-col gap-6"
          >
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <div className="w-10 h-10 bg-[#007AFF] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(0,122,255,0.35)]">
                <span className="font-black text-white text-sm tracking-wider">HF</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-bold text-white text-[15px] tracking-tight">HeavyForce</span>
                <span className="text-[9px] text-white/40 tracking-[0.18em] uppercase font-medium mt-0.5">Mongolia</span>
              </div>
            </Link>

            <p className="text-white/50 text-sm leading-relaxed max-w-[260px]">{t("footerBrandDesc")}</p>

            <div className="flex flex-col gap-2.5">
              {[
                { icon: Phone, value: "+976 8588-0999", href: "tel:+97685880999" },
                { icon: Mail, value: "sales@heavyforce.mn", href: "mailto:sales@heavyforce.mn" },
                { icon: MapPin, value: "Ulaanbaatar, Mongolia", href: "#" },
              ].map(({ icon: Icon, value, href }) => (
                <a key={value} href={href} className="flex items-center gap-2.5 text-white/50 text-sm hover:text-white transition-colors group">
                  <Icon size={13} className="text-[#007AFF] shrink-0 group-hover:text-[#0066D6] transition-colors" />
                  {value}
                </a>
              ))}
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {brands.map((brand) => (
                <span key={brand} className="text-[10px] font-medium border border-white/[0.08] text-white/35 px-2.5 py-1.5 rounded-lg hover:border-[#007AFF]/30 hover:text-white/60 transition-all cursor-default">
                  {brand}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Products links */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="lg:col-span-3"
          >
            <p className="text-[10px] font-semibold text-white/30 tracking-[0.18em] uppercase mb-5">{t("footerProductsTitle")}</p>
            <ul className="flex flex-col gap-3">
              {productLinks.map((link) => (
                <li key={link.labelKey}>
                  <Link href={link.href} className="text-white/55 text-sm hover:text-white transition-colors flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-white/20 group-hover:bg-[#007AFF] transition-colors shrink-0" />
                    {t(link.labelKey)}
                    <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-60 transition-opacity ml-auto" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company links */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.13 }}
            className="lg:col-span-2"
          >
            <p className="text-[10px] font-semibold text-white/30 tracking-[0.18em] uppercase mb-5">{t("footerCompanyTitle")}</p>
            <ul className="flex flex-col gap-3">
              {companyLinks.map((link) => (
                <li key={link.labelKey}>
                  <a href={link.href} className="text-white/55 text-sm hover:text-white transition-colors flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-white/20 group-hover:bg-[#007AFF] transition-colors shrink-0" />
                    {t(link.labelKey)}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.18 }}
            className="lg:col-span-3"
          >
            <p className="text-[10px] font-semibold text-white/30 tracking-[0.18em] uppercase mb-5">{t("footerNewsletterTitle")}</p>
            <p className="text-white/50 text-sm leading-relaxed mb-4">{t("footerNewsletterDesc")}</p>

            {submitted ? (
              <div className="flex items-center gap-2 text-sm text-[#007AFF] font-medium">
                <CheckCircle size={15} />
                {t("footerSubscribed")}
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); if (email) setSubmitted(true) }} className="flex flex-col gap-2">
                <input
                  type="email"
                  required
                  placeholder={t("footerEmailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#007AFF]/50 focus:bg-white/[0.07] transition-all"
                />
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 bg-white/[0.06] border border-white/10 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-[#007AFF] hover:border-[#007AFF] transition-all duration-200"
                >
                  {t("footerSubscribe")}
                  <ArrowRight size={13} />
                </button>
              </form>
            )}

            <div className="mt-6 p-3.5 rounded-xl border border-white/[0.07] bg-white/[0.02]">
              <p className="text-[10px] text-white/30 font-semibold tracking-widest uppercase mb-2.5">{t("footerOfficeHours")}</p>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-xs">
                  <span className="text-white/50">{t("footerMonFri")}</span>
                  <span className="text-white/80 font-medium">09:00 – 18:00</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/50">{t("footerSaturday")}</span>
                  <span className="text-white/80 font-medium">10:00 – 15:00</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/50">{t("footerSunday")}</span>
                  <span className="text-white/40 font-medium">{t("footerSundayClosed")}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-white/[0.07] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">{t("footerCopyright")}</p>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white/30 text-xs ml-1">{t("footerSystemStatus")}</span>
          </div>
          <div className="flex gap-5">
            {(["footerPrivacy", "footerTerms", "footerCookies"] as const).map((key) => (
              <a key={key} href="#" className="text-white/30 text-xs hover:text-white/60 transition-colors">{t(key)}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
