"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Search, SlidersHorizontal, Grid, LayoutGrid } from "lucide-react"
import { products } from "@/data/products"
import { ProductCard } from "@/components/products/product-card"
import { ShopFilters } from "@/components/shop/shop-filters"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const ITEMS_PER_PAGE = 8

export function ShopContent() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")

  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [gridCols, setGridCols] = useState<2 | 3 | 4>(4)
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE)
  const [filters, setFilters] = useState({
    category: categoryParam || "All",
    priceRange: [0, 1000000] as [number, number],
    karat: "All",
    gender: "All",
  })

  useEffect(() => {
    if (categoryParam) {
      setFilters((prev) => ({ ...prev, category: categoryParam }))
    }
  }, [categoryParam])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search
      if (
        searchQuery &&
        !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false
      }

      // Category
      if (filters.category !== "All" && product.category !== filters.category) {
        return false
      }

      // Price
      if (
        product.price < filters.priceRange[0] ||
        product.price > filters.priceRange[1]
      ) {
        return false
      }

      // Karat
      if (filters.karat !== "All" && product.karat !== filters.karat) {
        return false
      }

      // Gender
      if (
        filters.gender !== "All" &&
        product.gender !== filters.gender.toLowerCase()
      ) {
        return false
      }

      return true
    })
  }, [searchQuery, filters])

  const displayedProducts = filteredProducts.slice(0, displayCount)
  const hasMore = displayCount < filteredProducts.length

  const loadMore = () => {
    setDisplayCount((prev) => prev + ITEMS_PER_PAGE)
  }

  return (
    <div className="container mx-auto px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">
          Our <span className="gold-gradient-text">Collection</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore our exquisite range of handcrafted jewellery, each piece a testament to our commitment to excellence.
        </p>
      </motion.div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search jewellery..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="flex items-center gap-4">
          {/* Filter Toggle (Mobile) */}
          <Button
            variant="outline"
            onClick={() => setIsFiltersOpen(true)}
            className="lg:hidden border-border"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
          </Button>

          {/* Grid Toggle */}
          <div className="hidden md:flex items-center gap-1 p-1 bg-card border border-border rounded-lg">
            <button
              onClick={() => setGridCols(2)}
              className={cn(
                "p-2 rounded transition-colors",
                gridCols === 2 ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
              aria-label="2 columns"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setGridCols(3)}
              className={cn(
                "p-2 rounded transition-colors",
                gridCols === 3 ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
              aria-label="3 columns"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setGridCols(4)}
              className={cn(
                "p-2 rounded transition-colors",
                gridCols === 4 ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
              aria-label="4 columns"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          {/* Results Count */}
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {filteredProducts.length} products
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-8">
        {/* Filters Sidebar (Desktop) */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <ShopFilters
            isOpen={true}
            onClose={() => {}}
            filters={filters}
            setFilters={setFilters}
          />
        </div>

        {/* Mobile Filters */}
        <div className="lg:hidden">
          <ShopFilters
            isOpen={isFiltersOpen}
            onClose={() => setIsFiltersOpen(false)}
            filters={filters}
            setFilters={setFilters}
          />
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {displayedProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-4">No products found matching your criteria.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setFilters({
                    category: "All",
                    priceRange: [0, 1000000],
                    karat: "All",
                    gender: "All",
                  })
                  setSearchQuery("")
                }}
                className="border-primary text-primary"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div
                className={cn(
                  "grid gap-6",
                  gridCols === 2 && "grid-cols-1 sm:grid-cols-2",
                  gridCols === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
                  gridCols === 4 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                )}
              >
                {displayedProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>

              {/* Load More */}
              {hasMore && (
                <div className="text-center mt-12">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={loadMore}
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    Load More Products
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
