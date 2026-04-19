# 📸 Guide des Bonnes Pratiques - Images Next.js

## ✅ Règles Obligatoires

### 1. **Propriété `alt` OBLIGATOIRE**
Tous les `<Image />` doivent avoir une propriété `alt` descriptive.

```tsx
// ❌ INCORRECT
<Image src={product.image} fill />

// ✅ CORRECT
<Image 
  src={product.image || "/placeholder.svg"} 
  alt={product.name || "Produit"}
  fill 
/>
```

### 2. **Gestion des Images Manquantes**
Toujours fournir un fallback pour les images cassées.

```tsx
// Pattern à utiliser
<Image 
  src={image || "/placeholder.svg"}
  alt="Description"
  fill
  sizes="100px"
/>
```

### 3. **Optimisation avec `sizes`**
Toujours ajouter l'attribut `sizes` pour l'optimisation responsive.

```tsx
// Responsive
<Image 
  src={src}
  alt="Image"
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>

// Fixed size
<Image 
  src={src}
  alt="Image"
  width={300}
  height={300}
  sizes="300px"
/>
```

---

## 🎯 Cas d'Usage avec Exemples

### **A. Images de Produits (Admin & Shop)**
```tsx
import { OptimizedImage } from "@/components/OptimizedImage"

<OptimizedImage
  src={product.image}
  alt={product.name || "Produit"}
  width={300}
  height={300}
  className="object-cover"
/>
```

### **B. Images Hero (Full Width)**
```tsx
<OptimizedImage
  src="https://images.unsplash.com/..."
  alt="Bijoux de luxe"
  fill
  priority
  className="object-cover"
  sizes="100vw"
/>
```

### **C. Images Galerie (Grid)**
```tsx
<OptimizedImage
  src={image}
  alt="Galerie item"
  fill
  className="object-cover group-hover:scale-110"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

### **D. Images Avatar (Avatar)**
```tsx
<OptimizedImage
  src={user.avatar}
  alt={user.name || "Avatar"}
  width={80}
  height={80}
  className="rounded-full object-cover"
  sizes="80px"
/>
```

---

## 🛡️ Pattern de Fallback

```tsx
// Avec gestion d'erreur custom
<OptimizedImage
  src={product.image}
  alt={product.name}
  width={300}
  height={300}
  fallback="/placeholder.svg"
  sizes="300px"
  onImageError={() => {
    console.error(`Image non trouvée: ${product.image}`)
  }}
/>
```

---

## 🚨 Erreurs Courantes

### ❌ Absence d'alt
```tsx
<Image src={product.image} fill /> // ❌ Erreur!
```

### ❌ Variable vide comme src
```tsx
<Image src={image} alt="Produit" /> // ❌ Si image = ""
```

### ❌ Pas de sizes (images mal optimisées)
```tsx
<Image src={src} alt="Image" fill /> // ❌ Pas de sizes
```

### ❌ Oublier le fallback
```tsx
<Image src={product.image} alt="Produit" /> // ❌ Si image cassée
```

---

## ✨ Checklist pour Chaque Image

- [ ] Propriété `alt` présente et descriptive
- [ ] Fallback `/placeholder.svg` pour les images dynamiques
- [ ] Propriété `sizes` optimisée
- [ ] `className="object-cover"` pour les images responsives
- [ ] `priority` pour les images above-the-fold
- [ ] Gestion d'erreur si nécessaire

---

## 📚 Ressources

- [Next.js Image Documentation](https://nextjs.org/docs/app/api-reference/components/image)
- [Image Optimization Guide](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Web Accessibility - Alt Text](https://www.w3.org/WAI/tutorials/images/)

---

## 🔧 Utilitaire: OptimizedImage Component

Utiliser le composant `OptimizedImage` pour tous les cas complexes:

```tsx
import OptimizedImage from "@/components/OptimizedImage"

<OptimizedImage
  src={product.image || ""}
  alt={product.name}
  width={300}
  height={300}
  sizes="300px"
/>
```

Le composant gère automatiquement:
- ✅ Fallback en cas d'erreur
- ✅ Console.warn pour le debugging
- ✅ Optimisation des images
- ✅ Alt obligatoire
