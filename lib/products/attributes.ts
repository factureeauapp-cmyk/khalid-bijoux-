import type {
  Product,
  ProductAttribute,
  ProductAttributeValue,
  SelectedAttributes,
  SelectedCartAttribute,
} from "@/lib/store-types"

/** Accepts the legacy string format while all newly saved attributes use objects. */
export type ProductAttributeValueInput = ProductAttributeValue | string

// ============================================================================
// NORMALISATION / CLÉS — jamais de nom d'attribut codé en dur
// ============================================================================

export function normalizeAttributeValue(value: ProductAttributeValueInput): ProductAttributeValue {
  return typeof value === "string" ? { value } : value
}

/** Uses a persistent API id when one exists, while remaining compatible with legacy products. */
export function getAttributeKey(attribute: ProductAttribute): string {
  return attribute.id || attribute.name
}

export function getAttributeValueKey(value: ProductAttributeValueInput): string {
  const normalized = normalizeAttributeValue(value)
  return normalized.id || normalized.value
}

export function getAttributeValueLabel(
  value: ProductAttributeValueInput,
  language: "fr" | "ar" = "fr"
): string {
  const normalized = normalizeAttributeValue(value)
  return language === "ar" && normalized.valueAr ? normalized.valueAr : normalized.value
}

/** Matches a stored cart attribute back to its product attribute definition. */
function selectedAttributeMatchesAttribute(
  selected: SelectedCartAttribute,
  attribute: ProductAttribute
): boolean {
  return (selected.attributeId ?? selected.attributeName) === getAttributeKey(attribute)
}

// ============================================================================
// VALIDATION DE LA SÉLECTION (page produit)
// ============================================================================

/** Un produit a-t-il des attributs à faire sélectionner ? Gère undefined/null/vide. */
export function hasSelectableAttributes(
  attributes?: ProductAttribute[] | null
): boolean {
  return Array.isArray(attributes) && attributes.length > 0
}

export function isAttributeSelectionComplete(
  attributes: ProductAttribute[] | undefined | null,
  selectedAttributes: SelectedAttributes
): boolean {
  if (!hasSelectableAttributes(attributes)) return true

  return attributes!.every((attribute) => {
    const selectedValue = selectedAttributes[getAttributeKey(attribute)]
    return Boolean(selectedValue) && attribute.values.some(
      (value) => getAttributeValueKey(value) === selectedValue
    )
  })
}

/** Libellés (bilingues) des caractéristiques encore non sélectionnées. */
export function getMissingAttributeLabels(
  attributes: ProductAttribute[] | undefined | null,
  selectedAttributes: SelectedAttributes,
  language: "fr" | "ar" = "fr"
): string[] {
  if (!hasSelectableAttributes(attributes)) return []

  return attributes!
    .filter((attribute) => {
      const selectedValue = selectedAttributes[getAttributeKey(attribute)]
      return !selectedValue || !attribute.values.some(
        (value) => getAttributeValueKey(value) === selectedValue
      )
    })
    .map((attribute) => (language === "ar" && attribute.nameAr ? attribute.nameAr : attribute.name))
}

// ============================================================================
// PANIER — transformation sélection UI -> attributs "riches" + clé de variante
// ============================================================================

/**
 * Convertit la sélection légère de la page produit (Record id/name -> valeur)
 * en tableau auto-suffisant (nom + valeur en FR/AR) prêt à être stocké dans
 * le panier et envoyé au backend.
 */
export function buildSelectedCartAttributes(
  product: Pick<Product, "attributes">,
  selectedAttributes: SelectedAttributes
): SelectedCartAttribute[] {
  if (!hasSelectableAttributes(product.attributes)) return []

  return product.attributes!
    .filter((attribute) => Boolean(selectedAttributes[getAttributeKey(attribute)]))
    .map((attribute) => {
      const selectedValueKey = selectedAttributes[getAttributeKey(attribute)]
      const matchedValue = attribute.values.find(
        (value) => getAttributeValueKey(value) === selectedValueKey
      )
      const normalizedValue = matchedValue
        ? normalizeAttributeValue(matchedValue)
        : { value: selectedValueKey }

      return {
        attributeId: attribute.id,
        attributeName: attribute.name,
        attributeNameAr: attribute.nameAr,
        valueId: normalizedValue.id,
        selectedValue: normalizedValue.value,
        selectedValueAr: normalizedValue.valueAr,
      }
    })
}

/**
 * Remplace (ou ajoute) la valeur d'UN attribut dans un tableau de
 * selectedAttributes déjà présent dans le panier — utilisé quand le client
 * modifie une variante directement depuis CartPage.
 *
 * Ne modifie jamais les autres attributs de la ligne.
 * Si l'attribut ou la valeur n'existe plus côté produit, ne fait rien
 * (retourne le tableau inchangé) plutôt que de planter.
 */
export function replaceSelectedCartAttribute(
  selectedAttributes: SelectedCartAttribute[],
  productAttributes: ProductAttribute[] | undefined | null,
  attributeId: string,
  valueId: string
): SelectedCartAttribute[] {
  if (!hasSelectableAttributes(productAttributes)) return selectedAttributes

  const attribute = productAttributes!.find((candidate) => getAttributeKey(candidate) === attributeId)
  if (!attribute) return selectedAttributes

  const matchedValue = attribute.values.find((value) => getAttributeValueKey(value) === valueId)
  if (!matchedValue) return selectedAttributes

  const normalizedValue = normalizeAttributeValue(matchedValue)

  const newEntry: SelectedCartAttribute = {
    attributeId: attribute.id,
    attributeName: attribute.name,
    attributeNameAr: attribute.nameAr,
    valueId: normalizedValue.id,
    selectedValue: normalizedValue.value,
    selectedValueAr: normalizedValue.valueAr,
  }

  const alreadyHasAttribute = selectedAttributes.some((selected) =>
    selectedAttributeMatchesAttribute(selected, attribute)
  )

  if (alreadyHasAttribute) {
    return selectedAttributes.map((selected) =>
      selectedAttributeMatchesAttribute(selected, attribute) ? newEntry : selected
    )
  }

  return [...selectedAttributes, newEntry]
}

/** Est-ce que `value` est actuellement la valeur choisie pour `attribute` dans cette ligne panier ? */
export function isValueSelectedForAttribute(
  selectedAttributes: SelectedCartAttribute[],
  attribute: ProductAttribute,
  value: ProductAttributeValueInput
): boolean {
  const match = selectedAttributes.find((selected) => selectedAttributeMatchesAttribute(selected, attribute))
  if (!match) return false
  return (match.valueId ?? match.selectedValue) === getAttributeValueKey(value)
}

/**
 * Génère une clé unique et déterministe pour une combinaison
 * produit + attributs sélectionnés.
 *
 * IMPORTANT : les attributs sont triés alphabétiquement par NOM avant la
 * génération, donc peu importe l'ordre dans lequel l'utilisateur les a
 * choisis, deux sélections identiques produisent toujours la même clé.
 *
 * Exemple :
 *   buildVariantKey("PRD-000002", [{attributeName:"Taille", selectedValue:"8"}, {attributeName:"Couleur", selectedValue:"Or"}])
 *   => "PRD-000002|Couleur=Or|Taille=8"
 */
export function buildVariantKey(
  productId: string,
  selectedCartAttributes: SelectedCartAttribute[]
): string {
  if (!selectedCartAttributes || selectedCartAttributes.length === 0) {
    return productId
  }

  const sorted = [...selectedCartAttributes].sort((a, b) =>
    a.attributeName.localeCompare(b.attributeName)
  )

  const parts = sorted.map((attribute) => `${attribute.attributeName}=${attribute.selectedValue}`)

  return `${productId}|${parts.join("|")}`
}

// ============================================================================
// COULEURS — détection + résolution CSS, sans jamais coder un nom en dur
// ============================================================================

const COLOR_ATTRIBUTE_NAMES = ["couleur", "color", "لون"]

/**
 * Détecte dynamiquement si un attribut représente une couleur, en se basant
 * sur son nom (FR, EN ou AR). Les autres attributs (taille, matière, pierre,
 * etc.) gardent un affichage standard en boutons.
 */
export function isColorAttribute(attribute: ProductAttribute): boolean {
  const name = attribute.name?.trim().toLowerCase() ?? ""
  const nameAr = attribute.nameAr?.trim() ?? ""
  return COLOR_ATTRIBUTE_NAMES.includes(name) || COLOR_ATTRIBUTE_NAMES.includes(nameAr)
}

/**
 * Table de correspondance nom de couleur -> couleur CSS.
 * Le backend ne stocke aujourd'hui que `value`/`valueAr`, jamais de code
 * couleur. Cette table est un pont temporaire : si un `colorHex` est fourni
 * (futur champ possible sur ProductAttributeValue), il est toujours prioritaire.
 */
const KNOWN_COLOR_HEX: Record<string, string> = {
  or: "#D4AF37",
  gold: "#D4AF37",
  "or jaune": "#D4AF37",

  argent: "#C0C0C0",
  silver: "#C0C0C0",

  "or blanc": "#F5F5F0",
  "white gold": "#F5F5F0",

  "or rose": "#B76E79",
  "rose gold": "#B76E79",

  noir: "#111111",
  black: "#111111",

  blanc: "#FFFFFF",
  white: "#FFFFFF",

  champagne: "#E8D3A5",
  bronze: "#CD7F32",
  cuivre: "#B87333",
  copper: "#B87333",

  rouge: "#C0392B",
  red: "#C0392B",

  bleu: "#3498DB",
  blue: "#3498DB",

  vert: "#2E8B57",
  green: "#2E8B57",

  violet: "#8E44AD",
  purple: "#8E44AD",

  rose: "#E8A0A8",
  pink: "#E8A0A8",

  jaune: "#F1C40F",
  yellow: "#F1C40F",

  orange: "#E67E22",
}

const FALLBACK_COLOR_HEX = "#8A8A8A"

/**
 * Résout une valeur de couleur textuelle vers un code CSS.
 * `colorHex` (optionnel) permet de brancher plus tard un vrai champ
 * `colorHex?: string` sur ProductAttributeValue sans refaire cette fonction :
 * il suffira de le passer ici en priorité, ce qui est déjà le cas.
 */
export function getColorFromValue(value: string, colorHex?: string): string {
  if (colorHex) return colorHex
  const normalized = value.trim().toLowerCase()
  return KNOWN_COLOR_HEX[normalized] ?? FALLBACK_COLOR_HEX
}





/** Utilisé pour choisir une bordure/coche visibles sur les couleurs claires (ex: blanc). */
export function isLightColorHex(hex: string): boolean {
  const clean = hex.replace("#", "")
  if (clean.length !== 6) return false
  const r = parseInt(clean.slice(0, 2), 16)
  const g = parseInt(clean.slice(2, 4), 16)
  const b = parseInt(clean.slice(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.6
}