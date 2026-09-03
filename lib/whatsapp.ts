import type { SelectedCartAttribute } from "@/lib/store-types"

// ============================================================================
// TYPES — snapshot autonome de la commande, construit côté frontend au
// moment du succès du POST /api/orders (le backend ne renvoie que
// orderNumber/status/subtotal/shipping/tax/total, jamais les items ou le
// client). Ce snapshot sert UNIQUEMENT à générer le message WhatsApp.
// ============================================================================

export interface WhatsAppOrderItem {
  productName: string
  price: number
  quantity: number
  /** Déjà dans l'ordre du produit — voir buildSelectedCartAttributes. */
  selectedAttributes: SelectedCartAttribute[]
}

export interface WhatsAppOrderCustomer {
  firstName: string
  lastName: string
  phone: string
  email: string
}

export interface WhatsAppOrderAddress {
  address: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface WhatsAppOrderData {
  orderNumber: string
  paymentMethod: string
  items: WhatsAppOrderItem[]
  customer: WhatsAppOrderCustomer
  shippingAddress: WhatsAppOrderAddress
  subtotal: number
  shipping: number
  tax: number
  total: number
}

type Lang = "fr" | "ar"

// ============================================================================
// LABELS — un seul endroit à traduire si le texte doit changer
// ============================================================================

const LABELS: Record<Lang, Record<string, string>> = {
  fr: {
    greeting: "Bonjour,",
    intent: "Je souhaite confirmer ma commande.",
    order: "Commande",
    quantity: "Quantité",
    unitPrice: "Prix unitaire",
    lineTotal: "Total",
    subtotal: "Sous-total",
    shipping: "Livraison",
    tax: "Taxe",
    grandTotal: "TOTAL",
    shippingAddress: "Adresse de livraison",
    firstName: "Prénom",
    lastName: "Nom",
    phone: "Téléphone",
    email: "Email",
    address: "Adresse",
    city: "Ville",
    state: "Région",
    postalCode: "Code postal",
    country: "Pays",
    payment: "Paiement",
    codLabel: "Paiement à la livraison",
    currency: "MAD",
    thanks: "Merci.",
  },
  ar: {
    greeting: "مرحبا،",
    intent: "أرغب في تأكيد طلبي.",
    order: "الطلب",
    quantity: "الكمية",
    unitPrice: "السعر",
    lineTotal: "المجموع",
    subtotal: "المجموع الفرعي",
    shipping: "التوصيل",
    tax: "الضريبة",
    grandTotal: "الإجمالي",
    shippingAddress: "عنوان التوصيل",
    firstName: "الاسم الشخصي",
    lastName: "الاسم العائلي",
    phone: "الهاتف",
    email: "البريد الإلكتروني",
    address: "العنوان",
    city: "المدينة",
    state: "الجهة",
    postalCode: "الرمز البريدي",
    country: "البلد",
    payment: "طريقة الدفع",
    codLabel: "الدفع عند الاستلام",
    currency: "درهم",
    thanks: "شكرا.",
  },
}

/** Traduit une méthode de paiement connue. Ajouter d'autres méthodes ici si besoin plus tard. */
function translatePaymentMethod(paymentMethod: string, language: Lang): string {
  if (paymentMethod === "Cash on Delivery") {
    return LABELS[language].codLabel
  }
  return paymentMethod
}

function attributeLine(attribute: SelectedCartAttribute, language: Lang): string {
  const name = language === "ar" ? attribute.attributeNameAr || attribute.attributeName : attribute.attributeName
  const value = language === "ar" ? attribute.selectedValueAr || attribute.selectedValue : attribute.selectedValue
  return `${name} : ${value}`
}

const SEPARATOR = "━━━━━━━━━━━━━━━━━━"

// ============================================================================
// MESSAGE
// ============================================================================

/**
 * Construit le message WhatsApp de confirmation à partir des données réelles
 * de la commande. Jamais de nom de produit / attribut codé en dur : tout
 * vient de `order`.
 */
export function buildWhatsAppOrderMessage(order: WhatsAppOrderData, language: Lang = "fr"): string {
  const l = LABELS[language]
  const lines: string[] = []

  lines.push("✨ KHALID BIJOUX", "", l.greeting, "", l.intent, "", `🧾 ${l.order} : ${order.orderNumber}`, "", SEPARATOR)

  order.items.forEach((item) => {
    lines.push("", `💍 ${item.productName}`, "", `${l.quantity} : ${item.quantity}`)

    const attributes = item.selectedAttributes ?? []
    if (attributes.length > 0) {
      lines.push("")
      attributes.forEach((attribute) => lines.push(attributeLine(attribute, language)))
    }

    lines.push(
      "",
      `${l.unitPrice} : ${item.price} ${l.currency}`,
      `${l.lineTotal} : ${item.price * item.quantity} ${l.currency}`,
      "",
      SEPARATOR
    )
  })

  lines.push(
    "",
    `💰 ${l.subtotal} : ${order.subtotal} ${l.currency}`,
    `🚚 ${l.shipping} : ${order.shipping} ${l.currency}`,
    `🧾 ${l.tax} : ${order.tax} ${l.currency}`,
    "",
    `💳 ${l.grandTotal} : ${order.total} ${l.currency}`,
    "",
    `📍 ${l.shippingAddress} :`,
    "",
    `${l.firstName} : ${order.customer.firstName}`,
    `${l.lastName} : ${order.customer.lastName}`,
    `${l.phone} : ${order.customer.phone}`,
    `${l.email} : ${order.customer.email}`,
    `${l.address} : ${order.shippingAddress.address}`,
    `${l.city} : ${order.shippingAddress.city}`
  )

  if (order.shippingAddress.state) lines.push(`${l.state} : ${order.shippingAddress.state}`)
  if (order.shippingAddress.postalCode) lines.push(`${l.postalCode} : ${order.shippingAddress.postalCode}`)

  lines.push(
    `${l.country} : ${order.shippingAddress.country}`,
    "",
    `💳 ${l.payment} : ${translatePaymentMethod(order.paymentMethod, language)}`,
    "",
    l.thanks
  )

  return lines.join("\n")
}

// ============================================================================
// URL — click-to-chat, jamais d'API WhatsApp
// ============================================================================

/**
 * Construit l'URL https://wa.me/... à partir du numéro configuré en
 * variable d'environnement. Retourne `null` (jamais une URL invalide) si
 * le numéro n'est pas configuré — à l'appelant de gérer ce cas sans annuler
 * la commande.
 */
export function buildWhatsAppUrl(message: string): string | null {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
  if (!number || !number.trim()) return null
  return `https://wa.me/${number.trim()}?text=${encodeURIComponent(message)}`
}