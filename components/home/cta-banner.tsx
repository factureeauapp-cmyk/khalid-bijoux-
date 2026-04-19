"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/lib/config"

export function CTABanner() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1920&q=80"
          alt="Bijoux de luxe - Appel à l'action"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-background/90" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mb-6">
            Ready to Find Your{" "}
            <span className="gold-gradient-text">Perfect Piece?</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
            Visit our showroom in Ahmedabad or book a personal consultation with our jewellery experts. Let us help you find the perfect piece for your special occasion.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="gold-gradient text-primary-foreground hover:opacity-90 text-lg px-8 py-6 group"
              asChild
            >
              <Link href="/contact">
                Book Appointment
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground text-lg px-8 py-6"
              asChild
            >
              <a href={`tel:${siteConfig.phone}`}>
                <Phone className="w-5 h-5 mr-2" />
                Call Us
              </a>
            </Button>
          </div>

          <p className="mt-8 text-muted-foreground">
            <span className="text-primary">{siteConfig.address}</span>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
