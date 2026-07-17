import type { Metadata } from "next"
import { Cormorant_Garamond, Inter } from "next/font/google"
import "./globals.css"
import { CartProvider } from "./CartContext"
import { AppProvider } from "./providers/AppContext"
import { StoreProvider } from "@/hooks/use-store"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
})

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Khalid Bijoux",
  description: "Khalid Bijoux - boutique de bijoux moderne avec commande simple et paiement à la livraison.",
  icons: {
    icon: "/khalid-bijoux.png",
    shortcut: "/khalid-bijoux.png",
    apple: "/khalid-bijoux.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" dir="ltr" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="antialiased font-inter">
        <StoreProvider>
          <AppProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </AppProvider>
        </StoreProvider>
      </body>
    </html>
  )
}
