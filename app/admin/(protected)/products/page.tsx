"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useAppContext } from "@/app/providers/AppContext"
import { ProductForm } from "@/components/admin/ProductForm"
import { type ProductImageDraft } from "@/components/admin/ImageUploader"
import { ProductList } from "@/components/admin/ProductList"
import { SuccessMessage } from "@/components/admin/SuccessMessage"
import { StatusToast } from "@/components/admin/StatusToast"
import type { Product } from "@/lib/store-types"

const emptyProduct: Partial<Product> = {
  id: "", nameFr: "", nameAr: "", categoryId: "", price: 0, quantity: 0,
  descriptionFr: "", descriptionAr: "", image: "/placeholder.svg", images: [], tag: "",
}

export default function AdminProductsPage() {
  const { t, language, products, categories, refreshProducts, refreshCategories } = useAppContext()
  const admin = t("admin")
  const [form, setForm] = useState<Partial<Product>>(emptyProduct)
  const [images, setImages] = useState<ProductImageDraft[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [isDeleting, setIsDeleting] = useState<Set<string>>(new Set())
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const formRef = useRef<HTMLFormElement | null>(null)
  const firstInputRef = useRef<HTMLInputElement | null>(null)
  const [highlightForm, setHighlightForm] = useState(false)

  useEffect(() => { void refreshProducts(false); void refreshCategories() }, [refreshProducts, refreshCategories])
  useEffect(() => {
    if (!editingId || !formRef.current) return
    setHighlightForm(true)
    formRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    const timer = window.setTimeout(() => setHighlightForm(false), 3000)
    return () => window.clearTimeout(timer)
  }, [editingId])

  const formTitle = useMemo(() => editingId ? admin.editProduct : admin.addProduct, [admin, editingId])
  const resetForm = () => {
    images.forEach((image) => image.file && URL.revokeObjectURL(image.imageUrl))
    setForm(emptyProduct); setImages([]); setEditingId(null); setError("")
  }

  const uploadNewImages = async () => {
    const files = images.flatMap((image) =>
      image.file ? [image.file] : []
    )

    if (!files.length) {
      return new Map<string, string>()
    }

    const formData = new FormData()

    files.forEach((file) => {
      formData.append("files", file)
    })

    const token = localStorage.getItem("adminToken")

    if (!token) {
      throw new Error("Session expirée. Veuillez vous reconnecter.")
    }


    const data = new FormData()

    files.forEach((file) => {
      data.append("files", file)
    })

    console.log("TOKEN =", token)
    console.log("FILES =", files)
    console.log("FILES COUNT =", files.length)

    for (const pair of data.entries()) {
      console.log(pair[0], pair[1])
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/products/upload-images`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    )

    const payload = await response.json().catch(() => [])

    if (!response.ok) {
      throw new Error(
        payload.message || "Impossible d’importer les images"
      )
    }

    const uploadedUrls = payload as string[]

    const map = new Map<string, string>()

    let index = 0

    images.forEach((image) => {
      if (image.file) {
        map.set(image.key, uploadedUrls[index++])
      }
    })

    return map
  }



  const buildAttributesPayload = (
  attributes: Product["attributes"] | undefined,
  isUpdate: boolean
) => {
  if (!attributes) {
    return []
  }

  // ==========================================
  // UPDATE
  // ==========================================
  if (isUpdate) {
    return attributes
  }

  // ==========================================
  // CREATE
  // ==========================================
  return attributes.map((attribute) => ({
    name: attribute.name,
    nameAr: attribute.nameAr,
    values: (attribute.values ?? []).map((value) => ({
      value: value.value,
      valueAr: value.valueAr,
    })),
  }))
}

const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault()
  setError("")
  setIsSaving(true)

  try {
    if (
      !form.nameFr?.trim() ||
      !form.nameAr?.trim() ||
      !form.descriptionFr?.trim() ||
      !form.descriptionAr?.trim()
    ) {
      throw new Error("Tous les champs bilingues sont requis")
    }

    if (!form.categoryId) {
      throw new Error("Une catégorie est requise")
    }

    if (!images.length) {
      throw new Error("Ajoutez au moins une image")
    }

    const uploaded = await uploadNewImages()

    const imageUrls = images.map(
      (image) =>
        uploaded.get(image.key) ?? image.imageUrl
    )

    const attributesPayload = buildAttributesPayload(
      form.attributes,
      Boolean(editingId)
    )

    const payload = {
      nameFr: form.nameFr,
      nameAr: form.nameAr,
      descriptionFr: form.descriptionFr,
      descriptionAr: form.descriptionAr,
      categoryId: form.categoryId,
      price: form.price ?? 0,
      originalPrice: form.originalPrice ?? null,
      tag: form.tag || null,
      quantity: form.quantity ?? 0,
      imageUrls,
      attributes: attributesPayload,
    }

    console.log("========== PRODUCT PAYLOAD ==========")
    console.log(
      JSON.stringify(payload, null, 2)
    )
    console.log(
      "MODE =",
      editingId ? "UPDATE" : "CREATE"
    )
    console.log(
      "ATTRIBUTES =",
      payload.attributes
    )
    console.log("====================================")

    const endpoint =
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/products` +
      `${editingId ? `/${editingId}` : ""}`

    const token = localStorage.getItem("adminToken")

    if (!token) {
      throw new Error(
        "Session expirée. Veuillez vous reconnecter."
      )
    }

    const response = await fetch(endpoint, {
      method: editingId ? "PUT" : "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })

    const data = await response
      .json()
      .catch(() => ({}))

    if (!response.ok) {
      throw new Error(
        data.details?.[0] ||
        data.message ||
        data.error ||
        "Impossible d’enregistrer le produit"
      )
    }

    const wasEditing = Boolean(editingId)

    resetForm()

    await refreshProducts(false)

    const message = wasEditing
      ? admin.productUpdated
      : admin.productAdded

    setSuccessMessage(message)

    setToast({
      message,
      type: "success",
    })

  } catch (submissionError) {

    const message =
      submissionError instanceof Error
        ? submissionError.message
        : admin.saveError

    setError(message)

    setToast({
      message,
      type: "error",
    })

  } finally {
    setIsSaving(false)
  }
}

  const handleDelete = async (id: string) => {
    setIsDeleting((previous) => new Set(previous).add(id))
    try {
      const token = localStorage.getItem("adminToken")

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/products/${id}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      if (!response.ok) throw new Error(admin.errors.PRODUCT_DELETE_FAILED)
      await refreshProducts(false); setSuccessMessage(admin.productDeleted); setToast({ message: admin.productDeleted, type: "success" })
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : admin.deleteError
      setError(message); setToast({ message, type: "error" })
    } finally { setIsDeleting((previous) => { const next = new Set(previous); next.delete(id); return next }) }
  }

  const handleEdit = (product: Product) => {
    setEditingId(product.id)

    // Le backend retourne actuellement :
    // category: { id, nameFr, nameAr }
    //
    // Le formulaire utilise :
    // categoryId
    //
    // On récupère donc l'ID depuis category.id.
    const categoryId =
      product.categoryId ||
      product.category?.id ||
      ""

    const productForForm: Product = {
      ...product,

      // IMPORTANT :
      // utiliser l'ID de la catégorie retournée par le backend
      categoryId,

      // Garder les attributs existants
      attributes: product.attributes ?? [],
    }

    console.log("========== EDIT PRODUCT ==========")
    console.log("Product ID:", product.id)
    console.log("Backend category:", product.category)
    console.log("Backend categoryId:", product.categoryId)
    console.log("Resolved categoryId:", categoryId)
    console.log("Attributes:", product.attributes)
    console.log("==================================")

    setForm(productForForm)

    const existing = product.images?.length
      ? product.images
      : [{ imageUrl: product.image }]

    setImages(
      existing.map((image, index) => ({
        key: `stored-${image.id ?? index}`,
        imageUrl: image.imageUrl
      }))
    )

    setError("")
  }

  return <div>
    <div className="grid gap-6 xl:grid-cols-[380px_1fr] xl:items-start xl:gap-8">
      <div className="xl:sticky xl:top-6"><ProductForm form={form} formTitle={formTitle} onSubmit={handleSubmit} onReset={resetForm} onFormChange={setForm} images={images} onImagesChange={setImages} categories={categories} products={products} error={error} isSaving={isSaving} editingId={editingId} formRef={formRef} firstInputRef={firstInputRef} highlightForm={highlightForm} onCategoryDeleted={refreshCategories} /></div>
      <ProductList products={products} categories={categories} onEdit={handleEdit} onDelete={handleDelete} language={language} isDeleting={isDeleting} onStockUpdated={() => refreshProducts(false)} />
    </div>
    {successMessage && <SuccessMessage message={successMessage} onClose={() => setSuccessMessage("")} />}
    {toast && <StatusToast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
  </div>
}
