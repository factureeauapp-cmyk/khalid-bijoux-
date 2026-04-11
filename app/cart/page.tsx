"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../CartContext";
import Link from "next/link";
import { PRODUCTS } from "@/lib/data";
import { Trash2, Plus, Minus, CreditCard, Truck, ShieldCheck, ShoppingBag, ArrowRight, Sparkles } from "lucide-react";

export default function CartPage() {
    const { cart, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart, currency, setCurrency, convertPrice } = useCart();
    const [step, setStep] = useState(1); // 1: Cart, 2: Shipping, 3: Payment

    const upsellProduct = PRODUCTS.find(p => p.id === "e1");

    if (cart.length === 0 && step === 1) {
        return (
            <main className="min-h-screen pt-32 bg-black flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center text-accent"
                    >
                        <ShoppingBag size={40} />
                    </motion.div>
                    <div className="text-center space-y-2">
                        <h1 className="text-4xl md:text-6xl font-cormorant font-bold tracking-tight text-white uppercase">Archive Empty</h1>
                        <p className="text-[#A0A0A0] font-medium tracking-widest uppercase text-[11px]">No artisan pieces detected in your current selection.</p>
                    </div>
                    <Link href="/shop/rings" className="btn-primary">
                        BEGIN EXPLORATION <ArrowRight className="ml-2" size={14} />
                    </Link>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-black pt-32">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-24">
                {/* Progress Header */}
                <div className="flex items-center justify-between mb-24 max-w-3xl mx-auto relative px-4">
                    <div className="absolute top-5 left-0 right-0 h-[1px] bg-white/5 -z-10" />
                    {["SELECTION", "LOGISTICS", "ACQUISITION"].map((s, idx) => (
                        <div key={s} className="flex flex-col items-center space-y-4">
                            <motion.div
                                animate={{
                                    scale: step === idx + 1 ? 1.2 : 1,
                                    boxShadow: step === idx + 1 ? "0 0 30px rgba(212, 175, 55, 0.3)" : "none"
                                }}
                                className={`w-12 h-12 rounded-full flex items-center justify-center border font-bold text-[11px] transition-all duration-500 ${step >= idx + 1 ? "bg-gradient-to-r from-[#C9A84C] to-[#E8C97E] border-[#C9A84C] text-[#0D0D0D] shadow-lg shadow-[#C9A84C]/20" : "bg-black border-white/10 text-white/30"
                                    }`}>
                                0{idx + 1}
                            </motion.div>
                            <span className={`text-[10px] tracking-[0.4em] font-bold uppercase ${step >= idx + 1 ? "text-[#C9A84C]" : "text-white/20"}`}>{s}</span>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col lg:flex-row gap-20">
                    {/* Main Content Area */}
                    <div className="flex-1 space-y-16">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="space-y-12"
                                >
                                    <h2 className="text-4xl font-cormorant font-bold text-white uppercase">Active <span className="text-[#C9A84C] italic">Protocol</span></h2>

                                    <div className="space-y-4">
                                        {cart.map((item) => {
                                            const fullProduct = PRODUCTS.find(p => p.id === item.id);
                                            return (
                                                <motion.div
                                                    layout
                                                    key={item.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    className="p-6 rounded-3xl bg-surface/30 border border-white/5 backdrop-blur-sm flex items-center gap-8 group hover:border-accent/20 transition-all shadow-xl"
                                                >
                                                    <div className="relative w-24 h-32 rounded-2xl overflow-hidden shrink-0">
                                                        <Image
                                                            src={fullProduct?.image || item.image}
                                                            alt={item.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>

                                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 items-center gap-8">
                                                        <div className="space-y-1">
                                                            <p className="text-[11px] tracking-widest text-[#C9A84C] font-bold uppercase">{item.category}</p>
                                                            <h3 className="text-[18px] font-cormorant font-bold text-white tracking-wide">{item.name}</h3>
                                                            <p className="text-[11px] text-[#A0A0A0] font-medium uppercase">{item.material}</p>
                                                        </div>

                                                        <div className="flex items-center justify-center space-x-6">
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:border-accent hover:text-accent transition-all"
                                                            >
                                                                <Minus size={14} />
                                                            </button>
                                                            <span className="text-sm font-black w-4 text-center">{item.quantity}</span>
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:border-accent hover:text-accent transition-all"
                                                            >
                                                                <Plus size={14} />
                                                            </button>
                                                        </div>

                                                        <div className="flex flex-col items-end space-y-2">
                                                            <p className="text-[20px] font-bold text-[#E8C97E] tracking-tighter">
                                                                {currency === 'USD' ? '$' : currency === 'INR' ? '₹' : 'Rs.'}
                                                                {convertPrice(item.price * item.quantity)}
                                                            </p>
                                                            <button
                                                                onClick={() => removeFromCart(item.id)}
                                                                className="text-[10px] tracking-widest text-[#A0A0A0] hover:text-[#FF4D4D] transition-colors uppercase font-bold flex items-center gap-2"
                                                            >
                                                                <Trash2 size={12} /> Eject
                                                            </button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>

                                    {/* AI Upsell Area */}
                                    <div className="p-10 rounded-3xl border border-accent/10 bg-accent/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
                                        <div className="absolute top-0 right-0 p-4 opacity-10">
                                            <Sparkles size={60} className="text-accent" />
                                        </div>
                                        <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center text-black shadow-[0_0_30px_rgba(212,175,55,0.4)] shrink-0 animate-pulse">
                                            <Sparkles size={24} />
                                        </div>
                                        <div className="flex-1 space-y-2 text-center md:text-left">
                                            <p className="text-[11px] tracking-[0.4em] font-bold text-[#C9A84C] uppercase">Maya's Recommendation</p>
                                            <p className="text-[14px] font-medium leading-relaxed text-[#A0A0A0]">
                                                To complete your aesthetic journey, consider adding the <span className="text-[#C9A84C] font-bold italic">{upsellProduct?.name}</span> to this selection.
                                            </p>
                                        </div>
                                        <button className="btn-secondary whitespace-nowrap">
                                            Add to Selection
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="space-y-12"
                                >
                                    <h2 className="text-4xl font-cormorant font-bold text-white uppercase">Logistics <span className="text-[#C9A84C] italic">Data</span></h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {["Recipient Name", "Neural ID / Email", "Sector Address", "District / City", "Postal Protocol", "Region"].map(label => (
                                            <div key={label} className="space-y-3">
                                                <label className="text-[10px] tracking-[0.4em] text-[#A0A0A0] font-bold uppercase pb-2">{label}</label>
                                                <input
                                                    type="text"
                                                    placeholder={`ENTER ${label.toUpperCase()}...`}
                                                    className="w-full bg-[#141414] border border-white/5 rounded-xl py-5 px-6 outline-none focus:border-[#C9A84C] transition-all text-[13px] font-medium tracking-widest text-white"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="space-y-12"
                                >
                                    <h2 className="text-4xl font-cormorant font-bold text-white uppercase">Payment <span className="text-[#C9A84C] italic">Interface</span></h2>
                                    <div className="space-y-6">
                                        {[
                                            { name: "Premium Card (Visa/Mastercard)", icon: <CreditCard />, active: true },
                                            { name: "Digital Gold (Crypto / Apple Pay)", icon: <Sparkles />, active: false },
                                        ].map((method) => (
                                            <div
                                                key={method.name}
                                                className={`p-8 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${method.active ? "bg-[#C9A84C]/5 border-[#C9A84C] shadow-lg shadow-[#C9A84C]/10" : "bg-white/5 border-white/5 hover:border-white/10"
                                                    }`}
                                            >
                                                <div className="flex items-center space-x-6">
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${method.active ? "bg-[#C9A84C] text-[#0D0D0D]" : "bg-white/5 text-white/30"}`}>
                                                        {method.icon}
                                                    </div>
                                                    <span className={`text-[12px] tracking-widest font-bold uppercase ${method.active ? "text-[#C9A84C]" : "text-[#A0A0A0]"}`}>{method.name}</span>
                                                </div>
                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${method.active ? "border-[#C9A84C]" : "border-white/10"}`}>
                                                    {method.active && <div className="w-3 h-3 bg-[#C9A84C] rounded-full" />}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Sidebar - Summary Area */}
                    <aside className="lg:w-[450px] h-fit lg:sticky lg:top-32">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-10 rounded-[3rem] bg-surface/40 border border-white/5 backdrop-blur-xl shadow-2xl space-y-10"
                        >
                            <h3 className="text-[11px] tracking-[0.5em] font-bold text-[#C9A84C] uppercase border-b border-white/5 pb-8 flex items-center justify-between">
                                Summary Overview
                                <div className="flex items-center gap-2">
                                    <select
                                        value={currency}
                                        onChange={(e) => setCurrency(e.target.value as any)}
                                        className="bg-black/40 border border-white/10 rounded px-2 py-1 text-[10px] text-accent outline-none font-bold"
                                    >
                                        <option value="USD">USD</option>
                                        <option value="INR">INR</option>
                                        <option value="PKR">PKR</option>
                                    </select>
                                    <span className="text-[#A0A0A0]/40 font-bold text-[8px] tracking-[.8em]">NOIR ÉCLAT ARCHIVE</span>
                                </div>
                            </h3>

                            <div className="space-y-6">
                                <div className="flex justify-between text-[13px] tracking-widest">
                                    <span className="text-[#A0A0A0] font-bold uppercase">Subtotal Index</span>
                                    <span className="font-bold text-white">
                                        {currency === 'USD' ? '$' : currency === 'INR' ? '₹' : 'Rs.'}
                                        {convertPrice(totalPrice)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-[13px] tracking-widest">
                                    <span className="text-[#A0A0A0] font-bold uppercase">Logistics Priority</span>
                                    <span className="text-[#C9A84C] font-bold">COMPLIMENTARY</span>
                                </div>
                                <div className="flex justify-between text-[13px] tracking-widest uppercase">
                                    <span className="text-[#A0A0A0]/60 font-bold">Luxury Tax</span>
                                    <span className="font-bold text-white">{currency === 'USD' ? '$' : currency === 'INR' ? '₹' : 'Rs.'}0</span>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-white/5 flex justify-between items-baseline">
                                <span className="text-[12px] tracking-[0.5em] font-bold uppercase text-white">Total</span>
                                <span className="text-4xl font-cormorant font-bold text-[#C9A84C]">
                                    {currency === 'USD' ? '$' : currency === 'INR' ? '₹' : 'Rs. '}
                                    {convertPrice(totalPrice)}
                                </span>
                            </div>

                            <div className="space-y-6 pt-4">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setStep(prev => Math.min(prev + 1, 3))}
                                    className="btn-primary w-full h-16 text-[12px] tracking-[0.3em]"
                                >
                                    {step === 3 ? "Complete Acquisition" : "Verify & Continue"}
                                </motion.button>

                                <div className="flex items-center justify-center space-x-6 text-white/10">
                                    <ShieldCheck size={16} />
                                    <CreditCard size={16} />
                                    <Truck size={16} />
                                </div>
                            </div>

                            <p className="text-center text-[8px] text-white/20 tracking-[0.5em] font-bold uppercase leading-relaxed">
                                Secured by Noir Éclat Luxury Vault. <br /> All transactions are highly confidential.
                            </p>
                        </motion.div>
                    </aside>
                </div>
            </div>

            <Footer />
        </main>
    );
}
