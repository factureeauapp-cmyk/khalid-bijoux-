"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useAppContext } from "@/app/providers/AppContext"
import { ProductForm } from "@/components/admin/ProductForm"
import { ProductList } from "@/components/admin/ProductList"
import { SuccessMessage } from "@/components/admin/SuccessMessage"
import { StatusToast } from "@/components/admin/StatusToast"
import type { Product } from "@/lib/store-types"

const emptyProduct: Partial<Product> = {
  id: "",
  nameFr: "",
  nameAr: "",
  categoryId: "",
  price: 0,
  quantity: 0,
  descriptionFr: "",
  descriptionAr: "",
  image: "/khalid-bijoux.png",
  tag: "",
}

/**
 * /admin/products
 * Toute la logique CRUD produit est déplacée ICI à l'identique depuis
 * l'ancien app/admin/page.tsx : handleSubmit, handleDelete, handleEdit,
 * resetForm, la preview image, le toast et le SuccessMessage.
 * AUCUN appel API, AUCUNE validation, AUCUN message d'erreur n'a été modifié.
 */
export default function AdminProductsPage() {
  const { t, language, products, categories, refreshProducts, refreshCategories } = useAppContext()
  const admin = t("admin")

  const adminErrors = admin.errors

  const [form, setForm] = useState<Partial<Product>>(emptyProduct)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>(emptyProduct.image!)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [isDeleting, setIsDeleting] = useState<Set<string>>(new Set())
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const formRef = useRef<HTMLFormElement | null>(null)
  const firstInputRef = useRef<HTMLInputElement | null>(null)
  const [highlightForm, setHighlightForm] = useState(false)
  const [editTrigger, setEditTrigger] = useState(0)

  useEffect(() => {
    void refreshProducts()
    void refreshCategories()
  }, [refreshProducts, refreshCategories])

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

      const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

      const endpoint = editingId
        ? `${API_URL}/products/${editingId}`
        : `${API_URL}/products`;
      const method = editingId ? "PUT" : "POST"
      const payload = new FormData()

      payload.append("nameFr", form.nameFr)
      payload.append("nameAr", form.nameAr)
      payload.append("descriptionFr", form.descriptionFr)
      payload.append("descriptionAr", form.descriptionAr)
      payload.append("categoryId", form.categoryId)
      payload.append("price", String(form.price || 0))
      payload.append("quantity", String(form.quantity ?? 0))
      payload.append("originalPrice", String(form.originalPrice ?? ""))
      payload.append("tag", form.tag ?? "")

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
          INVALID_PRODUCT_PAYLOAD: adminErrors.INVALID_PRODUCT_PAYLOAD,
          CATEGORY_REQUIRED: adminErrors.CATEGORY_REQUIRED,
          CATEGORY_NOT_FOUND: adminErrors.CATEGORY_NOT_FOUND,
          IMAGE_REQUIRED: adminErrors.IMAGE_REQUIRED,
          INVALID_FILE_TYPE: adminErrors.INVALID_FILE_TYPE,
          FILE_TOO_LARGE: adminErrors.FILE_TOO_LARGE,
          PRODUCT_CREATE_FAILED: adminErrors.PRODUCT_CREATE_FAILED,
          PRODUCT_UPDATE_FAILED: adminErrors.PRODUCT_UPDATE_FAILED,
          PRODUCT_SAVE_FAILED: adminErrors.PRODUCT_SAVE_FAILED,
        }

        throw new Error(
          errorMap[data.error] ??
          data.message ??
          data.error ??
          admin.saveError
        )
      }

      // ---------------------
      // Succès
      // ---------------------

      resetForm()

      await refreshProducts()

      setSuccessMessage(
        editingId
          ? admin.productUpdated
          : admin.productAdded
      )

      setToast({
        message: editingId
          ? admin.productUpdated
          : admin.productAdded,
        type: "success",
      })

    } catch (submissionError) {
      setError(
        submissionError instanceof Error ? submissionError.message : admin.saveError
      )

      setToast({
        message:
          submissionError instanceof Error
            ? submissionError.message
            : admin.saveError,
        type: "error",
      })

    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    setIsDeleting((prev) => new Set(prev).add(id))
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(`${API_URL}/products/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error(adminErrors.PRODUCT_DELETE_FAILED)
      await refreshProducts()
      setSuccessMessage(admin.productDeleted)
      setToast({
        message: admin.productDeleted,
        type: "success"
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : admin.deleteError)
      setToast({ message: err instanceof Error ? err.message : admin.deleteError, type: "error" })
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

  return (
    <div>
      <div className="grid gap-6 xl:grid-cols-[380px_1fr] xl:items-start xl:gap-8">
        <div className="xl:sticky xl:top-6">
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
        </div>

        <ProductList
          products={products}
          categories={categories}
          onEdit={handleEdit}
          onDelete={handleDelete}
          language={language}
          isDeleting={isDeleting}
          onStockUpdated={refreshProducts}
        />
      </div>

      {successMessage && (
        <SuccessMessage message={successMessage} onClose={() => setSuccessMessage("")} />
      )}
      {toast && <StatusToast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}