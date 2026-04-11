"use client";

import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

export default function FloatingAI() {
    return (
        <Link
            href="/ai-stylist"
            className="fixed bottom-8 right-8 z-[100] group"
        >
            <motion.div
                whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(0, 242, 255, 0.4)" }}
                whileTap={{ scale: 0.9 }}
                className="bg-accent/10 backdrop-blur-xl p-5 rounded-3xl border border-accent/20 text-accent transition-colors group-hover:bg-accent group-hover:text-black relative"
            >
                <MessageSquare size={24} />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent border-2 border-black rounded-full animate-pulse" />

                {/* Tooltip */}
                <span className="absolute right-full mr-6 top-1/2 -translate-y-1/2 bg-surface/90 backdrop-blur-md text-accent text-[8px] tracking-[0.4em] font-black px-4 py-2 border border-accent/20 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all uppercase rounded-full">
                    Initialize Maya
                </span>
            </motion.div>
        </Link>
    );
}
