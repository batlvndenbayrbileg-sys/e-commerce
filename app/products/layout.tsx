import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import FloatingQuote from "@/components/floating-quote"

export const metadata = {
  title: "Equipment Catalog | HeavyForce Mongolia",
  description: "Browse our complete inventory of 50 premium heavy machinery units. Excavators, bulldozers, cranes, dump trucks and more.",
}

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <FloatingQuote />
    </>
  )
}
