# 🎯 Admin Dashboard v2.0 - Setup Rapide

## ⚡ Installation (2 min)

```bash
# 1. Créer dossier uploads
bash scripts/init-uploads.sh        # Linux/Mac
scripts\init-uploads.bat           # Windows

# 2. Démarrer serveur
npm run dev

# 3. Accédez à http://localhost:3000/admin
```

---

## ✨ Fonctionnalités principales

### 🖼️ Upload d'images
- Drag & drop + clic
- Formats: JPG, PNG, WEBP
- Max: 2 MB
- Stockage: `public/uploads/produits/`

### 🏷️ Catégories dynamiques
- Sélection ou création directe
- Support FR + AR
- Dropdown intégré

### 🌐 Multilingue FR/AR
- Onglets 🇫🇷 / 🇸🇦
- Champs séparés par langue
- Support RTL automatique

### ✏️ Modification facile
- Pré-remplissage auto
- Aperçu image existante
- Changement d'image optionnel

### 📊 Interface moderne
- Thème doré/sombre
- Messages succès auto-close
- Animations fluides
- Responsive design

---

## 📁 Fichiers créés

```
components/admin/                  (6 composants)
├── ImageUploader.tsx             (upload + drag & drop)
├── CategorySelect.tsx            (dropdown + créateur)
├── LanguageTabs.tsx              (FR/AR tabs)
├── ProductForm.tsx               (formulaire principal)
├── ProductList.tsx               (grille produits)
└── SuccessMessage.tsx            (notifications)

app/admin/page.tsx                (page refactorisée)

public/uploads/produits/          (dossier uploads)

lib/i18n.ts                       (traductions ajoutées +20)
```

---

## 🎮 Utilisation

### Ajouter produit
1. Sélectionnez/créez catégorie
2. Remplissez FR (onglet 🇫🇷)
3. Remplissez AR (onglet 🇸🇦)
4. Uploadez image (clic/drag)
5. Enregistrez

### Modifier produit
1. Cliquez "Modifier" sur la carte
2. Champs pré-remplis automatiquement
3. Modifiez ce que vous voulez
4. Enregistrez

### Supprimer
1. Cliquez "Supprimer"
2. Confirmez
3. Fait!

---

## 🔒 Sécurité

✅ Validation image (MIME type, size)
✅ Noms fichiers auto-generés (UUID)
✅ Auth admin requise
✅ Validation multi-layer

---

## 📚 Documentation

- **ADMIN_GUIDE.md** - Guide complet utilisateur
- **TECHNICAL.md** - Détails architecture & API
- **WELCOME.md** - Notes bienvenue

---

## 🆘 Aide rapide

**Images n'apparaissent pas?**
→ Vérifiez `public/uploads/produits/` existe et writable

**Erreur de validation?**
→ Vérifiez tous les champs obligatoires (FR + AR)
→ Image < 2MB + format JPG/PNG/WEBP

**Catégorie non sauvegardée?**
→ Vérifiez `data/store.json` accessible

---

**Status:** ✅ Production Ready  
*Created: April 11, 2026*
