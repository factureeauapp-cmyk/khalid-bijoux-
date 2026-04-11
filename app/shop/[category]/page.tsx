"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ProductCard from "../../components/ProductCard";
import { PRODUCTS } from "@/lib/data";

export default function CategoryPage() {
    const params = useParams();
    const categoryName = (params.category as string).toLowerCase();

    const filteredProducts = useMemo(() => {
        return PRODUCTS.filter(p => p.category.toLowerCase() === categoryName);
    }, [categoryName]);

    // Capitalize for display
    const displayTitle = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

    return (
        <main className="min-h-screen bg-black pt-32">
            <Navbar />

            <div className="max-w-[1800px] mx-auto px-8 md:px-16 py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-20 text-center"
                >
                    <div className="flex items-center justify-center space-x-4 mb-4">
                        <div className="w-10 h-[1px] bg-[#C9A84C]/30" />
                        <span className="text-[10px] tracking-[0.5em] font-bold text-[#C9A84C] uppercase">Curated Collections</span>
                        <div className="w-10 h-[1px] bg-[#C9A84C]/30" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-cormorant font-bold text-white mb-6">
                        {displayTitle} <span className="italic text-[#E8C97E]">Archive</span>
                    </h1>
                    <p className="text-[#A0A0A0] text-[13px] max-w-xl mx-auto font-medium tracking-widest uppercase opacity-80">
                        Explore our world-renowned selection of {categoryName}, precision-crafted for the modern sovereign.
                    </p>
                </motion.div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-16">
                    <AnimatePresence mode="popLayout">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </AnimatePresence>
                </div>

                {filteredProducts.length === 0 && (
                    <div className="py-40 text-center">
                        <p className="text-[#C9A84C] text-xl font-cormorant font-bold italic">Our {categoryName} archive is currently being updated...</p>
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
