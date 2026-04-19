type ClassDictionary = Record<string, boolean | null | undefined>
type ClassArray = ClassValue[]
export type ClassValue =
  | string
  | number
  | null
  | undefined
  | boolean
  | ClassDictionary
  | ClassArray

function flattenClassValue(value: ClassValue): string[] {
  if (!value) {
    return []
  }

  if (typeof value === "string" || typeof value === "number") {
    return [String(value)]
  }

  if (Array.isArray(value)) {
    return value.flatMap(flattenClassValue)
  }

  if (typeof value === "object") {
    return Object.entries(value)
      .filter(([, enabled]) => Boolean(enabled))
      .map(([className]) => className)
  }

  return []
}

export function cn(...inputs: ClassValue[]) {
  return inputs.flatMap(flattenClassValue).join(" ")
}
