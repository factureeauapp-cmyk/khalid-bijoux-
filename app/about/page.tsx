"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Diamond, Award, Users, Heart } from "lucide-react"
import { siteConfig } from "@/lib/config"

const timeline = [
  {
    year: "1965",
    title: "The Beginning",
    description: "Shri Kantilal Shah established a small jewellery workshop in Manek Chowk, Ahmedabad, with a vision to create jewellery that tells stories.",
  },
  {
    year: "1985",
    title: "Second Generation",
    description: "Sons Rajesh and Mahesh joined the family business, bringing fresh perspectives while honoring traditional craftsmanship.",
  },
  {
    year: "2000",
    title: "Expansion",
    description: "Opened our flagship showroom in CG Road, becoming one of Ahmedabad's most trusted jewellery destinations.",
  },
  {
    year: "2015",
    title: "Third Generation",
    description: "The new generation brings innovation with digital presence while maintaining our commitment to quality.",
  },
  {
    year: "2024",
    title: "Modern Legacy",
    description: "Combining 60 years of expertise with modern technology to serve customers across India.",
  },
]

const values = [
  {
    icon: Diamond,
    title: "Uncompromising Quality",
    description: "Every piece is crafted with the finest materials and undergoes rigorous quality checks.",
  },
  {
    icon: Award,
    title: "Master Craftsmanship",
    description: "Our artisans bring generations of expertise to every creation.",
  },
  {
    icon: Users,
    title: "Customer First",
    description: "Building lifelong relationships through exceptional service and trust.",
  },
  {
    icon: Heart,
    title: "Passion for Perfection",
    description: "Every detail matters in our pursuit of creating timeless pieces.",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920&q=80"
            alt="About Shalby Jewels"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 container mx-auto px-4 text-center"
        >
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
            Our <span className="gold-gradient-text">Story</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Three generations of passion, craftsmanship, and dedication to creating jewellery that becomes part of your family&apos;s story.
          </p>
        </motion.div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-6">
                A Legacy of <span className="gold-gradient-text">Excellence</span>
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  In the bustling lanes of Manek Chowk, Ahmedabad&apos;s historic jewellery market, {siteConfig.name} was born in 1965 from a simple dream - to create jewellery that captures the essence of Indian heritage while embracing timeless elegance.
                </p>
                <p>
                  Our founder, Shri Kantilal Shah, believed that every piece of jewellery should tell a story. Starting with a small workshop and a handful of skilled artisans, he laid the foundation of what would become one of Gujarat&apos;s most trusted jewellery houses.
                </p>
                <p>
                  Today, three generations later, we continue to honor that legacy. Our master craftsmen blend traditional techniques passed down through generations with modern precision, creating pieces that are both works of art and treasured heirlooms.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden gold-border">
                <Image
                  src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80"
                  alt="Craftsmanship"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 gold-gradient rounded-2xl flex items-center justify-center">
                <div className="text-center text-primary-foreground">
                  <span className="block text-3xl font-serif font-bold">60+</span>
                  <span className="text-sm">Years</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
              Our <span className="gold-gradient-text">Values</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 gold-gradient rounded-full flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-serif text-xl text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
              Our <span className="gold-gradient-text">Journey</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Milestones that shaped who we are today.
            </p>
          </motion.div>

          <div className="relative max-w-3xl mx-auto">
            {/* Timeline Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-primary to-transparent" />

            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex items-start gap-8 mb-12 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Dot */}
                <div className="absolute left-8 md:left-1/2 w-4 h-4 -translate-x-1/2 rounded-full gold-gradient" />

                {/* Content */}
                <div
                  className={`ml-16 md:ml-0 md:w-1/2 ${
                    index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"
                  }`}
                >
                  <span className="text-primary font-serif text-2xl">{item.year}</span>
                  <h3 className="font-serif text-xl text-foreground mt-2 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Stats */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "60+", label: "Years of Excellence" },
              { number: "50K+", label: "Happy Customers" },
              { number: "100+", label: "Master Artisans" },
              { number: "10K+", label: "Unique Designs" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <span className="font-serif text-4xl md:text-5xl gold-gradient-text">
                  {stat.number}
                </span>
                <p className="text-muted-foreground mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
