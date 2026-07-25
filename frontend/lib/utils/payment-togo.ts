/**
 * Utilitaire de validation et de formatage des numéros Mobile Money au Togo
 * T-Money (Togo Cellulaire) : 90, 91, 92, 93, 70
 * Flooz (Moov Togo) : 96, 97, 98, 99
 */

export interface MobileMoneyValidation {
  isValid: boolean;
  provider: "TMONEY" | "FLOOZ" | "UNKNOWN";
  formattedNumber: string;
  error?: string;
}

export function validateTogoPhoneNumber(phone: string): MobileMoneyValidation {
  // Nettoyer les espaces, tirets et le préfixe +228 ou 00228
  let cleaned = phone.replace(/[\s\-\(\)]/g, "");

  if (cleaned.startsWith("+228")) {
    cleaned = cleaned.substring(4);
  } else if (cleaned.startsWith("00228")) {
    cleaned = cleaned.substring(5);
  } else if (cleaned.startsWith("228")) {
    cleaned = cleaned.substring(3);
  }

  // Vérifier la longueur (8 chiffres au Togo)
  if (!/^\d{8}$/.test(cleaned)) {
    return {
      isValid: false,
      provider: "UNKNOWN",
      formattedNumber: phone,
      error: "Le numéro doit comporter 8 chiffres (ex: 90 12 34 56).",
    };
  }

  const prefix = cleaned.substring(0, 2);

  let provider: "TMONEY" | "FLOOZ" | "UNKNOWN" = "UNKNOWN";

  if (["90", "91", "92", "93", "70"].includes(prefix)) {
    provider = "TMONEY";
  } else if (["96", "97", "98", "99"].includes(prefix)) {
    provider = "FLOOZ";
  }

  if (provider === "UNKNOWN") {
    return {
      isValid: false,
      provider: "UNKNOWN",
      formattedNumber: `+228 ${cleaned.substring(0, 2)} ${cleaned.substring(2, 4)} ${cleaned.substring(4, 6)} ${cleaned.substring(6, 8)}`,
      error: "Numéro non reconnu par T-Money ou Flooz Togo.",
    };
  }

  const formattedNumber = `+228 ${cleaned.substring(0, 2)} ${cleaned.substring(2, 4)} ${cleaned.substring(4, 6)} ${cleaned.substring(6, 8)}`;

  return {
    isValid: true,
    provider,
    formattedNumber,
  };
}
