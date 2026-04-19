# Admin Dashboard - Architecture & Deployment Guide

## 🏗️ Architecture

### 1. **Frontend Components** (`components/admin/`)

Tous les composants sont modulaires, réutilisables et bien documentés:

#### `ImageUploader.tsx`
- Drag & drop support
- Aperçu instantané
- Validation inline
- Loader pendant upload

```tsx
<ImageUploader
  previewUrl={previewUrl}
  onFileSelect={setSelectedFile}
  isLoading={isSaving}
/>
```

#### `LanguageTabs.tsx`
- Onglets FR/AR
- RTL support
- Styling cohérent

#### `CategorySelect.tsx`
- Dropdown avec catégories existantes
- Créateur de catégorie intégré
- Support bilingue (FR/AR)
- Requêtes API optimisées

#### `ProductForm.tsx`
- Formulaire principal
- Intègre tous les composants
- Validation frontend
- Messages d'erreur détaillés

#### `ProductList.tsx`
- Grille responsive (2 colonnes)
- Cartes produits enrichies
- Boutons Modifier/Supprimer
- Affichage dynamique basé sur la langue

#### `SuccessMessage.tsx`
- Toast avec fermeture auto (3s)
- Design consistent
- Animations fluides

### 2. **Backend API** (`app/api/`)

#### `/api/products`
**GET**: Récupère tous les produits
```bash
curl http://localhost:3000/api/products
```

**POST**: Crée un nouveau produit (formData)
```bash
curl -X POST http://localhost:3000/api/products \
  -F "nameFr=Bague Or" \
  -F "nameAr=خاتم ذهب" \
  -F "descriptionFr=..." \
  -F "descriptionAr=..." \
  -F "categoryId=rings" \
  -F "price=1000" \
  -F "image=@image.jpg"
```

#### `/api/products/[id]`
**PUT**: Modifie un produit existant
```bash
curl -X PUT http://localhost:3000/api/products/product_123 -F ...
```

**DELETE**: Supprime un produit
```bash
curl -X DELETE http://localhost:3000/api/products/product_123
```

#### `/api/categories`
**GET**: Récupère toutes les catégories
```bash
curl http://localhost:3000/api/categories
```

**POST**: Crée une nouvelle catégorie
```bash
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -d '{"nameFr":"Colliers","nameAr":"قلادات"}'
```

### 3. **Data Layer** (`lib/server/`)

#### `store.ts`
- Gestion de `data/store.json`
- Read/Write synchrone
- Normalisation des données
- Seed initial depuis `/lib/data.ts`

#### `product-payload.ts`
- Parse FormData en Produit
- Validation bilingue
- Gestion des catégories
- Appel à `saveProductImage`

#### `uploads.ts`
- Sauvegarde sécurisée des images
- Validation MIME type
- Vérification taille
- Génération noms uniques
- Stockage: `public/uploads/produits/`

### 4. **Frontend State** (`app/providers/AppContext.tsx`)

```tsx
// AppContext fournit
{
  language: 'fr' | 'ar',
  dir: 'ltr' | 'rtl',
  products: Product[],
  categories: Category[],
  orders: CustomerOrder[],
  refreshProducts: () => Promise<void>,
  refreshCategories: () => Promise<void>,
  refreshOrders: () => Promise<void>,
}
```

---

## 📦 Déploiement

### 1. **Installation locale (Dev)**

```bash
# Clone + install
git clone [repo]
cd khalid-bijoux
npm install

# Scripts d'initialisation
bash scripts/init-uploads.sh
# ou sur Windows:
scripts\init-uploads.bat

# Démarrage
npm run dev
# http://localhost:3000/admin
```

### 2. **Build Production**

```bash
# Compile TypeScript + Next.js
npm run build

# Vérifier les erreurs
npm run lint

# Test
npm start
```

### 3. **Fichiers statiques**

Le dossier `public/uploads/produits/` doit:
- ✅ Exister et avoir les permissions d'écriture
- ✅ Être accessibilité en HTTP (`/uploads/produits/`)
- ✅ Ne pas être versionnée (`.gitignore`)

### 4. **Base de données**

Les données sont stockées en `data/store.json`:
- ✅ Fichier JSON simple (JSON DB)
- ✅ Format: `{ products: [], categories: [], orders: [] }`
- ✅ Pas de migration nécessaire

### 5. **Authentification Admin**

- Voir: `lib/server/admin-auth.ts`
- Vérifiez `/admin/login` pour les credentials
- Les check auth sont sur chaque endpoint

---

## 🔄 Flux de données

### Upload d'image

```
1. User sélectionne image
   ↓
2. Frontend crée ObjectURL pour preview
   ↓
3. User soumet formulaire
   ↓
4. POST /api/products (FormData incl. image)
   ↓
5. Backend: saveProductImage()
   - Validate MIME type
   - Check file size
   - Generate unique name
   - Save to public/uploads/produits/
   - Return path: /uploads/produits/...
   ↓
6. Backend: saveStore()
   - Write product to data/store.json
   ↓
7. Frontend: refreshProducts()
   - Fetch /api/products
   - Update AppContext.products
   ↓
8. UI: Display success message
```

### Modification produit

```
1. User clique "Modifier" sur card
   ↓
2. Form pré-remplissage depuis AppContext.products
   ↓
3. User change champs + upload nouvelle image (optionnel)
   ↓
4. PUT /api/products/[id]
   ↓
5. Backend:
   - Find existing product
   - Parse form data
   - If new image: saveProductImage() + delete old
   - Update product in store.json
   ↓
6. Frontend refreshProducts() + reset form
   ↓
7. Success message
```

---

## 🛡️ Sécurité

### Image Upload
- ✅ Whitelist MIME types: image/jpeg, image/png, image/webp
- ✅ Max size: 2 MB
- ✅ Filename sanitized: lowercase, no special chars
- ✅ UUID suffix: unique per upload

### Admin Access
- ✅ Auth check sur tous les endpoints POST/PUT/DELETE
- ✅ Session cookie
- ✅ CSRF protection via Next.js

### Data Validation
- ✅ Frontend: validation avant submit
- ✅ Backend: re-validation strict
- ✅ Error messages détaillés
- ✅ Erreurs sensibles loggées, pas exposées

---

## 📊 Schéma de données

### Product
```typescript
interface Product {
  id: string                  // auto-generated
  nameFr: string             // Français
  nameAr: string             // العربية
  categoryId: string         // ref à Category.id
  price: number              // MAD
  originalPrice?: number     // show as strikethrough
  tag?: string               // "Nouveau", "Promo"
  descriptionFr: string      // détails FR
  descriptionAr: string      // تفاصيل AR
  image: string              // chemin: /uploads/produits/...
}
```

### Category
```typescript
interface Category {
  id: string                 // slugified name
  nameFr: string            // e.g., "Bagues"
  nameAr: string            // e.g., "خواتم"
}
```

### Store (data/store.json)
```typescript
interface StoreFile {
  products: Product[]
  categories: Category[]
  orders: CustomerOrder[]
}
```

---

## 🚀 Environment

### Frontend
- Node 18+ (pour Next.js 16)
- React 19
- TypeScript 5
- TailwindCSS 4

### Backend
- Node runtime (Next.js API routes)
- Filesystem access pour store.json
- Filesystem write pour uploads

### Images
- Supports: JPG (image/jpeg), PNG (image/png), WEBP (image/webp)
- Max: 2 MB par image
- Stockées localement: `public/uploads/produits/`

---

## 🐛 Troubleshooting

### Images n'apparaissent pas après upload
- [ ] Vérifier que `public/uploads/produits/` existe
- [ ] Vérifierles permissions d'écriture du dossier
- [ ] Vérifier que le chemin est correct dans store.json

### Erreurs de validation
- [ ] Tous les champs obligatoires remplis?
- [ ] Image format valide (JPG/PNG/WEBP)?
- [ ] Image < 2 MB?
- [ ] Catégorie sélectionnée?

### Produits non sauvegardés
- [ ] Vérifier les logs backend
- [ ] Auth cookie valide?
- [ ] `data/store.json` accessible?

### Dropd & drop non fonctionnel
- [ ] Browser supporte HTML5 Drag & Drop?
- [ ] Pas de conflit de CSS/JS?

---

## 📝 Logs importants

```bash
# Watch le fichier store.json
file watcher: data/store.json

# Logs des uploads
[timestamp] Saved image: /uploads/produits/bague-or-1234567890-uuid.jpg

# Logs des erreurs
[ERROR] INVALID_FILE_TYPE: Only JPEG, PNG, WEBP accepted
[ERROR] FILE_TOO_LARGE: Max 2 MB, got 3 MB
[ERROR] CATEGORY_NOT_FOUND: Invalid categoryId
```

---

## 🎯 Checklist Déploiement

- [ ] `npm install` - dépendances installées
- [ ] `npm run build` - build success
- [ ] `bash scripts/init-uploads.sh` - dossier créé
- [ ] `data/store.json` - fichier créé
- [ ] `/admin` - page accessible
- [ ] Upload d'image - fonctionne
- [ ] Création catégorie - fonctionne
- [ ] FR/AR tabs - visible
- [ ] Suppression produit - fonctionne

---

## 📚 Références

- [Store Types Definition](lib/store-types.ts)
- [Admin Page](app/admin/page.tsx)
- [Admin Guide](ADMIN_GUIDE.md)
- [API Products](app/api/products/)
- [API Categories](app/api/categories/)

---

*Last updated: 2026-04-11*
