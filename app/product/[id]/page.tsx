"use client";

import React, { use } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
// FloatingAI removed as it's replaced by the universal AIChatbot
import ProductCard from "../../components/ProductCard";
import { PRODUCTS } from "@/lib/data";
import { useCart } from "../../CartContext";
import Link from "next/link";
import { ShieldCheck, Sparkles, Heart, ShoppingBag } from "lucide-react";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const product = PRODUCTS.find((p) => p.id === id);
    const { addToCart } = useCart();

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
                <p className="text-2xl font-cormorant italic text-white/30 tracking-widest uppercase font-bold">Archive Piece not found.</p>
            </div>
        );
    }

    const relatedProducts = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

    return (
        <main className="min-h-screen bg-black pt-32">
            <Navbar />

            {/* Background Glow */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-accent/5 blur-[150px] rounded-full -z-10" />

            <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-24">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-32">
                    {/* Left - Image with advanced frame */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="lg:w-1/2 group"
                    >
                        <div className="relative aspect-[4/5] w-full rounded-[20px] overflow-hidden border border-[#C9A84C]/10 bg-[#141414] shadow-2xl">
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                            />
                            {/* Technical Overlays */}
                            <div className="absolute top-6 left-6 flex space-x-2">
                                <div className="w-2 h-2 rounded-full bg-[#C9A84C] animate-pulse" />
                                <div className="text-[10px] tracking-widest font-bold text-[#C9A84C] uppercase">Archive Verified</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right - Detailed Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="lg:w-1/2 space-y-12"
                    >
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <span className="text-[11px] tracking-[0.4em] font-bold text-[#C9A84C] uppercase underline decoration-[#C9A84C]/30 underline-offset-8">{product.category}</span>
                                {product.tag && (
                                    <span className="text-[10px] tracking-widest bg-gradient-to-r from-[#C9A84C] to-[#E8C97E] text-[#0D0D0D] px-4 py-1 font-bold rounded-lg uppercase">
                                        {product.tag}
                                    </span>
                                )}
                            </div>
                            <h1 className="text-5xl md:text-7xl font-cormorant font-bold tracking-tight text-white">{product.name}</h1>
                            <div className="flex items-baseline space-x-4">
                                <p className="text-4xl text-[#E8C97E] font-bold tracking-tighter">${product.price}</p>
                                <p className="text-[#A0A0A0] text-[13px] tracking-widest font-medium uppercase font-inter">{product.material}</p>
                            </div>
                        </div>

                        <p className="text-[#A0A0A0] leading-relaxed text-[16px] font-medium tracking-wide border-l border-[#C9A84C]/30 pl-8">
                            {product.description}
                        </p>

                        {/* Action Box */}
                        <div className="space-y-8 p-8 rounded-2xl bg-[#141414] border border-[#C9A84C]/10 shadow-2xl">
                            <div className="grid grid-cols-2 gap-4 text-[11px] tracking-[0.2em] font-bold text-[#A0A0A0] uppercase">
                                <div className="flex items-center space-x-3">
                                    <Sparkles size={14} className="text-[#C9A84C]" />
                                    <span>Instant Sync</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <ShieldCheck size={14} className="text-[#C9A84C]" />
                                    <span>Secure Vault</span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => addToCart(product)}
                                    className="btn-primary flex-1 h-14"
                                >
                                    <ShoppingBag size={18} className="mr-3" /> Add to Collection
                                </button>
                                <button
                                    className="w-14 h-14 rounded-lg border border-white/10 flex items-center justify-center text-[#A0A0A0] hover:text-[#C9A84C] transition-all bg-white/5"
                                >
                                    <Heart size={20} />
                                </button>
                            </div>
                        </div>

                        {/* AI Feedback */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <span className="text-[11px] tracking-widest font-bold text-[#C9A84C] uppercase">Maya AI Insights</span>
                                <div className="flex-1 h-[1px] bg-white/5" />
                            </div>
                            <div className="p-6 rounded-xl border border-[#C9A84C]/10 bg-[#C9A84C]/5">
                                <p className="text-[14px] italic text-[#FFFFFF]/80 leading-relaxed font-medium">
                                    "The <span className="text-[#C9A84C] font-bold">{product.name}</span> selection is optimized for high-society environments. Our archive indicates this piece captures light exceptionally during evening galas."
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* RELATED PRODUCTS */}
                {relatedProducts.length > 0 && (
                    <section className="mt-40 border-t border-white/5 pt-32">
                        <div className="flex justify-between items-end mb-16">
                            <div className="space-y-2">
                                <p className="text-[11px] tracking-[0.4em] font-bold text-[#C9A84C]">SYNCHRONIZED PIECES</p>
                                <h2 className="text-4xl md:text-5xl font-cormorant font-bold text-white italic">Complete the Collection</h2>
                            </div>
                            <Link href="/shop" className="text-[10px] tracking-[0.3em] font-black text-text-muted hover:text-accent transition-colors">
                                EXPLORE ALL →
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {relatedProducts.map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </section>
                )}
            </div>

            <Footer />
        </main>
    );
}
