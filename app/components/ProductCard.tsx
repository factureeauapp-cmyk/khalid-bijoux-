"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Product } from "@/lib/data";
import { useCart } from "../CartContext";
import { Plus, Eye } from "lucide-react";

export default function ProductCard({ product }: { product: Product }) {
    const { addToCart } = useCart();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -6 }}
            className="group w-[280px] h-[420px] relative bg-[#141414] border border-[#C9A84C]/15 hover:border-[#C9A84C]/45 transition-all duration-350 rounded-[14px] overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_12px_40px_rgba(201,168,76,0.15)]"
        >
            {/* Tag */}
            {product.tag && (
                <div className="absolute top-4 left-4 z-20">
                    <span className="text-[10px] tracking-[0.1em] bg-gradient-to-r from-[#C9A84C] to-[#E8C97E] text-[#0D0D0D] px-3 py-1 font-bold uppercase rounded-md shadow-lg">
                        {product.tag}
                    </span>
                </div>
            )}

            {/* Image Area */}
            <div className="relative h-[280px] w-full bg-[#0A0A0A] overflow-hidden">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                    priority={false}
                />

                {/* Quick Add Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                    <button
                        onClick={() => addToCart(product)}
                        className="bg-gradient-to-r from-[#C9A84C] to-[#E8C97E] text-[#0D0D0D] p-3 rounded-full scale-75 group-hover:scale-100 transition-transform duration-300 shadow-xl"
                    >
                        <Plus size={20} />
                    </button>
                </div>
            </div>

            {/* Content Padding: 16px */}
            <div className="p-4 flex flex-col justify-between h-[140px]">
                <div className="space-y-1">
                    <p className="text-[11px] font-medium text-[#A0A0A0] uppercase tracking-wider">{product.category}</p>
                    <h3 className="text-[18px] font-cormorant font-semibold text-white truncate leading-tight">{product.name}</h3>
                </div>
                <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                        <p className="text-[16px] font-bold text-[#E8C97E]">${product.price}</p>
                        {product.originalPrice && (
                            <p className="text-[12px] font-medium text-[#A0A0A0] line-through">${product.originalPrice}</p>
                        )}
                    </div>
                    <p className="text-[10px] text-[#A0A0A0] font-medium tracking-tight truncate ml-4">{product.material.split('&')[0]}</p>
                </div>
            </div>
        </motion.div>
    );
}
