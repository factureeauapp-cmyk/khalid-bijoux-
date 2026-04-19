"use client"

import Image from "next/image"
import { useState, useMemo } from "react"
import { AlertCircle, Filter, Phone, Trash2 } from "lucide-react"
import type { CustomerOrder } from "@/lib/store-types"

interface OrdersListProps {
  orders: CustomerOrder[]
  onStatusChange: (orderNumber: string, status: string) => Promise<void>
  onCancel?: (orderNumber: string) => Promise<void>
  language: "fr" | "ar"
}

const statusConfig: Record<string, { label: string; className: string; color: string }> = {
  pending: {
    label: "En attente",
    className: "border-amber-400/30 bg-amber-500/10 text-amber-300",
    color: "bg-amber-500",
  },
  shipped: {
    label: "Expédiée",
    className: "border-blue-400/30 bg-blue-500/10 text-blue-300",
    color: "bg-blue-500",
  },
  delivered: {
    label: "Livrée",
    className: "border-emerald-400/30 bg-emerald-500/10 text-emerald-300",
    color: "bg-emerald-500",
  },
  cancelled: {
    label: "Annulée",
    className: "border-rose-400/30 bg-rose-500/10 text-rose-300",
    color: "bg-rose-500",
  },
}

export function OrdersList({ orders, onStatusChange, onCancel, language }: OrdersListProps) {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [error, setError] = useState("")

  const filteredOrders = useMemo(() => {
    if (!selectedStatus) return orders
    return orders.filter((order) => order.status?.toLowerCase() === selectedStatus.toLowerCase())
  }, [orders, selectedStatus])

  const statusGroups = useMemo(() => {
    const groups: Record<string, number> = {
      pending: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    }
    orders.forEach((order) => {
      const status = (order.status || "pending").toLowerCase()
      if (status in groups) {
        groups[status]++
      }
    })
    return groups
  }, [orders])

  const handleStatusChange = async (orderNumber: string, newStatus: string) => {
    setUpdatingId(orderNumber)
    setError("")
    try {
      await onStatusChange(orderNumber, newStatus)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la mise à jour")
    } finally {
      setUpdatingId(null)
    }
  }

  const handleCancel = async (orderNumber: string) => {
    if (!confirm("Êtes-vous sûr de vouloir annuler cette commande ?")) return
    if (!onCancel) return

    setUpdatingId(orderNumber)
    setError("")
    try {
      await onCancel(orderNumber)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'annulation")
    } finally {
      setUpdatingId(null)
    }
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-[24px] border border-white/10 bg-white/5 p-8 text-center">
        <AlertCircle className="mx-auto mb-3 h-8 w-8 text-white/40" />
        <p className="text-white/60">Aucune commande pour le moment.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Status Filters */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedStatus(null)}
          className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition-all ${
            selectedStatus === null
              ? "bg-[#c9a84c] text-black"
              : "border border-white/10 text-white hover:bg-white/10"
          }`}
        >
          <Filter size={16} />
          Toutes ({orders.length})
        </button>
        {Object.entries(statusConfig).map(([status, config]) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition-all ${
              selectedStatus === status
                ? config.className
                : "border border-white/10 text-white hover:bg-white/10"
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${config.color}`} />
            {config.label} ({statusGroups[status as keyof typeof statusGroups]})
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
          {error}
        </div>
      )}

      {/* Orders Grid */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const statusKey = (order.status || "pending").toLowerCase()
          const statusInfo = statusConfig[statusKey] || statusConfig.pending

          return (
            <div key={order.id} className="rounded-[26px] border border-white/10 bg-white/5 p-6 hover:border-white/20 transition-all">
              {/* Header */}
              <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-3">
                    <h3 className="text-2xl font-cormorant text-white">{order.customerName}</h3>
                    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusInfo.className}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-white/70">
                    <p>{order.address}</p>
                    <p>{order.phone}</p>
                    <p>{new Date(order.createdAt).toLocaleString("fr-FR")}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 xl:items-end">
                  <a
                    href={`tel:${order.phone}`}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-[#c9a84c] px-6 py-3 font-medium text-black hover:bg-[#d9b85c] transition-colors"
                  >
                    <Phone size={18} />
                    Appeler
                  </a>
                  <select
                    value={order.status || "pending"}
                    onChange={(e) => handleStatusChange(order.orderNumber, e.target.value)}
                    disabled={updatingId === order.orderNumber}
                    className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-[#c9a84c]/50 disabled:opacity-50 transition-colors"
                  >
                    <option value="pending">En attente</option>
                    <option value="shipped">Expédiée</option>
                    <option value="delivered">Livrée</option>
                    <option value="cancelled">Annulée</option>
                  </select>
                  {onCancel && (
                    <button
                      onClick={() => handleCancel(order.orderNumber)}
                      disabled={updatingId === order.orderNumber || order.status === "delivered" || order.status === "cancelled"}
                      className="flex items-center justify-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-400 hover:bg-rose-500/20 transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                      {updatingId === order.orderNumber ? "..." : "Annuler"}
                    </button>
                  )}
                </div>
              </div>

              {/* Items Grid */}
              <div className="grid gap-4 lg:grid-cols-2">
                {order.items?.map((item) => (
                  <div
                    key={`${order.id}-${item.productId}`}
                    className="flex gap-4 rounded-2xl border border-white/10 bg-black/20 p-4 hover:border-white/20 transition-all"
                  >
                    <div className="relative h-24 w-24 overflow-hidden rounded-2xl bg-black/30 flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={language === "ar" ? item.productNameAr : item.productNameFr || "Produit"}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white truncate">
                        {language === "ar" ? item.productNameAr : item.productNameFr}
                      </h4>
                      <p className="text-sm text-white/60">Quantité: {item.quantity}</p>
                      <p className="text-sm font-medium text-[#e8c97e]">{item.unitPrice} MAD</p>
                      <p className="text-xs text-white/40 mt-1">Total: {item.quantity * item.unitPrice} MAD</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="mt-6 flex justify-end border-t border-white/10 pt-4">
                <div className="text-right">
                  <p className="text-sm text-white/60 mb-1">Montant total</p>
                  <p className="text-2xl font-semibold text-[#e8c97e]">{order.total} MAD</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredOrders.length === 0 && selectedStatus && (
        <div className="rounded-[24px] border border-white/10 bg-white/5 p-8 text-center">
          <p className="text-white/60">Aucune commande avec ce statut.</p>
        </div>
      )}
    </div>
  )
}
