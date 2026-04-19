import { Language } from "./i18n";

export const errorMessages: Record<Language, Record<string, string>> = {
  fr: {
    INVALID_CREDENTIALS: "Email ou mot de passe incorrect",
    MISSING_FIELDS: "Veuillez remplir tous les champs",
    NETWORK_ERROR: "Erreur réseau. Veuillez vérifier votre connexion",
    INTERNAL_SERVER_ERROR: "Une erreur serveur est survenue",
    VALIDATION_ERROR: "Veuillez vérifier vos données",
    PRODUCT_NOT_FOUND: "Produit non trouvé",
    UNAUTHORIZED: "Vous n'êtes pas autorisé à accéder à cette ressource",
    FORBIDDEN: "Accès refusé",
    NOT_FOUND: "Ressource non trouvée",
    SESSION_EXPIRED: "Votre session a expiré, veuillez vous reconnecter",
    AUTHENTICATION_FAILED: "Authentification échouée",
    LOGOUT_FAILED: "Erreur lors de la déconnexion",
    HTTP_ERROR: "Une erreur HTTP est survenue",
  },
  ar: {
    INVALID_CREDENTIALS: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
    MISSING_FIELDS: "يرجى ملء جميع الحقول",
    NETWORK_ERROR: "خطأ في الشبكة. يرجى التحقق من اتصالك",
    INTERNAL_SERVER_ERROR: "حدث خطأ في الخادم",
    VALIDATION_ERROR: "يرجى التحقق من بيانات الإدخال",
    PRODUCT_NOT_FOUND: "المنتج غير موجود",
    UNAUTHORIZED: "أنت غير مخول للوصول إلى هذا المورد",
    FORBIDDEN: "الوصول مرفوض",
    NOT_FOUND: "المورد غير موجود",
    SESSION_EXPIRED: "انتهت صلاحية جلستك، يرجى تسجيل الدخول مرة أخرى",
    AUTHENTICATION_FAILED: "فشل المصادقة",
    LOGOUT_FAILED: "خطأ في تسجيل الخروج",
    HTTP_ERROR: "حدث خطأ HTTP",
  },
};

export function getErrorMessage(
  errorCode: string,
  language: Language = "fr"
): string {
  return (
    errorMessages[language]?.[errorCode] ||
    errorMessages.fr[errorCode] ||
    "Une erreur est survenue"
  );
}

export function translateErrorCode(
  errorCode: string,
  language: Language
): { code: string; message: string } {
  return {
    code: errorCode,
    message: getErrorMessage(errorCode, language),
  };
}
