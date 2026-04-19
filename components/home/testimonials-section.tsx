"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react"
import { testimonials } from "@/data/products"

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const next = () => {
    setIsAutoPlaying(false)
    setCurrent((prev) => (prev + 1) % testimonials.length)
  }

  const prev = () => {
    setIsAutoPlaying(false)
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-24 bg-card overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            What Our <span className="gold-gradient-text">Customers</span> Say
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Hear from our valued customers about their experience with our jewellery.
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="relative">
                <Quote className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 text-primary/20" />
                <p className="font-serif text-xl md:text-2xl text-foreground leading-relaxed mb-8 px-8">
                  &ldquo;{testimonials[current].text}&rdquo;
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-primary mb-4">
                  <Image
                    src={testimonials[current].image || "/placeholder.svg"}
                    alt={testimonials[current].name || "Témoignage"}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <h4 className="font-serif text-lg text-foreground">
                  {testimonials[current].name}
                </h4>
                <p className="text-muted-foreground text-sm mb-3">
                  {testimonials[current].location}
                </p>
                <div className="flex items-center gap-1">
                  {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-12">
            <button
              onClick={prev}
              className="p-3 rounded-full border border-border hover:border-primary hover:text-primary transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsAutoPlaying(false)
                    setCurrent(index)
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === current
                      ? "w-8 bg-primary"
                      : "bg-border hover:bg-primary/50"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="p-3 rounded-full border border-border hover:border-primary hover:text-primary transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
