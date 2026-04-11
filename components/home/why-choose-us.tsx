"use client"

import { motion } from "framer-motion"
import { Diamond, Shield, Award, Truck, Gem, RefreshCw } from "lucide-react"

const features = [
  {
    icon: Diamond,
    title: "Certified Quality",
    description: "Every diamond and gemstone is certified by leading international laboratories.",
  },
  {
    icon: Shield,
    title: "Lifetime Warranty",
    description: "Our jewellery comes with a lifetime warranty on craftsmanship and materials.",
  },
  {
    icon: Award,
    title: "60+ Years Legacy",
    description: "Three generations of master craftsmen ensuring unparalleled excellence.",
  },
  {
    icon: Truck,
    title: "Insured Delivery",
    description: "Free insured shipping across India with real-time tracking.",
  },
  {
    icon: Gem,
    title: "BIS Hallmarked",
    description: "All gold jewellery is BIS hallmarked for guaranteed purity.",
  },
  {
    icon: RefreshCw,
    title: "Easy Exchange",
    description: "Hassle-free 30-day exchange policy on all purchases.",
  },
]

export function WhyChooseUs() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Why Choose <span className="gold-gradient-text">Us</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience the difference of shopping with a trusted family-owned jeweller with over six decades of excellence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="p-8 rounded-2xl bg-card border border-border gold-border-hover transition-all duration-300 h-full">
                <div className="w-14 h-14 rounded-xl gold-gradient flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="font-serif text-xl text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
