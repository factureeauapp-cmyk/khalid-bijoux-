import Link from "next/link";
import { Instagram, Twitter, MessageCircle, MapPin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-[#0D0D0D] border-t border-[#C9A84C]/10 pt-24 pb-12 px-6 md:px-12 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#C9A84C]/5 blur-[120px] rounded-full -z-10" />

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                <div className="space-y-6">
                    <h2 className="text-[28px] font-cormorant font-bold tracking-[0.2em] text-gold-gradient uppercase">NOIR ÉCLAT</h2>
                    <p className="text-[#A0A0A0] text-[13px] leading-relaxed max-w-xs font-medium">
                        Defining the next era of luxury. Precision jewellery handcrafted for the modern sovereign.
                    </p>
                    <div className="flex space-x-5 text-[#A0A0A0]">
                        {[Instagram, Twitter, MessageCircle].map((Icon, i) => (
                            <Link key={i} href="#" className="hover:text-[#C9A84C] transition-colors">
                                <Icon size={20} strokeWidth={1.5} />
                            </Link>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="text-[#C9A84C] text-[10px] tracking-[0.4em] font-bold mb-8 uppercase">Collections</h4>
                    <ul className="space-y-4 text-[11px] font-medium tracking-widest text-[#A0A0A0] uppercase">
                        <li><Link href="/shop" className="hover:text-[#C9A84C] transition-colors">THE FULL INDEX</Link></li>
                        <li><Link href="/shop/necklaces" className="hover:text-[#C9A84C] transition-colors">ARCHIVE NECKLACES</Link></li>
                        <li><Link href="/shop/rings" className="hover:text-[#C9A84C] transition-colors">ARTISAN RINGS</Link></li>
                        <li><Link href="/shop/earrings" className="hover:text-[#C9A84C] transition-colors">STUD SELECTIONS</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-[#C9A84C] text-[10px] tracking-[0.4em] font-bold mb-8 uppercase">The Maison</h4>
                    <ul className="space-y-4 text-[11px] font-medium tracking-widest text-[#A0A0A0] uppercase">
                        <li><Link href="#" className="hover:text-[#C9A84C] transition-colors">OUR LEGACY</Link></li>
                        <li><Link href="#" className="hover:text-[#C9A84C] transition-colors">THE ATELIER</Link></li>
                        <li><Link href="#" className="hover:text-[#C9A84C] transition-colors">PRIVACY POLICY</Link></li>
                        <li><Link href="#" className="hover:text-[#C9A84C] transition-colors">TERMS of SERVICE</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-[#C9A84C] text-[10px] tracking-[0.4em] font-bold mb-8 uppercase">Concierge</h4>
                    <div className="space-y-4 text-[11px] tracking-widest text-[#A0A0A0] uppercase font-medium">
                        <div className="flex items-center space-x-3">
                            <MapPin size={14} className="text-[#C9A84C]" />
                            <span>Paris | Place Vendôme</span>
                        </div>
                        <p className="hover:text-[#C9A84C] cursor-pointer transition-colors">concierge@noireclat.io</p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center border-t border-white/5 pt-12 text-[10px] tracking-[0.4em] font-bold text-[#A0A0A0]/40 uppercase">
                <p>© 2026 NOIR ÉCLAT. ESTABLISHED IN EXCELLENCE.</p>
                <div className="flex space-x-8 mt-6 md:mt-0">
                    <span className="hover:text-[#C9A84C] transition-colors cursor-pointer">Security Protocol</span>
                    <span className="hover:text-[#C9A84C] transition-colors cursor-pointer">Support Interface</span>
                </div>
            </div>
        </footer>
    );
}
