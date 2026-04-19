"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Sparkles, Loader2 } from "lucide-react";
import { Product } from "@/lib/data";
import { useCart } from "../CartContext";
import Image from "next/image";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    products?: Product[];
}

export default function AIChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "assistant",
            content: "Welcome to Noir Éclat. I am Maya, your personal jewelry concierge. How may I assist your discovery today? I can find pieces by category, material, or within your desired budget."
        }
    ]);
    const { addToCart } = useCart();
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input }),
            });

            if (!response.ok) throw new Error("API Connection Failed");

            const data = await response.json();

            // Handle Automatic Actions (e.g., Add to Cart)
            if (data.action?.type === "ADD_TO_CART") {
                addToCart(data.action.product);
            }

            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.content,
                products: data.products
            };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error("Chat Error:", error);
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "I apologize, but my connection to the archive is temporarily disrupted. Please try again in a moment."
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-2 right-2 sm:bottom-4 sm:right-4 z-[100]">
            {/* Toggle Button with Magnetic Glow */}
            <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 50px rgba(201,168,76,0.3)" }}
                whileTap={{ scale: 0.95 }}
                animate={{
                    y: [0, -8, 0],
                    boxShadow: [
                        "0 12px 40px rgba(201,168,76,0.4)",
                        "0 12px 60px rgba(201,168,76,0.6)",
                        "0 12px 40px rgba(201,168,76,0.4)"
                    ]
                }}
                transition={{
                    y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                    boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-16 h-16 bg-gradient-to-br from-[#E8C97E] via-[#C9A84C] to-[#8C6F2D] rounded-full flex items-center justify-center shadow-[0_12px_40px_rgba(201,168,76,0.4)] text-[#0D0D0D] relative group overflow-hidden"
            >
                <div className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-150 transition-transform duration-700 rounded-full blur-xl" />
                {isOpen ? <X size={28} className="relative z-10" /> : <MessageSquare size={28} className="relative z-10" />}
            </motion.button>

            {/* Chat Window with Glassmorphism */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.95, y: 20, filter: "blur(10px)" }}
                        transition={{ type: "spring", damping: 20, stiffness: 100 }}
                        className="absolute bottom-[70px] right-2 sm:right-4 w-[300px] sm:w-[360px] h-[min(70vh,550px)] bg-[#0A0A0A]/90 backdrop-blur-[30px] border border-white/10 rounded-[24px] shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col"
                        style={{ boxShadow: "0 0 0 1px rgba(201,168,76,0.1), 0 50px 100px rgba(0,0,0,0.8)" }}
                    >
                        {/* Header */}
                        <div className="px-6 py-4 bg-gradient-to-b from-white/5 to-transparent border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C9A84C] to-[#8C6F2D] flex items-center justify-center shadow-[0_8px_20px_rgba(201,168,76,0.2)]">
                                        <Sparkles size={20} className="text-[#0D0D0D]" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#22C55E] border-2 border-[#0A0A0A] rounded-full shadow-lg" />
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-[#C9A84C] font-cormorant font-bold text-xl tracking-[0.1em]">MAYA</h3>
                                    <span className="text-[9px] text-white/40 tracking-[0.3em] font-bold uppercase">Luxury Stylist</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center text-white/40 hover:text-[#C9A84C] transition-all duration-300"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth scrollbar-hide">
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div className={`max-w-[88%] space-y-3 ${msg.role === "user" ? "items-end" : "items-start"}`}>
                                        <div className={`px-5 py-3 rounded-[20px] text-[13px] leading-relaxed relative ${msg.role === "user"
                                            ? "bg-gradient-to-br from-[#C9A84C] to-[#8C6F2D] text-[#0D0D0D] font-medium rounded-tr-none shadow-[0_8px_20px_rgba(201,168,76,0.15)]"
                                            : "bg-white/5 text-white/90 border border-white/10 rounded-tl-none backdrop-blur-md"
                                            }`}>
                                            {msg.content}
                                        </div>

                                        {/* Dynamic Product Grid */}
                                        {msg.products && (
                                            <div className="grid grid-cols-2 gap-4 mt-2">
                                                {msg.products.map((product, pIdx) => (
                                                    <motion.div
                                                        key={product.id}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: (idx * 0.1) + (pIdx * 0.1) }}
                                                        className="group relative bg-[#111111]/50 border border-white/5 rounded-[24px] overflow-hidden hover:border-[#C9A84C]/40 transition-all duration-500"
                                                    >
                                                        <div className="relative h-32 w-full overflow-hidden">
                                                            <Image
                                                                src={product.image || "/placeholder.svg"}
                                                                alt={product.name || "Produit"}
                                                                fill
                                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                                sizes="(max-width: 768px) 100vw, 150px"
                                                            />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                                <motion.button
                                                                    whileHover={{ scale: 1.1 }}
                                                                    whileTap={{ scale: 0.9 }}
                                                                    onClick={() => addToCart(product)}
                                                                    className="bg-[#C9A84C] text-black px-4 py-2 rounded-full text-[10px] font-bold tracking-widest"
                                                                >
                                                                    ADD TO CART
                                                                </motion.button>
                                                            </div>
                                                        </div>
                                                        <div className="p-4 bg-gradient-to-b from-transparent to-black/20">
                                                            <p className="text-[11px] font-bold text-white/90 uppercase tracking-wider truncate">{product.name}</p>
                                                            <p className="text-[13px] text-[#C9A84C] font-cormorant font-bold mt-1">${product.price}</p>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}

                            {/* Typing Indicator */}
                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex justify-start"
                                >
                                    <div className="bg-white/5 border border-white/10 py-4 px-6 rounded-[24px] rounded-tl-none flex items-center space-x-3">
                                        <div className="flex space-x-1">
                                            {[0, 1, 2].map((i) => (
                                                <motion.div
                                                    key={i}
                                                    animate={{ opacity: [0.3, 1, 0.3] }}
                                                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                                    className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full"
                                                />
                                            ))}
                                        </div>
                                        <span className="text-[11px] text-white/40 font-bold tracking-[0.2em] uppercase">Consulting</span>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Enhanced Input Area */}
                        <div className="p-6 bg-black/40 border-t border-white/5 relative">
                            <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-[#C9A84C]/20 to-transparent" />
                            <div className="relative flex items-center gap-3">
                                <div className="relative flex-1 group">
                                    <input
                                        type="text"
                                        placeholder="Ask Maya about jewelry..."
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyPress={(e) => e.key === "Enter" && handleSend()}
                                        className="w-full bg-white/5 border border-white/10 rounded-[16px] py-3.5 px-5 text-[13px] text-white outline-none focus:border-[#C9A84C]/50 focus:bg-white/[0.08] transition-all placeholder:text-white/20 tracking-wide"
                                    />
                                    <div className="absolute inset-0 rounded-[16px] pointer-events-none group-focus-within:ring-2 ring-[#C9A84C]/20 transition-all" />
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleSend}
                                    disabled={!input.trim() || isLoading}
                                    className="w-12 h-12 bg-gradient-to-br from-[#C9A84C] to-[#8C6F2D] text-[#0D0D0D] rounded-[16px] flex items-center justify-center hover:shadow-[0_10px_20px_rgba(201,168,76,0.2)] disabled:opacity-20 disabled:grayscale transition-all"
                                >
                                    <Send size={18} />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
