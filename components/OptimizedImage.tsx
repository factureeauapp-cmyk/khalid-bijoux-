"use client"

import Image, { ImageProps } from "next/image"
import { useState } from "react"

interface OptimizedImageProps extends Omit<ImageProps, "onError"> {
  alt: string // Obligatoire
  fallback?: string
  onImageError?: () => void
}

/**
 * Composant Image optimisé avec gestion d'erreurs automatique
 * 
 * Avantages:
 * - alt est obligatoire
 * - Fallback automatique en cas d'erreur
 * - Optimisation automatique des images
 * - Gestion des erreurs de chargement
 * 
 * @example
 * <OptimizedImage 
 *   src={product.image} 
 *   alt={product.name}
 *   width={300}
 *   height={300}
 *   className="object-cover"
 * />
 */
export function OptimizedImage({
  alt,
  fallback = "/placeholder.svg",
  onImageError,
  ...props
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(
    props.src || fallback
  )
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (!hasError && imgSrc !== fallback) {
      setImgSrc(fallback)
      setHasError(true)
      onImageError?.()
      console.warn(`Image failed to load: ${props.src}. Using fallback.`)
    }
  }

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={handleError}
      sizes={
        props.sizes ||
        "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      }
    />
  )
}

export default OptimizedImage
