import type { Metadata } from "next";
import Script from "next/script";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import AIChatbot from "./components/AIChatbot";
import { CartProvider } from "./CartContext";
import CustomCursor from "./components/CustomCursor";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "NOIR ÉCLAT | The Ultimate Luxury Jewelry Archive",
  description: "Immerse yourself in a world of high-end, hand-crafted jewelry, where art meets digital sophistication. Explore our collections of Rings, Earrings, Necklaces, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="antialiased font-inter">
        <CartProvider>
          <CustomCursor />
          {children}
          <Script
  src="http://192.168.0.102:3000/widget.js"
  data-widget-key="wk_0db9e6b5c8990d04f9e5d0cfc9a4d4ae"
  data-backend-url="http://192.168.0.102:3000"
  
></Script>
          <AIChatbot />
        </CartProvider>
      </body>
    </html>
  );
}
