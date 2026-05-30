/**
 * Quiz data definitions for Parenting 360 Quiz
 * Contains all questions, categories, scoring logic, and interpretations
 */

// Category definitions
export const CATEGORIES = {
  self: "Self Awareness",
  child: "Child Awareness",
  parenting: "Parenting Awareness",
} as const;

export type CategoryKey = keyof typeof CATEGORIES;

export interface Question {
  id: number;
  category: CategoryKey;
  text: string;
}

export interface CategoryScore {
  category: CategoryKey;
  label: string;
  score: number;
  maxScore: number;
  level: "high" | "growing" | "low";
  interpretation: string;
}

export interface QuizResult {
  scores: CategoryScore[];
  lowestCategory: CategoryKey;
  lowestLabel: string;
  focusRecommendation: string;
  completedAt: string;
}

// All 30 quiz questions
export const QUESTIONS: Question[] = [
  // Category 1: Self Awareness (1-10)
  { id: 1, category: "self", text: "Saya menyadari emosi saya saat berinteraksi dengan anak." },
  { id: 2, category: "self", text: "Saya tahu apa yang biasanya memicu emosi saya." },
  { id: 3, category: "self", text: "Saya mampu menahan reaksi sebelum merespon anak." },
  { id: 4, category: "self", text: "Saya menyadari kondisi mental saya saat mengasuh." },
  { id: 5, category: "self", text: "Saya bisa membedakan antara emosi saya dan kebutuhan anak." },
  { id: 6, category: "self", text: "Saya menyadari pola kebiasaan saya sebagai orang tua." },
  { id: 7, category: "self", text: "Saya terbuka untuk berubah menjadi orang tua yang lebih baik." },
  { id: 8, category: "self", text: "Saya merefleksikan tindakan saya sebagai orang tua." },
  { id: 9, category: "self", text: "Saya tidak selalu merasa harus benar di depan anak." },
  { id: 10, category: "self", text: "Saya menyadari bahwa saya juga masih dalam proses belajar." },

  // Category 2: Child Awareness (11-20)
  { id: 11, category: "child", text: "Saya memahami kebutuhan emosional anak saya." },
  { id: 12, category: "child", text: "Saya mengenali perubahan emosi anak saya." },
  { id: 13, category: "child", text: "Saya meluangkan waktu untuk mendengarkan anak." },
  { id: 14, category: "child", text: "Saya memahami karakter unik anak saya." },
  { id: 15, category: "child", text: "Saya tidak membandingkan anak saya dengan anak lain." },
  { id: 16, category: "child", text: "Saya memahami apa yang membuat anak saya bahagia." },
  { id: 17, category: "child", text: "Saya peka terhadap kondisi mental anak saya." },
  { id: 18, category: "child", text: "Saya memberi ruang anak untuk mengekspresikan diri." },
  { id: 19, category: "child", text: "Saya berusaha memahami perspektif anak." },
  { id: 20, category: "child", text: "Saya tahu apa yang sedang anak saya butuhkan saat ini." },

  // Category 3: Parenting Awareness (21-30)
  { id: 21, category: "parenting", text: "Saya menyadari pola pengasuhan yang saya gunakan." },
  { id: 22, category: "parenting", text: "Saya tahu dari mana pola pengasuhan saya berasal." },
  { id: 23, category: "parenting", text: "Saya terbuka untuk memperbaiki cara mengasuh." },
  { id: 24, category: "parenting", text: "Saya tidak mengasuh hanya berdasarkan kebiasaan lama." },
  { id: 25, category: "parenting", text: "Saya menyadari dampak pola asuh saya terhadap anak." },
  { id: 26, category: "parenting", text: "Saya konsisten dalam menerapkan aturan." },
  { id: 27, category: "parenting", text: "Saya tidak hanya fokus pada hasil, tapi juga proses anak." },
  { id: 28, category: "parenting", text: "Saya memberikan contoh, bukan hanya perintah." },
  { id: 29, category: "parenting", text: "Saya mengasuh dengan kesadaran, bukan hanya reaksi." },
  { id: 30, category: "parenting", text: "Saya mengevaluasi cara saya mengasuh secara berkala." },
];

// Likert scale labels
export const LIKERT_LABELS: Record<number, string> = {
  1: "Sangat Tidak Setuju",
  2: "Tidak Setuju",
  3: "Netral",
  4: "Setuju",
  5: "Sangat Setuju",
};

// Category descriptions for display
export const CATEGORY_DESCRIPTIONS: Record<CategoryKey, string> = {
  self: "Seberapa baik Anda mengenali dan memahami diri sendiri sebagai orang tua",
  child: "Seberapa dalam Anda memahami kebutuhan dan perasaan anak",
  parenting: "Seberapa sadar Anda terhadap pola dan cara pengasuhan Anda",
};

// Category icons (emoji for simplicity)
export const CATEGORY_ICONS: Record<CategoryKey, string> = {
  self: "🪞",
  child: "👶",
  parenting: "🏡",
};

/**
 * Calculate the level and interpretation for a score
 */
function getLevel(score: number): "high" | "growing" | "low" {
  if (score >= 40) return "high";
  if (score >= 25) return "growing";
  return "low";
}

/**
 * Get interpretation text for a category level
 */
function getInterpretation(category: CategoryKey, level: "high" | "growing" | "low"): string {
  const interpretations: Record<CategoryKey, Record<string, string>> = {
    self: {
      high: "Sudah cukup sadar terhadap diri sendiri sebagai orang tua. Anda mampu mengenali emosi, memahami pemicu, dan merefleksikan tindakan. Tinggal memperkuat konsistensi.",
      growing: "Sudah mulai sadar terhadap diri sendiri, tapi belum stabil. Ada momen refleksi, namun juga masih banyak reaksi otomatis. Perlu refleksi lebih dalam dan latihan.",
      low: "Masih banyak reaksi otomatis yang muncul tanpa disadari. Perlu pembelajaran tentang regulasi emosi dan kesadaran diri.",
    },
    child: {
      high: "Sudah cukup memahami kebutuhan dan perasaan anak. Anda mendengarkan dan peka terhadap kondisi anak. Tinggal memperkuat konsistensi.",
      growing: "Sudah mulai memahami anak, tapi belum konsisten. Ada upaya mendengarkan, namun belum sepenuhnya peka. Perlu lebih banyak empati dan mendengar dalam.",
      low: "Belum cukup memahami kebutuhan dan perasaan anak. Perlu belajar mendengarkan secara aktif dan mengenali emosi anak.",
    },
    parenting: {
      high: "Sudah cukup sadar terhadap pola pengasuhan yang digunakan. Anda mengasuh dengan kesadaran dan evaluasi. Tinggal memperkuat konsistensi.",
      growing: "Sudah mulai sadar terhadap pola pengasuhan, tapi belum stabil. Ada upaya memperbaiki, namun masih terjebak kebiasaan lama. Perlu evaluasi lebih berkala.",
      low: "Masih banyak mengasuh berdasarkan kebiasaan lama dan reaksi otomatis. Perlu pembelajaran tentang conscious parenting.",
    },
  };

  return interpretations[category][level];
}

/**
 * Get focus recommendation based on lowest category
 */
function getFocusRecommendation(category: CategoryKey): string {
  const recommendations: Record<CategoryKey, string> = {
    self: "Fokus utama: Regulasi emosi & refleksi diri\n\nLuangkan waktu setiap hari untuk merefleksikan emosi dan reaksi Anda sebagai orang tua. Belajar mengenali pemicu emosi dan berlatih menahan reaksi sebelum merespon. Ingat, kesadaran diri adalah fondasi pengasuhan yang baik.",
    child: "Fokus utama: Empati & mendengar dalam\n\nLatih diri Anda untuk benar-benar mendengarkan tanpa menghakimi. Perhatikan ekspresi wajah, nada suara, dan bahasa tubuh anak. Tanyakan perasaan mereka dan beri ruang untuk mengekspresikan diri tanpa takut dinilai.",
    parenting: "Fokus utama: Conscious parenting & evaluasi pola asuh\n\nEvaluasi pola pengasuhan yang Anda gunakan dan dari mana pola tersebut berasal. Apakah Anda mengasuh berdasarkan kebiasaan atau kesadaran? Berlatihlah untuk lebih konsisten dan beri contoh, bukan hanya perintah.",
  };

  return recommendations[category];
}

/**
 * Calculate quiz results from answers
 */
export function calculateResults(answers: Record<number, number>): QuizResult {
  const categoryKeys: CategoryKey[] = ["self", "child", "parenting"];

  const scores: CategoryScore[] = categoryKeys.map((cat) => {
    const categoryQuestions = QUESTIONS.filter((q) => q.category === cat);
    const score = categoryQuestions.reduce((sum, q) => sum + (answers[q.id] || 0), 0);
    const level = getLevel(score);

    return {
      category: cat,
      label: CATEGORIES[cat],
      score,
      maxScore: 50,
      level,
      interpretation: getInterpretation(cat, level),
    };
  });

  // Find the lowest scoring category
  const lowest = scores.reduce((min, s) => (s.score < min.score ? s : min), scores[0]);

  return {
    scores,
    lowestCategory: lowest.category,
    lowestLabel: CATEGORIES[lowest.category],
    focusRecommendation: getFocusRecommendation(lowest.category),
    completedAt: new Date().toISOString(),
  };
}

/**
 * Get the level label in Indonesian
 */
export function getLevelLabel(level: "high" | "growing" | "low"): string {
  const labels = {
    high: "High Awareness 🌟",
    growing: "Growing Awareness 🌱",
    low: "Low Awareness 💭",
  };
  return labels[level];
}

/**
 * Get the level color class
 */
export function getLevelColor(level: "high" | "growing" | "low"): string {
  const colors = {
    high: "text-emerald-700 bg-emerald-50 border-emerald-200",
    growing: "text-amber-700 bg-amber-50 border-amber-200",
    low: "text-orange-700 bg-orange-50 border-orange-200",
  };
  return colors[level];
}
