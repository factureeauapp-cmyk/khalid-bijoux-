"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import type { CustomerOrder, OrderStatus } from "@/lib/store-types"
import { useAppContext } from "@/app/providers/AppContext"

interface OrdersListProps {
  orders: CustomerOrder[]
  onStatusChange: (orderNumber: string, status: string) => Promise<void>
  onCancel: (orderNumber: string) => Promise<void>
  language: "fr" | "ar"
}



const STATUS_DOT: Record<string, string> = {
  PENDING: "bg-amber-400",
  CONFIRMED: "bg-blue-400",
  SHIPPED: "bg-blue-400",
  DELIVERED: "bg-emerald-400",
  CANCELLED: "bg-rose-400",
}


const STATUS_BADGE: Record<string, string> = {
  PENDING: "border-amber-400/40 bg-amber-400/10 text-amber-300",
  CONFIRMED: "border-blue-400/40 bg-blue-400/10 text-blue-300",
  SHIPPED: "border-blue-400/40 bg-blue-400/10 text-blue-300",
  DELIVERED: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  CANCELLED: "border-rose-400/40 bg-rose-400/10 text-rose-300",
}




// ⚠️ Route produit à confirmer : adapte ce préfixe à ta vraie page produit
// publique, ou remplace par un lien vers /admin/products si tu préfères
// naviguer côté back-office plutôt que côté site public.
const PRODUCT_ROUTE_PREFIX = "/product"


/**
 * Liste des commandes admin, branchée sur la vraie forme de réponse
 * Spring Boot : order.customer.{firstName,lastName,phoneNumber,email},
 * order.shippingAddress.{street,city,state,postalCode,country},
 * order.items[].{productId,quantity,selectedSize,price,productName,productImage},
 * order.subtotal / order.shipping / order.tax / order.total.
 *
 * onStatusChange et onCancel restent des props (appelées depuis
 * app/admin/orders/page.tsx) : ce composant ne fait aucun appel API lui-même.
 */
export function OrdersList({ orders, onStatusChange, onCancel ,language }: OrdersListProps) {
  const [filter, setFilter] = useState<"ALL" | OrderStatus>("ALL")
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [cancellingId, setCancellingId] = useState<string | null>(null)


  const { t } = useAppContext() as any
const adminT = t("admin")

 const STATUS_LABELS: Record<string, string> = {
    PENDING: adminT.statusPending,
    CONFIRMED: adminT.statusConfirmed,
    SHIPPED: adminT.statusShipped,
    DELIVERED: adminT.statusDelivered,
    CANCELLED: adminT.statusCancelled,
  }

  const FILTER_TABS: { key: "ALL" | OrderStatus; label: string }[] = [
    { key: "ALL", label: adminT.allStatuses },
    { key: "PENDING", label: adminT.statusPending },
    { key: "SHIPPED", label: adminT.statusShipped },
    { key: "DELIVERED", label: adminT.statusDelivered },
    { key: "CANCELLED", label: adminT.statusCancelled },
  ]

  const locale = language === "ar" ? "ar-MA" : "fr-FR"

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleString(locale, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    } catch {
      return iso
    }
  }


  const counts = useMemo(() => {
    const map: Record<string, number> = { ALL: orders.length }
    for (const o of orders) {
      map[o.status] = (map[o.status] ?? 0) + 1
    }
    return map
  }, [orders])

  const filteredOrders = useMemo(
    () => (filter === "ALL" ? orders : orders.filter((o) => o.status === filter)),
    [orders, filter]
  )

  const handleStatusChange = async (orderNumber: string, status: string) => {
    setUpdatingId(orderNumber)
    try {
      await onStatusChange(orderNumber, status)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleCancel = async (orderNumber: string) => {
    setCancellingId(orderNumber)
    try {
      await onCancel(orderNumber)
    } finally {
      setCancellingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Filtres */}
      <div className="flex flex-wrap gap-2.5 sm:gap-3">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-colors sm:px-5 sm:py-2.5 sm:text-sm ${filter === tab.key
                ? "bg-[#c9a84c] text-black"
                : "border border-white/10 text-white hover:bg-white/10"
              }`}
          >
            {tab.key !== "ALL" && (
              <span className={`h-2 w-2 rounded-full ${STATUS_DOT[tab.key] ?? "bg-white/40"}`} />
            )}
            {tab.label} ({counts[tab.key] ?? 0})
          </button>
        ))}
      </div>

      {/* Commandes */}
      {filteredOrders.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-white/50">
          {adminT.noOrdersInCategory}
        </div>
      ) : (
        <div className="space-y-5">
          {filteredOrders.map((order) => {
            const isUpdating = updatingId === order.orderNumber
            const isCancelling = cancellingId === order.orderNumber

            return (
              <div
                key={order.orderNumber}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset] sm:p-6"
              >
                {/* En-tête : statut + date + actions */}
                <div className="mb-5 flex flex-col gap-4 border-b border-white/5 pb-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium ${STATUS_BADGE[order.status] ?? "border-white/20 bg-white/5 text-white/70"
                        }`}
                    >
                      {STATUS_LABELS[order.status] ?? order.status}
                    </span>
                    <p className="mt-2 text-sm text-white/40">{formatDate(order.createdAt)}</p>
                    <p className="mt-0.5 font-mono text-xs tracking-wide text-white/25">{order.orderNumber}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
                    {order.customer?.phoneNumber && (
                      <a
                        href={`tel:${order.customer.phoneNumber}`}
                        className="col-span-1 flex items-center justify-center gap-2 rounded-2xl bg-[#c9a84c] px-4 py-2.5 text-sm font-medium text-black transition-colors hover:bg-[#dab85c] sm:justify-start sm:px-5"
                      >
                        📞 {adminT.call}
                      </a>
                    )}

                    <select
                      value={order.status}
                      disabled={isUpdating}
                      onChange={(e) => handleStatusChange(order.orderNumber, e.target.value)}
                      className="col-span-1 rounded-2xl border border-white/10 bg-[#0c0c0c] px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-[#c9a84c] disabled:opacity-50 sm:col-auto"
                    >
                      {Object.entries(STATUS_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>

                    {order.status !== "CANCELLED" && (
                      <button
                        onClick={() => handleCancel(order.orderNumber)}
                        disabled={isCancelling}
                        className="col-span-2 flex items-center justify-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-sm font-medium text-rose-400 transition-colors hover:bg-rose-500/20 disabled:opacity-50 sm:col-auto sm:px-5"
                      >
                        🗑 {isCancelling ? adminT.cancelling : adminT.cancelBtn}
                      </button>
                    )}
                  </div>
                </div>

                {/* Client + livraison */}
                <div className="mb-5 grid gap-4 rounded-2xl border border-white/5 bg-black/30 p-4 sm:grid-cols-2">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-white/35"> {adminT.customerLabel}</p>
                    <p className="mt-1.5 text-sm font-medium text-white">
                      {order.customer?.firstName} {order.customer?.lastName}
                    </p>
                    <p className="text-sm text-white/55">{order.customer?.phoneNumber}</p>
                    <p className="truncate text-sm text-white/55">{order.customer?.email}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-white/35"> {adminT.shippingLabel}</p>
                    <p className="mt-1.5 text-sm text-white/80">
                      {order.shippingAddress?.street}, {order.shippingAddress?.city}
                    </p>
                    <p className="text-sm text-white/55">
                      {order.shippingAddress?.state} {order.shippingAddress?.postalCode},{" "}
                      {order.shippingAddress?.country}
                    </p>
                  </div>
                </div>

                {/* Articles — cliquables vers la fiche produit */}
                <div className="space-y-2.5">
                  {order.items.map((item) => (
                    <Link
                      key={item.id}
                      href={`${PRODUCT_ROUTE_PREFIX}/${item.productId}`}
                      className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-black/20 p-3.5 transition-colors hover:border-[#c9a84c]/40 hover:bg-black/30 sm:p-4"
                    >
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black sm:h-16 sm:w-16">
                        <Image
                          src={item.productImage || "/khalid-bijoux.png"}
                          alt={item.productName || item.productId}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-white group-hover:text-[#c9a84c]">
                          {item.productName || `${adminT.productFallback} ${item.productId}`}
                        </p>
                        <p className="text-xs text-white/40">
                          {adminT.quantityLabel}: {item.quantity}
                          {item.selectedSize ? ` · ${adminT.sizeLabel}: ${item.selectedSize}` : ""}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-xs text-white/40"> {item.price} {adminT.mad}</p>
                        <p className="text-sm font-medium text-[#c9a84c]">
                         {(item.price * item.quantity).toLocaleString(locale)} {adminT.mad}
                        </p>
                      </div>
                      <span className="hidden shrink-0 text-white/20 transition-colors group-hover:text-[#c9a84c] sm:block">
                        →
                      </span>
                    </Link>
                  ))}
                </div>

                {/* Récapitulatif financier */}
                <div className="mt-5 border-t border-white/10 pt-4 text-sm">
                  <div className="flex justify-between text-white/50">
                   <span>{adminT.subtotal}</span>
                   {order.subtotal.toLocaleString(locale)} {adminT.mad}
                  </div>
                  <div className="flex justify-between text-white/50">
                    <span>{adminT.shippingLabel}</span>
                    <span>
                      {order.shipping.toLocaleString(locale)} {adminT.mad}
                    </span>
                  </div>
                  <div className="flex justify-between text-white/50">
                     <span>{adminT.tax}</span>
                    <span>
                      {order.tax.toLocaleString(locale)} {adminT.mad}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
                    <span className="text-base font-medium text-white">{adminT.totalAmount}</span>
                    <span className="text-lg font-medium text-[#c9a84c]">
                      {order.total.toLocaleString(locale)} {adminT.mad}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}