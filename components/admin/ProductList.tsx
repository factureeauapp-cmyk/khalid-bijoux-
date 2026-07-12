"use client"

import { useState } from "react"
import Image from "next/image"
import { Trash2, Edit, AlertCircle } from "lucide-react"
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog"
import type { Category, Product } from "@/lib/store-types"

interface ProductListProps {
  products: Product[]
  categories: Category[]
  onEdit: (product: Product) => void
  onDelete: (id: string) => Promise<void>
  language: "fr" | "ar"
  isDeleting: Set<string>
}

export function ProductList({ products, categories, onEdit, onDelete, language, isDeleting }: ProductListProps) {
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const getCategoryLabel = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    if (!category) return "—"
    return language === "ar" ? category.nameAr : category.nameFr
  }

  const getProductName = (product: Product) => (language === "ar" ? product.nameAr : product.nameFr)

  const openDeleteDialog = (product: Product) => {
    setDeleteTarget(product)
    setDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return

    await onDelete(deleteTarget.id)

    setDialogOpen(false)
    setDeleteTarget(null)
  }

  if (products.length === 0) {
    return (
      <div className="rounded-[24px] border border-white/10 bg-white/5 p-8 text-center">
        <AlertCircle className="mx-auto mb-3 h-8 w-8 text-white/40" />
        <p className="text-white/60">Aucun produit pour le moment.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {products.map((product) => (
        <div key={product.id} className="group rounded-[24px] border border-white/10 bg-white/5 p-5 hover:border-white/20 hover:bg-white/[0.08] transition-all">
          {/* Image */}
          <div className="relative mb-4 h-48 overflow-hidden rounded-2xl bg-black/30">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={getProductName(product) || "Produit"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform"
            />
            {product.tag && (
              <div className="absolute top-3 right-3">
                <span className="inline-block rounded-full border border-[#c9a84c]/50 bg-black/60 px-3 py-1 text-xs font-semibold text-[#c9a84c]">
                  {product.tag}
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-2">
            <div>
              <h3 className="text-xl font-cormorant text-white">{getProductName(product)}</h3>
              <div className="flex items-center gap-2 text-xs text-white/50 mt-1">
                <span className="inline-block rounded-full bg-[#c9a84c]/10 px-2 py-1 text-[#c9a84c]">
                  {getCategoryLabel(product.categoryId)}
                </span>
              </div>
            </div>

            <p className="text-sm text-white/70 line-clamp-2">{language === "ar" ? product.descriptionAr : product.descriptionFr}</p>

            {/* Price */}
            <div className="flex items-baseline gap-2 pt-2">
              <span className="text-lg font-semibold text-[#c9a84c]">{product.price} MAD</span>
              {product.originalPrice && <span className="text-sm text-white/40 line-through">{product.originalPrice} MAD</span>}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => onEdit(product)}
              className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-[#c9a84c]/30 bg-[#c9a84c]/10 px-3 py-2 text-sm font-medium text-[#c9a84c] hover:bg-[#c9a84c]/20 transition-colors"
            >
              <Edit size={16} />
              Modifier
            </button>
            <button
              onClick={() => openDeleteDialog(product)}
              disabled={isDeleting.has(product.id)}
              className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm font-medium text-rose-400 hover:bg-rose-500/20 transition-colors disabled:opacity-50"
            >
              <Trash2 size={16} />
              {isDeleting.has(product.id) ? "..." : "Supprimer"}
            </button>
          </div>
        </div>
      ))}



      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent className="border border-[#C9A84C]/20 bg-[#111111] text-white rounded-3xl">

          <AlertDialogHeader>

            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10">
              <Trash2 className="text-red-500" size={28} />
            </div>

            <AlertDialogTitle className="text-center text-2xl font-cormorant">
              Supprimer le produit ?
            </AlertDialogTitle>

            <AlertDialogDescription className="text-center text-white/70 leading-7">

              Êtes-vous sûr de vouloir supprimer

              <br />

              <span className="font-semibold text-[#E8C97E]">
                {deleteTarget ? getProductName(deleteTarget) : ""}
              </span>

              ?

              <br />

              Cette action est irréversible.

            </AlertDialogDescription>

          </AlertDialogHeader>

          <AlertDialogFooter>

            <AlertDialogCancel
              className="rounded-xl border border-white/10 bg-[#1A1A1A] text-white hover:bg-[#222]"
            >
              Annuler
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={confirmDelete}
              className="rounded-xl bg-red-600 text-white hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>

          </AlertDialogFooter>

        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
