"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FloatingAI from "../components/FloatingAI";
import ProductCard from "../components/ProductCard";
import { PRODUCTS, CATEGORIES } from "@/lib/data";
import { Filter, Search, ChevronDown, SlidersHorizontal } from "lucide-react";

function ShopContent() {
    const searchParams = useSearchParams();
    const initialCategory = searchParams.get("category") || "All";

    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [selectedPrice, setSelectedPrice] = useState(1500);
    const [sortBy, setSortBy] = useState("newest");
    const [searchQuery, setSearchQuery] = useState("");

    // Filter products
    const filteredProducts = useMemo(() => {
        return PRODUCTS.filter(p => {
            const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
            const matchesPrice = p.price <= selectedPrice;
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesPrice && matchesSearch;
        });
    }, [selectedCategory, selectedPrice, searchQuery]);

    // Sort products
    const sortedProducts = useMemo(() => {
        return [...filteredProducts].sort((a, b) => {
            if (sortBy === "price-low") return a.price - b.price;
            if (sortBy === "price-high") return b.price - a.price;
            return 0;
        });
    }, [filteredProducts, sortBy]);

    return (
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-16 space-y-4"
            >
                <div className="flex items-center space-x-3 text-accent mb-2">
                    <div className="w-12 h-[1px] bg-accent" />
                    <span className="text-[10px] tracking-[0.4em] font-black uppercase">Archive 2026</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-cormorant font-bold text-white uppercase tracking-tight">Neural <span className="italic text-[#E8C97E]">Index</span></h1>
                <p className="text-text-muted text-sm max-w-xl font-medium tracking-wide">
                    Explore our complete database of neural-lace jewellery, filtered by your biometric preferences.
                </p>
            </motion.div>

            <div className="flex flex-col lg:flex-row gap-16">
                {/* Sidebar Filters */}
                <aside className="lg:w-72 space-y-12 h-fit lg:sticky lg:top-32">
                    {/* Search Input */}
                    <div className="relative group">
                        <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="SEARCH DATASET..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-transparent border-b border-white/10 py-4 pl-8 outline-none focus:border-accent text-[10px] tracking-widest font-black transition-all"
                        />
                    </div>

                    {/* Categories */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between text-accent">
                            <h4 className="text-[10px] tracking-[0.3em] font-black uppercase">Categories</h4>
                            <SlidersHorizontal size={14} />
                        </div>
                        <ul className="space-y-4">
                            <motion.li
                                whileHover={{ x: 5 }}
                                className={`text-xs tracking-[0.2em] font-bold cursor-pointer transition-colors ${selectedCategory === "All" ? "text-accent" : "text-text-muted hover:text-accent/60"}`}
                                onClick={() => setSelectedCategory("All")}
                            >
                                00. ALL PIECES
                            </motion.li>
                            {CATEGORIES.map((cat, idx) => (
                                <motion.li
                                    key={cat}
                                    whileHover={{ x: 5 }}
                                    className={`text-xs tracking-[0.2em] font-bold cursor-pointer transition-colors ${selectedCategory === cat ? "text-accent" : "text-text-muted hover:text-accent/60"}`}
                                    onClick={() => setSelectedCategory(cat)}
                                >
                                    0{idx + 1}. {cat.toUpperCase()}
                                </motion.li>
                            ))}
                        </ul>
                    </div>

                    {/* Price Filter */}
                    <div className="space-y-6">
                        <h4 className="text-[10px] tracking-[0.3em] font-black text-accent uppercase">Budget Threshold</h4>
                        <div className="space-y-4">
                            <input
                                type="range"
                                min="0"
                                max="1500"
                                step="50"
                                value={selectedPrice}
                                onChange={(e) => setSelectedPrice(parseInt(e.target.value))}
                                className="w-full accent-accent h-1 bg-white/5 rounded-full appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-[10px] text-text-muted font-bold tracking-widest">
                                <span>$0</span>
                                <span className="text-accent underline underline-offset-4">MAX ${selectedPrice}</span>
                            </div>
                        </div>
                    </div>

                    {/* Sort Dropdown Placeholder */}
                    <div className="pt-8 border-t border-white/5">
                        <button className="flex items-center justify-between w-full text-[10px] tracking-[0.3em] font-black text-text-muted hover:text-accent transition-colors uppercase">
                            Sort: {sortBy.replace("-", " ")}
                            <ChevronDown size={14} />
                        </button>
                    </div>
                </aside>

                {/* Product Grid Area */}
                <section className="flex-1">
                    <div className="flex justify-between items-center mb-12 text-[10px] tracking-[0.2em] text-text-muted font-black uppercase">
                        <span>Showing {sortedProducts.length} Neural Matches</span>
                    </div>

                    <motion.div
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12"
                    >
                        <AnimatePresence mode='popLayout'>
                            {sortedProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {sortedProducts.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-40 space-y-6"
                        >
                            <div className="text-4xl">🛰️</div>
                            <p className="text-xl font-cormorant font-bold italic text-[#A0A0A0]">No data found in current trajectory.</p>
                            <button
                                onClick={() => { setSelectedCategory("All"); setSelectedPrice(1500); setSearchQuery(""); }}
                                className="text-[10px] tracking-widest text-accent border-b border-accent/30 hover:border-accent transition-all font-black uppercase pb-1"
                            >
                                RESET FILTERS
                            </button>
                        </motion.div>
                    )}
                </section>
            </div>
        </div>
    );
}

export default function ShopPage() {
    return (
        <main className="min-h-screen bg-black pt-32">
            <Navbar />
            <FloatingAI />
            <Suspense fallback={
                <div className="flex items-center justify-center min-h-[60vh] text-accent font-black tracking-[1em] animate-pulse">
                    LOADING PROTOCOL...
                </div>
            }>
                <ShopContent />
            </Suspense>
            <Footer />
        </main>
    );
}
