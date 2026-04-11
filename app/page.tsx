"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProductCard from "./components/ProductCard";
import { PRODUCTS } from "@/lib/data";
import { ChevronRight, Sparkles, Shield, Trophy, Star } from "lucide-react";

export default function HomePage() {
  const featuredProducts = PRODUCTS.slice(0, 4);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <main className="min-h-screen bg-black overflow-hidden">
      <Navbar />

      {/* Hero Section - Parallax & Animated */}
      <section ref={heroRef} className="relative h-[110vh] flex flex-col items-center justify-center text-center px-6 pt-20">
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 z-0 overflow-hidden"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[600px] bg-accent/5 blur-[180px] rounded-full animate-pulse" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent/10 blur-[200px] rounded-full" />

          {/* Luxury Grain & Texture */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
        </motion.div>

        <div className="relative z-10 space-y-8 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[10px] md:text-xs tracking-[1em] text-accent font-black uppercase mb-8">The Collection 2026</p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-[56px] md:text-8xl lg:text-[120px] font-cormorant font-bold leading-[0.9] tracking-tight text-white"
          >
            Noble <span className="italic text-[#E8C97E]">Elegance</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.6 }}
            className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed tracking-[0.2em] pt-8 uppercase"
          >
            Curating high-fidelity fine jewelry <br className="hidden md:block" /> for the modern digital sovereign.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-12"
          >
            <Link href="/shop/rings" className="btn-primary group flex items-center">
              Explore Archive <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
            </Link>
            <Link href="/shop/sets" className="btn-secondary">
              DISCOVER SETS
            </Link>
          </motion.div>
        </div>

        {/* Floating background markers */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-12 bottom-32 text-[10px] tracking-[1em] text-accent/30 font-bold vertical-text uppercase hidden lg:block"
        >
          NOIR ÉCLAT ARCHIVE 2026
        </motion.div>
      </section>

      <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto relative">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <p className="text-[10px] tracking-[0.5em] text-[#C9A84C] font-bold uppercase">THE CRAFT</p>
            <h2 className="text-4xl md:text-5xl font-cormorant font-bold text-white leading-tight">Archive <span className="italic text-[#E8C97E]">Excellence</span></h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-white/60 text-sm max-w-md mt-6 md:mt-0 leading-relaxed md:text-right font-medium tracking-widest uppercase"
          >
            We curate high-fidelity artisan jewelry, where digital precision meets traditional gold-smithing artistry.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {[
            { title: "Noble Cast", desc: "Precision cast in royal gold, guided by centuries of master expertise.", icon: <Trophy /> },
            { title: "Starlight Settings", desc: "Revolutionary settings that maximize natural light refraction across every facet.", icon: <Sparkles /> },
            { title: "Aura Certified", desc: "Each piece comes with a digital certification of authenticity and material origin.", icon: <Shield /> },
          ].map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              className="p-10 border border-[#C9A84C]/10 bg-[#141414] space-y-6 transition-all hover:border-[#C9A84C]/30 group"
            >
              <div className="w-14 h-14 bg-[#C9A84C]/10 flex items-center justify-center text-[#C9A84C]">
                {item.icon}
              </div>
              <h3 className="text-2xl font-cormorant font-bold tracking-wide text-white">{item.title}</h3>
              <p className="text-[14px] text-[#A0A0A0] leading-relaxed font-medium tracking-wide">{item.desc}</p>
              <div className="pt-4 flex items-center text-[10px] tracking-[0.3em] font-bold text-[#C9A84C]/50 group-hover:text-[#C9A84C] transition-colors">
                VIEW ARCHIVE <ChevronRight size={14} className="ml-2" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Grid */}
      <section className="py-32 bg-surface/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 space-y-6 md:space-y-0 text-center md:text-left">
            <div className="space-y-2">
              <p className="text-[10px] tracking-[0.4em] text-[#C9A84C] font-bold uppercase">Premier Selection</p>
              <h2 className="text-5xl md:text-6xl font-cormorant font-bold text-white italic">Signature <span className="not-italic">Vault</span></h2>
            </div>
            <Link href="/shop/rings" className="text-[10px] tracking-[0.5em] font-black text-accent border-b border-accent/30 hover:shadow-[0_2px_0_var(--accent)] transition-all pb-1 uppercase">
              View Full Index
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {featuredProducts.map((p, idx) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-[10px] tracking-[0.5em] text-accent font-black uppercase mb-8">Noble Identity</p>
              <h2 className="text-6xl md:text-8xl font-cormorant font-bold mb-10 leading-[0.8] text-white">Curating <br /> <span className="italic text-[#C9A84C]">Desire.</span></h2>
              <div className="space-y-12 mt-16">
                {[
                  { title: "Bespoke Precision", desc: "Every piece is calibrated to individual geometric data for an unparalleled silhouette.", icon: <Shield size={28} strokeWidth={1} /> },
                  { title: "Vault Logistics", desc: "Global high-security logistics, ensuring atomic-level tracking and insurance.", icon: <Star size={28} strokeWidth={1} /> },
                ].map((feat) => (
                  <div key={feat.title} className="flex space-x-8">
                    <div className="text-accent mt-1">{feat.icon}</div>
                    <div className="space-y-3">
                      <h4 className="text-xl font-cormorant font-bold tracking-widest uppercase text-white">{feat.title}</h4>
                      <p className="text-xs text-white/40 leading-relaxed max-w-xs font-medium tracking-wider">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative h-[400px] md:h-[500px] lg:h-[600px] w-full overflow-hidden border border-white/10 group bg-surface"
            >
              <Image
                src="/images/hero_branding.png"
                alt="NOIR ÉCLAT ARCHIVE"
                fill
                className="object-cover opacity-90 transition-all duration-[2s] group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-16 left-16 right-16 flex justify-between items-end">
                <div className="space-y-3">
                  <p className="text-[10px] tracking-[0.4em] font-black text-accent uppercase">Vault 01 Production</p>
                  <p className="text-3xl font-cormorant font-bold italic text-white">Digital Metamorphosis</p>
                </div>
                <div className="w-16 h-16 rounded-full border border-accent/30 flex items-center justify-center text-accent backdrop-blur-3xl hover:bg-accent hover:text-black transition-all">
                  <ChevronRight size={24} strokeWidth={1} />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-48 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 blur-[200px] rounded-full" />
        <div className="max-w-4xl mx-auto px-6 text-center space-y-16 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-6xl md:text-8xl font-cormorant font-bold text-white italic mb-8 uppercase tracking-tighter">Enter the <span className="not-italic text-gold-gradient">Vault</span></h2>
            <p className="text-white/40 text-sm tracking-[0.3em] max-w-xl mx-auto uppercase font-bold">Subscribe for priority access to our most exclusive digital drops.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="max-w-xl mx-auto relative"
          >
            <input
              type="email"
              placeholder="YOUR PROTOCOL ADDRESS..."
              className="w-full bg-surface border border-white/10 p-8 pr-48 outline-none focus:border-accent transition-all font-black text-[10px] tracking-[0.5em] text-white"
            />
            <button className="absolute right-3 top-3 bottom-3 px-12 bg-accent text-black font-black text-[10px] tracking-[0.4em] hover:bg-white transition-all">
              INITIATE
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
