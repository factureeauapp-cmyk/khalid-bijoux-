type Lang = "fr" | "ar"

interface OrderConfirmationNoticeProps {
  language: Lang
}

const COPY: Record<Lang, { line1: string; line2: string }> = {
  fr: {
    line1: "Un message contenant le résumé de votre commande va être préparé dans WhatsApp.",
    line2: "Vérifiez les informations puis appuyez sur « Envoyer » pour confirmer votre commande.",
  },
  ar: {
    line1: "سيتم تجهيز رسالة تحتوي على تفاصيل طلبك في واتساب.",
    line2: "تحقق من المعلومات ثم اضغط على « إرسال » لتأكيد طلبك.",
  },
}

export default function OrderConfirmationNotice({ language }: OrderConfirmationNoticeProps) {
  const copy = COPY[language]

  return (
    <div className="mx-auto mt-4 max-w-sm space-y-1.5 text-xs leading-5 text-white/40">
      <p>{copy.line1}</p>
      <p>{copy.line2}</p>
    </div>
  )
}