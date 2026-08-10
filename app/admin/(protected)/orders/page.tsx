"use client"

import { useEffect, useState } from "react"
import { useAppContext } from "@/app/providers/AppContext"
import { OrdersList } from "@/components/admin/OrdersList"
import { SuccessMessage } from "@/components/admin/SuccessMessage"

export default function AdminOrdersPage() {
  const { language, orders, refreshOrders, t } = useAppContext() as any
  const adminT = t("admin")
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    void refreshOrders()
  }, [refreshOrders])

  const updateOrderStatus = async (orderNumber: string, status: string) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(`${API_URL}/orders/${orderNumber}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || adminT.statusUpdateError)
      }

      await refreshOrders()
      setSuccessMessage(adminT.orderStatusUpdated)
    } catch (err) {
      throw err
    }
  }

  const cancelOrder = async (orderNumber: string) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(`${API_URL}/orders/${orderNumber}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || adminT.orderCancelError)
      }

      await refreshOrders()
      setSuccessMessage(adminT.orderCancelled)
    } catch (err) {
      throw err
    }
  }

  return (
    <div>
      <OrdersList orders={orders} onStatusChange={updateOrderStatus} onCancel={cancelOrder} language={language} />
      {successMessage && (
        <SuccessMessage message={successMessage} onClose={() => setSuccessMessage("")} />
      )}
    </div>
  )
}