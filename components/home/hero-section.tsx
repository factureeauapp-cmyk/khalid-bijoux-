"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GoldParticles } from "@/components/animations/gold-particles"
import { siteConfig } from "@/lib/config"

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Parallax */}
      <motion.div style={{ y }} className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920&q=80"
          alt="Luxury jewellery"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </motion.div>

      {/* Gold Particles */}
      <GoldParticles />

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 container mx-auto px-4 text-center"
      >
        {/* <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-8"
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm text-primary">Since 1965 in Ahmedabad</span>
        </motion.div> */}

        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-serif text-4xl md:text-6xl lg:text-7xl xl:text-8xl text-foreground mb-6 leading-tight"
        >
          <span className="block">Where Tradition</span>
          <span className="block gold-gradient-text">Meets Elegance</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Discover our exquisite collection of handcrafted jewellery, where every piece tells a story of heritage, artistry, and timeless beauty.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            size="lg"
            className="gold-gradient text-primary-foreground hover:opacity-90 text-lg px-8 py-6 group"
            asChild
          >
            <Link href="/shop">
              Explore Collection
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground text-lg px-8 py-6"
            asChild
          >
            <Link href="/about">Our Story</Link>
          </Button>
        </motion.div>

        {/* Floating Images */}
        <div className="hidden lg:block">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="absolute left-10 top-1/3 w-48 h-64 rounded-2xl overflow-hidden gold-border gold-glow"
            style={{
              animation: "float 6s ease-in-out infinite",
            }}
          >
            <Image
              src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80"
              alt="Diamond ring"
              fill
              className="object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="absolute right-10 top-1/2 w-40 h-56 rounded-2xl overflow-hidden gold-border gold-glow"
            style={{
              animation: "float 6s ease-in-out infinite 1s",
            }}
          >
            <Image
              src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80"
              alt="Gold earrings"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-primary/50 flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-2 bg-primary rounded-full"
          />
        </motion.div>
      </motion.div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </section>
  )
}
