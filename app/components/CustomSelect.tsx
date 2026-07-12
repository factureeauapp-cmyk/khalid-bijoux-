"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronDown, Check } from "lucide-react"

interface Option {
  value: string
  label: string
}

interface CustomSelectProps {
  value: string
  options: Option[]
  placeholder: string
  onChange: (value: string) => void
}

export default function CustomSelect({
  value,
  options,
  placeholder,
  onChange,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () =>
      document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const selected = options.find((o) => o.value === value)

  return (
    <div className="relative w-full" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-14 w-full items-center justify-between rounded-2xl border border-[#C9A84C]/20 bg-[#111111] px-5 text-white transition-all duration-300 hover:border-[#C9A84C] hover:bg-[#171717]"
      >
        <span className="truncate">
          {selected?.label || placeholder}
        </span>

        <ChevronDown
          size={18}
          className={`text-[#C9A84C] transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 max-h-72 w-full overflow-auto rounded-2xl border border-[#C9A84C]/20 bg-[#111111] p-2 shadow-2xl backdrop-blur">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value)
                setOpen(false)
              }}
              className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition-all duration-200 ${
                value === option.value
                  ? "bg-gradient-to-r from-[#C9A84C] to-[#E8C97E] text-black"
                  : "text-white hover:bg-[#1C1C1C] hover:text-[#E8C97E]"
              }`}
            >
              <span>{option.label}</span>

              {value === option.value && (
                <Check size={16} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}