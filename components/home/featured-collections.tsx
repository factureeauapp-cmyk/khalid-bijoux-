"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

const collections = [
  {
    id: 1,
    title: "Bridal Collection",
    description: "Timeless pieces for your special day",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80",
    href: "/shop?category=Wedding%20Sets",
  },
  {
    id: 2,
    title: "Diamond Jewellery",
    description: "Brilliance that captivates",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80",
    href: "/shop?category=Rings",
  },
  {
    id: 3,
    title: "Temple Collection",
    description: "Heritage meets elegance",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80",
    href: "/shop?category=Temple%20Jewellery",
  },
]

export function FeaturedCollections() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Our <span className="gold-gradient-text">Collections</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our curated collections, each piece meticulously crafted to celebrate your most precious moments.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Link href={collection.href} className="group block">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden gold-border gold-border-hover">
                  <Image
                    src={collection.image}
                    alt={collection.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-serif text-2xl text-foreground mb-2 group-hover:text-primary transition-colors">
                      {collection.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {collection.description}
                    </p>
                    <span className="inline-flex items-center text-primary text-sm font-medium group-hover:gap-3 gap-2 transition-all">
                      Explore
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
