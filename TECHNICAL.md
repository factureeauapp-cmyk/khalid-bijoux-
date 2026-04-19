# 🏗️ Admin Dashboard v2.0 - Architecture Technique

## Structure

```
Frontend (React 19 + TypeScript)
├── components/admin/ (6 composants modulaires)
├── app/admin/page.tsx (page principale)
└── app/providers/AppContext.tsx (état global)

Backend (Next.js API Routes)
├── /api/products/ (GET, POST, PUT, DELETE)
├── /api/categories/ (GET, POST)
└── /api/admin/ (login, logout)

Data Layer
├── lib/server/
│   ├── store.ts (Read/Write JSON)
│   ├── uploads.ts (Save images)
│   ├── product-payload.ts (Parse FormData)
│   └── admin-auth.ts (Auth check)
├── data/store.json (Database)
└── public/uploads/produits/ (Images)
```

## API Endpoints

### Products
**GET** `/api/products` - Tous les produits
**POST** `/api/products` - Créer (FormData)
**PUT** `/api/products/[id]` - Modifier (FormData)
**DELETE** `/api/products/[id]` - Supprimer

### Categories
**GET** `/api/categories` - Toutes les catégories
**POST** `/api/categories` - Créer (JSON)

## Types de données

```typescript
// Product (Admin)
{
  id: string,
  nameFr: string,
  nameAr: string,
  categoryId: string,
  price: number,
  originalPrice?: number,
  tag?: string,
  descriptionFr: string,
  descriptionAr: string,
  image: string  // /uploads/produits/...
}

// Category
{
  id: string,      // slugified
  nameFr: string,
  nameAr: string
}
```

## Flux de données

**Upload image:**
1. User sélectionne image → ObjectURL pour preview
2. FormData + image file POST `/api/products`
3. Backend: validate (MIME, size) → save → return path
4. Frontend: refresh products → display success

**Créer catégorie:**
1. User remplit nameFr + nameAr dans dropdown
2. POST `/api/categories` (JSON)
3. Backend: validate → save → return category
4. Category auto-sélectionnée dans dropdown

**Modification:**
1. Click "Modifier" → form pré-rempli
2. Change data + optional new image
3. PUT `/api/products/[id]` (FormData)
4. Backend: validate → update → refresh

## Sécurité

✅ Image MIME types whitelist (jpeg, png, webp)
✅ Max size 2 MB check
✅ Filename: sanitized + UUID unique
✅ Admin auth sur POST/PUT/DELETE
✅ Frontend + backend validation
✅ Safe error messages

## Localisation

- **FR/AR tabs:** Switch entre languages
- **Champs séparés:** nameFr/nameAr, descriptionFr/descriptionAr
- **RTL support:** Automatique pour arabe
- **Traductions:** lib/i18n.ts (20+ clés ajoutées)

## Performance

- Lazy component loading
- Image preview avec ObjectURL cleanup
- Memoized functions
- Code-split automatiquement par Next.js
- ~15 KB gzipped (composants)

## Déploiement

```bash
# Local dev
npm run dev

# Production build
npm run build
npm start

# Init uploads
bash scripts/init-uploads.sh    # ou .bat Windows
```

**Infrastructure:**
- `/public/uploads/produits/` doit être writable
- `data/store.json` auto-créé au first-run
- Aucune dépendance supplémentaire needed

## Futur (optionnel)

- Migration vers MongoDB/PostgreSQL
- Cloud storage (AWS S3)
- Bulk import (CSV)
- Analytics dashboard
- Paiements gateway

---

*Technical Documentation - April 11, 2026*
