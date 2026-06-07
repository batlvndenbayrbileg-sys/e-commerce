"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type Lang = "en" | "mn"

const translations = {
  en: {
    // ── Announcement bar ──
    announcementText: "Free on-site demo available —",
    announcementCall: "Call +976 8588-0999",
    announcementSchedule: "to schedule",

    // ── Navbar ──
    navProducts: "Products",
    navServices: "Services",
    navAbout: "About",
    navContact: "Contact",
    navBrowseCategory: "Browse by Category",
    navCatExcavator: "Excavators",
    navCatExcavatorDesc: "4 models available",
    navCatBulldozer: "Bulldozers",
    navCatBulldozerDesc: "3 models available",
    navCatLoader: "Wheel Loaders",
    navCatLoaderDesc: "3 models available",
    navCatTruck: "Dump Trucks",
    navCatTruckDesc: "3 models available",
    navViewAll: "View All 50+ Machines",
    navCatalog: "Catalog",
    navCallBtn: "Call 8588-0999",
    navViewCatalog: "View Full Catalog",

    // ── Hero ──
    heroEyebrow: "Est. 2009 — Mongolia",
    heroLine1: "Premium Heavy",
    heroLine2: "Equipment for",
    heroLine3: "Extreme Conditions",
    heroDesc: "Mongolia's trusted supplier of industrial machinery. From mining excavators to construction equipment — engineered for performance.",
    heroExploreCatalog: "Explore Catalog",
    heroWatchVideo: "Watch Video",
    heroAuthorizedDealer: "Authorized dealer for",
    heroFeatured: "Featured",
    heroPower: "Power",
    heroWeight: "Weight",
    heroScrollIndicator: "Scroll",

    // ── Product Preview ──
    previewEyebrow: "Featured Equipment",
    previewHeading: "Premium machinery built for performance",
    previewViewAll: "View all 50 products",
    previewViewDetails: "View Details",
    previewBrandCategory: (brand: string, cat: string) => `${brand} · ${cat}`,
    previewStartingFrom: "Starting from",
    previewLoadMore: "Load More Equipment",
    previewShowing: "Showing 6 of 50 products",
    badgeNew: "New",
    badgeBestSeller: "Best Seller",

    // ── Features ──
    featuresEyebrow: "Why HeavyForce",
    featuresHeading: "Trusted by Mongolia's largest mining and construction projects",
    featOemTitle: "OEM Certified",
    featOemDesc: "Every machine is certified by the original manufacturer with full documentation and warranty.",
    featDeliveryTitle: "Nationwide Delivery",
    featDeliveryDesc: "Logistics network covering all 21 aimags of Mongolia.",
    featSupportTitle: "24/7 Support",
    featSupportDesc: "Round-the-clock technical assistance and emergency service.",
    featServiceTitle: "Service Centers",
    featServiceDesc: "State-of-the-art workshops with factory-trained engineers for maintenance and repair.",
    featFastTitle: "Fast Delivery",
    featFastDesc: "Average lead time of 4–8 weeks from global depots.",
    featExperienceTitle: "15+ Years",
    featExperienceDesc: "Serving Mongolia's mining and construction industries.",
    featCertBadge: "ISO 9001:2015 Certified",

    // ── Stats ──
    statsEyebrow: "Our Impact",
    statsHeading: "Numbers that speak for themselves",
    statUnitsLabel: "Units Delivered",
    statUnitsSub: "Machines across Mongolia",
    statYearsLabel: "Years Experience",
    statYearsSub: "Since 2009",
    statCentersLabel: "Service Centers",
    statCentersSub: "Nationwide coverage",
    statRetentionLabel: "Client Retention",
    statRetentionSub: "Industry-leading",
    statsCtaHeading: "Ready to power your next project?",
    statsCtaDesc: "Join over 500 Mongolian companies trusting HeavyForce machinery.",
    statsBrowseCatalog: "Browse Catalog",
    statsContactUs: "Contact Us",

    // ── Footer ──
    footerCtaEyebrow: "Ready to Upgrade Your Fleet?",
    footerCtaHeading1: "Get a personalized",
    footerCtaHeading2: "equipment quote",
    footerCtaHeading3: "today.",
    footerCtaDesc: "Our specialists respond within 2 hours with pricing, financing options, and availability for your exact requirements.",
    footerCallBtn: "Call 8588-0999",
    footerEmailBtn: "Email Sales Team",
    footerTrust1: "2-hour response guarantee",
    footerTrust2: "Free on-site demonstration",
    footerTrust3: "0% financing available",
    footerTrust4: "Nationwide delivery",
    footerBrandDesc: "Mongolia's premier supplier of premium industrial machinery since 2009. Engineered for extreme conditions.",
    footerProductsTitle: "Products",
    footerCompanyTitle: "Company",
    footerNewsletterTitle: "Newsletter",
    footerNewsletterDesc: "Get new arrivals, price updates and industry news.",
    footerEmailPlaceholder: "your@email.com",
    footerSubscribe: "Subscribe",
    footerSubscribed: "Subscribed — thank you!",
    footerOfficeHours: "Office Hours",
    footerMonFri: "Mon – Fri",
    footerSaturday: "Saturday",
    footerSunday: "Sunday",
    footerSundayClosed: "Closed",
    footerCopyright: "© 2026 HeavyForce Mongolia LLC. All rights reserved.",
    footerSystemStatus: "All systems operational",
    footerPrivacy: "Privacy Policy",
    footerTerms: "Terms of Use",
    footerCookies: "Cookies",
    footerAboutUs: "About Us",
    footerServices: "Services",
    footerAfterSales: "After-Sales Support",
    footerSpareParts: "Spare Parts",
    footerContact: "Contact",
    footerAllEquipment: "All Equipment",
    footerExcavators: "Excavators",
    footerBulldozers: "Bulldozers",
    footerWheelLoaders: "Wheel Loaders",
    footerDumpTrucks: "Dump Trucks",
    footerCranes: "Cranes",

    // ── FAQ Widget ──
    faqTitle: "Frequently Asked Questions",
    faqSubtitle: "We're here to help",
    faqContactPrompt: "Have another question? Contact us directly.",
    faqCallBtn: "8588-0999",
    faq1Q: "How long does delivery take?",
    faq1A: "Machines are delivered to Mongolia within 30–60 days of order placement. Expedited delivery in 14–21 days is available for urgent orders.",
    faq2Q: "What is the warranty period?",
    faq2A: "All machines come with a 12-month warranty. An additional 12-month extended warranty is available.",
    faq3Q: "How do I obtain spare parts?",
    faq3A: "We stock parts for all models. Parts can be picked up directly from our branches in Ulaanbaatar and Darkhan.",
    faq4Q: "Where can I get service?",
    faq4A: "We have 8 service centers across Mongolia, plus a mobile service team that can perform on-site repairs.",
    faq5Q: "Is financing available?",
    faq5A: "Yes, we partner with banks to offer 12–60 month financing. Down payments start from 20%.",
    faq6Q: "Is a trade-in possible?",
    faq6A: "Yes, we have a trade-in program where the value of your old machine is deducted from the price of the new one.",
    faq7Q: "Do you offer operator training?",
    faq7A: "Free operator training (3–5 days) is included with every new machine purchase.",
    faq8Q: "Which brands are available?",
    faq8A: "We are authorized dealers for Caterpillar, Komatsu, SANY, Shantui, Liebherr, Volvo and BELAZ.",

    // ── Products Page ──
    productsPageTitle: "Our Equipment Catalog",
    productsPageSubtitle: "50 machines across 8 categories",
    productsSearchPlaceholder: "Search machines...",
    productsCatAll: "All Equipment",
    productsViewSpecs: "View Specs",
    productsNoResults: "No products match your search.",
    productsTryClearSearch: "Try clearing the search or selecting a different category.",
    productsClearSearch: "Clear Search",

    // ── Product Modal ──
    modalTechSpecs: "TECHNICAL SPECIFICATIONS",
    modalOrder: "ORDER",
    modalBrochure: "BROCHURE",
  },

  mn: {
    // ── Announcement bar ──
    announcementText: "Үнэгүй газар дээрх үзүүлэлт боломжтой —",
    announcementCall: "+976 8588-0999 руу залгах",
    announcementSchedule: "цаг товлохын тулд",

    // ── Navbar ──
    navProducts: "Бүтээгдэхүүн",
    navServices: "Үйлчилгээ",
    navAbout: "Бидний тухай",
    navContact: "Холбоо барих",
    navBrowseCategory: "Ангиллаар харах",
    navCatExcavator: "Экскаватор",
    navCatExcavatorDesc: "4 загвар байна",
    navCatBulldozer: "Бульдозер",
    navCatBulldozerDesc: "3 загвар байна",
    navCatLoader: "Колёст ачигч",
    navCatLoaderDesc: "3 загвар байна",
    navCatTruck: "Самосвал",
    navCatTruckDesc: "3 загвар байна",
    navViewAll: "50+ Машиныг харах",
    navCatalog: "Каталог",
    navCallBtn: "8588-0999 руу залгах",
    navViewCatalog: "Бүтэн каталог харах",

    // ── Hero ──
    heroEyebrow: "2009 оноос — Монгол",
    heroLine1: "Хүнд Техникийн",
    heroLine2: "Дээд Зэрэглэлийн",
    heroLine3: "Шийдэл",
    heroDesc: "Монголын итгэмжит аж үйлдвэрийн техник нийлүүлэгч. Уурхайн экскаваторыг барилгын техниктэй хослуулан — гүйцэтгэлд зориулан бүтээгдсэн.",
    heroExploreCatalog: "Каталог үзэх",
    heroWatchVideo: "Видео үзэх",
    heroAuthorizedDealer: "Албан ёсны дилер",
    heroFeatured: "Онцлох",
    heroPower: "Хүч",
    heroWeight: "Жин",
    heroScrollIndicator: "Гүйлгэх",

    // ── Product Preview ──
    previewEyebrow: "Онцлох Тоног Төхөөрөмж",
    previewHeading: "Гүйцэтгэлд зориулан бүтээгдсэн дээд зэрэглэлийн техник",
    previewViewAll: "50 бүтээгдэхүүн бүгдийг харах",
    previewViewDetails: "Дэлгэрэнгүй харах",
    previewBrandCategory: (brand: string, cat: string) => `${brand} · ${cat}`,
    previewStartingFrom: "Үнэ",
    previewLoadMore: "Бүгдийг үзэх",
    previewShowing: "6 / 50 бүтээгдэхүүн харагдаж байна",
    badgeNew: "Шинэ",
    badgeBestSeller: "Хамгийн их зарагддаг",

    // ── Features ──
    featuresEyebrow: "Яагаад HeavyForce",
    featuresHeading: "Монголын томоохон уурхайн болон барилгын төслүүдийн итгэмжит нийлүүлэгч",
    featOemTitle: "OEM Баталгаажсан",
    featOemDesc: "Бүх техник нь бүрэн баримт бичиг, баталгаатайгаар анхны үйлдвэрлэгчээр баталгаажсан.",
    featDeliveryTitle: "Улс даяар хүргэлт",
    featDeliveryDesc: "Монголын 21 аймгийг хамарсан логистикийн сүлжээ.",
    featSupportTitle: "24/7 Дэмжлэг",
    featSupportDesc: "Цагийн аль ч үед техникийн тусламж болон яаралтай үйлчилгээ.",
    featServiceTitle: "Засварын Төвүүд",
    featServiceDesc: "Засвар үйлчилгээний тэргүүлэх цехүүд болон үйлдвэрийн сургагдсан инженерүүд.",
    featFastTitle: "Хурдан Хүргэлт",
    featFastDesc: "Дэлхийн агуулахаас дундажаар 4–8 долоо хоногт хүргэнэ.",
    featExperienceTitle: "15+ Жил",
    featExperienceDesc: "Монголын уурхай, барилгын салбарт үйлчилж байна.",
    featCertBadge: "ISO 9001:2015 Баталгаажсан",

    // ── Stats ──
    statsEyebrow: "Манай үр дүн",
    statsHeading: "Тоо баримт өөрөө ярьж байна",
    statUnitsLabel: "Хүргэсэн техник",
    statUnitsSub: "Монгол даяар машин",
    statYearsLabel: "Жилийн туршлага",
    statYearsSub: "2009 оноос хойш",
    statCentersLabel: "Засварын Төв",
    statCentersSub: "Улс даяар хамрах",
    statRetentionLabel: "Үйлчлүүлэгч хадгалалт",
    statRetentionSub: "Салбарын тэргүүлэгч",
    statsCtaHeading: "Дараагийн төсөлдөө бэлэн үү?",
    statsCtaDesc: "HeavyForce машинд итгэж буй 500 гаруй Монголын компанид нэгдэнэ үү.",
    statsBrowseCatalog: "Каталог харах",
    statsContactUs: "Бидэнтэй холбогдох",

    // ── Footer ──
    footerCtaEyebrow: "Парк шинэчлэхэд бэлэн үү?",
    footerCtaHeading1: "Өөрт тохирсон",
    footerCtaHeading2: "үнийн санал",
    footerCtaHeading3: "авах.",
    footerCtaDesc: "Манай мэргэжилтнүүд таны тодорхой шаардлагад нийцсэн үнэ, санхүүжилт, бэлэн байдлыг 2 цагийн дотор мэдэгдэнэ.",
    footerCallBtn: "8588-0999 руу залгах",
    footerEmailBtn: "Борлуулалтад имэйл",
    footerTrust1: "2 цагийн хариу баталгаа",
    footerTrust2: "Үнэгүй газар дээрх үзүүлэлт",
    footerTrust3: "0% санхүүжилт боломжтой",
    footerTrust4: "Улс даяар хүргэлт",
    footerBrandDesc: "2009 оноос Монголын дээд зэрэглэлийн аж үйлдвэрийн техникийн тэргүүлэгч нийлүүлэгч.",
    footerProductsTitle: "Бүтээгдэхүүн",
    footerCompanyTitle: "Компани",
    footerNewsletterTitle: "Мэдээлэл",
    footerNewsletterDesc: "Шинэ ирцүүд, үнийн шинэчлэл болон салбарын мэдээ авах.",
    footerEmailPlaceholder: "таны@имэйл.мн",
    footerSubscribe: "Бүртгүүлэх",
    footerSubscribed: "Бүртгэгдлээ — баярлалаа!",
    footerOfficeHours: "Ажлын цаг",
    footerMonFri: "Да – Ба",
    footerSaturday: "Бямба",
    footerSunday: "Ням",
    footerSundayClosed: "Амарна",
    footerCopyright: "© 2026 HeavyForce Mongolia ХХК. Бүх эрх хуулиар хамгаалагдсан.",
    footerSystemStatus: "Бүх систем ажиллаж байна",
    footerPrivacy: "Нууцлалын бодлого",
    footerTerms: "Үйлчилгээний нөхцөл",
    footerCookies: "Күүки",
    footerAboutUs: "Бидний тухай",
    footerServices: "Үйлчилгээ",
    footerAfterSales: "Борлуулалтын дараах",
    footerSpareParts: "Сэлбэг хэрэгсэл",
    footerContact: "Холбоо барих",
    footerAllEquipment: "Бүх Техник",
    footerExcavators: "Экскаватор",
    footerBulldozers: "Бульдозер",
    footerWheelLoaders: "Колёст Ачигч",
    footerDumpTrucks: "Самосвал",
    footerCranes: "Кран",

    // ── FAQ Widget ──
    faqTitle: "Түгээмэл Асуултууд",
    faqSubtitle: "Таны асуултад хариулъя",
    faqContactPrompt: "Өөр асуулт байвал бидэнтэй холбогдоорой",
    faqCallBtn: "8588-0999",
    faq1Q: "Техник хэр хугацаанд ирэх вэ?",
    faq1A: "Захиалга өгснөөс хойш 30–60 хоногийн дотор Монгол руу хүргэнэ. Яаралтай захиалгын хувьд 14–21 хоногт хүргэх боломжтой.",
    faq2Q: "Баталгаат хугацаа хэд вэ?",
    faq2A: "Бүх техник 12 сарын баталгаат хугацаатай. Нэмэлт 12 сарын сунгах баталгаа авах боломжтой.",
    faq3Q: "Сэлбэг хэрхэн авах вэ?",
    faq3A: "Бид бүх загварт тохирох сэлбэгийг нөөцөлсөн байдаг. Улаанбаатар болон Дархан дахь салбаруудаас шууд авч болно.",
    faq4Q: "Засвар үйлчилгээ хаана хийлгэх вэ?",
    faq4A: "Монгол даяар 8 засварын төв байрладаг. Мөн газар дээр нь засвар хийх гар утасны баг ажилладаг.",
    faq5Q: "Зээлээр авч болох уу?",
    faq5A: "Тийм, бид банкуудтай хамтран ажиллаж 12–60 сарын хугацаатай зээлийн санхүүжилт олгодог. Урьдчилгаа 20%-аас эхэлнэ.",
    faq6Q: "Хуучин техник солилцох боломжтой юу?",
    faq6A: "Тийм, бид хуучин техникийг шинэ техникийн үнийн дүнгээс хасч тооцдог Trade-in програмтай.",
    faq7Q: "Оператор сургалт хийдэг үү?",
    faq7A: "Бүх шинэ техникийн хамт үнэгүй оператор сургалт өгдөг. Сургалт 3–5 хоног үргэлжилнэ.",
    faq8Q: "Ямар брэндүүд байдаг вэ?",
    faq8A: "Caterpillar, Komatsu, SANY, Shantui, Liebherr, Volvo болон BELAZ зэрэг дэлхийн тэргүүлэх брэндүүдийг албан ёсоор борлуулдаг.",

    // ── Products Page ──
    productsPageTitle: "Бидний Тоног Төхөөрөмжийн Каталог",
    productsPageSubtitle: "8 ангиллаар 50 машин",
    productsSearchPlaceholder: "Машин хайх...",
    productsCatAll: "Бүх Техник",
    productsViewSpecs: "Үзүүлэлт үзэх",
    productsNoResults: "Хайлтад тохирсон бүтээгдэхүүн олдсонгүй.",
    productsTryClearSearch: "Хайлтаа цэвэрлэж эсвэл өөр ангилал сонгоно уу.",
    productsClearSearch: "Хайлт цэвэрлэх",

    // ── Product Modal ──
    modalTechSpecs: "ТЕХНИК ҮЗҮҮЛЭЛТ",
    modalOrder: "ЗАХИАЛАХ",
    modalBrochure: "БРОШУР ТАТАХ",
  },
} as const

type TranslationKey = keyof typeof translations.en

const LanguageContext = createContext<{
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: TranslationKey, ...args: string[]) => string
}>({
  lang: "mn",
  setLang: () => {},
  t: (key) => key,
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("mn")

  function t(key: TranslationKey, ...args: string[]): string {
    const val = translations[lang][key]
    if (typeof val === "function") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (val as (...a: string[]) => string)(...args)
    }
    return val as string
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
