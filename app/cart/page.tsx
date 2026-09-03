"use client"

import React, { useMemo, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Check, Loader2 } from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import AlertBox from "@/components/AlertBox"
import { useCart } from "../CartContext"
import { useAppContext } from "../providers/AppContext"
import type { CartItem, ProductAttribute } from "@/lib/store-types"
import {
  getAttributeKey,
  getAttributeValueKey,
  getColorFromValue,
  isColorAttribute,
  isLightColorHex,
  isValueSelectedForAttribute,
  normalizeAttributeValue,
} from "@/lib/products/attributes"
import OrderConfirmationCard from "../components/order-confirmation/OrderConfirmationCard"
import { WhatsAppOrderData } from "@/lib/whatsapp"

interface ErrorAlert {
  id: string
  message: string
}

// ---------------------------------------------------------------------------
// Form model
// ---------------------------------------------------------------------------

interface CheckoutFormData {
  firstName: string
  lastName: string
  phone: string
  email: string
  address: string
  city: string
  state: string
  postalCode: string
  country: string
  notes: string
}

const initialFormData: CheckoutFormData = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
  notes: "",
}

type FormErrors = Partial<Record<keyof CheckoutFormData, string>>

// ---------------------------------------------------------------------------
// Reusable validators (pure functions, no side effects -> easy to test/reuse)
// ---------------------------------------------------------------------------

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateRequired(value: string, label: string): string | null {
  return value.trim() ? null : `${label} est obligatoire.`
}

function validatePhone(value: string): string | null {
  const digitsOnly = value.replace(/\D/g, "")
  if (!digitsOnly) return "Le téléphone est obligatoire."
  if (digitsOnly.length < 10) return "Le numéro doit contenir au moins 10 chiffres."
  return null
}

function validateEmail(value: string): string | null {
  if (!value.trim()) return "L'email est obligatoire."
  if (!EMAIL_REGEX.test(value.trim())) return "Format d'email invalide."
  return null
}

/**
 * Runs every field-level validator and returns a map of errors.
 * Only required/validated fields are checked; optional fields (state,
 * postalCode, notes) are always considered valid.
 */
function validateCheckoutForm(data: CheckoutFormData): FormErrors {
  const errors: FormErrors = {}

  const firstNameError = validateRequired(data.firstName, "Le prénom")
  if (firstNameError) errors.firstName = firstNameError

  const lastNameError = validateRequired(data.lastName, "Le nom")
  if (lastNameError) errors.lastName = lastNameError

  const phoneError = validatePhone(data.phone)
  if (phoneError) errors.phone = phoneError

  const emailError = validateEmail(data.email)
  if (emailError) errors.email = emailError

  const addressError = validateRequired(data.address, "L'adresse")
  if (addressError) errors.address = addressError

  const cityError = validateRequired(data.city, "La ville")
  if (cityError) errors.city = cityError

  const countryError = validateRequired(data.country, "Le pays")
  if (countryError) errors.country = countryError

  return errors
}

// Order in which fields should receive focus if invalid on submit.
const FIELD_FOCUS_ORDER: (keyof CheckoutFormData)[] = [
  "firstName",
  "lastName",
  "phone",
  "email",
  "address",
  "city",
  "country",
]

const PAYMENT_METHOD = "Cash on Delivery"

export default function CartPage() {
  const { cart, totalPrice, updateQuantity, removeFromCart, updateItemAttribute, clearCart } = useCart()
  const { t, language } = useAppContext()
  const cartLabels = t("cart")

  const [formData, setFormData] = useState<CheckoutFormData>(initialFormData)
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessages, setErrorMessages] = useState<ErrorAlert[]>([])

  // Snapshot autonome de la dernière commande créée avec succès. Tant que
  // ceci est non-null, on affiche l'écran de confirmation à la place du
  // panier/formulaire. La commande reste PENDING côté backend quoi qu'il
  // arrive sur cet écran.
  const [orderConfirmation, setOrderConfirmation] = useState<WhatsAppOrderData | null>(null)

  // Refs used to auto-focus the first invalid field on submit
  const fieldRefs = useRef<Partial<Record<keyof CheckoutFormData, HTMLInputElement | HTMLTextAreaElement | null>>>({})

  const getProductName = (item: CartItem) => {
    return language === "ar" ? item.nameAr : item.nameFr
  }

  // Toujours des tableaux, même pour un vieil item de localStorage qui n'a
  // pas ces champs (fix de "Cannot read properties of undefined").
  const getSelectedAttributes = (item: CartItem): CartItem["selectedAttributes"] => item.selectedAttributes ?? []
  const getProductAttributes = (item: CartItem): ProductAttribute[] => item.attributes ?? []

  const attributeLabel = (attribute: ProductAttribute) =>
    language === "ar" ? attribute.nameAr || attribute.name : attribute.name

  // Libellé bilingue statique — utilisé seulement en repli, quand le produit
  // n'a plus (ou pas encore) ses attributs modifiables mais que la ligne
  // panier a conservé une sélection figée.
  const getSelectedAttributeLabel = (attribute: CartItem["selectedAttributes"][number]) => {
    const name = language === "ar" ? attribute.attributeNameAr || attribute.attributeName : attribute.attributeName
    const value = language === "ar" ? attribute.selectedValueAr || attribute.selectedValue : attribute.selectedValue
    return `${name} : ${value}`
  }

  const updateField = (field: keyof CheckoutFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      let value = e.target.value

      // Phone: strip every non-digit character as the user types
      if (field === "phone") {
        value = value.replace(/\D/g, "")
      }

      setFormData((prev) => ({ ...prev, [field]: value }))

      // Clear the field-level error as soon as the user edits it
      setFieldErrors((prev) => {
        if (!prev[field]) return prev
        const next = { ...prev }
        delete next[field]
        return next
      })
    }

  // Lightweight live validity check, used only to enable/disable the submit
  // button (does NOT display errors — errors are shown on submit attempt).
  const isFormValid = useMemo(() => {
    const errors = validateCheckoutForm(formData)
    return Object.keys(errors).length === 0
  }, [formData])

  const focusFirstInvalidField = (errors: FormErrors) => {
    const firstInvalid = FIELD_FOCUS_ORDER.find((field) => errors[field])
    if (firstInvalid) {
      fieldRefs.current[firstInvalid]?.focus()
    }
  }

  const handleOrder = async () => {
    setErrorMessages([])

    if (cart.length === 0) {
      setErrorMessages([{
        id: "cart",
        message: "Votre panier est vide. Veuillez ajouter des articles avant de commander.",
      }])
      return
    }

    const errors = validateCheckoutForm(formData)
    setFieldErrors(errors)

    if (Object.keys(errors).length > 0) {
      // Mirror field errors into the AlertBox list as well
      setErrorMessages(
        Object.values(errors).map((message, index) => ({
          id: `field-error-${index}`,
          message: message as string,
        }))
      )
      focusFirstInvalidField(errors)
      return
    }

    // Ne jamais envoyer categoryId/category/selectedSize/selectedColor/... :
    // uniquement productId, quantity, selectedAttributes.
    const orderItems = cart.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
      selectedAttributes: getSelectedAttributes(item).map((attribute) => ({
        attributeName: attribute.attributeName,
        attributeNameAr: attribute.attributeNameAr ?? null,
        selectedValue: attribute.selectedValue,
        selectedValueAr: attribute.selectedValueAr ?? null,
      })),
    }))

    // Snapshot du panier AVANT de le vider — c'est la seule source des noms
    // produit / prix / attributs pour le message WhatsApp, le backend ne les
    // renvoie pas dans la réponse de POST /orders.
    const cartSnapshotForWhatsApp = cart.map((item) => ({
      productName: getProductName(item) || "",
      price: item.price,
      quantity: item.quantity,
      selectedAttributes: getSelectedAttributes(item),
    }))

    console.log("========== CREATE ORDER ==========")
    console.log("Cart:", cart)
    console.log("Order items:", orderItems)
    console.log("=================================")

    try {
      setIsSubmitting(true)

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: {
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            phoneNumber: formData.phone.trim(),
            email: formData.email.trim(),
          },
          shippingAddress: {
            street: formData.address.trim(),
            city: formData.city.trim(),
            state: formData.state.trim(),
            postalCode: formData.postalCode.trim(),
            country: formData.country.trim(),
          },
          paymentMethod: PAYMENT_METHOD,
          items: orderItems,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMessage = data.error || data.message || "Impossible de créer la commande. Veuillez réessayer."
        setErrorMessages([{ id: "api-error", message: errorMessage }])
        return
      }

      // Succès : on construit le snapshot autonome pour l'écran de
      // confirmation + le message WhatsApp, en préférant les montants
      // renvoyés par le backend (source de vérité) avec repli sur le total
      // calculé côté client si jamais un champ manquait dans la réponse.
      setOrderConfirmation({
        orderNumber: data.orderNumber,
        paymentMethod: PAYMENT_METHOD,
        items: cartSnapshotForWhatsApp,
        customer: {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
        },
        shippingAddress: {
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          postalCode: formData.postalCode.trim(),
          country: formData.country.trim(),
        },
        subtotal: data.subtotal ?? totalPrice,
        shipping: data.shipping ?? 0,
        tax: data.tax ?? 0,
        total: data.total ?? totalPrice,
      })

      // Vide le panier et le formulaire uniquement APRÈS avoir capturé le
      // snapshot ci-dessus.
      clearCart()
      setFormData(initialFormData)
      setFieldErrors({})
    } catch (error) {
      console.error("Order error:", error)
      setErrorMessages([{
        id: "network-error",
        message: "Erreur réseau : impossible de créer la commande. Veuillez vérifier votre connexion et réessayer.",
      }])
    } finally {
      setIsSubmitting(false)
    }
  }

  // Small helper to render an input + its error text consistently
  const renderField = (
    field: keyof CheckoutFormData,
    props: {
      label: string
      required?: boolean
      type?: string
      textarea?: boolean
      minHeight?: string
    }
  ) => {
    const error = fieldErrors[field]
    const commonClassName = `w-full rounded-2xl border ${
      error ? "border-red-400/60" : "border-white/10"
    } bg-black/30 px-4 py-3 text-white outline-none disabled:opacity-50`

    return (
      <div>
        {props.textarea ? (
          <textarea
            ref={(el) => { fieldRefs.current[field] = el }}
            value={formData[field]}
            onChange={updateField(field)}
            placeholder={`${props.label}${props.required ? " *" : ""}`}
            disabled={isSubmitting}
            className={`${props.minHeight || "min-h-24"} ${commonClassName}`}
          />
        ) : (
          <input
            ref={(el) => { fieldRefs.current[field] = el }}
            type={props.type || "text"}
            value={formData[field]}
            onChange={updateField(field)}
            placeholder={`${props.label}${props.required ? " *" : ""}`}
            disabled={isSubmitting}
            className={commonClassName}
          />
        )}
        {error && (
          <p className="mt-1 text-sm text-red-400">{error}</p>
        )}
      </div>
    )
  }

  // Bloc "attributs" d'une ligne panier : interactif si le produit expose
  // encore ses attributs, sinon repli en lecture seule sur la sélection
  // déjà enregistrée (jamais de crash dans les deux cas).
  const renderItemAttributes = (item: CartItem) => {
    const productAttributes = getProductAttributes(item)
    const selectedAttributes = getSelectedAttributes(item)

    if (productAttributes.length === 0) {
      if (selectedAttributes.length === 0) return null

      return (
        <ul dir={language === "ar" ? "rtl" : "ltr"} className="space-y-0.5 text-sm text-white/60">
          {selectedAttributes.map((attribute, index) => (
            <li key={`${item.variantKey}-${attribute.attributeName}-${index}`}>
              {getSelectedAttributeLabel(attribute)}
            </li>
          ))}
        </ul>
      )
    }

    return (
      <div dir={language === "ar" ? "rtl" : "ltr"} className="space-y-3">
        {productAttributes.map((attribute) => {
          const attrKey = getAttributeKey(attribute)
          const label = attributeLabel(attribute)
          const isColor = isColorAttribute(attribute)

          return (
            <div key={`${item.variantKey}-${attrKey}`} className="space-y-1.5">
              <p className="text-[11px] font-medium uppercase tracking-wide text-white/45">{label}</p>
              <div className="flex flex-wrap items-center gap-2">
                {(attribute.values ?? []).map((rawValue) => {
                  const value = normalizeAttributeValue(rawValue)
                  const valueKey = getAttributeValueKey(value)
                  const valueLabel = language === "ar" ? value.valueAr || value.value : value.value
                  const selected = isValueSelectedForAttribute(selectedAttributes, attribute, value)

                  if (isColor) {
                    const hex = getColorFromValue(value.value)
                    const light = isLightColorHex(hex)

                    return (
                      <button
                        key={valueKey}
                        type="button"
                        onClick={() => updateItemAttribute(item.variantKey, attrKey, valueKey)}
                        aria-pressed={selected}
                        aria-label={`${label} ${valueLabel}`}
                        title={valueLabel}
                        className={`relative h-7 w-7 shrink-0 rounded-full transition-all ${
                          light ? "border border-white/40" : "border border-white/10"
                        } ${selected ? "ring-2 ring-[#C9A84C] ring-offset-2 ring-offset-[#0f0f0f]" : ""}`}
                        style={{ backgroundColor: hex }}
                      >
                        {selected && (
                          <Check
                            size={12}
                            className="absolute inset-0 m-auto"
                            color={light ? "#111111" : "#FFFFFF"}
                          />
                        )}
                      </button>
                    )
                  }

                  return (
                    <button
                      key={valueKey}
                      type="button"
                      onClick={() => updateItemAttribute(item.variantKey, attrKey, valueKey)}
                      aria-pressed={selected}
                      aria-label={`${label} ${valueLabel}`}
                      className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-all ${
                        selected
                          ? "border-[#C9A84C] bg-[#C9A84C]/15 text-[#E8C97E]"
                          : "border-white/15 text-white/70 hover:border-[#C9A84C]/50 hover:text-[#E8C97E]"
                      }`}
                    >
                      {valueLabel}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // ---------------------------------------------------------------------
  // Écran de confirmation post-commande (remplace panier + formulaire).
  // ---------------------------------------------------------------------
  if (orderConfirmation) {
    return (
      <main className="min-h-screen bg-black pt-28">
        <Navbar />
        <section className="px-6 py-12 md:px-12">
          <OrderConfirmationCard order={orderConfirmation} language={language} />
        </section>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black pt-28">
      <Navbar />
      <section className="px-6 py-12 md:px-12">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-10 text-4xl font-cormorant text-white md:text-6xl">{cartLabels.title}</h1>

          {cart.length === 0 ? (
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-10 text-center">
              <p className="mb-6 text-lg text-white">{cartLabels.empty}</p>
              <Link href="/shop" className="btn-primary">{cartLabels.continue}</Link>
            </div>
          ) : (
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.variantKey} className="flex flex-col gap-4 rounded-[24px] border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-start">
                    <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-2xl sm:w-28">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={getProductName(item) || "Article du panier"}
                        fill
                        sizes="(max-width: 768px) 100vw, 100px"
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 space-y-3">
                      <div>
                        <h2 className="text-2xl font-cormorant text-white">{getProductName(item)}</h2>
                        <p className="text-lg font-semibold text-[#e8c97e]">{item.price} MAD</p>
                      </div>

                      {renderItemAttributes(item)}

                      <div className="flex flex-wrap items-center gap-4 pt-1">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.variantKey, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="rounded-full border border-white/10 px-3 py-1 text-white disabled:opacity-50"
                          >
                            −
                          </button>
                          <span className="min-w-8 text-center text-white">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.variantKey, item.quantity + 1)}
                            className="rounded-full border border-white/10 px-3 py-1 text-white hover:bg-white/10"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.variantKey)}
                          className="text-sm text-red-400 hover:text-red-300"
                        >
                          {cartLabels.remove}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <aside className="rounded-[28px] border border-white/10 bg-white/5 p-6">
                <h2 className="mb-6 text-2xl font-cormorant text-white">{cartLabels.orderSummary}</h2>
                <div className="mb-6 rounded-2xl border border-[#c9a84c]/20 bg-[#c9a84c]/10 p-4 text-sm text-[#f1dfac]">
                  {cartLabels.payment}
                </div>

                {/* Error Messages */}
                {errorMessages.length > 0 && (
                  <div className="mb-4 space-y-2">
                    {errorMessages.map((error) => (
                      <AlertBox
                        key={error.id}
                        type="error"
                        message={error.message}
                        autoClose={0}
                        onClose={() => setErrorMessages((msgs) => msgs.filter((m) => m.id !== error.id))}
                      />
                    ))}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {renderField("firstName", { label: "Prénom", required: true })}
                    {renderField("lastName", { label: "Nom", required: true })}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {renderField("phone", { label: "Téléphone", required: true, type: "tel" })}
                    {renderField("email", { label: "Email", required: true, type: "email" })}
                  </div>

                  {renderField("address", { label: "Adresse", required: true, textarea: true, minHeight: "min-h-24" })}

                  <div className="grid grid-cols-2 gap-4">
                    {renderField("city", { label: "Ville", required: true })}
                    {renderField("state", { label: "Région" })}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {renderField("postalCode", { label: "Code postal" })}
                    {renderField("country", { label: "Pays", required: true })}
                  </div>

                  {renderField("notes", { label: "Notes (optionnel)", textarea: true, minHeight: "min-h-24" })}
                </div>

                <div className="my-6 border-t border-white/10 pt-6">
                  <div className="flex items-center justify-between text-white">
                    <span>{cartLabels.total}</span>
                    <span className="text-2xl font-bold text-[#e8c97e]">{totalPrice} MAD</span>
                  </div>
                </div>

                <button
                  onClick={handleOrder}
                  disabled={isSubmitting || cart.length === 0 || !isFormValid}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Traitement...
                    </>
                  ) : (
                    cartLabels.confirm
                  )}
                </button>
              </aside>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  )
}