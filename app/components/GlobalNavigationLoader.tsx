"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useNavigation } from "next/navigation"
import { useAppContext } from "../providers/AppContext"

export default function GlobalNavigationLoader() {
  const navigation = useNavigation()
  const { t } = useAppContext()
  const isLoading = navigation.state === "loading"

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-9999 flex items-center justify-center bg-[#050505]/95 text-[#E7E0D3] pointer-events-auto"
          aria-live="polite"
        >
          <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-[28px] border border-[#C9A84C]/20 bg-[#0E0E0E]/95 p-8 shadow-[0_0_80px_rgba(201,168,76,0.18)] backdrop-blur-xl">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#C9A84C]/25 bg-[#111111]/95 shadow-[0_0_40px_rgba(201,168,76,0.25)]">
              <div className="h-12 w-12 animate-pulse rounded-full bg-linear-to-br from-[#C9A84C] via-[#E8C97E] to-[#F5E4A9] shadow-[0_0_20px_rgba(201,168,76,0.45)]" />
            </div>
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.4em] text-[#C9A84C]">{t("loading")}</p>
              <p className="mt-2 text-sm leading-6 text-[#E7E0D3]/85">{t("loadingDescription")}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
