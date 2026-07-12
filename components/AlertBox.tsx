"use client"

import { useEffect, useState } from "react"
import { AlertCircle, CheckCircle, X } from "lucide-react"

interface AlertBoxProps {
  type: "success" | "error"
  message: string
  onClose?: () => void
  autoClose?: number // in milliseconds, 0 = no auto close
}

export default function AlertBox({ type, message, onClose, autoClose = 5000 }: AlertBoxProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (autoClose > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose?.()
      }, autoClose)

      return () => clearTimeout(timer)
    }
  }, [autoClose, onClose])

  if (!isVisible) return null

  const isSuccess = type === "success"
  const bgColor = isSuccess ? "bg-green-500/10" : "bg-red-500/10"
  const borderColor = isSuccess ? "border-green-500/30" : "border-red-500/30"
  const textColor = isSuccess ? "text-green-100" : "text-red-100"
  const IconComponent = isSuccess ? CheckCircle : AlertCircle

  const handleClose = () => {
    setIsVisible(false)
    onClose?.()
  }

  return (
    <div
      className={`mb-4 flex items-start gap-3 rounded-2xl border ${borderColor} ${bgColor} p-4 ${textColor}`}
      role="alert"
    >
      <IconComponent size={20} className="mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        <p className="text-sm leading-relaxed">{message}</p>
      </div>
      <button
        onClick={handleClose}
        className="flex-shrink-0 hover:opacity-70 transition-opacity"
        aria-label="Close alert"
      >
        <X size={18} />
      </button>
    </div>
  )
}
