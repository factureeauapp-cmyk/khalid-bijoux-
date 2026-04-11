"use client"

import { motion } from "framer-motion"
import { X, SlidersHorizontal } from "lucide-react"
import { categories } from "@/data/products"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

interface ShopFiltersProps {
  isOpen: boolean
  onClose: () => void
  filters: {
    category: string
    priceRange: [number, number]
    karat: string
    gender: string
  }
  setFilters: React.Dispatch<React.SetStateAction<{
    category: string
    priceRange: [number, number]
    karat: string
    gender: string
  }>>
}

const karatOptions = ["All", "18K", "22K", "Platinum", "Pure Silver"]
const genderOptions = ["All", "Women", "Men", "Unisex"]

export function ShopFilters({ isOpen, onClose, filters, setFilters }: ShopFiltersProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  const clearFilters = () => {
    setFilters({
      category: "All",
      priceRange: [0, 1000000],
      karat: "All",
      gender: "All",
    })
  }

  const hasActiveFilters =
    filters.category !== "All" ||
    filters.karat !== "All" ||
    filters.gender !== "All" ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 1000000

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Filters Panel */}
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={cn(
          "fixed lg:relative lg:translate-x-0 top-0 left-0 h-full lg:h-auto w-80 lg:w-64",
          "bg-card lg:bg-transparent border-r border-border lg:border-0",
          "z-50 lg:z-0 overflow-y-auto",
          "transition-transform lg:transition-none"
        )}
      >
        <div className="p-6 lg:p-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 lg:mb-6">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-primary" />
              <h3 className="font-serif text-lg text-foreground">Filters</h3>
            </div>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary hover:underline"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={onClose}
                className="lg:hidden p-2 text-muted-foreground hover:text-foreground"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="mb-8">
            <h4 className="text-sm font-medium text-foreground mb-4">Category</h4>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setFilters((prev) => ({ ...prev, category }))}
                  className={cn(
                    "block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                    filters.category === category
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-8">
            <h4 className="text-sm font-medium text-foreground mb-4">Price Range</h4>
            <Slider
              value={filters.priceRange}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, priceRange: value as [number, number] }))
              }
              min={0}
              max={1000000}
              step={10000}
              className="mb-4"
            />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{formatPrice(filters.priceRange[0])}</span>
              <span>{formatPrice(filters.priceRange[1])}</span>
            </div>
          </div>

          {/* Karat */}
          <div className="mb-8">
            <h4 className="text-sm font-medium text-foreground mb-4">Karat / Metal</h4>
            <div className="flex flex-wrap gap-2">
              {karatOptions.map((karat) => (
                <button
                  key={karat}
                  onClick={() => setFilters((prev) => ({ ...prev, karat }))}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm border transition-colors",
                    filters.karat === karat
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary"
                  )}
                >
                  {karat}
                </button>
              ))}
            </div>
          </div>

          {/* Gender */}
          <div className="mb-8">
            <h4 className="text-sm font-medium text-foreground mb-4">Gender</h4>
            <div className="flex flex-wrap gap-2">
              {genderOptions.map((gender) => (
                <button
                  key={gender}
                  onClick={() => setFilters((prev) => ({ ...prev, gender }))}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm border transition-colors",
                    filters.gender === gender
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary"
                  )}
                >
                  {gender}
                </button>
              ))}
            </div>
          </div>

          {/* Apply Button (Mobile) */}
          <Button
            onClick={onClose}
            className="w-full gold-gradient text-primary-foreground lg:hidden"
          >
            Apply Filters
          </Button>
        </div>
      </motion.aside>
    </>
  )
}
