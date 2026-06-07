"use client"

import { useState, useMemo, useRef } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { Gauge, Weight, Search, X, LayoutGrid, Phone, Download, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { useLanguage } from "@/context/language-context"

// ─── Types ────────────────────────────────────────────────────────────────────

type Spec = { label: string; value: string }

type Product = {
  id: number
  name: string
  model: string
  category: string
  brand: string
  power: string
  powerNum: number
  weight: string
  capacity: string
  price: string
  badge?: "New" | "Best Seller"
  image: string
  description: string
  specs: Spec[]
  phone: string
}

// ─── Product Data ──────────────────────────────────────────────────────────────

const PHONE = "+97685880999"

const products: Product[] = [
  // EXCAVATORS (10)
  {
    id: 1, name: "Mining Excavator", model: "CAT 390F", category: "Excavator", brand: "Caterpillar",
    power: "513 HP", powerNum: 513, weight: "90,000 kg", capacity: "5.8 m³",     price: "₮1,240,000",
    badge: "Best Seller", image: "/images/product-excavator.jpg", phone: PHONE,
    description: "Caterpillar 390F mining excavator engineered for large-scale earthmoving and mining operations.",
    specs: [
      { label: "Загвар", value: "CAT 390F" },
      { label: "Хөдөлгүүр", value: "CAT C18 ACERT" },
      { label: "Нэрлэсэн хурд", value: "1800 rpm" },
      { label: "Хүчин чадал", value: "513 м.х.үч" },
      { label: "Гинжний тэв хоорондын зай", value: "2900 мм" },
      { label: "Гинжний улны өргөн", value: "600 мм" },
      { label: "Ажлын жин", value: "90,000 кг" },
      { label: "Хувин багтаамж", value: "5.8 м³" },
      { label: "Өндөр", value: "3950 мм" },
      { label: "Хувин ухах хамгийн гүн", value: "8,840 мм" },
    ],
  },
  {
    id: 2, name: "Hydraulic Excavator", model: "Komatsu PC800", category: "Excavator", brand: "Komatsu",
    power: "479 HP", powerNum: 479, weight: "78,500 kg", capacity: "4.9 m³",     price: "₮980,000",
    image: "/images/product-excavator-2.jpg", phone: PHONE,
    description: "Komatsu PC800 hydraulic excavator with advanced KOMTRAX monitoring and fuel-efficient engine.",
    specs: [
      { label: "Загвар", value: "PC800-8" },
      { label: "Хөдөлгүүр", value: "Komatsu SAA6D170E" },
      { label: "Нэрлэсэн хурд", value: "1800 rpm" },
      { label: "Хүчин чадал", value: "479 м.х.үч" },
      { label: "Гинжний тэв хоорондын зай", value: "2750 мм" },
      { label: "Гинжний улны өргөн", value: "550 мм" },
      { label: "Ажлын жин", value: "78,500 кг" },
      { label: "Хувин багтаамж", value: "4.9 м³" },
      { label: "Өндөр", value: "3820 мм" },
      { label: "Хувин ухах хамгийн гүн", value: "8,310 мм" },
    ],
  },
  {
    id: 3, name: "Ultra-Class Excavator", model: "Liebherr R 9800", category: "Excavator", brand: "Liebherr",
    power: "3,000 HP", powerNum: 3000, weight: "800,000 kg", capacity: "42 m³",     price: "₮8,500,000",
    badge: "New", image: "/images/product-excavator-3.jpg", phone: PHONE,
    description: "Liebherr R 9800 ultra-class mining excavator — the world's largest hydraulic excavator.",
    specs: [
      { label: "Загвар", value: "R 9800" },
      { label: "Хөдөлгүүр", value: "Cummins QSK60" },
      { label: "Нэрлэсэн хурд", value: "1800 rpm" },
      { label: "Хүчин чадал", value: "3,000 м.х.үч" },
      { label: "Гинжний тэв хоорондын зай", value: "5200 мм" },
      { label: "Гинжний улны өргөн", value: "1200 мм" },
      { label: "Ажлын жин", value: "800,000 кг" },
      { label: "Хувин багтаамж", value: "42 м³" },
      { label: "Өндөр", value: "8200 мм" },
      { label: "Хувин ухах хамгийн гүн", value: "14,000 мм" },
    ],
  },
  {
    id: 4, name: "Large Hydraulic Excavator", model: "SANY SY750H", category: "Excavator", brand: "SANY",
    power: "428 HP", powerNum: 428, weight: "71,500 kg", capacity: "4.2 m³",     price: "₮720,000",
    image: "/images/product-excavator-4.jpg", phone: PHONE,
    description: "SANY SY750H large hydraulic excavator with intelligent control system and high efficiency.",
    specs: [
      { label: "Загвар", value: "SY750H" },
      { label: "Хөдөлгүүр", value: "Cummins QSM11" },
      { label: "Нэрлэсэн хурд", value: "1800 rpm" },
      { label: "Хүчин чадал", value: "428 м.х.үч" },
      { label: "Гинжний тэв хоорондын зай", value: "2600 мм" },
      { label: "Гинжний улны өргөн", value: "500 мм" },
      { label: "Ажлын жин", value: "71,500 кг" },
      { label: "Хувин багтаамж", value: "4.2 м³" },
      { label: "Өндөр", value: "3700 мм" },
      { label: "Хувин ухах хамгийн гүн", value: "7,950 мм" },
    ],
  },
  {
    id: 5, name: "Mining Excavator", model: "CAT 374F", category: "Excavator", brand: "Caterpillar",
    power: "374 HP", powerNum: 374, weight: "74,000 kg", capacity: "4.6 m³",     price: "₮870,000",
    image: "/images/product-excavator.jpg", phone: PHONE,
    description: "Caterpillar 374F next-generation excavator delivering performance and fuel efficiency.",
    specs: [
      { label: "Загвар", value: "CAT 374F" },
      { label: "Хөдөлгүүр", value: "CAT C15 ACERT" },
      { label: "Нэрлэсэн хурд", value: "1800 rpm" },
      { label: "Хүчин чадал", value: "374 м.х.үч" },
      { label: "Гинжний тэв хоорондын зай", value: "2650 мм" },
      { label: "Гинжний улны өргөн", value: "550 мм" },
      { label: "Ажлын жин", value: "74,000 кг" },
      { label: "Хувин багтаамж", value: "4.6 м³" },
      { label: "Өндөр", value: "3820 мм" },
      { label: "Хувин ухах хамгийн гүн", value: "8,180 мм" },
    ],
  },
  {
    id: 6, name: "Heavy Excavator", model: "Komatsu PC1250", category: "Excavator", brand: "Komatsu",
    power: "634 HP", powerNum: 634, weight: "117,000 kg", capacity: "7.0 m³",     price: "₮1,450,000",
    badge: "Best Seller", image: "/images/product-excavator-2.jpg", phone: PHONE,
    description: "Komatsu PC1250 ultra-class excavator for high-production surface mining.",
    specs: [
      { label: "Загвар", value: "PC1250-11" },
      { label: "Хөдөлгүүр", value: "Komatsu SSDA12V140" },
      { label: "Нэрлэсэн хурд", value: "1800 rpm" },
      { label: "Хүчин чадал", value: "634 м.х.үч" },
      { label: "Гинжний тэв хоорондын зай", value: "3100 мм" },
      { label: "Гинжний улны өргөн", value: "650 мм" },
      { label: "Ажлын жин", value: "117,000 кг" },
      { label: "Хувин багтаамж", value: "7.0 м³" },
      { label: "Өндөр", value: "4500 мм" },
      { label: "Хувин ухах хамгийн гүн", value: "9,820 мм" },
    ],
  },
  {
    id: 7, name: "Backhoe Excavator", model: "CAT 352", category: "Excavator", brand: "Caterpillar",
    power: "295 HP", powerNum: 295, weight: "52,000 kg", capacity: "3.1 m³",     price: "₮560,000",
    image: "/images/product-excavator-3.jpg", phone: PHONE,
    description: "Caterpillar 352 large excavator with superior digging and lifting performance.",
    specs: [
      { label: "Загвар", value: "CAT 352" },
      { label: "Хөдөлгүүр", value: "CAT C13 ACERT" },
      { label: "Нэрлэсэн хурд", value: "1800 rpm" },
      { label: "Хүчин чадал", value: "295 м.х.үч" },
      { label: "Гинжний тэв хоорондын зай", value: "2490 мм" },
      { label: "Гинжний улны өргөн", value: "500 мм" },
      { label: "Ажлын жин", value: "52,000 кг" },
      { label: "Хувин багтаамж", value: "3.1 м³" },
      { label: "Өндөр", value: "3560 мм" },
      { label: "Хувин ухах хамгийн гүн", value: "7,060 мм" },
    ],
  },
  {
    id: 8, name: "Ultra Mining Excavator", model: "Hitachi EX5500", category: "Excavator", brand: "Hitachi",
    power: "2,013 HP", powerNum: 2013, weight: "533,000 kg", capacity: "29 m³",     price: "₮6,200,000",
    badge: "New", image: "/images/product-excavator-4.jpg", phone: PHONE,
    description: "Hitachi EX5500-6 ultra-large mining excavator for maximum productivity.",
    specs: [
      { label: "Загвар", value: "EX5500-6" },
      { label: "Хөдөлгүүр", value: "Cummins KTTA38-C" },
      { label: "Нэрлэсэн хурд", value: "1800 rpm" },
      { label: "Хүчин чадал", value: "2,013 м.х.үч" },
      { label: "Гинжний тэв хоорондын зай", value: "4700 мм" },
      { label: "Гинжний улны өргөн", value: "1100 мм" },
      { label: "Ажлын жин", value: "533,000 кг" },
      { label: "Хувин багтаамж", value: "29 м³" },
      { label: "Өндөр", value: "7300 мм" },
      { label: "Хувин ухах хамгийн гүн", value: "12,900 мм" },
    ],
  },
  {
    id: 9, name: "Crawler Excavator", model: "Liebherr R 960", category: "Excavator", brand: "Liebherr",
    power: "503 HP", powerNum: 503, weight: "93,000 kg", capacity: "5.5 m³",     price: "₮1,100,000",
    image: "/images/product-excavator.jpg", phone: PHONE,
    description: "Liebherr R 960 crawler excavator with electric-over-hydraulic control for precision.",
    specs: [
      { label: "Загвар", value: "R 960" },
      { label: "Хөдөлгүүр", value: "Liebherr D9508" },
      { label: "Нэрлэсэн хурд", value: "1800 rpm" },
      { label: "Хүчин чадал", value: "503 м.х.үч" },
      { label: "Гинжний тэв хоорондын зай", value: "2900 мм" },
      { label: "Гинжний улны өргөн", value: "600 мм" },
      { label: "Ажлын жин", value: "93,000 кг" },
      { label: "Хувин багтаамж", value: "5.5 м³" },
      { label: "Өндөр", value: "4000 мм" },
      { label: "Хувин ухах хамгийн гүн", value: "8,920 мм" },
    ],
  },
  {
    id: 10, name: "Hydraulic Excavator", model: "SANY SY500H", category: "Excavator", brand: "SANY",
    power: "320 HP", powerNum: 320, weight: "48,000 kg", capacity: "2.8 m³",     price: "₮490,000",
    image: "/images/product-excavator-2.jpg", phone: PHONE,
    description: "SANY SY500H hydraulic excavator with smart control and efficient fuel consumption.",
    specs: [
      { label: "Загвар", value: "SY500H" },
      { label: "Хөдөлгүүр", value: "Cummins QSL9.5" },
      { label: "Нэрлэсэн хурд", value: "1900 rpm" },
      { label: "Хүчин чадал", value: "320 м.х.үч" },
      { label: "Гинжний тэв хоорондын зай", value: "2380 мм" },
      { label: "Гинжний улны өргөн", value: "500 мм" },
      { label: "Ажлын жин", value: "48,000 кг" },
      { label: "Хувин багтаамж", value: "2.8 м³" },
      { label: "Өндөр", value: "3500 мм" },
      { label: "Хувин ухах хамгийн гүн", value: "7,200 мм" },
    ],
  },

  // BULLDOZERS (8)
  {
    id: 11, name: "Track-Type Tractor", model: "CAT D9T", category: "Bulldozer", brand: "Caterpillar",
    power: "410 HP", powerNum: 410, weight: "49,200 kg", capacity: "9.5 m³ Blade",     price: "₮890,000",
    badge: "New", image: "/images/product-bulldozer.jpg", phone: PHONE,
    description: "Caterpillar D9T track-type tractor for heavy dozing, ripping, and push-loading operations.",
    specs: [
      { label: "Загвар", value: "CAT D9T" },
      { label: "Хөдөлгүүр", value: "CAT C18 ACERT" },
      { label: "Нэрлэсэн хурд", value: "1800 rpm" },
      { label: "Хүчин чадал", value: "410 м.х.үч" },
      { label: "Гинжний тэв хоорондын зай", value: "2286 мм" },
      { label: "Гинжний улны өргөн", value: "560 мм" },
      { label: "Ажлын жин", value: "49,200 кг" },
      { label: "Хутганы багтаамж", value: "9.5 м³" },
      { label: "Өндөр", value: "3510 мм" },
      { label: "Хутга өргөх хамгийн дээд өндөр", value: "1270 мм" },
      { label: "Хутганы урт", value: "4356 мм" },
      { label: "Хутганы өндөр", value: "1828 мм" },
    ],
  },
  {
    id: 12, name: "Mining Bulldozer", model: "Komatsu D375A", category: "Bulldozer", brand: "Komatsu",
    power: "525 HP", powerNum: 525, weight: "69,000 kg", capacity: "12.5 m³ Blade",     price: "₮1,050,000",
    badge: "Best Seller", image: "/images/product-bulldozer-2.jpg", phone: PHONE,
    description: "Komatsu D375A-8 mining bulldozer with auto-shift transmission and ecology guidance.",
    specs: [
      { label: "Загвар", value: "D375A-8" },
      { label: "Хөдөлгүүр", value: "Komatsu SAA6D170E" },
      { label: "Нэрлэсэн хурд", value: "1800 rpm" },
      { label: "Хүчин чадал", value: "525 м.х.үч" },
      { label: "Гинжний тэв хоорондын зай", value: "2690 мм" },
      { label: "Гинжний улны өргөн", value: "710 мм" },
      { label: "Ажлын жин", value: "69,000 кг" },
      { label: "Хутганы багтаамж", value: "12.5 м³" },
      { label: "Өндөр", value: "4220 мм" },
      { label: "Хутга өргөх хамгийн дээд өндөр", value: "1480 мм" },
      { label: "Хутганы урт", value: "5180 мм" },
      { label: "Хутганы өндөр", value: "2175 мм" },
    ],
  },
  {
    id: 13, name: "Large Track Dozer", model: "Liebherr PR 776", category: "Bulldozer", brand: "Liebherr",
    power: "570 HP", powerNum: 570, weight: "73,000 kg", capacity: "13.0 m³ Blade",     price: "₮1,180,000",
    image: "/images/product-bulldozer-3.jpg", phone: PHONE,
    description: "Liebherr PR 776 hydrostatic drive dozer with automatic traction control system.",
    specs: [
      { label: "Загвар", value: "PR 776" },
      { label: "Хөдөлгүүр", value: "Liebherr D9512" },
      { label: "Нэрлэсэн хурд", value: "1800 rpm" },
      { label: "Хүчин чадал", value: "570 м.х.үч" },
      { label: "Гинжний тэв хоорондын зай", value: "2800 мм" },
      { label: "Гинжний ул��ы өргөн", value: "750 мм" },
      { label: "����жлын жин", value: "73,000 кг" },
      { label: "Хутганы багтаамж", value: "13.0 м³" },
      { label: "Өндөр", value: "4300 мм" },
      { label: "Хутга өргөх хамгийн дээд өндөр", value: "1530 мм" },
      { label: "Хутганы урт", value: "5300 мм" },
      { label: "Хутганы өндөр", value: "2280 мм" },
    ],
  },
  {
    id: 14, name: "Track-Type Tractor", model: "CAT D10T2", category: "Bulldozer", brand: "Caterpillar",
    power: "580 HP", powerNum: 580, weight: "73,400 kg", capacity: "15.3 m³ Blade",     price: "₮1,350,000",
    badge: "New", image: "/images/product-bulldozer.jpg", phone: PHONE,
    description: "Caterpillar D10T2 track-type tractor with elevated sprocket design and ACERT technology.",
    specs: [
      { label: "Загвар", value: "CAT D10T2" },
      { label: "Хөдөлгүүр", value: "CAT C27 ACERT" },
      { label: "Нэрлэсэн хурд", value: "1800 rpm" },
      { label: "Хүчин чадал", value: "580 м.х.үч" },
      { label: "Гинжний тэв хоорондын зай", value: "2870 мм" },
      { label: "Гинжний улны өргөн", value: "635 мм" },
      { label: "Ажлын жин", value: "73,400 кг" },
      { label: "Хутганы багтаамж", value: "15.3 м³" },
      { label: "Өндөр", value: "4325 мм" },
      { label: "Хутга өргөх хамгийн дээд өндөр", value: "1545 мм" },
      { label: "Хутганы урт", value: "5320 мм" },
      { label: "Хутганы өндөр", value: "2290 мм" },
    ],
  },
  {
    id: 15, name: "Electric Drive Dozer", model: "Komatsu D475A", category: "Bulldozer", brand: "Komatsu",
    power: "890 HP", powerNum: 890, weight: "107,000 kg", capacity: "26.2 m³ Blade",     price: "₮2,100,000",
    image: "/images/product-bulldozer-2.jpg", phone: PHONE,
    description: "Komatsu D475A-8 the world's most powerful production dozer with electric drive.",
    specs: [
      { label: "Загвар", value: "D475A-8" },
      { label: "Хөдөлгүүр", value: "Komatsu SSDA16V160" },
      { label: "Нэрлэсэн хурд", value: "1800 rpm" },
      { label: "Хүчин чадал", value: "890 м.х.үч" },
      { label: "Гинжний тэв хоорондын зай", value: "3100 мм" },
      { label: "Гинжний улны өргөн", value: "915 мм" },
      { label: "Ажлын жин", value: "107,000 кг" },
      { label: "Хутганы багтаамж", value: "26.2 м³" },
      { label: "Өндөр", value: "5100 мм" },
      { label: "Хутга өргөх хамгийн дээд өндөр", value: "1950 мм" },
      { label: "Хутганы урт", value: "6400 мм" },
      { label: "Хутганы өндөр", value: "2815 мм" },
    ],
  },
  {
    id: 16, name: "Ultra Dozer", model: "CAT D11T", category: "Bulldozer", brand: "Caterpillar",
    power: "850 HP", powerNum: 850, weight: "104,000 kg", capacity: "24.4 m³ Blade",     price: "₮2,050,000",
    badge: "Best Seller", image: "/images/product-bulldozer-3.jpg", phone: PHONE,
    description: "Caterpillar D11T ultra dozer — industry benchmark for production dozing.",
    specs: [
      { label: "Загвар", value: "CAT D11T" },
      { label: "Хөдөлгүүр", value: "CAT C32 ACERT" },
      { label: "Нэрлэсэн хурд", value: "1800 rpm" },
      { label: "Хүчин чадал", value: "850 м.х.үч" },
      { label: "Гинжний тэв хоорондын зай", value: "3049 мм" },
      { label: "Гинжний улны өргөн", value: "910 мм" },
      { label: "Ажлын жин", value: "104,000 кг" },
      { label: "Хутганы багтаамж", value: "24.4 м³" },
      { label: "Өндөр", value: "5000 мм" },
      { label: "Хутга өргөх хамгийн дээд өндөр", value: "1900 мм" },
      { label: "Хутганы урт", value: "6360 мм" },
      { label: "Хутганы өндөр", value: "2775 мм" },
    ],
  },
  {
    id: 17, name: "Track Bulldozer", model: "SHANTUI SD52-5", category: "Bulldozer", brand: "SHANTUI",
    power: "520 HP", powerNum: 520, weight: "58,000 kg", capacity: "11.2 m³ Blade",     price: "₮740,000",
    image: "/images/product-bulldozer.jpg", phone: PHONE,
    description: "SHANTUI SD52-5 heavy bulldozer with Cummins engine and high push efficiency.",
    specs: [
      { label: "Загвар", value: "SD52-5" },
      { label: "Хөдөлгүүр", value: "Cummins QSK19" },
      { label: "Нэрлэсэн хурд", value: "1900 rpm" },
      { label: "Хүчин чадал", value: "520 м.х.үч" },
      { label: "Гинжний тэв хоорондын зай", value: "2600 мм" },
      { label: "Гинжний улны өргөн", value: "660 мм" },
      { label: "Ажлын жин", value: "58,000 кг" },
      { label: "Хутганы багтаамж", value: "11.2 м³" },
      { label: "Өндөр", value: "3920 мм" },
      { label: "Хутга өргөх хамгийн дээд өндөр", value: "1340 мм" },
      { label: "Хутганы урт", value: "4930 мм" },
      { label: "Хутганы өндөр", value: "2040 мм" },
    ],
  },
  {
    id: 18, name: "Mining Track Dozer", model: "Liebherr PR 736", category: "Bulldozer", brand: "Liebherr",
    power: "260 HP", powerNum: 260, weight: "30,000 kg", capacity: "7.4 m³ Blade",     price: "₮590,000",
    image: "/images/product-bulldozer-2.jpg", phone: PHONE,
    description: "Liebherr PR 736 litronic dozer with hydrostatic drive and comfortable cab.",
    specs: [
      { label: "Загвар", value: "PR 736" },
      { label: "Хөдөлгүүр", value: "Liebherr D7508" },
      { label: "Нэрлэсэн хурд", value: "1900 rpm" },
      { label: "Хүчин чадал", value: "260 м.х.үч" },
      { label: "Гинжний тэв хоорондын зай", value: "2100 мм" },
      { label: "Гинжний улны өргөн", value: "560 мм" },
      { label: "Ажлын жин", value: "30,000 кг" },
      { label: "Хутганы багтаамж", value: "7.4 м³" },
      { label: "Өндөр", value: "3200 мм" },
      { label: "Хутга өргөх хамгийн дээд өндөр", value: "1050 мм" },
      { label: "Хутганы урт", value: "3950 мм" },
      { label: "Хутганы өндөр", value: "1690 мм" },
    ],
  },

  // WHEEL LOADERS (7)
  {
    id: 19, name: "Wheel Loader", model: "Komatsu WA600", category: "Wheel Loader", brand: "Komatsu",
    power: "390 HP", powerNum: 390, weight: "40,800 kg", capacity: "5.5 m³",     price: "₮640,000",
    image: "/images/product-loader.jpg", phone: PHONE,
    description: "Komatsu WA600-8 wheel loader with advanced traction control and productivity monitoring.",
    specs: [
      { label: "Загвар", value: "WA600-8" },
      { label: "Хөдөлгүүр", value: "Komatsu SAA6D140E" },
      { label: "Нэрлэсэн хурд", value: "2000 rpm" },
      { label: "Хүчин чадал", value: "390 м.х.үч" },
      { label: "Ажлын жин", value: "40,800 кг" },
      { label: "Хувин багтаамж", value: "5.5 м³" },
      { label: "Нийт урт", value: "11,720 мм" },
      { label: "Өндөр", value: "4000 мм" },
      { label: "Асаргааны хурд", value: "36 км/цаг" },
      { label: "Буулгах өндөр", value: "3530 мм" },
    ],
  },
  {
    id: 20, name: "Large Wheel Loader", model: "CAT 994K", category: "Wheel Loader", brand: "Caterpillar",
    power: "1,453 HP", powerNum: 1453, weight: "202,000 kg", capacity: "23.4 m³",     price: "₮4,200,000",
    badge: "New", image: "/images/product-loader-2.jpg", phone: PHONE,
    description: "Caterpillar 994K large mining wheel loader — maximum productivity in tough conditions.",
    specs: [
      { label: "Загвар", value: "CAT 994K" },
      { label: "Хөдөлгүүр", value: "CAT C175-16 ACERT" },
      { label: "Нэрлэсэн хурд", value: "1800 rpm" },
      { label: "Хүчин чадал", value: "1,453 м.х.үч" },
      { label: "Ажлын жин", value: "202,000 кг" },
      { label: "Хувин багтаамж", value: "23.4 м³" },
      { label: "Нийт урт", value: "18,830 мм" },
      { label: "Өндөр", value: "7470 мм" },
      { label: "Асаргааны хурд", value: "18 км/цаг" },
      { label: "Буулгах өндөр", value: "6200 мм" },
    ],
  },
  {
    id: 21, name: "Mining Wheel Loader", model: "SANY SW405K", category: "Wheel Loader", brand: "SANY",
    power: "350 HP", powerNum: 350, weight: "35,800 kg", capacity: "4.8 m³",     price: "₮510,000",
    image: "/images/product-loader-3.jpg", phone: PHONE,
    description: "SANY SW405K high-efficiency wheel loader with electronic joystick steering.",
    specs: [
      { label: "Загвар", value: "SW405K" },
      { label: "Хөдөлгүүр", value: "Cummins QSM11" },
      { label: "Нэрлэсэн хурд", value: "2100 rpm" },
      { label: "Хүчин чадал", value: "350 м.х.үч" },
      { label: "Ажлын жин", value: "35,800 кг" },
      { label: "Хувин багтаамж", value: "4.8 м³" },
      { label: "Нийт урт", value: "10,950 мм" },
      { label: "Өндөр", value: "3760 мм" },
      { label: "Асаргааны хурд", value: "38 км/цаг" },
      { label: "Буулгах өндөр", value: "3380 мм" },
    ],
  },
  {
    id: 22, name: "Wheel Loader", model: "Liebherr L 586", category: "Wheel Loader", brand: "Liebherr",
    power: "394 HP", powerNum: 394, weight: "37,200 kg", capacity: "5.0 m³",     price: "₮680,000",
    badge: "Best Seller", image: "/images/product-loader.jpg", phone: PHONE,
    description: "Liebherr L 586 XPower wheel loader with power-split hydrostatic-mechanical driveline.",
    specs: [
      { label: "Загвар", value: "L 586 XPower" },
      { label: "Хөдөлгүүр", value: "Liebherr D9508" },
      { label: "Нэрлэсэн хурд", value: "1800 rpm" },
      { label: "Хүчин чадал", value: "394 м.х.үч" },
      { label: "Ажлын жин", value: "37,200 кг" },
      { label: "Хувин багтаамж", value: "5.0 м³" },
      { label: "Нийт урт", value: "11,340 мм" },
      { label: "Өндөр", value: "3860 мм" },
      { label: "Асаргааны хурд", value: "40 км/цаг" },
      { label: "Буулгах өндөр", value: "3430 мм" },
    ],
  },
  {
    id: 23, name: "Ultra Wheel Loader", model: "Komatsu WA900", category: "Wheel Loader", brand: "Komatsu",
    power: "760 HP", powerNum: 760, weight: "92,000 kg", capacity: "11.0 m³",     price: "₮1,850,000",
    image: "/images/product-loader-2.jpg", phone: PHONE,
    description: "Komatsu WA900-8 ultra wheel loader for ultra-class production loading.",
    specs: [
      { label: "Загвар", value: "WA900-8" },
      { label: "Хөдөлгүүр", value: "Komatsu SSDA16V160" },
      { label: "Нэрлэсэн хурд", value: "1800 rpm" },
      { label: "Хүчин чадал", value: "760 м.х.үч" },
      { label: "Ажлын жин", value: "92,000 кг" },
      { label: "Хувин багтаамж", value: "11.0 м³" },
      { label: "Нийт урт", value: "16,120 мм" },
      { label: "Өндөр", value: "5700 мм" },
      { label: "Асаргааны хурд", value: "22 км/цаг" },
      { label: "Буулгах өндөр", value: "4700 мм" },
    ],
  },
  {
    id: 24, name: "Compact Wheel Loader", model: "CAT 950 GC", category: "Wheel Loader", brand: "Caterpillar",
    power: "195 HP", powerNum: 195, weight: "16,800 kg", capacity: "2.7 m³",     price: "₮285,000",
    image: "/images/product-loader-3.jpg", phone: PHONE,
    description: "Caterpillar 950 GC compact wheel loader for general construction operations.",
    specs: [
      { label: "Загвар", value: "CAT 950 GC" },
      { label: "Хөдөлгүүр", value: "CAT C7.1 ACERT" },
      { label: "Нэрлэсэн хурд", value: "2200 rpm" },
      { label: "Хүчин чадал", value: "195 м.х.үч" },
      { label: "Ажлын жин", value: "16,800 кг" },
      { label: "Хувин багтаамж", value: "2.7 м³" },
      { label: "Нийт урт", value: "8,860 мм" },
      { label: "Өндөр", value: "3370 мм" },
      { label: "Асаргааны хурд", value: "42 км/цаг" },
      { label: "Буулгах өндөр", value: "2830 мм" },
    ],
  },
  {
    id: 25, name: "Mine Loader", model: "SANY SW988H", category: "Wheel Loader", brand: "SANY",
    power: "520 HP", powerNum: 520, weight: "58,000 kg", capacity: "7.5 m³",     price: "₮980,000",
    image: "/images/product-loader.jpg", phone: PHONE,
    description: "SANY SW988H ultra-large mining wheel loader for high-production surface mining.",
    specs: [
      { label: "Загвар", value: "SW988H" },
      { label: "Хөдөлгүүр", value: "Cummins QSK19" },
      { label: "Нэрлэсэн хурд", value: "1900 rpm" },
      { label: "Хүчин чадал", value: "520 м.х.үч" },
      { label: "Ажлын жин", value: "58,000 кг" },
      { label: "Хувин багтаамж", value: "7.5 м³" },
      { label: "Нийт урт", value: "13,270 мм" },
      { label: "Өндөр", value: "4880 мм" },
      { label: "Асаргааны хурд", value: "30 км/цаг" },
      { label: "Буулгах өндөр", value: "4050 мм" },
    ],
  },

  // DUMP TRUCKS (7)
  {
    id: 26, name: "Mining Dump Truck", model: "CAT 785D", category: "Dump Truck", brand: "Caterpillar",
    power: "1,075 HP", powerNum: 1075, weight: "136,000 kg", capacity: "91T Payload",     price: "₮2,200,000",
    badge: "New", image: "/images/product-dumptruck.jpg", phone: PHONE,
    description: "Caterpillar 785D off-highway mining truck with integrated payload management.",
    specs: [
      { label: "Загвар", value: "CAT 785D" },
      { label: "Хөдөлгүүр", value: "CAT C32 ACERT" },
      { label: "Нэрлэсэн хурд", value: "1800 rpm" },
      { label: "Хүчин чадал", value: "1,075 м.х.үч" },
      { label: "Ажлын жин", value: "136,000 кг" },
      { label: "Ачааны даац", value: "91 тонн" },
      { label: "Ёроолын хэмжээ", value: "10.4 м³" },
      { label: "Нийт урт", value: "12,940 мм" },
      { label: "Нийт өргөн", value: "8,170 мм" },
      { label: "Хурдны хязгаар", value: "54 км/цаг" },
    ],
  },
  {
    id: 27, name: "Electric Drive Truck", model: "Komatsu 930E", category: "Dump Truck", brand: "Komatsu",
    power: "2,700 HP", powerNum: 2700, weight: "240,000 kg", capacity: "181T Payload",     price: "₮5,100,000",
    badge: "Best Seller", image: "/images/product-dumptruck-2.jpg", phone: PHONE,
    description: "Komatsu 930E-5 electric drive mining dump truck with AC drive system.",
    specs: [
      { label: "Загвар", value: "930E-5" },
      { label: "Хөдөлгүүр", value: "Cummins QSK60" },
      { label: "Нэрлэсэн хурд", value: "1900 rpm" },
      { label: "Хүчин чадал", value: "2,700 м.х.үч" },
      { label: "Ажлын жин", value: "240,000 кг" },
      { label: "Ачааны даац", value: "181 тонн" },
      { label: "Ёроолын хэмжээ", value: "17.2 м³" },
      { label: "Нийт урт", value: "14,980 мм" },
      { label: "Нийт өргөн", value: "9,440 мм" },
      { label: "Хурдны хязгаар", value: "64 км/цаг" },
    ],
  },
  {
    id: 28, name: "World's Largest Truck", model: "BELAZ 75710", category: "Dump Truck", brand: "BELAZ",
    power: "4,600 HP", powerNum: 4600, weight: "360,000 kg", capacity: "450T Payload",     price: "₮9,500,000",
    badge: "New", image: "/images/product-dumptruck-3.jpg", phone: PHONE,
    description: "BELAZ 75710 — the world's largest dump truck with 450-tonne payload capacity.",
    specs: [
      { label: "Загвар", value: "BELAZ 75710" },
      { label: "Хөдөлгүүр", value: "MTU 16V4000" },
      { label: "Нэрлэсэн хурд", value: "1800 rpm" },
      { label: "Хүчин чадал", value: "4,600 м.х.үч" },
      { label: "Ажлын жин", value: "360,000 кг" },
      { label: "Ачааны даац", value: "450 тонн" },
      { label: "Ёроолын хэмжээ", value: "22.0 м³" },
      { label: "Нийт урт", value: "20,600 мм" },
      { label: "Нийт өргөн", value: "9,750 мм" },
      { label: "Хурдны хязгаар", value: "64 км/цаг" },
    ],
  },
  {
    id: 29, name: "Rigid Dump Truck", model: "CAT 793F", category: "Dump Truck", brand: "Caterpillar",
    power: "2,337 HP", powerNum: 2337, weight: "275,000 kg", capacity: "205T Payload",     price: "₮4,700,000",
    image: "/images/product-dumptruck.jpg", phone: PHONE,
    description: "Caterpillar 793F ultra-class mining truck with AC electric drive.",
    specs: [
      { label: "Загвар", value: "CAT 793F" },
      { label: "Хөдөлгүүр", value: "CAT C175-16 ACERT" },
      { label: "Нэрлэсэн хурд", value: "1750 rpm" },
      { label: "Хүчин чадал", value: "2,337 м.х.үч" },
      { label: "Ажлын жин", value: "275,000 кг" },
      { label: "Ачааны даац", value: "205 тонн" },
      { label: "Ёроолын хэмжээ", value: "18.5 м³" },
      { label: "Нийт урт", value: "15,800 мм" },
      { label: "Нийт өргөн", value: "9,650 мм" },
      { label: "Хурдны хязгаар", value: "56 км/цаг" },
    ],
  },
  {
    id: 30, name: "Articulated Dump Truck", model: "Volvo A60H", category: "Dump Truck", brand: "Volvo",
    power: "590 HP", powerNum: 590, weight: "66,000 kg", capacity: "55T Payload",     price: "₮750,000",
    image: "/images/product-arttruck.jpg", phone: PHONE,
    description: "Volvo A60H articulated hauler with OptiShift and optimal traction control.",
    specs: [
      { label: "Загвар", value: "A60H" },
      { label: "Хөдөлгүүр", value: "Volvo D16F" },
      { label: "Нэрлэсэн хурд", value: "1800 rpm" },
      { label: "Хүчин чадал", value: "590 м.х.үч" },
      { label: "Ажлын жин", value: "66,000 кг" },
      { label: "Ачааны даац", value: "55 тонн" },
      { label: "Ёроолын хэмжээ", value: "6.6 м³" },
      { label: "Нийт урт", value: "14,500 мм" },
      { label: "Нийт өргөн", value: "4,250 мм" },
      { label: "Хурдны хязгаар", value: "52 км/цаг" },
    ],
  },
  {
    id: 31, name: "Mining Truck", model: "Komatsu HD785", category: "Dump Truck", brand: "Komatsu",
    power: "895 HP", powerNum: 895, weight: "120,000 kg", capacity: "91T Payload",     price: "₮1,900,000",
    image: "/images/product-dumptruck-2.jpg", phone: PHONE,
    description: "Komatsu HD785-8 mining dump truck with KOMTRAX telematics system.",
    specs: [
      { label: "Загвар", value: "HD785-8" },
      { label: "Хөдөлгүүр", value: "Komatsu SSDA16V160" },
      { label: "Нэрлэсэн хурд", value: "1900 rpm" },
      { label: "Хүчин чадал", value: "895 м.х.үч" },
      { label: "Ажлын жин", value: "120,000 кг" },
      { label: "Ачааны даац", value: "91 тонн" },
      { label: "Ёроолын хэмжээ", value: "10.4 м³" },
      { label: "Нийт урт", value: "12,640 мм" },
      { label: "Нийт өргөн", value: "8,120 мм" },
      { label: "Хурдны хязгаар", value: "56 км/цаг" },
    ],
  },
  {
    id: 32, name: "Electric Drive Hauler", model: "CAT 797F", category: "Dump Truck", brand: "Caterpillar",
    power: "4,000 HP", powerNum: 4000, weight: "360,000 kg", capacity: "363T Payload",     price: "₮8,200,000",
    badge: "Best Seller", image: "/images/product-dumptruck-3.jpg", phone: PHONE,
    description: "Caterpillar 797F the world's highest-payload mechanical drive truck.",
    specs: [
      { label: "Загвар", value: "CAT 797F" },
      { label: "Хөдөлгүүр", value: "CAT C175-20 ACERT" },
      { label: "Нэрлэсэн хурд", value: "1750 rpm" },
      { label: "Хүчин чадал", value: "4,000 м.х.үч" },
      { label: "Ажлын жин", value: "360,000 кг" },
      { label: "Ачааны даац", value: "363 тонн" },
      { label: "Ёроолын хэмжээ", value: "22.1 м³" },
      { label: "Нийт урт", value: "21,600 мм" },
      { label: "Нийт өргөн", value: "9,750 мм" },
      { label: "Хурдны хязгаар", value: "68 км/цаг" },
    ],
  },

  // CRANES (5)
  {
    id: 33, name: "All-Terrain Crane", model: "Liebherr LTM 1100", category: "Crane", brand: "Liebherr",
    power: "350 HP", powerNum: 350, weight: "60,000 kg", capacity: "100T Lift",     price: "₮1,800,000",
    badge: "Best Seller", image: "/images/product-crane.jpg", phone: PHONE,
    description: "Liebherr LTM 1100-5.2 all-terrain crane with 60m telescopic boom.",
    specs: [
      { label: "Загвар", value: "LTM 1100-5.2" },
      { label: "Хөдөлгүүр", value: "Liebherr D9508" },
      { label: "Нэрлэсэн хурд", value: "1800 rpm" },
      { label: "Хүчин чадал", value: "350 м.х.үч" },
      { label: "Ажлын жин", value: "60,000 кг" },
      { label: "Өргөх даац", value: "100 тонн" },
      { label: "Стрелын урт", value: "60 м" },
      { label: "Нийт урт", value: "16,040 мм" },
      { label: "Өндөр", value: "3980 мм" },
      { label: "Хурдны хязгаар", value: "85 км/цаг" },
    ],
  },
  {
    id: 34, name: "All-Terrain Crane", model: "Tadano ATF 400G", category: "Crane", brand: "Tadano",
    power: "530 HP", powerNum: 530, weight: "72,000 kg", capacity: "400T Lift",     price: "₮3,400,000",
    image: "/images/product-crane-2.jpg", phone: PHONE,
    description: "Tadano ATF 400G-6 all-terrain crane with PALFINGERWIND intelligent control.",
    specs: [
      { label: "Загвар", value: "ATF 400G-6" },
      { label: "Хөдөлгүүр", value: "Mercedes OM936" },
      { label: "Нэрлэсэн хурд", value: "2200 rpm" },
      { label: "Хүчин чадал", value: "530 м.х.үч" },
      { label: "Ажлын жин", value: "72,000 кг" },
      { label: "Өргөх даац", value: "400 тонн" },
      { label: "Стрелын урт", value: "80 м" },
      { label: "Нийт урт", value: "18,600 мм" },
      { label: "Өндөр", value: "4200 мм" },
      { label: "Хурдны хязгаар", value: "75 км/цаг" },
    ],
  },
  {
    id: 35, name: "Crawler Crane", model: "Manitowoc 18000", category: "Crane", brand: "Manitowoc",
    power: "750 HP", powerNum: 750, weight: "450,000 kg", capacity: "2,000T Lift",     price: "₮12,000,000",
    badge: "New", image: "/images/product-crane-3.jpg", phone: PHONE,
    description: "Manitowoc 18000 crawler crane — designed for the world's most demanding lifts.",
    specs: [
      { label: "Загвар", value: "Manitowoc 18000" },
      { label: "Хөдөлгүүр", value: "Cummins QSK23" },
      { label: "Нэрлэсэн хурд", value: "1800 rpm" },
      { label: "Хүчин чадал", value: "750 м.х.үч" },
      { label: "Ажлын жин", value: "450,000 кг" },
      { label: "Өргөх даац", value: "2,000 тонн" },
      { label: "Стрелын урт", value: "160 м" },
      { label: "Нийт урт (гусениц)", value: "24,000 мм" },
      { label: "Өндөр", value: "6800 мм" },
      { label: "Хурдны хязгаар", value: "1.2 км/цаг" },
    ],
  },
  {
    id: 36, name: "Mobile Crane", model: "Liebherr LTM 1750", category: "Crane", brand: "Liebherr",
    power: "680 HP", powerNum: 680, weight: "96,000 kg", capacity: "750T Lift",     price: "₮6,400,000",
    image: "/images/product-crane.jpg", phone: PHONE,
    description: "Liebherr LTM 1750-9.1 mobile crane with 750-tonne lifting capacity.",
    specs: [
      { label: "Загвар", value: "LTM 1750-9.1" },
      { label: "Хөдөлгүүр", value: "Liebherr D9512" },
      { label: "Нэрлэсэн хурд", value: "1800 rpm" },
      { label: "Хүчин чадал", value: "680 м.х.үч" },
      { label: "Ажлын жин", value: "96,000 кг" },
      { label: "Өргөх даац", value: "750 тонн" },
      { label: "Стрелын урт", value: "88 м" },
      { label: "Нийт урт", value: "21,500 мм" },
      { label: "Өндөр", value: "4300 мм" },
      { label: "Хурдны хязгаар", value: "70 км/цаг" },
    ],
  },
  {
    id: 37, name: "Rough Terrain Crane", model: "Tadano GR-1000XL", category: "Crane", brand: "Tadano",
    power: "295 HP", powerNum: 295, weight: "55,000 kg", capacity: "100T Lift",     price: "₮1,100,000",
    image: "/images/product-crane-2.jpg", phone: PHONE,
    description: "Tadano GR-1000XL rough terrain crane for on-site maneuverability.",
    specs: [
      { label: "Загвар", value: "GR-1000XL" },
      { label: "Хөдөлгүүр", value: "Cummins QSL9" },
      { label: "Нэрлэсэн хурд", value: "2100 rpm" },
      { label: "Хүчин чадал", value: "295 м.х.үч" },
      { label: "Ажлын жин", value: "55,000 кг" },
      { label: "Өргөх даац", value: "100 тонн" },
      { label: "Стрелын урт", value: "51 м" },
      { label: "Нийт урт", value: "14,400 мм" },
      { label: "Өндөр", value: "3780 мм" },
      { label: "Хурдны хязгаар", value: "25 км/цаг" },
    ],
  },

  // GRADERS (3)
  {
    id: 38, name: "Motor Grader", model: "Komatsu GD825", category: "Grader", brand: "Komatsu",
    power: "275 HP", powerNum: 275, weight: "28,000 kg", capacity: "7.3m Blade",     price: "₮420,000",
    image: "/images/product-grader.jpg", phone: PHONE,
    description: "Komatsu GD825-2 motor grader with hydro-mechanical transmission and blade control.",
    specs: [
      { label: "Загвар", value: "GD825-2" },
      { label: "Хөдөлгүүр", value: "Komatsu SAA6D125E" },
      { label: "Нэрлэсэн хурд", value: "2000 rpm" },
      { label: "Хүчин чадал", value: "275 м.х.үч" },
      { label: "Ажлын жин", value: "28,000 кг" },
      { label: "Хавтангийн урт", value: "7.3 м" },
      { label: "Хавтангийн өндөр", value: "725 мм" },
      { label: "Нийт урт", value: "14,600 мм" },
      { label: "Нийт өргөн", value: "3050 мм" },
      { label: "Хурдны хязгаар", value: "42 км/цаг" },
    ],
  },
  {
    id: 39, name: "Large Motor Grader", model: "CAT 24M", category: "Grader", brand: "Caterpillar",
    power: "530 HP", powerNum: 530, weight: "62,500 kg", capacity: "9.75m Blade",     price: "₮890,000",
    badge: "New", image: "/images/product-grader-2.jpg", phone: PHONE,
    description: "Caterpillar 24M the world's largest production motor grader.",
    specs: [
      { label: "Загвар", value: "CAT 24M" },
      { label: "Хөдөлгүүр", value: "CAT C27 ACERT" },
      { label: "Нэрлэсэн хурд", value: "1800 rpm" },
      { label: "Хүчин чадал", value: "530 м.х.үч" },
      { label: "Ажлын жин", value: "62,500 кг" },
      { label: "Хавтангийн урт", value: "9.75 м" },
      { label: "Хавтангийн өндөр", value: "1015 мм" },
      { label: "Нийт урт", value: "19,480 мм" },
      { label: "Нийт өргөн", value: "3485 мм" },
      { label: "Хурдны хязгаар", value: "38 км/цаг" },
    ],
  },
  {
    id: 40, name: "Motor Grader", model: "CAT 16M3", category: "Grader", brand: "Caterpillar",
    power: "250 HP", powerNum: 250, weight: "21,800 kg", capacity: "7.32m Blade",     price: "₮370,000",
    image: "/images/product-grader.jpg", phone: PHONE,
    description: "Caterpillar 16M3 motor grader with standard cross-slope control.",
    specs: [
      { label: "Загвар", value: "CAT 16M3" },
      { label: "Хөдөлгүүр", value: "CAT C13 ACERT" },
      { label: "Нэрлэсэн хурд", value: "1800 rpm" },
      { label: "Хүчин чадал", value: "250 м.х.үч" },
      { label: "Ажлын жин", value: "21,800 кг" },
      { label: "Хавтангийн урт", value: "7.32 м" },
      { label: "Хавтангийн өндөр", value: "830 мм" },
      { label: "Нийт урт", value: "13,960 мм" },
      { label: "Нийт өргөн", value: "2960 мм" },
      { label: "Хурдны хязгаар", value: "46 км/цаг" },
    ],
  },

  // COMPACTORS (4)
  {
    id: 41, name: "Vibratory Compactor", model: "Bomag BW 226", category: "Compactor", brand: "Bomag",
    power: "180 HP", powerNum: 180, weight: "18,500 kg", capacity: "2.13m Drum",     price: "₮195,000",
    image: "/images/product-compactor.jpg", phone: PHONE,
    description: "Bomag BW 226 DH-5 vibratory soil compactor with intelligent compaction control.",
    specs: [
      { label: "Загвар", value: "BW 226 DH-5" },
      { label: "Хөдөлгүүр", value: "Deutz TCD 6.1 L6" },
      { label: "Нэрлэсэн хурд", value: "2300 rpm" },
      { label: "Хүчин чадал", value: "180 м.х.үч" },
      { label: "Ажлын жин", value: "18,500 кг" },
      { label: "Дамбын диаметр", value: "1,600 мм" },
      { label: "Дамбын өргөн", value: "2,130 мм" },
      { label: "Нийт урт", value: "6,480 мм" },
      { label: "Нийт өргөн", value: "2,340 мм" },
      { label: "Ажлын хурд", value: "6–12 км/цаг" },
    ],
  },
  {
    id: 42, name: "Soil Compactor", model: "CAT CS11 GC", category: "Compactor", brand: "Caterpillar",
    power: "130 HP", powerNum: 130, weight: "11,200 kg", capacity: "2.13m Drum",     price: "₮148,000",
    badge: "Best Seller", image: "/images/product-compactor-2.jpg", phone: PHONE,
    description: "Caterpillar CS11 GC smooth drum vibratory compactor for soil and aggregate.",
    specs: [
      { label: "Загвар", value: "CAT CS11 GC" },
      { label: "Хөдөлгүүр", value: "CAT C4.4 ACERT" },
      { label: "Нэрлэсэн хурд", value: "2200 rpm" },
      { label: "Хүчин чадал", value: "130 м.х.үч" },
      { label: "Ажлын жин", value: "11,200 кг" },
      { label: "Дамбын диаметр", value: "1,524 мм" },
      { label: "Дамбын өргөн", value: "2,130 мм" },
      { label: "Нийт урт", value: "5,850 мм" },
      { label: "Нийт өргөн", value: "2,290 мм" },
      { label: "Ажлын хурд", value: "0–12 км/цаг" },
    ],
  },
  {
    id: 43, name: "Padfoot Compactor", model: "Komatsu BW213", category: "Compactor", brand: "Komatsu",
    power: "122 HP", powerNum: 122, weight: "12,300 kg", capacity: "2.13m Drum",     price: "₮135,000",
    image: "/images/product-compactor.jpg", phone: PHONE,
    description: "Komatsu BW213 padfoot compactor for cohesive and semi-cohesive soils.",
    specs: [
      { label: "Загвар", value: "BW213DH-4" },
      { label: "Хөдөлгүүр", value: "Komatsu S4D106" },
      { label: "Нэрлэсэн хурд", value: "2200 rpm" },
      { label: "Хүчин чадал", value: "122 м.х.үч" },
      { label: "Ажлын жин", value: "12,300 кг" },
      { label: "Дамбын диаметр", value: "1,524 мм" },
      { label: "Дамбын өргөн", value: "2,130 мм" },
      { label: "Нийт урт", value: "5,730 мм" },
      { label: "Нийт өргөн", value: "2,290 мм" },
      { label: "Ажлын хурд", value: "0–11 км/цаг" },
    ],
  },
  {
    id: 44, name: "Large Soil Compactor", model: "Bomag BW 650", category: "Compactor", brand: "Bomag",
    power: "588 HP", powerNum: 588, weight: "65,000 kg", capacity: "4.49m Drum",     price: "₮720,000",
    badge: "New", image: "/images/product-compactor-2.jpg", phone: PHONE,
    description: "Bomag BW 650 the world's largest vibratory roller for mining waste dump compaction.",
    specs: [
      { label: "Загвар", value: "BW 650" },
      { label: "Хөдөлгүүр", value: "Cummins QSL9" },
      { label: "Нэрлэсэн хурд", value: "1900 rpm" },
      { label: "Хүчин чадал", value: "588 м.х.үч" },
      { label: "Ажлын жин", value: "65,000 кг" },
      { label: "Дамбын диаметр", value: "2,600 мм" },
      { label: "Дамбын өргөн", value: "4,490 мм" },
      { label: "Нийт урт", value: "9,820 мм" },
      { label: "Нийт өргөн", value: "5,250 мм" },
      { label: "Ажлын хурд", value: "0–13 км/цаг" },
    ],
  },

  // SPECIALTY (6)
  {
    id: 45, name: "Blasthole Drill", model: "Atlas Copco PV311", category: "Specialty", brand: "Atlas Copco",
    power: "1,200 HP", powerNum: 1200, weight: "187,000 kg", capacity: "229–311mm Hole",     price: "₮3,800,000",
    badge: "New", image: "/images/product-drill.jpg", phone: PHONE,
    description: "Atlas Copco Pit Viper 311 rotary blasthole drill rig for large open-pit mining.",
    specs: [
      { label: "Загвар", value: "PV311" },
      { label: "Хөдөлгүүр", value: "Caterpillar C32" },
      { label: "Нэрлэсэн хурд", value: "1800 rpm" },
      { label: "Хүчин чадал", value: "1,200 м.х.үч" },
      { label: "Ажлын жин", value: "187,000 кг" },
      { label: "Өрөмдлөгийн голч", value: "229–311 мм" },
      { label: "Өрөмдлөгийн гүн", value: "85 м" },
      { label: "Нийт өндөр", value: "27,500 мм" },
      { label: "Трактан өргөн", value: "9,530 мм" },
      { label: "Хурдны хязгаар", value: "2 км/цаг" },
    ],
  },
  {
    id: 46, name: "Wheel Tractor-Scraper", model: "CAT 657G", category: "Specialty", brand: "Caterpillar",
    power: "1,040 HP", powerNum: 1040, weight: "95,800 kg", capacity: "34.4 m³ Bowl",     price: "₮1,650,000",
    image: "/images/product-scraper.jpg", phone: PHONE,
    description: "Caterpillar 657G push-pull wheel tractor-scraper for earthmoving.",
    specs: [
      { label: "Загвар", value: "CAT 657G" },
      { label: "Хөдөлгүүр", value: "CAT C18 ACERT (×2)" },
      { label: "Нэрлэсэн хурд", value: "1800 rpm" },
      { label: "Хүчин чадал", value: "1,040 м.х.үч" },
      { label: "Ажлын жин", value: "95,800 кг" },
      { label: "Ачааны хэмжээ", value: "34.4 м³" },
      { label: "Нийт урт", value: "21,950 мм" },
      { label: "Нийт өргөн", value: "4,660 мм" },
      { label: "Хурдны хязгаар", value: "52 км/цаг" },
      { label: "Ачааны даац", value: "67 тонн" },
    ],
  },
  {
    id: 47, name: "Telescopic Handler", model: "JLG 1850SJ", category: "Specialty", brand: "JLG",
    power: "173 HP", powerNum: 173, weight: "22,600 kg", capacity: "56m Height",     price: "₮320,000",
    image: "/images/product-telehandler.jpg", phone: PHONE,
    description: "JLG 1850SJ ultra boom telescopic boom lift for elevated work platforms.",
    specs: [
      { label: "Загвар", value: "1850SJ" },
      { label: "Хөдөлгүүр", value: "Deutz TCD 4.1" },
      { label: "Нэрлэсэн хурд", value: "2200 rpm" },
      { label: "Хүчин чадал", value: "173 м.х.үч" },
      { label: "Ажлын жин", value: "22,600 кг" },
      { label: "Платформын өндөр", value: "56 м" },
      { label: "Хэвтээ хүрэх зай", value: "24.4 м" },
      { label: "Нийт урт", value: "15,830 мм" },
      { label: "Нийт өргөн", value: "2,490 мм" },
      { label: "Хурдны хязгаар", value: "8 км/цаг" },
    ],
  },
  {
    id: 48, name: "Skid Steer Loader", model: "Bobcat S770", category: "Specialty", brand: "Bobcat",
    power: "92 HP", powerNum: 92, weight: "4,800 kg", capacity: "1.3T Rated",     price: "₮68,000",
    badge: "Best Seller", image: "/images/product-skidsteer.jpg", phone: PHONE,
    description: "Bobcat S770 skid steer loader with vertical lift path and superior visibility.",
    specs: [
      { label: "Загвар", value: "S770" },
      { label: "Хөдөлгүүр", value: "Bobcat 3.4L" },
      { label: "Нэрлэсэн хурд", value: "2400 rpm" },
      { label: "Хүчин чадал", value: "92 м.х.үч" },
      { label: "Ажлын жин", value: "4,800 кг" },
      { label: "Нэрлэсэн ачааллын хэмжээ", value: "1,316 кг" },
      { label: "Хувин багтаамж", value: "0.6 м³" },
      { label: "Нийт урт", value: "3,720 мм" },
      { label: "Нийт өргөн", value: "1,890 мм" },
      { label: "Хурдны хязгаар", value: "12 км/цаг" },
    ],
  },
  {
    id: 49, name: "Pipelayer", model: "CAT PL87", category: "Specialty", brand: "Caterpillar",
    power: "354 HP", powerNum: 354, weight: "47,700 kg", capacity: "90T Side Boom",     price: "₮620,000",
    image: "/images/product-pipelayer.jpg", phone: PHONE,
    description: "Caterpillar PL87 pipelayer for laying large-diameter pipelines in challenging terrain.",
    specs: [
      { label: "Загвар", value: "CAT PL87" },
      { label: "Хөдөлгүүр", value: "CAT C9.3 ACERT" },
      { label: "Нэрлэсэн хурд", value: "2000 rpm" },
      { label: "Хүчин чадал", value: "354 м.х.үч" },
      { label: "Ажлын жин", value: "47,700 кг" },
      { label: "Хажуу краны даац", value: "90 тонн" },
      { label: "Гинжний тэв хоорондын зай", value: "2540 мм" },
      { label: "Гинжний улны өргөн", value: "710 мм" },
      { label: "Нийт урт", value: "6,580 мм" },
      { label: "Нийт өргөн", value: "4,500 мм" },
    ],
  },
  {
    id: 50, name: "Trenching Machine", model: "Vermeer T1255", category: "Specialty", brand: "Vermeer",
    power: "760 HP", powerNum: 760, weight: "68,000 kg", capacity: "4.6m Depth",     price: "₮1,250,000",
    badge: "New", image: "/images/product-drill.jpg", phone: PHONE,
    description: "Vermeer T1255 Commander 3 rock saw trencher for large-scale utility installation.",
    specs: [
      { label: "Загвар", value: "T1255 Commander 3" },
      { label: "Хөдөлгүүр", value: "Cummins QSX15" },
      { label: "Нэрлэсэн хурд", value: "1800 rpm" },
      { label: "Хүчин чадал", value: "760 м.х.үч" },
      { label: "Ажлын жин", value: "68,000 кг" },
      { label: "Ухах гүн", value: "4.6 м" },
      { label: "Ухах өргөн", value: "460 мм" },
      { label: "Нийт урт", value: "16,200 мм" },
      { label: "Нийт өргөн", value: "3,600 мм" },
      { label: "Хурдны хязгаар", value: "3 км/цаг" },
    ],
  },
]

const CATEGORIES = ["All", "Excavator", "Bulldozer", "Wheel Loader", "Dump Truck", "Crane", "Grader", "Compactor", "Specialty"]

const BADGE_STYLES: Record<string, string> = {
  "New": "bg-[#F5BD02] text-black",
  "Best Seller": "bg-black text-white",
}

// ─── Modal CTA buttons (needs useLanguage so extracted as own component) ──────

function ModalCTAs({ product }: { product: Product }) {
  const { t } = useLanguage()
  return (
    <div className="mt-auto px-8 py-6 border-t border-black/[0.06] flex gap-3">
      <a
        href={`tel:${product.phone}`}
        className="flex-1 flex items-center justify-center gap-2 bg-[#F5BD02] text-black font-bold text-sm tracking-widest uppercase py-3.5 rounded-lg hover:bg-[#e0ac00] transition-colors"
      >
        <Phone size={15} />
        {t("modalOrder")}
      </a>
      <a
        href="#"
        download
        className="flex-1 flex items-center justify-center gap-2 border border-black/15 text-black font-bold text-sm tracking-widest uppercase py-3.5 rounded-lg hover:bg-black hover:text-white transition-colors"
      >
        <Download size={15} />
        {t("modalBrochure")}
      </a>
    </div>
  )
}

// ─── Product Detail Modal ──────────────────────────────────────────────────────

function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const { t } = useLanguage()
  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Left — Image */}
          <div className="relative w-full md:w-[46%] shrink-0 min-h-[260px] md:min-h-0 bg-[#F0F0F0]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 46vw"
            />
          </div>

          {/* Right — Specs */}
          <div className="flex flex-col flex-1 overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 px-8 pt-8 pb-4">
              <div>
                <p className="text-[11px] font-bold tracking-widest text-[#F5BD02] uppercase mb-2">
                  {product.category}
                </p>
                <h2 className="text-3xl font-bold text-black tracking-tight leading-tight">
                  {product.model}
                </h2>
                <p className="text-sm text-gray-500 mt-1.5">{product.description}</p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="shrink-0 w-9 h-9 rounded-full border border-black/10 flex items-center justify-center text-gray-400 hover:text-black hover:border-black/25 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Spec table */}
            <div className="px-8 pb-4">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[11px] font-bold tracking-widest uppercase text-black">
                  {t("modalTechSpecs")}
                </span>
                <div className="flex-1 h-px bg-[#F5BD02]" />
              </div>

              <div className="divide-y divide-black/[0.06]">
                {product.specs.map((spec) => (
                  <div key={spec.label} className="flex items-baseline justify-between py-2.5 gap-4">
                    <span className="text-sm text-gray-500 shrink-0">{spec.label}</span>
                    <span className="text-sm font-semibold text-black text-right">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA buttons */}
            <ModalCTAs product={product} />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ─── Card ──────────────────────────────────────────────────────────────────────

function RevealCard({ children, index }: { children: React.ReactNode; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.18 } }}
      transition={{ duration: 0.42, delay: (index % 12) * 0.04, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

function ProductCard({ product, onOpen }: { product: Product; onOpen: (p: Product) => void }) {
  const { t } = useLanguage()
  const badgeLabel: Record<string, string> = { "New": t("badgeNew"), "Best Seller": t("badgeBestSeller") }
  return (
    <article className="group bg-white border border-black/[0.06] rounded-2xl overflow-hidden hover:border-black/10 hover:shadow-[0_8px_40px_rgba(0,0,0,0.10)] transition-all duration-500 flex flex-col h-full">
      {/* Badge */}
      {product.badge && (
        <div className={`absolute top-4 left-4 z-20 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wide ${BADGE_STYLES[product.badge]}`}>
          {badgeLabel[product.badge] ?? product.badge}
        </div>
      )}

      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-[#F8F9FA] shrink-0">
        <Image
          src={product.image}
          alt={`${product.name} — ${product.model}`}
          fill
          className="object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-95"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <p className="text-[11px] text-gray-400 font-medium tracking-wide mb-2">
          {product.brand} · {product.category}
        </p>

        <div className="mb-3">
          <h3 className="font-semibold text-black tracking-tight leading-snug">{product.name}</h3>
          <p className="text-[#F5BD02] text-sm font-semibold mt-0.5">{product.model}</p>
        </div>

        <div className="flex gap-4 mb-4">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Gauge size={12} className="text-[#F5BD02]" />
            {product.power}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Weight size={12} className="text-[#F5BD02]" />
            {product.weight}
          </div>
        </div>

        <div className="pt-4 border-t border-black/[0.06] mt-auto flex items-end justify-between gap-2">
          <div>
            <p className="text-[10px] text-gray-400 font-medium tracking-wide mb-0.5">{t("previewStartingFrom")}</p>
            <p className="text-black font-semibold text-base tracking-tight">{product.price}</p>
          </div>
          <button
            onClick={() => onOpen(product)}
            className="flex items-center gap-1.5 bg-black/[0.04] hover:bg-[#F5BD02] text-black text-[11px] font-semibold tracking-wide px-3.5 py-2 rounded-full transition-colors duration-200 whitespace-nowrap"
          >
            <LayoutGrid size={12} />
            {t("productsViewSpecs")}
          </button>
        </div>
      </div>
    </article>
  )
}

// ─── Main Products Content ─────────────────────────────────────────────────────

function ProductsContent() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get("category") || "All"
  const { t } = useLanguage()

  const [activeCategory, setActiveCategory] = useState(initialCategory)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = activeCategory === "All" || p.category === activeCategory
      const matchesSearch =
        searchQuery === "" ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, searchQuery])

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: products.length }
    products.forEach((p) => { counts[p.category] = (counts[p.category] || 0) + 1 })
    return counts
  }, [])

  return (
    <main className="min-h-screen bg-white">
      {/* Page header */}
      <section className="pt-28 lg:pt-32 pb-12 lg:pb-16 border-b border-black/[0.06]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-black transition-colors mb-6">
            <ChevronRight size={14} className="rotate-180" /> {t("navProducts") === "Бүтээгдэхүүн" ? "Нүүр хуудас" : "Home"}
          </Link>
          <h1
            className="text-black font-bold tracking-tighter text-balance"
            style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)" }}
          >
            {t("productsPageTitle")}
          </h1>
          <p className="text-gray-500 text-lg mt-4 max-w-2xl leading-relaxed">
            {t("productsPageSubtitle")}
          </p>
        </div>
      </section>

      {/* Sticky filter bar */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-black/[0.06]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Category pills */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-0.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`relative px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    activeCategory === cat
                      ? "bg-black text-white"
                      : "bg-black/[0.04] text-gray-500 hover:bg-black/[0.07] hover:text-black"
                  }`}
                >
                  {cat === "All" ? t("productsCatAll") : cat}
                  <span className={`ml-1.5 text-xs ${activeCategory === cat ? "text-white/60" : "text-gray-400"}`}>
                    {categoryCounts[cat] || 0}
                  </span>
                  {activeCategory === cat && (
                    <motion.span
                      layoutId="active-cat"
                      className="absolute inset-0 rounded-full bg-black -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 34 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full lg:w-64 shrink-0">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={t("productsSearchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-black/[0.04] border border-transparent focus:border-black/10 focus:outline-none text-sm placeholder:text-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatePresence mode="popLayout">
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <RevealCard key={product.id} index={index}>
                  <ProductCard product={product} onOpen={setSelectedProduct} />
                </RevealCard>
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredProducts.length === 0 && (
            <div className="text-center py-24">
              <p className="text-gray-400 text-lg">{t("productsNoResults")}</p>
              <button
                onClick={() => { setActiveCategory("All"); setSearchQuery("") }}
                className="mt-4 text-sm font-medium text-[#F5BD02] hover:underline"
              >
                {t("productsClearSearch")}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </main>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <ProductsContent />
    </Suspense>
  )
}
