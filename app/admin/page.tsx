"use client"

import Image from "next/image"
import { useEffect, useMemo, useRef, useState } from "react"
import { LogOut } from "lucide-react"
import type { CustomerOrder } from "@/lib/store-types"
import { useAppContext } from "@/app/providers/AppContext"
import { ProductForm } from "@/components/admin/ProductForm"
import { ProductList } from "@/components/admin/ProductList"
import { OrdersList } from "@/components/admin/OrdersList"
import { SuccessMessage } from "@/components/admin/SuccessMessage"
import type { Product } from "@/lib/store-types"

const emptyProduct: Partial<Product> = {
  id: "",
  nameFr: "",
  nameAr: "",
  categoryId: "",
  price: 0,
  descriptionFr: "",
  descriptionAr: "",
  image: "/khalid-bijoux.png",
  tag: "",
}

export default function AdminPage() {
  const { t, language, products, categories, orders, refreshProducts, refreshCategories, refreshOrders } = useAppContext()
  const admin = t("admin")
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products")
  const [form, setForm] = useState<Partial<Product>>(emptyProduct)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>(emptyProduct.image!)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [isDeleting, setIsDeleting] = useState<Set<string>>(new Set())
  const formRef = useRef<HTMLFormElement | null>(null)
  const firstInputRef = useRef<HTMLInputElement | null>(null)
  const [highlightForm, setHighlightForm] = useState(false)
  const [editTrigger, setEditTrigger] = useState(0)

  

  useEffect(() => {
    void refreshProducts()
    void refreshCategories()
    void refreshOrders()
  }, [refreshOrders, refreshProducts, refreshCategories])

  useEffect(() => {
    if (!editingId) return

    const node = formRef.current
    if (!node) return

    setHighlightForm(true)
    node.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" })

    const focusTimer = window.setTimeout(() => {
      firstInputRef.current?.focus()
    }, 500)

    const highlightTimer = window.setTimeout(() => {
      setHighlightForm(false)
    }, 3200)

    return () => {
      window.clearTimeout(focusTimer)
      window.clearTimeout(highlightTimer)
    }
  }, [editingId, editTrigger])

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(form.image || emptyProduct.image!)
      return
    }

    const objectUrl = URL.createObjectURL(selectedFile)
    setPreviewUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [form.image, selectedFile])

  const formTitle = useMemo(() => (editingId ? admin.editProduct : admin.addProduct), [admin, editingId])

  const resetForm = () => {
    setForm(emptyProduct)
    setSelectedFile(null)
    setPreviewUrl(emptyProduct.image!)
    setEditingId(null)
    setError("")
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError("")
    setIsSaving(true)

    try {
      // Validation
      if (!form.nameFr?.trim() || !form.nameAr?.trim()) {
        throw new Error("INVALID_PRODUCT_PAYLOAD")
      }
      if (!form.descriptionFr?.trim() || !form.descriptionAr?.trim()) {
        throw new Error("INVALID_PRODUCT_PAYLOAD")
      }
      if (!form.categoryId) {
        throw new Error("CATEGORY_REQUIRED")
      }

      const endpoint = editingId ? `/api/products/${editingId}` : "/api/products"
      const method = editingId ? "PUT" : "POST"
      const payload = new FormData()

      payload.append("nameFr", form.nameFr)
      payload.append("nameAr", form.nameAr)
      payload.append("descriptionFr", form.descriptionFr)
      payload.append("descriptionAr", form.descriptionAr)
      payload.append("categoryId", form.categoryId)
      payload.append("price", String(form.price || 0))
      payload.append("originalPrice", String(form.originalPrice ?? ""))
      payload.append("tag", form.tag ?? "")
      payload.append("id", form.id || "")
      payload.append("existingImage", form.image || "")

      if (selectedFile) {
        payload.append("image", selectedFile)
      }

      const response = await fetch(endpoint, {
        method,
        body: payload,
      })

      const data = await response.json()
      if (!response.ok) {
        const errorMap: Record<string, string> = {
          INVALID_PRODUCT_PAYLOAD: "Veuillez remplir tous les champs requis (nom, description dans les 2 langues)",
          CATEGORY_REQUIRED: "Veuillez sélectionner une catégorie avant d'enregistrer",
          CATEGORY_NOT_FOUND: "La catégorie sélectionnée n'existe plus. Veuillez relancer et en sélectionner une autre.",
          IMAGE_REQUIRED: "Veuillez ajouter une image au produit",
          INVALID_FILE_TYPE: "Format d'image invalide (JPG, PNG, WEBP acceptés)",
          FILE_TOO_LARGE: "L'image dépasse la limite de 2 MB",
          PRODUCT_CREATE_FAILED: "Erreur lors de la création du produit",
          PRODUCT_UPDATE_FAILED: "Erreur lors de la modification du produit",
        }
        throw new Error(errorMap[data.error] || data.error || "PRODUCT_SAVE_FAILED")
      }

      resetForm()
      await refreshProducts()
      setSuccessMessage(editingId ? "Produit modifié avec succès ✨" : "Produit ajouté avec succès ✨")
    } catch (submissionError) {
      setError(
        submissionError instanceof Error ? submissionError.message : "Impossible d'enregistrer ce produit."
      )
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    setIsDeleting((prev) => new Set(prev).add(id))
    try {
      const response = await fetch(`/api/products/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Erreur lors de la suppression")
      await refreshProducts()
      setSuccessMessage("Produit supprimé avec succès")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la suppression")
    } finally {
      setIsDeleting((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }

  const handleEdit = (product: Product) => {
    setEditingId(product.id)
    setForm(product)
    setSelectedFile(null)
    setPreviewUrl(product.image)
    setError("")
    setEditTrigger((prev) => prev + 1)
  }

  const updateOrderStatus = async (orderNumber: string, status: string) => {
    try {
      const response = await fetch(`/api/orders/${orderNumber}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Erreur lors de la mise à jour du statut")
      }

      await refreshOrders()
      setSuccessMessage("Statut de la commande mis à jour ✓")
    } catch (err) {
      throw err
    }
  }

  const cancelOrder = async (orderNumber: string) => {
    try {
      const response = await fetch(`/api/orders/${orderNumber}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Erreur lors de l'annulation")
      }

      await refreshOrders()
      setSuccessMessage("Commande annulée ✓")
    } catch (err) {
      throw err
    }
  }

  const logout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/logout`, { method: "POST" })
    window.location.href = "/admin/login"
  }

  return (
    <main className="min-h-screen bg-[#060606] px-6 py-10 text-white md:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.4em] text-[#c9a84c]">Khalid Bijoux</p>
            <h1 className="text-4xl font-cormorant md:text-5xl">Dashboard Admin</h1>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 font-medium text-white hover:bg-white/10 transition-colors"
          >
            <LogOut size={18} />
            {admin.logout}
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-3">
          <button
            onClick={() => setActiveTab("products")}
            className={`rounded-2xl px-6 py-3 font-medium transition-all ${
              activeTab === "products"
                ? "bg-[#c9a84c] text-black"
                : "border border-white/10 text-white hover:bg-white/10"
            }`}
          >
            {admin.products}
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`rounded-2xl px-6 py-3 font-medium transition-all ${
              activeTab === "orders"
                ? "bg-[#c9a84c] text-black"
                : "border border-white/10 text-white hover:bg-white/10"
            }`}
          >
            {admin.orders} ({orders.length})
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === "products" ? (
          <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
            <ProductForm
              form={form}
              formTitle={formTitle}
              onSubmit={handleSubmit}
              onReset={resetForm}
              onFormChange={setForm}
              onFileSelect={setSelectedFile}
              previewUrl={previewUrl}
              categories={categories}
              products={products}
              error={error}
              isSaving={isSaving}
              editingId={editingId}
              formRef={formRef}
              firstInputRef={firstInputRef}
              highlightForm={highlightForm}
              onCategoryDeleted={refreshCategories}
            />

            <ProductList
              products={products}
              categories={categories}
              onEdit={handleEdit}
              onDelete={handleDelete}
              language={language}
              isDeleting={isDeleting}
            />
          </div>
        ) : (
          /* Orders Tab */
          <OrdersList
            orders={orders}
            onStatusChange={updateOrderStatus}
            onCancel={cancelOrder}
            language={language}
          />
        )}
      </div>

      {/* Success Message */}
      {successMessage && (
        <SuccessMessage message={successMessage} onClose={() => setSuccessMessage("")} />
      )}
    </main>
  )
}
