"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  LogOut,
  Package,
  Loader2,
  X,
  Save,
  AlertCircle,
  CheckCircle,
  Home,
  ChevronDown,
} from "lucide-react"

type Product = {
  id: string
  name: string
  category: string
  brand: string
  description: string | null
  price: string
  power: string | null
  weight: string | null
  engine: string | null
  image: string | null
  badge: string | null
  phone: string | null
  specs: { label: string; value: string }[]
  created_at: string
}

const CATEGORIES = [
  "All",
  "Excavator",
  "Bulldozer",
  "Wheel Loader",
  "Dump Truck",
  "Crane",
  "Grader",
  "Compactor",
  "Specialty",
]

const BRANDS = ["Caterpillar", "Komatsu", "Liebherr", "SANY", "Volvo", "Hitachi", "XCMG", "Shantui"]

export default function AdminDashboard() {
  const router = useRouter()
  const supabase = createClient()

  const [user, setUser] = useState<any>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("All")

  // Modal states
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null)

  // Form state
  const [form, setForm] = useState({
    name: "",
    category: "Excavator",
    brand: "Caterpillar",
    description: "",
    price: "",
    power: "",
    weight: "",
    engine: "",
    image: "",
    badge: "",
    phone: "+976 8588-0999",
    specs: [{ label: "", value: "" }],
  })

  const fetchProducts = useCallback(async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching products:", error)
      return
    }
    setProducts(data || [])
  }, [supabase])

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user || !user.user_metadata?.is_admin) {
        router.push("/admin/login")
        return
      }
      
      setUser(user)
      await fetchProducts()
      setLoading(false)
    }

    checkAuth()
  }, [router, supabase, fetchProducts])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/admin/login")
  }

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3000)
  }

  const openNewProductModal = () => {
    setEditingProduct(null)
    setForm({
      name: "",
      category: "Excavator",
      brand: "Caterpillar",
      description: "",
      price: "",
      power: "",
      weight: "",
      engine: "",
      image: "",
      badge: "",
      phone: "+976 8588-0999",
      specs: [{ label: "", value: "" }],
    })
    setShowModal(true)
  }

  const openEditModal = (product: Product) => {
    setEditingProduct(product)
    setForm({
      name: product.name,
      category: product.category,
      brand: product.brand,
      description: product.description || "",
      price: product.price,
      power: product.power || "",
      weight: product.weight || "",
      engine: product.engine || "",
      image: product.image || "",
      badge: product.badge || "",
      phone: product.phone || "+976 8588-0999",
      specs: product.specs?.length > 0 ? product.specs : [{ label: "", value: "" }],
    })
    setShowModal(true)
  }

  const addSpecRow = () => {
    setForm({ ...form, specs: [...form.specs, { label: "", value: "" }] })
  }

  const updateSpec = (index: number, field: "label" | "value", value: string) => {
    const newSpecs = [...form.specs]
    newSpecs[index][field] = value
    setForm({ ...form, specs: newSpecs })
  }

  const removeSpec = (index: number) => {
    const newSpecs = form.specs.filter((_, i) => i !== index)
    setForm({ ...form, specs: newSpecs.length > 0 ? newSpecs : [{ label: "", value: "" }] })
  }

  const handleSave = async () => {
    if (!form.name || !form.price) {
      showToast("error", "Name and price are required")
      return
    }

    setSaving(true)
    const cleanSpecs = form.specs.filter((s) => s.label && s.value)

    const productData = {
      name: form.name,
      category: form.category,
      brand: form.brand,
      description: form.description || null,
      price: form.price,
      power: form.power || null,
      weight: form.weight || null,
      engine: form.engine || null,
      image: form.image || null,
      badge: form.badge || null,
      phone: form.phone || "+976 8588-0999",
      specs: cleanSpecs,
    }

    if (editingProduct) {
      const { error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", editingProduct.id)

      if (error) {
        showToast("error", "Failed to update product")
        console.error(error)
      } else {
        showToast("success", "Product updated successfully")
        setShowModal(false)
        fetchProducts()
      }
    } else {
      const { error } = await supabase.from("products").insert(productData)

      if (error) {
        showToast("error", "Failed to create product")
        console.error(error)
      } else {
        showToast("success", "Product created successfully")
        setShowModal(false)
        fetchProducts()
      }
    }

    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id)

    if (error) {
      showToast("error", "Failed to delete product")
      console.error(error)
    } else {
      showToast("success", "Product deleted successfully")
      fetchProducts()
    }
    setDeleteConfirm(null)
  }

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === "All" || p.category === filterCategory
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[#007AFF]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-[100] flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium ${
              toast.type === "success"
                ? "bg-green-500/20 border border-green-500/30 text-green-400"
                : "bg-red-500/20 border border-red-500/30 text-red-400"
            }`}
          >
            {toast.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#007AFF] rounded-xl flex items-center justify-center">
              <span className="font-black text-white text-sm">HF</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">Admin Dashboard</h1>
              <p className="text-white/40 text-xs">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 text-white/60 hover:text-white text-sm transition-colors"
            >
              <Home size={16} />
              View Site
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white/[0.05] hover:bg-white/[0.08] text-white/80 rounded-lg text-sm transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Products", value: products.length, icon: Package },
            { label: "Excavators", value: products.filter((p) => p.category === "Excavator").length },
            { label: "Bulldozers", value: products.filter((p) => p.category === "Bulldozer").length },
            { label: "Others", value: products.filter((p) => !["Excavator", "Bulldozer"].includes(p.category)).length },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5"
            >
              <p className="text-white/40 text-sm mb-1">{stat.label}</p>
              <p className="text-white text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#007AFF]/50 transition-all"
            />
          </div>
          <div className="relative">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="appearance-none bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 pr-10 text-white focus:outline-none focus:border-[#007AFF]/50 transition-all cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-[#1a1a1a]">
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
          </div>
          <button
            onClick={openNewProductModal}
            className="flex items-center gap-2 bg-[#007AFF] text-white px-5 py-3 rounded-xl font-semibold hover:bg-[#0066D6] transition-colors"
          >
            <Plus size={18} />
            Add Product
          </button>
        </div>

        {/* Products table */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left text-white/40 text-xs font-medium uppercase tracking-wider px-6 py-4">
                    Product
                  </th>
                  <th className="text-left text-white/40 text-xs font-medium uppercase tracking-wider px-6 py-4">
                    Category
                  </th>
                  <th className="text-left text-white/40 text-xs font-medium uppercase tracking-wider px-6 py-4">
                    Brand
                  </th>
                  <th className="text-left text-white/40 text-xs font-medium uppercase tracking-wider px-6 py-4">
                    Price
                  </th>
                  <th className="text-right text-white/40 text-xs font-medium uppercase tracking-wider px-6 py-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center text-white/40 py-12">
                      No products found
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              width={48}
                              height={48}
                              className="w-12 h-12 rounded-lg object-cover bg-white/[0.05]"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-white/[0.05] flex items-center justify-center">
                              <Package size={20} className="text-white/20" />
                            </div>
                          )}
                          <div>
                            <p className="text-white font-medium">{product.name}</p>
                            {product.badge && (
                              <span className="text-[10px] bg-[#FF9500]/20 text-[#FF9500] px-2 py-0.5 rounded-full">
                                {product.badge}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white/60">{product.category}</td>
                      <td className="px-6 py-4 text-white/60">{product.brand}</td>
                      <td className="px-6 py-4 text-white font-medium">{product.price}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(product)}
                            className="p-2 hover:bg-white/[0.08] rounded-lg text-white/60 hover:text-white transition-colors"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(product.id)}
                            className="p-2 hover:bg-red-500/20 rounded-lg text-white/60 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1a1a1a] border border-white/[0.08] rounded-2xl p-6 max-w-sm w-full"
            >
              <h3 className="text-white font-bold text-lg mb-2">Delete Product?</h3>
              <p className="text-white/50 text-sm mb-6">
                This action cannot be undone. The product will be permanently removed from the catalog.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2.5 border border-white/10 text-white rounded-xl font-medium hover:bg-white/[0.05] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm flex items-start justify-center p-6 overflow-y-auto"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1a1a1a] border border-white/[0.08] rounded-2xl p-6 max-w-2xl w-full my-10"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-bold text-xl">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/[0.08] rounded-lg text-white/60 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-2">
                {/* Basic info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-white/60 text-sm font-medium block mb-2">Product Name *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. CAT 390F Excavator"
                      className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#007AFF]/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-white/60 text-sm font-medium block mb-2">Category</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#007AFF]/50 transition-all"
                    >
                      {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                        <option key={cat} value={cat} className="bg-[#1a1a1a]">
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-white/60 text-sm font-medium block mb-2">Brand</label>
                    <select
                      value={form.brand}
                      onChange={(e) => setForm({ ...form, brand: e.target.value })}
                      className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#007AFF]/50 transition-all"
                    >
                      {BRANDS.map((brand) => (
                        <option key={brand} value={brand} className="bg-[#1a1a1a]">
                          {brand}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-white/60 text-sm font-medium block mb-2">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Product description..."
                    rows={3}
                    className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#007AFF]/50 transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/60 text-sm font-medium block mb-2">Price *</label>
                    <input
                      type="text"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      placeholder="e.g. ₮1,240,000"
                      className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#007AFF]/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-white/60 text-sm font-medium block mb-2">Badge</label>
                    <select
                      value={form.badge}
                      onChange={(e) => setForm({ ...form, badge: e.target.value })}
                      className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#007AFF]/50 transition-all"
                    >
                      <option value="" className="bg-[#1a1a1a]">No badge</option>
                      <option value="New" className="bg-[#1a1a1a]">New</option>
                      <option value="Best Seller" className="bg-[#1a1a1a]">Best Seller</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-white/60 text-sm font-medium block mb-2">Power</label>
                    <input
                      type="text"
                      value={form.power}
                      onChange={(e) => setForm({ ...form, power: e.target.value })}
                      placeholder="e.g. 523 HP"
                      className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#007AFF]/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-white/60 text-sm font-medium block mb-2">Weight</label>
                    <input
                      type="text"
                      value={form.weight}
                      onChange={(e) => setForm({ ...form, weight: e.target.value })}
                      placeholder="e.g. 88,450 kg"
                      className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#007AFF]/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-white/60 text-sm font-medium block mb-2">Engine</label>
                    <input
                      type="text"
                      value={form.engine}
                      onChange={(e) => setForm({ ...form, engine: e.target.value })}
                      placeholder="e.g. CAT C18"
                      className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#007AFF]/50 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-white/60 text-sm font-medium block mb-2">Image URL</label>
                  <input
                    type="text"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder="/images/product-excavator.jpg"
                    className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#007AFF]/50 transition-all"
                  />
                </div>

                <div>
                  <label className="text-white/60 text-sm font-medium block mb-2">Phone</label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+976 8588-0999"
                    className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#007AFF]/50 transition-all"
                  />
                </div>

                {/* Specs */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-white/60 text-sm font-medium">Technical Specifications</label>
                    <button
                      type="button"
                      onClick={addSpecRow}
                      className="text-[#007AFF] text-sm hover:underline"
                    >
                      + Add row
                    </button>
                  </div>
                  <div className="space-y-2">
                    {form.specs.map((spec, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={spec.label}
                          onChange={(e) => updateSpec(index, "label", e.target.value)}
                          placeholder="Label (e.g. Engine)"
                          className="flex-1 bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:border-[#007AFF]/50 transition-all text-sm"
                        />
                        <input
                          type="text"
                          value={spec.value}
                          onChange={(e) => updateSpec(index, "value", e.target.value)}
                          placeholder="Value (e.g. CAT C18)"
                          className="flex-1 bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:border-[#007AFF]/50 transition-all text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeSpec(index)}
                          className="p-2.5 hover:bg-red-500/20 rounded-xl text-white/40 hover:text-red-400 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-6 border-t border-white/[0.06]">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border border-white/10 text-white rounded-xl font-medium hover:bg-white/[0.05] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-3 bg-[#007AFF] text-white rounded-xl font-medium hover:bg-[#0066D6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      {editingProduct ? "Update Product" : "Create Product"}
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
