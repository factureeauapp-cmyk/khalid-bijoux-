"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ShoppingBag } from "lucide-react"

import { useCart } from "../CartContext"
import { useAppContext } from "../providers/AppContext"

interface HeaderActionsProps {
  /**
   * Version mobile :
   * - icône uniquement
   *
   * Version desktop :
   * - icône + texte "Panier"
   */
  mobile?: boolean
}

export default function HeaderActions({
  mobile = false,
}: HeaderActionsProps) {
  const { totalItems, isHydrated } = useCart()
  const { language } = useAppContext()

  const hasCartItems = isHydrated && totalItems > 0

  const cartLabel =
    language === "ar"
      ? `السلة، ${totalItems} ${
          totalItems === 1 ? "منتج" : "منتجات"
        }`
      : `Panier, ${totalItems} ${
          totalItems === 1 ? "article" : "articles"
        }`

  return (
    <Link
      href="/cart"
      aria-label={hasCartItems ? cartLabel : "Panier"}
      title={hasCartItems ? cartLabel : "Panier"}
      className="relative shrink-0"
    >
      <motion.div
        /*
         * =====================================================
         * ANIMATION PRINCIPALE DU PANIER
         * =====================================================
         */
        animate={
          hasCartItems
            ? {
                scale: [1, 1.04, 1],
              }
            : {
                scale: 1,
              }
        }
        transition={
          hasCartItems
            ? {
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
              }
            : undefined
        }
        className={`
          relative
          flex
          items-center
          justify-center
          rounded-full
          border
          transition-all
          duration-300

          ${
            mobile
              ? "h-10 w-10"
              : "h-10 min-w-10 gap-2 px-3"
          }

          ${
            hasCartItems
              ? `
                border-[#C9A84C]
                bg-[#C9A84C]/10
                text-[#E8C97E]
                shadow-[0_0_22px_rgba(201,168,76,0.35)]
              `
              : `
                border-white/10
                bg-[#121212]/80
                text-[#E7E0D3]
                hover:border-[#C9A84C]
                hover:text-[#C9A84C]
              `
          }
        `}
      >
        {/* =====================================================
            HALO ANIMÉ
            ===================================================== */}

        {hasCartItems && (
          <motion.span
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-0
              rounded-full
              border
              border-[#C9A84C]
            "
            initial={{
              opacity: 0.7,
              scale: 1,
            }}
            animate={{
              opacity: [0.7, 0, 0.7],
              scale: [1, 1.4, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        )}

        {/* =====================================================
            ICÔNE PANIER
            ===================================================== */}

        <motion.div
          animate={
            hasCartItems
              ? {
                  y: [0, -2, 0],
                  rotate: [0, -3, 3, 0],
                }
              : {
                  y: 0,
                  rotate: 0,
                }
          }
          transition={
            hasCartItems
              ? {
                  duration: 1.8,
                  repeat: Infinity,
                  repeatDelay: 1.5,
                  ease: "easeInOut",
                }
              : undefined
          }
          className="relative z-10"
        >
          <ShoppingBag
            size={mobile ? 20 : 20}
            strokeWidth={1.6}
          />
        </motion.div>

        {/* =====================================================
            TEXTE DESKTOP UNIQUEMENT
            ===================================================== */}

        {!mobile && (
          <span className="hidden text-xs font-medium lg:inline">
            {language === "ar" ? "السلة" : "Panier"}
          </span>
        )}

        {/* =====================================================
            BADGE QUANTITÉ
            ===================================================== */}

        {hasCartItems && (
          <motion.span
            initial={{
              scale: 0,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 20,
            }}
            className="
              absolute
              -right-2
              -top-2
              z-20
              flex
              min-h-5
              min-w-5
              items-center
              justify-center
              rounded-full
              bg-[#C9A84C]
              px-1.5
              text-center
              text-[10px]
              font-bold
              text-black
              shadow-[0_0_12px_rgba(201,168,76,0.55)]
            "
          >
            <motion.span
              animate={{
                scale: [1, 1.15, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {totalItems}
            </motion.span>
          </motion.span>
        )}
      </motion.div>
    </Link>
  )
}