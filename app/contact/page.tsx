"use client";

import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Mail, Phone, MapPin, Clock, Send, Instagram, Facebook, Twitter } from "lucide-react";

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-black text-white selection:bg-[#C9A84C] selection:text-black">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 flex flex-col items-center justify-center text-center overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C9A84C]/5 blur-[120px] rounded-full pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10"
                >
                    <p className="text-[10px] tracking-[0.8em] text-[#C9A84C] font-black uppercase mb-6">Concierge</p>
                    <h1 className="text-5xl md:text-7xl font-cormorant font-bold italic mb-8">Contact <span className="not-italic text-white">The Vault</span></h1>
                    <p className="text-white/50 text-sm md:text-base max-w-xl mx-auto leading-relaxed tracking-wider uppercase">
                        Our artisans and stylists are at your service for bespoke inquiries and private viewing appointments.
                    </p>
                </motion.div>
            </section>

            {/* Contact Content */}
            <section className="max-w-7xl mx-auto px-6 pb-32 grid grid-cols-1 lg:grid-cols-2 gap-20">
                {/* Left side: Information */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="space-y-12"
                >
                    <div className="space-y-8">
                        <h2 className="text-3xl font-cormorant font-bold tracking-tight">Private <span className="italic text-[#C9A84C]">Details</span></h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <ContactInfoCard
                                icon={<MapPin size={24} />}
                                title="Maison Address"
                                content="Aura Tower, Floor 12, Diamond District, Paris, France"
                            />
                            <ContactInfoCard
                                icon={<Phone size={24} />}
                                title="Voice Registry"
                                content="+33 1 23 45 67 89"
                            />
                            <ContactInfoCard
                                icon={<Mail size={24} />}
                                title="Digital Correspondence"
                                content="concierge@noireclat.com"
                            />
                            <ContactInfoCard
                                icon={<Clock size={24} />}
                                title="Operational Hours"
                                content="Mon - Sat: 10AM - 8PM | Sun: Appointment Only"
                            />
                        </div>
                    </div>

                    {/* Socials */}
                    <div className="space-y-6 pt-8 border-t border-white/10">
                        <p className="text-[10px] tracking-[0.4em] text-[#C9A84C] font-bold uppercase">Connect With The Archive</p>
                        <div className="flex space-x-6 text-white/60">
                            <a href="#" className="hover:text-[#C9A84C] transition-colors"><Instagram size={20} /></a>
                            <a href="#" className="hover:text-[#C9A84C] transition-colors"><Facebook size={20} /></a>
                            <a href="#" className="hover:text-[#C9A84C] transition-colors"><Twitter size={20} /></a>
                        </div>
                    </div>
                </motion.div>

                {/* Right side: Contact Form */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="bg-[#0A0A0A] border border-[#C9A84C]/10 p-8 md:p-12 rounded-2xl shadow-2xl relative"
                >
                    <div className="absolute top-0 right-10 w-20 h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C]/50 to-transparent" />
                    <h3 className="text-2xl font-cormorant font-bold mb-8 uppercase tracking-widest">Inquiry Form</h3>

                    <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput label="Full Name" placeholder="Jean Dupont" />
                            <FormInput label="Email Protocol" placeholder="jean@domain.com" type="email" />
                        </div>
                        <FormInput label="Subject of Interest" placeholder="e.g., Bespoke Ring Inquiry" />
                        <div className="space-y-2">
                            <label className="text-[10px] tracking-[0.2em] text-[#C9A84C] font-bold uppercase ml-1">Message</label>
                            <textarea
                                rows={5}
                                placeholder="Detail your vision or request here..."
                                className="w-full bg-[#111] border border-white/10 rounded-lg p-4 outline-none focus:border-[#C9A84C]/50 transition-all text-sm font-medium tracking-wide text-white/80 placeholder:text-white/20 resize-none"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-[#C9A84C] to-[#E8C97E] text-black font-black text-[11px] tracking-[0.4em] py-5 rounded-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-3 shadow-xl shadow-[#C9A84C]/10"
                        >
                            <span>DISPATCH INQUIRY</span>
                            <Send size={14} />
                        </button>
                    </form>
                </motion.div>
            </section>

            <Footer />
        </main>
    );
}

function ContactInfoCard({ icon, title, content }: { icon: React.ReactNode; title: string; content: string }) {
    return (
        <div className="group p-6 bg-[#0A0A0A] border border-white/5 hover:border-[#C9A84C]/20 transition-all rounded-xl">
            <div className="text-[#C9A84C] mb-4 group-hover:scale-110 transition-transform origin-left">{icon}</div>
            <h4 className="text-[10px] tracking-[0.3em] font-black text-white/40 uppercase mb-2">{title}</h4>
            <p className="text-sm font-medium tracking-wide text-white/80 leading-relaxed">{content}</p>
        </div>
    );
}

function FormInput({ label, placeholder, type = "text" }: { label: string; placeholder: string; type?: string }) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] tracking-[0.2em] text-[#C9A84C] font-bold uppercase ml-1">{label}</label>
            <input
                type={type}
                placeholder={placeholder}
                className="w-full bg-[#111] border border-white/10 rounded-lg p-4 outline-none focus:border-[#C9A84C]/50 transition-all text-sm font-medium tracking-wide text-white/80 placeholder:text-white/20"
            />
        </div>
    );
}
