"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Instagram } from "lucide-react"
import { instagramPosts } from "@/data/products"
import { siteConfig } from "@/lib/config"

export function InstagramSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <a
            href={siteConfig.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 text-primary hover:opacity-80 transition-opacity"
          >
            <Instagram className="w-6 h-6" />
            <span className="text-lg">@shalbyjewels</span>
          </a>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mt-4 mb-4">
            Follow Our <span className="gold-gradient-text">Journey</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get inspired by our latest designs and behind-the-scenes moments on Instagram.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {instagramPosts.map((post, index) => (
            <motion.a
              key={post.id}
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="relative aspect-square rounded-xl overflow-hidden group"
            >
              <Image
                src={post.image}
                alt={`Instagram post ${post.id}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/30 transition-colors flex items-center justify-center">
                <Instagram className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
