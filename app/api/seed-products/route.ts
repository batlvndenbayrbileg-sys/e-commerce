import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

const INITIAL_PRODUCTS = [
  {
    name: "CAT 390F L",
    category: "Excavator",
    brand: "Caterpillar",
    description: "Large hydraulic excavator for heavy-duty mining and construction.",
    price: "₮1,240,000",
    power: "523 HP",
    weight: "88,450 kg",
    engine: "Cat C18",
    image: "/images/product-excavator.jpg",
    badge: "New",
    phone: "+976 8588-0999",
    specs: [
      { label: "Загвар", value: "390F L" },
      { label: "Хөдөлгүүр", value: "Cat C18 ACERT" },
      { label: "Хүчин чадал", value: "523 HP" },
      { label: "Ажлын жин", value: "88,450 kg" },
      { label: "Хутганы багтаамж", value: "6.0 m³" },
    ],
  },
  {
    name: "Komatsu PC800",
    category: "Excavator",
    brand: "Komatsu",
    description: "High-performance mining excavator with advanced hydraulics.",
    price: "₮980,000",
    power: "513 HP",
    weight: "79,200 kg",
    engine: "Komatsu SAA6D140E",
    image: "/images/product-excavator-2.jpg",
    badge: null,
    phone: "+976 8588-0999",
    specs: [
      { label: "Загвар", value: "PC800-8" },
      { label: "Хөдөлгүүр", value: "SAA6D140E-5" },
      { label: "Хүчин чадал", value: "513 HP" },
      { label: "Ажлын жин", value: "79,200 kg" },
    ],
  },
  {
    name: "Liebherr R 9800",
    category: "Excavator",
    brand: "Liebherr",
    description: "World's largest hydraulic excavator for mining operations.",
    price: "₮8,500,000",
    power: "4,000 HP",
    weight: "810,000 kg",
    engine: "Cummins QSK60",
    image: "/images/product-excavator-3.jpg",
    badge: "Best Seller",
    phone: "+976 8588-0999",
    specs: [
      { label: "Загвар", value: "R 9800" },
      { label: "Хөдөлгүүр", value: "Cummins QSK60" },
      { label: "Хүчин чадал", value: "4,000 HP" },
      { label: "Ажлын жин", value: "810,000 kg" },
    ],
  },
  {
    name: "CAT D9T",
    category: "Bulldozer",
    brand: "Caterpillar",
    description: "Track-type tractor for heavy dozing and ripping.",
    price: "₮720,000",
    power: "410 HP",
    weight: "48,000 kg",
    engine: "Cat C18",
    image: "/images/product-bulldozer.jpg",
    badge: "New",
    phone: "+976 8588-0999",
    specs: [
      { label: "Загвар", value: "D9T" },
      { label: "Хөдөлгүүр", value: "Cat C18 ACERT" },
      { label: "Хүчин чадал", value: "410 HP" },
      { label: "Ажлын жин", value: "48,000 kg" },
    ],
  },
  {
    name: "Komatsu D375A",
    category: "Bulldozer",
    brand: "Komatsu",
    description: "Large mining bulldozer with superior pushing power.",
    price: "₮870,000",
    power: "609 HP",
    weight: "71,840 kg",
    engine: "Komatsu SAA6D170E",
    image: "/images/product-bulldozer-2.jpg",
    badge: null,
    phone: "+976 8588-0999",
    specs: [
      { label: "Загвар", value: "D375A-8" },
      { label: "Хөдөлгүүр", value: "SAA6D170E-5" },
      { label: "Хүчин чадал", value: "609 HP" },
      { label: "Ажлын жин", value: "71,840 kg" },
    ],
  },
  {
    name: "Liebherr PR 776",
    category: "Bulldozer",
    brand: "Liebherr",
    description: "The world's largest hydrostatic bulldozer.",
    price: "₮1,450,000",
    power: "768 HP",
    weight: "77,000 kg",
    engine: "Liebherr V12",
    image: "/images/product-bulldozer-3.jpg",
    badge: "Best Seller",
    phone: "+976 8588-0999",
    specs: [
      { label: "Загвар", value: "PR 776" },
      { label: "Хөдөлгүүр", value: "Liebherr V12" },
      { label: "Хүчин чадал", value: "768 HP" },
      { label: "Ажлын жин", value: "77,000 kg" },
    ],
  },
  {
    name: "CAT 994K",
    category: "Wheel Loader",
    brand: "Caterpillar",
    description: "Large wheel loader for high-production mining.",
    price: "₮2,100,000",
    power: "1,739 HP",
    weight: "240,000 kg",
    engine: "Cat 3516B",
    image: "/images/product-loader.jpg",
    badge: "New",
    phone: "+976 8588-0999",
    specs: [
      { label: "Загвар", value: "994K" },
      { label: "Хөдөлгүүр", value: "Cat 3516B" },
      { label: "Хүчин чадал", value: "1,739 HP" },
      { label: "Ажлын жин", value: "240,000 kg" },
    ],
  },
  {
    name: "Komatsu WA600",
    category: "Wheel Loader",
    brand: "Komatsu",
    description: "Large wheel loader for demanding applications.",
    price: "₮560,000",
    power: "398 HP",
    weight: "53,200 kg",
    engine: "Komatsu SAA6D140E",
    image: "/images/product-loader-2.jpg",
    badge: null,
    phone: "+976 8588-0999",
    specs: [
      { label: "Загвар", value: "WA600-8" },
      { label: "Хөдөлгүүр", value: "SAA6D140E-7" },
      { label: "Хүчин чадал", value: "398 HP" },
      { label: "Ажлын жин", value: "53,200 kg" },
    ],
  },
  {
    name: "CAT 785D",
    category: "Dump Truck",
    brand: "Caterpillar",
    description: "Off-highway mining truck with proven reliability.",
    price: "₮2,050,000",
    power: "1,450 HP",
    weight: "249,000 kg",
    engine: "Cat 3512C",
    image: "/images/product-dumptruck.jpg",
    badge: "Best Seller",
    phone: "+976 8588-0999",
    specs: [
      { label: "Загвар", value: "785D" },
      { label: "Хөдөлгүүр", value: "Cat 3512C HD" },
      { label: "Хүчин чадал", value: "1,450 HP" },
      { label: "Ачааны багтаамж", value: "150 ton" },
    ],
  },
  {
    name: "Liebherr LTM 1500",
    category: "Crane",
    brand: "Liebherr",
    description: "All-terrain mobile crane for heavy lifting.",
    price: "₮4,200,000",
    power: "598 HP",
    weight: "108,000 kg",
    engine: "Liebherr D9508",
    image: "/images/product-crane.jpg",
    badge: "New",
    phone: "+976 8588-0999",
    specs: [
      { label: "Загвар", value: "LTM 1500-8.1" },
      { label: "Хөдөлгүүр", value: "Liebherr D9508" },
      { label: "Өргөх чадвар", value: "500 ton" },
      { label: "Сунгалтын урт", value: "84m" },
    ],
  },
  {
    name: "CAT 24M",
    category: "Grader",
    brand: "Caterpillar",
    description: "The world's largest motor grader.",
    price: "₮1,650,000",
    power: "533 HP",
    weight: "66,000 kg",
    engine: "Cat C18",
    image: "/images/product-grader.jpg",
    badge: null,
    phone: "+976 8588-0999",
    specs: [
      { label: "Загвар", value: "24M" },
      { label: "Хөдөлгүүр", value: "Cat C18 ACERT" },
      { label: "Хүчин чадал", value: "533 HP" },
      { label: "Хутганы өргөн", value: "7.3m" },
    ],
  },
  {
    name: "BOMAG BW 226",
    category: "Compactor",
    brand: "XCMG",
    description: "Single drum vibratory roller for soil compaction.",
    price: "₮195,000",
    power: "173 HP",
    weight: "23,100 kg",
    engine: "Deutz TCD",
    image: "/images/product-compactor.jpg",
    badge: null,
    phone: "+976 8588-0999",
    specs: [
      { label: "Загвар", value: "BW 226 DH-5" },
      { label: "Хөдөлгүүр", value: "Deutz TCD 2013" },
      { label: "Хүчин чадал", value: "173 HP" },
      { label: "Нягтруулах хүч", value: "380 kN" },
    ],
  },
]

export async function POST(request: Request) {
  // Check for admin secret (simple protection)
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get("secret")
  
  if (secret !== process.env.ADMIN_SEED_SECRET && secret !== "heavyforce2024") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = await createClient()

  // Check if products already exist
  const { count } = await supabase.from("products").select("*", { count: "exact", head: true })
  
  if (count && count > 0) {
    return NextResponse.json({ 
      message: "Products already seeded", 
      count 
    })
  }

  // Insert products
  const { data, error } = await supabase.from("products").insert(INITIAL_PRODUCTS).select()

  if (error) {
    console.error("Seed error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ 
    message: "Products seeded successfully", 
    count: data?.length 
  })
}
