"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../CartContext";
import { Search, ShoppingBag, Menu, X, User, ChevronDown, Mail } from "lucide-react";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { totalItems } = useCart();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "HOME", href: "/" },
        { name: "RINGS", href: "/shop/rings" },
        { name: "EARRINGS", href: "/shop/earrings" },
        { name: "NECKLACES", href: "/shop/necklaces" },
        { name: "BRACELETS", href: "/shop/bracelets" },
        { name: "SETS", href: "/shop/sets" },
    ];

    return (
        <>
            <motion.nav
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`fixed top-0 w-full h-[64px] z-[999] transition-all duration-300 px-8 md:px-16 flex items-center ${isScrolled ? "bg-[#0D0D0D]/85 backdrop-blur-[12px] border-b border-[#C9A84C]/10" : "bg-transparent"
                    }`}
            >
                <div className="w-full max-w-[1400px] mx-auto flex items-center justify-between">

                    {/* Brand Logo (Left) */}
                    <Link
                        href="/"
                        className="text-[22px] font-cormorant font-bold uppercase tracking-[0.1em] text-gold-gradient"
                    >
                        NOIR ÉCLAT
                    </Link>

                    {/* Navigation Links (Center) */}
                    <div className="hidden lg:flex items-center space-x-10">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-[13px] tracking-[0.08em] font-medium text-[#A0A0A0] hover:text-[#C9A84C] transition-all relative group uppercase"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#C9A84C] transition-all duration-300 group-hover:w-full" />
                            </Link>
                        ))}
                    </div>

                    {/* Actions (Right) */}
                    <div className="flex items-center space-x-6">
                        {/* Search Bar */}
                        <div className="hidden md:flex items-center bg-[#1A1A1A] border border-[#C9A84C]/30 rounded-lg h-9 px-3 w-48 focus-within:w-64 transition-all duration-300">
                            <Search size={16} className="text-[#C9A84C]/60" />
                            <input
                                type="text"
                                placeholder="Search collection"
                                className="bg-transparent border-none outline-none text-[12px] text-white ml-2 w-full placeholder:text-[#555]"
                            />
                        </div>

                        <Link href="/contact" className="text-[#A0A0A0] hover:text-[#C9A84C] transition-colors">
                            <Mail size={20} strokeWidth={1.5} />
                        </Link>

                        <Link href="/cart" className="relative group text-[#A0A0A0] hover:text-[#C9A84C] transition-colors">
                            <ShoppingBag size={22} strokeWidth={1.5} />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 bg-[#FF4D4D] w-2 h-2 rounded-full border-2 border-[#0D0D0D]" />
                            )}
                        </Link>

                        {/* Mobile Menu Trigger */}
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="lg:hidden text-[#A0A0A0] hover:text-[#C9A84C] transition-colors"
                        >
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Fullscreen Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5, ease: "circInOut" }}
                        className="fixed inset-0 z-[60] bg-black p-12 flex flex-col items-center justify-center"
                    >
                        <button
                            onClick={() => setIsMenuOpen(false)}
                            className="absolute top-10 right-10 text-accent hover:rotate-90 transition-transform duration-500"
                        >
                            <X size={40} strokeWidth={1} />
                        </button>

                        <ul className="space-y-10 text-center">
                            {navLinks.map((link, idx) => (
                                <motion.li
                                    key={link.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * idx }}
                                >
                                    <Link
                                        href={link.href}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="text-4xl font-cormorant font-bold tracking-widest text-white hover:text-[#C9A84C] transition-colors uppercase"
                                    >
                                        {link.name}
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
