"use client"

import { useEffect } from "react"
import { Check, X } from "lucide-react"

interface SuccessMessageProps {
  message: string
  onClose: () => void
}

export function SuccessMessage({ message, onClose }: SuccessMessageProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-emerald-400 animate-in fade-in slide-in-from-bottom-4">
      <Check size={20} />
      <p className="text-sm font-medium">{message}</p>
      <button onClick={onClose} className="ml-2 text-emerald-400/60 hover:text-emerald-400">
        <X size={16} />
      </button>
    </div>
  )
}
