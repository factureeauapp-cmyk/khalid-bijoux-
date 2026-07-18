"use client"

import React, { useMemo, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import AlertBox from "@/components/AlertBox"
import { useCart } from "../CartContext"
import { useAppContext } from "../providers/AppContext"

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

export default function CartPage() {
  const { cart, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart()
  const { t, language } = useAppContext()
  const cartLabels = t("cart")

  const [formData, setFormData] = useState<CheckoutFormData>(initialFormData)
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessages, setErrorMessages] = useState<ErrorAlert[]>([])

  // Refs used to auto-focus the first invalid field on submit
  const fieldRefs = useRef<Partial<Record<keyof CheckoutFormData, HTMLInputElement | HTMLTextAreaElement | null>>>({})

  const getProductName = (item: any) => {
    return language === "ar" ? item.nameAr : item.nameFr
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
    setSuccessMessage("")

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
          paymentMethod: "Cash on Delivery",
          items: cart.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            // NOTE: adapt `item.size` to whatever field name your
            // CartContext actually uses for the selected size.
            selectedSize: item.size ?? null,
          })),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMessage = data.error || data.message || "Impossible de créer la commande. Veuillez réessayer."
        setErrorMessages([{ id: "api-error", message: errorMessage }])
        return
      }

      // Success!
      setSuccessMessage(data.message || "Commande créée avec succès ! 🎉 Nous vous contacterons bientôt.")

      // Clear form and cart ONLY on success
      clearCart()
      setFormData(initialFormData)
      setFieldErrors({})

      setTimeout(() => setSuccessMessage(""), 5000)
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
                  <div key={item.id} className="flex flex-col gap-4 rounded-[24px] border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center">
                    <div className="relative h-28 w-full overflow-hidden rounded-2xl sm:w-28">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={getProductName(item) || "Article du panier"}
                        fill
                        sizes="(max-width: 768px) 100vw, 100px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h2 className="text-2xl font-cormorant text-white">{getProductName(item)}</h2>
                      <p className="text-lg font-semibold text-[#e8c97e]">{item.price} MAD</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="rounded-full border border-white/10 px-3 py-1 text-white disabled:opacity-50"
                      >
                        −
                      </button>
                      <span className="min-w-8 text-center text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="rounded-full border border-white/10 px-3 py-1 text-white hover:bg-white/10"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-sm text-red-400 hover:text-red-300"
                    >
                      {cartLabels.remove}
                    </button>
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

                {/* Success Message */}
                {successMessage && (
                  <div className="mb-4">
                    <AlertBox
                      type="success"
                      message={successMessage}
                      autoClose={5000}
                      onClose={() => setSuccessMessage("")}
                    />
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