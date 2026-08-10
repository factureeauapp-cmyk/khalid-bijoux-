export type Language = "fr" | "ar"

export const languages: Array<{ code: Language; label: string; nativeLabel: string; dir: "ltr" | "rtl" }> = [
  { code: "fr", label: "French", nativeLabel: "Français", dir: "ltr" },
  { code: "ar", label: "Arabic", nativeLabel: "العربية", dir: "rtl" },
]

export const defaultLanguage: Language = "fr"

export const translations = {
  fr: {
    brandName: "Khalid Bijoux",
    tagline: "Bijoux d'exception pour chaque moment important.",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    nav: {
      home: "Accueil",
      shop: "Boutique",
      about: "À propos",
      gallery: "Galerie",
      contact: "Contact",
      admin: "Admin",
      cart: "Panier",
    },
    home: {
      kicker: "Collection 2026",
      title: "Élégance qui laisse une trace",
      subtitle: "Découvrez des bijoux raffinés, pensés pour offrir, célébrer et transmettre.",
      ctaPrimary: "Voir la collection",
      ctaSecondary: "Commander maintenant",
      sectionTitle: "Sélection mise en avant",
      featuresTitle: "Pourquoi choisir Khalid Bijoux",
      features: [
        { title: "Design soigné", desc: "Des pièces modernes et intemporelles adaptées aux occasions du quotidien comme aux grandes célébrations." },
        { title: "Finition premium", desc: "Chaque bijou est présenté avec un grand soin pour une expérience élégante et rassurante." },
        { title: "Commande simple", desc: "Un parcours clair, mobile-friendly, avec paiement uniquement à la livraison." },
      ],
    },
    shop: {
      title: "Nos bijoux",
      subtitle: "Filtrez la collection et commandez rapidement vos pièces préférées.",
      search: "Rechercher un produit",
      all: "Tous",
      price: "Budget maximum",
      noResults: "Aucun produit ne correspond à votre recherche.",
      reset: "Réinitialiser",
      order: "Commander",
      details: "Détails",
    },
    product: {
      back: "Retour à la boutique",
      order: "Commander",
      contact: "Contacter la boutique",
      related: "Produits similaires",
      cod: "Paiement à la livraison",
      shipping: "Livraison rapide",
    },

    productList: {
      empty: "Aucun produit pour le moment.",
      stock: "Stock",
      add: "Ajouter",
      remove: "Retirer",
      edit: "Modifier",
      delete: "Supprimer",

      deleting: "Suppression...",

      updatedStock: "Stock mis à jour",

      stockError: "Impossible de mettre à jour le stock.",

      deleteTitle: "Supprimer le produit ?",

      deleteDescription: "Êtes-vous sûr de vouloir supprimer ce produit ?",

      irreversible: "Cette action est irréversible.",

      cancel: "Annuler",

      confirmDelete: "Supprimer",

      noCategory: "Sans catégorie",

      quantity: "Quantité",

      originalPrice: "Ancien prix",

      currentPrice: "Prix",

      stockUpdated: "Stock mis à jour avec succès",
    },


    cart: {
      title: "Votre panier",
      empty: "Votre panier est vide.",
      continue: "Continuer vos achats",
      orderSummary: "Résumé de commande",
      shippingAddress: "Adresse de livraison",
      customerName: "Nom complet",
      address: "Adresse",
      phone: "Téléphone",
      notes: "Notes",
      notesPlaceholder: "Ex: étage, heure souhaitée, repère...",
      confirm: "Confirmer la commande",
      success: "Commande enregistrée avec succès.",
      payment: "Paiement à la livraison",
      total: "Total",
      quantity: "Quantité",
      remove: "Supprimer",
    },
    contact: {
      title: "Contactez-nous",
      subtitle: "Nous sommes à votre disposition pour toute demande ou commande personnalisée.",
      formTitle: "Envoyer un message",
      name: "Nom complet",
      email: "Email",
      subject: "Sujet",
      message: "Message",
      send: "Envoyer",
    },
    about: {
      title: "L'univers Khalid Bijoux",
      subtitle: "Une maison qui mise sur la finesse, la confiance et l'élégance.",
      cards: [
        {
          title: "Élégance Intemporelle",
          desc: "Nos bijoux allient un design raffiné et des finitions soignées pour sublimer chaque instant de votre vie.",
        },
        {
          title: "Qualité Premium",
          desc: "Chaque pièce est sélectionnée avec le plus grand soin afin d'offrir une expérience élégante et durable.",
        },
        {
          title: "Pour Chaque Occasion",
          desc: "Des bijoux pensés pour célébrer les moments précieux, offrir un cadeau unique ou compléter votre style au quotidien.",
        },
      ],
    },
    gallery: {
      title: "Galerie",
      subtitle: "Quelques inspirations visuelles autour de nos créations.",
    },
    footer: {
      description: "Maison de bijoux au style moderne, pensée pour une expérience d'achat simple et élégante.",
      rights: "Tous droits réservés.",
    },
    loading: "Chargement",
    loadingDescription: "Préparation de la page, merci de patienter un instant.",
    admin: {
      loginTitle: "Connexion administrateur",
      username: "Identifiant",
      password: "Mot de passe",
      login: "Se connecter",
      products: "Produits",
      orders: "Commandes",
      addProduct: "Ajouter un produit",
      editProduct: "Modifier le produit",
      delete: "Supprimer",
      save: "Enregistrer",
      logout: "Se déconnecter",
      imagePreview: "Aperçu de l'image",
      selectCategory: "Sélectionner une catégorie",
      createCategory: "Créer une catégorie",
      newCategoryFr: "Français",
      newCategoryAr: "العربية",
      productNameFr: "Nom du produit (FR)",
      productNameAr: "اسم المنتج (AR)",
      descriptionFr: "Description (FR)",
      descriptionAr: "الوصف (AR)",
      priceMad: "Prix (MAD)",
      originalPrice: "Prix initial (opt.)",
      badge: "Badge (opt.)",
      dragDropImage: "Cliquez ou glissez une image",
      maxFileSize: "JPG, PNG ou WEBP • Max 2 MB",
      createBtn: "Créer",
      cancelBtn: "Annuler",




      dashboard: "Tableau de bord",
      stock: "Gestion du stock",
      settings: "Paramètres",

      dashboardTitle: "Dashboard Admin",

      totalProducts: "Produits",
      stockValue: "Valeur du stock",
      totalRevenue: "Revenu total",
      pendingOrders: "En attente",

      recentOrders: "Commandes récentes",
      viewAll: "Voir tout",

      statusPending: "En attente",
      statusConfirmed: "Confirmée",
      statusShipped: "Expédiée",
      statusDelivered: "Livrée",
      statusCancelled: "Annulée",

      stockOverview: "État du stock",
      productsCount: "produits",

      totalProductsLabel: "Produits total",
      availableProducts: "Disponibles",
      outOfStock: "Rupture",
      totalQuantity: "Quantité totale",

      stockAvailable: "En stock",
      lowStock: "Stock faible",
      outOfStockLabel: "Rupture",

      stockWarning: "Produits presque en rupture",

      units: "unités",

      noOrders: "Aucune commande pour le moment.",
      noLowStock: "Aucun produit à surveiller pour l'instant.",

      withoutCategory: "Sans catégorie",

      mad: "MAD",
      dh: "DH",

      stockByCategory: "Stock par catégorie",

      noCategories: "Aucune catégorie à afficher.",

      managementMode: "Mode gestion",

      realTimeStock: "Suivi du stock en temps réel",







      productAdded: "Produit ajouté avec succès ✨",
      productUpdated: "Produit modifié avec succès ✨",
      productDeleted: "Produit supprimé avec succès",

      saveError: "Impossible d'enregistrer ce produit.",
      deleteError: "Erreur lors de la suppression",



      stockQuantity: "Quantité en stock",

      saving: "Enregistrement...",

      saveProduct: "Enregistrer le produit",

      newProduct: "+ Nouveau produit",

      productNamePlaceholder:
        "Ex : Bague en or...",

      descriptionPlaceholder:
        "Décrivez le produit...",

      badgePlaceholder:
        "Ex : Nouveau, Promo...",




      category: "Catégorie",


      bothLanguagesRequired:
        "Les deux langues sont requises.",

      deleteCategory: "Supprimer la catégorie",

      deleteCategoryQuestion:
        "Supprimer cette catégorie ?",

      categoryUsed:
        "Impossible de supprimer. Cette catégorie contient {count} produit(s).",

      categoryUsedShort:
        "produit(s) utilisent cette catégorie.",

      confirmDeleteCategory:
        "Êtes-vous sûr de vouloir supprimer cette catégorie ?",

      categoryCreateError:
        "Erreur lors de la création de la catégorie.",

      categoryDeleteError:
        "Erreur lors de la suppression de la catégorie.",



      creating: "Création...",

      categoryContainsProducts:
        "Impossible de supprimer. Cette catégorie contient {count} produit(s).",


      categoryUsedByProducts:
        "Impossible de supprimer. {count} produit(s) utilisent cette catégorie.",


      // Settings
      profileTitle: "Profil administrateur",
      profileDescription: "Informations du compte connecté.",
      adminRole: "Administrateur",
      changePasswordTitle: "Changer le mot de passe",
      currentPassword: "Mot de passe actuel",
      newPassword: "Nouveau mot de passe",
      confirmNewPassword: "Confirmer le nouveau mot de passe",
      updatePassword: "Mettre à jour",
      fillAllFields: "Veuillez remplir tous les champs",
      passwordsDontMatch: "Les mots de passe ne correspondent pas",
      passwordChangeError: "Erreur lors du changement de mot de passe",
      passwordChangeSuccess: "Mot de passe modifié avec succès",
      genericError: "Erreur",
      languageTitle: "Langue",
      languageDescription: "Langue d'affichage du back-office.",
      logoutTitle: "Déconnexion",

      // Orders
      allStatuses: "Toutes",
      noOrdersInCategory: "Aucune commande dans cette catégorie.",
      call: "Appeler",
      cancelling: "Annulation...",
      customerLabel: "Client",
      shippingLabel: "Livraison",
      quantityLabel: "Quantité",
      sizeLabel: "Taille",
      subtotal: "Sous-total",
      tax: "Taxe",
      totalAmount: "Montant total",
      productFallback: "Produit",
      orderStatusUpdated: "Statut de la commande mis à jour ✓",
      orderCancelled: "Commande annulée ✓",
      statusUpdateError: "Erreur lors de la mise à jour du statut",
      orderCancelError: "Erreur lors de l'annulation",

      // Stock page
      stockUpdateFailed: "Erreur lors de la mise à jour du stock",
      updateError: "Erreur lors de la mise à jour",
      stockSavedSuccess: "Stock mis à jour avec succès",


      imageLabel: "Image",
      nameLabel: "Nom",
      categoryLabel: "Catégorie",
      priceLabel: "Prix",
      statusLabel: "Statut",
      actionsLabel: "Actions",
      editStock: "Modifier le stock",
      noProductsToShow: "Aucun produit à afficher.",
      recentHistory: "Historique récent (session)",
      noHistoryYet: "Aucune modification effectuée pour l'instant.",
      editStockTitle: "Modifier le stock",
      close: "Fermer",


      productImageAlt: "Aperçu de l'image du produit",


      errors: {
        INVALID_CREDENTIALS: "Identifiants incorrects",

        INVALID_PRODUCT_PAYLOAD:
          "Veuillez remplir tous les champs requis (nom et description dans les deux langues).",

        CATEGORY_REQUIRED:
          "Veuillez sélectionner une catégorie avant d'enregistrer.",

        CATEGORY_NOT_FOUND:
          "La catégorie sélectionnée n'existe plus.",

        IMAGE_REQUIRED:
          "Veuillez ajouter une image au produit.",

        INVALID_FILE_TYPE:
          "Format d'image invalide (JPG, PNG ou WEBP).",

        FILE_TOO_LARGE:
          "L'image dépasse la taille maximale de 2 MB.",

        PRODUCT_CREATE_FAILED:
          "Erreur lors de la création du produit.",

        PRODUCT_UPDATE_FAILED:
          "Erreur lors de la modification du produit.",

        PRODUCT_SAVE_FAILED:
          "Impossible d'enregistrer le produit.",

        PRODUCT_DELETE_FAILED:
          "Erreur lors de la suppression du produit.",
      },
    },
    errors: {
      "INVALID_CREDENTIALS": "Identifiants incorrects"
    }


  },
  ar: {
    brandName: "خالد بيجو",
    tagline: "مجوهرات أنيقة لكل لحظة مميزة.",
    openMenu: "فتح القائمة",
    closeMenu: "إغلاق القائمة",
    nav: {
      home: "الرئيسية",
      shop: "المتجر",
      about: "من نحن",
      gallery: "المعرض",
      contact: "اتصل بنا",
      admin: "الإدارة",
      cart: "السلة",
    },
    home: {
      kicker: "مجموعة 2026",
      title: "أناقة تبقى في الذاكرة",
      subtitle: "اكتشفوا مجوهرات راقية مصممة للهدايا والاحتفالات واللحظات الخاصة.",
      ctaPrimary: "عرض المجموعة",
      ctaSecondary: "اطلب الآن",
      sectionTitle: "منتجات مميزة",
      featuresTitle: "لماذا خالد بيجو",
      features: [
        { title: "تصميم راقٍ", desc: "قطع عصرية وخالدة تناسب الاستعمال اليومي والمناسبات الكبيرة." },
        { title: "جودة ممتازة", desc: "كل قطعة معروضة بعناية لتجربة شراء أنيقة ومطمئنة." },
        { title: "طلب سهل", desc: "مسار واضح ومتوافق مع الهاتف والدفع فقط عند الاستلام." },
      ],
    },
    shop: {
      title: "مجوهراتنا",
      subtitle: "يمكنكم تصفية المجموعة وطلب القطع المفضلة بسرعة.",
      search: "ابحث عن منتج",
      all: "الكل",
      price: "الميزانية القصوى",
      noResults: "لا توجد منتجات مطابقة.",
      reset: "إعادة التعيين",
      order: "اطلب",
      details: "التفاصيل",
    },
    product: {
      back: "العودة إلى المتجر",
      order: "اطلب الآن",
      contact: "تواصل مع المتجر",
      related: "منتجات مشابهة",
      cod: "الدفع عند الاستلام",
      shipping: "توصيل سريع",
    },

    productList: {
      empty: "لا يوجد أي منتج.",

      stock: "المخزون",

      add: "إضافة",

      remove: "سحب",

      edit: "تعديل",

      delete: "حذف",

      deleting: "جارٍ الحذف...",

      updatedStock: "تم تحديث المخزون",

      stockError: "تعذر تحديث المخزون.",

      deleteTitle: "حذف المنتج؟",

      deleteDescription: "هل تريد حذف هذا المنتج؟",

      irreversible: "لا يمكن التراجع عن هذه العملية.",

      cancel: "إلغاء",

      confirmDelete: "حذف",

      noCategory: "بدون فئة",

      quantity: "الكمية",

      originalPrice: "السعر القديم",

      currentPrice: "السعر",

      stockUpdated: "تم تحديث المخزون بنجاح",
    },

    cart: {
      title: "سلة المشتريات",
      empty: "السلة فارغة.",
      continue: "متابعة التسوق",
      orderSummary: "ملخص الطلب",
      shippingAddress: "عنوان التوصيل",
      customerName: "الاسم الكامل",
      address: "العنوان",
      phone: "رقم الهاتف",
      notes: "ملاحظات",
      notesPlaceholder: "مثال: الطابق، الوقت المناسب، معلم قريب...",
      confirm: "تأكيد الطلب",
      success: "تم تسجيل الطلب بنجاح.",
      payment: "الدفع عند الاستلام",
      total: "المجموع",
      quantity: "الكمية",
      remove: "حذف",
    },
    contact: {
      title: "تواصلوا معنا",
      subtitle: "نحن في خدمتكم لأي استفسار أو طلب خاص.",
      formTitle: "أرسل رسالة",
      name: "الاسم الكامل",
      email: "البريد الإلكتروني",
      subject: "الموضوع",
      message: "الرسالة",
      send: "إرسال",
    },
    about: {
      title: "عالم خالد بيجو",
      subtitle: "علامة تجمع بين الأناقة، الجودة، والاهتمام بأدق التفاصيل.",
      cards: [
        {
          title: "أناقة خالدة",
          desc: "تم تصميم مجوهراتنا لتجمع بين الفخامة والعصرية، لترافقكم في جميع المناسبات.",
        },
        {
          title: "جودة متميزة",
          desc: "نختار كل قطعة بعناية فائقة لنقدم لكم مجوهرات راقية بتشطيبات عالية الجودة.",
        },
        {
          title: "لكل مناسبة",
          desc: "سواء كانت هدية مميزة أو لمسة أنيقة لإطلالتكم اليومية، ستجدون ما يناسبكم في مجموعاتنا.",
        },
      ],
    },
    gallery: {
      title: "المعرض",
      subtitle: "إلهام بصري حول تصاميمنا.",
    },
    footer: {
      description: "دار مجوهرات بطابع عصري وتجربة شراء بسيطة وأنيقة.",
      rights: "جميع الحقوق محفوظة.",
    },
    loading: "جاري التحميل",
    loadingDescription: "نجهز الصفحة الآن، نقدر صبركم للحظة.",
    admin: {
      loginTitle: "تسجيل دخول الإدارة",
      username: "اسم المستخدم",
      password: "كلمة المرور",
      login: "دخول",
      products: "المنتجات",
      orders: "الطلبات",
      addProduct: "إضافة منتج",
      editProduct: "تعديل المنتج",
      delete: "حذف",
      save: "حفظ",
      logout: "تسجيل الخروج",
      noOrders: "لا توجد طلبات حالياً.",
      imagePreview: "معاينة الصورة",
      selectCategory: "اختر فئة",
      createCategory: "إنشاء فئة جديدة",
      newCategoryFr: "Français",
      newCategoryAr: "العربية",
      productNameFr: "اسم المنتج (FR)",
      productNameAr: "اسم المنتج (AR)",
      descriptionFr: "الوصف (FR)",
      descriptionAr: "الوصف (AR)",
      priceMad: "السعر (درهم)",
      originalPrice: "السعر الأصلي (اختياري)",
      badge: "الشارة (اختياري)",
      dragDropImage: "انقر أو اسحب صورة",
      maxFileSize: "JPG أو PNG أو WEBP • أقصى 2 MB",
      createBtn: "إنشاء",
      cancelBtn: "إلغاء",

      dashboard: "لوحة التحكم",

      stock: "إدارة المخزون",

      settings: "الإعدادات",

      dashboardTitle: "لوحة تحكم الإدارة",

      totalProducts: "المنتجات",

      stockValue: "قيمة المخزون",

      totalRevenue: "إجمالي الإيرادات",

      pendingOrders: "قيد الانتظار",

      recentOrders: "آخر الطلبات",

      viewAll: "عرض الكل",

      statusPending: "قيد الانتظار",
      statusConfirmed: "تم تأكيد الطلب",
      statusShipped: "تم شحن الطلب",
      statusDelivered: "تم تسليم الطلب",
      statusCancelled: "تم إلغاء الطلب",

      stockOverview: "حالة المخزون",

      productsCount: "منتج",

      totalProductsLabel: "إجمالي المنتجات",

      availableProducts: "المتوفرة",

      outOfStock: "نفد المخزون",

      totalQuantity: "إجمالي الكمية",

      stockAvailable: "متوفر",

      lowStock: "مخزون منخفض",

      outOfStockLabel: "نفد المخزون",

      stockWarning: "منتجات قاربت على النفاد",

      units: "وحدة",


      noLowStock: "لا توجد منتجات تحتاج إلى مراقبة حالياً.",

      withoutCategory: "بدون فئة",

      mad: "درهم",

      dh: "درهم",


      stockByCategory: "المخزون حسب الفئة",

      noCategories: "لا توجد فئات لعرضها.",


      managementMode: "وضع الإدارة",

      realTimeStock: "متابعة المخزون في الوقت الحقيقي",
      productAdded: "تمت إضافة المنتج بنجاح ✨",
      productUpdated: "تم تعديل المنتج بنجاح ✨",
      productDeleted: "تم حذف المنتج بنجاح",

      saveError: "تعذر حفظ المنتج.",

      deleteError: "حدث خطأ أثناء حذف المنتج.",



      stockQuantity: "الكمية في المخزون",

      saving: "جارٍ الحفظ...",

      saveProduct: "حفظ المنتج",

      newProduct: "+ منتج جديد",

      productNamePlaceholder:
        "مثال: خاتم ذهبي...",

      descriptionPlaceholder:
        "وصف المنتج...",

      badgePlaceholder:
        "مثال: جديد، تخفيض...",


      category: "الفئة",



      bothLanguagesRequired:
        "يجب إدخال الاسم باللغتين.",


      deleteCategory: "حذف الفئة",

      deleteCategoryQuestion:
        "هل تريد حذف هذه الفئة؟",

      categoryUsed:
        "لا يمكن حذف هذه الفئة لأنها تحتوي على {count} منتج.",

      categoryUsedShort:
        "منتج يستخدم هذه الفئة.",

      confirmDeleteCategory:
        "هل أنت متأكد من حذف هذه الفئة؟",

      categoryCreateError:
        "حدث خطأ أثناء إنشاء الفئة.",

      categoryDeleteError:
        "حدث خطأ أثناء حذف الفئة.",

      creating: "جارٍ الإنشاء...",


      categoryContainsProducts:
        "لا يمكن حذف هذه الفئة لأنها تحتوي على {count} منتج.",


      categoryUsedByProducts:
        "لا يمكن حذف هذه الفئة لأن {count} منتج يستخدمها.",





      // Settings
      profileTitle: "الملف الشخصي للمسؤول",
      profileDescription: "معلومات الحساب المسجل الدخول.",
      adminRole: "مسؤول",
      changePasswordTitle: "تغيير كلمة المرور",
      currentPassword: "كلمة المرور الحالية",
      newPassword: "كلمة المرور الجديدة",
      confirmNewPassword: "تأكيد كلمة المرور الجديدة",
      updatePassword: "تحديث",
      fillAllFields: "يرجى ملء جميع الحقول",
      passwordsDontMatch: "كلمتا المرور غير متطابقتين",
      passwordChangeError: "حدث خطأ أثناء تغيير كلمة المرور",
      passwordChangeSuccess: "تم تغيير كلمة المرور بنجاح",
      genericError: "خطأ",
      languageTitle: "اللغة",
      languageDescription: "لغة عرض لوحة التحكم.",
      logoutTitle: "تسجيل الخروج",

      // Orders
      allStatuses: "الكل",
      noOrdersInCategory: "لا توجد طلبات في هذه الفئة.",
      call: "اتصال",
      cancelling: "جارٍ الإلغاء...",
      customerLabel: "الزبون",
      shippingLabel: "التوصيل",
      quantityLabel: "الكمية",
      sizeLabel: "المقاس",
      subtotal: "المجموع الفرعي",
      tax: "الضريبة",
      totalAmount: "المبلغ الإجمالي",
      productFallback: "منتج",
      orderStatusUpdated: "تم تحديث حالة الطلب ✓",
      orderCancelled: "تم إلغاء الطلب ✓",
      statusUpdateError: "حدث خطأ أثناء تحديث الحالة",
      orderCancelError: "حدث خطأ أثناء الإلغاء",

      // Stock page
      stockUpdateFailed: "حدث خطأ أثناء تحديث المخزون",
      updateError: "حدث خطأ أثناء التحديث",
      stockSavedSuccess: "تم تحديث المخزون بنجاح",



      imageLabel: "الصورة",
      nameLabel: "الاسم",
      categoryLabel: "الفئة",
      priceLabel: "السعر",
      statusLabel: "الحالة",
      actionsLabel: "الإجراءات",
      editStock: "تعديل المخزون",
      noProductsToShow: "لا يوجد منتج لعرضه.",
      recentHistory: "السجل الأخير (الجلسة)",
      noHistoryYet: "لم يتم إجراء أي تعديل حتى الآن.",
      editStockTitle: "تعديل المخزون",
      close: "إغلاق",

      productImageAlt: "معاينة صورة المنتج",


      errors: {
        INVALID_CREDENTIALS: "بيانات تسجيل الدخول غير صحيحة",

        INVALID_PRODUCT_PAYLOAD:
          "يرجى ملء جميع الحقول المطلوبة باللغتين.",

        CATEGORY_REQUIRED:
          "يرجى اختيار فئة قبل الحفظ.",

        CATEGORY_NOT_FOUND:
          "الفئة المحددة غير موجودة.",

        IMAGE_REQUIRED:
          "يرجى إضافة صورة للمنتج.",

        INVALID_FILE_TYPE:
          "صيغة الصورة غير مدعومة.",

        FILE_TOO_LARGE:
          "حجم الصورة يتجاوز 2 ميغابايت.",

        PRODUCT_CREATE_FAILED:
          "حدث خطأ أثناء إنشاء المنتج.",

        PRODUCT_UPDATE_FAILED:
          "حدث خطأ أثناء تعديل المنتج.",

        PRODUCT_SAVE_FAILED:
          "تعذر حفظ المنتج.",

        PRODUCT_DELETE_FAILED:
          "حدث خطأ أثناء حذف المنتج.",
      },

    },
    errors: {
      INVALID_CREDENTIALS: "بيانات تسجيل الدخول غير صحيحة"
    }
  },
} as const
