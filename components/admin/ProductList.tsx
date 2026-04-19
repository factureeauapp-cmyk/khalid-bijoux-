"use client"

import Image from "next/image"
import { Trash2, Edit, AlertCircle } from "lucide-react"
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
  const getCategoryLabel = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    if (!category) return "—"
    return language === "ar" ? category.nameAr : category.nameFr
  }

  const getProductName = (product: Product) => (language === "ar" ? product.nameAr : product.nameFr)

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) return
    await onDelete(id)
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
              onClick={() => handleDelete(product.id)}
              disabled={isDeleting.has(product.id)}
              className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm font-medium text-rose-400 hover:bg-rose-500/20 transition-colors disabled:opacity-50"
            >
              <Trash2 size={16} />
              {isDeleting.has(product.id) ? "..." : "Supprimer"}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
