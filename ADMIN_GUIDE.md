# Guide Admin - Khalid Bijoux

## 🎯 Vue d'ensemble

Bienvenue dans le nouveau tableau de bord admin amélioré avec une architecture modulaire, support complet FR/AR, et upload d'images sécurisé.

---

## ✨ Nouvelles fonctionnalités

### 1. **Upload d'images réel**
- Support complet du drag & drop
- Aperçu instantané avant enregistrement
- Validation sécurisée :
  - Formats : JPG, PNG, WEBP
  - Taille max : 2 MB
  - Les images sont sauvegardées dans `public/uploads/produits/`
  - Noms uniques générés automatiquement

### 2. **Gestion des catégories**
- **Sélection d'une catégorie existante** avec dropdown
- **Création de catégorie directement** depuis le formulaire
- Support bilingue (FR + AR) pour les catégories
- Les catégories se créent et se mettent en cache automatiquement

### 3. **Support multilingue complet (FR/AR)**
- Onglets dédié pour chaque langue
- Champs distincts :
  - Nom (FR) / اسم (AR)
  - Description (FR) / الوصف (AR)
- Support RTL automatique pour l'arabe
- Les deux versions sont stockées en base

### 4. **UI améliorée**
- Design moderne avec le thème doré (#c9a84c)
- Labels clairs au-dessus de chaque champ
- Espacements corrects
- Icônes intuitives (Lucide React)
- Loader pendant l'upload
- Messages de succès/erreur

### 5. **Modification de produit**
- Pré-remplissage complet des champs
- Remplacement d'image possible
- Conservation de l'image existante si non remplacée

---

## 📋 Structure du formulaire

### Onglets de langue
```
🇫🇷 Français | 🇸🇦 العربية
```

Chaque onglet vous permet d'éditer les champs dans la langue correspondante.

### Champs disponibles

#### Obligatoires
- **Nom (FR & AR)** : Nom du produit dans les deux langues
- **Description (FR & AR)** : Détails du produit
- **Catégorie** : Sélection ou création de catégorie
- **Image** : Upload obligatoire (JPG, PNG, WEBP < 2MB)
- **Prix** : Montant en MAD

#### Optionnels
- **Prix initial** : Pour afficher une réduction (barré)
- **Badge** : Étiquette comme "Nouveau", "Promo", etc.

---

## 🖼️ Gestion de l'image

### Upload
1. Cliquez sur la zone d'aperçu
2. Sélectionnez une image (ou drag & drop)
3. L'aperçu s'affiche instantanément
4. Enregistrer le produit pour finaliser l'upload

### Validation
Les images invalides montrent un message d'erreur :
- ❌ Format invalide → "Format d'image invalide (JPG, PNG, WEBP)"
- ❌ Taille excessive → "L'image dépasse 2 MB"

### Stockage
- Dossier : `public/uploads/produits/`
- Nom : `{nomProduit}-{timestamp}-{uuid}.{ext}`
- Chemin en base : `/uploads/produits/{nomFichier}`

---

## 📦 Gestion des catégories

### Sélectionner une catégorie existante
1. Ouvrez le dropdown "Catégorie"
2. Choisissez dans la liste
3. Les noms s'affichent dans la langue sélectionnée

### Créer une catégorie
1. Ouvrez le dropdown "Catégorie"
2. Cliquez sur "+ Créer une catégorie"
3. Entrez la traduction FR et AR
4. Cliquez "Créer"
5. La nouvelle catégorie est sélectionnée automatiquement

---

## 💾 Ajout/Modification de produit

### Ajouter un nouveau produit
1. La page affiche "Ajouter un produit"
2. Remplissez tous les champs obligatoires
3. Sélectionnez/créez une catégorie
4. Uploadez une image
5. Cliquez "Enregistrer le produit"
6. Message de succès ✨

### Modifier un produit existant
1. Cliquez "Modifier" sur une carte produit
2. La page passe en mode "Modifier le produit"
3. Les champs se pré-remplissent
4. Modifiez ce que vous voulez
5. L'image peut être remplacée (optionnel)
6. Cliquez "Enregistrer le produit"
7. Cliquez "+ Nouveau produit" pour réinitialiser le formulaire

### Supprimer un produit
1. Cliquez "Supprimer" sur la carte
2. Confirmez la suppression
3. Le produit est supprimé

---

## 📱 Liste des produits

Chaque card affiche :
- **Aperçu de l'image** (hover: zoom)
- **Nom** (dans la langue sélectionnée)
- **Catégorie** (badge doré)
- **Description** (3 lignes max)
- **Prix** (avec ancien prix barré si applicable)
- **Badge** (promotion, nouveau, etc.) en haut-droit
- **Actions** (Modifier / Supprimer)

---

## 🌐 Gestion des commandes

### Statuts disponibles
- 🟡 **Pending** : En attente
- 🔵 **In Progress** : En cours
- 🟢 **Delivered** : Livrée
- 🔴 **Cancelled** : Annulée

### Actions
- **Appeler** : Lien téléphone direct
- **Changer le statut** : Dropdown pour mettre à jour

### Affichage des détails
- Noms client, adresse, téléphone
- Date de création
- Liste des produits commandés avec images
- Total en MAD

---

## ✅ Validation et messages

### Messages d'erreur explicites
```
❌ "Veuillez remplir tous les champs requis"
❌ "Veuillez sélectionner une catégorie"
❌ "Une image est requise"
❌ "Format d'image invalide (JPG, PNG, WEBP)"
❌ "L'image dépasse 2 MB"
```

### Messages de succès
```
✨ "Produit ajouté avec succès ✨"
✨ "Produit modifié avec succès ✨"
✨ "Produit supprimé avec succès"
```

Les messages de succès disparaissent automatiquement après 3 secondes.

---

## 🔒 Sécurité

- ✅ Authentification admin requise pour créer/modifier/supprimer
- ✅ Validation du format d'image (MIME type)
- ✅ Vérification de taille (< 2MB)
- ✅ Noms de fichier uniques (UUID + timestamp)
- ✅ Nombres parsés avec validation
- ✅ Chaînes trimée et validées

---

## 🎨 Design

- **Thème** : Sombre avec accents doré (#c9a84c)
- **Police** : Cormorant (titres), Inter (labels)
- **Radius** : 2xl/28px (cohérent)
- **Transitions** : Smooth 0.2s
- **Icons** : Lucide React

---

## 🚀 Optimisations UX

✨ **Loader** pendant l'upload  
✨ **Drag & Drop** pour les images  
✨ **Aperçu instantané**  
✨ **Tab switching** rapide (FR/AR)  
✨ **Pré-remplissage** on edit  
✨ **Confirmation** before delete  
✨ **Animations** légères  

---

## 📊 Structure des fichiers

```
components/admin/
├── ImageUploader.tsx      # Upload avec drag & drop
├── CategorySelect.tsx     # Dropdown catégories + créateur
├── LanguageTabs.tsx       # Onglets FR/AR
├── ProductForm.tsx        # Formulaire principal
├── ProductList.tsx        # Grille de produits
└── SuccessMessage.tsx     # Toast de succès

app/admin/
└── page.tsx               # Page admin refactorisée

app/api/products/
├── route.ts               # GET (tous), POST (ajouter)
└── [id]/route.ts          # PUT (modifier), DELETE

app/api/categories/
└── route.ts               # GET (tous), POST (créer)

lib/server/
├── uploads.ts             # Sauvegarde d'images
├── product-payload.ts     # Parsing des données produit
├── store.ts               # Lecture/écriture des données

lib/
└── i18n.ts                # Traductions (admin updaté)
```

---

## 🎯 Points clés à retenir

1. **Les deux langues** : Toujours remplir FR et AR
2. **Catégories** : Créer directement dans le dropdown
3. **Images** : Drag & drop pour la rapidité
4. **Modification** : Cliquez sur "Modifier" sur la card
5. **Suppression** : Confirmation requise
6. **Messages** : Succès automatiquement fermés après 3s

---

## 📞 Support

Pour toute question, consultez les messages d'erreur spécifiques qui vous guident vers la solution.

Bonne gestion! 🎉
