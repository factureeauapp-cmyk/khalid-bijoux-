import Link from "next/link"

type Lang = "fr" | "ar"

interface ContinueShoppingButtonProps {
  language: Lang
}

export default function ContinueShoppingButton({ language }: ContinueShoppingButtonProps) {
  return (
    <Link
      href="/shop"
      className="inline-block text-sm text-[#d8cfbf] transition hover:text-[#C9A84C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9A84C]"
    >
      {language === "ar" ? "متابعة التسوق" : "Continuer mes achats"}
    </Link>
  )
}