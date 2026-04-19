"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { PRODUCTS } from "@/lib/data";
import { useCart } from "../CartContext";
import Link from "next/link";
import { Send, Zap, User, Sparkles, Terminal, Activity, ChevronRight, ShoppingCart } from "lucide-react";

interface Message {
    role: "maya" | "user";
    content: string;
    products?: any[];
}

export default function AIStylistPage() {
    const [messages, setMessages] = useState<Message[]>([
        { role: "maya", content: "Selection Interface Successful. I am Maya (v3.0), your NOIR ÉCLAT Luxury Concierge. How shall we calibrate your aesthetic today?" }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const { addToCart } = useCart();
    const chatEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { role: "user", content: userMsg }]);
        setInput("");
        setIsTyping(true);

        // Noble AI Logic
        setTimeout(() => {
            let response: Message = { role: "maya", content: "" };
            const lowerInput = userMsg.toLowerCase();

            if (lowerInput.includes("wedding") || lowerInput.includes("event") || lowerInput.includes("gala")) {
                response.content = "Detecting High-Engagement Scenario. For high-society gala events, I recommend the Archive collection. Their light-capture settings are unparalleled.";
                response.products = [PRODUCTS.find(p => p.id === "n1"), PRODUCTS.find(p => p.id === "e1")];
            } else if (lowerInput.includes("daily") || lowerInput.includes("work") || lowerInput.includes("casual")) {
                response.content = "Daily integration optimized. Our Artisan rings offer 24/7 aesthetic stability without compromise.";
                response.products = [PRODUCTS.find(p => p.id === "r1")];
            } else if (lowerInput.includes("budget") || lowerInput.includes("price") || lowerInput.includes("cost")) {
                response.content = "Analyzing investment scalability. NOIR ÉCLAT luxury is peerless. Here are the most refined entries in our current archive.";
                response.products = PRODUCTS.filter(p => p.price < 500).slice(0, 2);
            } else {
                response.content = "Exceptional request. I need more specific parameters. Are you looking for high-refraction necklaces or artisan-cast rings?";
            }

            setMessages(prev => [...prev, response]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <main className="min-h-screen pt-32 bg-black flex flex-col">
            <Navbar />

            {/* Background Luxury Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.02)_0%,transparent_100%)]" />
                <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(rgba(212, 175, 55, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(212, 175, 55, 0.1) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 flex flex-col lg:flex-row gap-8 flex-1 w-full mb-12">

                {/* LEFT PANEL - CONTROL CENTER */}
                <div className="lg:w-[35%] space-y-8 flex flex-col bg-surface/30 backdrop-blur-md rounded-[2.5rem] p-10 border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Terminal size={100} />
                    </div>

                    <div className="space-y-4 relative z-10">
                        <div className="flex items-center space-x-3 text-[#C9A84C] mb-4">
                            <Activity size={18} className="animate-pulse" />
                            <span className="text-[10px] tracking-[0.4em] font-bold uppercase">System: Archive Link Stable</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-cormorant font-bold text-white">Selection <span className="text-gold-gradient italic">Interface</span></h1>
                        <p className="text-[#A0A0A0] text-[13px] font-medium tracking-wide">Calibrate your visual aura using NOIR ÉCLAT's exclusive styling engine.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 relative z-10">
                        {["Aura Scan", "Scenario Lock", "Credit Sync", "Synergy Index"].map(pill => (
                            <button key={pill} className="p-4 rounded-2xl bg-white/5 border border-white/10 text-[9px] tracking-[0.2em] font-black text-text-muted hover:border-accent hover:text-accent transition-all uppercase">
                                {pill}
                            </button>
                        ))}
                    </div>

                    {/* Stats Widget */}
                    <div className="mt-auto space-y-6 pt-10 border-t border-white/5 relative z-10">
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] tracking-widest font-bold uppercase">
                                <span className="text-[#A0A0A0]">Aura Stability</span>
                                <span className="text-[#C9A84C]">98.4%</span>
                            </div>
                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "98.4%" }}
                                    className="h-full bg-gradient-to-r from-[#C9A84C] to-[#E8C97E]"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] tracking-widest font-bold uppercase">
                                <span className="text-[#A0A0A0]">Refraction Match</span>
                                <span className="text-[#C9A84C]">Mastery</span>
                            </div>
                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    className="h-full bg-[#C9A84C] animate-pulse"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT PANEL - CHAT INTERFACE */}
                <div className="lg:w-[65%] rounded-[2.5rem] bg-surface/20 border border-white/5 backdrop-blur-xl flex flex-col relative overflow-hidden shadow-2xl">
                    {/* Header */}
                    <div className="p-8 border-b border-white/5 flex items-center justify-between bg-[#1A1A1A]">
                        <div className="flex items-center space-x-5">
                            <div className="w-14 h-14 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center text-[#C9A84C] relative">
                                <Sparkles size={24} />
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#C9A84C] border-2 border-black rounded-full" />
                            </div>
                            <div>
                                <p className="text-[13px] font-bold tracking-[0.2em] uppercase text-white">MAYA ARCHIVE (v3.0)</p>
                                <p className="text-[10px] text-[#C9A84C] font-bold tracking-[0.1em] uppercase">Selection Logic Online</p>
                            </div>
                        </div>
                        <div className="flex space-x-2 opacity-30">
                            <div className="w-2 h-2 rounded-full bg-white" />
                            <div className="w-2 h-2 rounded-full bg-white" />
                            <div className="w-2 h-2 rounded-full bg-[#C9A84C]" />
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-hide">
                        <AnimatePresence>
                            {messages.map((m, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] space-y-4 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                                        <div className={`p-6 text-[14px] tracking-wide leading-relaxed rounded-2xl ${m.role === 'user'
                                            ? 'bg-gradient-to-r from-[#C9A84C] to-[#E8C97E] text-[#0D0D0D] font-bold shadow-lg shadow-[#C9A84C]/10'
                                            : 'bg-[#1E1E1E] text-[#FFFFFF]/90 border border-white/5 shadow-xl'
                                            }`}>
                                            {m.content}
                                        </div>

                                        {/* Dynamic Recommendations */}
                                        {m.products && (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                                                {m.products.map(p => (
                                                    <motion.div
                                                        whileHover={{ y: -5 }}
                                                        key={p.id}
                                                        className="p-4 rounded-3xl bg-surface/80 border border-white/5 flex items-center gap-4 group"
                                                    >
                                                        <div className="relative w-16 h-20 rounded-xl overflow-hidden shrink-0">
                                                            <Image
                                                                src={p.image || "/placeholder.svg"}
                                                                alt={p.name || "Produit"}
                                                                fill
                                                                className="object-cover"
                                                                sizes="80px"
                                                            />
                                                        </div>
                                                        <div className="flex-1 space-y-1">
                                                            <p className="text-[10px] font-black uppercase text-accent truncate">{p.name}</p>
                                                            <p className="text-[10px] font-bold text-text-muted">${p.price}</p>
                                                            <button
                                                                onClick={() => addToCart(p)}
                                                                className="flex items-center gap-1 text-[8px] font-black text-accent border-b border-accent/20 hover:border-accent transition-all mt-1 uppercase"
                                                            >
                                                                SYNC <ShoppingCart size={10} />
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {isTyping && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex justify-start"
                            >
                                <div className="bg-white/5 p-4 rounded-full px-6 flex space-x-2">
                                    {[0, 1, 2].map(i => (
                                        <div key={i} className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                                    ))}
                                </div>
                            </motion.div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input Interface */}
                    <div className="p-8 bg-[#1A1A1A] border-t border-white/5 backdrop-blur-3xl">
                        <div className="flex items-center space-x-6">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="TYPE SIGNAL..."
                                className="flex-1 bg-transparent border-b border-white/10 py-4 outline-none focus:border-[#C9A84C] text-[13px] font-medium tracking-widest transition-all text-white"
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleSend}
                                className="w-14 h-14 bg-gradient-to-r from-[#C9A84C] to-[#E8C97E] rounded-xl flex items-center justify-center text-[#0D0D0D] shadow-xl transition-all"
                            >
                                <Send size={20} />
                            </motion.button>
                        </div>

                        <div className="flex space-x-3 mt-8 overflow-x-auto scrollbar-hide pb-2">
                            {["Formal Calibration?", "Investment Matcher", "Aesthetic Sync", "Royal Gala"].map(chip => (
                                <button
                                    key={chip}
                                    onClick={() => { setInput(chip); }}
                                    className="shrink-0 px-5 py-2 rounded-lg border border-white/5 bg-white/5 text-[10px] tracking-widest font-bold text-[#A0A0A0] hover:text-[#C9A84C] hover:border-[#C9A84C]/30 transition-all uppercase"
                                >
                                    {chip}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
