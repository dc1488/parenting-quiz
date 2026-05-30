/**
 * localStorage utilities for Parenting 360 Quiz
 * Handles saving/loading quiz progress, results, registration, and commitments
 */

const STORAGE_KEYS = {
  ANSWERS: "parenting360_answers",
  RESULT: "parenting360_result",
  COMMITMENT: "parenting360_commitment",
  CURRENT_QUESTION: "parenting360_current_question",
  REGISTRATION: "parenting360_registration",
} as const;

export interface RegistrationData {
  name: string;
  email: string;
  phone: string;
}

/**
 * Save quiz answers to localStorage
 */
export function saveAnswers(answers: Record<number, number>): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(answers));
}

/**
 * Load quiz answers from localStorage
 */
export function loadAnswers(): Record<number, number> {
  if (typeof window === "undefined") return {};
  const stored = localStorage.getItem(STORAGE_KEYS.ANSWERS);
  if (!stored) return {};
  try {
    return JSON.parse(stored);
  } catch {
    return {};
  }
}

/**
 * Save current question index to localStorage
 */
export function saveCurrentQuestion(index: number): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.CURRENT_QUESTION, String(index));
}

/**
 * Load current question index from localStorage
 */
export function loadCurrentQuestion(): number {
  if (typeof window === "undefined") return 0;
  const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_QUESTION);
  if (!stored) return 0;
  return parseInt(stored, 10) || 0;
}

/**
 * Save quiz result to localStorage
 */
export function saveResult(result: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.RESULT, JSON.stringify(result));
}

/**
 * Load quiz result from localStorage
 */
export function loadResult(): Record<string, unknown> | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(STORAGE_KEYS.RESULT);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

/**
 * Save registration data to localStorage
 */
export function saveRegistration(data: RegistrationData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.REGISTRATION, JSON.stringify(data));
}

/**
 * Load registration data from localStorage
 */
export function loadRegistration(): RegistrationData | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(STORAGE_KEYS.REGISTRATION);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

/**
 * Save commitment text to localStorage
 */
export function saveCommitment(commitment: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.COMMITMENT, commitment);
}

/**
 * Load commitment text from localStorage
 */
export function loadCommitment(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(STORAGE_KEYS.COMMITMENT) || "";
}

/**
 * Reset all quiz data from localStorage
 */
export function resetAllData(): void {
  if (typeof window === "undefined") return;
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
}

/**
 * Check if there's saved quiz progress
 */
export function hasSavedProgress(): boolean {
  if (typeof window === "undefined") return false;
  const answers = localStorage.getItem(STORAGE_KEYS.ANSWERS);
  if (!answers) return false;
  try {
    const parsed = JSON.parse(answers);
    return Object.keys(parsed).length > 0;
  } catch {
    return false;
  }
}

/**
 * Check if user has registered
 */
export function hasRegistered(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem(STORAGE_KEYS.REGISTRATION);
}
