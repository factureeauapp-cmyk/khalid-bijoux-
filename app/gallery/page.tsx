"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

const galleryImages = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80",
    alt: "Bridal necklace set",
    category: "Bridal",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
    alt: "Traditional gold necklace",
    category: "Traditional",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
    alt: "Diamond ring",
    category: "Rings",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
    alt: "Gold earrings",
    category: "Earrings",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
    alt: "Diamond bracelet",
    category: "Bracelets",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1610694955371-d4a3e0ce4b52?w=800&q=80",
    alt: "Gold bangles",
    category: "Bangles",
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&q=80",
    alt: "Wedding ring",
    category: "Rings",
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80",
    alt: "Gold bracelet",
    category: "Bracelets",
  },
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=800&q=80",
    alt: "Gold chain",
    category: "Chains",
  },
  {
    id: 10,
    src: "https://images.unsplash.com/photo-1599459183200-59c3a0e770b9?w=800&q=80",
    alt: "Pendant necklace",
    category: "Pendants",
  },
  {
    id: 11,
    src: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80",
    alt: "Gold jewellery set",
    category: "Traditional",
  },
  {
    id: 12,
    src: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800&q=80",
    alt: "Diamond earrings",
    category: "Earrings",
  },
]

const categories = ["All", "Bridal", "Traditional", "Rings", "Earrings", "Bracelets", "Bangles"]

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const filteredImages =
    selectedCategory === "All"
      ? galleryImages
      : galleryImages.filter((img) => img.category === selectedCategory)

  const openLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)

  const nextImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredImages.length)
    }
  }

  const prevImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredImages.length) % filteredImages.length)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">
            Our <span className="gold-gradient-text">Gallery</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our exquisite collection of handcrafted jewellery pieces.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2 rounded-full text-sm transition-all ${
                selectedCategory === category
                  ? "gold-gradient text-primary-foreground"
                  : "border border-border text-muted-foreground hover:border-primary hover:text-primary"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="break-inside-avoid mb-4"
            >
              <button
                onClick={() => openLightbox(index)}
                className="relative w-full overflow-hidden rounded-xl group gold-border gold-border-hover block"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={400}
                  height={index % 3 === 0 ? 500 : index % 3 === 1 ? 400 : 450}
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-foreground font-medium">{image.alt}</span>
                </div>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {lightboxIndex !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex items-center justify-center"
              onClick={closeLightbox}
            >
              <button
                onClick={closeLightbox}
                className="absolute top-6 right-6 p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close"
              >
                <X className="w-8 h-8" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  prevImage()
                }}
                className="absolute left-6 p-3 bg-card/50 rounded-full text-foreground hover:bg-card transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <motion.div
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative max-w-4xl max-h-[80vh] mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={filteredImages[lightboxIndex].src}
                  alt={filteredImages[lightboxIndex].alt}
                  width={1200}
                  height={800}
                  className="max-h-[80vh] w-auto object-contain rounded-2xl"
                />
                <p className="text-center mt-4 text-foreground font-serif text-lg">
                  {filteredImages[lightboxIndex].alt}
                </p>
              </motion.div>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  nextImage()
                }}
                className="absolute right-6 p-3 bg-card/50 rounded-full text-foreground hover:bg-card transition-colors"
                aria-label="Next"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
